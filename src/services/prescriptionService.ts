import { Prescription, PrescriptionMedicine, Vitals } from '../types';

const PRESCRIPTION_STORAGE_KEY = 'ruralcare_prescriptions';

export function getStoredPrescriptions(): Prescription[] {
  try {
    const data = localStorage.getItem(PRESCRIPTION_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load prescriptions from localStorage', e);
  }
  return [];
}

export function savePrescription(prescription: Prescription): void {
  try {
    const current = getStoredPrescriptions();
    const filtered = current.filter((p) => p.id !== prescription.id);
    filtered.unshift(prescription);
    localStorage.setItem(PRESCRIPTION_STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to save prescription to localStorage', e);
  }
}

export function createDigitalPrescription(params: {
  visitId: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  doctorId: string;
  doctorName: string;
  doctorQualification: string;
  doctorLicense: string;
  facilityName: string;
  vitals: Vitals;
  diagnosis: string;
  medicines: PrescriptionMedicine[];
  instructions: string;
  followUpDate: string;
}): Prescription {
  const prescription: Prescription = {
    id: `rx-${Date.now()}`,
    visitId: params.visitId,
    patientId: params.patientId,
    patientName: params.patientName,
    patientAge: params.patientAge,
    patientGender: params.patientGender,
    doctorId: params.doctorId,
    doctorName: params.doctorName,
    doctorQualification: params.doctorQualification,
    doctorLicense: params.doctorLicense,
    facilityName: params.facilityName || 'RuralCare Connect Mobile Clinic',
    date: new Date().toISOString().split('T')[0],
    vitals: params.vitals,
    diagnosis: params.diagnosis,
    medicines: params.medicines,
    instructions: params.instructions,
    followUpDate: params.followUpDate
  };

  savePrescription(prescription);
  return prescription;
}
