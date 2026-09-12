import React, { useState } from 'react';
import { useNetwork } from '../../context/NetworkContext';
import { queueOfflineAction } from '../../services/offlineSyncService';
import {
  UserPlus,
  ShieldCheck,
  MapPin,
  Phone,
  CheckCircle2,
  WifiOff,
  Wifi,
  Save,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PatientRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PatientRegistrationModal: React.FC<PatientRegistrationModalProps> = ({
  isOpen,
  onClose
}) => {
  const { isOnline } = useNetwork();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [village, setVillage] = useState('Karegaon');
  const [phone, setPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [conditions, setConditions] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const patientData = {
      name: name || 'Sita Waghmare',
      age: age || '32',
      gender,
      village,
      phone: phone || '+91 94220 88711',
      bloodGroup,
      conditions: conditions ? [conditions] : ['Hypertension Follow-up'],
      registeredAt: new Date().toISOString()
    };

    if (!isOnline) {
      // Offline mode: Queue locally
      queueOfflineAction('patient_reg', patientData);
    }

    setIsSaved(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });

    setTimeout(() => {
      setIsSaved(false);
      setName('');
      setAge('');
      setConditions('');
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 p-5 sm:p-6 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-xl font-bold p-1 rounded-lg hover:bg-white/10 transition"
          >
            ✕
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold mb-2">
            <UserPlus className="w-3.5 h-3.5 text-emerald-300" />
            <span>Field Outreach Registry</span>
          </div>
          <h2 className="text-2xl font-black">Register Rural Patient</h2>
          <p className="text-emerald-100 text-xs mt-0.5">
            Offline-first patient enrollment with automated ABHA account provisioning.
          </p>
        </div>

        {/* Offline notice */}
        {!isOnline ? (
          <div className="bg-amber-50 border-b border-amber-200 px-5 py-2.5 flex items-center gap-2 text-xs text-amber-900 font-bold">
            <WifiOff className="w-4 h-4 text-amber-700" />
            <span>Offline Mode Active: Patient record will be stored locally and automatically synchronized when connectivity is restored.</span>
          </div>
        ) : (
          <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-2.5 flex items-center gap-2 text-xs text-emerald-900 font-semibold">
            <Wifi className="w-4 h-4 text-emerald-600" />
            <span>Online: Record will immediately sync to District Public Health Server.</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Patient Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sita Waghmare"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Age (Years) *</label>
              <input
                type="number"
                required
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 32"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Gender *</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Village / Ward *</label>
              <select
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
              >
                <option value="Karegaon">Karegaon</option>
                <option value="Pabal">Pabal</option>
                <option value="Manchar">Manchar</option>
                <option value="Otur">Otur</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
              >
                <option value="A+">A+</option>
                <option value="B+">B+</option>
                <option value="O+">O+</option>
                <option value="AB+">AB+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98XXX XXXXX"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Known Medical Conditions</label>
              <input
                type="text"
                value={conditions}
                onChange={(e) => setConditions(e.target.value)}
                placeholder="e.g. Hypertension, Pregnancy 2nd Trimester"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSaved ? 'Enrolled & Saved!' : 'Enroll Patient & Save'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
