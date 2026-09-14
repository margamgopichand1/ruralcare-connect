import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  triggerEmergencySos,
  EmergencyDispatchResult,
  getActiveEmergency,
  completeActiveEmergency,
  updateAmbulanceStatus
} from '../../services/emergencyService';
import { recordNewEmergencyTriggered } from '../../services/analyticsService';
import { LeafletMap, MapMarkerItem } from '../common/LeafletMap';
import {
  EmergencyCategoryKey,
  FIRST_AID_PROTOCOLS,
  EmergencyProtocol,
  ProtocolStep
} from '../../data/firstAidProtocols';
import { voiceAssistant } from '../../services/voiceAssistantService';
import {
  AlertTriangle,
  Ambulance,
  Phone,
  Building2,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Send,
  User,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Info,
  Radio,
  Check,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface EmergencySosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type EmergencyLang = 'en' | 'te' | 'hi';

export const EmergencySosModal: React.FC<EmergencySosModalProps> = ({
  isOpen,
  onClose
}) => {
  const { currentPatient } = useAuth();

  // Active language state in Emergency Mode (defaults to English, easily switched to Telugu or Hindi)
  const [lang, setLang] = useState<EmergencyLang>('en');

  // Stages: 'confirm' -> 'dispatching' -> 'category_select' -> 'interactive_guidance' -> 'completed'
  const [stage, setStage] = useState<'confirm' | 'dispatching' | 'category_select' | 'interactive_guidance' | 'completed'>('confirm');

  // Dispatch details
  const [dispatchData, setDispatchData] = useState<EmergencyDispatchResult | null>(() => getActiveEmergency());

  // Selected Emergency Category & Protocol
  const [selectedCategory, setSelectedCategory] = useState<EmergencyCategoryKey>('cardiac');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  // Triage safety answers
  const [triageAnswers, setTriageAnswers] = useState<Record<number, string>>({});

  // Voice playback & recording state
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [aiAssistantMessage, setAiAssistantMessage] = useState<string | null>(null);

  // Live countdown timer
  const [etaCounter, setEtaCounter] = useState<number>(8);

  const stopListenRef = useRef<(() => void) | null>(null);

  // Check if there is an active emergency already running
  useEffect(() => {
    const existing = getActiveEmergency();
    if (existing) {
      setDispatchData(existing);
      setSelectedCategory(existing.categoryKey);
      setStage('interactive_guidance');
    }
  }, [isOpen]);

  // ETA countdown simulation
  useEffect(() => {
    if (stage === 'interactive_guidance' || stage === 'category_select') {
      const interval = setInterval(() => {
        setEtaCounter((prev) => (prev > 1 ? prev - 1 : 1));
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [stage]);

  if (!isOpen) return null;

  const patient = currentPatient || {
    id: 'pat-1',
    name: 'Ramesh Patil',
    phone: '+91 98221 44512',
    village: 'Karegaon, Shirur',
    lat: 18.8256,
    lng: 74.3721,
    emergencyContact: {
      name: 'Sunita Patil',
      phone: '+91 98221 44513',
      relationship: 'Spouse'
    }
  };

  const protocol: EmergencyProtocol = FIRST_AID_PROTOCOLS[selectedCategory] || FIRST_AID_PROTOCOLS.cardiac;
  const currentStep: ProtocolStep | undefined = protocol.steps[activeStepIndex];

  // 1. Initial SOS Confirmation Handler
  const handleConfirmSos = () => {
    setStage('dispatching');

    // Attempt GPS Geolocation with immediate fallback
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => initiateDispatch(pos.coords.latitude, pos.coords.longitude),
        () => initiateDispatch(patient.lat, patient.lng),
        { timeout: 3000 }
      );
    } else {
      initiateDispatch(patient.lat, patient.lng);
    }
  };

  const initiateDispatch = (lat: number, lng: number) => {
    setTimeout(() => {
      const result = triggerEmergencySos(
        patient.id,
        patient.name,
        patient.phone,
        patient.village,
        lat,
        lng,
        patient.emergencyContact.name,
        patient.emergencyContact.phone,
        selectedCategory
      );

      setDispatchData(result);
      setEtaCounter(result.request.etaMinutes || 8);
      recordNewEmergencyTriggered();
      setStage('category_select');

      // Play introductory voice notification
      playVoiceIntro(result.request.ambulanceNumber);
    }, 1500);
  };

  const playVoiceIntro = (ambNum: string) => {
    const textByLang: Record<EmergencyLang, string> = {
      en: `Emergency SOS activated. Ambulance ${ambNum} is on the way. Please select the emergency condition.`,
      te: `అత్యవసర SOS ప్రారంభించబడింది. 108 అంబులెన్స్ వస్తోంది. దయచేసి సమస్యను ఎంచుకోండి.`,
      hi: `आपातकालीन सहायता शुरू हो गई है। एम्बुलेंस रास्ते में है। कृपया आपातकाल का प्रकार चुनें।`
    };
    voiceAssistant.speak(
      textByLang[lang],
      lang,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  // 2. Category Selection Handler
  const handleSelectCategory = (catKey: EmergencyCategoryKey) => {
    setSelectedCategory(catKey);
    setActiveStepIndex(0);
    setTriageAnswers({});

    // Read current dispatch and update category if needed
    if (dispatchData) {
      dispatchData.categoryKey = catKey;
    }

    setStage('interactive_guidance');

    // Announce the selected protocol
    const selProto = FIRST_AID_PROTOCOLS[catKey];
    if (selProto && selProto.steps[0]) {
      const announceText = selProto.steps[0].voiceText[lang];
      voiceAssistant.speak(
        announceText,
        lang,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
    }
  };

  // 3. Voice Read Instruction button
  const handleReadCurrentStep = () => {
    if (isSpeaking) {
      voiceAssistant.stop();
      setIsSpeaking(false);
      return;
    }

    if (currentStep) {
      voiceAssistant.speak(
        currentStep.voiceText[lang],
        lang,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
    }
  };

  // 4. Voice Input (Speak) button
  const handleVoiceInput = () => {
    if (isListening) {
      if (stopListenRef.current) stopListenRef.current();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    stopListenRef.current = voiceAssistant.listen(
      lang,
      (transcript) => {
        setIsListening(false);
        setAiAssistantMessage(`Heard: "${transcript}". AI Assistant: Verified protocol is active. Keep patient resting while ambulance arrives.`);
      },
      () => setIsListening(false)
    );
  };

  // 5. Complete Emergency Incident Handler (Requirement 14 & 15)
  const handleCompleteEmergency = () => {
    completeActiveEmergency({
      diagnosisSummary: `Acute Stabilization: ${protocol.name.en}`,
      attendingDoctor: 'Dr. Priya Sharma (Emergency Physician)',
      treatmentGiven: '108 Paramedic first aid, on-scene stabilization, and transfer to emergency trauma bay.',
      followUpSchedule: 'Tomorrow 10:00 AM at PHC Karegaon'
    });

    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    setStage('completed');
  };

  // Map markers for active emergency modal
  const mapMarkers: MapMarkerItem[] = dispatchData
    ? [
        {
          id: 'patient-sos',
          lat: patient.lat,
          lng: patient.lng,
          title: 'Patient Location (Doorstep)',
          subtitle: patient.village,
          type: 'emergency',
          badge: 'SOS ACTIVE'
        },
        {
          id: 'ambulance-unit',
          lat: dispatchData.ambulance.lat,
          lng: dispatchData.ambulance.lng,
          title: dispatchData.ambulance.vehicleNumber,
          subtitle: `Driver: ${dispatchData.ambulance.driverName}`,
          type: 'ambulance',
          badge: 'EN ROUTE'
        },
        {
          id: 'dest-hospital',
          lat: dispatchData.hospital.lat,
          lng: dispatchData.hospital.lng,
          title: dispatchData.hospital.name,
          subtitle: dispatchData.hospital.type,
          type: 'hospital',
          badge: 'RECOMMENDED FACILITY'
        }
      ]
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border-2 border-red-600 max-w-2xl w-full overflow-hidden flex flex-col max-h-[96vh]">
        {/* ================================================================= */}
        {/* 1. TOP EMERGENCY HEADER WITH LANGUAGE TOGGLE & VOICE BUTTONS */}
        {/* ================================================================= */}
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-rose-900 p-4 sm:p-5 text-white flex flex-col gap-3 shadow-md shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center animate-pulse-fast shrink-0">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-200">
                    Maharashtra 108 EMS Emergency Mode
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <h2 className="text-lg sm:text-xl font-black leading-tight">
                  {stage === 'confirm' && "Emergency Assistance Required?"}
                  {stage === 'dispatching' && "Connecting to 108 Grid..."}
                  {stage === 'category_select' && "Select Emergency Type"}
                  {stage === 'interactive_guidance' && "🚨 AI-Assisted First-Aid Protocol"}
                  {stage === 'completed' && "Emergency Care Handover Complete"}
                </h2>
              </div>
            </div>

            {/* Language Selector in Emergency Mode (Requirement 6) */}
            <div className="flex items-center gap-1 bg-red-950/70 p-1 rounded-xl border border-red-400/40">
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded-lg text-xs font-black transition ${
                  lang === 'en' ? 'bg-white text-red-700 shadow-sm' : 'text-red-200 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('te')}
                className={`px-2 py-1 rounded-lg text-xs font-black transition ${
                  lang === 'te' ? 'bg-white text-red-700 shadow-sm' : 'text-red-200 hover:text-white'
                }`}
              >
                తెలుగు
              </button>
              <button
                onClick={() => setLang('hi')}
                className={`px-2 py-1 rounded-lg text-xs font-black transition ${
                  lang === 'hi' ? 'bg-white text-red-700 shadow-sm' : 'text-red-200 hover:text-white'
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>

          {/* Quick Voice Controls Banner (Requirement 5) */}
          {(stage === 'category_select' || stage === 'interactive_guidance') && (
            <div className="flex items-center justify-between bg-black/25 px-3 py-2 rounded-xl text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReadCurrentStep}
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
                    isSpeaking
                      ? 'bg-amber-400 text-slate-950 animate-pulse'
                      : 'bg-white/20 hover:bg-white/30 text-white'
                  }`}
                  title="Read instruction aloud"
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{isSpeaking ? 'Stop Audio' : '🔊 Read Instruction'}</span>
                </button>

                <button
                  onClick={handleVoiceInput}
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
                    isListening
                      ? 'bg-emerald-400 text-slate-950 animate-ping'
                      : 'bg-white/20 hover:bg-white/30 text-white'
                  }`}
                  title="Speak into microphone"
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  <span>{isListening ? 'Listening...' : '🎤 Speak'}</span>
                </button>
              </div>

              <span className="text-[11px] text-red-200 font-semibold hidden sm:inline">
                Doorstep: {patient.village}
              </span>
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* 2. MODAL BODY: MULTI-STAGE EMERGENCY WORKFLOW */}
        {/* ================================================================= */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* =============================================================== */}
          {/* STAGE A: CONFIRMATION SCREEN (Requirement 1) */}
          {/* =============================================================== */}
          {stage === 'confirm' && (
            <div className="space-y-6 text-center py-4">
              <div className="w-20 h-20 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-inner animate-pulse">
                <AlertTriangle className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900">
                  {lang === 'te'
                    ? "అత్యవసర సహాయం ప్రారంభించబడుతోంది"
                    : lang === 'hi'
                    ? "आपातकालीन सहायता शुरू की जा रही है"
                    : "Emergency assistance is being activated."}
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  {lang === 'te'
                    ? "ధృవీకరించిన వెంటనే మీ GPS స్థానం 108 అంబులెన్స్ కమాండ్ సెంటర్‌కు మరియు సమీప ఆసుపత్రికి పంపబడుతుంది."
                    : lang === 'hi'
                    ? "पुष्टि करते ही आपका जीपीएस स्थान 108 एम्बुलेंस और निकटतम अस्पताल ट्रॉमा सेंटर को भेजा जाएगा।"
                    : "Pressing Confirm SOS immediately locks your GPS coordinates, dispatches the nearest 108 ambulance, and starts protocol-based first-aid guidance."}
                </p>
              </div>

              {/* Location & Status Card */}
              <div className="p-4 bg-red-50/80 rounded-2xl border border-red-200 text-left text-xs space-y-2 text-slate-800">
                <div className="font-black text-red-900 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-red-600" />
                    <span>Captured Patient Location:</span>
                  </div>
                  <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    GPS LOCKED ✓
                  </span>
                </div>
                <div className="text-slate-700 font-semibold">{patient.village} (Lat: {patient.lat}, Lng: {patient.lng})</div>
                <div className="border-t border-red-200 pt-2 text-[11px] text-slate-600 space-y-1">
                  <div>• Nearest 108 Ambulance Unit allocated immediately</div>
                  <div>• Hospital Emergency Department pre-alerted</div>
                  <div>• Emergency Family Contact notified via SMS: {patient.emergencyContact.name} ({patient.emergencyContact.phone})</div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-3.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-sm transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSos}
                  className="flex-1 py-4 px-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl text-sm transition shadow-xl shadow-red-600/40 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>
                    {lang === 'te' ? "108 SOS నిర్ధారించండి" : lang === 'hi' ? "108 SOS की पुष्टि करें" : "Confirm Emergency SOS"}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* STAGE B: DISPATCHING SIMULATION SCREEN */}
          {/* =============================================================== */}
          {stage === 'dispatching' && (
            <div className="py-12 text-center space-y-6">
              <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                <span className="absolute w-24 h-24 rounded-full bg-red-400 opacity-30 animate-ping" />
                <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl">
                  <Ambulance className="w-8 h-8 animate-bounce" />
                </div>
              </div>

              <div>
                <h4 className="text-xl font-black text-slate-900">
                  {lang === 'te'
                    ? "108 కమాండ్ గ్రిడ్‌కు కనెక్ట్ అవుతోంది..."
                    : lang === 'hi'
                    ? "108 कमांड ग्रिड से संपर्क किया जा रहा है..."
                    : "Connecting with 108 Emergency Command Grid..."}
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Broadcasting coordinates, assigning nearest Advanced Life Support unit, and alerting trauma bay.
                </p>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* STAGE C: EMERGENCY TYPE SELECTION (Requirement 2) */}
          {/* =============================================================== */}
          {stage === 'category_select' && dispatchData && (
            <div className="space-y-4 animate-fadeIn">
              {/* Telemetry Strip */}
              <div className="bg-red-50 p-3.5 rounded-2xl border border-red-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-black">
                    <Ambulance className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-red-700 block">Ambulance 108 Assigned</span>
                    <strong className="text-slate-900">{dispatchData.ambulance.vehicleNumber}</strong>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">ETA</span>
                  <strong className="text-red-700 text-sm font-black">{etaCounter} min</strong>
                </div>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {lang === 'te'
                    ? "రోగి పరిస్థితిని ఎంచుకోండి:"
                    : lang === 'hi'
                    ? "आपातकालीन स्थिति का प्रकार चुनें:"
                    : "What type of emergency is this?"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select a category to immediately open medically verified step-by-step first-aid guidance while the ambulance travels.
                </p>
              </div>

              {/* 10 Emergency Categories Grid (Requirement 2) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(Object.keys(FIRST_AID_PROTOCOLS) as EmergencyCategoryKey[]).map((key) => {
                  const item = FIRST_AID_PROTOCOLS[key];
                  const isCardiac = key === 'cardiac';

                  return (
                    <button
                      key={key}
                      onClick={() => handleSelectCategory(key)}
                      className={`p-3.5 rounded-2xl border-2 text-left transition flex items-start gap-3 group ${
                        isCardiac
                          ? 'border-red-500 bg-red-50/60 hover:bg-red-100/80 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-red-400 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-2xl shrink-0 group-hover:scale-125 transition-transform">
                        {item.icon}
                      </span>
                      <div className="space-y-0.5 min-w-0">
                        <div className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-red-700 transition truncate">
                          {item.name[lang]}
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">
                          {item.shortDesc[lang]}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Safety Protocol Notice:</strong> Verified medical guidance is rendered from clinical protocols. AI serves as decision support and does not replace professional emergency care.
                </span>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* STAGE D: INTERACTIVE FIRST-AID GUIDANCE (Requirement 3 & 4) */}
          {/* =============================================================== */}
          {stage === 'interactive_guidance' && dispatchData && currentStep && (
            <div className="space-y-4 animate-fadeIn">
              {/* 1. DISPATCH STATUS & CALL BUTTONS STRIP (Requirement 7) */}
              <div className="bg-gradient-to-r from-red-50 via-rose-50 to-amber-50 border-2 border-red-300 rounded-2xl p-3.5 sm:p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-red-200/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-sm shrink-0">
                      <Ambulance className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-red-700 uppercase tracking-wider block">
                        🚑 108 Ambulance En Route
                      </span>
                      <strong className="text-sm font-black text-slate-900">
                        {dispatchData.ambulance.vehicleNumber} • Driver: {dispatchData.ambulance.driverName}
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 bg-red-600 text-white rounded-xl text-center shadow-sm">
                      <span className="text-[9px] uppercase font-bold block text-red-200">ETA</span>
                      <strong className="text-sm font-black font-mono">{etaCounter} Min</strong>
                    </div>
                  </div>
                </div>

                {/* Smart Hospital Recommendation with Explainability (Requirement 9) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      Recommended Destination Facility
                    </span>
                    <strong className="text-slate-900 font-bold flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{dispatchData.hospital.name}</span>
                    </strong>
                    <p className="text-[11px] text-emerald-800 font-medium mt-0.5">
                      ✓ {dispatchData.hospitalReason}
                    </p>
                  </div>

                  {/* 1-Tap Emergency Calling Buttons */}
                  <div className="flex items-center gap-2 shrink-0 pt-1 sm:pt-0">
                    <a
                      href={`tel:${dispatchData.ambulance.driverPhone}`}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-sm transition"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Driver</span>
                    </a>
                    <a
                      href={`tel:${dispatchData.hospital.contactPhone}`}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1 transition"
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Trauma Bay</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* 2. TRIAGE SAFETY QUESTION (If not answered yet) (Requirement 4) */}
              {protocol.triageQuestions.length > 0 && !triageAnswers[0] && (
                <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 space-y-3 animate-fadeIn">
                  <div className="flex items-center gap-2 text-amber-900 font-black text-sm">
                    <HelpCircle className="w-4 h-4 text-amber-700" />
                    <span>{protocol.triageQuestions[0].question[lang]}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {protocol.triageQuestions[0].options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => setTriageAnswers({ ...triageAnswers, 0: opt.label.en })}
                        className="p-2.5 bg-white hover:bg-amber-100 border border-amber-300 text-slate-900 font-bold text-xs rounded-xl transition text-center shadow-sm"
                      >
                        {opt.label[lang]}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. STEP-BY-STEP GUIDANCE CARD (ONE INSTRUCTION AT A TIME!) (Requirement 4) */}
              <div className="bg-white border-2 border-slate-300 rounded-3xl p-5 sm:p-6 shadow-md space-y-4 relative">
                {/* Step indicator */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-red-600 text-white rounded-full font-black text-xs">
                      Step {currentStep.stepNumber} of {protocol.steps.length}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {protocol.name[lang]}
                    </span>
                  </div>

                  {/* Step progress dots */}
                  <div className="flex items-center gap-1.5">
                    {protocol.steps.map((_, idx) => (
                      <span
                        key={idx}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          idx === activeStepIndex
                            ? 'w-6 bg-red-600'
                            : idx < activeStepIndex
                            ? 'bg-emerald-500'
                            : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Step Content */}
                <div className="space-y-2">
                  <h4 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                    {currentStep.title[lang]}
                  </h4>

                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                    {currentStep.instruction[lang]}
                  </p>
                </div>

                {/* Critical Warning / Do NOT */}
                {currentStep.criticalWarning && (
                  <div className="p-3 bg-red-50 rounded-2xl border border-red-200 text-xs text-red-900 flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-red-950 uppercase font-black tracking-wide text-[10px]">
                        Do Not Do This:
                      </strong>
                      <span>{currentStep.criticalWarning[lang]}</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons for this step */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  {activeStepIndex > 0 && (
                    <button
                      onClick={() => setActiveStepIndex((prev) => prev - 1)}
                      className="w-full sm:w-auto px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Previous</span>
                    </button>
                  )}

                  {activeStepIndex < protocol.steps.length - 1 ? (
                    <button
                      onClick={() => {
                        setActiveStepIndex((prev) => prev + 1);
                        if (protocol.steps[activeStepIndex + 1]) {
                          voiceAssistant.speak(
                            protocol.steps[activeStepIndex + 1].voiceText[lang],
                            lang,
                            () => setIsSpeaking(true),
                            () => setIsSpeaking(false)
                          );
                        }
                      }}
                      className="flex-1 w-full py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-2xl text-sm transition shadow-lg flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>{currentStep.actionPrompt[lang]} → Next Step</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleCompleteEmergency}
                      className="flex-1 w-full py-4 px-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl text-sm transition shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 animate-pulse"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Ambulance Arrived • Handover to Paramedics</span>
                    </button>
                  )}
                </div>
              </div>

              {/* AI Assistant Spoken Output / Feedback Bar */}
              {aiAssistantMessage && (
                <div className="p-3 bg-slate-900 text-slate-200 rounded-2xl text-xs flex items-start gap-2 shadow-inner">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{aiAssistantMessage}</p>
                </div>
              )}

              {/* Live Route Mini-Map */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-red-600 animate-pulse" />
                    <span>Live GPS Telemetry Navigation</span>
                  </span>
                  <span className="text-[11px] text-slate-500">Destination: {dispatchData.hospital.name}</span>
                </div>
                <div className="h-40 rounded-xl overflow-hidden border border-slate-200">
                  <LeafletMap
                    center={[patient.lat, patient.lng]}
                    zoom={12}
                    height="160px"
                    interactive={false}
                    markers={mapMarkers}
                  />
                </div>
              </div>

              {/* Switch Category Button */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => setStage('category_select')}
                  className="text-xs text-slate-500 hover:text-red-700 font-bold flex items-center gap-1 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Switch Emergency Category</span>
                </button>
                <span className="text-[11px] text-slate-400">
                  Protocol: {protocol.id.toUpperCase()} • Vetted 2026
                </span>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* STAGE E: EMERGENCY COMPLETED & RECORDED SCREEN */}
          {/* =============================================================== */}
          {stage === 'completed' && (
            <div className="py-8 text-center space-y-5 animate-fadeIn">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Handover Completed
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">
                  Emergency Care Transitioned
                </h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Patient successfully transferred to 108 ALS paramedics and trauma bay at {dispatchData?.hospital.name || 'Shirur Rural Hospital'}.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2 text-slate-700 max-w-md mx-auto">
                <div className="font-bold text-slate-900">Recorded in Patient Longitudinal Health Locker:</div>
                <div>• Episode: {protocol.name.en}</div>
                <div>• Facility: {dispatchData?.hospital.name} (Emergency Department)</div>
                <div>• Follow-up Scheduled: Tomorrow 10:00 AM at Primary Health Centre</div>
                <div>• ASHA Worker Lakshmi Devi notified for post-discharge home monitoring</div>
              </div>

              <button
                onClick={onClose}
                className="py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition"
              >
                Close Emergency Mode & Return to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
