import React, { useState } from 'react';
import { QueueItem } from '../../types';
import { updateQueueStatus } from '../../services/queueService';
import { createReferral } from '../../services/referralService';
import { bookDiagnosticTest } from '../../services/diagnosticService';
import {
  Stethoscope,
  Pill,
  Activity,
  Share2,
  Calendar,
  CheckCircle2,
  FileCheck2,
  Save,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  queueItem: QueueItem | null;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  queueItem
}) => {
  const [activeTab, setActiveTab] = useState<'consult' | 'rx' | 'diag' | 'referral'>('consult');
  const [diagnosis, setDiagnosis] = useState('Acute Upper Respiratory Tract Infection with Moderate Pyrexia');
  const [vitals, setVitals] = useState({
    bp: '128/82 mmHg',
    pulse: '78 bpm',
    temp: '101.4 °F',
    spo2: '98%'
  });
  const [medicines, setMedicines] = useState([
    { name: 'Tab. Paracetamol 650 mg', dosage: '1 Tab', freq: 'TDS (After Food)', days: '5 Days' },
    { name: 'Tab. Cetirizine 10 mg', dosage: '1 Tab', freq: 'Once at Bedtime', days: '3 Days' },
    { name: 'Sachet ORS Electrolyte', dosage: '1 Packet', freq: 'In 1L Boiled Water', days: '2 Days' }
  ]);
  const [diagnosticNeeded, setDiagnosticNeeded] = useState(false);
  const [referralNeeded, setReferralNeeded] = useState(false);
  const [referralSpecialist, setReferralSpecialist] = useState('Cardiologist');
  const [followupDate, setFollowupDate] = useState('2026-09-17');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen || !queueItem) return null;

  const handleCompleteConsultation = () => {
    updateQueueStatus(queueItem.id, 'completed');

    if (diagnosticNeeded) {
      bookDiagnosticTest({
        patientId: queueItem.patientId,
        patientName: queueItem.patientName,
        testId: 'diag-1',
        facilityName: 'PHC Karegaon Lab',
        date: '2026-09-14',
        slot: '10:00 AM'
      });
    }

    if (referralNeeded) {
      createReferral({
        patientId: queueItem.patientId,
        patientName: queueItem.patientName,
        doctorId: 'doc-1',
        doctorName: 'Dr. Priya Sharma',
        specialistType: referralSpecialist,
        hospitalName: 'Shirur Rural Hospital',
        facilityAddress: 'Sub-District Hospital, Station Road, Shirur',
        reason: diagnosis,
        urgency: 'priority'
      });
    }

    setIsSaved(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 p-5 sm:p-6 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-xl font-bold p-1 rounded-lg hover:bg-white/10 transition"
          >
            ✕
          </button>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold mb-2">
                <Stethoscope className="w-3.5 h-3.5 text-emerald-300" />
                <span>PHC Consultation Desk • Token {queueItem.tokenNumber}</span>
              </div>
              <h2 className="text-2xl font-black">{queueItem.patientName}</h2>
              <p className="text-emerald-100 text-xs mt-0.5">
                {queueItem.age} Years • {queueItem.gender} • Chief Complaint: {queueItem.reason}
              </p>
            </div>

            <span className={`text-xs font-black uppercase px-3 py-1 rounded-full ${
              queueItem.priority === 'critical' ? 'bg-red-600 text-white' : 'bg-amber-400 text-slate-900'
            }`}>
              {queueItem.priority} Priority
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 shrink-0">
          <button
            onClick={() => setActiveTab('consult')}
            className={`pb-3 px-4 text-xs font-extrabold border-b-2 transition ${
              activeTab === 'consult' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500'
            }`}
          >
            Clinical Assessment & Vitals
          </button>
          <button
            onClick={() => setActiveTab('rx')}
            className={`pb-3 px-4 text-xs font-extrabold border-b-2 transition ${
              activeTab === 'rx' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500'
            }`}
          >
            Prescription (Rx)
          </button>
          <button
            onClick={() => setActiveTab('diag')}
            className={`pb-3 px-4 text-xs font-extrabold border-b-2 transition ${
              activeTab === 'diag' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500'
            }`}
          >
            Diagnostics
          </button>
          <button
            onClick={() => setActiveTab('referral')}
            className={`pb-3 px-4 text-xs font-extrabold border-b-2 transition ${
              activeTab === 'referral' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500'
            }`}
          >
            Referral & Follow-up
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: Clinical Assessment & Vitals */}
          {activeTab === 'consult' && (
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Clinical Vitals Screening</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Blood Pressure</label>
                  <input
                    type="text"
                    value={vitals.bp}
                    onChange={(e) => setVitals({ ...vitals, bp: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Pulse Rate</label>
                  <input
                    type="text"
                    value={vitals.pulse}
                    onChange={(e) => setVitals({ ...vitals, pulse: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Body Temperature</label>
                  <input
                    type="text"
                    value={vitals.temp}
                    onChange={(e) => setVitals({ ...vitals, temp: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">SpO2 (Oxygen)</label>
                  <input
                    type="text"
                    value={vitals.spo2}
                    onChange={(e) => setVitals({ ...vitals, spo2: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Primary Clinical Diagnosis:</label>
                <textarea
                  rows={3}
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <span>Proceed to Prescription, Diagnostic Lab Order, or Referral:</span>
                <button
                  onClick={() => setActiveTab('rx')}
                  className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                >
                  <span>Prescribe Medicines</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Prescription */}
          {activeTab === 'rx' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Prescription Medicines (Rx)</span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                  Available in PHC Pharmacy ✓
                </span>
              </div>

              <div className="space-y-2">
                {medicines.map((med, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-black text-slate-900">{med.name}</div>
                      <div className="text-slate-500">{med.dosage} • {med.freq} • Duration: {med.days}</div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-1 rounded-lg border border-slate-200">
                      Standard Dosing
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Diagnostics */}
          {activeTab === 'diag' && (
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Order Diagnostic Tests</div>
              <div className="p-4 rounded-2xl border-2 border-emerald-500/40 bg-emerald-50/50 space-y-3">
                <label className="flex items-center gap-2.5 text-xs font-extrabold text-emerald-950 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={diagnosticNeeded}
                    onChange={(e) => setDiagnosticNeeded(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Order Complete Blood Count (CBC) with Platelets at PHC Karegaon Lab</span>
                </label>
                <p className="text-[11px] text-slate-600 pl-6 leading-relaxed">
                  Recommended for ongoing fever to evaluate leukocytosis, platelet count, and rule out acute infection markers.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: Referral & Follow-up */}
          {activeTab === 'referral' && (
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Secondary Referral Protocol</div>
              <div className="p-4 rounded-2xl border-2 border-slate-200 space-y-3">
                <label className="flex items-center gap-2.5 text-xs font-extrabold text-slate-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={referralNeeded}
                    onChange={(e) => setReferralNeeded(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Initiate Secondary Referral to Sub-District / District Hospital</span>
                </label>

                {referralNeeded && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-6 pt-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Specialty Required:</label>
                      <select
                        value={referralSpecialist}
                        onChange={(e) => setReferralSpecialist(e.target.value)}
                        className="w-full p-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
                      >
                        <option value="Cardiologist">Cardiologist (Aundh District Hospital)</option>
                        <option value="Pulmonologist">Pulmonologist (Manchar Rural Hospital)</option>
                        <option value="General Surgeon">General Surgeon (Shirur Hospital)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Follow-up Due Date:</label>
                      <input
                        type="date"
                        value={followupDate}
                        onChange={(e) => setFollowupDate(e.target.value)}
                        className="w-full p-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            onClick={handleCompleteConsultation}
            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSaved ? 'Saved & Synced!' : 'Complete Consultation & Update ABHA Record'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
