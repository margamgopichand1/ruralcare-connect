import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import {
  User,
  HeartHandshake,
  Stethoscope,
  Ambulance,
  Building2,
  Landmark,
  ShieldCheck,
  CheckCircle,
  Zap,
  ArrowRight
} from 'lucide-react';

interface RoleSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoleSelected: (role: UserRole) => void;
}

interface RoleConfig {
  role: UserRole;
  title: string;
  name: string;
  sub: string;
  icon: any;
  color: string;
  badge: string;
  features: string[];
}

const ROLES_LIST: RoleConfig[] = [
  {
    role: 'patient',
    title: 'Patient',
    name: 'Ramesh Patil',
    sub: 'Karegaon Village (Shirur)',
    icon: User,
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    badge: 'Patient Portal',
    features: ['Care Near Me & Home Visit', 'Digital Queue Token', '108 Emergency SOS', 'ABHA Longitudinal Record']
  },
  {
    role: 'health_worker',
    title: 'ASHA / ANM Worker',
    name: 'Lakshmi Devi',
    sub: 'Sub-Centre Karegaon',
    icon: HeartHandshake,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    badge: 'Frontline Worker',
    features: ['Village Patient Registry', 'Digital Symptom Triage', 'High-Risk Follow-up', 'Offline Record Sync']
  },
  {
    role: 'doctor',
    title: 'Doctor',
    name: 'Dr. Priya Sharma',
    sub: 'PHC Medical Officer / Specialist',
    icon: Stethoscope,
    color: 'bg-teal-50 text-teal-700 border-teal-200',
    badge: 'Physician Console',
    features: ['Dynamic Clinical Queue', 'Consultation & Rx Builder', 'Diagnostic Ordering', 'Secondary Referrals']
  },
  {
    role: 'ambulance',
    title: 'Ambulance Driver',
    name: 'Rajesh Patil',
    sub: '108 ALS Unit MH-12-RN-4421',
    icon: Ambulance,
    color: 'bg-red-50 text-red-700 border-red-200',
    badge: 'Emergency EMS',
    features: ['Real-time Emergency Dispatch', 'Hospital Capability Match', 'Turn-by-turn Route Map', 'Status Progression Tracking']
  },
  {
    role: 'hospital_admin',
    title: 'Hospital Administrator',
    name: 'Dr. Sunita Kulkarni',
    sub: 'Shirur Rural Hospital (Sub-District)',
    icon: Building2,
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    badge: 'Facility Command',
    features: ['Pre-Arrival Emergency Alerts', 'Bed & ICU Availability', 'OPD Queue Load', 'Medicine & Lab Stock']
  },
  {
    role: 'district_admin',
    title: 'District Health Admin',
    name: 'Dr. Vilas Rao',
    sub: 'District Health Officer (Pune)',
    icon: Landmark,
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    badge: 'Public Health DHO',
    features: ['GIS Facility Heatmap', 'Referral Completion Trends', 'Medicine Shortage Alerts', 'Quality & Workload Metrics']
  }
];

export const RoleSelectModal: React.FC<RoleSelectModalProps> = ({
  isOpen,
  onClose,
  onRoleSelected
}) => {
  const { quickDemoLogin, role: currentRole } = useAuth();

  if (!isOpen) return null;

  const handleSelectRole = (chosenRole: UserRole) => {
    quickDemoLogin(chosenRole);
    onRoleSelected(chosenRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-800 via-emerald-800 to-slate-900 p-6 text-white text-center relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-xl font-bold p-1 rounded-lg hover:bg-white/10 transition"
          >
            ✕
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>SIH 2026 Presentation • Role-Based Healthcare Access</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Select Stakeholder Persona</h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-2xl mx-auto">
            Experience the complete integrated rural healthcare continuum across all 6 core public health roles.
          </p>
        </div>

        {/* 6 Role Cards Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Quick 1-Click Demo Logins for Judges & Evaluators
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              ⚡ Instant Switching
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {ROLES_LIST.map((r) => {
              const IconComp = r.icon;
              const isSelected = currentRole === r.role || (r.role === 'district_admin' && currentRole === 'admin');

              return (
                <div
                  key={r.role}
                  onClick={() => handleSelectRole(r.role)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between hover:shadow-lg hover:-translate-y-0.5 ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 shadow-md'
                      : 'border-slate-200 hover:border-teal-400 bg-white'
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Active
                    </span>
                  )}

                  <div>
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 border ${r.color}`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {r.badge}
                        </div>
                        <h3 className="font-black text-slate-900 text-sm sm:text-base leading-tight">
                          {r.title}
                        </h3>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 mb-3">
                      <div className="text-xs font-extrabold text-slate-800">{r.name}</div>
                      <div className="text-[11px] text-slate-500">{r.sub}</div>
                    </div>

                    <ul className="space-y-1 text-[11px] text-slate-600 mb-4">
                      {r.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectRole(r.role);
                    }}
                    className={`w-full py-2 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition ${
                      isSelected
                        ? 'bg-emerald-700 text-white shadow-md'
                        : 'bg-slate-900 hover:bg-teal-700 text-white'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span>Enter as {r.title.split(' ')[0]} Demo</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info note */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500 shrink-0">
          Realistic Indian rural health data simulation for SIH 2026. Data is fictitious and compliant with public health scope of practice guidelines.
        </div>
      </div>
    </div>
  );
};
