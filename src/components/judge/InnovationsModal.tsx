import React from 'react';
import {
  Home,
  AlertTriangle,
  Ambulance,
  Sparkles,
  ArrowUpDown,
  Share2,
  Pill,
  Activity,
  Globe,
  WifiOff,
  BarChart3,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

interface InnovationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CORE_INNOVATIONS = [
  {
    icon: Home,
    title: '1. Healthcare at Home',
    badge: 'Doorstep Delivery',
    color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    desc: 'Brings authorized frontline personnel (Doctors, ASHA workers, ANMs) to patient doorsteps for non-emergency conditions, eliminating rural transport burdens.'
  },
  {
    icon: AlertTriangle,
    title: '2. AI-Assisted First-Aid & Emergency SOS',
    badge: 'Golden-Hour Life Support',
    color: 'text-red-700 bg-red-50 border-red-200',
    desc: 'Instant GPS lock with 108 ambulance dispatch plus medically reviewed, trilingual step-by-step first-aid guidance with voice assistance (English, Telugu, Hindi) keeping rural bystanders focused during critical minutes.'
  },
  {
    icon: Ambulance,
    title: '3. Smart Ambulance Routing',
    badge: 'Clinical Capability Match',
    color: 'text-orange-700 bg-orange-50 border-orange-200',
    desc: 'Routes emergency cases not just to the closest building, but to the hospital with appropriate clinical capability (e.g. Cath Lab, Trauma OT, ICU).'
  },
  {
    icon: Sparkles,
    title: '4. AI-Assisted Triage',
    badge: 'Decision Support',
    color: 'text-purple-700 bg-purple-50 border-purple-200',
    desc: 'Interactive 4-tier urgency categorization (Routine, Priority, Urgent, Emergency) that assists frontline health workers without making autonomous diagnoses.'
  },
  {
    icon: ArrowUpDown,
    title: '5. Dynamic Clinical Queue',
    badge: 'Key SIH Innovation',
    color: 'text-amber-700 bg-amber-50 border-amber-200',
    desc: 'Replaces rigid first-come-first-served queues with doctor-controlled dynamic clinical reordering so deteriorating patients receive immediate attention.'
  },
  {
    icon: Share2,
    title: '6. Continuous Care & Referrals',
    badge: 'Closed-Loop Tracking',
    color: 'text-blue-700 bg-blue-50 border-blue-200',
    desc: 'Tracks patient transfers across Sub-Centres, PHCs, Rural Hospitals, and District Hospitals across 7 clear operational statuses.'
  }
];

const VALUE_PILLARS = [
  {
    icon: Pill,
    title: 'Medicine Availability',
    desc: 'Real-time stock transparency across participating public health facilities to avoid wasted travel for essential drugs.'
  },
  {
    icon: Activity,
    title: 'Diagnostic Coordination',
    desc: 'Point-of-care test scheduling (CBC, ECG, X-Ray) with digital lab report integration into unified records.'
  },
  {
    icon: Globe,
    title: 'Multilingual & Voice Access',
    desc: 'Complete interface localized in English, Marathi, Hindi, and Telugu, with simulated voice symptom input.'
  },
  {
    icon: WifiOff,
    title: 'Offline-First Resilience',
    desc: 'Frontline data collection works completely without cellular coverage; auto-syncs when connection returns.'
  },
  {
    icon: BarChart3,
    title: 'District Command Center',
    desc: 'Comprehensive GIS maps, workload heatmaps, and bottleneck monitoring for District Health Officers.'
  }
];

export const InnovationsModal: React.FC<InnovationsModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 p-6 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-xl font-bold p-1 rounded-lg hover:bg-white/10 transition"
          >
            ✕
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold mb-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>SIH 2026 Core Value Proposition</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Why RuralCare Connect?</h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-2xl">
            An integrated healthcare-access and quality-support platform that strengthens the existing public health system rather than replacing it.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* 6 Core Innovations Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-500">
                6 Major Platform Innovations
              </h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Proven SIH Impact
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {CORE_INNOVATIONS.map((inn, idx) => {
                const IconComp = inn.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-emerald-500 transition shadow-sm hover:shadow-md space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${inn.color}`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {inn.badge}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
                      {inn.title}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {inn.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5 Value Pillars */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-500 mb-3">
              5 Foundational Pillars
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {VALUE_PILLARS.map((pil, idx) => {
                const IconComp = pil.icon;
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <IconComp className="w-4 h-4 text-emerald-700 shrink-0" />
                      <h5 className="font-bold text-xs text-slate-900">{pil.title}</h5>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {pil.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500 shrink-0">
          Built for rural communities, primary health centres, and frontline public health workers across India.
        </div>
      </div>
    </div>
  );
};
