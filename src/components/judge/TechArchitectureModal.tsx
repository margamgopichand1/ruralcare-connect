import React from 'react';
import {
  Layers,
  Cpu,
  Database,
  Globe,
  ShieldCheck,
  Smartphone,
  Server,
  Radio,
  Share2,
  CheckCircle2
} from 'lucide-react';

interface TechArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ARCHITECTURE_TIERS = [
  {
    tier: 'Tier 1: Users & Stakeholders',
    icon: Smartphone,
    color: 'border-blue-300 bg-blue-50 text-blue-900',
    items: ['Rural Patients & Caregivers', 'ASHA & ANM Frontline Workers', 'PHC Medical Officers & Specialists', '108 ALS Ambulance Drivers', 'Hospital Superintendents', 'District Health Officers (DHO)']
  },
  {
    tier: 'Tier 2: Responsive Presentation Layer',
    icon: Globe,
    color: 'border-teal-300 bg-teal-50 text-teal-900',
    items: ['React 18 & TypeScript Single Page App', 'Mobile Bottom Bar Navigation', 'Tailwind CSS Modern Healthcare Theme', 'Leaflet GIS Interactive Routing Map', 'Multilingual Engine (EN, MR, HI, TE)', 'Simulated Voice Speech Input']
  },
  {
    tier: 'Tier 3: Authentication & Role Management',
    icon: ShieldCheck,
    color: 'border-indigo-300 bg-indigo-50 text-indigo-900',
    items: ['Role-Based Access Control (RBAC)', 'ABHA Health ID Virtual Profile Linking', 'Patient Consent-Aware Data Access', 'Secure Session Persistence', 'Audit Trail Logging Engine']
  },
  {
    tier: 'Tier 4: Healthcare Application Services Layer',
    icon: Server,
    color: 'border-emerald-300 bg-emerald-50 text-emerald-900',
    items: ['Care Near Me (Scope of Practice Matching)', '10-Step Home Healthcare Workflow Engine', 'Dynamic Clinical Priority Queue Service', '108 Emergency SOS & Dispatch Telemetry', 'Closed-Loop 7-Stage Referral Tracking', 'Public Health Pharmacy Stock Tracker', 'Diagnostic Lab Test Coordination']
  },
  {
    tier: 'Tier 5: AI-Assisted Clinical Decision Support',
    icon: Cpu,
    color: 'border-purple-300 bg-purple-50 text-purple-900',
    items: ['4-Tier Urgency Categorization Engine', 'Clinical Red Flag Triage Detector', 'Explainable Doctor Shortlisting Model', 'Hospital Clinical Capability Matcher', 'Strict Non-Autonomous Diagnosis Guardrails']
  },
  {
    tier: 'Tier 6: Data & Offline Resilience Layer',
    icon: Database,
    color: 'border-amber-300 bg-amber-50 text-amber-900',
    items: ['Longitudinal Unified Health Record', 'Offline-First Local Storage Cache', 'Automated Synchronization Queue', 'Point-of-Care Laboratory Findings', 'Maternal & Child High-Risk Registry']
  },
  {
    tier: 'Tier 7: Interoperability & Emergency Integrations',
    icon: Radio,
    color: 'border-rose-300 bg-rose-50 text-rose-900',
    items: ['ABDM / FHIR Compliance Architectural Readiness', 'State 108 Emergency Medical Services Telemetry', 'Hospital Pre-Arrival Alert Broadcasts', 'SMS & IVR Fallback Gateway Architecture']
  }
];

export const TechArchitectureModal: React.FC<TechArchitectureModalProps> = ({
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
            <Layers className="w-4 h-4 text-emerald-300" />
            <span>SIH 2026 Technical System Design</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Platform Technical Architecture
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1">
            Visual multi-tier architecture diagram demonstrating enterprise healthcare scalability, offline resilience, and public health system integration.
          </p>
        </div>

        {/* Multi-Tier Visual Stack */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          <div className="space-y-3">
            {ARCHITECTURE_TIERS.map((tier, idx) => {
              const IconComp = tier.icon;
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border-2 transition shadow-sm space-y-2.5 ${tier.color}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-black text-sm uppercase tracking-wide">
                      <IconComp className="w-5 h-5 shrink-0" />
                      <span>{tier.tier}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-white/80 px-2 py-0.5 rounded-md shadow-xs">
                      Layer {idx + 1}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {tier.items.map((item, itemIdx) => (
                      <span
                        key={itemIdx}
                        className="bg-white/90 text-slate-800 text-xs font-bold px-2.5 py-1 rounded-xl shadow-2xs border border-slate-200/60"
                      >
                        ✓ {item}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500 shrink-0">
          Designed for compliance with India's Ayushman Bharat Digital Mission (ABDM) standards and National Health Mission (NHM) public health workflows.
        </div>
      </div>
    </div>
  );
};
