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
import { BookDoctorModal } from './components/patient/BookDoctorModal';
import { DoctorMatchingModal } from './components/patient/DoctorMatchingModal';
import { LiveTrackingView } from './components/patient/LiveTrackingView';
import { MedicalRecordsView } from './components/patient/MedicalRecordsView';
import { PrescriptionModal } from './components/patient/PrescriptionModal';
import { MedicineFinderView } from './components/patient/MedicineFinderView';
import { SmsIvrFallbackView } from './components/patient/SmsIvrFallbackView';
import { PatientProfileModal } from './components/patient/PatientProfileModal';

// Doctor Components
import { DoctorDashboard } from './components/doctor/DoctorDashboard';
import { DoctorVerificationModal } from './components/doctor/DoctorVerificationModal';
import { VisitWorkflowModal } from './components/doctor/VisitWorkflowModal';

// Emergency SOS & Admin
import { EmergencySosModal } from './components/emergency/EmergencySosModal';
import { GovernmentDashboard } from './components/admin/GovernmentDashboard';

// Judge Presentation Mode
import { JudgeDemoBar } from './components/judge/JudgeDemoBar';

// Types & Mock Data
import { Doctor, Prescription, VisitCategory, VisitRequest, VisitUrgency } from './types';
import { mockDoctors, mockPatients } from './data/mockData';
import { Home, FileText, Pill, AlertTriangle, User, Navigation, Stethoscope, Building2, ShieldCheck } from 'lucide-react';

const MainApp: React.FC = () => {
  const { role, switchRole, currentPatient, currentDoctor } = useAuth();
  const { addNotification } = useNotifications();

  // Active Tab state
  const [activeTab, setActiveTab] = useState<string>('home');

  // Modals state
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isBookDoctorOpen, setIsBookDoctorOpen] = useState(false);
  const [isMatchingOpen, setIsMatchingOpen] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);

  // Active visit and matching payload
  const [matchingParams, setMatchingParams] = useState<{
    category: VisitCategory;
    symptoms: string;
    urgency: VisitUrgency;
    lat: number;
    lng: number;
    address: string;
  }>({
    category: 'fever',
    symptoms: 'High fever (102°F) and headache.',
    urgency: 'soon',
    lat: 18.8256,
    lng: 74.3721,
    address: 'Near Vitthal Temple, Karegaon, Shirur'
  });

  const [activeDoctor, setActiveDoctor] = useState<Doctor>(mockDoctors[0]);
  const [activeVisitRequest, setActiveVisitRequest] = useState<VisitRequest | null>(null);
  const [activePrescription, setActivePrescription] = useState<Prescription | null>(null);

  // Handlers for Booking & Matching Flow
  const handleStartMatching = (reqData: any) => {
    setMatchingParams(reqData);
    setIsMatchingOpen(true);
  };

  const handleDoctorAccepted = (matchedDoc: Doctor, distanceKm: number, etaMin: number) => {
    setActiveDoctor(matchedDoc);

    const visitReq: VisitRequest = {
      id: `req-${Date.now()}`,
      patientId: currentPatient?.id || 'pat-1',
      patientName: currentPatient?.name || 'Ramesh Patil',
      patientAge: currentPatient?.age || 48,
      patientGender: currentPatient?.gender || 'Male',
      category: matchingParams.category,
      symptoms: matchingParams.symptoms,
      urgency: matchingParams.urgency,
      lat: matchingParams.lat,
      lng: matchingParams.lng,
      address: matchingParams.address,
      preferredLanguage: 'mr',
      doctorId: matchedDoc.id,
      doctorName: matchedDoc.name,
      doctorSpecialty: matchedDoc.specialization,
      status: 'en_route',
      distanceKm,
      etaMinutes: etaMin,
      requestedAt: new Date().toISOString()
    };

    setActiveVisitRequest(visitReq);
    addNotification(
      'Visit Request Accepted',
      `${matchedDoc.name} is en route to your doorstep (${distanceKm} km, ETA: ${etaMin} min).`,
      'visit',
      'patient'
    );
    setActiveTab('live-tracking');
  };

  const handleSelectDoctorDirectly = (doc: Doctor) => {
    setActiveDoctor(doc);
    handleStartMatching({
      category: 'general',
      symptoms: 'Doorstep checkup request',
      urgency: 'soon',
      lat: currentPatient?.lat || 18.8256,
      lng: currentPatient?.lng || 74.3721,
      address: 'Karegaon, Shirur'
    });
  };

  const handleViewPrescriptionById = (pId: string) => {
    setIsPrescriptionModalOpen(true);
  };

  // 1-Click Judge Guided Scenarios
  const triggerPatientJourney = () => {
    switchRole('patient');
    setActiveTab('home');
    setIsBookDoctorOpen(true);
  };

  const triggerDoctorJourney = () => {
    switchRole('doctor');
    setActiveTab('doctor-dashboard');
    // Prepare a sample pending request and launch workflow
    const sampleReq: VisitRequest = {
      id: `req-judge-${Date.now()}`,
      patientId: 'pat-1',
      patientName: 'Ramesh Patil',
      patientAge: 48,
      patientGender: 'Male',
      category: 'fever',
      symptoms: 'High fever (102°F), shivering, and acute weakness since yesterday.',
      urgency: 'urgent',
      lat: 18.8256,
      lng: 74.3721,
      address: 'Near Vitthal Temple, Karegaon, Tal. Shirur',
      preferredLanguage: 'mr',
      doctorId: mockDoctors[0].id,
      doctorName: mockDoctors[0].name,
      status: 'accepted',
      distanceKm: 1.8,
      etaMinutes: 8,
      requestedAt: 'Just now'
    };
    setActiveVisitRequest(sampleReq);
    setIsWorkflowModalOpen(true);
  };

  const triggerEmergencySos = () => {
    setIsSosModalOpen(true);
  };

  const triggerGovernmentDashboard = () => {
    switchRole('admin');
    setActiveTab('admin-dashboard');
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
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Dynamic View Content */}
      <main className="flex-1">
        {/* LANDING VIEW */}
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
              switchRole('admin');
              setActiveTab('admin-dashboard');
            }}
          />
        )}

        {/* PATIENT VIEWS */}
        {role === 'patient' && (
          <>
            {activeTab === 'home' && (
              <PatientDashboard
                onOpenBooking={(cat) => setIsBookDoctorOpen(true)}
                onOpenSos={() => setIsSosModalOpen(true)}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onSelectDoctorDirectly={handleSelectDoctorDirectly}
                activeVisitRequest={activeVisitRequest}
              />
            )}

            {activeTab === 'live-tracking' && (
              <LiveTrackingView
                doctor={activeDoctor}
                patientLat={matchingParams.lat}
                patientLng={matchingParams.lng}
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
                onViewPrescriptionById={handleViewPrescriptionById}
              />
            )}

            {activeTab === 'medicines' && <MedicineFinderView />}

            {activeTab === 'fallback' && <SmsIvrFallbackView />}
          </>
        )}

        {/* DOCTOR VIEWS */}
        {role === 'doctor' && (
          <>
            {(activeTab === 'doctor-dashboard' || activeTab === 'home') && (
              <DoctorDashboard
                onStartWorkflow={(req) => {
                  setActiveVisitRequest(req);
                  setIsWorkflowModalOpen(true);
                }}
                onOpenVerification={() => setIsVerificationModalOpen(true)}
              />
            )}

            {activeTab === 'doctor-verification' && (
              <div className="p-6">
                <button
                  onClick={() => setIsVerificationModalOpen(true)}
                  className="px-6 py-3 bg-health-700 text-white font-bold rounded-xl"
                >
                  Open Verification Window
                </button>
              </div>
            )}
          </>
        )}

        {/* ADMIN VIEWS */}
        {role === 'admin' && (
          <GovernmentDashboard />
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
                activeTab === 'home' ? 'text-health-700' : 'text-slate-500'
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </button>
            <button
              onClick={() => setActiveTab(activeVisitRequest ? 'live-tracking' : 'records')}
              className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-bold ${
                activeTab === 'live-tracking' ? 'text-health-700' : 'text-slate-500'
              }`}
            >
              <Navigation className="w-5 h-5" />
              <span>Track Visit</span>
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
                activeTab === 'records' ? 'text-health-700' : 'text-slate-500'
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

        {role === 'doctor' && (
          <>
            <button
              onClick={() => setActiveTab('doctor-dashboard')}
              className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-bold ${
                activeTab === 'doctor-dashboard' ? 'text-health-700' : 'text-slate-500'
              }`}
            >
              <Stethoscope className="w-5 h-5" />
              <span>Console</span>
            </button>
            <button
              onClick={() => setIsVerificationModalOpen(true)}
              className="flex flex-col items-center gap-0.5 p-1 text-[10px] font-bold text-slate-500"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Verify</span>
            </button>
            <button
              onClick={() => setIsRoleModalOpen(true)}
              className="flex flex-col items-center gap-0.5 p-1 text-[10px] font-bold text-slate-500"
            >
              <User className="w-5 h-5" />
              <span>Switch Role</span>
            </button>
          </>
        )}

        {role === 'admin' && (
          <>
            <button
              onClick={() => setActiveTab('admin-dashboard')}
              className="flex flex-col items-center gap-0.5 p-1 text-[10px] font-bold text-health-700"
            >
              <Building2 className="w-5 h-5" />
              <span>District Command</span>
            </button>
            <button
              onClick={() => setIsRoleModalOpen(true)}
              className="flex flex-col items-center gap-0.5 p-1 text-[10px] font-bold text-slate-500"
            >
              <User className="w-5 h-5" />
              <span>Switch Role</span>
            </button>
          </>
        )}
      </nav>

      {/* Floating Judge Presentation Demo Bar */}
      <JudgeDemoBar
        onTriggerPatientJourney={triggerPatientJourney}
        onTriggerDoctorJourney={triggerDoctorJourney}
        onTriggerEmergencySos={triggerEmergencySos}
        onTriggerGovernmentDashboard={triggerGovernmentDashboard}
      />

      {/* MODALS */}
      {/* 1. Role Selection Modal */}
      <RoleSelectModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        onRoleSelected={(newRole) => {
          if (newRole === 'patient') setActiveTab('home');
          else if (newRole === 'doctor') setActiveTab('doctor-dashboard');
          else setActiveTab('admin-dashboard');
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

      {/* 4. Book Doctor Wizard Modal */}
      <BookDoctorModal
        isOpen={isBookDoctorOpen}
        onClose={() => setIsBookDoctorOpen(false)}
        onStartMatching={handleStartMatching}
      />

      {/* 5. Nearest Doctor Matching Radar Modal */}
      <DoctorMatchingModal
        isOpen={isMatchingOpen}
        onClose={() => setIsMatchingOpen(false)}
        patientLat={matchingParams.lat}
        patientLng={matchingParams.lng}
        category={matchingParams.category}
        urgency={matchingParams.urgency}
        patientId={currentPatient?.id || 'pat-1'}
        onDoctorAccepted={handleDoctorAccepted}
      />

      {/* 6. Digital Prescription Modal */}
      <PrescriptionModal
        isOpen={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
        prescription={
          activePrescription || {
            id: 'rx-demo-1',
            visitId: 'visit-1',
            patientId: 'pat-1',
            patientName: 'Ramesh Patil',
            patientAge: 48,
            patientGender: 'Male',
            doctorId: 'doc-1',
            doctorName: 'Dr. Priya Sharma',
            doctorQualification: 'MBBS, MD (General Medicine)',
            doctorLicense: 'MMC/2016/08/2341',
            facilityName: 'RuralCare Connect Mobile Clinic (Shirur PHC Circle)',
            date: '2026-09-09',
            vitals: {
              temperature: '101.4 °F',
              bloodPressure: '124/82 mmHg',
              heartRate: '84 bpm',
              spO2: '98%'
            },
            diagnosis: 'Acute Viral Pyrexia (Viral Fever)',
            medicines: [
              {
                name: 'Paracetamol 500mg',
                dosage: '500 mg',
                frequency: '1-0-1 (After Food)',
                duration: '3 Days',
                instructions: 'Take with warm water for fever'
              },
              {
                name: 'ORS (Oral Rehydration Salts)',
                dosage: '1 Sachet',
                frequency: 'As needed (1 Litre water)',
                duration: '3 Days',
                instructions: 'Sip throughout the day for hydration'
              }
            ],
            instructions: 'Adequate hydration, bed rest. If fever persists past 48 hours, blood test recommended.',
            followUpDate: '2026-09-12 (In 3 Days)'
          }
        }
      />

      {/* 7. Doctor Verification Modal */}
      <DoctorVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
      />

      {/* 8. Doctor Visit Workflow Modal */}
      {activeVisitRequest && (
        <VisitWorkflowModal
          isOpen={isWorkflowModalOpen}
          onClose={() => setIsWorkflowModalOpen(false)}
          visitRequest={activeVisitRequest}
          onPrescriptionCreated={(rx) => {
            setActivePrescription(rx);
            setIsPrescriptionModalOpen(true);
            addNotification(
              'Prescription Added',
              `Prescription for ${activeVisitRequest.patientName} created and archived into ABHA health records.`,
              'record',
              'doctor'
            );
          }}
        />
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <NetworkProvider>
          <NotificationProvider>
            <MainApp />
          </NotificationProvider>
        </NetworkProvider>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;
