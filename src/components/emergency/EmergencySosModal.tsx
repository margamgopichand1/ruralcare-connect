import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { triggerEmergencySos, EmergencyDispatchResult } from '../../services/emergencyService';
import { recordNewEmergencyTriggered } from '../../services/analyticsService';
import { LeafletMap } from '../common/LeafletMap';
import {
  AlertTriangle,
  Ambulance,
  Phone,
  Building2,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Send,
  User
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface EmergencySosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencySosModal: React.FC<EmergencySosModalProps> = ({
  isOpen,
  onClose
}) => {
  const { currentPatient } = useAuth();
  const [stage, setStage] = useState<'confirm' | 'dispatching' | 'active'>('confirm');
  const [dispatchData, setDispatchData] = useState<EmergencyDispatchResult | null>(null);

  if (!isOpen) return null;

  const patient = currentPatient || {
    id: 'pat-1',
    name: 'Ramesh Patil',
    phone: '+91 98221 44512',
    village: 'Karegaon, Shirur',
    lat: 18.8256,
    lng: 74.3721,
    emergencyContact: {
      name: 'Sunita Patil',
      phone: '+91 98221 44513',
      relationship: 'Spouse'
    }
  };

  const handleConfirmSos = () => {
    setStage('dispatching');

    // Simulate GPS lock & 108 Emergency Medical Services dispatch telemetry
    setTimeout(() => {
      const result = triggerEmergencySos(
        patient.id,
        patient.name,
        patient.phone,
        patient.village,
        patient.lat,
        patient.lng,
        patient.emergencyContact.name,
        patient.emergencyContact.phone
      );

      setDispatchData(result);
      recordNewEmergencyTriggered();
      setStage('active');
    }, 2000);
  };

  const handleCancelEmergency = () => {
    setStage('confirm');
    setDispatchData(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border-2 border-red-500 max-w-xl w-full overflow-hidden flex flex-col max-h-[94vh]">
        {/* Top Emergency Red Banner */}
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-rose-800 p-5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center animate-pulse-fast">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-red-200">
                Maharashtra State 108 EMS Network
              </div>
              <h2 className="text-xl font-black">
                {stage === 'confirm' && "Emergency Assistance Required?"}
                {stage === 'dispatching' && "Dispatching Nearest 108 Ambulance..."}
                {stage === 'active' && "🚨 EMERGENCY DISPATCH ACTIVE"}
              </h2>
            </div>
          </div>
          {stage === 'confirm' && (
            <button onClick={onClose} className="text-white/80 hover:text-white font-bold text-lg p-1">
              ✕
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* CONFIRM STAGE */}
          {stage === 'confirm' && (
            <div className="space-y-6 text-center py-4">
              <div className="w-20 h-20 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-inner animate-pulse">
                <AlertTriangle className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900">
                  Are you experiencing a critical emergency?
                </h3>
                <p className="text-xs text-slate-600 mt-2 max-w-sm mx-auto leading-relaxed">
                  Pressing <strong>Confirm SOS</strong> immediately transmits your current GPS coordinates to Maharashtra 108 Emergency dispatchers, alerts the nearest hospital trauma bay, and notifies your family contact.
                </p>
              </div>

              <div className="p-4 bg-red-50 rounded-2xl border border-red-200 text-left text-xs space-y-1.5 text-slate-700">
                <div className="font-bold text-red-900 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  <span>Immediate Escalation Actions:</span>
                </div>
                <div>1. Nearest 108 Ambulance mobilized with driver contact.</div>
                <div>2. Emergency alerts sent to: Rural Hospital Shirur.</div>
                <div>3. SMS dispatched to emergency contact ({patient.emergencyContact.name}).</div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSos}
                  className="flex-1 py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl text-sm transition shadow-lg shadow-red-600/40 transform hover:scale-105"
                >
                  Confirm SOS
                </button>
              </div>
            </div>
          )}

          {/* DISPATCHING STAGE */}
          {stage === 'dispatching' && (
            <div className="py-12 text-center space-y-6">
              <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                <span className="absolute w-24 h-24 rounded-full bg-red-400 opacity-30 animate-ping" />
                <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl">
                  <Ambulance className="w-8 h-8 animate-bounce" />
                </div>
              </div>

              <div>
                <h4 className="text-xl font-black text-slate-900">
                  Transmitting Telemetry to 108 Command Grid...
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Capturing GPS coordinates, querying fleet positions, and alerting emergency trauma centers.
                </p>
              </div>

              <div className="text-xs font-bold text-red-700 bg-red-50 py-2 px-4 rounded-full max-w-xs mx-auto border border-red-200">
                Contacting Shirur Station...
              </div>
            </div>
          )}

          {/* ACTIVE DISPATCH SCREEN */}
          {stage === 'active' && dispatchData && (
            <div className="space-y-5 animate-fadeIn">
              {/* Telemetry Card */}
              <div className="bg-red-50/70 border-2 border-red-300 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-red-200/80 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-sm">
                      <Ambulance className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider block">
                        Assigned 108 Ambulance
                      </span>
                      <h4 className="text-lg font-black text-slate-900">
                        {dispatchData.ambulance.vehicleNumber}
                      </h4>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Dispatch Status
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-red-600 text-white font-extrabold text-xs inline-block animate-pulse">
                      Dispatched
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-red-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Estimated ETA</span>
                    <strong className="text-base font-black text-red-700">
                      {dispatchData.request.etaMinutes} min
                    </strong>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-red-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Driver</span>
                    <strong className="text-xs font-bold text-slate-900 block truncate">
                      {dispatchData.ambulance.driverName}
                    </strong>
                    <span className="text-[10px] text-slate-500">{dispatchData.ambulance.driverPhone}</span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-red-200 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Target Facility</span>
                    <strong className="text-xs font-bold text-slate-900 block truncate">
                      {dispatchData.hospital.name}
                    </strong>
                    <span className="text-[10px] text-emerald-700 font-semibold">Trauma Alerted</span>
                  </div>
                </div>

                {/* Map Mini-View */}
                <div className="pt-1">
                  <LeafletMap
                    center={[patient.lat, patient.lng]}
                    zoom={13}
                    height="170px"
                    interactive={false}
                    markers={[
                      {
                        id: 'patient-sos',
                        lat: patient.lat,
                        lng: patient.lng,
                        title: 'Emergency Patient Location',
                        type: 'emergency',
                        badge: 'SOS ACTIVE'
                      },
                      {
                        id: 'amb-unit',
                        lat: dispatchData.ambulance.lat,
                        lng: dispatchData.ambulance.lng,
                        title: dispatchData.ambulance.vehicleNumber,
                        type: 'ambulance',
                        badge: 'EN ROUTE'
                      }
                    ]}
                  />
                </div>

                {/* Statutory Disclaimer Notice */}
                <div className="p-3 bg-white rounded-xl border border-red-200 text-[11px] text-slate-600 leading-relaxed">
                  <strong className="text-red-900">Disclaimer: </strong>
                  {dispatchData.disclaimer}
                </div>

                {/* SMS Broadcast Notification Proof */}
                <div className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[10px] space-y-1">
                  <div className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Emergency Family SMS Transmitted:</span>
                  </div>
                  <p className="text-slate-300">"{dispatchData.smsMessage}"</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={`tel:${dispatchData.ambulance.driverPhone}`}
                  className="py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-md transition"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Ambulance Driver</span>
                </a>

                <a
                  href={`tel:${dispatchData.hospital.contactPhone}`}
                  className="py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Call Hospital ({dispatchData.hospital.name.slice(0, 18)}...)</span>
                </a>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={handleCancelEmergency}
                  className="text-xs text-slate-400 hover:text-red-600 font-semibold transition"
                >
                  Cancel Emergency Escalation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
