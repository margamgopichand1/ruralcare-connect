import React, { useState } from 'react';
import { evaluateSymptomTriage, TriageResult } from '../../services/triageService';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Mic,
  ArrowRight,
  ShieldAlert,
  Info,
  Activity,
  HeartPulse,
  Clock,
  Volume2
} from 'lucide-react';

interface AiTriageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerSos: () => void;
  onProceedToDoctorBooking: (symptoms: string) => void;
  onRequestHomeVisit: () => void;
}

const COMMON_SYMPTOMS = [
  'Fever',
  'Cough',
  'Breathing difficulty',
  'Chest pain',
  'Headache',
  'Vomiting',
  'Dizziness',
  'Loose Motion / Dehydration',
  'High Blood Pressure',
  'Severe Weakness'
];

export const AiTriageModal: React.FC<AiTriageModalProps> = ({
  isOpen,
  onClose,
  onTriggerSos,
  onProceedToDoctorBooking,
  onRequestHomeVisit
}) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['Fever', 'Cough']);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [patientAge, setPatientAge] = useState(48);
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [triageResult, setTriageResult] = useState<TriageResult | null>(() =>
    evaluateSymptomTriage(['Fever', 'Cough'], '', 48)
  );

  if (!isOpen) return null;

  const toggleSymptom = (sym: string) => {
    const updated = selectedSymptoms.includes(sym)
      ? selectedSymptoms.filter((s) => s !== sym)
      : [...selectedSymptoms, sym];
    setSelectedSymptoms(updated);
    setTriageResult(evaluateSymptomTriage(updated, additionalNotes, patientAge));
  };

  const handleSimulateVoice = () => {
    setIsListeningVoice(true);
    setTimeout(() => {
      setSelectedSymptoms(['Chest pain', 'Breathing difficulty', 'Dizziness']);
      setAdditionalNotes('Patient feels sudden heavy tightness in chest radiating to left arm.');
      setIsListeningVoice(false);
      setTriageResult(
        evaluateSymptomTriage(
          ['Chest pain', 'Breathing difficulty', 'Dizziness'],
          'Patient feels sudden heavy tightness in chest radiating to left arm.',
          patientAge
        )
      );
    }, 2000);
  };

  const handleRunEvaluation = () => {
    setTriageResult(evaluateSymptomTriage(selectedSymptoms, additionalNotes, patientAge));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-800 via-emerald-800 to-slate-900 p-5 sm:p-6 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-xl font-bold p-1 rounded-lg hover:bg-white/10 transition"
          >
            ✕
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Clinical Decision Support Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">AI-Assisted Digital Triage</h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1">
            Automated clinical priority categorization to direct rural patients to the right level of public healthcare.
          </p>
        </div>

        {/* Clinical Disclaimer Banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-5 py-2.5 flex items-start gap-2.5 text-xs text-amber-900 shrink-0">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <span>
            <strong>Important Clinical Notice:</strong> AI-assisted recommendation — final clinical decision must be made by a qualified healthcare professional. RuralCare Connect does not make autonomous medical diagnoses.
          </span>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* Quick Voice Simulation Input */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-left">
              <button
                onClick={handleSimulateVoice}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition shadow-md ${
                  isListeningVoice
                    ? 'bg-red-600 text-white animate-ping'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                }`}
                title="Speak Symptoms Simulation"
              >
                <Mic className="w-6 h-6" />
              </button>
              <div>
                <div className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                  <span>🎙️ Voice Symptom Input (Simulation)</span>
                  {isListeningVoice && <span className="text-[10px] text-red-600 animate-pulse font-bold">Listening in Marathi/Hindi/Telugu...</span>}
                </div>
                <div className="text-[11px] text-slate-500">
                  Tap to simulate a rural patient speaking symptoms in their native dialect.
                </div>
              </div>
            </div>

            <button
              onClick={handleSimulateVoice}
              disabled={isListeningVoice}
              className="px-3 py-1.5 bg-white border border-slate-300 hover:border-emerald-600 rounded-xl text-xs font-bold text-slate-700 transition"
            >
              {isListeningVoice ? 'Processing Audio...' : 'Simulate Voice Input'}
            </button>
          </div>

          {/* Interactive Symptoms Checkboxes */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Select Current Symptoms:
            </div>
            <div className="flex flex-wrap gap-2">
              {COMMON_SYMPTOMS.map((sym) => {
                const isChecked = selectedSymptoms.includes(sym);
                const isRedFlag = sym === 'Chest pain' || sym === 'Breathing difficulty';
                return (
                  <button
                    key={sym}
                    onClick={() => toggleSymptom(sym)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border flex items-center gap-1.5 ${
                      isChecked
                        ? isRedFlag
                          ? 'bg-red-600 text-white border-red-600 shadow-sm'
                          : 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                        : isRedFlag
                        ? 'bg-red-50 text-red-800 border-red-200 hover:border-red-400'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span>{isChecked ? '✓' : '+'}</span>
                    <span>{sym}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Additional Details or Patient Concerns:
            </label>
            <input
              type="text"
              value={additionalNotes}
              onChange={(e) => {
                setAdditionalNotes(e.target.value);
                setTriageResult(evaluateSymptomTriage(selectedSymptoms, e.target.value, patientAge));
              }}
              placeholder="e.g. Pain worsening after walking, feeling suffocated..."
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* TRIAGE RESULT DISPLAY */}
          {triageResult && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              {/* Urgency Level Banner */}
              <div className={`p-4 rounded-2xl border-2 flex items-center justify-between gap-3 ${
                triageResult.urgency === 'emergency'
                  ? 'bg-red-50 border-red-500 text-red-950 animate-pulse'
                  : triageResult.urgency === 'urgent'
                  ? 'bg-amber-50 border-amber-500 text-amber-950'
                  : triageResult.urgency === 'priority'
                  ? 'bg-yellow-50 border-yellow-500 text-yellow-950'
                  : 'bg-emerald-50 border-emerald-500 text-emerald-950'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black shrink-0 ${
                    triageResult.urgency === 'emergency' ? 'bg-red-600 text-white' : 'bg-white shadow-sm'
                  }`}>
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                      Triage Category
                    </div>
                    <div className="text-base font-black">
                      {triageResult.urgencyLabel}
                    </div>
                  </div>
                </div>

                <span className={`text-xs font-black uppercase px-2.5 py-1 rounded-lg ${triageResult.badgeColor}`}>
                  {triageResult.urgency}
                </span>
              </div>

              {/* Risk Indicators */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <HeartPulse className="w-3.5 h-3.5 text-teal-700" />
                  <span>Identified Risk Indicators</span>
                </div>
                <ul className="space-y-1 text-xs text-slate-600">
                  {triageResult.riskIndicators.map((risk, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-teal-700 font-bold">•</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Care Pathway */}
              <div className="bg-white rounded-2xl p-4 border border-teal-200 shadow-sm space-y-1">
                <div className="text-xs font-bold text-teal-900 uppercase tracking-wider">
                  Recommended Care Pathway
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                  {triageResult.recommendedCarePathway}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
                {triageResult.isEmergency ? (
                  <button
                    onClick={() => {
                      onClose();
                      onTriggerSos();
                    }}
                    className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-black text-sm rounded-xl shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 animate-pulse"
                  >
                    <AlertTriangle className="w-5 h-5" />
                    <span>🚨 ACTIVATE 108 EMERGENCY SOS NOW</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        onClose();
                        onProceedToDoctorBooking(selectedSymptoms.join(', '));
                      }}
                      className="w-full sm:flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5"
                    >
                      <span>Book Doctor Consultation</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        onRequestHomeVisit();
                      }}
                      className="w-full sm:flex-1 py-3 bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5"
                    >
                      <span>Request Doorstep Home Visit</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
