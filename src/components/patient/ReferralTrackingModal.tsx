import React, { useState } from 'react';
import { getPatientReferrals, advanceReferralStatus, REFERRAL_STAGES } from '../../services/referralService';
import { Referral } from '../../types';
import {
  Share2,
  Building2,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  FileText
} from 'lucide-react';

interface ReferralTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId?: string;
}

export const ReferralTrackingModal: React.FC<ReferralTrackingModalProps> = ({
  isOpen,
  onClose,
  patientId = 'pat-1'
}) => {
  const [referrals, setReferrals] = useState<Referral[]>(() => getPatientReferrals(patientId));
  const [activeReferral, setActiveReferral] = useState<Referral>(referrals[0] || null);

  if (!isOpen) return null;

  const handleAdvance = (refId: string) => {
    const updated = advanceReferralStatus(refId);
    if (updated) {
      setReferrals(getPatientReferrals(patientId));
      setActiveReferral({ ...updated });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-800 to-emerald-900 p-5 sm:p-6 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-xl font-bold p-1 rounded-lg hover:bg-white/10 transition"
          >
            ✕
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold mb-2">
            <Share2 className="w-3.5 h-3.5 text-emerald-300" />
            <span>Public Health Tiered Referral Pipeline</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Smart Referral Tracking</h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1">
            End-to-end referral continuity from Village Sub-Centres and PHCs to Rural and District Hospitals.
          </p>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {activeReferral ? (
            <div className="space-y-5">
              {/* Active Referral Card */}
              <div className="bg-slate-50 border-2 border-emerald-500/40 rounded-3xl p-5 sm:p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Referral Identifier
                    </div>
                    <div className="text-lg font-black text-slate-900 font-mono">
                      {activeReferral.id.toUpperCase()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-100 text-amber-900 text-xs font-extrabold px-2.5 py-1 rounded-full uppercase">
                      {activeReferral.urgency} Urgency
                    </span>
                    <span className="bg-emerald-100 text-emerald-900 text-xs font-extrabold px-2.5 py-1 rounded-full uppercase">
                      Status: {activeReferral.status}
                    </span>
                  </div>
                </div>

                {/* Patient & Facility Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Referring Source</span>
                    <strong className="text-slate-800 text-sm font-black block">{activeReferral.doctorName}</strong>
                    <span className="text-slate-500">PHC Karegaon (Primary Tier)</span>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 space-y-1">
                    <span className="text-[10px] text-emerald-700 uppercase font-bold block">Destination Facility</span>
                    <strong className="text-slate-800 text-sm font-black block">{activeReferral.hospitalName}</strong>
                    <span className="text-slate-500">{activeReferral.specialistType} Department</span>
                  </div>
                </div>

                {/* Reason */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Clinical Reason for Transfer</span>
                  <p className="text-xs text-slate-800 font-semibold leading-relaxed">
                    {activeReferral.reason}
                  </p>
                </div>

                {/* 7-Stage Status Progress Indicator */}
                <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                    <span className="font-bold text-emerald-400">Referral Stage Progression:</span>
                    <span className="font-mono text-slate-400">Public Health Network Tracking</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-[10px]">
                    {REFERRAL_STAGES.map((st, idx) => {
                      const isDone = REFERRAL_STAGES.indexOf(activeReferral.status as any) >= idx || activeReferral.status === 'Completed';
                      const isCurrent = activeReferral.status === st;

                      return (
                        <div
                          key={st}
                          className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 ${
                            isCurrent
                              ? 'bg-emerald-600 border-emerald-400 font-bold text-white ring-2 ring-emerald-300'
                              : isDone
                              ? 'bg-emerald-950/60 border-emerald-700 text-emerald-200'
                              : 'bg-slate-800/60 border-slate-700 text-slate-500'
                          }`}
                        >
                          <span className="text-xs">{isDone ? '✓' : idx + 1}</span>
                          <span className="leading-tight">{st}</span>
                        </div>
                      );
                    })}
                  </div>

                  {activeReferral.status !== 'Completed' && (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => handleAdvance(activeReferral.id)}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-md"
                      >
                        <span>Advance Stage (Demo Simulator)</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 text-xs">
              No active referrals found for this patient.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
