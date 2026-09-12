import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockHighRiskPatients, mockNearbyProviders } from '../../data/mockData';
import { HighRiskPatient } from '../../types';
import {
  HeartHandshake,
  Users,
  Home,
  Share2,
  AlertTriangle,
  Calendar,
  Pill,
  Activity,
  Plus,
  Search,
  CheckCircle2,
  Phone,
  Sparkles,
  MapPin,
  Clock,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface HealthWorkerDashboardProps {
  onOpenRegisterPatient: () => void;
  onOpenTriage: () => void;
  onOpenHomeVisit: () => void;
  onOpenReferralTracking: () => void;
  onOpenMedicineSearch: () => void;
  onOpenDiagnostics: () => void;
  onOpenRecords: () => void;
  onOpenHighRiskDetails: (patient: HighRiskPatient) => void;
}

export const HealthWorkerDashboard: React.FC<HealthWorkerDashboardProps> = ({
  onOpenRegisterPatient,
  onOpenTriage,
  onOpenHomeVisit,
  onOpenReferralTracking,
  onOpenMedicineSearch,
  onOpenDiagnostics,
  onOpenRecords,
  onOpenHighRiskDetails
}) => {
  const { user } = useAuth();
  const [highRiskList, setHighRiskList] = useState<HighRiskPatient[]>(mockHighRiskPatients);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredHighRisk = highRiskList.filter((p) => {
    if (selectedCategory !== 'all' && p.conditionCategory !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-7 animate-fadeIn">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-700/60 border-2 border-emerald-400 flex items-center justify-center text-white shrink-0 shadow-md">
            <HeartHandshake className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Frontline Community Health Worker (ASHA)
              </span>
              <span className="text-slate-300 text-xs">Sub-Centre Karegaon</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">{user?.name || 'Lakshmi Devi (ASHA)'}</h1>
            <p className="text-xs sm:text-sm text-emerald-100">
              Assigned Coverage: Karegaon Wards 1 to 4 • Population: 1,840 • Primary PHC: PHC Karegaon
            </p>
          </div>
        </div>

        <button
          onClick={onOpenRegisterPatient}
          className="px-5 py-3 bg-white hover:bg-emerald-50 text-emerald-900 font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4 text-emerald-700" />
          <span>Register New Patient (Offline Capable)</span>
        </button>
      </div>

      {/* METRICS SUMMARY */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Today's Home Visits</span>
          <div className="text-3xl font-black text-slate-900 mt-1 font-mono">05</div>
          <span className="text-[11px] text-emerald-700 font-semibold">3 Completed • 2 Scheduled</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">High-Risk Patients</span>
          <div className="text-3xl font-black text-red-600 mt-1 font-mono">04</div>
          <span className="text-[11px] text-red-700 font-semibold">2 Action Overdue</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Active Referrals</span>
          <div className="text-3xl font-black text-teal-700 mt-1 font-mono">03</div>
          <span className="text-[11px] text-teal-700 font-semibold">Tracking to Rural Hospital</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Teleconsultations</span>
          <div className="text-3xl font-black text-purple-700 mt-1 font-mono">08</div>
          <span className="text-[11px] text-purple-700 font-semibold">PHC Specialist Link</span>
        </div>
      </div>

      {/* PRIMARY ASHA ACTIONS */}
      <div>
        <h2 className="text-base sm:text-lg font-black text-slate-900 mb-3">Frontline Healthcare Operations</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3">
          <button
            onClick={onOpenTriage}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 shadow-sm transition text-left group"
          >
            <Sparkles className="w-6 h-6 text-teal-700 mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-extrabold text-sm text-slate-900">Digital Triage Tool</div>
            <div className="text-[11px] text-slate-500">Symptom check & severity scoring</div>
          </button>

          <button
            onClick={onOpenHomeVisit}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 shadow-sm transition text-left group"
          >
            <Home className="w-6 h-6 text-emerald-700 mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-extrabold text-sm text-slate-900">Doorstep Visits</div>
            <div className="text-[11px] text-slate-500">Vitals check & routine care</div>
          </button>

          <button
            onClick={onOpenReferralTracking}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 shadow-sm transition text-left group"
          >
            <Share2 className="w-6 h-6 text-blue-700 mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-extrabold text-sm text-slate-900">Referral Tracking</div>
            <div className="text-[11px] text-slate-500">Follow-up PHC to District</div>
          </button>

          <button
            onClick={onOpenMedicineSearch}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 shadow-sm transition text-left group"
          >
            <Pill className="w-6 h-6 text-amber-700 mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-extrabold text-sm text-slate-900">Medicine Search</div>
            <div className="text-[11px] text-slate-500">Locate stock at PHC & Sub-centre</div>
          </button>
        </div>
      </div>

      {/* HIGH-RISK REGISTRY TABLE (Requirements 19 & 20) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900">High-Risk Patient Registry</h2>
              <span className="bg-red-100 text-red-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Active Monitoring
              </span>
            </div>
            <p className="text-xs text-slate-500">Maternal ANC, Severe Child Malnutrition, and Chronic Conditions requiring mandatory follow-up.</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 text-xs font-bold overflow-x-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-xl transition ${
                selectedCategory === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              All ({mockHighRiskPatients.length})
            </button>
            <button
              onClick={() => setSelectedCategory('maternal')}
              className={`px-3 py-1 rounded-xl transition ${
                selectedCategory === 'maternal' ? 'bg-purple-700 text-white' : 'bg-purple-50 text-purple-700'
              }`}
            >
              Maternal
            </button>
            <button
              onClick={() => setSelectedCategory('child')}
              className={`px-3 py-1 rounded-xl transition ${
                selectedCategory === 'child' ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-700'
              }`}
            >
              Child
            </button>
            <button
              onClick={() => setSelectedCategory('chronic_kidney')}
              className={`px-3 py-1 rounded-xl transition ${
                selectedCategory === 'chronic_kidney' ? 'bg-red-700 text-white' : 'bg-red-50 text-red-700'
              }`}
            >
              NCD / Renal
            </button>
          </div>
        </div>

        {/* High Risk Cards List */}
        <div className="space-y-3">
          {filteredHighRisk.map((pt) => (
            <div
              key={pt.id}
              className={`p-4 rounded-2xl border-2 transition flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                pt.status === 'overdue'
                  ? 'border-red-300 bg-red-50/40'
                  : 'border-slate-200 bg-slate-50/60'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-slate-900 text-sm">{pt.patientName}</h4>
                  <span className="text-xs text-slate-500">({pt.age} yrs, {pt.gender}) • Village {pt.village}</span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                    pt.riskLevel === 'critical' ? 'bg-red-600 text-white' : 'bg-amber-500 text-white'
                  }`}>
                    {pt.riskLevel} Risk
                  </span>
                </div>

                <div className="text-xs font-bold text-slate-800">
                  {pt.conditionName}
                </div>

                <p className="text-xs text-slate-600">
                  {pt.notes}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1 font-medium">
                  <span>Last Visit: {pt.lastVisitDate}</span>
                  <span>•</span>
                  <span className={pt.status === 'overdue' ? 'text-red-700 font-bold' : 'text-emerald-700 font-bold'}>
                    Follow-up: {pt.nextFollowUpDate} ({pt.status === 'overdue' ? 'OVERDUE' : 'Due Soon'})
                  </span>
                  <span>•</span>
                  <span>Missed Visits: {pt.missedVisitsCount}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <a
                  href={`tel:${pt.patientPhone}`}
                  className="p-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Call</span>
                </a>

                <button
                  onClick={() => onOpenHighRiskDetails(pt)}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-sm transition"
                >
                  Schedule Follow-up
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
