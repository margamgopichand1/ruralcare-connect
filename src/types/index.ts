export type UserRole = 
  | 'patient' 
  | 'health_worker' 
  | 'doctor' 
  | 'ambulance' 
  | 'hospital_admin' 
  | 'district_admin' 
  | 'admin';

export type Language = 'en' | 'mr' | 'hi' | 'te';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone: string;
  village?: string;
  avatar?: string;
}

export interface Patient {
  id: string;
  userId: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  village: string;
  taluka: string;
  district: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  bloodGroup: string;
  allergies: string[];
  medicalConditions: string[];
  preferredLanguage: Language;
  abhaId: string; // Ayushman Bharat Health Account ID
  lat: number;
  lng: number;
}

export interface Doctor {
  id: string;
  userId: string;
  name: string;
  qualification: string;
  specialization: string;
  licenseNumber: string;
  experience: number; // in years
  rating: number;
  totalReviews: number;
  serviceArea: string; // Taluka/District
  lat: number;
  lng: number;
  isAvailable: boolean;
  isVerified: boolean;
  phone: string;
  avatar: string;
  bio: string;
  currentVisitId?: string;
}

export type VisitUrgency = 'routine' | 'soon' | 'urgent' | 'emergency';

export type VisitCategory = 
  | 'fever'
  | 'cold_cough'
  | 'stomach'
  | 'skin'
  | 'child_health'
  | 'womens_health'
  | 'elderly_care'
  | 'general'
  | 'other';

export type VisitStatus = 
  | 'pending'
  | 'matched'
  | 'accepted'
  | 'en_route'
  | 'arrived'
  | 'in_consultation'
  | 'completed'
  | 'declined'
  | 'cancelled';

export interface Vitals {
  temperature?: string; // e.g. "101.4 °F"
  bloodPressure?: string; // e.g. "120/80 mmHg"
  heartRate?: string; // e.g. "78 bpm"
  spO2?: string; // e.g. "98%"
}

export interface VisitRequest {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  category: VisitCategory;
  symptoms: string;
  urgency: VisitUrgency;
  lat: number;
  lng: number;
  address: string;
  preferredLanguage: Language;
  doctorId?: string;
  doctorName?: string;
  doctorSpecialty?: string;
  doctorRating?: number;
  status: VisitStatus;
  etaMinutes?: number;
  distanceKm?: number;
  requestedAt: string;
  acceptedAt?: string;
  completedAt?: string;
  vitals?: Vitals;
  diagnosis?: string;
  notes?: string;
  prescriptionId?: string;
  referralId?: string;
}

export interface PrescriptionMedicine {
  name: string;
  dosage: string; // e.g. "500 mg"
  frequency: string; // e.g. "1-0-1 (After Food)"
  duration: string; // e.g. "5 days"
  instructions: string; // e.g. "Take with warm water"
}

export interface Prescription {
  id: string;
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
  date: string;
  vitals: Vitals;
  diagnosis: string;
  medicines: PrescriptionMedicine[];
  instructions: string;
  followUpDate: string;
}

export interface Referral {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialistType: string;
  hospitalName: string;
  reason: string;
  urgency: 'routine' | 'priority' | 'immediate';
  status: 
    | 'Created' 
    | 'Accepted' 
    | 'Scheduled' 
    | 'Patient En Route' 
    | 'Arrived' 
    | 'Consulted' 
    | 'Completed'
    | 'pending'
    | 'scheduled'
    | 'completed';
  date: string;
  facilityAddress: string;
}

export interface MedicalRecordItem {
  id: string;
  patientId: string;
  date: string;
  type: 'consultation' | 'prescription' | 'referral' | 'phc_visit' | 'district_hospital';
  title: string;
  providerName: string;
  facilityName: string;
  diagnosis?: string;
  vitals?: Vitals;
  details: string;
  prescriptionId?: string;
  referralId?: string;
}

export interface MedicineStockInfo {
  facilityId: string;
  facilityName: string;
  facilityType: 'PHC' | 'CHC' | 'District Hospital' | 'Sub-Center';
  quantity: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  distanceKm: number;
  contactPhone: string;
}

export interface MedicineItem {
  id: string;
  name: string;
  genericName: string;
  category: string;
  description: string;
  dosageForm: string;
  stocks: MedicineStockInfo[];
}

export interface Facility {
  id: string;
  name: string;
  type: 'PHC' | 'CHC' | 'Sub-Center' | 'District Hospital';
  taluka: string;
  district: string;
  lat: number;
  lng: number;
  contactPhone: string;
  totalBeds: number;
  availableDoctors: number;
  activeCases: number;
  coverageStatus: 'adequate' | 'needs_attention' | 'critical_gap';
}

export interface Ambulance {
  id: string;
  vehicleNumber: string; // e.g. "MH-12-RN-4421"
  driverName: string;
  driverPhone: string;
  baseLocation: string;
  lat: number;
  lng: number;
  isAvailable: boolean;
  estimatedEtaMinutes: number;
  assignedEmergencyId?: string;
}

export interface EmergencyRequest {
  id: string;
  patientId: string;
  patientName: string;
  phone: string;
  village: string;
  lat: number;
  lng: number;
  ambulanceId: string;
  ambulanceNumber: string;
  ambulanceDriverPhone: string;
  hospitalId: string;
  hospitalName: string;
  status: 'dispatched' | 'en_route' | 'arrived' | 'completed' | 'cancelled';
  etaMinutes: number;
  timestamp: string;
  notes?: string;
}

export interface NotificationItem {
  id: string;
  recipientRole: UserRole | 'all';
  recipientId?: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'visit' | 'sos' | 'record' | 'stock' | 'system' | 'referral' | 'queue';
}

export interface DistrictMetrics {
  totalPatients: number;
  activeDoctors: number;
  visitsToday: number;
  emergencyCases: number;
  averageResponseTimeMin: number;
  pendingReferrals: number;
  talukaCoverage: {
    taluka: string;
    coveragePct: number;
    activeDoctors: number;
    population: number;
    status: 'good' | 'moderate' | 'low';
  }[];
  doctorUtilizationRate: number; // e.g. 78%
  requestsTrend: { hour: string; requests: number }[];
  diseaseOutbreaks: {
    disease: string;
    cases: number;
    trend: 'increasing' | 'stable' | 'decreasing';
    hotspotTaluka: string;
  }[];
  criticalAlerts: {
    id: string;
    type: 'doctor_coverage' | 'medicine_shortage' | 'disease_spike' | 'emergency';
    title: string;
    description: string;
    severity: 'warning' | 'critical';
    time: string;
  }[];
}

export type QueuePriority = 'normal' | 'urgent' | 'critical';

export interface QueueItem {
  id: string;
  tokenNumber: string; // e.g. "A-027"
  patientId: string;
  patientName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  reason: string;
  priority: QueuePriority;
  status: 'waiting' | 'in_consultation' | 'completed' | 'referred';
  estimatedWaitMinutes: number;
  arrivedAt: string;
  updatedByClinicalStaff?: boolean;
  notes?: string;
}

export interface PreArrivalAlert {
  id: string;
  hospitalId: string;
  hospitalName: string;
  ambulanceNumber: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  condition: string;
  priority: 'urgent' | 'critical';
  etaMinutes: number;
  requiredCare: string; // e.g. "Emergency Dept / Cath Lab", "Trauma Care / OT"
  timestamp: string;
  status: 'incoming' | 'acknowledged' | 'arrived';
}

export interface DiagnosticTestItem {
  id: string;
  name: string;
  category: 'Blood Test' | 'Imaging' | 'Cardiac' | 'Microbiology' | 'General';
  description: string;
  turnaroundTime: string;
  sampleType: string;
  participatingFacilities: string[];
}

export interface DiagnosticBooking {
  id: string;
  patientId: string;
  patientName: string;
  testId: string;
  testName: string;
  facilityId: string;
  facilityName: string;
  facilityDistanceKm: number;
  date: string;
  slot: string;
  status: 'scheduled' | 'sample_collected' | 'analyzing' | 'completed';
  reportUrl?: string;
  reportDate?: string;
  findingsSummary?: string;
  reviewedByDoctor?: string;
}

export interface HighRiskPatient {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  village: string;
  taluka: string;
  conditionCategory: 'maternal' | 'child' | 'diabetes' | 'hypertension' | 'chronic_kidney' | 'tb';
  conditionName: string;
  riskLevel: 'high' | 'critical';
  lastVisitDate: string;
  nextFollowUpDate: string;
  status: 'due_soon' | 'overdue' | 'completed';
  missedVisitsCount: number;
  ashaWorkerAssigned: string;
  ashaPhone: string;
  patientPhone: string;
  notes: string;
}

export interface NearbyProvider {
  id: string;
  name: string;
  role: 'doctor' | 'asha' | 'nurse';
  qualification: string;
  specialization: string;
  distanceKm: number;
  etaMinutes: number;
  areaServed: string;
  services: string[];
  isAvailable: boolean;
  isVerified: boolean;
  phone: string;
  avatar: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  userName: string;
  role: UserRole;
  action: string;
  resource: string;
  facility: string;
  status: 'SUCCESS' | 'WARNING';
}

export interface OfflineQueuedRecord {
  id: string;
  timestamp: string;
  type: 'patient_reg' | 'clinical_note' | 'vitals_entry' | 'home_visit';
  data: any;
  synced: boolean;
}

