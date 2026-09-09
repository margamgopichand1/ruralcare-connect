import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { VisitCategory, VisitUrgency, Language } from '../../types';
import { LeafletMap } from '../common/LeafletMap';
import { VoiceInputModal } from './VoiceInputModal';
import {
  Thermometer,
  CloudRain,
  Activity,
  Smile,
  Baby,
  Users,
  HeartHandshake,
  HelpCircle,
  Clock,
  MapPin,
  Mic,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Compass
} from 'lucide-react';

interface BookDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartMatching: (requestData: {
    category: VisitCategory;
    symptoms: string;
    urgency: VisitUrgency;
    lat: number;
    lng: number;
    address: string;
    preferredLanguage: Language;
  }) => void;
  initialCategory?: string;
}

const categoriesList: { id: VisitCategory; label: string; icon: any; color: string }[] = [
  { id: 'fever', label: 'Fever', icon: Thermometer, color: 'text-amber-600 bg-amber-50' },
  { id: 'cold_cough', label: 'Cold & Cough', icon: CloudRain, color: 'text-blue-600 bg-blue-50' },
  { id: 'stomach', label: 'Stomach Problem', icon: Activity, color: 'text-orange-600 bg-orange-50' },
  { id: 'skin', label: 'Skin Problem', icon: Smile, color: 'text-pink-600 bg-pink-50' },
  { id: 'child_health', label: 'Child Health', icon: Baby, color: 'text-emerald-600 bg-emerald-50' },
  { id: 'womens_health', label: "Women's Health", icon: HeartHandshake, color: 'text-purple-600 bg-purple-50' },
  { id: 'elderly_care', label: 'Elderly Care', icon: Users, color: 'text-indigo-600 bg-indigo-50' },
  { id: 'general', label: 'General Consultation', icon: HelpCircle, color: 'text-teal-600 bg-teal-50' },
  { id: 'other', label: 'Other Concern', icon: HelpCircle, color: 'text-slate-600 bg-slate-50' },
];

const presetVillages = [
  { name: 'Karegaon (Shirur)', lat: 18.8256, lng: 74.3721 },
  { name: 'Pabal (Shirur)', lat: 18.8410, lng: 74.3215 },
  { name: 'Narayangaon (Junnar)', lat: 19.1240, lng: 73.9780 },
  { name: 'Manchar (Ambegaon)', lat: 19.0124, lng: 73.9450 },
  { name: 'Otur (Junnar)', lat: 19.2612, lng: 73.9840 },
  { name: 'Chakan Rural (Khed)', lat: 18.7561, lng: 73.8590 },
  { name: 'Baramati Rural', lat: 18.1524, lng: 74.5768 },
];

export const BookDoctorModal: React.FC<BookDoctorModalProps> = ({
  isOpen,
  onClose,
  onStartMatching,
  initialCategory
}) => {
  const { currentPatient } = useAuth();
  const { t, language } = useLanguage();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedCategory, setSelectedCategory] = useState<VisitCategory>('fever');
  const [symptomsDescription, setSymptomsDescription] = useState('High fever and severe body headache since yesterday.');
  const [urgency, setUrgency] = useState<VisitUrgency>('soon');
  const [lat, setLat] = useState(currentPatient?.lat || 18.8256);
  const [lng, setLng] = useState(currentPatient?.lng || 74.3721);
  const [address, setAddress] = useState(
    currentPatient?.village
      ? `Near Vitthal Temple, ${currentPatient.village}, Taluka ${currentPatient.taluka}`
      : 'Near Vitthal Temple, Karegaon, Shirur'
  );
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  useEffect(() => {
    if (initialCategory && categoriesList.some((c) => c.id === initialCategory)) {
      setSelectedCategory(initialCategory as VisitCategory);
    }
  }, [initialCategory]);

  if (!isOpen) return null;

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude);
          setLng(pos.coords.longitude);
          setAddress(`Current GPS Location (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`);
        },
        () => {
          // Fallback to Shirur Karegaon
          setLat(18.8256);
          setLng(74.3721);
          setAddress('Karegaon Village, Shirur, Pune District');
        }
      );
    } else {
      setLat(18.8256);
      setLng(74.3721);
      setAddress('Karegaon Village, Shirur, Pune District');
    }
  };

  const handleSelectVillage = (village: typeof presetVillages[0]) => {
    setLat(village.lat);
    setLng(village.lng);
    setAddress(`${village.name}, Pune District`);
  };

  const handleSubmit = () => {
    onStartMatching({
      category: selectedCategory,
      symptoms: symptomsDescription,
      urgency,
      lat,
      lng,
      address,
      preferredLanguage: language
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header with Progress Steps */}
        <div className="bg-slate-900 text-white p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-bold text-health-400 uppercase tracking-wider">
                Step {step} of 4
              </span>
              <h2 className="text-xl font-black">
                {step === 1 && "What do you need help with?"}
                {step === 2 && "How urgent is your visit?"}
                {step === 3 && "Confirm your village location"}
                {step === 4 && "Review & Find Nearest Doctor"}
              </h2>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white text-lg font-bold p-1">
              ✕
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
            <div
              className="bg-health-500 h-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {/* STEP 1: CATEGORY & SYMPTOMS */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categoriesList.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-2 ${
                        isSelected
                          ? 'border-health-600 bg-health-50/80 shadow-sm ring-2 ring-health-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${cat.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">
                        {cat.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Symptom text description + Voice Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Describe your symptoms:
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsVoiceModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-health-100 hover:bg-health-200 text-health-800 rounded-lg text-xs font-bold transition shadow-sm"
                  >
                    <Mic className="w-3.5 h-3.5 text-health-700" />
                    <span>🎤 Tap to speak</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={symptomsDescription}
                  onChange={(e) => setSymptomsDescription(e.target.value)}
                  placeholder="e.g. High fever, headache, body pain since morning..."
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-health-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 2: URGENCY */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                This helps our matching algorithm prioritize physician travel queues.
              </p>

              <div className="space-y-3">
                {[
                  {
                    id: 'routine',
                    title: 'Routine Checkup',
                    desc: 'General health check, blood pressure or sugar review. Can visit within 3-4 hours.',
                    color: 'border-slate-200 hover:border-slate-300'
                  },
                  {
                    id: 'soon',
                    title: 'Soon (Recommended for Fever / Mild Acute)',
                    desc: 'Needs doctor visit within 30-45 minutes. Standard doorstep dispatch.',
                    color: 'border-emerald-500 bg-emerald-50/50'
                  },
                  {
                    id: 'urgent',
                    title: 'Urgent (High Priority)',
                    desc: 'High fever, acute pain, difficulty walking. Immediate dispatch within 15-20 minutes.',
                    color: 'border-amber-400 bg-amber-50/50'
                  },
                  {
                    id: 'emergency',
                    title: '🚨 Severe / Life-Threatening (Emergency)',
                    desc: 'Chest pain, unconsciousness, severe breathing difficulty, massive bleeding. Requires immediate 108 ambulance dispatch.',
                    color: 'border-red-400 bg-red-50/60'
                  }
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setUrgency(item.id as VisitUrgency)}
                    className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-start justify-between ${
                      urgency === item.id
                        ? 'border-health-600 bg-health-50 shadow-sm ring-2 ring-health-500/20'
                        : item.color
                    }`}
                  >
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">{item.title}</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                    {urgency === item.id && (
                      <CheckCircle2 className="w-5 h-5 text-health-600 shrink-0 ml-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: LOCATION & MAP */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="text-xs text-slate-500">
                  Doctor needs precise village coordinates for route navigation.
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleUseMyLocation}
                    className="px-3 py-1.5 bg-health-600 hover:bg-health-700 text-white rounded-lg text-xs font-bold shadow-sm transition flex items-center gap-1"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Use My Location</span>
                  </button>
                </div>
              </div>

              {/* Map Preview */}
              <LeafletMap
                center={[lat, lng]}
                zoom={14}
                height="220px"
                markers={[
                  {
                    id: 'patient-loc',
                    lat,
                    lng,
                    title: 'Your Doorstep',
                    type: 'patient',
                    subtitle: address
                  }
                ]}
                onLocationSelect={(selectedLat, selectedLng) => {
                  setLat(selectedLat);
                  setLng(selectedLng);
                  setAddress(`Selected Location (${selectedLat.toFixed(4)}, ${selectedLng.toFixed(4)})`);
                }}
              />

              {/* Preset Village Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Or select village manually:
                </label>
                <div className="flex flex-wrap gap-2">
                  {presetVillages.map((v) => (
                    <button
                      key={v.name}
                      onClick={() => handleSelectVillage(v)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                        lat === v.lat && lng === v.lng
                          ? 'bg-health-700 text-white border-health-700 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">
                  Landmark / House Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-health-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW & CONFIRM */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="bg-health-50/70 border border-health-200 rounded-2xl p-5 space-y-3">
                <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider border-b border-health-200/80 pb-2">
                  Visit Request Summary
                </h3>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500">Patient:</span>
                    <div className="font-bold text-slate-800">{currentPatient?.name || 'Ramesh Patil'}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">ABHA ID:</span>
                    <div className="font-bold text-slate-800">{currentPatient?.abhaId || '14-8892-3021-9981'}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Category:</span>
                    <div className="font-bold text-slate-800 capitalize">{selectedCategory.replace('_', ' ')}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Urgency:</span>
                    <div className="font-bold text-amber-700 uppercase">{urgency}</div>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500">Doorstep Location:</span>
                    <div className="font-bold text-slate-800">{address}</div>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500">Reported Symptoms:</span>
                    <div className="font-medium text-slate-700 bg-white p-2.5 rounded-lg border border-health-100 mt-1">
                      "{symptomsDescription}"
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Our geospatial matching engine will broadcast to verified on-duty doctors within your radius and display the best match.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Navigation */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => (s - 1) as any)}
              className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep((s) => (s + 1) as any)}
              className="px-6 py-2.5 bg-health-700 hover:bg-health-800 text-white rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition shadow-md"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-7 py-3 bg-gradient-to-r from-health-700 to-emerald-800 hover:from-health-800 hover:to-emerald-900 text-white rounded-xl font-black text-sm flex items-center gap-2 transition shadow-lg shadow-health-700/30 transform hover:scale-105"
            >
              <span>Find Nearest Doctor</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Voice Input Submodal */}
      <VoiceInputModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onTranscriptReady={(text) => setSymptomsDescription(text)}
        preferredLanguage={language}
      />
    </div>
  );
};
