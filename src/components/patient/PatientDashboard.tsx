import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { mockDoctors, mockPatients, mockNearbyProviders } from '../../data/mockData';
import { calculateHaversineDistance, estimateEtaMinutes } from '../../services/matchingService';
import { getQueueItems } from '../../services/queueService';
import {
  AlertTriangle,
  Calendar,
  Clock,
  FileText,
  HeartPulse,
  MapPin,
  Pill,
  Share2,
  Sparkles,
  Star,
  Stethoscope,
  Phone,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Video,
  Activity,
  Home,
  Ticket,
  UserCheck,
  ChevronRight,
  Bell
} from 'lucide-react';
import { Doctor, NearbyProvider } from '../../types';

interface PatientDashboardProps {
  onOpenBooking: () => void;
  onOpenCareNearMe: () => void;
  onOpenHomeVisit: (provider?: NearbyProvider) => void;
  onOpenTeleconsult: () => void;
  onOpenMedicineSearch: () => void;
  onOpenDiagnostics: () => void;
  onOpenRecords: () => void;
  onOpenReferralTracking: () => void;
  onOpenSos: () => void;
  onOpenTriage: () => void;
  onSelectDoctorDirectly: (doctor: Doctor) => void;
  activeVisitRequest?: any;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  onOpenBooking,
  onOpenCareNearMe,
  onOpenHomeVisit,
  onOpenTeleconsult,
  onOpenMedicineSearch,
  onOpenDiagnostics,
  onOpenRecords,
  onOpenReferralTracking,
  onOpenSos,
  onOpenTriage,
  onSelectDoctorDirectly,
  activeVisitRequest
}) => {
  const { currentPatient } = useAuth();
  const { t } = useLanguage();
  const patient = currentPatient || mockPatients[0];
  const queueItems = getQueueItems();

  // Find user's active token if in queue
  const userQueueItem = queueItems.find((q) => q.patientId === patient.id && q.status === 'waiting') || {
    tokenNumber: 'A-027',
    estimatedWaitMinutes: 28,
    priority: 'normal'
  };

  const currentlyServing = queueItems.find((q) => q.status === 'in_consultation') || {
    tokenNumber: 'A-021',
    patientName: 'Anandi Bai Shinde'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-7 animate-fadeIn">
      {/* 1. Header Banner & Profile */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -z-0" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>ABHA ID: {patient.abhaId}</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                Primary PHC Karegaon (800m)
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Namaste, {patient.name}
            </h1>

            <div className="flex items-center gap-2 text-emerald-100 text-xs sm:text-sm">
              <MapPin className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>Village {patient.village}, Taluka {patient.taluka}, District {patient.district}</span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1 text-xs">
              <span className="bg-slate-950/40 px-2.5 py-1 rounded-lg border border-white/10">
                Blood Group: <strong className="text-white">{patient.bloodGroup}</strong>
              </span>
              <span className="bg-slate-950/40 px-2.5 py-1 rounded-lg border border-white/10">
                Allergies: <strong className="text-amber-300">{patient.allergies.join(', ') || 'None Known'}</strong>
              </span>
              <span className="bg-slate-950/40 px-2.5 py-1 rounded-lg border border-white/10">
                Conditions: <strong className="text-white">{patient.medicalConditions.join(', ')}</strong>
              </span>
            </div>
          </div>

          {/* HIGHLY VISIBLE EMERGENCY SOS BUTTON */}
          <div className="flex flex-col items-start lg:items-end justify-center shrink-0">
            <button
              onClick={onOpenSos}
              className="w-full sm:w-auto px-7 py-4 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-black text-lg rounded-2xl shadow-xl shadow-red-600/40 transform hover:scale-105 transition flex items-center justify-center gap-3 border-2 border-red-400/40 animate-pulse-fast"
            >
              <AlertTriangle className="w-6 h-6" />
              <span className="tracking-wide">🚨 {t.emergencySos}</span>
            </button>
            <span className="text-[11px] text-emerald-200/80 mt-1.5 text-center lg:text-right">
              Direct dispatch to 108 Emergency Medical Services
            </span>
          </div>
        </div>
      </div>

      {/* 2. PRIMARY ACTIONS GRID (All 9 Major Functions) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <span>Primary Healthcare Services</span>
            <span className="text-xs font-normal text-slate-500 hidden sm:inline">| Tap any action to launch</span>
          </h2>
          <button
            onClick={onOpenTriage}
            className="text-xs font-extrabold text-teal-800 hover:text-teal-900 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 flex items-center gap-1 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>AI Symptom Triage</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* 1. Book Doctor */}
          <button
            onClick={onOpenBooking}
            className="p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-emerald-500 hover:shadow-md transition text-left group flex flex-col justify-between"
          >
            <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-sm sm:text-base group-hover:text-emerald-700 transition">
                Book Doctor
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Specialist & General OPD
              </div>
            </div>
          </button>

          {/* 2. Check Nearby Care */}
          <button
            onClick={onOpenCareNearMe}
            className="p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-emerald-500 hover:shadow-md transition text-left group flex flex-col justify-between"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-sm sm:text-base group-hover:text-emerald-700 transition">
                Care Near Me
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Doctor, ASHA & Nurse
              </div>
            </div>
          </button>

          {/* 3. Request Home Visit */}
          <button
            onClick={() => onOpenHomeVisit()}
            className="p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-emerald-500 hover:shadow-md transition text-left group flex flex-col justify-between"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-sm sm:text-base group-hover:text-emerald-700 transition">
                Request Home Visit
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Doorstep care protocol
              </div>
            </div>
          </button>

          {/* 4. Teleconsultation */}
          <button
            onClick={onOpenTeleconsult}
            className="p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-emerald-500 hover:shadow-md transition text-left group flex flex-col justify-between"
          >
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-sm sm:text-base group-hover:text-emerald-700 transition">
                Teleconsultation
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Video/Audio with PHC Doctor
              </div>
            </div>
          </button>

          {/* 5. Medicine Availability */}
          <button
            onClick={onOpenMedicineSearch}
            className="p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-emerald-500 hover:shadow-md transition text-left group flex flex-col justify-between"
          >
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-sm sm:text-base group-hover:text-emerald-700 transition">
                Medicine Availability
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Real-time PHC stock status
              </div>
            </div>
          </button>

          {/* 6. Diagnostic Tests */}
          <button
            onClick={onOpenDiagnostics}
            className="p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-emerald-500 hover:shadow-md transition text-left group flex flex-col justify-between"
          >
            <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-sm sm:text-base group-hover:text-emerald-700 transition">
                Diagnostic Tests
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                CBC, ECG, X-Ray booking
              </div>
            </div>
          </button>

          {/* 7. My Records */}
          <button
            onClick={onOpenRecords}
            className="p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-emerald-500 hover:shadow-md transition text-left group flex flex-col justify-between"
          >
            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-sm sm:text-base group-hover:text-emerald-700 transition">
                My Records
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Longitudinal 2026 timeline
              </div>
            </div>
          </button>

          {/* 8. Track Referral */}
          <button
            onClick={onOpenReferralTracking}
            className="p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-emerald-500 hover:shadow-md transition text-left group flex flex-col justify-between"
          >
            <div className="w-11 h-11 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-sm sm:text-base group-hover:text-emerald-700 transition">
                Track Referral
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                PHC → CHC → District
              </div>
            </div>
          </button>

          {/* 9. Emergency SOS */}
          <button
            onClick={onOpenSos}
            className="p-4 rounded-2xl bg-red-50/80 border-2 border-red-300 hover:border-red-600 hover:shadow-md transition text-left group flex flex-col justify-between"
          >
            <div className="w-11 h-11 rounded-xl bg-red-600 text-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-red-900 text-sm sm:text-base">
                Emergency SOS
              </div>
              <div className="text-[11px] text-red-700 mt-0.5">
                108 EMS & Ambulance
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* 3. TWO COLUMN SECTION: Dynamic Token Widget & Longitudinal Health Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Digital Token & Live Queue Card (Requirements 8 & 9) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gradient-to-br from-slate-900 to-teal-950 text-white rounded-3xl p-6 shadow-xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-emerald-400" />
                <span className="font-black text-sm uppercase tracking-wide">PHC Outpatient Queue</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Live Dynamic Queue
              </span>
            </div>

            <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800 text-center space-y-1">
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Your Assigned Token
              </div>
              <div className="text-4xl sm:text-5xl font-black text-emerald-300 font-mono">
                {userQueueItem.tokenNumber}
              </div>
              <div className="text-xs text-slate-300 pt-1">
                Now Serving: <strong className="text-white font-bold">{currentlyServing.tokenNumber}</strong> ({currentlyServing.patientName})
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                <span className="text-[10px] text-slate-400 block">Estimated Waiting Time</span>
                <strong className="text-amber-300 text-sm font-black">{userQueueItem.estimatedWaitMinutes} Minutes</strong>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                <span className="text-[10px] text-slate-400 block">Queue Priority</span>
                <strong className="text-emerald-300 text-sm font-black uppercase">{userQueueItem.priority}</strong>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800 pt-3 italic">
              "Queue priority is dynamically regulated by authorized public health doctors based on clinical urgency, not solely first-come-first-served."
            </p>
          </div>

          {/* Follow-up Reminders Card (Requirement 3 & 19) */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-600" />
                <span>Follow-up Reminders</span>
              </h3>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                Action Due
              </span>
            </div>

            <div className="space-y-2">
              {/* Emergency Post-Stabilization Follow-up */}
              <div className="p-3 bg-red-50/80 rounded-2xl border border-red-200 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-red-900 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                    ⚠️ Post-Emergency Follow-up Due
                  </span>
                  <span className="text-[10px] font-black text-red-700 uppercase bg-white px-2 py-0.5 rounded border border-red-200">
                    High Priority
                  </span>
                </div>
                <div className="text-slate-700 font-medium">
                  Post-Emergency Cardiac / Trauma Monitoring & Vitals
                </div>
                <div className="text-slate-500">
                  Scheduled with: Dr. Priya Sharma & ASHA Lakshmi Devi
                </div>
                <div className="text-[11px] text-red-700 font-bold flex items-center gap-1 pt-0.5">
                  <Clock className="w-3.5 h-3.5" /> Tomorrow, 10:00 AM • "Your healthcare follow-up is due."
                </div>
              </div>

              {/* Routine Chronic Follow-up */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-xs">
                <div className="font-extrabold text-slate-800">
                  Hypertension & Fasting Sugar Follow-up
                </div>
                <div className="text-slate-500">
                  Scheduled with: Dr. Priya Sharma • PHC Karegaon
                </div>
                <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 pt-1">
                  <Calendar className="w-3.5 h-3.5" /> Due Date: 16 Sept 2026 (In 2 Days)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Health Status & Nearby Providers (Requirements 3 & 4) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Health Vitals Strip */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-emerald-600" />
                <span>Current Health Profile & Vitals</span>
              </h3>
              <span className="text-xs text-slate-400 font-semibold">Last Checked: 10 Sept 2026</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Blood Pressure</div>
                <div className="text-base font-black text-slate-900 mt-1">128/84 mmHg</div>
                <span className="text-[10px] font-bold text-emerald-700">Borderline</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Blood Glucose</div>
                <div className="text-base font-black text-slate-900 mt-1">118 mg/dL</div>
                <span className="text-[10px] font-bold text-emerald-700">Controlled</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Pulse Rate</div>
                <div className="text-base font-black text-slate-900 mt-1">74 bpm</div>
                <span className="text-[10px] font-bold text-emerald-700">Normal Sinus</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Oxygen (SpO2)</div>
                <div className="text-base font-black text-slate-900 mt-1">98%</div>
                <span className="text-[10px] font-bold text-emerald-700">Optimal</span>
              </div>
            </div>
          </div>

          {/* Nearby Authorized Providers Module (Requirement 4) */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-emerald-600" />
                  <span>Nearby Healthcare Personnel</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Available for doorstep care and consultations</p>
              </div>
              <button
                onClick={onOpenCareNearMe}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>View All ({mockNearbyProviders.length})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {mockNearbyProviders.slice(0, 3).map((prov) => (
                <div
                  key={prov.id}
                  className="p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-400 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={prov.avatar}
                      alt={prov.name}
                      className="w-12 h-12 rounded-xl object-cover border border-emerald-400 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-slate-900 text-sm">{prov.name}</span>
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full">
                          {prov.role === 'doctor' ? 'Doctor' : prov.role === 'asha' ? 'ASHA' : 'Nurse'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">{prov.specialization}</div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-600 pt-0.5 font-medium">
                        <span className="flex items-center gap-0.5">
                          <MapPin className="w-3 h-3 text-emerald-600" /> {prov.distanceKm} km
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5 text-teal-700 font-bold">
                          <Clock className="w-3 h-3" /> ETA: {prov.etaMinutes} min
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenHomeVisit(prov)}
                    className="px-3.5 py-2 bg-white hover:bg-emerald-700 hover:text-white text-slate-800 border border-slate-300 font-bold text-xs rounded-xl transition shadow-sm self-end sm:self-center"
                  >
                    Request Visit
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
