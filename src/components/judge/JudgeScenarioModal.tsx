import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Ambulance,
  Stethoscope,
  Building2,
  FileCheck2,
  Share2,
  Calendar,
  Pill,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface JudgeScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToRole?: (role: string) => void;
}

interface ScenarioStep {
  number: number;
  title: string;
  actor: string;
  roleBadge: string;
  badgeColor: string;
  description: string;
  systemAction: string;
  impactNote: string;
}

const SCENARIO_STEPS: ScenarioStep[] = [
  {
    number: 1,
    title: 'Patient Reports Symptoms',
    actor: 'Ramesh Patil (Patient)',
    roleBadge: 'Patient',
    badgeColor: 'bg-blue-600',
    description: 'Patient in Karegaon village experiences severe acute chest pain radiating to left shoulder with shortness of breath.',
    systemAction: 'Interactive multilingual voice/symptom input captures pain onset and vital markers.',
    impactNote: 'Eliminates travel delay before initial assessment.'
  },
  {
    number: 2,
    title: 'Triage Identifies Urgency',
    actor: 'RuralCare AI Decision Support',
    roleBadge: 'AI Triage',
    badgeColor: 'bg-red-600',
    description: 'Algorithmic clinical triage identifies Acute Cardiovascular Red Flags (🔴 EMERGENCY).',
    systemAction: 'System suppresses routine appointment booking and highlights emergency protocol with clear assistive disclaimers.',
    impactNote: 'Safety safeguard: Prevented misdirection to home remedies.'
  },
  {
    number: 3,
    title: 'Patient Cannot Travel',
    actor: 'Family Caregiver',
    roleBadge: 'Caregiver',
    badgeColor: 'bg-slate-700',
    description: 'Patient is unable to walk or use public transit due to dizziness and acute pain.',
    systemAction: 'Interface presents immediate Emergency Assistance trigger.',
    impactNote: 'Addresses rural transport deficiency.'
  },
  {
    number: 4,
    title: 'System Checks Nearby Care',
    actor: 'Care Near Me Module',
    roleBadge: 'Spatial Service',
    badgeColor: 'bg-emerald-600',
    description: 'Scans nearest authorized providers within 5 km panchayat circle.',
    systemAction: 'Determines local Sub-Centre lacks Cath Lab resuscitation equipment.',
    impactNote: 'Scope-of-practice intelligence prevents delayed sub-optimal care.'
  },
  {
    number: 5,
    title: 'Emergency Escalation Occurs',
    actor: 'Clinical Triage Engine',
    roleBadge: 'System Engine',
    badgeColor: 'bg-red-600',
    description: 'Home visit request is immediately converted to Emergency Life Support escalation.',
    systemAction: 'High-urgency banner prompts 108 Emergency Medical Services dispatch.',
    impactNote: 'Automated referral escalation.'
  },
  {
    number: 6,
    title: '🚨 108 SOS Activated',
    actor: 'Ramesh Patil (Patient)',
    roleBadge: '108 EMS',
    badgeColor: 'bg-red-600',
    description: '1-touch SOS confirmation sends automated GPS coordinates and ABHA medical ID to State 108 Command.',
    systemAction: 'Generates telemetry dispatch ticket #SOS-8821.',
    impactNote: 'Instant GPS lock without verbal address confusion.'
  },
  {
    number: 7,
    title: 'Ambulance Assigned',
    actor: '108 ALS Unit MH-12-RN-4421',
    roleBadge: 'EMS Driver',
    badgeColor: 'bg-red-600',
    description: 'Nearest Advanced Life Support ambulance (Driver: Rajesh Patil, 3.2 km away) receives turn-by-turn navigation.',
    systemAction: 'Live ETA calculated at 8 minutes.',
    impactNote: 'Reduces rural ambulance response time.'
  },
  {
    number: 8,
    title: 'Appropriate Hospital Recommended',
    actor: 'Smart Facility Matcher',
    roleBadge: 'Facility Router',
    badgeColor: 'bg-indigo-600',
    description: 'Algorithms recommend Shirur Rural Hospital (Sub-District) over closer PHCs due to ICU, Tele-ECG, and Oxygen resus availability.',
    systemAction: 'Distance: 8.4 km • Travel Time: 16 min.',
    impactNote: 'Prevents inter-facility bouncing.'
  },
  {
    number: 9,
    title: 'Route Displayed to Ambulance',
    actor: '108 Driver Rajesh',
    roleBadge: 'EMS Driver',
    badgeColor: 'bg-red-600',
    description: 'Driver receives live route bypass via SH-27 highway with traffic optimization.',
    systemAction: 'Continuous telemetry broadcasts vehicle position to hospital.',
    impactNote: 'Optimized rural road navigation.'
  },
  {
    number: 10,
    title: 'Hospital Receives Pre-Arrival Alert',
    actor: 'Shirur Hospital Emergency Dept',
    roleBadge: 'Hospital Admin',
    badgeColor: 'bg-indigo-600',
    description: 'Hospital Command receives visual/audio pulse: "🚨 INCOMING EMERGENCY - Priority: Critical, ETA: 12 min, Required Care: Cath Lab / Resus Bay 1".',
    systemAction: 'Superintendent acknowledges alert; Emergency trauma team prepped prior to arrival.',
    impactNote: 'Zero-minute door-to-treatment preparation.'
  },
  {
    number: 11,
    title: 'Patient Enters Hospital',
    actor: 'Emergency Triage Nurse',
    roleBadge: 'Hospital Staff',
    badgeColor: 'bg-indigo-600',
    description: 'Ambulance arrives at trauma bay; patient moved directly onto cardiac monitoring stretcher without reception delay.',
    systemAction: 'Ambulance status updated to "Hospital Arrived".',
    impactNote: 'Seamless transition of care.'
  },
  {
    number: 12,
    title: 'Doctor Assesses Patient',
    actor: 'Dr. Priya Sharma (Physician)',
    roleBadge: 'Doctor',
    badgeColor: 'bg-teal-600',
    description: 'Doctor conducts immediate clinical examination; SpO2 at 92%, BP 160/100, ECG shows ST-segment elevation.',
    systemAction: 'Immediate high-flow oxygen and sublingual nitrates administered.',
    impactNote: 'Early clinical intervention.'
  },
  {
    number: 13,
    title: 'Dynamic Queue Priority Updates',
    actor: 'Doctor / Authorized Staff',
    roleBadge: 'Innovation',
    badgeColor: 'bg-amber-600',
    description: 'Doctor upgrades patient clinical priority from Routine to CRITICAL in the digital OPD queue.',
    systemAction: 'Dynamic queue reorders automatically: Critical → Urgent → Normal. Visual banner alerts hospital team.',
    impactNote: 'Key SIH Innovation: Clinician-controlled dynamic prioritization.'
  },
  {
    number: 14,
    title: 'Doctor Consultation & Stabilization',
    actor: 'Dr. Priya Sharma',
    roleBadge: 'Doctor',
    badgeColor: 'bg-teal-600',
    description: 'Acute coronary syndrome stabilized; doctor enters clinical diagnosis and telemetry findings.',
    systemAction: 'Unified digital medical record opened.',
    impactNote: 'Structured documentation.'
  },
  {
    number: 15,
    title: 'Diagnostic Tests Coordinated',
    actor: 'PHC / Hospital Lab',
    roleBadge: 'Diagnostics',
    badgeColor: 'bg-rose-600',
    description: 'Immediate Troponin-I, 12-Lead ECG, and Complete Blood Count (CBC) ordered.',
    systemAction: 'Digital lab results uploaded and verified by medical officer.',
    impactNote: 'Rapid point-of-care laboratory verification.'
  },
  {
    number: 16,
    title: 'Digital Prescription Generated',
    actor: 'Dr. Priya Sharma',
    roleBadge: 'Doctor',
    badgeColor: 'bg-teal-600',
    description: 'Doctor generates digital Rx (Aspirin 325mg, Clopidogrel 300mg, Atorvastatin 80mg) checked against hospital pharmacy stock.',
    systemAction: 'Prescription synchronized with patient ABHA account.',
    impactNote: 'Verified medicine availability.'
  },
  {
    number: 17,
    title: 'Tertiary Referral Initiated',
    actor: 'Rural Hospital to District Hospital',
    roleBadge: 'Referral',
    badgeColor: 'bg-blue-600',
    description: 'Doctor creates Tier-3 Referral #REF-9921 to Cardiology Cath Lab at Aundh District Hospital for primary coronary intervention.',
    systemAction: 'Referral status set to "Accepted"; transport pre-booked.',
    impactNote: 'Structured referral loop closing.'
  },
  {
    number: 18,
    title: 'Follow-Up Scheduled with ASHA',
    actor: 'Lakshmi Devi (ASHA)',
    roleBadge: 'Health Worker',
    badgeColor: 'bg-emerald-600',
    description: 'Post-discharge home visit and daily BP monitoring automatically scheduled in Karegaon ASHA registry.',
    systemAction: 'High-risk patient follow-up alert created.',
    impactNote: 'Continuity of care at the village level.'
  },
  {
    number: 19,
    title: 'Longitudinal Record Complete',
    actor: 'Unified RuralCare Data Layer',
    roleBadge: 'Unified Record',
    badgeColor: 'bg-emerald-700',
    description: 'Entire episode from village symptom onset to emergency dispatch, hospital pre-arrival alert, inpatient stabilization, diagnostics, prescription, and referral is unified under patient ABHA record.',
    systemAction: 'Audit log committed with consent verification.',
    impactNote: '100% interoperable continuity of care.'
  }
];

export const JudgeScenarioModal: React.FC<JudgeScenarioModalProps> = ({
  isOpen,
  onClose,
  onJumpToRole
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < SCENARIO_STEPS.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
            return prev;
          }
        });
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  if (!isOpen) return null;

  const currentStep = SCENARIO_STEPS[currentStepIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border-2 border-emerald-500 max-w-3xl w-full overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-5 sm:p-6 text-white relative shrink-0 border-b border-emerald-600/40">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-xl font-bold p-1 rounded-lg hover:bg-white/10 transition"
          >
            ✕
          </button>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-emerald-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
              SIH 2026 EVALUATION DEMO
            </span>
            <span className="text-emerald-300 text-xs font-mono font-bold">Problem Statement SIH26133</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Rural Patient Emergency Journey
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-0.5">
            19-Stage End-to-End Walkthrough: From Village Symptom Onset to Tertiary Hospital Referral & ASHA Follow-up.
          </p>
        </div>

        {/* Progress Bar & Controls */}
        <div className="bg-slate-900 text-white px-5 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                isPlaying
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause Auto-Play' : 'Auto-Play Journey'}</span>
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentStepIndex(0);
              }}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              title="Reset to Step 1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold">
            <span className="text-emerald-400">Step {currentStep.number}</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400">{SCENARIO_STEPS.length}</span>
          </div>
        </div>

        {/* Horizontal Step Pills Scrollable */}
        <div className="bg-slate-950 p-2.5 overflow-x-auto flex items-center gap-1.5 shrink-0 border-b border-slate-800">
          {SCENARIO_STEPS.map((s, idx) => (
            <button
              key={s.number}
              onClick={() => {
                setIsPlaying(false);
                setCurrentStepIndex(idx);
              }}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono transition shrink-0 ${
                currentStepIndex === idx
                  ? 'bg-emerald-500 text-white shadow-sm ring-1 ring-emerald-300'
                  : currentStepIndex > idx
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {s.number}. {s.title.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Main Step Detail Card */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Stage {currentStep.number} of 19
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                  {currentStep.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase ${currentStep.badgeColor}`}>
                  {currentStep.roleBadge}
                </span>
                <span className="text-xs font-bold text-slate-600 bg-white px-2.5 py-1 rounded-full border border-slate-200">
                  Actor: {currentStep.actor}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Scenario Event:
              </span>
              <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                {currentStep.description}
              </p>
            </div>

            {/* Platform System Action */}
            <div className="bg-white p-4 rounded-2xl border border-emerald-200 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>RuralCare Connect Platform Response:</span>
              </span>
              <p className="text-xs text-slate-700 font-mono leading-relaxed">
                {currentStep.systemAction}
              </p>
            </div>

            {/* Impact Metric Note */}
            <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-300 text-xs text-emerald-950 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span>
                <strong>SIH Impact Value:</strong> {currentStep.impactNote}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <button
            disabled={currentStepIndex === 0}
            onClick={() => {
              setIsPlaying(false);
              setCurrentStepIndex((prev) => Math.max(0, prev - 1));
            }}
            className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          {currentStepIndex < SCENARIO_STEPS.length - 1 ? (
            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentStepIndex((prev) => prev + 1);
              }}
              className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-2"
            >
              <span>Next Stage ({currentStepIndex + 2})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-900 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition"
            >
              <span>Scenario Complete (Close)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
