import React, { useState, useEffect } from 'react';
import { Doctor, VisitCategory, VisitUrgency } from '../../types';
import { findMatchingDoctors, MatchedDoctorCandidate } from '../../services/matchingService';
import {
  Search,
  Radar,
  Sparkles,
  Star,
  Clock,
  MapPin,
  CheckCircle,
  UserCheck,
  ShieldCheck,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DoctorMatchingModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientLat: number;
  patientLng: number;
  category: VisitCategory;
  urgency: VisitUrgency;
  patientId: string;
  onDoctorAccepted: (matchedDoctor: Doctor, distanceKm: number, etaMinutes: number) => void;
}

export const DoctorMatchingModal: React.FC<DoctorMatchingModalProps> = ({
  isOpen,
  onClose,
  patientLat,
  patientLng,
  category,
  urgency,
  patientId,
  onDoctorAccepted
}) => {
  const [matchingState, setMatchingState] = useState<'searching' | 'candidates_found' | 'request_sent' | 'accepted'>('searching');
  const [candidates, setCandidates] = useState<MatchedDoctorCandidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<MatchedDoctorCandidate | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMatchingState('searching');
      setSelectedCandidate(null);

      // Simulate radar scan delay (2 seconds)
      const timer = setTimeout(() => {
        const found = findMatchingDoctors(patientLat, patientLng, category, urgency, patientId);
        setCandidates(found);
        setMatchingState('candidates_found');
        if (found.length > 0) {
          setSelectedCandidate(found[0]);
        }
      }, 2200);

      return () => clearTimeout(timer);
    }
  }, [isOpen, patientLat, patientLng, category, urgency, patientId]);

  if (!isOpen) return null;

  const handleRequestDoctor = (candidate: MatchedDoctorCandidate) => {
    setSelectedCandidate(candidate);
    setMatchingState('request_sent');

    // Simulate doctor receiving notification and accepting after 3.2 seconds
    setTimeout(() => {
      setMatchingState('accepted');
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      setTimeout(() => {
        onDoctorAccepted(candidate.doctor, candidate.distanceKm, candidate.etaMinutes);
        onClose();
      }, 2000);
    }, 3200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">Rural Healthcare Dispatch Engine</h3>
              <p className="text-xs text-emerald-200">Haversine GPS & Continuity Scoring</p>
            </div>
          </div>
          {matchingState === 'candidates_found' && (
            <button onClick={onClose} className="text-white/80 hover:text-white font-bold p-1">
              ✕
            </button>
          )}
        </div>

        {/* Content Stages */}
        <div className="p-6">
          {/* STAGE 1: RADAR SCANNING */}
          {matchingState === 'searching' && (
            <div className="py-12 text-center space-y-6">
              <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                <span className="absolute w-32 h-32 rounded-full border-4 border-health-400 opacity-20 animate-ping" />
                <span className="absolute w-24 h-24 rounded-full border-4 border-health-500 opacity-40 animate-pulse" />
                <div className="w-16 h-16 rounded-full bg-health-700 text-white flex items-center justify-center shadow-xl">
                  <Radar className="w-8 h-8 animate-spin" />
                </div>
              </div>

              <div>
                <h4 className="text-xl font-black text-slate-900">
                  Finding the nearest available healthcare professional...
                </h4>
                <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto leading-relaxed">
                  Scanning verified MMC physicians across Shirur, Junnar, and surrounding PHC circles.
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-health-800 bg-health-50 py-2 px-4 rounded-full max-w-xs mx-auto border border-health-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Geospatial matching in progress...</span>
              </div>
            </div>
          )}

          {/* STAGE 2: CANDIDATES FOUND */}
          {matchingState === 'candidates_found' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">
                    Available Matches Nearby ({candidates.length})
                  </h4>
                  <p className="text-xs text-slate-500">
                    Ranked by shortest arrival time, doctor rating, and specialty match.
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  Top Match
                </span>
              </div>

              {candidates.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                  <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700">No doctors currently available in this radius.</p>
                  <p className="text-xs text-slate-500 mt-1">Please expand search radius or use Emergency SOS.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {candidates.map((cand, idx) => {
                    const doc = cand.doctor;
                    const isSelected = selectedCandidate?.doctor.id === doc.id;
                    return (
                      <div
                        key={doc.id}
                        onClick={() => setSelectedCandidate(cand)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                          isSelected
                            ? 'border-health-600 bg-health-50/70 shadow-md ring-2 ring-health-500/20'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        {idx === 0 && (
                          <div className="absolute top-2.5 right-3 text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-md shadow-xs">
                            Recommended Match
                          </div>
                        )}

                        <div className="flex items-start gap-3.5">
                          <img
                            src={doc.avatar}
                            alt={doc.name}
                            className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h5 className="font-extrabold text-slate-900 text-sm truncate">
                                {doc.name}
                              </h5>
                              <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                            </div>
                            <p className="text-xs font-semibold text-slate-700">
                              {doc.specialization}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {doc.qualification} • {doc.licenseNumber}
                            </p>

                            <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
                              <span className="font-extrabold text-emerald-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                                {cand.distanceKm} km away
                              </span>
                              <span className="font-extrabold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-500" />
                                ETA: {cand.etaMinutes} min
                              </span>
                              <span className="font-bold text-amber-700 bg-white px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1">
                                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                {doc.rating}
                              </span>
                              {cand.continuityOfCare && (
                                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                  Treated You Before
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRequestDoctor(cand);
                            }}
                            className="mt-3.5 w-full py-2.5 bg-health-700 hover:bg-health-800 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
                          >
                            <span>Request Doctor</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* STAGE 3: REQUEST SENT & WAITING ACCEPTANCE */}
          {matchingState === 'request_sent' && (
            <div className="py-10 text-center space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-md">
                <Clock className="w-8 h-8 animate-spin" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider">
                  Request Sent
                </span>
                <h4 className="text-xl font-black text-slate-900 mt-2">
                  Waiting for {selectedCandidate?.doctor.name} to accept...
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                  Doctor has received your doorstep request telemetry. Preparing visit equipment.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 max-w-xs mx-auto text-xs text-slate-600">
                Estimated arrival after acceptance: <strong>{selectedCandidate?.etaMinutes} minutes</strong>
              </div>
            </div>
          )}

          {/* STAGE 4: DOCTOR ACCEPTED */}
          {matchingState === 'accepted' && (
            <div className="py-8 text-center space-y-5 animate-scaleUp">
              <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/40 animate-bounce">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                  Accepted ✓
                </span>
                <h4 className="text-2xl font-black text-slate-900 mt-2">
                  {selectedCandidate?.doctor.name} Accepted Your Visit!
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  Doctor is preparing vehicle and navigating to your doorstep.
                </p>
              </div>

              <p className="text-xs font-semibold text-emerald-700">
                Opening Live Route Tracking Map...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
