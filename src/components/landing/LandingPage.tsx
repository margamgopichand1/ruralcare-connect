import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import {
  HeartPulse,
  Stethoscope,
  Ambulance,
  FileCheck2,
  PhoneCall,
  WifiOff,
  ShieldCheck,
  MapPin,
  Clock,
  ArrowRight,
  Activity,
  Users,
  CheckCircle2,
  Building2,
  Mic,
  Sparkles
} from 'lucide-react';

interface LandingPageProps {
  onGetHealthcare: () => void;
  onJoinAsDoctor: () => void;
  onOpenSos: () => void;
  onViewAdmin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetHealthcare,
  onJoinAsDoctor,
  onOpenSos,
  onViewAdmin
}) => {
  const { t } = useLanguage();
  const { quickDemoLogin } = useAuth();

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Top SIH Hackathon Banner */}
      <div className="bg-gradient-to-r from-gov-dark via-health-900 to-gov-dark text-white py-2 px-4 border-b border-health-600/30 text-center">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs font-medium">
          <span className="bg-health-600 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px]">
            SIH 2026
          </span>
          <span className="font-semibold text-emerald-300">
            Problem Statement: SIH26133
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span>Organization: Government of Maharashtra</span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="text-amber-300 font-semibold">Theme: MedTech / BioTech / HealthTech</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 bg-gradient-to-b from-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-health-100 border border-health-200 text-health-800 text-xs sm:text-sm font-semibold shadow-sm">
                <Sparkles className="w-4 h-4 text-health-600" />
                <span>Maharashtra Digital Public Health Mission</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                RuralCare <span className="text-health-700">Connect</span>
                <span className="block text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-700 mt-2">
                  "Bringing the doctor to the doorstep"
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed">
                Connecting rural patients with nearby healthcare professionals, unified digital medical records, and immediate 108 emergency support. Built for low connectivity and last-mile accessibility.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={onGetHealthcare}
                  className="w-full sm:w-auto px-8 py-4 bg-health-700 hover:bg-health-800 text-white font-extrabold text-base rounded-xl shadow-lg shadow-health-700/30 hover:scale-[1.02] transition flex items-center justify-center gap-2"
                >
                  <span>Get Healthcare</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  onClick={onJoinAsDoctor}
                  className="w-full sm:w-auto px-7 py-4 bg-white hover:bg-slate-50 text-slate-800 font-bold text-base rounded-xl border-2 border-slate-300 hover:border-health-600 transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <Stethoscope className="w-5 h-5 text-health-700" />
                  <span>Join as Doctor</span>
                </button>

                <button
                  onClick={onOpenSos}
                  className="w-full sm:w-auto px-6 py-4 bg-red-600 hover:bg-red-700 text-white font-extrabold text-base rounded-xl shadow-lg shadow-red-600/30 hover:scale-[1.02] transition flex items-center justify-center gap-2 animate-pulse"
                >
                  <Ambulance className="w-5 h-5" />
                  <span>108 SOS</span>
                </button>
              </div>

              {/* Quick Metrics Bar */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900">14 min</div>
                  <div className="text-xs text-slate-500 font-medium">Avg Doorstep ETA</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-health-700">100%</div>
                  <div className="text-xs text-slate-500 font-medium">Verified MMC Doctors</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-indigo-700">ABHA</div>
                  <div className="text-xs text-slate-500 font-medium">Unified Records</div>
                </div>
              </div>
            </div>

            {/* Right Graphic / Interactive Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-health-100 rounded-full blur-3xl -z-10" />
                
                {/* Live Dispatch Simulation Card */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Live Rural Dispatch Center
                    </span>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-health-50 text-health-800 font-semibold border border-health-200">
                    Pune District Hub
                  </span>
                </div>

                <div className="my-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Request Status</span>
                    <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Doctor En Route
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=120"
                      alt="Dr. Priya Sharma"
                      className="w-12 h-12 rounded-xl object-cover border-2 border-health-500 shadow"
                    />
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">Dr. Priya Sharma</h4>
                      <p className="text-xs text-slate-600">General Physician (MBBS, MD)</p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] font-semibold text-slate-500">
                        <span>⭐ 4.8</span>
                        <span>•</span>
                        <span className="text-emerald-700">1.8 km away</span>
                        <span>•</span>
                        <span className="text-slate-700 font-bold">ETA: 8 mins</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Line */}
                  <div className="space-y-1.5 pt-1">
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-health-600 h-full rounded-full w-2/3 animate-pulse" />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                      <span>Shirur PHC Station</span>
                      <span>Arriving Karegaon Village</span>
                    </div>
                  </div>
                </div>

                {/* Quick Action Preview */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => {
                      quickDemoLogin('patient');
                      onGetHealthcare();
                    }}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-health-50 hover:border-health-400 transition text-left"
                  >
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-health-600" />
                      Book Visit
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Fever, cough, checkups</p>
                  </button>

                  <button
                    onClick={onOpenSos}
                    className="p-3 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 hover:border-red-400 transition text-left"
                  >
                    <div className="text-xs font-bold text-red-900 flex items-center gap-1.5">
                      <Ambulance className="w-3.5 h-3.5 text-red-600" />
                      Emergency 108
                    </div>
                    <p className="text-[11px] text-red-700 mt-1">Instant ambulance dispatch</p>
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    MMC Verified Doctors
                  </span>
                  <button
                    onClick={onViewAdmin}
                    className="text-health-700 hover:underline font-bold"
                  >
                    View District GIS Dashboard →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (4-Step Visual Flow) */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-health-700 mb-2">
              Simple & Low-Literacy Friendly
            </h2>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900">
              How RuralCare Connect Works
            </h3>
            <p className="text-slate-600 text-base mt-2">
              From symptom request to doorstep clinical care and digital prescription in 4 seamless steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 relative hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-xl bg-health-100 text-health-800 flex items-center justify-center font-black text-lg mb-4">
                1
              </div>
              <h4 className="font-extrabold text-slate-900 text-lg mb-2">Request Healthcare</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Select symptoms with 1-tap pictorial cards, use microphone voice input, or send an SMS from a basic keypad phone.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 relative hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-xl bg-health-100 text-health-800 flex items-center justify-center font-black text-lg mb-4">
                2
              </div>
              <h4 className="font-extrabold text-slate-900 text-lg mb-2">Nearest Doctor Match</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our smart dispatch algorithm ranks nearby verified doctors using Haversine distance, specialty match, and doctor rating.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 relative hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-xl bg-health-100 text-health-800 flex items-center justify-center font-black text-lg mb-4">
                3
              </div>
              <h4 className="font-extrabold text-slate-900 text-lg mb-2">Doctor Arrives</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Track doctor's approach live on the map. The doctor arrives with medical kit, takes vitals, and conducts bedside examination.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 relative hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-xl bg-health-100 text-health-800 flex items-center justify-center font-black text-lg mb-4">
                4
              </div>
              <h4 className="font-extrabold text-slate-900 text-lg mb-2">Digital Rx & ABHA Record</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Doctor issues a tamper-proof digital prescription, checks local PHC medicine stock, and updates the patient's lifetime health record.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-health-700 mb-2">
              Comprehensive HealthTech Platform
            </h2>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900">
              Built for Last-Mile Rural Resilience
            </h3>
            <p className="text-slate-600 text-base mt-2">
              Every capability tailored to overcome rural infrastructure limitations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-health-400 transition">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
                <Ambulance className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-lg mb-2">108 Emergency SOS</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                One-tap emergency escalation that captures GPS location, dispatches the nearest 108 ambulance, alerts the nearest district hospital, and notifies emergency family contacts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-health-400 transition">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-lg mb-2">Unified Digital Health Record</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                ABHA-compliant longitudinal timeline following the patient across Sub-centers, PHCs, CHCs, and District Hospitals. No more lost paper prescriptions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-health-400 transition">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-lg mb-2">Medicine Stock Visibility</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Real-time visibility into essential drug inventories (Paracetamol, Amoxicillin, ORS, Metformin) across nearby public health facilities to prevent stockouts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-health-400 transition">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <WifiOff className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-lg mb-2">Offline-First Architecture</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Continues working during zero network connectivity. Drafts visit requests and medical notes in local storage and synchronizes automatically upon reconnect.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-health-400 transition">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                <Mic className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-lg mb-2">Voice & Multilingual UI</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Speak symptoms directly in Marathi, Hindi, or Telugu. Low-literacy design with visual cards and simplified typography so every villager can navigate with ease.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-health-400 transition">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-lg mb-2">District Command Center</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Real-time public health monitoring dashboard for District Health Officers: GIS heatmaps, doctor utilization, coverage red zones, and seasonal epidemic alerts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency SOS Deep Dive Banner */}
      <section className="py-14 bg-gradient-to-r from-red-700 via-red-800 to-rose-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
                <Ambulance className="w-4 h-4" />
                <span>Life-Saving Escalation</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-black">
                Rapid 108 Emergency Ambulance Integration
              </h3>
              <p className="text-red-100 text-base max-w-2xl leading-relaxed">
                In severe medical emergencies, every minute counts. RuralCare Connect connects directly into Maharashtra's 108 emergency grid, broadcasting telemetry to the closest station and preparing hospital trauma bays before the patient even arrives.
              </p>
              <div className="text-xs text-red-200/90 font-medium italic">
                * Note: ETA is the fastest available estimate and depends on ambulance availability and rural terrain.
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <button
                onClick={onOpenSos}
                className="w-full py-4 px-6 bg-white text-red-700 hover:bg-red-50 font-black text-lg rounded-xl shadow-xl transition transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <Ambulance className="w-6 h-6" />
                <span>Test 108 SOS Simulator</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Government of Maharashtra & Public Health Integration */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-slate-200 rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-slate-50 to-white shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-health-100 text-health-800">
                  Public Health Systems
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Designed for Government of Maharashtra Health Infrastructure
                </h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  RuralCare Connect is architected to work in harmony with Sub-Centers, Primary Health Centres (PHCs), Community Health Centres (CHCs), and District Hospitals. It empowers ASHA workers with digital triage tools while maintaining central oversight for the Directorate of Health Services.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3 py-2 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>ABHA ID Architecture</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3 py-2 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>108 EMS Integration</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3 py-2 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>ASHA / ANM Community Support</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3 py-2 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>District GIS Health Command</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex justify-center">
                <button
                  onClick={onViewAdmin}
                  className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Building2 className="w-5 h-5 text-health-400" />
                  <span>Open District Command Center</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
