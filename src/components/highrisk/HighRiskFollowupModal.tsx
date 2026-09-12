import React, { useState } from 'react';
import { HighRiskPatient } from '../../types';
import {
  AlertTriangle,
  Phone,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  FileCheck2,
  ShieldAlert,
  HeartPulse
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface HighRiskFollowupModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: HighRiskPatient | null;
}

export const HighRiskFollowupModal: React.FC<HighRiskFollowupModalProps> = ({
  isOpen,
  onClose,
  patient
}) => {
  const [scheduledDate, setScheduledDate] = useState('2026-09-18');
  const [fieldNotes, setFieldNotes] = useState('Patient contacted via phone. Counselled on regular iron supplementation and dietary compliance.');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen || !patient) return null;

  const handleSaveFollowup = () => {
    setIsSaved(true);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-900 to-slate-900 p-5 sm:p-6 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-xl font-bold p-1 rounded-lg hover:bg-white/10 transition"
          >
            ✕
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold mb-2">
            <HeartPulse className="w-3.5 h-3.5 text-emerald-300" />
            <span>High-Risk Continuum Registry</span>
          </div>
          <h2 className="text-2xl font-black">{patient.patientName}</h2>
          <p className="text-emerald-100 text-xs mt-0.5">
            {patient.age} Years • {patient.gender} • Village {patient.village}, Taluka {patient.taluka}
          </p>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* Status & Category */}
          <div className="p-4 rounded-2xl border-2 border-red-200 bg-red-50/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-900 uppercase tracking-wider">
                Risk Classification
              </span>
              <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                {patient.riskLevel} Risk
              </span>
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">{patient.conditionName}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{patient.notes}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-bold">Assigned ASHA</span>
              <strong className="text-slate-800">{patient.ashaWorkerAssigned}</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-bold">Missed Appointments</span>
              <strong className={patient.missedVisitsCount > 0 ? 'text-red-600 font-bold' : 'text-emerald-700 font-bold'}>
                {patient.missedVisitsCount} Missed
              </strong>
            </div>
          </div>

          {/* Schedule Form */}
          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Schedule Next Follow-Up Date:
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Community Health Notes / Follow-up Log:
              </label>
              <textarea
                rows={3}
                value={fieldNotes}
                onChange={(e) => setFieldNotes(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <a
              href={`tel:${patient.patientPhone}`}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs flex items-center gap-1.5 transition"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Call Patient</span>
            </a>

            <button
              onClick={handleSaveFollowup}
              className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSaved ? 'Follow-Up Scheduled & Synced!' : 'Confirm & Schedule Follow-Up'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
