import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LeafletMap, MapMarkerItem } from '../common/LeafletMap';
import {
  getActiveEmergency,
  updateAmbulanceStatus,
  AmbulanceDispatchStage,
  EmergencyDispatchResult
} from '../../services/emergencyService';
import { FIRST_AID_PROTOCOLS } from '../../data/firstAidProtocols';
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
  Sparkles,
  Compass,
  Play,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

const STAGES: AmbulanceDispatchStage[] = [
  'Assigned',
  'Going to Patient',
  'Patient Picked Up',
  'Going to Hospital',
  'Arrived'
];

export const AmbulanceDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeDispatch, setActiveDispatch] = useState<EmergencyDispatchResult | null>(() => getActiveEmergency());
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(1); // 'Going to Patient'
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [simulatedProgress, setSimulatedProgress] = useState<number>(35);

  useEffect(() => {
    const handleUpdate = () => {
      const emergency = getActiveEmergency();
      setActiveDispatch(emergency);
      if (emergency) {
        const idx = STAGES.indexOf(emergency.currentStage);
        if (idx !== -1) setCurrentStageIndex(idx);
      }
    };
    window.addEventListener('ruralcare_active_emergency_updated', handleUpdate);
    return () => window.removeEventListener('ruralcare_active_emergency_updated', handleUpdate);
  }, []);

  // Default fallback data if no live SOS was activated yet
  const patientData = activeDispatch
    ? {
        name: activeDispatch.request.patientName,
        age: 48,
        gender: 'Male',
        category: FIRST_AID_PROTOCOLS[activeDispatch.categoryKey]?.name.en || 'Emergency Triage',
        pickupAddress: activeDispatch.request.village,
        lat: activeDispatch.request.lat,
        lng: activeDispatch.request.lng,
        phone: activeDispatch.request.phone,
        urgency: 'Critical',
        hospitalName: activeDispatch.hospital.name,
        hospitalCapability: activeDispatch.hospitalReason,
        hospitalLat: activeDispatch.hospital.lat,
        hospitalLng: activeDispatch.hospital.lng,
        hospitalPhone: activeDispatch.hospital.contactPhone,
        etaMinutes: activeDispatch.request.etaMinutes,
        distanceKm: activeDispatch.routeDistanceKm
      }
    : {
        name: 'Ramesh Patil',
        age: 48,
        gender: 'Male',
        category: 'Suspected Acute Cardiac Emergency (Severe Chest Pain)',
        pickupAddress: 'Near Vitthal Temple, Karegaon Phata, Shirur',
        lat: 18.8256,
        lng: 74.3721,
        phone: '+91 98221 44512',
        urgency: 'Critical',
        hospitalName: 'Shirur Rural Hospital (Sub-District Hospital)',
        hospitalCapability: 'Recommended based on emergency cardiac capability (Cath Lab/ICU/Tele-ECG) and estimated travel time (16 min)',
        hospitalLat: 18.8290,
        hospitalLng: 74.3795,
        hospitalPhone: '+91 2138 222144',
        etaMinutes: 16,
        distanceKm: 8.4
      };

  const currentStage: AmbulanceDispatchStage = STAGES[currentStageIndex];

  const handleNextStage = () => {
    if (currentStageIndex < STAGES.length - 1) {
      const nextIdx = currentStageIndex + 1;
      const nextStage = STAGES[nextIdx];
      setCurrentStageIndex(nextIdx);
      updateAmbulanceStatus(nextStage);

      if (nextIdx === STAGES.length - 1) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      }
    }
  };

  const toggleNavigation = () => {
    setIsNavigating(!isNavigating);
    if (!isNavigating) {
      confetti({ particleCount: 30, spread: 40 });
    }
  };

  // Map markers
  const mapMarkers: MapMarkerItem[] = [
    {
      id: 'pickup-point',
      lat: patientData.lat,
      lng: patientData.lng,
      title: `Pickup: ${patientData.name}`,
      subtitle: patientData.pickupAddress,
      type: 'emergency',
      badge: 'PATIENT PICKUP'
    },
    {
      id: 'dest-hospital',
      lat: patientData.hospitalLat,
      lng: patientData.hospitalLng,
      title: patientData.hospitalName,
      subtitle: 'Destination Trauma Center',
      type: 'hospital',
      badge: 'RECOMMENDED HOSPITAL'
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

      {/* 5-STAGE STATUS PROGRESS TRACKER (Requirement 8) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-red-600" />
              <span>Ambulance Status & Telemetry Progress</span>
            </h2>
            <p className="text-xs text-slate-500">
              Advance status in real time to broadcast pre-arrival telemetry to the destination hospital.
            </p>
          </div>

          {currentStageIndex < STAGES.length - 1 && (
            <button
              onClick={handleNextStage}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-2 self-start sm:self-auto"
            >
              <span>Advance to: "{STAGES[currentStageIndex + 1]}"</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 5 Status Steps Horizontal Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center text-xs">
          {STAGES.map((st, idx) => {
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
                <span className="text-[10px] font-mono uppercase">
                  {isDone ? '✓ Completed' : `Stage ${idx + 1}`}
                </span>
                <span className="text-xs font-bold leading-tight">{st}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* SMART ROUTING & CLINICAL CAPABILITY MATCHING (Requirement 8 & 9) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Emergency Patient & Hospital Capability Matching */}
        <div className="lg:col-span-6 space-y-4">
          {/* Patient Emergency Profile (Role-based: No private history exposed) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Emergency Patient Profile (Role Safe)
              </span>
              <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase animate-pulse">
                Critical Priority
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-lg font-black text-slate-900">{patientData.name}</div>
              <div className="text-xs text-slate-600">
                {patientData.age} Years • {patientData.gender} • Triage Urgency: Critical
              </div>
            </div>

            <div className="p-3 bg-red-50 rounded-2xl border border-red-200 text-xs text-red-950 space-y-1">
              <span className="font-extrabold block text-red-900">Reported Condition:</span>
              <p className="leading-relaxed">{patientData.category}</p>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <div className="flex items-center gap-1.5 text-slate-600">
                <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                <span className="truncate">{patientData.pickupAddress}</span>
              </div>
              <a
                href={`tel:${patientData.phone}`}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center gap-1 shrink-0"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Patient</span>
              </a>
            </div>
          </div>

          {/* Smart Recommended Destination Hospital Card */}
          <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Smart Hospital Recommendation
              </span>
              <span className="text-xs text-slate-400 font-mono">Decision Support Match</span>
            </div>

            <div>
              <h3 className="text-base font-black text-white">{patientData.hospitalName}</h3>
              <p className="text-xs text-emerald-200 mt-0.5">{patientData.hospitalCapability}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                <span className="text-[10px] text-slate-400 block">Distance</span>
                <strong className="text-sm font-black text-white">{patientData.distanceKm} km</strong>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                <span className="text-[10px] text-slate-400 block">Estimated Travel Time</span>
                <strong className="text-sm font-black text-amber-300">{patientData.etaMinutes} Minutes</strong>
              </div>
            </div>

            <div className="bg-emerald-950/60 border border-emerald-500/30 rounded-2xl p-3 text-xs text-emerald-200 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Routing Rationale:</strong> Facility prioritized because of emergency-care capability (Cath Lab/ICU/Trauma OT) rather than nearest basic PHC post.
              </span>
            </div>
          </div>
        </div>

        {/* Right Col: Map & Route Navigation with "Start Navigation" button (Requirement 8) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <Compass className="w-4 h-4 text-red-600" />
                <span>Simulated Route Navigation</span>
              </h3>

              {/* Start / Stop Navigation Button (Requirement 8) */}
              <button
                onClick={toggleNavigation}
                className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition shadow-sm ${
                  isNavigating
                    ? 'bg-amber-600 hover:bg-amber-700 text-white animate-pulse'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                }`}
              >
                {isNavigating ? <RotateCcw className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isNavigating ? 'Stop Navigation' : 'Start Navigation'}</span>
              </button>
            </div>

            {/* Navigation Active HUD Overlay */}
            {isNavigating && (
              <div className="bg-slate-900 text-white p-3.5 rounded-2xl border border-slate-800 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-black flex items-center gap-1">
                    <Navigation className="w-3.5 h-3.5 animate-spin" />
                    <span>Turn-by-Turn Guidance Active</span>
                  </span>
                  <span className="font-mono text-amber-300">Speed: 54 km/h</span>
                </div>
                <div className="text-sm font-black text-slate-100">
                  In 450 meters, take SH-27 bypass road toward Ranjangaon
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full w-[45%]" />
                </div>
              </div>
            )}

            <div className="h-80 rounded-2xl overflow-hidden border border-slate-200">
              <LeafletMap
                center={[patientData.lat, patientData.lng]}
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
