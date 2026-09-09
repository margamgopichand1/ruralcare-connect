import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockDoctors, mockVisitRequests } from '../../data/mockData';
import { VisitRequest } from '../../types';
import {
  Stethoscope,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Clock,
  MapPin,
  AlertTriangle,
  UserCheck,
  CheckCircle,
  XCircle,
  Calendar,
  Users,
  Activity,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface DoctorDashboardProps {
  onStartWorkflow: (visitRequest: VisitRequest) => void;
  onOpenVerification: () => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  onStartWorkflow,
  onOpenVerification
}) => {
  const { currentDoctor } = useAuth();
  const doctor = currentDoctor || mockDoctors[0];

  const [isAvailable, setIsAvailable] = useState(doctor.isAvailable);
  const [incomingRequests, setIncomingRequests] = useState<VisitRequest[]>([
    {
      id: 'req-live-1',
      patientId: 'pat-1',
      patientName: 'Ramesh Patil',
      patientAge: 48,
      patientGender: 'Male',
      category: 'fever',
      symptoms: 'High fever (102°F) since yesterday with severe shivering and body ache.',
      urgency: 'urgent',
      lat: 18.8256,
      lng: 74.3721,
      address: 'Near Vitthal Temple, Karegaon, Tal. Shirur',
      preferredLanguage: 'mr',
      doctorId: doctor.id,
      doctorName: doctor.name,
      status: 'pending',
      distanceKm: 1.8,
      etaMinutes: 8,
      requestedAt: '5 min ago'
    },
    {
      id: 'req-live-2',
      patientId: 'pat-2',
      patientName: 'Anandi Bai Shinde',
      patientAge: 67,
      patientGender: 'Female',
      category: 'elderly_care',
      symptoms: 'Mild dizziness on standing up, knee joint pain.',
      urgency: 'soon',
      lat: 18.8410,
      lng: 74.3215,
      address: 'Bungalow Road, Pabal, Tal. Shirur',
      preferredLanguage: 'mr',
      doctorId: doctor.id,
      doctorName: doctor.name,
      status: 'pending',
      distanceKm: 4.2,
      etaMinutes: 14,
      requestedAt: '18 min ago'
    }
  ]);

  const [completedVisitsCount, setCompletedVisitsCount] = useState(6);

  const handleAcceptRequest = (req: VisitRequest) => {
    req.status = 'accepted';
    onStartWorkflow(req);
  };

  const handleDeclineRequest = (id: string) => {
    setIncomingRequests((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Doctor Control Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <img
              src={doctor.avatar}
              alt={doctor.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-md shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black">{doctor.name}</h1>
                {doctor.isVerified ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Verified MMC Doctor ✓</span>
                  </span>
                ) : (
                  <button
                    onClick={onOpenVerification}
                    className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1 hover:bg-amber-500/30"
                  >
                    <span>Verification Pending — Complete Now</span>
                  </button>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                {doctor.qualification} • {doctor.specialization} ({doctor.experience} Yrs Exp)
              </p>
              <p className="text-xs text-emerald-400 font-mono mt-0.5">
                License: {doctor.licenseNumber} • Service Zone: {doctor.serviceArea}
              </p>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 self-start md:self-auto bg-white/5 p-4 rounded-2xl border border-white/10">
            <div>
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Visit Availability
              </div>
              <div className="text-sm font-black text-white">
                {isAvailable ? '🟢 Online & Accepting Calls' : '⚪ Offline / Resting'}
              </div>
            </div>

            <button
              onClick={() => setIsAvailable(!isAvailable)}
              className={`p-2 rounded-xl transition flex items-center gap-2 text-xs font-bold ${
                isAvailable
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
              }`}
            >
              {isAvailable ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
              <span>{isAvailable ? 'Go Offline' : 'Go Online'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Today's Visits</span>
            <Calendar className="w-4 h-4 text-health-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">7</div>
          <div className="text-xs text-emerald-700 font-medium mt-1">Doorstep checkups</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Requests</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600">{incomingRequests.length}</div>
          <div className="text-xs text-slate-500 font-medium mt-1">Awaiting dispatch accept</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Completed Visits</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{completedVisitsCount}</div>
          <div className="text-xs text-slate-500 font-medium mt-1">Prescriptions archived</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Patients Served</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-indigo-900">248</div>
          <div className="text-xs text-slate-500 font-medium mt-1">⭐ 4.8 Patient Rating</div>
        </div>
      </div>

      {/* Main Section: New Visit Requests Queue */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span>Incoming Visit Requests</span>
              <span className="px-2.5 py-0.5 rounded-full bg-health-100 text-health-800 text-xs font-bold">
                Live Queue
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Patients in your service radius matched by the dispatch algorithm.
            </p>
          </div>
        </div>

        {incomingRequests.length === 0 ? (
          <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-200">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="font-extrabold text-slate-900 text-base">All Caught Up!</h3>
            <p className="text-xs text-slate-500 mt-1">No pending visit requests in your vicinity right now.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {incomingRequests.map((req) => {
              const isUrgent = req.urgency === 'urgent' || req.urgency === 'emergency';
              return (
                <div
                  key={req.id}
                  className={`p-5 rounded-2xl border-2 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 ${
                    isUrgent
                      ? 'border-amber-400 bg-amber-50/40 shadow-sm ring-2 ring-amber-500/10'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-black text-slate-900 text-lg">
                        {req.patientName} ({req.patientAge} Yrs, {req.patientGender})
                      </span>
                      <span
                        className={`text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          isUrgent ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {req.urgency}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-health-100 text-health-800 font-bold capitalize">
                        {req.category.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-800">
                      Reported Symptoms: <span className="font-normal text-slate-600 italic">"{req.symptoms}"</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <strong>{req.address}</strong>
                      </span>
                      <span className="flex items-center gap-1 font-bold text-slate-700">
                        Distance: <strong>{req.distanceKm} km</strong>
                      </span>
                      <span className="flex items-center gap-1 font-bold text-emerald-800">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        Est. Travel Time: <strong>{req.etaMinutes} mins</strong>
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => handleDeclineRequest(req.id)}
                      className="px-4 py-2.5 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl font-bold text-xs transition"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleAcceptRequest(req)}
                      className="px-6 py-2.5 bg-health-700 hover:bg-health-800 text-white rounded-xl font-extrabold text-xs shadow-md transition flex items-center gap-1.5"
                    >
                      <span>Accept & Navigate</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
