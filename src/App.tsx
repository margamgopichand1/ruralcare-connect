import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { NetworkProvider } from './context/NetworkContext';
import { NotificationProvider, useNotifications } from './context/NotificationContext';

// Common Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { OfflineBanner } from './components/common/OfflineBanner';

// Landing & Auth
import { LandingPage } from './components/landing/LandingPage';
import { RoleSelectModal } from './components/auth/RoleSelectModal';

// Patient Components
import { PatientDashboard } from './components/patient/PatientDashboard';
import { CareNearMeModal } from './components/patient/CareNearMeModal';
import { HomeVisitModal } from './components/patient/HomeVisitModal';
import { AiTriageModal } from './components/patient/AiTriageModal';
import { DoctorDiscoveryModal } from './components/patient/DoctorDiscoveryModal';
import { DiagnosticBookingModal } from './components/patient/DiagnosticBookingModal';
import { ReferralTrackingModal } from './components/patient/ReferralTrackingModal';
import { MedicalRecordsView } from './components/patient/MedicalRecordsView';
import { MedicineFinderView } from './components/patient/MedicineFinderView';
import { SmsIvrFallbackView } from './components/patient/SmsIvrFallbackView';
import { PatientProfileModal } from './components/patient/PatientProfileModal';
import { BookDoctorModal } from './components/patient/BookDoctorModal';
import { DoctorMatchingModal } from './components/patient/DoctorMatchingModal';
import { LiveTrackingView } from './components/patient/LiveTrackingView';
import { PrescriptionModal } from './components/patient/PrescriptionModal';

// Doctor Components
import { DoctorDashboard } from './components/doctor/DoctorDashboard';
import { ConsultationModal } from './components/doctor/ConsultationModal';
import { DoctorVerificationModal } from './components/doctor/DoctorVerificationModal';

// Health Worker Components
import { HealthWorkerDashboard } from './components/healthworker/HealthWorkerDashboard';
import { PatientRegistrationModal } from './components/healthworker/PatientRegistrationModal';
import { HighRiskFollowupModal } from './components/highrisk/HighRiskFollowupModal';

// Ambulance & Hospital Admin Components
import { AmbulanceDashboard } from './components/ambulance/AmbulanceDashboard';
import { HospitalAdminDashboard } from './components/hospital/HospitalAdminDashboard';

// Emergency SOS & District Admin
import { EmergencySosModal } from './components/emergency/EmergencySosModal';
import { GovernmentDashboard } from './components/admin/GovernmentDashboard';

// Judge Presentation Mode Modals
import { JudgeDemoBar } from './components/judge/JudgeDemoBar';
import { JudgeScenarioModal } from './components/judge/JudgeScenarioModal';
import { InnovationsModal } from './components/judge/InnovationsModal';
import { SihAlignmentModal } from './components/judge/SihAlignmentModal';
import { TechArchitectureModal } from './components/judge/TechArchitectureModal';

// Types & Mock Data
import { Doctor, Prescription, VisitCategory, VisitRequest, VisitUrgency, NearbyProvider, QueueItem, HighRiskPatient } from './types';
import { mockDoctors, mockPatients, mockNearbyProviders } from './data/mockData';
import { 
  Home, 
  FileText, 
  Pill, 
  AlertTriangle, 
  User, 
  Navigation, 
  Stethoscope, 
  Building2, 
  ShieldCheck, 
  HeartHandshake, 
  Landmark,
  MapPin,
  Sparkles
} from 'lucide-react';

const MainApp: React.FC = () => {
  const { role, switchRole, currentPatient, currentDoctor } = useAuth();
  const { addNotification } = useNotifications();

  // Active Tab state
  const [activeTab, setActiveTab] = useState<string>('home');

  // Modals state
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCareNearMeOpen, setIsCareNearMeOpen] = useState(false);
  const [isHomeVisitOpen, setIsHomeVisitOpen] = useState(false);
  const [selectedHomeVisitProvider, setSelectedHomeVisitProvider] = useState<NearbyProvider | null>(null);
  const [isTriageOpen, setIsTriageOpen] = useState(false);
  const [isDoctorDiscoveryOpen, setIsDoctorDiscoveryOpen] = useState(false);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);
  const [isReferralTrackingOpen, setIsReferralTrackingOpen] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [selectedQueueItem, setSelectedQueueItem] = useState<QueueItem | null>(null);
  const [isRegisterPatientOpen, setIsRegisterPatientOpen] = useState(false);
  const [isHighRiskModalOpen, setIsHighRiskModalOpen] = useState(false);
  const [selectedHighRiskPatient, setSelectedHighRiskPatient] = useState<HighRiskPatient | null>(null);

  // Judge Presentation Modals
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false);
  const [isInnovationsModalOpen, setIsInnovationsModalOpen] = useState(false);
  const [isSihAlignmentModalOpen, setIsSihAlignmentModalOpen] = useState(false);
  const [isTechArchitectureModalOpen, setIsTechArchitectureModalOpen] = useState(false);

  // Legacy Matching & Tracking States
  const [isBookDoctorOpen, setIsBookDoctorOpen] = useState(false);
  const [isMatchingOpen, setIsMatchingOpen] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [activePrescription, setActivePrescription] = useState<Prescription | null>({
    id: 'RX-2026-8942',
    visitId: 'VIS-991',
    patientId: 'P-101',
    patientName: 'Ramesh Patil',
    patientAge: 48,
    patientGender: 'Male',
    doctorId: 'D-201',
    doctorName: 'Dr. Priya Sharma',
    doctorQualification: 'MBBS, DNB (Internal Medicine)',
    doctorLicense: 'MMC-2018-09384',
    facilityName: 'Karegaon Primary Health Centre (PHC)',
    date: '12 Sep 2026',
    vitals: {
      temperature: '101.4 °F',
      bloodPressure: '138/88 mmHg',
      heartRate: '84 bpm',
      spO2: '97%'
    },
    diagnosis: 'Acute Febrile Illness with Mild Dehydration (Suspected Viral Infection)',
    medicines: [
      {
        name: 'Tab. Paracetamol IP',
        dosage: '650 mg',
        frequency: '1-0-1 (SOS / After Food)',
        duration: '3 days',
        instructions: 'Take with warm water if fever exceeds 100°F'
      },
      {
        name: 'ORS (Oral Rehydration Salts) Sachet',
        dosage: '1 sachet in 1L boiled & cooled water',
        frequency: 'Sip frequently throughout day',
        duration: '3 days',
        instructions: 'Maintain active fluid hydration'
      },
      {
        name: 'Tab. Cetirizine Hydrochloride',
        dosage: '10 mg',
        frequency: '0-0-1 (At Bedtime)',
        duration: '5 days',
        instructions: 'For allergic rhinitis / body congestion'
      }
    ],
    instructions: 'Rest adequately for 48 hours. Drink at least 2.5 litres of fluids. If temperature exceeds 102°F or breathlessness develops, contact ASHA Lakshmi Devi immediately or call 108.',
    followUpDate: '15 Sep 2026 at Karegaon PHC'
  });
  const [activeDoctor, setActiveDoctor] = useState<Doctor>(mockDoctors[0]);
  const [activeVisitRequest, setActiveVisitRequest] = useState<VisitRequest | null>(null);

  const handleStartHomeVisit = (prov?: NearbyProvider) => {
    if (prov) setSelectedHomeVisitProvider(prov);
    setIsHomeVisitOpen(true);
  };

  const handleOpenConsultation = (item: QueueItem) => {
    setSelectedQueueItem(item);
    setIsConsultationOpen(true);
  };

  const handleOpenHighRisk = (pt: HighRiskPatient) => {
    setSelectedHighRiskPatient(pt);
    setIsHighRiskModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 pb-20 md:pb-0">
      {/* Offline Status & Auto-Sync Notification Banner */}
      <OfflineBanner />

      {/* Main Navigation Bar */}
      <Navbar
        onOpenRoleModal={() => setIsRoleModalOpen(true)}
        onOpenSosModal={() => setIsSosModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenCareNearMe={() => setIsCareNearMeOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Dynamic View Content */}
      <main className="flex-1">
        {/* PUBLIC LANDING VIEW */}
        {activeTab === 'landing' && (
          <LandingPage
            onGetHealthcare={() => {
              switchRole('patient');
              setActiveTab('home');
            }}
            onJoinAsDoctor={() => {
              switchRole('doctor');
              setActiveTab('doctor-dashboard');
            }}
            onOpenSos={() => setIsSosModalOpen(true)}
            onViewAdmin={() => {
              switchRole('district_admin');
              setActiveTab('admin-dashboard');
            }}
            onStartDemo={() => setIsScenarioModalOpen(true)}
            onOpenInnovations={() => setIsInnovationsModalOpen(true)}
            onOpenSihAlignment={() => setIsSihAlignmentModalOpen(true)}
            onOpenTechArchitecture={() => setIsTechArchitectureModalOpen(true)}
          />
        )}

        {/* 1. PATIENT VIEWS */}
        {role === 'patient' && activeTab !== 'landing' && (
          <>
            {activeTab === 'home' && (
              <PatientDashboard
                onOpenBooking={() => setIsDoctorDiscoveryOpen(true)}
                onOpenCareNearMe={() => setIsCareNearMeOpen(true)}
                onOpenHomeVisit={handleStartHomeVisit}
                onOpenTeleconsult={() => setIsDoctorDiscoveryOpen(true)}
                onOpenMedicineSearch={() => setActiveTab('medicines')}
                onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
                onOpenRecords={() => setActiveTab('records')}
                onOpenReferralTracking={() => setIsReferralTrackingOpen(true)}
                onOpenSos={() => setIsSosModalOpen(true)}
                onOpenTriage={() => setIsTriageOpen(true)}
                onSelectDoctorDirectly={(doc) => {
                  setActiveDoctor(doc);
                  setIsDoctorDiscoveryOpen(true);
                }}
                activeVisitRequest={activeVisitRequest}
              />
            )}

            {activeTab === 'live-tracking' && (
              <LiveTrackingView
                doctor={activeDoctor}
                patientLat={18.8256}
                patientLng={74.3721}
                initialDistanceKm={activeVisitRequest?.distanceKm || 1.8}
                initialEtaMinutes={activeVisitRequest?.etaMinutes || 8}
                visitRequest={activeVisitRequest || undefined}
                onArrived={() => {
                  addNotification('Doctor Arrived', `${activeDoctor.name} has arrived at your doorstep.`, 'visit', 'patient');
                }}
                onCancelVisit={() => {
                  setActiveVisitRequest(null);
                  setActiveTab('home');
                }}
              />
            )}

            {activeTab === 'records' && (
              <MedicalRecordsView
                onViewPrescriptionById={() => setIsPrescriptionModalOpen(true)}
              />
            )}

            {activeTab === 'medicines' && <MedicineFinderView />}

            {activeTab === 'fallback' && <SmsIvrFallbackView />}
          </>
        )}

        {/* 2. HEALTH WORKER (ASHA / ANM) VIEWS */}
        {role === 'health_worker' && activeTab !== 'landing' && (
          <>
            {activeTab === 'home' && (
              <HealthWorkerDashboard
                onOpenRegisterPatient={() => setIsRegisterPatientOpen(true)}
                onOpenTriage={() => setIsTriageOpen(true)}
                onOpenHomeVisit={() => handleStartHomeVisit()}
                onOpenReferralTracking={() => setIsReferralTrackingOpen(true)}
                onOpenMedicineSearch={() => setActiveTab('medicines')}
                onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
                onOpenRecords={() => setActiveTab('records')}
                onOpenHighRiskDetails={handleOpenHighRisk}
              />
            )}
            {activeTab === 'medicines' && <MedicineFinderView />}
            {activeTab === 'records' && <MedicalRecordsView onViewPrescriptionById={() => setIsPrescriptionModalOpen(true)} />}
          </>
        )}

        {/* 3. DOCTOR VIEWS */}
        {role === 'doctor' && activeTab !== 'landing' && (
          <>
            {(activeTab === 'doctor-dashboard' || activeTab === 'home') && (
              <DoctorDashboard
                onOpenConsultation={handleOpenConsultation}
                onOpenPriorityModal={() => {}}
              />
            )}
            {activeTab === 'medicines' && <MedicineFinderView />}
          </>
        )}

        {/* 4. AMBULANCE DRIVER VIEWS */}
        {role === 'ambulance' && activeTab !== 'landing' && (
          <AmbulanceDashboard />
        )}

        {/* 5. HOSPITAL ADMINISTRATOR VIEWS */}
        {role === 'hospital_admin' && activeTab !== 'landing' && (
          <>
            {activeTab === 'home' && <HospitalAdminDashboard />}
            {activeTab === 'medicines' && <MedicineFinderView />}
          </>
        )}

        {/* 6. DISTRICT HEALTH ADMINISTRATOR VIEWS */}
        {(role === 'district_admin' || role === 'admin') && activeTab !== 'landing' && (
          <>
            {(activeTab === 'admin-dashboard' || activeTab === 'home') && <GovernmentDashboard />}
            {activeTab === 'medicines' && <MedicineFinderView />}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
        {role === 'patient' && (
          <>
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-bold ${
                activeTab === 'home' ? 'text-emerald-700' : 'text-slate-500'
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </button>
            <button
              onClick={() => setIsCareNearMeOpen(true)}
              className="flex flex-col items-center gap-0.5 p-1 text-[10px] font-bold text-slate-500"
            >
              <MapPin className="w-5 h-5" />
              <span>Care Near Me</span>
            </button>
            <button
              onClick={() => setIsSosModalOpen(true)}
              className="flex flex-col items-center gap-0.5 p-1 text-[10px] font-black text-red-600 animate-pulse"
            >
              <div className="p-1.5 rounded-full bg-red-600 text-white shadow-md">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <span>108 SOS</span>
            </button>
            <button
              onClick={() => setActiveTab('records')}
              className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-bold ${
                activeTab === 'records' ? 'text-emerald-700' : 'text-slate-500'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>Records</span>
            </button>
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="flex flex-col items-center gap-0.5 p-1 text-[10px] font-bold text-slate-500"
            >
              <User className="w-5 h-5" />
              <span>Profile</span>
            </button>
          </>
        )}

        {role === 'health_worker' && (
          <>
            <button
              onClick={() => setActiveTab('home')}
              className="flex flex-col items-center gap-0.5 p-1 text-[10px] font-bold text-emerald-700"
            >
              <HeartHandshake className="w-5 h-5" />
              <span>ASHA Hub</span>
            </button>
            <button
              onClick={() => setIsRegisterPatientOpen(true)}
              className="flex flex-col items-center gap-0.5 p-1 text-[10px] font-bold text-slate-500"
            >
              <User className="w-5 h-5" />
              <span>Register</span>
            </button>
            <button
              onClick={() => setIsTriageOpen(true)}
              className="flex flex-col items-center gap-0.5 p-1 text-[10px] font-bold text-slate-500"
            >
              <Sparkles className="w-5 h-5" />
              <span>Triage</span>
            </button>
            <button
              onClick={() => setIsRoleModalOpen(true)}
              className="flex flex-col items-center gap-0.5 p-1 text-[10px] font-bold text-slate-500"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Roles</span>
            </button>
          </>
        )}

        {role === 'doctor' && (
          <>
            <button
              onClick={() => setActiveTab('doctor-dashboard')}
              className="flex flex-col items-center gap-0.5 p-1 text-[10px] font-bold text-emerald-700"
            >
              <Stethoscope className="w-5 h-5" />
              <span>OPD Queue</span>
            </button>
            <button
              onClick={() => setActiveTab('medicines')}
              className="flex flex-col items-center gap-0.5 p-1 text-[10px] font-bold text-slate-500"
            >
              <Pill className="w-5 h-5" />
              <span>Pharmacy</span>
            </button>
            <button
              onClick={() => setIsRoleModalOpen(true)}
              className="flex flex-col items-center gap-0.5 p-1 text-[10px] font-bold text-slate-500"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Roles</span>
            </button>
          </>
        )}

        {(role === 'ambulance' || role === 'hospital_admin' || role === 'district_admin' || role === 'admin') && (
          <>
            <button
              onClick={() => setActiveTab('home')}
              className="flex flex-col items-center gap-0.5 p-1 text-[10px] font-bold text-emerald-700"
            >
              <Building2 className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setIsRoleModalOpen(true)}
              className="flex flex-col items-center gap-0.5 p-1 text-[10px] font-bold text-slate-500"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Switch Role</span>
            </button>
          </>
        )}
      </nav>

      {/* Floating Judge Presentation Demo Bar */}
      <JudgeDemoBar
        onOpenScenarioModal={() => setIsScenarioModalOpen(true)}
        onOpenInnovationsModal={() => setIsInnovationsModalOpen(true)}
        onOpenSihAlignmentModal={() => setIsSihAlignmentModalOpen(true)}
        onOpenTechArchitectureModal={() => setIsTechArchitectureModalOpen(true)}
        onTriggerEmergencySos={() => setIsSosModalOpen(true)}
      />

      {/* ============================================================ */}
      {/* ALL INTERACTIVE MODALS & WORKFLOWS */}
      {/* ============================================================ */}

      {/* 1. 6-Role Selection Modal */}
      <RoleSelectModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        onRoleSelected={(newRole) => {
          if (newRole === 'patient') setActiveTab('home');
          else if (newRole === 'doctor') setActiveTab('doctor-dashboard');
          else if (newRole === 'district_admin' || newRole === 'admin') setActiveTab('admin-dashboard');
          else setActiveTab('home');
        }}
      />

      {/* 2. Emergency 108 SOS Modal */}
      <EmergencySosModal
        isOpen={isSosModalOpen}
        onClose={() => setIsSosModalOpen(false)}
      />

      {/* 3. Patient Profile Modal */}
      <PatientProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* 4. Care Near Me Modal */}
      <CareNearMeModal
        isOpen={isCareNearMeOpen}
        onClose={() => setIsCareNearMeOpen(false)}
        onRequestHomeVisit={(prov) => handleStartHomeVisit(prov)}
      />

      {/* 5. 10-Step Home Visit Workflow Modal */}
      <HomeVisitModal
        isOpen={isHomeVisitOpen}
        onClose={() => setIsHomeVisitOpen(false)}
        preselectedProvider={selectedHomeVisitProvider}
        onEscalateToEmergency={() => setIsSosModalOpen(true)}
      />

      {/* 6. AI-Assisted Digital Triage Modal */}
      <AiTriageModal
        isOpen={isTriageOpen}
        onClose={() => setIsTriageOpen(false)}
        onTriggerSos={() => setIsSosModalOpen(true)}
        onProceedToDoctorBooking={(syms) => setIsDoctorDiscoveryOpen(true)}
        onRequestHomeVisit={() => handleStartHomeVisit()}
      />

      {/* 7. Doctor Discovery & Queue Booking Modal */}
      <DoctorDiscoveryModal
        isOpen={isDoctorDiscoveryOpen}
        onClose={() => setIsDoctorDiscoveryOpen(false)}
      />

      {/* 8. Diagnostic Test Booking Modal */}
      <DiagnosticBookingModal
        isOpen={isDiagnosticsOpen}
        onClose={() => setIsDiagnosticsOpen(false)}
      />

      {/* 9. Smart Referral 7-Stage Tracker Modal */}
      <ReferralTrackingModal
        isOpen={isReferralTrackingOpen}
        onClose={() => setIsReferralTrackingOpen(false)}
      />

      {/* 10. Doctor Clinical Consultation Modal */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        queueItem={selectedQueueItem}
      />

      {/* 11. Patient Registration Modal (Offline Capable) */}
      <PatientRegistrationModal
        isOpen={isRegisterPatientOpen}
        onClose={() => setIsRegisterPatientOpen(false)}
      />

      {/* 12. High-Risk Patient Follow-Up Modal */}
      <HighRiskFollowupModal
        isOpen={isHighRiskModalOpen}
        onClose={() => setIsHighRiskModalOpen(false)}
        patient={selectedHighRiskPatient}
      />

      {/* 13. 🎯 SIH 19-Stage Demo Mode Modal */}
      <JudgeScenarioModal
        isOpen={isScenarioModalOpen}
        onClose={() => setIsScenarioModalOpen(false)}
      />

      {/* 14. Why RuralCare? Innovations Modal */}
      <InnovationsModal
        isOpen={isInnovationsModalOpen}
        onClose={() => setIsInnovationsModalOpen(false)}
      />

      {/* 15. SIH Problem Alignment Modal */}
      <SihAlignmentModal
        isOpen={isSihAlignmentModalOpen}
        onClose={() => setIsSihAlignmentModalOpen(false)}
      />

      {/* 16. Technical Architecture Modal */}
      <TechArchitectureModal
        isOpen={isTechArchitectureModalOpen}
        onClose={() => setIsTechArchitectureModalOpen(false)}
      />

      {/* Legacy Modals */}
      <BookDoctorModal
        isOpen={isBookDoctorOpen}
        onClose={() => setIsBookDoctorOpen(false)}
        onStartMatching={() => {}}
      />
      <PrescriptionModal
        isOpen={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
        prescription={activePrescription}
      />
    </div>
  );
};

export default function App() {
  return (
    <NetworkProvider>
      <LanguageProvider>
        <AuthProvider>
          <NotificationProvider>
            <MainApp />
          </NotificationProvider>
        </AuthProvider>
      </LanguageProvider>
    </NetworkProvider>
  );
}
