import { Referral } from '../types';

const REFERRALS_STORAGE_KEY = 'ruralcare_referrals';

export const REFERRAL_STAGES = [
  'Created',
  'Accepted',
  'Scheduled',
  'Patient En Route',
  'Arrived',
  'Consulted',
  'Completed'
] as const;

const defaultReferrals: Referral[] = [
  {
    id: "ref-1",
    patientId: "pat-1",
    patientName: "Ramesh Patil",
    doctorId: "doc-1",
    doctorName: "Dr. Priya Sharma (PHC Karegaon)",
    specialistType: "Cardiologist",
    hospitalName: "Aundh District Hospital, Pune",
    facilityAddress: "Near Bremen Chowk, Aundh, Pune",
    reason: "Hypertension evaluation & baseline 2D Echocardiography",
    urgency: "priority",
    status: "Completed",
    date: "2026-07-15"
  },
  {
    id: "ref-2",
    patientId: "pat-4",
    patientName: "Pooja Jadhav",
    doctorId: "doc-2",
    doctorName: "Dr. Anand Deshmukh (PHC)",
    specialistType: "Obstetrician / High-Risk Pregnancy",
    hospitalName: "Shirur Rural Hospital (Sub-District)",
    facilityAddress: "Station Road, Shirur Rural Hospital",
    reason: "Severe Third-Trimester Anemia (Hb 8.1 g/dL) & Fetal Monitoring",
    urgency: "immediate",
    status: "Scheduled",
    date: "2026-09-10"
  },
  {
    id: "ref-3",
    patientId: "pat-3",
    patientName: "Tukaram Gaikwad",
    doctorId: "doc-1",
    doctorName: "Dr. Priya Sharma",
    specialistType: "Pulmonologist",
    hospitalName: "Manchar Rural Hospital (CHC)",
    facilityAddress: "Pune-Nashik Highway, Manchar",
    reason: "Refractory Asthmatic Bronchospasm & Spirometry Assessment",
    urgency: "priority",
    status: "Accepted",
    date: "2026-09-11"
  }
];

export function getAllReferrals(): Referral[] {
  try {
    const data = localStorage.getItem(REFERRALS_STORAGE_KEY);
    if (data) {
      const stored: Referral[] = JSON.parse(data);
      const combined = [...stored, ...defaultReferrals.filter((d) => !stored.some((s) => s.id === d.id))];
      return combined;
    }
  } catch (e) {
    console.error('Error reading referrals', e);
  }
  return defaultReferrals;
}

export function getPatientReferrals(patientId: string): Referral[] {
  return getAllReferrals().filter((r) => r.patientId === patientId);
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
    status: 'Created',
    date: new Date().toISOString().split('T')[0]
  };

  try {
    const all = getAllReferrals();
    all.unshift(newRef);
    localStorage.setItem(REFERRALS_STORAGE_KEY, JSON.stringify(all));
  } catch (e) {
    console.error('Error saving referral', e);
  }

  return newRef;
}

export function advanceReferralStatus(referralId: string): Referral | null {
  try {
    const all = getAllReferrals();
    const target = all.find((r) => r.id === referralId);
    if (!target) return null;

    const currentIndex = REFERRAL_STAGES.indexOf(target.status as any);
    if (currentIndex >= 0 && currentIndex < REFERRAL_STAGES.length - 1) {
      target.status = REFERRAL_STAGES[currentIndex + 1];
      localStorage.setItem(REFERRALS_STORAGE_KEY, JSON.stringify(all));
      return target;
    }
  } catch (e) {
    console.error('Error advancing referral', e);
  }
  return null;
}
