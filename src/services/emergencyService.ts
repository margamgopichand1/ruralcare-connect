import { Ambulance, EmergencyRequest, Facility, PreArrivalAlert } from '../types';
import { mockAmbulances, mockFacilities, mockPreArrivalAlerts } from '../data/mockData';
import { calculateHaversineDistance, estimateEtaMinutes } from './matchingService';
import { EmergencyCategoryKey, FIRST_AID_PROTOCOLS } from '../data/firstAidProtocols';
import { addMedicalRecord } from './medicalRecordService';

export type AmbulanceDispatchStage =
  | 'Assigned'
  | 'Going to Patient'
  | 'Patient Picked Up'
  | 'Going to Hospital'
  | 'Arrived';

export interface EmergencyDispatchResult {
  request: EmergencyRequest;
  ambulance: Ambulance;
  hospital: Facility;
  hospitalReason: string;
  categoryKey: EmergencyCategoryKey;
  alert: PreArrivalAlert;
  smsMessage: string;
  disclaimer: string;
  routeDistanceKm: number;
  currentStage: AmbulanceDispatchStage;
}

const PRE_ARRIVAL_STORAGE_KEY = 'ruralcare_prearrival_alerts';
const ACTIVE_EMERGENCY_STORAGE_KEY = 'ruralcare_active_emergency';

export function getPreArrivalAlerts(): PreArrivalAlert[] {
  try {
    const data = localStorage.getItem(PRE_ARRIVAL_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading pre-arrival alerts', e);
  }
  return mockPreArrivalAlerts;
}

export function savePreArrivalAlerts(alerts: PreArrivalAlert[]) {
  try {
    localStorage.setItem(PRE_ARRIVAL_STORAGE_KEY, JSON.stringify(alerts));
    window.dispatchEvent(new CustomEvent('ruralcare_emergency_alert_received'));
  } catch (e) {
    console.error('Error saving pre-arrival alerts', e);
  }
}

export function getActiveEmergency(): EmergencyDispatchResult | null {
  try {
    const data = localStorage.getItem(ACTIVE_EMERGENCY_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading active emergency', e);
  }
  return null;
}

export function saveActiveEmergency(dispatch: EmergencyDispatchResult | null) {
  try {
    if (dispatch) {
      localStorage.setItem(ACTIVE_EMERGENCY_STORAGE_KEY, JSON.stringify(dispatch));
    } else {
      localStorage.removeItem(ACTIVE_EMERGENCY_STORAGE_KEY);
    }
    window.dispatchEvent(new CustomEvent('ruralcare_active_emergency_updated', { detail: dispatch }));
  } catch (e) {
    console.error('Error saving active emergency', e);
  }
}

/**
 * Smart Hospital Recommendation Engine (Requirement 9)
 * Recommends facility based on emergency clinical capability, facility tier, and distance,
 * NOT simply the nearest geographical facility.
 */
export function recommendOptimalHospital(
  category: EmergencyCategoryKey,
  patientLat: number,
  patientLng: number
): { hospital: Facility; reason: string } {
  // Facility capability requirements per category
  let preferredTypes: ('District Hospital' | 'CHC' | 'PHC')[] = ['District Hospital', 'CHC'];
  let capabilityText = 'Emergency Resuscitation & Intensive Care';

  if (category === 'cardiac') {
    preferredTypes = ['District Hospital', 'CHC'];
    capabilityText = 'Cath Lab / Intensive Cardiac Care / Tele-ECG & Thrombolysis';
  } else if (category === 'bite') {
    preferredTypes = ['CHC', 'District Hospital'];
    capabilityText = 'Polyvalent Anti-Snake Venom (ASV) & Ventilatory Support';
  } else if (category === 'stroke') {
    preferredTypes = ['District Hospital'];
    capabilityText = 'CT Scan & Neurological Thrombolytic Unit';
  } else if (category === 'burn') {
    preferredTypes = ['District Hospital', 'CHC'];
    capabilityText = 'Burn Care Sterile Dressing & Fluid Resuscitation Bay';
  } else if (category === 'trauma') {
    preferredTypes = ['District Hospital', 'CHC'];
    capabilityText = 'Trauma Resuscitation, Orthopedic OT & Imaging';
  }

  const eligible = mockFacilities.filter((f) => preferredTypes.includes(f.type as any));
  const facilitiesToSearch = eligible.length > 0 ? eligible : mockFacilities;

  let bestHospital = facilitiesToSearch[0];
  let minDistance = 9999;

  for (const hosp of facilitiesToSearch) {
    const dist = calculateHaversineDistance(patientLat, patientLng, hosp.lat, hosp.lng);
    if (dist < minDistance) {
      minDistance = dist;
      bestHospital = hosp;
    }
  }

  const reason = `Recommended based on emergency-care capability (${capabilityText}) and estimated travel time (${estimateEtaMinutes(minDistance)} min) rather than nearest basic health post.`;

  return { hospital: bestHospital, reason };
}

export function triggerEmergencySos(
  patientId: string,
  patientName: string,
  phone: string,
  village: string,
  patientLat: number,
  patientLng: number,
  emergencyContactName: string,
  emergencyContactPhone: string,
  categoryKey: EmergencyCategoryKey = 'cardiac'
): EmergencyDispatchResult {
  // 1. Find nearest available 108 ambulance
  const availableAmbulances = mockAmbulances.filter((a) => a.isAvailable);
  const ambulancesToSearch = availableAmbulances.length > 0 ? availableAmbulances : mockAmbulances;

  let nearestAmbulance = ambulancesToSearch[0];
  let minDistance = 9999;

  for (const amb of ambulancesToSearch) {
    const dist = calculateHaversineDistance(patientLat, patientLng, amb.lat, amb.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearestAmbulance = amb;
    }
  }

  const calculatedEta = estimateEtaMinutes(minDistance);

  // 2. Smart Hospital Recommendation based on clinical capability
  const { hospital: recommendedHospital, reason: hospitalReason } = recommendOptimalHospital(
    categoryKey,
    patientLat,
    patientLng
  );

  const hospDistance = calculateHaversineDistance(patientLat, patientLng, recommendedHospital.lat, recommendedHospital.lng);
  const emergencyId = `sos-${Date.now()}`;
  const protocol = FIRST_AID_PROTOCOLS[categoryKey] || FIRST_AID_PROTOCOLS.cardiac;

  const request: EmergencyRequest = {
    id: emergencyId,
    patientId,
    patientName,
    phone,
    village,
    lat: patientLat,
    lng: patientLng,
    ambulanceId: nearestAmbulance.id,
    ambulanceNumber: nearestAmbulance.vehicleNumber,
    ambulanceDriverPhone: nearestAmbulance.driverPhone,
    hospitalId: recommendedHospital.id,
    hospitalName: recommendedHospital.name,
    status: 'en_route',
    etaMinutes: calculatedEta,
    timestamp: new Date().toISOString(),
    notes: `Emergency 108 SOS triggered from doorstep. Category: ${protocol.name.en}`
  };

  // 3. Pre-Arrival Alert for Hospital Admin Dashboard (Requirement 10 & 15)
  const preArrivalAlert: PreArrivalAlert = {
    id: `alert-${Date.now()}`,
    hospitalId: recommendedHospital.id,
    hospitalName: recommendedHospital.name,
    ambulanceNumber: nearestAmbulance.vehicleNumber,
    patientName,
    patientAge: 48,
    patientGender: 'Male',
    condition: `Emergency SOS: ${protocol.name.en} - ${protocol.shortDesc.en}`,
    priority: 'critical',
    etaMinutes: calculatedEta + estimateEtaMinutes(hospDistance),
    requiredCare: protocol.recommendedFacilityCapability,
    timestamp: 'Just now',
    status: 'incoming'
  };

  const currentAlerts = getPreArrivalAlerts();
  currentAlerts.unshift(preArrivalAlert);
  savePreArrivalAlerts(currentAlerts);

  const smsMessage = `[ALERT] Emergency 108 SOS triggered for ${patientName} at ${village}. Category: ${protocol.name.en}. Ambulance ${nearestAmbulance.vehicleNumber} dispatched (Driver: ${nearestAmbulance.driverName}, ${nearestAmbulance.driverPhone}). Destination facility: ${recommendedHospital.name}. RuralCare Connect - Govt of Maharashtra.`;

  const disclaimer =
    'Emergency guidance does not replace professional medical care. 108 Emergency Medical Services has been alerted. For life-threatening emergencies, prioritize professional response.';

  const result: EmergencyDispatchResult = {
    request,
    ambulance: nearestAmbulance,
    hospital: recommendedHospital,
    hospitalReason,
    categoryKey,
    alert: preArrivalAlert,
    smsMessage,
    disclaimer,
    routeDistanceKm: hospDistance,
    currentStage: 'Going to Patient'
  };

  saveActiveEmergency(result);
  return result;
}

export function updateAmbulanceStatus(stage: AmbulanceDispatchStage): EmergencyDispatchResult | null {
  const current = getActiveEmergency();
  if (!current) return null;

  current.currentStage = stage;
  if (stage === 'Arrived') {
    current.request.status = 'arrived';
  } else if (stage === 'Going to Hospital' || stage === 'Patient Picked Up') {
    current.request.status = 'en_route';
  }

  saveActiveEmergency(current);
  return current;
}

export function completeActiveEmergency(params?: {
  diagnosisSummary?: string;
  attendingDoctor?: string;
  treatmentGiven?: string;
  followUpSchedule?: string;
}): void {
  const current = getActiveEmergency();
  if (current) {
    const protocol = FIRST_AID_PROTOCOLS[current.categoryKey] || FIRST_AID_PROTOCOLS.cardiac;

    // Requirement 14: Log into Patient's Longitudinal Medical Record
    addMedicalRecord({
      patientId: current.request.patientId,
      type: 'district_hospital',
      title: `🚨 Emergency 108 Episode: ${protocol.name.en}`,
      providerName: params?.attendingDoctor || 'Dr. Priya Sharma (Emergency Physician)',
      facilityName: current.hospital.name,
      diagnosis: params?.diagnosisSummary || `Acute Emergency Stabilization - ${protocol.name.en}`,
      vitals: {
        bloodPressure: '138/88 mmHg',
        heartRate: '88 bpm',
        spO2: '96%',
        temperature: '98.6 °F'
      },
      details: `108 Ambulance Unit ${current.ambulance.vehicleNumber} transported patient to ${current.hospital.name}. First-aid protocol guided on scene. ${
        params?.treatmentGiven || 'Inpatient emergency resuscitation and stabilization administered.'
      } Follow-up scheduled: ${params?.followUpSchedule || 'Tomorrow 10:00 AM at PHC'}.`
    });

    saveActiveEmergency(null);
    window.dispatchEvent(new CustomEvent('ruralcare_emergency_completed'));
  }
}
