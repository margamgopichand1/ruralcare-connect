import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockPatients } from '../../data/mockData';
import { User, ShieldCheck, Heart, AlertCircle, Phone, MapPin, Globe, CheckCircle2 } from 'lucide-react';

interface PatientProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PatientProfileModal: React.FC<PatientProfileModalProps> = ({
  isOpen,
  onClose
}) => {
  const { currentPatient } = useAuth();
  const patient = currentPatient || mockPatients[0];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white font-bold text-lg p-1"
          >
            ✕
          </button>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white font-bold text-xl border-2 border-white/30">
              <User className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-[11px] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>ABHA Verified ID</span>
              </div>
              <h2 className="text-xl font-black">{patient.name}</h2>
              <p className="text-xs text-emerald-200">{patient.abhaId}</p>
            </div>
          </div>
        </div>

        {/* Details Content */}
        <div className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Age & Gender</span>
              <span className="font-extrabold text-slate-800 text-sm">{patient.age} Yrs • {patient.gender}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Blood Group</span>
              <span className="font-extrabold text-red-600 text-sm">{patient.bloodGroup}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Registered Mobile</span>
              <span className="font-bold text-slate-800">{patient.phone}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Language</span>
              <span className="font-bold text-slate-800 capitalize">{patient.preferredLanguage === 'mr' ? 'मराठी (Marathi)' : 'English'}</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-slate-400 block text-[10px] uppercase font-bold flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-500" />
              Rural Residence
            </span>
            <span className="font-extrabold text-slate-900 text-sm">
              {patient.village}, Taluka {patient.taluka}, District {patient.district}
            </span>
            <p className="text-slate-500 text-[11px]">Assigned Primary PHC: PHC Karegaon (800m)</p>
          </div>

          <div className="p-3.5 bg-red-50/70 border border-red-200 rounded-xl space-y-1">
            <span className="text-red-800 block text-[10px] uppercase font-bold flex items-center gap-1">
              <Phone className="w-3 h-3" />
              Designated Emergency Contact
            </span>
            <div className="flex justify-between items-center">
              <div>
                <strong className="text-slate-900">{patient.emergencyContact.name}</strong>
                <span className="text-slate-500 ml-1">({patient.emergencyContact.relationship})</span>
              </div>
              <span className="font-mono font-bold text-red-700">{patient.emergencyContact.phone}</span>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <div>
              <span className="font-bold text-slate-700 block mb-1">Drug Allergies:</span>
              <div className="flex flex-wrap gap-1.5">
                {patient.allergies.length > 0 ? (
                  patient.allergies.map((all) => (
                    <span key={all} className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 font-bold text-[11px]">
                      ⚠️ {all}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500">No known drug allergies</span>
                )}
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-700 block mb-1">Pre-existing Medical Conditions:</span>
              <div className="flex flex-wrap gap-1.5">
                {patient.medicalConditions.map((cond) => (
                  <span key={cond} className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold text-[11px]">
                    {cond}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
