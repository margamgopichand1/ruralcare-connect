import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import {
  HeartPulse,
  Stethoscope,
  Ambulance,
  AlertTriangle,
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
  Sparkles,
  TrendingDown,
  TrendingUp,
  HeartHandshake,
  Layers,
  Home,
  Share2,
  Pill
} from 'lucide-react';

interface LandingPageProps {
  onGetHealthcare: () => void;
  onJoinAsDoctor: () => void;
  onOpenSos: () => void;
  onViewAdmin: () => void;
  onStartDemo?: () => void;
  onOpenInnovations?: () => void;
  onOpenSihAlignment?: () => void;
  onOpenTechArchitecture?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetHealthcare,
  onJoinAsDoctor,
  onOpenSos,
  onViewAdmin,
  onStartDemo,
  onOpenInnovations,
  onOpenSihAlignment,
  onOpenTechArchitecture
}) => {
  const { t } = useLanguage();

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Top SIH Hackathon Official Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white py-2 px-4 border-b border-emerald-500/30 text-center">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs font-medium">
          <span className="bg-emerald-600 text-white px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px]">
            SIH 2026
          </span>
          <span className="font-extrabold text-emerald-300">
            Problem Statement: SIH26133
          </span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span>Theme: MedTech / HealthTech • Public Health System Strengthening</span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="text-amber-300 font-bold">Prototype Demonstration Edition</span>
        </div>
      </div>

      {/* HERO SECTION (Requirement 35) */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 bg-gradient-to-b from-white via-slate-50 to-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold shadow-sm">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Right Care. Right Place. Right Time.</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Healthcare should <br />
                <span className="text-emerald-700">reach everyone.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                RuralCare Connect connects patients, frontline health workers, doctors, hospitals and emergency services into one continuous rural healthcare ecosystem that strengthens the existing public health system rather than replacing it.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={onGetHealthcare}
                  className="w-full sm:w-auto px-8 py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-emerald-700/30 hover:scale-[1.02] transition flex items-center justify-center gap-2"
                >
                  <span>Explore Platform</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  onClick={onStartDemo || onGetHealthcare}
                  className="w-full sm:w-auto px-7 py-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-base rounded-2xl shadow-md transition flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>Start Demo (19 Stages)</span>
                </button>

                <button
                  onClick={onOpenSos}
                  className="w-full sm:w-auto px-6 py-4 bg-red-600 hover:bg-red-700 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-red-600/30 hover:scale-[1.02] transition flex items-center justify-center gap-2 animate-pulse"
                >
                  <Ambulance className="w-5 h-5" />
                  <span>108 SOS</span>
                </button>
              </div>

              {/* Quick Pillars */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-bold text-slate-600">
                <span className="flex items-center gap-1 text-emerald-700">✓ Doorstep Care</span>
                <span className="flex items-center gap-1 text-teal-700">✓ Dynamic Priority Queue</span>
                <span className="flex items-center gap-1 text-blue-700">✓ 7-Stage Referrals</span>
                <span className="flex items-center gap-1 text-purple-700">✓ Offline-First Resilience</span>
              </div>
            </div>

            {/* Right Graphic: Visual Flow */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 relative overflow-hidden space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Continuous Care Pipeline
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    Public Health Continuum
                  </span>
                </div>

                {/* Flow Diagram */}
                <div className="space-y-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 font-black flex items-center justify-center shrink-0">1</div>
                    <div>
                      <strong className="text-slate-900 block font-bold">Home / Village</strong>
                      <span className="text-slate-500 text-[11px]">Symptom onset, AI triage, or 108 SOS</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-black flex items-center justify-center shrink-0">2</div>
                    <div>
                      <strong className="text-slate-900 block font-bold">Healthcare Worker (ASHA / ANM)</strong>
                      <span className="text-slate-500 text-[11px]">Doorstep screening, vitals & medicine supply</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 font-black flex items-center justify-center shrink-0">3</div>
                    <div>
                      <strong className="text-slate-900 block font-bold">Doctor (PHC Medical Officer)</strong>
                      <span className="text-slate-500 text-[11px]">Dynamic clinical priority queue & prescription</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-800 font-black flex items-center justify-center shrink-0">4</div>
                    <div>
                      <strong className="text-slate-900 block font-bold">Rural / District Hospital</strong>
                      <span className="text-slate-500 text-[11px]">Pre-arrival alert, inpatient resus, surgery</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 font-black flex items-center justify-center shrink-0">5</div>
                    <div>
                      <strong className="text-slate-900 block font-bold">Treatment & Follow-up</strong>
                      <span className="text-slate-500 text-[11px]">Automated ASHA registry loop closure</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EMERGENCY INTELLIGENCE SHOWCASE (Requirement 23 & 35) */}
      <section className="py-14 bg-gradient-to-b from-slate-900 to-slate-950 text-white border-y border-red-900/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-red-950/15 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/30 text-red-300 text-xs font-black uppercase border border-red-500/40">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span>AI-Assisted Emergency First-Aid & SOS Intelligence</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              The Critical Golden-Hour Pipeline
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Bridging the critical gap between an emergency occurring in a rural household and professional medical help arriving. Protocol-guided bystander first-aid, voice interaction, ambulance telemetry, and zero-minute hospital trauma preparation.
            </p>
          </div>

          {/* 10-Step Sequential Visual Flow (Requirement 23) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2 text-center text-xs">
            {[
              { step: '1', title: '108 SOS', icon: '🚨', desc: 'Doorstep GPS lock' },
              { step: '2', title: 'Assessment', icon: '🧠', desc: 'Urgency triage' },
              { step: '3', title: 'AI First-Aid', icon: '🩺', desc: 'Card-by-card protocol' },
              { step: '4', title: 'Ambulance', icon: '🚑', desc: 'Nearest 108 ALS' },
              { step: '5', title: 'Smart Match', icon: '🏥', desc: 'Capability routing' },
              { step: '6', title: 'Navigation', icon: '🗺️', desc: 'Telemetry guidance' },
              { step: '7', title: 'Pre-Alert', icon: '📢', desc: 'Trauma bay prepped' },
              { step: '8', title: 'Dynamic Queue', icon: '⚡', desc: 'Clinician override' },
              { step: '9', title: 'Treatment', icon: '👨‍⚕️', desc: 'Resuscitation & care' },
              { step: '10', title: 'Follow-up', icon: '🔄', desc: 'ASHA loop closed' }
            ].map((st) => (
              <div
                key={st.step}
                className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80 hover:border-red-500/60 transition flex flex-col items-center justify-between gap-1.5 shadow-sm"
              >
                <div className="text-xl">{st.icon}</div>
                <div className="font-extrabold text-white text-[11px] leading-tight">{st.title}</div>
                <div className="text-[9px] text-slate-400">{st.desc}</div>
                <span className="text-[9px] font-mono text-red-400 font-bold">Step {st.step}</span>
              </div>
            ))}
          </div>

          {/* Statutory Note & Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-950/80 rounded-2xl border border-red-900/50 text-xs">
            <div className="text-slate-400 text-xs">
              <strong className="text-red-400">Clinical Governance Note: </strong>
              AI provides assistance and communication support. Clinical decisions and emergency treatment remain under qualified healthcare professionals.
            </div>

            <button
              onClick={onOpenSos}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-600/40 transition flex items-center gap-1.5 shrink-0"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Launch Emergency 108 Demo</span>
            </button>
          </div>
        </div>
      </section>

      {/* PROJECTED DEMO IMPACT METRICS (Requirement 36) */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Projected Public Health Impact
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Measurable Transformation in Rural Care Delivery
            </h2>
            <p className="text-xs text-slate-500 italic">
              *Projected demonstration metrics modeled on pilot district public health implementations. Clearly labeled as simulated projections.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {/* Metric 1 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
              <div className="flex items-center justify-center text-emerald-600 mb-1">
                <TrendingDown className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">↓ 68%</div>
              <div className="text-xs font-bold text-slate-700">Travel Burden</div>
              <div className="text-[10px] text-slate-500">Doorstep care for routine illness</div>
            </div>

            {/* Metric 2 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
              <div className="flex items-center justify-center text-emerald-600 mb-1">
                <TrendingDown className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">↓ 45 min</div>
              <div className="text-xs font-bold text-slate-700">Waiting Time</div>
              <div className="text-[10px] text-slate-500">Dynamic queue & token triage</div>
            </div>

            {/* Metric 3 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
              <div className="flex items-center justify-center text-teal-600 mb-1">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-teal-700 font-mono">↑ 84%</div>
              <div className="text-xs font-bold text-slate-700">Referral Completion</div>
              <div className="text-[10px] text-slate-500">7-stage closed-loop tracking</div>
            </div>

            {/* Metric 4 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
              <div className="flex items-center justify-center text-teal-600 mb-1">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-teal-700 font-mono">↑ 92%</div>
              <div className="text-xs font-bold text-slate-700">Follow-up Adherence</div>
              <div className="text-[10px] text-slate-500">Maternal & child registry</div>
            </div>

            {/* Metric 5 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
              <div className="flex items-center justify-center text-teal-600 mb-1">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-teal-700 font-mono">↑ 100%</div>
              <div className="text-xs font-bold text-slate-700">Medicine Visibility</div>
              <div className="text-[10px] text-slate-500">Real-time facility stock status</div>
            </div>

            {/* Metric 6 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
              <div className="flex items-center justify-center text-teal-600 mb-1">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-teal-700 font-mono">↑ 3.8x</div>
              <div className="text-xs font-bold text-slate-700">Specialist Access</div>
              <div className="text-[10px] text-slate-500">Teleconsultation at PHC level</div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK PRESENTATION SHORTCUTS FOR JUDGES */}
      <section className="py-10 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-black text-white">SIH 2026 Presentation Resources</h3>
            <p className="text-xs text-slate-400">Directly review innovations, architectural diagrams, and problem alignment.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenInnovations}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition"
            >
              💡 Why RuralCare? (Innovations)
            </button>
            <button
              onClick={onOpenSihAlignment}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition"
            >
              📋 Problem-to-Solution Matrix
            </button>
            <button
              onClick={onOpenTechArchitecture}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition"
            >
              🏛️ Technical Architecture (7 Layers)
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
