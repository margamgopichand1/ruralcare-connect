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
  FileText,
  Menu,
  X,
  Pill,
  Radio
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

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
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Quick Emergency Button (Always accessible) */}
            <button
              onClick={onOpenSosModal}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black shadow-md shadow-red-600/30 transition animate-pulse"
              title="Trigger 108 Emergency SOS"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="sm:inline">108 SOS</span>
            </button>

            {/* Offline Simulation Toggle Button - Desktop */}
            <button
              onClick={toggleNetworkSimulation}
              className={`hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition ${
                isOnline
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  : 'border-amber-300 bg-amber-100 text-amber-900 hover:bg-amber-200'
              }`}
              title="Toggle Online / Offline Network Simulator"
            >
              {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-600" /> : <WifiOff className="w-3.5 h-3.5 text-amber-700" />}
              <span>{isOnline ? 'Online' : 'Offline'}</span>
            </button>

            {/* Language Selector - Desktop */}
            <div className="hidden sm:block">
              <LanguageSelector />
            </div>

            {/* Notification Bell */}
            <NotificationBell />

            {/* Role Switcher Pill - Desktop */}
            <button
              onClick={onOpenRoleModal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-black transition"
              title="Switch Demo Role"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span className="capitalize">{role ? role.replace('_', ' ') : 'Select Role'}</span>
            </button>

            {/* Profile trigger - Desktop */}
            <button
              onClick={onOpenProfileModal}
              className="hidden sm:flex p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition"
              title="View Profile"
            >
              <UserIcon className="w-4 h-4 text-slate-600" />
            </button>

            {/* Mobile Hamburger Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition focus:outline-none flex items-center justify-center min-w-[40px] min-h-[40px]"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-slate-900" /> : <Menu className="w-5 h-5 text-slate-900" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE EXPANDABLE NAVIGATION DRAWER */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/98 backdrop-blur-lg px-4 py-4 space-y-4 shadow-2xl animate-fadeIn max-h-[85vh] overflow-y-auto">
          {/* Active User Card & Quick Role Switcher */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black text-sm">
                  {user?.name ? user.name[0] : 'U'}
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900 leading-tight">{user?.name || 'Ramesh Patil'}</div>
                  <div className="text-[10px] text-emerald-800 font-bold capitalize flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Role: {role ? role.replace('_', ' ') : 'Patient'}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenRoleModal();
                }}
                className="px-2.5 py-1 bg-white hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-[11px] rounded-lg shadow-sm"
              >
                Change Role
              </button>
            </div>

            {/* Quick 1-Tap 6-Role Switcher Grid */}
            <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-emerald-200/70">
              <button
                onClick={() => {
                  switchRole('patient');
                  setActiveTab('home');
                  setIsMobileMenuOpen(false);
                }}
                className={`p-2 rounded-xl text-[11px] font-bold border transition text-center flex flex-col items-center gap-1 ${
                  role === 'patient' ? 'bg-emerald-700 text-white border-emerald-700 shadow' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>🧑‍🌾</span>
                <span className="truncate w-full">Patient</span>
              </button>

              <button
                onClick={() => {
                  switchRole('health_worker');
                  setActiveTab('home');
                  setIsMobileMenuOpen(false);
                }}
                className={`p-2 rounded-xl text-[11px] font-bold border transition text-center flex flex-col items-center gap-1 ${
                  role === 'health_worker' ? 'bg-emerald-700 text-white border-emerald-700 shadow' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>👩‍⚕️</span>
                <span className="truncate w-full">ASHA Worker</span>
              </button>

              <button
                onClick={() => {
                  switchRole('doctor');
                  setActiveTab('doctor-dashboard');
                  setIsMobileMenuOpen(false);
                }}
                className={`p-2 rounded-xl text-[11px] font-bold border transition text-center flex flex-col items-center gap-1 ${
                  role === 'doctor' ? 'bg-emerald-700 text-white border-emerald-700 shadow' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>🩺</span>
                <span className="truncate w-full">Doctor</span>
              </button>

              <button
                onClick={() => {
                  switchRole('ambulance');
                  setActiveTab('home');
                  setIsMobileMenuOpen(false);
                }}
                className={`p-2 rounded-xl text-[11px] font-bold border transition text-center flex flex-col items-center gap-1 ${
                  role === 'ambulance' ? 'bg-red-600 text-white border-red-600 shadow' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>🚑</span>
                <span className="truncate w-full">Ambulance</span>
              </button>

              <button
                onClick={() => {
                  switchRole('hospital_admin');
                  setActiveTab('home');
                  setIsMobileMenuOpen(false);
                }}
                className={`p-2 rounded-xl text-[11px] font-bold border transition text-center flex flex-col items-center gap-1 ${
                  role === 'hospital_admin' ? 'bg-indigo-700 text-white border-indigo-700 shadow' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>🏥</span>
                <span className="truncate w-full">Hospital</span>
              </button>

              <button
                onClick={() => {
                  switchRole('district_admin');
                  setActiveTab('admin-dashboard');
                  setIsMobileMenuOpen(false);
                }}
                className={`p-2 rounded-xl text-[11px] font-bold border transition text-center flex flex-col items-center gap-1 ${
                  role === 'district_admin' ? 'bg-purple-700 text-white border-purple-700 shadow' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>🏛️</span>
                <span className="truncate w-full">Gov Admin</span>
              </button>
            </div>
          </div>

          {/* Role Navigation Links */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block px-1">Navigation</span>
            
            {role === 'patient' && (
              <>
                <button
                  onClick={() => { setActiveTab('home'); setIsMobileMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    activeTab === 'home' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <HeartHandshake className="w-4 h-4 text-emerald-600" />
                  <span>Patient Home & Services</span>
                </button>
                <button
                  onClick={() => { setActiveTab('records'); setIsMobileMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    activeTab === 'records' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Longitudinal Medical Records</span>
                </button>
                <button
                  onClick={() => { setActiveTab('medicines'); setIsMobileMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    activeTab === 'medicines' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Pill className="w-4 h-4 text-emerald-600" />
                  <span>Essential Medicines & Stock</span>
                </button>
                <button
                  onClick={() => { setActiveTab('fallback'); setIsMobileMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    activeTab === 'fallback' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Radio className="w-4 h-4 text-emerald-600" />
                  <span>SMS / IVR 2G Fallback</span>
                </button>
              </>
            )}

            {role === 'health_worker' && (
              <>
                <button
                  onClick={() => { setActiveTab('home'); setIsMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <HeartHandshake className="w-4 h-4 text-emerald-600" />
                  <span>ASHA Console & Register</span>
                </button>
                <button
                  onClick={() => { setActiveTab('medicines'); setIsMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Pill className="w-4 h-4 text-emerald-600" />
                  <span>Medicine Stock & Kit</span>
                </button>
                <button
                  onClick={() => { setActiveTab('records'); setIsMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Village Patient Records</span>
                </button>
              </>
            )}

            {role === 'doctor' && (
              <>
                <button
                  onClick={() => { setActiveTab('doctor-dashboard'); setIsMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Stethoscope className="w-4 h-4 text-emerald-600" />
                  <span>Clinical OPD Queue & Teleconsult</span>
                </button>
                <button
                  onClick={() => { setActiveTab('medicines'); setIsMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Pill className="w-4 h-4 text-emerald-600" />
                  <span>PHC Pharmacy Inventory</span>
                </button>
              </>
            )}

            {role === 'ambulance' && (
              <button
                onClick={() => { setActiveTab('home'); setIsMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <Ambulance className="w-4 h-4 text-red-600" />
                <span>108 ALS Navigation Console</span>
              </button>
            )}

            {role === 'hospital_admin' && (
              <>
                <button
                  onClick={() => { setActiveTab('home'); setIsMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  <span>Hospital Command & Pre-Arrival</span>
                </button>
                <button
                  onClick={() => { setActiveTab('medicines'); setIsMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Pill className="w-4 h-4 text-indigo-600" />
                  <span>Pharmacy Buffer Stock</span>
                </button>
              </>
            )}

            {(role === 'district_admin' || role === 'admin') && (
              <>
                <button
                  onClick={() => { setActiveTab('admin-dashboard'); setIsMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Landmark className="w-4 h-4 text-purple-600" />
                  <span>District Surveillance Command</span>
                </button>
                <button
                  onClick={() => { setActiveTab('medicines'); setIsMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Pill className="w-4 h-4 text-purple-600" />
                  <span>District Supply Chain Tracker</span>
                </button>
              </>
            )}

            {/* Public Landing Switcher */}
            <button
              onClick={() => { setActiveTab('landing'); setIsMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 flex items-center gap-2 mt-1"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Public Landing & Presentation</span>
            </button>
          </div>

          {/* Language & Profile Footer */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
            <div className="flex-1">
              <LanguageSelector />
            </div>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenProfileModal();
              }}
              className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 flex items-center gap-1.5 text-xs font-bold"
            >
              <UserIcon className="w-4 h-4" />
              <span>Profile</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
