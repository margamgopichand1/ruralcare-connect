import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNetwork } from '../../context/NetworkContext';
import { LanguageSelector } from './LanguageSelector';
import { NotificationBell } from './NotificationBell';
import {
  HeartHandshake,
  ShieldCheck,
  User as UserIcon,
  Wifi,
  WifiOff,
  AlertTriangle,
  Stethoscope,
  Ambulance,
  Building2,
  Landmark,
  Sparkles,
  MapPin,
  Pill,
  FileText
} from 'lucide-react';
import { UserRole } from '../../types';

interface NavbarProps {
  onOpenRoleModal: () => void;
  onOpenSosModal: () => void;
  onOpenProfileModal: () => void;
  onOpenCareNearMe?: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenRoleModal,
  onOpenSosModal,
  onOpenProfileModal,
  onOpenCareNearMe,
  activeTab,
  setActiveTab
}) => {
  const { role, user, switchRole } = useAuth();
  const { t } = useLanguage();
  const { isOnline, toggleNetworkSimulation } = useNetwork();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Tagline */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-700 to-emerald-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform shrink-0">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-lg tracking-tight text-slate-900 group-hover:text-emerald-700 transition">
                    RuralCare
                  </span>
                  <span className="font-extrabold text-[11px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
                    CONNECT
                  </span>
                </div>
                <div className="text-[10px] font-bold text-slate-500 tracking-tight flex items-center gap-1">
                  <span className="text-teal-800 font-extrabold">“Right Care. Right Place. Right Time.”</span>
                </div>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links based on Current Role */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
            {/* 1. Patient Role Navigation */}
            {role === 'patient' && (
              <>
                <button
                  onClick={() => setActiveTab('home')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                    activeTab === 'home' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('records')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                    activeTab === 'records' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  My Records
                </button>
                <button
                  onClick={() => setActiveTab('medicines')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                    activeTab === 'medicines' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Medicines
                </button>
                <button
                  onClick={() => setActiveTab('fallback')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                    activeTab === 'fallback' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  SMS / IVR
                </button>
              </>
            )}

            {/* 2. Health Worker (ASHA/ANM) Navigation */}
            {role === 'health_worker' && (
              <>
                <button
                  onClick={() => setActiveTab('home')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                    activeTab === 'home' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ASHA Console
                </button>
                <button
                  onClick={() => setActiveTab('medicines')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                    activeTab === 'medicines' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Medicine Stock
                </button>
                <button
                  onClick={() => setActiveTab('records')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                    activeTab === 'records' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Registry Records
                </button>
              </>
            )}

            {/* 3. Doctor Navigation */}
            {role === 'doctor' && (
              <>
                <button
                  onClick={() => setActiveTab('doctor-dashboard')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                    activeTab === 'doctor-dashboard' || activeTab === 'home' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Clinical Queue & OPD
                </button>
                <button
                  onClick={() => setActiveTab('medicines')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                    activeTab === 'medicines' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  PHC Pharmacy
                </button>
              </>
            )}

            {/* 4. Ambulance Navigation */}
            {role === 'ambulance' && (
              <>
                <button
                  onClick={() => setActiveTab('home')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                    activeTab === 'home' ? 'bg-red-50 text-red-800' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  108 Emergency Dispatch & Route
                </button>
              </>
            )}

            {/* 5. Hospital Administrator Navigation */}
            {role === 'hospital_admin' && (
              <>
                <button
                  onClick={() => setActiveTab('home')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                    activeTab === 'home' ? 'bg-indigo-50 text-indigo-800' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Hospital Command & Pre-Arrival Alerts
                </button>
                <button
                  onClick={() => setActiveTab('medicines')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                    activeTab === 'medicines' ? 'bg-indigo-50 text-indigo-800' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Pharmacy Stock
                </button>
              </>
            )}

            {/* 6. District Health Administrator Navigation */}
            {(role === 'district_admin' || role === 'admin') && (
              <>
                <button
                  onClick={() => setActiveTab('admin-dashboard')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                    activeTab === 'admin-dashboard' || activeTab === 'home' ? 'bg-purple-50 text-purple-800' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  District Command Center
                </button>
                <button
                  onClick={() => setActiveTab('medicines')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                    activeTab === 'medicines' ? 'bg-purple-50 text-purple-800' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  District Supply Chain
                </button>
              </>
            )}

            {/* Landing Page Trigger for presentations */}
            <button
              onClick={() => setActiveTab('landing')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                activeTab === 'landing' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Public Landing
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {/* Quick Emergency Button for Patient view */}
            {role === 'patient' && (
              <button
                onClick={onOpenSosModal}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black shadow-md shadow-red-600/30 transition animate-pulse"
                title="Trigger 108 Emergency SOS"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>108 SOS</span>
              </button>
            )}

            {/* Offline Simulation Toggle Button */}
            <button
              onClick={toggleNetworkSimulation}
              className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition ${
                isOnline
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  : 'border-amber-300 bg-amber-100 text-amber-900 hover:bg-amber-200'
              }`}
              title="Toggle Online / Offline Network Simulator"
            >
              {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-600" /> : <WifiOff className="w-3.5 h-3.5 text-amber-700" />}
              <span>{isOnline ? 'Online' : 'Offline'}</span>
            </button>

            {/* Language Selector */}
            <LanguageSelector />

            {/* Notification Bell */}
            <NotificationBell />

            {/* Role Switcher Pill */}
            <button
              onClick={onOpenRoleModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-black transition"
              title="Switch Demo Role"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span className="capitalize">{role ? role.replace('_', ' ') : 'Select Role'}</span>
            </button>

            {/* Profile trigger */}
            <button
              onClick={onOpenProfileModal}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition"
              title="View Profile"
            >
              <UserIcon className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
