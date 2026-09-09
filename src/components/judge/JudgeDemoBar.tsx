import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNetwork } from '../../context/NetworkContext';
import {
  Sparkles,
  User,
  Stethoscope,
  Ambulance,
  Building2,
  WifiOff,
  Globe,
  ChevronUp,
  ChevronDown,
  Play
} from 'lucide-react';

interface JudgeDemoBarProps {
  onTriggerPatientJourney: () => void;
  onTriggerDoctorJourney: () => void;
  onTriggerEmergencySos: () => void;
  onTriggerGovernmentDashboard: () => void;
}

export const JudgeDemoBar: React.FC<JudgeDemoBarProps> = ({
  onTriggerPatientJourney,
  onTriggerDoctorJourney,
  onTriggerEmergencySos,
  onTriggerGovernmentDashboard
}) => {
  const { switchRole } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { isOnline, toggleNetworkSimulation } = useNetwork();
  const [isExpanded, setIsExpanded] = useState(true);

  const handleMultilingualCycle = () => {
    if (language === 'en') setLanguage('mr');
    else if (language === 'mr') setLanguage('hi');
    else if (language === 'hi') setLanguage('te');
    else setLanguage('en');
  };

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 max-w-4xl w-[94%] pointer-events-auto">
      <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-slate-700/80 p-2 sm:p-2.5 transition-all">
        <div className="flex items-center justify-between px-2 pb-1.5 border-b border-slate-800 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-black text-amber-400 tracking-wide uppercase">
              SIH 2026 Judge Demo Bar
            </span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="hidden sm:inline text-slate-300">1-Click Guided Scenario Walkthroughs</span>
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
          <div className="pt-2 flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
            {/* Patient Journey */}
            <button
              onClick={onTriggerPatientJourney}
              className="flex-1 min-w-[130px] px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
              title="Step-by-step patient booking, matching, and prescription flow"
            >
              <Play className="w-3 h-3 fill-white" />
              <span>Patient Flow</span>
            </button>

            {/* Doctor Journey */}
            <button
              onClick={onTriggerDoctorJourney}
              className="flex-1 min-w-[130px] px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
              title="Doctor accepts request, enters vitals and generates Rx"
            >
              <Stethoscope className="w-3 h-3" />
              <span>Doctor Flow</span>
            </button>

            {/* 108 Emergency SOS */}
            <button
              onClick={onTriggerEmergencySos}
              className="flex-1 min-w-[130px] px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm animate-pulse"
              title="Simulate immediate 108 Ambulance dispatch"
            >
              <Ambulance className="w-3 h-3" />
              <span>108 SOS</span>
            </button>

            {/* Government Dashboard */}
            <button
              onClick={onTriggerGovernmentDashboard}
              className="flex-1 min-w-[130px] px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border border-slate-700 shadow-sm"
              title="District command center analytics & GIS map"
            >
              <Building2 className="w-3 h-3 text-health-400" />
              <span>Govt Center</span>
            </button>

            {/* Offline Mode Toggle */}
            <button
              onClick={toggleNetworkSimulation}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                !isOnline
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title="Toggle Offline mode and auto-sync queue"
            >
              <WifiOff className="w-3 h-3" />
              <span>{!isOnline ? 'Offline ✓' : 'Test Offline'}</span>
            </button>

            {/* Multilingual Switcher Cycle */}
            <button
              onClick={handleMultilingualCycle}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
              title="Cycle through English, Marathi, Hindi, Telugu"
            >
              <Globe className="w-3 h-3 text-emerald-400" />
              <span className="uppercase">{language}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
