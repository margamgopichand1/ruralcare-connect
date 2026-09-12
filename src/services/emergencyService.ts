import { Ambulance, EmergencyRequest, Facility, PreArrivalAlert } from '../types';
import { mockAmbulances, mockFacilities, mockPreArrivalAlerts } from '../data/mockData';
import { calculateHaversineDistance, estimateEtaMinutes } from './matchingService';

export interface EmergencyDispatchResult {
  request: EmergencyRequest;
  ambulance: Ambulance;
  hospital: Facility;
  alert: PreArrivalAlert;
  smsMessage: string;
  disclaimer: string;
  routeDistanceKm: number;
}

const PRE_ARRIVAL_STORAGE_KEY = 'ruralcare_prearrival_alerts';

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

export function triggerEmergencySos(
  patientId: string,
  patientName: string,
  phone: string,
  village: string,
  patientLat: number,
  patientLng: number,
  emergencyContactName: string,
  emergencyContactPhone: string,
  suspectedCondition: string = 'Severe respiratory / cardiovascular emergency'
): EmergencyDispatchResult {
  // 1. Find nearest available ambulance
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

  // 2. Find recommended hospital factoring clinical capability (District Hospital or CHC with ICU/OT)
  const emergencyHospitals = mockFacilities.filter(
    (f) => f.type === 'District Hospital' || f.type === 'CHC'
  );

  let recommendedHospital = emergencyHospitals[0];
  let minHospDist = 9999;

  for (const hosp of emergencyHospitals) {
    const dist = calculateHaversineDistance(patientLat, patientLng, hosp.lat, hosp.lng);
    if (dist < minHospDist) {
      minHospDist = dist;
      recommendedHospital = hosp;
    }
  }

  const emergencyId = `sos-${Date.now()}`;
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
    notes: `Emergency 108 SOS triggered from doorstep. Suspected: ${suspectedCondition}`
  };

  // 3. Pre-Arrival Alert for Hospital Admin Dashboard
  const preArrivalAlert: PreArrivalAlert = {
    id: `alert-${Date.now()}`,
    hospitalId: recommendedHospital.id,
    hospitalName: recommendedHospital.name,
    ambulanceNumber: nearestAmbulance.vehicleNumber,
    patientName,
    patientAge: 48,
    patientGender: 'Male',
    condition: suspectedCondition,
    priority: 'critical',
    etaMinutes: calculatedEta + estimateEtaMinutes(minHospDist),
    requiredCare: 'Emergency Department / Intensive Resuscitation Unit',
    timestamp: 'Just now',
    status: 'incoming'
  };

  const currentAlerts = getPreArrivalAlerts();
  currentAlerts.unshift(preArrivalAlert);
  savePreArrivalAlerts(currentAlerts);

  const smsMessage = `[ALERT] Emergency 108 SOS triggered for ${patientName} at ${village}. Ambulance ${nearestAmbulance.vehicleNumber} dispatched (Driver: ${nearestAmbulance.driverName}, ${nearestAmbulance.driverPhone}). Destination facility: ${recommendedHospital.name}. RuralCare Connect - Govt of Maharashtra.`;

  const disclaimer = 'RuralCare Connect coordinates with state 108 emergency services. For critical life-threatening situations, dial 108 directly if connectivity is lost.';

  return {
    request,
    ambulance: nearestAmbulance,
    hospital: recommendedHospital,
    alert: preArrivalAlert,
    smsMessage,
    disclaimer,
    routeDistanceKm: minHospDist
  };
}
