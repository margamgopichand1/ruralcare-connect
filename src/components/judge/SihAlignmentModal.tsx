import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Building2,
  FileCheck2,
  HeartHandshake
} from 'lucide-react';

interface SihAlignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ALIGNMENT_MAP = [
  {
    problem: 'Long Travel Distances',
    impact: 'Patients in remote villages delay seeking care due to excessive travel cost and rough roads.',
    solution: 'Healthcare at Home + Care Near Me',
    detail: 'Enables registered ASHA workers, ANM nurses, and visiting doctors to provide care at the patient doorstep for routine and non-emergency conditions.'
  },
  {
    problem: 'Shortage of Specialists',
    impact: 'Specialists concentrated in urban centres; rural patients lack access to cardiology, pediatrics, and internal medicine.',
    solution: 'Smart Doctor Discovery & Teleconsultation',
    detail: 'Algorithmic shortlisting connects patients directly with available PHC medical officers and district specialists via video/audio consultation.'
  },
  {
    problem: 'Delayed & Lost Referrals',
    impact: 'Patients referred from Sub-Centres to PHCs and District Hospitals get lost in transit with no tracking or feedback loop.',
    solution: 'Closed-Loop 7-Stage Referral Tracking',
    detail: 'End-to-end status progression (Created → Accepted → Scheduled → En Route → Arrived → Consulted → Completed) verifiable by frontline health workers.'
  },
  {
    problem: 'Fragmented Medical Records',
    impact: 'Paper slips get damaged or lost; doctors lack longitudinal history when patients move across facilities.',
    solution: 'Longitudinal ABHA-Linked Health Record',
    detail: 'Unified digital medical history with interactive 2026 clinical timeline uniting consultations, prescriptions, lab reports, and referrals.'
  },
  {
    problem: 'Emergency Care Delays',
    impact: 'Ambulances dispatched without knowing if destination hospitals have required beds, ventilators, or specialists.',
    solution: '1-Touch 108 SOS & Smart Capability Routing',
    detail: 'Matches patient clinical requirement (e.g. Cath Lab for cardiac, trauma OT) to appropriate facilities and broadcasts pre-arrival alerts.'
  },
  {
    problem: 'Long Queues & Wasted Wait Times',
    impact: 'First-come-first-served queues force deteriorating patients to wait behind routine follow-ups.',
    solution: 'Dynamic Clinical Priority Queue',
    detail: 'Allows authorized doctors to clinically upgrade patient urgency (Critical → Urgent → Normal) with automated visual re-sequencing.'
  },
  {
    problem: 'Medicine Stock Uncertainty',
    impact: 'Patients travel hours to public pharmacies only to find essential drugs out of stock.',
    solution: 'Real-time Medicine Availability Search',
    detail: 'Transparent stock visibility (Available, Low Stock, Unavailable) across Sub-Centres, PHCs, and District Hospitals.'
  },
  {
    problem: 'Irregular Point-of-Care Diagnostics',
    impact: 'Delays in pathology tests delay critical diagnosis of infections, diabetes, and pregnancy complications.',
    solution: 'Diagnostic Coordination & Digital Reports',
    detail: 'Test catalog booking (CBC, ECG, X-Ray, USG) with automated report delivery directly into patient records.'
  },
  {
    problem: 'Poor Cellular Connectivity',
    impact: 'Healthcare platforms fail in deep rural pockets without constant high-speed internet.',
    solution: 'Offline-First Local Storage & Sync',
    detail: 'Patient registration, field vitals, and clinical notes are stored securely on-device and auto-synchronized upon network resumption.'
  },
  {
    problem: 'Language Barriers & Dialect Gaps',
    impact: 'Rural citizens struggle with English-only digital healthcare portals.',
    solution: 'Multilingual Support & Voice Input Simulation',
    detail: 'Complete user interface translated in English, Marathi, Hindi, and Telugu, with simulated native-language speech recognition.'
  }
];

export const SihAlignmentModal: React.FC<SihAlignmentModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 p-6 text-white relative shrink-0 border-b-2 border-emerald-500">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-xl font-bold p-1 rounded-lg hover:bg-white/10 transition"
          >
            ✕
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>SIH 2026 Problem Statement Alignment</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Problem-to-Solution Matrix
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1">
            How RuralCare Connect directly resolves each key challenge defined in the rural public healthcare statement.
          </p>
        </div>

        {/* Content Table/Cards */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ALIGNMENT_MAP.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200 hover:border-emerald-500 transition-all rounded-2xl p-4 space-y-2.5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
                    Problem #{idx + 1}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Solved
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">{item.problem}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{item.impact}</p>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                  <div className="text-xs font-black text-emerald-800 flex items-center gap-1">
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{item.solution}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500 shrink-0">
          Designed to strengthen and digitize existing public health infrastructure (Sub-Centres, PHCs, Rural Hospitals, and District Hospitals).
        </div>
      </div>
    </div>
  );
};
