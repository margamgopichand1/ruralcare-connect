import React, { useState } from 'react';
import { mockNearbyProviders } from '../../data/mockData';
import { NearbyProvider } from '../../types';
import {
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Stethoscope,
  HeartHandshake,
  UserCheck,
  Phone,
  ArrowRight,
  Filter,
  Sparkles,
  Info
} from 'lucide-react';

interface CareNearMeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestHomeVisit: (provider: NearbyProvider) => void;
  onSelectDoctorDirectly?: (provider: NearbyProvider) => void;
}

const CONDITIONS_FILTER = [
  'All Conditions',
  'Fever & Cold',
  'BP Monitoring',
  'Diabetes Follow-up',
  'Basic Check-up',
  'Elderly Care',
  'Maternal ANC'
];

export const CareNearMeModal: React.FC<CareNearMeModalProps> = ({
  isOpen,
  onClose,
  onRequestHomeVisit
}) => {
  const [selectedRole, setSelectedRole] = useState<'all' | 'doctor' | 'asha' | 'nurse'>('all');
  const [selectedCondition, setSelectedCondition] = useState('All Conditions');

  if (!isOpen) return null;

  const filteredProviders = mockNearbyProviders.filter((p) => {
    if (selectedRole !== 'all' && p.role !== selectedRole) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 p-5 sm:p-6 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-xl font-bold p-1 rounded-lg hover:bg-white/10 transition"
          >
            ✕
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Care Near Me • Scope-of-Practice Matching</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Nearby Authorized Healthcare Providers</h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1">
            Registered public health doctors, certified ASHA workers, and ANM nurses stationed within your rural panchayat circle.
          </p>
        </div>

        {/* Scope of Practice Notice */}
        <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-2.5 flex items-start gap-2.5 text-xs text-emerald-900 shrink-0">
          <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <span>
            <strong>Scope of Practice Protocol:</strong> ASHA workers provide doorstep vitals screening, maternal/child support, and medicine delivery. ANM nurses perform injections, dressings, and postpartum care. Doctors handle diagnosis and prescription.
          </span>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Role Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setSelectedRole('all')}
              className={`px-3 py-1 rounded-lg transition ${
                selectedRole === 'all' ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Roles ({mockNearbyProviders.length})
            </button>
            <button
              onClick={() => setSelectedRole('doctor')}
              className={`px-3 py-1 rounded-lg transition ${
                selectedRole === 'doctor' ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Doctors
            </button>
            <button
              onClick={() => setSelectedRole('asha')}
              className={`px-3 py-1 rounded-lg transition ${
                selectedRole === 'asha' ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ASHA Workers
            </button>
            <button
              onClick={() => setSelectedRole('nurse')}
              className={`px-3 py-1 rounded-lg transition ${
                selectedRole === 'nurse' ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ANM / Nurses
            </button>
          </div>

          {/* Condition Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Care Reason:</span>
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="text-xs font-bold border border-slate-200 rounded-xl px-2.5 py-1.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {CONDITIONS_FILTER.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Provider List */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {filteredProviders.map((prov) => (
            <div
              key={prov.id}
              className="bg-white rounded-2xl border-2 border-slate-200 hover:border-emerald-500 transition-all p-4 sm:p-5 shadow-sm hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <img
                  src={prov.avatar}
                  alt={prov.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/50 shadow-sm shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-extrabold text-slate-900 text-base">{prov.name}</h3>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Verified {prov.role === 'doctor' ? 'Medical Practitioner' : prov.role === 'asha' ? 'NHM ASHA' : 'Govt Nurse'}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-slate-600">
                    {prov.specialization} • <span className="text-slate-500">{prov.qualification}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
                    <span className="flex items-center gap-1 font-bold text-slate-800">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      {prov.distanceKm} km away
                    </span>
                    <span className="flex items-center gap-1 font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                      <Clock className="w-3.5 h-3.5" />
                      ETA: {prov.etaMinutes} min
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Area: {prov.areaServed}
                    </span>
                  </div>

                  {/* Services Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {prov.services.map((svc, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-md"
                      >
                        ✓ {svc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex md:flex-col items-center md:items-end justify-between gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 shrink-0">
                <div className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Available On Duty
                </div>
                <button
                  onClick={() => {
                    onRequestHomeVisit(prov);
                    onClose();
                  }}
                  className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-1.5"
                >
                  <span>Request Home Visit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
