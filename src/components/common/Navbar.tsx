import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNetwork } from '../../context/NetworkContext';
import { LanguageSelector } from './LanguageSelector';
import { NotificationBell } from './NotificationBell';
import { HeartHandshake, ShieldCheck, User as UserIcon, LogOut, Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { UserRole } from '../../types';

interface NavbarProps {
  onOpenRoleModal: () => void;
  onOpenSosModal: () => void;
  onOpenProfileModal: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenRoleModal,
  onOpenSosModal,
  onOpenProfileModal,
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
          {/* Brand & SIH Badge */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-health-600 to-health-800 flex items-center justify-center text-white shadow-md shadow-health-600/20 group-hover:scale-105 transition-transform">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight text-slate-900 group-hover:text-health-700 transition">
                    RuralCare
                  </span>
                  <span className="font-medium text-xs px-1.5 py-0.5 rounded bg-health-100 text-health-800 font-mono">
                    CONNECT
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                  <span>Govt of Maharashtra</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-semibold">SIH 26133</span>
                </div>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {role === 'patient' && (
              <>
                <button
                  onClick={() => setActiveTab('home')}
                  className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition ${
                    activeTab === 'home' ? 'bg-health-50 text-health-800' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.dashboard}
                </button>
                <button
                  onClick={() => setActiveTab('records')}
                  className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition ${
                    activeTab === 'records' ? 'bg-health-50 text-health-800' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.medicalRecords}
                </button>
                <button
                  onClick={() => setActiveTab('medicines')}
                  className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition ${
                    activeTab === 'medicines' ? 'bg-health-50 text-health-800' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.medicines}
                </button>
                <button
                  onClick={() => setActiveTab('fallback')}
                  className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition ${
                    activeTab === 'fallback' ? 'bg-health-50 text-health-800' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  SMS / IVR
                </button>
              </>
            )}

            {role === 'doctor' && (
              <>
                <button
                  onClick={() => setActiveTab('doctor-dashboard')}
                  className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition ${
                    activeTab === 'doctor-dashboard' ? 'bg-health-50 text-health-800' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Doctor Console
                </button>
                <button
                  onClick={() => setActiveTab('doctor-verification')}
                  className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition ${
                    activeTab === 'doctor-verification' ? 'bg-health-50 text-health-800' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Verification
                </button>
              </>
            )}

            {role === 'admin' && (
              <button
                onClick={() => setActiveTab('admin-dashboard')}
                className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition ${
                  activeTab === 'admin-dashboard' ? 'bg-health-50 text-health-800' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                District Command Center
              </button>
            )}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {/* Quick Emergency Button on Patient view */}
            {role === 'patient' && (
              <button
                onClick={onOpenSosModal}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs md:text-sm font-bold shadow-md shadow-red-600/30 transition animate-pulse"
                title="Trigger 108 Emergency SOS"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>108 SOS</span>
              </button>
            )}

            {/* Offline Simulation Toggle Button */}
            <button
              onClick={toggleNetworkSimulation}
              className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition ${
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
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold transition"
              title="Switch Demo Role"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-health-700" />
              <span className="capitalize">{role || 'Select Role'}</span>
            </button>

            {/* Profile trigger */}
            <button
              onClick={onOpenProfileModal}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition"
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
