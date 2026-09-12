import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LeafletMap, MapMarkerItem } from '../common/LeafletMap';
import {
  Ambulance,
  MapPin,
  Clock,
  Building2,
  Phone,
  AlertTriangle,
  CheckCircle2,
  Navigation,
  ShieldAlert,
  ArrowRight,
  Radio,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

const AMBULANCE_STAGES = [
  'Ambulance Assigned',
  'Travelling to Patient',
  'Patient Picked Up',
  'Travelling to Hospital',
  'Hospital Arrived'
] as const;

type AmbulanceStage = typeof AMBULANCE_STAGES[number];

export const AmbulanceDashboard: React.FC = () => {
  const { user } = useAuth();
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(1); // 'Travelling to Patient'
  const [patientCondition, setPatientCondition] = useState('Suspected Acute Coronary Syndrome (Severe crushing chest pain, SpO2 91%, diaphoresis)');

  const emergencyData = {
    patientName: 'Babanrao Jagtap',
    patientAge: 56,
    patientGender: 'Male',
    pickupAddress: 'Near Vitthal Temple, Karegaon Phata, Shirur',
    pickupLat: 18.8256,
    pickupLng: 74.3721,
    contactPhone: '+91 98221 44512',
    urgency: 'Critical',
    recommendedHospital: {
      name: 'Shirur Rural Hospital (Sub-District Hospital)',
      capability: 'Emergency Resuscitation / Intensive Care / Cath Lab Tele-ECG',
      distanceKm: 8.4,
      etaMinutes: 16,
      hospitalLat: 18.8290,
      hospitalLng: 74.3795,
      phone: '+91 2138 222144'
    }
  };

  const currentStage: AmbulanceStage = AMBULANCE_STAGES[currentStageIndex];

  const handleNextStage = () => {
    if (currentStageIndex < AMBULANCE_STAGES.length - 1) {
      setCurrentStageIndex((prev) => prev + 1);
      if (currentStageIndex === AMBULANCE_STAGES.length - 2) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      }
    }
  };

  // Map markers for patient and hospital
  const mapMarkers: MapMarkerItem[] = [
    {
      id: 'pickup-point',
      lat: emergencyData.pickupLat,
      lng: emergencyData.pickupLng,
      title: `Pickup: ${emergencyData.patientName}`,
      subtitle: emergencyData.pickupAddress,
      type: 'emergency',
      badge: 'PATIENT PICKUP'
    },
    {
      id: 'dest-hospital',
      lat: emergencyData.recommendedHospital.hospitalLat,
      lng: emergencyData.recommendedHospital.hospitalLng,
      title: emergencyData.recommendedHospital.name,
      subtitle: emergencyData.recommendedHospital.capability,
      type: 'hospital',
      badge: 'RECOMMENDED FACILITY'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-7 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-red-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-4 border-red-600">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-red-600 flex items-center justify-center text-white shrink-0 shadow-lg animate-pulse-fast">
            <Ambulance className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-red-500/30 text-red-200 text-xs font-black uppercase px-2.5 py-0.5 rounded-full border border-red-400/40 flex items-center gap-1">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                108 ALS Emergency Dispatch Unit
              </span>
              <span className="text-slate-300 text-xs font-mono">Vehicle: MH-12-RN-4421</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">{user?.name || 'Rajesh Patil (108 Driver)'}</h1>
            <p className="text-xs sm:text-sm text-red-100">
              Active Call: Dispatch ID #SOS-8821 • Telemetry Connected with 108 Emergency Command
            </p>
          </div>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-2xl border border-red-500/40 text-right space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-red-400 block">Current Dispatch Status</span>
          <div className="text-sm font-black text-white">{currentStage}</div>
        </div>
      </div>

      {/* STAGE PROGRESSION TRACKER (Requirement 14) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-red-600" />
              <span>Ambulance Status & Telemetry Progress</span>
            </h2>
            <p className="text-xs text-slate-500">Update status in real-time to broadcast pre-arrival telemetry to the destination hospital.</p>
          </div>

          {currentStageIndex < AMBULANCE_STAGES.length - 1 && (
            <button
              onClick={handleNextStage}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-2 self-start sm:self-auto"
            >
              <span>Advance to: "{AMBULANCE_STAGES[currentStageIndex + 1]}"</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 5 Status Steps Horizontal Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center text-xs">
          {AMBULANCE_STAGES.map((st, idx) => {
            const isDone = currentStageIndex > idx;
            const isCurrent = currentStageIndex === idx;

            return (
              <div
                key={st}
                className={`p-3 rounded-2xl border transition flex flex-col items-center justify-center gap-1.5 ${
                  isCurrent
                    ? 'bg-red-600 text-white border-red-600 font-extrabold shadow-md ring-2 ring-red-300'
                    : isDone
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-semibold'
                    : 'bg-slate-50 text-slate-400 border-slate-200'
                }`}
              >
                <span className="text-[10px] font-mono uppercase">{isDone ? '✓ Completed' : `Stage ${idx + 1}`}</span>
                <span className="text-xs font-bold leading-tight">{st}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* SMART ROUTING & CLINICAL CAPABILITY MATCHING (Requirement 13) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Emergency Patient & Hospital Capability Matching */}
        <div className="lg:col-span-6 space-y-4">
          {/* Patient Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Emergency Patient Profile</span>
              <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase animate-pulse">
                Critical Priority
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-lg font-black text-slate-900">{emergencyData.patientName}</div>
              <div className="text-xs text-slate-600">{emergencyData.patientAge} Years • {emergencyData.patientGender}</div>
            </div>

            <div className="p-3 bg-red-50 rounded-2xl border border-red-200 text-xs text-red-950 space-y-1">
              <span className="font-extrabold block text-red-900">Reported Condition:</span>
              <p className="leading-relaxed">{patientCondition}</p>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <div className="flex items-center gap-1.5 text-slate-600">
                <MapPin className="w-4 h-4 text-red-600" />
                <span>{emergencyData.pickupAddress}</span>
              </div>
              <a
                href={`tel:${emergencyData.contactPhone}`}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Relative</span>
              </a>
            </div>
          </div>

          {/* Recommended Destination Hospital Card */}
          <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Smart Hospital Recommendation</span>
              <span className="text-xs text-slate-400 font-mono">Algorithmic Match</span>
            </div>

            <div>
              <h3 className="text-base font-black text-white">{emergencyData.recommendedHospital.name}</h3>
              <p className="text-xs text-emerald-200 mt-0.5">{emergencyData.recommendedHospital.capability}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                <span className="text-[10px] text-slate-400 block">Distance</span>
                <strong className="text-sm font-black text-white">{emergencyData.recommendedHospital.distanceKm} km</strong>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                <span className="text-[10px] text-slate-400 block">Estimated Travel Time</span>
                <strong className="text-sm font-black text-amber-300">{emergencyData.recommendedHospital.etaMinutes} Minutes</strong>
              </div>
            </div>

            <div className="bg-emerald-950/60 border border-emerald-500/30 rounded-2xl p-3 text-xs text-emerald-200 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Routing Rationality:</strong> Recommended over nearer PHC because this patient has suspected acute cardiac symptoms requiring emergency telemetry, Cath Lab, and resus bay capability.
              </span>
            </div>
          </div>
        </div>

        {/* Right Col: Map & Route Visualization (Requirement 13) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-600" />
                <span>Simulated Route Navigation</span>
              </h3>
              <span className="text-xs font-semibold text-slate-500">Live GPS Telemetry</span>
            </div>

            <div className="h-80 rounded-2xl overflow-hidden border border-slate-200">
              <LeafletMap
                center={[emergencyData.pickupLat, emergencyData.pickupLng]}
                zoom={12}
                markers={mapMarkers}
                height="320px"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
              <span>Suggested Route: SH-27 Highway bypass via Ranjangaon</span>
              <span className="font-bold text-emerald-700">Low Traffic Density</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
