import { Ambulance, EmergencyRequest, Facility } from '../types';
import { mockAmbulances, mockFacilities } from '../data/mockData';
import { calculateHaversineDistance, estimateEtaMinutes } from './matchingService';

export interface EmergencyDispatchResult {
  request: EmergencyRequest;
  ambulance: Ambulance;
  hospital: Facility;
  smsMessage: string;
  disclaimer: string;
}

export function triggerEmergencySos(
  patientId: string,
  patientName: string,
  phone: string,
  village: string,
  patientLat: number,
  patientLng: number,
  emergencyContactName: string,
  emergencyContactPhone: string
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

  // 2. Find nearest hospital with emergency services (District Hospital or CHC)
  const emergencyHospitals = mockFacilities.filter(
    (f) => f.type === 'District Hospital' || f.type === 'CHC'
  );

  let nearestHospital = emergencyHospitals[0];
  let minHospDist = 9999;

  for (const hosp of emergencyHospitals) {
    const dist = calculateHaversineDistance(patientLat, patientLng, hosp.lat, hosp.lng);
    if (dist < minHospDist) {
      minHospDist = dist;
      nearestHospital = hosp;
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
    hospitalId: nearestHospital.id,
    hospitalName: nearestHospital.name,
    status: 'dispatched',
    etaMinutes: calculatedEta,
    timestamp: new Date().toISOString(),
    notes: 'Emergency 108 SOS triggered from mobile doorstep platform.'
  };

  const smsMessage = `[ALERT] Emergency 108 SOS triggered for ${patientName} at ${village}. Ambulance ${nearestAmbulance.vehicleNumber} dispatched (Driver: ${nearestAmbulance.driverName}, ${nearestAmbulance.driverPhone}). Nearest facility: ${nearestHospital.name}. RuralCare Connect - Govt of Maharashtra.`;

  const disclaimer = 'ETA is the fastest available estimate and depends on ambulance availability, rural road conditions, and dispatch load.';

  return {
    request,
    ambulance: nearestAmbulance,
    hospital: nearestHospital,
    smsMessage,
    disclaimer
  };
}
