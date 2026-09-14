import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNetwork } from '../../context/NetworkContext';
import { UserRole } from '../../types';
import {
  Sparkles,
  User,
  HeartHandshake,
  Stethoscope,
  Ambulance,
  Building2,
  Landmark,
  WifiOff,
  Globe,
  ChevronUp,
  ChevronDown,
  Play,
  Layers,
  FileCheck2,
  Lightbulb,
  AlertTriangle
} from 'lucide-react';

interface JudgeDemoBarProps {
  onOpenScenarioModal: () => void;
  onOpenInnovationsModal: () => void;
  onOpenSihAlignmentModal: () => void;
  onOpenTechArchitectureModal: () => void;
  onTriggerEmergencySos: () => void;
}

export const JudgeDemoBar: React.FC<JudgeDemoBarProps> = ({
  onOpenScenarioModal,
  onOpenInnovationsModal,
  onOpenSihAlignmentModal,
  onOpenTechArchitectureModal,
  onTriggerEmergencySos
}) => {
  const { switchRole, role } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { isOnline, toggleNetworkSimulation } = useNetwork();
  const [isExpanded, setIsExpanded] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth >= 768 : true;
  });

  const handleMultilingualCycle = () => {
    if (language === 'en') setLanguage('hi');
    else if (language === 'hi') setLanguage('te');
    else if (language === 'te') setLanguage('mr');
    else setLanguage('en');
  };

  const rolesList: { id: UserRole; label: string; icon: any }[] = [
    { id: 'patient', label: 'Patient', icon: User },
    { id: 'health_worker', label: 'ASHA', icon: HeartHandshake },
    { id: 'doctor', label: 'Doctor', icon: Stethoscope },
    { id: 'ambulance', label: '108 Driver', icon: Ambulance },
    { id: 'hospital_admin', label: 'Hosp Admin', icon: Building2 },
    { id: 'district_admin', label: 'District Admin', icon: Landmark }
  ];

  return (
    <div className="fixed bottom-16 md:bottom-3 left-1/2 -translate-x-1/2 z-40 max-w-5xl w-[96%] pointer-events-auto">
      <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-slate-700/80 p-2 sm:p-2.5 transition-all">
        {/* Top bar header */}
        <div className="flex items-center justify-between px-2 pb-1.5 border-b border-slate-800 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-black text-amber-400 tracking-wide uppercase">
              SIH 2026 Judge & Evaluator Panel
            </span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="hidden sm:inline text-slate-300">Continuous Public Healthcare Ecosystem</span>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-400 hover:text-white p-0.5 rounded flex items-center gap-1 font-bold text-[10px]"
          >
            <span>{isExpanded ? 'Minimize' : 'Expand'}</span>
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>

        {isExpanded && (
          <div className="pt-2 space-y-2">
            {/* Top row: Key Evaluation Scenarios & Modal Triggers */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {/* PRIMARY 19-STAGE DEMO */}
              <button
                onClick={onOpenScenarioModal}
                className="flex-1 min-w-[170px] px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-900/30 ring-1 ring-emerald-400/40"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-pulse" />
                <span>🎯 SIH Demo Mode (19 Stages)</span>
              </button>

              {/* Why RuralCare? (Innovations) */}
              <button
                onClick={onOpenInnovationsModal}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 border border-slate-700"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>Why RuralCare?</span>
              </button>

              {/* SIH Alignment */}
              <button
                onClick={onOpenSihAlignmentModal}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 border border-slate-700"
              >
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>SIH Alignment</span>
              </button>

              {/* Technical Architecture */}
              <button
                onClick={onOpenTechArchitectureModal}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 border border-slate-700"
              >
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>Tech Architecture</span>
              </button>

              {/* 108 SOS */}
              <button
                onClick={onTriggerEmergencySos}
                className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black transition flex items-center gap-1 animate-pulse"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>108 SOS</span>
              </button>

              {/* Offline simulator */}
              <button
                onClick={toggleNetworkSimulation}
                className={`px-2 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                  !isOnline ? 'bg-amber-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                <WifiOff className="w-3 h-3" />
                <span>{!isOnline ? 'Offline ✓' : 'Offline Test'}</span>
              </button>

              {/* Language cycle */}
              <button
                onClick={handleMultilingualCycle}
                className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded-xl text-xs font-bold transition flex items-center gap-1"
                title="Switch Language (EN, HI, TE, MR)"
              >
                <Globe className="w-3 h-3 text-emerald-400" />
                <span className="uppercase">{language}</span>
              </button>
            </div>

            {/* Bottom row: Quick 6-Role Switcher Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1 border-t border-slate-800/80">
              <span className="text-[10px] text-slate-500 font-bold uppercase shrink-0">
                Switch Role:
              </span>
              {rolesList.map((r) => {
                const IconComp = r.icon;
                const isActive = role === r.id || (r.id === 'district_admin' && role === 'admin');
                return (
                  <button
                    key={r.id}
                    onClick={() => switchRole(r.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 shrink-0 ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-300'
                        : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    <IconComp className="w-3 h-3" />
                    <span>{r.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
