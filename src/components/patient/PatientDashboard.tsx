import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { mockDoctors, mockPatients } from '../../data/mockData';
import { calculateHaversineDistance, estimateEtaMinutes } from '../../services/matchingService';
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
  UserCheck,
  Phone,
  CheckCircle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Doctor } from '../../types';

interface PatientDashboardProps {
  onOpenBooking: (preselectedCategory?: string) => void;
  onOpenSos: () => void;
  onNavigateTab: (tab: string) => void;
  onSelectDoctorDirectly: (doctor: Doctor) => void;
  activeVisitRequest?: any;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  onOpenBooking,
  onOpenSos,
  onNavigateTab,
  onSelectDoctorDirectly,
  activeVisitRequest
}) => {
  const { currentPatient } = useAuth();
  const { t } = useLanguage();
  const patient = currentPatient || mockPatients[0];

  // Calculate distance to doctors and sort nearest
  const nearbyDoctorsWithDist = mockDoctors
    .filter((d) => d.isVerified && d.isAvailable)
    .map((doc) => {
      const dist = calculateHaversineDistance(patient.lat, patient.lng, doc.lat, doc.lng);
      return {
        ...doc,
        distanceKm: dist,
        eta: estimateEtaMinutes(dist)
      };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fadeIn">
      {/* Patient Header Greeting */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-2xl -z-0" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>ABHA ID: {patient.abhaId}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Namaste, {patient.name}
            </h1>
            <div className="flex items-center gap-2 text-emerald-100 text-sm mt-1">
              <MapPin className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>{patient.village}, Taluka {patient.taluka}, Dist. {patient.district}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3 text-xs text-emerald-200">
              <span className="bg-emerald-950/50 px-2.5 py-1 rounded-md border border-emerald-500/30">
                Blood Group: <strong className="text-white">{patient.bloodGroup}</strong>
              </span>
              <span className="bg-emerald-950/50 px-2.5 py-1 rounded-md border border-emerald-500/30">
                Primary PHC: <strong className="text-white">PHC Karegaon (800m)</strong>
              </span>
            </div>
          </div>

          {/* MAIN EMERGENCY SOS BUTTON */}
          <div className="flex flex-col items-center md:items-end justify-center">
            <button
              onClick={onOpenSos}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-black text-lg rounded-2xl shadow-xl shadow-red-600/40 transform hover:scale-105 transition flex items-center justify-center gap-3 border-2 border-red-400/40 animate-pulse-fast"
            >
              <AlertTriangle className="w-6 h-6" />
              <span className="tracking-wide">🚨 {t.emergencySos}</span>
            </button>
            <span className="text-[11px] text-emerald-200/80 mt-1 text-center md:text-right">
              Direct dispatch to 108 Emergency Medical Services
            </span>
          </div>
        </div>
      </div>

      {/* Active Visit Notification Banner if any */}
      {activeVisitRequest && activeVisitRequest.status !== 'completed' && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
              <Clock className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                Visit In Progress
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                {activeVisitRequest.doctorName || 'Doctor Assigned'} is{' '}
                {activeVisitRequest.status === 'en_route' ? 'En Route to Your Doorstep' : activeVisitRequest.status}
              </h3>
              <p className="text-xs text-slate-600">
                ETA: {activeVisitRequest.etaMinutes} mins • {activeVisitRequest.symptoms}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('live-tracking')}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
          >
            <span>Open Live Tracking Map</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Primary Action Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <span>Healthcare Services</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-health-100 text-health-800">
              Doorstep Delivery
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Book a Doctor */}
          <div
            onClick={() => onOpenBooking()}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-health-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-health-100 text-health-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="font-black text-slate-900 text-base group-hover:text-health-700 transition">
                {t.bookDoctor}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Request a nearby physician to visit your home today.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-health-700">
              <span>Book Visit</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Medical Records */}
          <div
            onClick={() => onNavigateTab('records')}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-black text-slate-900 text-base group-hover:text-blue-700 transition">
                {t.medicalRecords}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Unified ABHA timeline across all visits, PHCs, and hospitals.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700">
              <span>View History</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Medicine Availability */}
          <div
            onClick={() => onNavigateTab('medicines')}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Pill className="w-6 h-6" />
              </div>
              <h3 className="font-black text-slate-900 text-base group-hover:text-emerald-700 transition">
                {t.medicines}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Check real-time drug stocks at Karegaon PHC & nearby facilities.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
              <span>Check Stocks</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Active Referrals */}
          <div
            onClick={() => onNavigateTab('records')}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-purple-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Share2 className="w-6 h-6" />
              </div>
              <h3 className="font-black text-slate-900 text-base group-hover:text-purple-700 transition">
                {t.referrals}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Track specialist and district hospital consultation referrals.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700">
              <span>View Referrals</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Nearest Available Doctors Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              Nearest Available Doctors
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified healthcare professionals currently on-duty in Shirur & surrounding talukas.
            </p>
          </div>
          <button
            onClick={() => onOpenBooking()}
            className="px-4 py-2 bg-health-50 text-health-800 hover:bg-health-100 text-xs font-bold rounded-xl border border-health-200 transition flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5 text-health-600" />
            <span>Request by Symptom</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nearbyDoctorsWithDist.slice(0, 3).map((doc) => (
            <div
              key={doc.id}
              className="p-4 rounded-2xl border border-slate-200 hover:border-health-400 bg-slate-50/50 hover:bg-white transition-all shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-3">
                  <img
                    src={doc.avatar}
                    alt={doc.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-extrabold text-slate-900 text-sm truncate">
                        {doc.name}
                      </h3>
                      <span title="Verified MMC Doctor">
                        <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium truncate">
                      {doc.specialization}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {doc.qualification} • {doc.experience} yrs exp
                    </p>
                  </div>
                </div>

                <div className="mt-3.5 pt-3 border-t border-slate-200/80 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-white p-1.5 rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Distance</div>
                    <div className="font-extrabold text-slate-800">{doc.distanceKm} km</div>
                  </div>
                  <div className="bg-white p-1.5 rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">ETA</div>
                    <div className="font-extrabold text-emerald-700">{doc.eta} min</div>
                  </div>
                  <div className="bg-white p-1.5 rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Rating</div>
                    <div className="font-extrabold text-amber-600 flex items-center justify-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>{doc.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectDoctorDirectly(doc)}
                className="mt-4 w-full py-2.5 bg-health-700 hover:bg-health-800 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
              >
                <span>Request Visit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Low Tech Support Callout */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h4 className="font-bold text-sm">No smartphone or low internet?</h4>
            <p className="text-xs text-slate-300">
              Book via Toll-Free IVR (1800-RURAL-CARE) or connect with your village ASHA worker.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigateTab('fallback')}
          className="px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-bold text-xs shrink-0 transition"
        >
          View SMS & IVR Details
        </button>
      </div>
    </div>
  );
};
