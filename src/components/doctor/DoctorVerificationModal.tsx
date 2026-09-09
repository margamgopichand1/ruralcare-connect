import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockDoctors } from '../../data/mockData';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  FileCheck,
  Upload,
  AlertCircle,
  Building2,
  Stethoscope
} from 'lucide-react';

interface DoctorVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DoctorVerificationModal: React.FC<DoctorVerificationModalProps> = ({
  isOpen,
  onClose
}) => {
  const { currentDoctor } = useAuth();
  const doctor = currentDoctor || mockDoctors[0];

  const [isVerified, setIsVerified] = useState(doctor.isVerified);
  const [fullName, setFullName] = useState(doctor.name);
  const [qualification, setQualification] = useState(doctor.qualification);
  const [licenseNumber, setLicenseNumber] = useState(doctor.licenseNumber);
  const [specialization, setSpecialization] = useState(doctor.specialization);
  const [experience, setExperience] = useState(doctor.experience.toString());
  const [serviceArea, setServiceArea] = useState(doctor.serviceArea);
  const [uploadedFile, setUploadedFile] = useState<string | null>('MMC_Registration_Certificate_2026.pdf');
  const [successMessage, setSuccessMessage] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerified(true);
    doctor.isVerified = true;
    setSuccessMessage(true);
    setTimeout(() => {
      setSuccessMessage(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-teal-950 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg">Doctor Accreditation & MMC Verification</h3>
              <p className="text-xs text-slate-300">Maharashtra Medical Council (MMC) Registry Check</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold p-1">
            ✕
          </button>
        </div>

        {/* Status Indicator */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-600 uppercase tracking-wider">Verification Status:</span>
          {isVerified ? (
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-extrabold flex items-center gap-1.5 border border-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Verified Doctor ✓</span>
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-extrabold flex items-center gap-1.5 border border-amber-300">
              <Clock className="w-4 h-4 text-amber-600 animate-spin" />
              <span>Verification Pending</span>
            </span>
          )}
        </div>

        {/* Verification Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {successMessage && (
            <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl font-bold text-center">
              Credentials successfully verified with Maharashtra Medical Council!
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Full Legal Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-health-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Medical Qualification</label>
              <input
                type="text"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                placeholder="e.g. MBBS, MD (Medicine)"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-health-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">MMC Registration / License Number</label>
              <input
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                placeholder="e.g. MMC/2016/08/2341"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-health-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Clinical Specialization</label>
              <input
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                placeholder="e.g. General Physician"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-health-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Experience (Years)</label>
              <input
                type="number"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-health-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Assigned Service Taluka / Area</label>
              <input
                type="text"
                value={serviceArea}
                onChange={(e) => setServiceArea(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-health-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Document Upload Simulation */}
          <div className="pt-2">
            <label className="font-bold text-slate-700 block mb-1.5">
              MMC Medical Council Certificate / Govt ID Upload
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-5 text-center bg-slate-50 hover:bg-health-50 hover:border-health-400 transition cursor-pointer">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-1.5" />
              <p className="font-bold text-slate-800">
                {uploadedFile ? uploadedFile : 'Drag and drop MMC Certificate (PDF / JPG)'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Verified against Directorate of Health Services Maharashtra database.
              </p>
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-slate-700 leading-relaxed text-[11px] flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>
              Security notice: Only verified healthcare practitioners with valid MMC registration are authorized to receive doorstep requests and issue digital prescriptions.
            </span>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-health-700 hover:bg-health-800 text-white rounded-xl font-extrabold transition shadow-md flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Verify & Save Credentials</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
