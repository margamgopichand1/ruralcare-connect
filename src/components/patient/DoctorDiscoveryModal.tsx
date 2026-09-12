import React, { useState } from 'react';
import { mockDoctors } from '../../data/mockData';
import { Doctor } from '../../types';
import { addNewPatientToQueue } from '../../services/queueService';
import {
  Stethoscope,
  Star,
  Clock,
  MapPin,
  ShieldCheck,
  Calendar,
  Video,
  Building,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Ticket
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DoctorDiscoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedSymptoms?: string;
}

const SPECIALTIES = [
  'All Specialties',
  'General Physician',
  'Cardiology',
  'Pediatrics / Child Health',
  'Integrative Medicine'
];

export const DoctorDiscoveryModal: React.FC<DoctorDiscoveryModalProps> = ({
  isOpen,
  onClose,
  preselectedSymptoms
}) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [selectedConsultType, setSelectedConsultType] = useState<'all' | 'tele' | 'in_person'>('all');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [bookingDate, setBookingDate] = useState('Today (Immediate)');
  const [bookingSlot, setBookingSlot] = useState('06:00 PM');
  const [bookedToken, setBookedToken] = useState<{ token: string; wait: number; docName: string } | null>(null);

  if (!isOpen) return null;

  const filteredDoctors = mockDoctors.filter((doc) => {
    if (selectedSpecialty !== 'All Specialties' && !doc.specialization.includes(selectedSpecialty.split('/')[0].trim())) {
      return false;
    }
    return true;
  });

  const handleConfirmBooking = () => {
    if (!selectedDoctor) return;

    const newQueue = addNewPatientToQueue(
      'pat-1',
      'Ramesh Patil',
      48,
      'Male',
      preselectedSymptoms || 'General consultation & checkup',
      'normal'
    );

    setBookedToken({
      token: newQueue.tokenNumber,
      wait: newQueue.estimatedWaitMinutes,
      docName: selectedDoctor.name
    });

    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-800 to-emerald-900 p-5 sm:p-6 text-white relative shrink-0">
          <button
            onClick={() => {
              setBookedToken(null);
              setSelectedDoctor(null);
              onClose();
            }}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-xl font-bold p-1 rounded-lg hover:bg-white/10 transition"
          >
            ✕
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Explainable Smart Doctor Discovery</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Discover & Book Doctor</h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1">
            Shortlist verified physicians based on specialty, public health facility, real-time slot availability, and teleconsultation access.
          </p>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {bookedToken ? (
            /* Digital Token Success Screen */
            <div className="space-y-5 text-center py-4 animate-fadeIn">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                <Ticket className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Appointment Confirmed
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">Digital Token Allocated</h3>
                <p className="text-xs text-slate-600">
                  Consultation booked with <strong>{bookedToken.docName}</strong> at Primary Health Centre.
                </p>
              </div>

              {/* Token Ticket Card */}
              <div className="max-w-sm mx-auto bg-gradient-to-br from-slate-900 to-teal-950 text-white rounded-3xl p-6 shadow-xl border-2 border-emerald-500/40 text-left space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-[10px] uppercase font-bold text-emerald-400">RuralCare Connect Token</span>
                  <span className="text-xs font-mono text-slate-400">{new Date().toLocaleDateString()}</span>
                </div>

                <div className="text-center py-2">
                  <div className="text-xs text-slate-400 uppercase font-bold">Your Digital Token</div>
                  <div className="text-5xl font-black tracking-wider text-emerald-300 my-1 font-mono">
                    {bookedToken.token}
                  </div>
                  <div className="text-xs text-emerald-100">
                    Now Serving: <strong className="text-white">A-021</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Estimated Wait</span>
                    <strong className="text-amber-300 font-bold">{bookedToken.wait} Minutes</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Consultation Type</span>
                    <strong className="text-white font-bold">PHC Outpatient</strong>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setBookedToken(null);
                  setSelectedDoctor(null);
                  onClose();
                }}
                className="px-8 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm rounded-xl shadow-lg transition"
              >
                Return to Dashboard
              </button>
            </div>
          ) : selectedDoctor ? (
            /* Booking Confirmation Screen */
            <div className="space-y-5 animate-fadeIn">
              <button
                onClick={() => setSelectedDoctor(null)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                ← Back to Doctor List
              </button>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-start gap-4">
                <img
                  src={selectedDoctor.avatar}
                  alt={selectedDoctor.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shrink-0"
                />
                <div className="space-y-1">
                  <h3 className="font-black text-slate-900 text-lg">{selectedDoctor.name}</h3>
                  <p className="text-xs text-slate-600 font-semibold">{selectedDoctor.qualification} • {selectedDoctor.specialization}</p>
                  <p className="text-[11px] text-slate-500">Service Area: {selectedDoctor.serviceArea}</p>
                </div>
              </div>

              {/* Explainability Highlight Card */}
              <div className="bg-teal-50 border border-teal-200 rounded-2xl p-3.5 text-xs text-teal-950 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Why Recommended:</strong> Shortlisted because of medical specialty matching your symptoms, verified availability on duty at PHC Karegaon, and nearest proximity (1.8 km).
                </span>
              </div>

              {/* Slot Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Appointment Slot:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM'].map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setBookingSlot(slot)}
                        className={`p-2 rounded-xl text-xs font-bold border transition ${
                          bookingSlot === slot
                            ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Consultation Mode:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="p-2 rounded-xl text-xs font-bold border bg-emerald-700 text-white border-emerald-700 flex items-center justify-center gap-1.5 shadow-sm">
                      <Building className="w-3.5 h-3.5" />
                      <span>PHC In-Person</span>
                    </button>
                    <button className="p-2 rounded-xl text-xs font-bold border bg-white text-slate-700 border-slate-200 hover:border-slate-300 flex items-center justify-center gap-1.5">
                      <Video className="w-3.5 h-3.5" />
                      <span>Teleconsult</span>
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={handleConfirmBooking}
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-700/20 transition flex items-center justify-center gap-2"
              >
                <span>Confirm Booking & Generate Digital Token</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Doctor List */
            <div className="space-y-4">
              {/* Filter Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Filter Specialty:</span>
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="text-xs font-bold border border-slate-200 rounded-xl px-3 py-1.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {SPECIALTIES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <span className="text-xs font-bold text-slate-500">
                  Showing {filteredDoctors.length} Registered Public Health Doctors
                </span>
              </div>

              {/* Cards Grid */}
              <div className="space-y-3">
                {filteredDoctors.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white rounded-2xl border-2 border-slate-200 hover:border-emerald-500 p-4 transition-all shadow-sm hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <img
                        src={doc.avatar}
                        alt={doc.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500 shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-slate-900 text-base">{doc.name}</h4>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            Verified
                          </span>
                        </div>

                        <p className="text-xs font-semibold text-slate-600">
                          {doc.specialization} • <span className="text-slate-500">{doc.qualification}</span>
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                          <span className="flex items-center gap-1 font-bold text-slate-700">
                            <Clock className="w-3.5 h-3.5 text-emerald-600" />
                            Available Today (6:00 PM)
                          </span>
                          <span className="flex items-center gap-1 text-amber-600 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            {doc.rating} ({doc.totalReviews} reviews)
                          </span>
                          <span className="flex items-center gap-1 text-teal-700 font-semibold">
                            <Video className="w-3.5 h-3.5" />
                            Teleconsult + In-Person
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-500 italic pt-1">
                          "Recommended because of specialty + availability + care requirement."
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedDoctor(doc)}
                      className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <span>Book Appointment</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
