import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getPreArrivalAlerts, savePreArrivalAlerts } from '../../services/emergencyService';
import { PreArrivalAlert } from '../../types';
import {
  Building2,
  AlertTriangle,
  Ambulance,
  Users,
  Clock,
  CheckCircle2,
  Activity,
  Pill,
  Share2,
  Bed,
  ShieldCheck,
  Radio,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const HospitalAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<PreArrivalAlert[]>(() => getPreArrivalAlerts());
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<string[]>([]);

  useEffect(() => {
    const handleNewAlert = () => {
      setAlerts(getPreArrivalAlerts());
    };
    window.addEventListener('ruralcare_emergency_alert_received', handleNewAlert);
    return () => window.removeEventListener('ruralcare_emergency_alert_received', handleNewAlert);
  }, []);

  const handleAcknowledge = (alertId: string) => {
    setAcknowledgedAlerts((prev) => [...prev, alertId]);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.5 } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-7 animate-fadeIn">
      {/* Top Facility Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-4 border-indigo-500">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-indigo-700/60 border-2 border-indigo-400 flex items-center justify-center text-white shrink-0 shadow-md">
            <Building2 className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                Facility Level Command • Sub-District Rural Hospital
              </span>
              <span className="text-slate-300 text-xs">Total Beds: 60 • ICU: 8 Beds</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">Shirur Rural Hospital</h1>
            <p className="text-xs sm:text-sm text-indigo-100">
              Superintendent: {user?.name || 'Dr. Sunita Kulkarni (MS)'} • 24x7 Emergency, Trauma, & Secondary Referral Care
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950/80 p-3 rounded-2xl border border-indigo-500/30">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-emerald-300">Live Hospital Command Online</span>
        </div>
      </div>

      {/* 🚨 CRITICAL PRE-ARRIVAL INCOMING AMBULANCE ALERT (Requirement 15) */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-red-600 flex items-center gap-1.5">
              <Radio className="w-4 h-4 animate-pulse" />
              Incoming Emergency Pre-Arrival Telemetry
            </span>
            <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
              Priority: CRITICAL ALS DISPATCH
            </span>
          </div>

          {alerts.map((alert) => {
            const isAck = acknowledgedAlerts.includes(alert.id);

            return (
              <div
                key={alert.id}
                className="bg-gradient-to-r from-red-900 via-rose-950 to-slate-900 text-white p-5 sm:p-6 rounded-3xl shadow-2xl border-2 border-red-500 space-y-4 animate-pulse-fast relative overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-red-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg">
                      <Ambulance className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-widest text-red-300 block">
                        🚨 INCOMING 108 EMERGENCY ALERT
                      </span>
                      <h3 className="text-lg font-black text-white">
                        {alert.ambulanceNumber} En Route
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-red-950/80 px-4 py-2 rounded-2xl border border-red-500/40 text-center">
                      <span className="text-[10px] text-red-300 block uppercase font-bold">Estimated Arrival</span>
                      <strong className="text-xl font-black text-amber-300 font-mono">
                        ETA {alert.etaMinutes} Min
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Patient Condition & Required Care */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-950/50 p-3 rounded-xl border border-red-800/40 space-y-1">
                    <span className="text-[10px] text-red-300 uppercase font-bold block">Patient ID: RC-10245</span>
                    <strong className="text-sm font-bold text-white block">{alert.patientName} ({alert.patientAge}y, {alert.patientGender})</strong>
                  </div>

                  <div className="bg-slate-950/50 p-3 rounded-xl border border-red-800/40 space-y-1 md:col-span-2">
                    <span className="text-[10px] text-red-300 uppercase font-bold block">Clinical Condition & Required Care</span>
                    <p className="text-xs font-bold text-amber-200">
                      {alert.condition}
                    </p>
                    <span className="text-[11px] text-red-200 block pt-0.5">
                      Required Action: <strong>{alert.requiredCare}</strong>
                    </span>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                  <span className="text-xs text-red-200/90 font-medium">
                    {isAck
                      ? '✓ Emergency Resuscitation Bay Prepped & Trauma Team Notified'
                      : 'Prepare Emergency Resuscitation Bay & Trauma Team immediately.'}
                  </span>

                  <button
                    onClick={() => handleAcknowledge(alert.id)}
                    className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-lg ${
                      isAck
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white hover:bg-red-50 text-red-950'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isAck ? 'Emergency Department Prepared ✓' : 'Prepare Emergency Department'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FACILITY METRICS OVERVIEW (Requirement 21) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>Today's Outpatient Volume</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 mt-1 font-mono">148</div>
          <span className="text-[11px] text-slate-500 font-medium">Avg wait time: 24 min</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>Critical Patients</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-3xl font-black text-red-600 mt-1 font-mono">03</div>
          <span className="text-[11px] text-red-700 font-medium">In Resuscitation / OT</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>Bed Occupancy</span>
            <Bed className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-700 mt-1 font-mono">46 / 60</div>
          <span className="text-[11px] text-emerald-700 font-medium">14 Beds Available (3 ICU)</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>Doctors on Duty</span>
            <Activity className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-3xl font-black text-teal-700 mt-1 font-mono">06</div>
          <span className="text-[11px] text-teal-700 font-medium">Medicine, Obs/Gyn, Ortho, Surgery</span>
        </div>
      </div>

      {/* RESOURCE STATUS PANELS (Medicine Stock, Diagnostics, Referrals) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Medicine Inventory Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Pill className="w-4 h-4 text-amber-600" />
              <span>Pharmacy Stock Health</span>
            </h3>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              92% Available
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
              <span className="font-bold text-slate-800">Paracetamol 500mg</span>
              <span className="text-emerald-700 font-bold">12,400 Tabs (In Stock)</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
              <span className="font-bold text-slate-800">Metformin 500mg</span>
              <span className="text-emerald-700 font-bold">6,800 Tabs (In Stock)</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50">
              <span className="font-bold text-amber-900">Inj. Oxytocin</span>
              <span className="text-amber-700 font-bold">42 Amps (Low Stock)</span>
            </div>
          </div>
        </div>

        {/* Diagnostic Status Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-600" />
              <span>Diagnostic Equipment</span>
            </h3>
            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
              Operational
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
              <span className="font-bold text-slate-800">Digital X-Ray</span>
              <span className="text-emerald-700 font-bold">Online ✓</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
              <span className="font-bold text-slate-800">12-Lead Tele-ECG</span>
              <span className="text-emerald-700 font-bold">Online ✓</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
              <span className="font-bold text-slate-800">Hematology Analyzer</span>
              <span className="text-emerald-700 font-bold">Online ✓</span>
            </div>
          </div>
        </div>

        {/* Incoming Referrals Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Share2 className="w-4 h-4 text-blue-600" />
              <span>Incoming PHC Referrals</span>
            </h3>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
              4 Scheduled
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2 rounded-xl bg-slate-50">
              <div className="font-bold text-slate-900">Pooja Jadhav (26y, Female)</div>
              <div className="text-[11px] text-slate-500">From PHC Karegaon • High-Risk Pregnancy ANC</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-50">
              <div className="font-bold text-slate-900">Tukaram Gaikwad (54y, Male)</div>
              <div className="text-[11px] text-slate-500">From PHC Otur • Refractory Asthma Evaluation</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
