import { Referral } from '../types';

const REFERRALS_STORAGE_KEY = 'ruralcare_referrals';

const defaultReferrals: Referral[] = [
  {
    id: "ref-1",
    patientId: "pat-1",
    patientName: "Ramesh Patil",
    doctorId: "doc-1",
    doctorName: "Dr. Priya Sharma",
    specialistType: "Cardiologist",
    hospitalName: "Aundh District Hospital, Pune",
    facilityAddress: "Near Bremen Chowk, Aundh, Pune",
    reason: "Hypertension evaluation & baseline 2D Echocardiography",
    urgency: "priority",
    status: "completed",
    date: "2026-07-15"
  }
];

export function getPatientReferrals(patientId: string): Referral[] {
  try {
    const data = localStorage.getItem(REFERRALS_STORAGE_KEY);
    if (data) {
      const stored: Referral[] = JSON.parse(data);
      const combined = [...stored, ...defaultReferrals.filter(d => !stored.some(s => s.id === d.id))];
      return combined.filter(r => r.patientId === patientId);
    }
  } catch (e) {
    console.error('Error reading referrals', e);
  }
  return defaultReferrals.filter(r => r.patientId === patientId);
}

export function createReferral(params: {
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialistType: string;
  hospitalName: string;
  facilityAddress: string;
  reason: string;
  urgency: 'routine' | 'priority' | 'immediate';
}): Referral {
  const newRef: Referral = {
    id: `ref-${Date.now()}`,
    patientId: params.patientId,
    patientName: params.patientName,
    doctorId: params.doctorId,
    doctorName: params.doctorName,
    specialistType: params.specialistType,
    hospitalName: params.hospitalName,
    facilityAddress: params.facilityAddress,
    reason: params.reason,
    urgency: params.urgency,
    status: 'pending',
    date: new Date().toISOString().split('T')[0]
  };

  try {
    const current = getPatientReferrals(params.patientId);
    current.unshift(newRef);
    localStorage.setItem(REFERRALS_STORAGE_KEY, JSON.stringify(current));
  } catch (e) {
    console.error('Error saving referral', e);
  }

  return newRef;
}
