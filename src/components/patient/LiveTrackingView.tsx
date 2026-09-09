import React, { useState, useEffect } from 'react';
import { Doctor, VisitRequest } from '../../types';
import { LeafletMap } from '../common/LeafletMap';
import {
  generateRouteWaypoints,
  getInterpolatedProgress,
  RouteCoordinate
} from '../../services/liveTrackingService';
import {
  Phone,
  MessageSquare,
  XCircle,
  Clock,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  Send,
  AlertCircle
} from 'lucide-react';

interface LiveTrackingViewProps {
  doctor: Doctor;
  patientLat: number;
  patientLng: number;
  initialDistanceKm?: number;
  initialEtaMinutes?: number;
  visitRequest?: VisitRequest;
  onArrived?: () => void;
  onCancelVisit?: () => void;
}

export const LiveTrackingView: React.FC<LiveTrackingViewProps> = ({
  doctor,
  patientLat,
  patientLng,
  initialDistanceKm = 1.8,
  initialEtaMinutes = 8,
  visitRequest,
  onArrived,
  onCancelVisit
}) => {
  const [waypoints, setWaypoints] = useState<RouteCoordinate[]>([]);
  const [progressPct, setProgressPct] = useState(15); // Start at 15% progress
  const [currentPos, setCurrentPos] = useState<RouteCoordinate>({ lat: doctor.lat, lng: doctor.lng });
  const [remainingDist, setRemainingDist] = useState(initialDistanceKm);
  const [remainingEta, setRemainingEta] = useState(initialEtaMinutes);
  const [isArrived, setIsArrived] = useState(false);

  // Call & Message modals simulation
  const [showCallModal, setShowCallModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: 'patient' | 'doctor'; text: string; time: string }[]>([
    {
      sender: 'doctor',
      text: 'Namaste, I have accepted your visit. I am carrying standard fever diagnostic kit and medications. See you shortly.',
      time: 'Just now'
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  // Generate route waypoints on mount
  useEffect(() => {
    const pts = generateRouteWaypoints(doctor.lat, doctor.lng, patientLat, patientLng, 30);
    setWaypoints(pts);
    setCurrentPos(pts[0] || { lat: doctor.lat, lng: doctor.lng });
  }, [doctor.lat, doctor.lng, patientLat, patientLng]);

  // Smooth movement simulation ticker
  useEffect(() => {
    if (waypoints.length === 0 || isArrived) return;

    const interval = setInterval(() => {
      setProgressPct((prev) => {
        const next = prev + 3; // Advance ~3% every 1.5s for smooth prototype viewing
        const update = getInterpolatedProgress(waypoints, next, initialDistanceKm, initialEtaMinutes);
        setCurrentPos(update.currentPosition);
        setRemainingDist(update.remainingDistanceKm);
        setRemainingEta(update.remainingEtaMinutes);

        if (update.isArrived) {
          setIsArrived(true);
          if (onArrived) onArrived();
          return 100;
        }
        return next;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [waypoints, isArrived, initialDistanceKm, initialEtaMinutes]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const newMsg = {
      sender: 'patient' as const,
      text: inputMsg.trim(),
      time: 'Just now'
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setInputMsg('');

    // Simulate doctor auto-reply after 1.5s
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'doctor',
          text: 'Acknowledged. Almost at your lane, please keep landmark gate visible.',
          time: 'Just now'
        }
      ]);
    }, 1500);
  };

  const polylineCoordinates: [number, number][] = waypoints.map((w) => [w.lat, w.lng]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 animate-fadeIn">
      {/* Status Header Banner */}
      <div className="bg-gradient-to-r from-health-800 to-teal-900 rounded-2xl p-4 sm:p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <Navigation className={`w-6 h-6 text-emerald-300 ${!isArrived ? 'animate-bounce' : ''}`} />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
              {isArrived ? 'Doctor Has Arrived' : 'Doctor En Route'}
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              {isArrived ? `${doctor.name} has arrived at your doorstep!` : `${doctor.name} is on the way`}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs font-bold">
            Live Simulated GPS Feed
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-3 border border-slate-200 shadow-sm">
          <LeafletMap
            center={[currentPos.lat, currentPos.lng]}
            zoom={15}
            height="440px"
            polyline={polylineCoordinates}
            markers={[
              {
                id: 'doctor-moving',
                lat: currentPos.lat,
                lng: currentPos.lng,
                title: doctor.name,
                type: 'doctor',
                subtitle: isArrived ? 'Arrived at destination' : `En route • ${remainingDist} km`,
                badge: isArrived ? 'ARRIVED' : `${remainingEta} MIN`
              },
              {
                id: 'patient-destination',
                lat: patientLat,
                lng: patientLng,
                title: 'Your Doorstep',
                type: 'patient',
                subtitle: 'Patient Location'
              }
            ]}
          />
        </div>

        {/* Doctor Information & Live Telemetry Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-start gap-4">
              <img
                src={doctor.avatar}
                alt={doctor.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-health-600 shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-slate-900 text-base truncate">
                    {doctor.name}
                  </h3>
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                </div>
                <p className="text-xs font-semibold text-slate-700">
                  {doctor.specialization}
                </p>
                <p className="text-[11px] text-slate-500">
                  {doctor.qualification} • {doctor.licenseNumber}
                </p>
              </div>
            </div>

            {/* Live Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                <div className="text-[10px] uppercase font-bold text-emerald-800">
                  Estimated Arrival
                </div>
                <div className="text-2xl font-black text-emerald-900 mt-0.5">
                  {isArrived ? 'Arrived' : `${remainingEta} min`}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                <div className="text-[10px] uppercase font-bold text-slate-500">
                  Distance Remaining
                </div>
                <div className="text-2xl font-black text-slate-800 mt-0.5">
                  {remainingDist} km
                </div>
              </div>
            </div>

            {/* Stage indicator */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Trip Progress</span>
                <span className="text-health-700">{progressPct}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-health-600 h-full rounded-full transition-all duration-700"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 italic text-center">
                {isArrived
                  ? 'Doctor is walking into your residence with medical kit.'
                  : 'Traveling via village main road. Telemetry synced.'}
              </p>
            </div>

            {/* Contact Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowCallModal(true)}
                className="py-3 px-4 bg-health-700 hover:bg-health-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
              >
                <Phone className="w-4 h-4" />
                <span>Call Doctor</span>
              </button>

              <button
                onClick={() => setShowMessageModal(true)}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Message</span>
              </button>
            </div>

            {/* Cancel visit button */}
            {!isArrived && (
              <button
                onClick={onCancelVisit}
                className="w-full py-2.5 text-xs text-slate-500 hover:text-red-600 font-semibold transition flex items-center justify-center gap-1.5"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Cancel Visit Request</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Call Doctor Modal */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border border-slate-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Phone className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Calling {doctor.name}...</h3>
            <p className="text-xs text-slate-500 mt-1">{doctor.phone}</p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 my-5 text-xs text-slate-600">
              Simulated direct telephony line. Doctor is on speaker while riding to your location.
            </div>
            <button
              onClick={() => setShowCallModal(false)}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition"
            >
              End Call
            </button>
          </div>
        </div>
      )}

      {/* Message Doctor Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col h-[480px]">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={doctor.avatar} alt={doctor.name} className="w-9 h-9 rounded-xl object-cover" />
                <div>
                  <h4 className="font-bold text-sm">{doctor.name}</h4>
                  <p className="text-[10px] text-emerald-400 font-medium">Active on route</p>
                </div>
              </div>
              <button onClick={() => setShowMessageModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
              {chatMessages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${m.sender === 'patient' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      m.sender === 'patient'
                        ? 'bg-health-700 text-white rounded-br-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-xs'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1">{m.time}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Type instructions (e.g. Near blue gate)..."
                className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-health-500"
              />
              <button
                type="submit"
                className="p-2.5 bg-health-700 hover:bg-health-800 text-white rounded-xl shadow-sm transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
