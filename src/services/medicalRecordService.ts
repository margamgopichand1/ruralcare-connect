import { MedicalRecordItem, Vitals } from '../types';
import { mockMedicalRecords } from '../data/mockData';

const RECORDS_STORAGE_KEY = 'ruralcare_medical_records';

export function getPatientMedicalRecords(patientId: string): MedicalRecordItem[] {
  try {
    const local = localStorage.getItem(RECORDS_STORAGE_KEY);
    let allRecords: MedicalRecordItem[] = mockMedicalRecords;
    if (local) {
      const stored: MedicalRecordItem[] = JSON.parse(local);
      allRecords = [...stored, ...mockMedicalRecords.filter((m) => !stored.some((s) => s.id === m.id))];
    }
    return allRecords.filter((r) => r.patientId === patientId);
  } catch (e) {
    console.error('Error fetching records', e);
    return mockMedicalRecords.filter((r) => r.patientId === patientId);
  }
}

export function addMedicalRecord(params: {
  patientId: string;
  type: 'consultation' | 'prescription' | 'referral' | 'phc_visit' | 'district_hospital';
  title: string;
  providerName: string;
  facilityName: string;
  diagnosis?: string;
  vitals?: Vitals;
  details: string;
  prescriptionId?: string;
  referralId?: string;
}): MedicalRecordItem {
  const newRecord: MedicalRecordItem = {
    id: `rec-${Date.now()}`,
    patientId: params.patientId,
    date: new Date().toISOString().split('T')[0],
    type: params.type,
    title: params.title,
    providerName: params.providerName,
    facilityName: params.facilityName,
    diagnosis: params.diagnosis,
    vitals: params.vitals,
    details: params.details,
    prescriptionId: params.prescriptionId,
    referralId: params.referralId
  };

  try {
    const local = localStorage.getItem(RECORDS_STORAGE_KEY);
    const existing: MedicalRecordItem[] = local ? JSON.parse(local) : [];
    existing.unshift(newRecord);
    localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(existing));
  } catch (e) {
    console.error('Failed to store record', e);
  }

  return newRecord;
}
