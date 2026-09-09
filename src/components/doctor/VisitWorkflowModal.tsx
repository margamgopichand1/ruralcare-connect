import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { VisitRequest, PrescriptionMedicine, Vitals, Prescription } from '../../types';
import { createDigitalPrescription } from '../../services/prescriptionService';
import { addMedicalRecord } from '../../services/medicalRecordService';
import { createReferral } from '../../services/referralService';
import { deductMedicineStock } from '../../services/medicineService';
import { recordNewVisitCompleted } from '../../services/analyticsService';
import {
  Navigation,
  CheckCircle,
  Stethoscope,
  FileCheck,
  HeartPulse,
  Thermometer,
  Activity,
  Plus,
  Trash2,
  Calendar,
  Share2,
  ArrowRight,
  AlertTriangle,
  User,
  Clock,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface VisitWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  visitRequest: VisitRequest;
  onPrescriptionCreated: (prescription: Prescription) => void;
}

export const VisitWorkflowModal: React.FC<VisitWorkflowModalProps> = ({
  isOpen,
  onClose,
  visitRequest,
  onPrescriptionCreated
}) => {
  const { currentDoctor } = useAuth();
  const [stage, setStage] = useState<1 | 2 | 3 | 4>(1);

  // Vitals State
  const [temperature, setTemperature] = useState('101.4 °F');
  const [bloodPressure, setBloodPressure] = useState('124/82 mmHg');
  const [heartRate, setHeartRate] = useState('84 bpm');
  const [spO2, setSpO2] = useState('98%');

  // Consultation notes & Diagnosis
  const [diagnosis, setDiagnosis] = useState('Acute Viral Pyrexia (Viral Fever)');
  const [clinicalNotes, setClinicalNotes] = useState(
    'Patient presented with high-grade fever, chills, and retro-orbital headache. Chest clear, abdomen soft. Prescribed antipyretic, adequate oral rehydration, and rest. Review if fever spikes >102°F.'
  );
  const [followUpDate, setFollowUpDate] = useState('2026-09-12 (In 3 Days)');

  // Medicines builder
  const [medicines, setMedicines] = useState<PrescriptionMedicine[]>([
    {
      name: 'Paracetamol 500mg',
      dosage: '500 mg',
      frequency: '1-0-1 (After Food)',
      duration: '3 Days',
      instructions: 'Take with lukewarm water during fever'
    },
    {
      name: 'ORS (Oral Rehydration Salts)',
      dosage: '1 Sachet',
      frequency: 'As needed (1 Litre water)',
      duration: '3 Days',
      instructions: 'Sip throughout the day for electrolyte balance'
    }
  ]);

  // Referral Sub-modal state
  const [showReferralForm, setShowReferralForm] = useState(false);
  const [referralSpecialist, setReferralSpecialist] = useState('Internal Medicine / Infectious Diseases');
  const [referralHospital, setReferralHospital] = useState('Aundh District Hospital, Pune');
  const [referralReason, setReferralReason] = useState('If fever persists >48 hours, workup for Dengue NS1 / Malaria');
  const [referralUrgency, setReferralUrgency] = useState<'routine' | 'priority' | 'immediate'>('priority');
  const [referralSaved, setReferralSaved] = useState(false);

  if (!isOpen) return null;

  const handleAddMedicine = () => {
    setMedicines((prev) => [
      ...prev,
      {
        name: 'Cetirizine 10mg',
        dosage: '10 mg',
        frequency: '0-0-1 (Bedtime)',
        duration: '3 Days',
        instructions: 'Take after dinner for allergic symptom relief'
      }
    ]);
  };

  const handleRemoveMedicine = (idx: number) => {
    setMedicines((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleCompleteVisit = () => {
    const vitalsObj: Vitals = {
      temperature,
      bloodPressure,
      heartRate,
      spO2
    };

    // 1. Create digital prescription
    const prescription = createDigitalPrescription({
      visitId: visitRequest.id,
      patientId: visitRequest.patientId,
      patientName: visitRequest.patientName,
      patientAge: visitRequest.patientAge,
      patientGender: visitRequest.patientGender,
      doctorId: currentDoctor?.id || 'doc-1',
      doctorName: currentDoctor?.name || 'Dr. Priya Sharma',
      doctorQualification: currentDoctor?.qualification || 'MBBS, MD',
      doctorLicense: currentDoctor?.licenseNumber || 'MMC/2016/08/2341',
      facilityName: 'RuralCare Mobile Doorstep Clinic (Shirur PHC Circle)',
      vitals: vitalsObj,
      diagnosis,
      medicines,
      instructions: clinicalNotes,
      followUpDate
    });

    // 2. Add to unified ABHA health record
    addMedicalRecord({
      patientId: visitRequest.patientId,
      type: 'consultation',
      title: `Doorstep Visit - ${diagnosis}`,
      providerName: currentDoctor?.name || 'Dr. Priya Sharma',
      facilityName: 'RuralCare Doorstep Clinic',
      diagnosis,
      vitals: vitalsObj,
      details: `${clinicalNotes} Prescribed: ${medicines.map((m) => m.name).join(', ')}.`,
      prescriptionId: prescription.id
    });

    // 3. Save referral if created
    if (showReferralForm && referralReason) {
      createReferral({
        patientId: visitRequest.patientId,
        patientName: visitRequest.patientName,
        doctorId: currentDoctor?.id || 'doc-1',
        doctorName: currentDoctor?.name || 'Dr. Priya Sharma',
        specialistType: referralSpecialist,
        hospitalName: referralHospital,
        facilityAddress: 'Pune District Network',
        reason: referralReason,
        urgency: referralUrgency
      });
    }

    // 4. Deduct mock stock for PHC Karegaon
    deductMedicineStock('Paracetamol 500mg', 'fac-1', 6);
    deductMedicineStock('ORS', 'fac-1', 3);

    // 5. Update Government District Analytics
    recordNewVisitCompleted();

    // Trigger celebration
    try {
      confetti({ particleCount: 70, spread: 60 });
    } catch (e) {}

    onPrescriptionCreated(prescription);
    setStage(4);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden flex flex-col max-h-[94vh]">
        {/* Stages Header */}
        <div className="bg-slate-900 text-white p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Doorstep Visit Workflow
              </span>
              <h2 className="text-xl font-black">
                {stage === 1 && "Stage 1: Navigate to Patient's Doorstep"}
                {stage === 2 && "Stage 2: Arrived at Village Residence"}
                {stage === 3 && "Stage 3: Clinical Bedside Consultation"}
                {stage === 4 && "Stage 4: Visit Completed & Prescription Synced"}
              </h2>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white font-bold p-1">
              ✕
            </button>
          </div>

          {/* Stepper Progress */}
          <div className="grid grid-cols-4 gap-2 text-[11px] font-bold">
            {[
              { num: 1, title: 'Navigate' },
              { num: 2, title: 'Arrived' },
              { num: 3, title: 'Consultation' },
              { num: 4, title: 'Complete' }
            ].map((st) => (
              <div
                key={st.num}
                className={`py-1 px-2 rounded-lg text-center transition ${
                  stage === st.num
                    ? 'bg-emerald-600 text-white'
                    : stage > st.num
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {st.num}. {st.title} {stage > st.num ? '✓' : ''}
              </div>
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
          {/* STAGE 1: NAVIGATE */}
          {stage === 1 && (
            <div className="space-y-5 text-center py-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md">
                <Navigation className="w-8 h-8 animate-bounce" />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900">
                  Navigating to {visitRequest.patientName}
                </h3>
                <p className="text-slate-500 mt-1 max-w-md mx-auto">
                  {visitRequest.address} • Estimated distance: {visitRequest.distanceKm} km ({visitRequest.etaMinutes} mins)
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-md mx-auto text-left space-y-2">
                <div className="font-bold text-slate-800">Dispatch Telemetry Summary:</div>
                <div className="text-slate-600">Patient: <strong>{visitRequest.patientName}</strong> ({visitRequest.patientAge} Yrs, {visitRequest.patientGender})</div>
                <div className="text-slate-600">Urgency: <strong className="uppercase text-amber-700">{visitRequest.urgency}</strong></div>
                <div className="text-slate-600">Reported Symptoms: <em>"{visitRequest.symptoms}"</em></div>
              </div>

              <button
                onClick={() => setStage(2)}
                className="px-8 py-3 bg-health-700 hover:bg-health-800 text-white font-extrabold rounded-xl text-sm shadow-md transition"
              >
                Mark as "Arrived at Doorstep" →
              </button>
            </div>
          )}

          {/* STAGE 2: ARRIVED */}
          {stage === 2 && (
            <div className="space-y-5 text-center py-6">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900">
                  Arrived at Patient's Home
                </h3>
                <p className="text-slate-500 mt-1">
                  Karegaon, Shirur Taluka • GPS coordinates verified
                </p>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl max-w-md mx-auto text-slate-700 text-left space-y-1">
                <div className="font-extrabold text-emerald-900">Clinical Protocol Checklist:</div>
                <div>• Sanitize hands and inspect medical kit</div>
                <div>• Verify patient identity with ABHA card</div>
                <div>• Measure vitals (Thermometer, Sphygmomanometer, Pulse Oximeter)</div>
              </div>

              <button
                onClick={() => setStage(3)}
                className="px-8 py-3 bg-health-700 hover:bg-health-800 text-white font-extrabold rounded-xl text-sm shadow-md transition"
              >
                Start Clinical Examination & Consultation →
              </button>
            </div>
          )}

          {/* STAGE 3: CONSULTATION & CLINICAL ENTRY */}
          {stage === 3 && (
            <div className="space-y-6">
              {/* Patient Profile Card Header */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <div className="text-base font-black text-slate-900">
                    {visitRequest.patientName}
                  </div>
                  <div className="text-slate-600 mt-0.5">
                    {visitRequest.patientAge} Yrs • {visitRequest.patientGender} • ABHA: 14-8892-3021-9981
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 text-[11px]">
                  <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-bold">
                    Allergies: Penicillin, Sulfa
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold">
                    Hypertension (Mild)
                  </span>
                </div>
              </div>

              {/* Patient Vitals Entry */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 font-extrabold text-slate-800 uppercase tracking-wider text-[11px]">
                  <HeartPulse className="w-4 h-4 text-red-600" />
                  <span>Bedside Vitals Recording</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Temperature (°F)</label>
                    <input
                      type="text"
                      value={temperature}
                      onChange={(e) => setTemperature(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Blood Pressure</label>
                    <input
                      type="text"
                      value={bloodPressure}
                      onChange={(e) => setBloodPressure(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Heart Rate (bpm)</label>
                    <input
                      type="text"
                      value={heartRate}
                      onChange={(e) => setHeartRate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">SpO2 (%)</label>
                    <input
                      type="text"
                      value={spO2}
                      onChange={(e) => setSpO2(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Clinical Diagnosis & Notes */}
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Primary Clinical Diagnosis
                  </label>
                  <input
                    type="text"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-extrabold text-sm text-slate-900 focus:ring-2 focus:ring-health-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Doctor Clinical Examination & Treatment Notes
                  </label>
                  <textarea
                    rows={3}
                    value={clinicalNotes}
                    onChange={(e) => setClinicalNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-700 focus:ring-2 focus:ring-health-500"
                  />
                </div>
              </div>

              {/* Digital Prescription Builder */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="text-base font-serif font-black text-health-800">℞</span>
                    <span>Prescription Drugs Formulation</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleAddMedicine}
                    className="px-2.5 py-1 bg-health-50 hover:bg-health-100 text-health-800 rounded-lg font-bold text-[11px] flex items-center gap-1 border border-health-200"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Medicine</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {medicines.map((med, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                    >
                      <div className="sm:col-span-4">
                        <input
                          type="text"
                          value={med.name}
                          onChange={(e) => {
                            const copy = [...medicines];
                            copy[idx].name = e.target.value;
                            setMedicines(copy);
                          }}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded-lg font-bold text-slate-900 text-xs"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          value={med.dosage}
                          onChange={(e) => {
                            const copy = [...medicines];
                            copy[idx].dosage = e.target.value;
                            setMedicines(copy);
                          }}
                          placeholder="Dosage"
                          className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <input
                          type="text"
                          value={med.frequency}
                          onChange={(e) => {
                            const copy = [...medicines];
                            copy[idx].frequency = e.target.value;
                            setMedicines(copy);
                          }}
                          placeholder="Frequency"
                          className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs font-bold text-emerald-800"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          value={med.duration}
                          onChange={(e) => {
                            const copy = [...medicines];
                            copy[idx].duration = e.target.value;
                            setMedicines(copy);
                          }}
                          placeholder="Duration"
                          className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs"
                        />
                      </div>
                      <div className="sm:col-span-1 flex justify-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveMedicine(idx)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Optional Referral Section */}
              <div className="pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-purple-600" />
                    <span>Hospital / Specialist Referral Escalation</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowReferralForm(!showReferralForm)}
                    className="text-xs font-bold text-purple-700 hover:underline"
                  >
                    {showReferralForm ? '— Close Referral Form' : '+ Refer Patient to Specialist'}
                  </button>
                </div>

                {showReferralForm && (
                  <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-purple-900 block mb-1">Specialist Domain</label>
                        <input
                          type="text"
                          value={referralSpecialist}
                          onChange={(e) => setReferralSpecialist(e.target.value)}
                          className="w-full px-3 py-1.5 border border-purple-300 rounded-xl text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-purple-900 block mb-1">Referral Hospital</label>
                        <select
                          value={referralHospital}
                          onChange={(e) => setReferralHospital(e.target.value)}
                          className="w-full px-3 py-1.5 border border-purple-300 rounded-xl text-xs font-bold"
                        >
                          <option value="Aundh District Hospital, Pune">Aundh District Hospital, Pune</option>
                          <option value="Sassoon General Hospital & Medical College">Sassoon General Hospital & Medical College</option>
                          <option value="Sub-District Hospital Manchar">Sub-District Hospital Manchar</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-purple-900 block mb-1">Clinical Indication / Reason</label>
                      <input
                        type="text"
                        value={referralReason}
                        onChange={(e) => setReferralReason(e.target.value)}
                        className="w-full px-3 py-1.5 border border-purple-300 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STAGE 4: COMPLETED */}
          {stage === 4 && (
            <div className="space-y-6 text-center py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30 animate-bounce">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900">
                  Doorstep Visit Successfully Completed!
                </h3>
                <p className="text-slate-600 text-xs mt-1 max-w-md mx-auto leading-relaxed">
                  Digital Prescription generated and saved to {visitRequest.patientName}'s unified ABHA Health Record. Karegaon PHC inventory updated.
                </p>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-900">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>ABDM Health Information Provider (HIP) Synchronized</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Prescription is now accessible to the patient on their dashboard and will appear in future clinical consultations.
                </p>
              </div>

              <button
                onClick={onClose}
                className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs shadow-md transition"
              >
                Return to Doctor Console
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer Navigation */}
        {stage === 3 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={() => setStage(2)}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl font-bold transition text-xs"
            >
              Back
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCompleteVisit}
                className="px-7 py-2.5 bg-gradient-to-r from-health-700 to-emerald-800 hover:from-health-800 hover:to-emerald-900 text-white rounded-xl font-black text-xs shadow-md transition flex items-center gap-2"
              >
                <FileCheck className="w-4 h-4" />
                <span>Save Visit & Generate Prescription</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
