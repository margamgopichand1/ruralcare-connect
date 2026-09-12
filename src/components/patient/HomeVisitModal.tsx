import React, { useState, useEffect } from 'react';
import { NearbyProvider } from '../../types';
import { mockNearbyProviders } from '../../data/mockData';
import {
  Home,
  CheckCircle2,
  Clock,
  MapPin,
  AlertTriangle,
  UserCheck,
  Stethoscope,
  FileCheck2,
  Calendar,
  ArrowRight,
  ShieldAlert,
  Phone
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface HomeVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedProvider?: NearbyProvider | null;
  onEscalateToEmergency: () => void;
}

const VISIT_REASONS = [
  { id: 'fever', label: 'Fever & Chills', severe: false },
  { id: 'bp_check', label: 'Blood Pressure Monitoring', severe: false },
  { id: 'diabetes', label: 'Diabetes Follow-up & Glucose Check', severe: false },
  { id: 'elderly_care', label: 'Elderly Mobility & General Check', severe: false },
  { id: 'chest_pain', label: 'Severe Crushing Chest Pain', severe: true },
  { id: 'breathing_distress', label: 'Acute Severe Breathlessness', severe: true },
  { id: 'wound_dressing', label: 'Post-operative / Wound Dressing', severe: false },
  { id: 'maternal_check', label: 'Maternal Antenatal / Postnatal Check', severe: false }
];

export const HomeVisitModal: React.FC<HomeVisitModalProps> = ({
  isOpen,
  onClose,
  preselectedProvider,
  onEscalateToEmergency
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedReason, setSelectedReason] = useState('fever');
  const [symptoms, setSymptoms] = useState('Moderate fever (101°F) since morning with joint heaviness.');
  const [address, setAddress] = useState('House No. 42, Near Vitthal Mandir, Karegaon Village, Shirur');
  const [assignedProvider, setAssignedProvider] = useState<NearbyProvider>(
    preselectedProvider || mockNearbyProviders[1] // Default ASHA Lakshmi
  );
  const [simulatedVitals, setSimulatedVitals] = useState({
    bp: '128/82 mmHg',
    pulse: '76 bpm',
    temp: '100.8 °F',
    spo2: '98%'
  });

  const isSevere = VISIT_REASONS.find((r) => r.id === selectedReason)?.severe || false;

  useEffect(() => {
    if (preselectedProvider) {
      setAssignedProvider(preselectedProvider);
    }
  }, [preselectedProvider]);

  if (!isOpen) return null;

  // Step 4 to 10 automated progression when submitted
  const handleProceedToMatching = () => {
    if (isSevere) {
      // Do not allow home visit for severe emergency symptoms!
      return;
    }
    setCurrentStep(4); // Finding provider

    setTimeout(() => {
      setCurrentStep(5); // Provider accepted
    }, 1200);

    setTimeout(() => {
      setCurrentStep(6); // Provider en route
    }, 2400);

    setTimeout(() => {
      setCurrentStep(7); // Provider arrived
    }, 4200);

    setTimeout(() => {
      setCurrentStep(8); // Basic assessment
    }, 5800);

    setTimeout(() => {
      setCurrentStep(9); // Treatment recorded
    }, 7200);

    setTimeout(() => {
      setCurrentStep(10); // Record updated & follow-up scheduled
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }, 8800);
  };

  const handleReset = () => {
    setCurrentStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-800 to-emerald-900 p-5 sm:p-6 text-white relative shrink-0">
          <button
            onClick={handleReset}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-xl font-bold p-1 rounded-lg hover:bg-white/10 transition"
          >
            ✕
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold mb-2">
            <Home className="w-3.5 h-3.5 text-emerald-300" />
            <span>Public Health Outreach • 10-Step Home Visit Workflow</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Request Doorstep Home Healthcare</h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1">
            Certified frontline health workers and visiting physicians providing primary check-ups at your doorstep.
          </p>
        </div>

        {/* Severe Symptom Warning Alert */}
        {isSevere && (
          <div className="bg-red-50 border-l-4 border-red-600 p-4 m-4 rounded-xl flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h4 className="text-sm font-extrabold text-red-900">
                CRITICAL WARNING: Emergency Symptoms Detected
              </h4>
              <p className="text-xs text-red-700 leading-relaxed">
                Home visits are strictly designated for routine and non-emergency care. Conditions like severe chest pain or acute breathlessness require immediate Advanced Life Support and hospital transfer.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onEscalateToEmergency();
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-lg shadow-md flex items-center gap-1.5 animate-pulse"
              >
                <span>🚨 Trigger 108 Emergency Ambulance Immediately</span>
              </button>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* STEP 1: Select Reason */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Step 1 of 3: Select Care Requirement</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {VISIT_REASONS.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedReason(r.id)}
                    className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                      selectedReason === r.id
                        ? r.severe
                          ? 'border-red-500 bg-red-50 text-red-900 font-bold'
                          : 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-sm ring-1 ring-emerald-500'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="text-xs">{r.label}</span>
                    {r.severe && (
                      <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded">Emergency</span>
                    )}
                  </button>
                ))}
              </div>

              {!isSevere && (
                <button
                  onClick={() => setCurrentStep(2)}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-md"
                >
                  <span>Continue to Symptoms & Location</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* STEP 2 & 3: Enter Symptoms & Confirm Location */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Step 2 & 3: Symptoms and Location Confirmation</div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Describe Symptoms & Duration:
                </label>
                <textarea
                  rows={3}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. Mild fever since yesterday, body ache..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Confirm Patient Residence / Landmark:
                </label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Matched Personnel Preview */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <img
                    src={assignedProvider.avatar}
                    alt={assignedProvider.name}
                    className="w-10 h-10 rounded-xl object-cover border border-emerald-400 shrink-0"
                  />
                  <div>
                    <div className="font-extrabold text-slate-800">{assignedProvider.name}</div>
                    <div className="text-[11px] text-slate-500">{assignedProvider.specialization} ({assignedProvider.distanceKm} km away)</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Assigned Provider
                </span>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  onClick={handleProceedToMatching}
                  className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20"
                >
                  <span>Submit Home Visit Request</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEPS 4 TO 10: SIMULATED LIVE PROGRESSION */}
          {currentStep >= 4 && (
            <div className="space-y-6 animate-fadeIn">
              {/* Live Status Pipeline Card */}
              <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                    </span>
                    <span className="font-extrabold text-sm text-emerald-300">
                      Live Home Visit Progress
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    Step {currentStep} of 10
                  </span>
                </div>

                {/* Vertical Stepper */}
                <div className="space-y-3 text-xs">
                  {/* Step 4 */}
                  <div className={`flex items-center gap-3 ${currentStep >= 4 ? 'text-white' : 'text-slate-500'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      currentStep > 4 ? 'bg-emerald-600 text-white' : currentStep === 4 ? 'bg-amber-500 text-slate-900 animate-pulse' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {currentStep > 4 ? '✓' : '4'}
                    </div>
                    <span>System identifies nearest authorized provider in Karegaon</span>
                  </div>

                  {/* Step 5 */}
                  <div className={`flex items-center gap-3 ${currentStep >= 5 ? 'text-white' : 'text-slate-500'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      currentStep > 5 ? 'bg-emerald-600 text-white' : currentStep === 5 ? 'bg-amber-500 text-slate-900 animate-pulse' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {currentStep > 5 ? '✓' : '5'}
                    </div>
                    <span>Provider {assignedProvider.name} accepted visit request</span>
                  </div>

                  {/* Step 6 */}
                  <div className={`flex items-center gap-3 ${currentStep >= 6 ? 'text-white' : 'text-slate-500'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      currentStep > 6 ? 'bg-emerald-600 text-white' : currentStep === 6 ? 'bg-blue-500 text-white animate-pulse' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {currentStep > 6 ? '✓' : '6'}
                    </div>
                    <span>Provider Travelling (ETA: {assignedProvider.etaMinutes} minutes)</span>
                  </div>

                  {/* Step 7 */}
                  <div className={`flex items-center gap-3 ${currentStep >= 7 ? 'text-white' : 'text-slate-500'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      currentStep > 7 ? 'bg-emerald-600 text-white' : currentStep === 7 ? 'bg-teal-500 text-white animate-pulse' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {currentStep > 7 ? '✓' : '7'}
                    </div>
                    <span>Provider Arrived at doorstep ({address})</span>
                  </div>

                  {/* Step 8 */}
                  <div className={`flex items-center gap-3 ${currentStep >= 8 ? 'text-white' : 'text-slate-500'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      currentStep > 8 ? 'bg-emerald-600 text-white' : currentStep === 8 ? 'bg-indigo-500 text-white animate-pulse' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {currentStep > 8 ? '✓' : '8'}
                    </div>
                    <span>Basic assessment & vitals screening performed</span>
                  </div>

                  {/* Step 9 */}
                  <div className={`flex items-center gap-3 ${currentStep >= 9 ? 'text-white' : 'text-slate-500'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      currentStep > 9 ? 'bg-emerald-600 text-white' : currentStep === 9 ? 'bg-purple-500 text-white animate-pulse' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {currentStep > 9 ? '✓' : '9'}
                    </div>
                    <span>Treatment, oral rehydration & tele-guidance recorded</span>
                  </div>

                  {/* Step 10 */}
                  <div className={`flex items-center gap-3 ${currentStep >= 10 ? 'text-white' : 'text-slate-500'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      currentStep === 10 ? 'bg-emerald-500 text-white font-bold ring-2 ring-emerald-300' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {currentStep === 10 ? '✓' : '10'}
                    </div>
                    <span className="font-extrabold text-emerald-300">
                      Patient longitudinal ABHA record updated & Follow-up scheduled!
                    </span>
                  </div>
                </div>
              </div>

              {/* Assessment Summary when completed */}
              {currentStep >= 8 && (
                <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
                    <span>Clinical Assessment Vitals Recorded:</span>
                    <span className="text-emerald-700">Verified by {assignedProvider.name}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="bg-white p-2 rounded-xl border border-emerald-200">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Blood Pressure</div>
                      <div className="font-extrabold text-slate-900">{simulatedVitals.bp}</div>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-emerald-200">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Pulse Rate</div>
                      <div className="font-extrabold text-slate-900">{simulatedVitals.pulse}</div>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-emerald-200">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Temperature</div>
                      <div className="font-extrabold text-slate-900">{simulatedVitals.temp}</div>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-emerald-200">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Oxygen (SpO2)</div>
                      <div className="font-extrabold text-slate-900">{simulatedVitals.spo2}</div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 10 && (
                <div className="space-y-3 pt-2">
                  <div className="bg-white p-4 rounded-2xl border-2 border-emerald-500 text-center space-y-1 shadow-md">
                    <div className="inline-flex p-2 bg-emerald-100 rounded-full text-emerald-800 mb-1">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-black text-slate-900">Home Healthcare Workflow Complete</h3>
                    <p className="text-xs text-slate-600 max-w-md mx-auto">
                      Visit notes and recorded vitals have been synchronized with PHC Karegaon and appended to your longitudinal health record.
                    </p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm rounded-xl transition shadow-md"
                  >
                    Done & Return to Dashboard
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
