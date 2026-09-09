import React, { useState } from 'react';
import {
  MessageSquare,
  Phone,
  Users,
  Smartphone,
  CheckCircle2,
  Send,
  Sparkles,
  PhoneCall
} from 'lucide-react';

export const SmsIvrFallbackView: React.FC = () => {
  const [smsSymptom, setSmsSymptom] = useState('FEVER');
  const [smsVillage, setSmsVillage] = useState('KAREGAON');
  const [smsSimSent, setSmsSimSent] = useState(false);

  const [simIvrActive, setSimIvrActive] = useState(false);
  const [ivrStep, setIvrStep] = useState(1);

  const ashaWorkers = [
    {
      name: 'Sunita Tai Gaikwad',
      designation: 'Accredited Social Health Activist (ASHA)',
      village: 'Karegaon, Shirur',
      phone: '+91 98221 55091',
      experience: '9 years serving Karegaon',
      assignedPhc: 'PHC Karegaon'
    },
    {
      name: 'Vandana Shinde',
      designation: 'ASHA Facilitator',
      village: 'Pabal & Ranjangaon',
      phone: '+91 94210 66124',
      experience: '11 years community service',
      assignedPhc: 'PHC Pabal'
    },
    {
      name: 'Meena Bhosle',
      designation: 'ASHA Worker',
      village: 'Manchar & Otur',
      phone: '+91 97631 44028',
      experience: '7 years community maternal care',
      assignedPhc: 'PHC Narayangaon'
    }
  ];

  const handleSendSms = (e: React.FormEvent) => {
    e.preventDefault();
    setSmsSimSent(true);
    setTimeout(() => {
      // Keep message displayed
    }, 1000);
  };

  const startIvrSim = () => {
    setSimIvrActive(true);
    setIvrStep(1);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold text-amber-300">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Inclusive Digital Public Infrastructure</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            For Users Without Smartphones
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            In rural Maharashtra, 42% of households still rely on basic 2G feature phones. RuralCare Connect provides full SMS syntax dispatch, interactive toll-free IVR voice triage, and local ASHA worker proxy booking.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SMS Booking Simulator */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Request Healthcare through SMS
              </h3>
              <p className="text-xs text-slate-500">Send an SMS from any basic Nokia/keypad phone</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
            <span className="font-bold text-slate-700 uppercase tracking-wider block">
              SMS Format Syntax:
            </span>
            <div className="font-mono bg-slate-900 text-emerald-400 p-2.5 rounded-xl font-bold text-xs">
              CARE &lt;SYMPTOM&gt; &lt;VILLAGE&gt; to 56161
            </div>
            <p className="text-slate-500 text-[11px]">
              Toll-free government gateway automatically geolocates patient village and pings nearest doctor.
            </p>
          </div>

          <form onSubmit={handleSendSms} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">SYMPTOM</label>
                <select
                  value={smsSymptom}
                  onChange={(e) => setSmsSymptom(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono font-bold"
                >
                  <option value="FEVER">FEVER</option>
                  <option value="COUGH">COUGH</option>
                  <option value="STOMACH">STOMACH</option>
                  <option value="CHILD">CHILD</option>
                  <option value="SOS">SOS (EMERGENCY)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">VILLAGE</label>
                <input
                  type="text"
                  value={smsVillage}
                  onChange={(e) => setSmsVillage(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-health-700 hover:bg-health-800 text-white rounded-xl font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Simulate Sending SMS (56161)</span>
            </button>
          </form>

          {smsSimSent && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs space-y-2 animate-fadeIn">
              <div className="flex items-center gap-1.5 font-extrabold text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>SMS Received & Dispatched ✓</span>
              </div>
              <p className="text-slate-700 font-mono text-[11px]">
                [Govt of MH] Request confirmed for {smsSymptom} at {smsVillage}. Dr. Priya Sharma (1.8km away) assigned. Estimated arrival in 12 mins. For emergency dial 108.
              </p>
            </div>
          )}
        </div>

        {/* Toll-Free IVR Interactive Simulator */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Interactive Voice Response (IVR)
              </h3>
              <p className="text-xs text-slate-500">Toll-Free Helpline: 1800-RURAL-CARE</p>
            </div>
          </div>

          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl text-xs space-y-2 text-slate-700">
            <p>
              Users call the toll-free number from any mobile or landline. The automated system speaks in Marathi, Hindi, or English and converts numeric keypad presses into doorstep requests.
            </p>
          </div>

          {!simIvrActive ? (
            <button
              onClick={startIvrSim}
              className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-md"
            >
              <Phone className="w-4 h-4" />
              <span>Simulate Dialing 1800-RURAL-CARE</span>
            </button>
          ) : (
            <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3 font-mono text-xs animate-fadeIn">
              <div className="flex items-center justify-between text-emerald-400 text-[11px] pb-2 border-b border-slate-800">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Call Active • 00:14
                </span>
                <button
                  onClick={() => setSimIvrActive(false)}
                  className="text-red-400 hover:text-red-300 font-bold"
                >
                  Hang Up
                </button>
              </div>

              {ivrStep === 1 && (
                <div className="space-y-2">
                  <p className="text-slate-200">
                    "महाराष्ट्र शासनाच्या रूरलकेअर सेवेत आपले स्वागत आहे. मराठीसाठी १ दाबा, हिंदीसाठी २ दाबा."
                  </p>
                  <button
                    onClick={() => setIvrStep(2)}
                    className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs"
                  >
                    Press [1] for Marathi
                  </button>
                </div>
              )}

              {ivrStep === 2 && (
                <div className="space-y-2">
                  <p className="text-slate-200">
                    "डॉक्टर घरी बोलावण्यासाठी १ दाबा. तातडीच्या रुग्णवाहिकेसाठी ९ दाबा."
                  </p>
                  <button
                    onClick={() => setIvrStep(3)}
                    className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs"
                  >
                    Press [1] to Book Doctor Visit
                  </button>
                </div>
              )}

              {ivrStep === 3 && (
                <div className="space-y-2">
                  <p className="text-emerald-300 font-bold">
                    "आपली नोंदणी यशस्वी झाली आहे. जवळचे डॉक्टर लवकरच आपल्या घरी पोहचतील. धन्यवाद."
                  </p>
                  <p className="text-slate-400 text-[10px]">
                    Doorstep request logged into Shirur PHC dispatch console.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Connect with Local ASHA Worker Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-health-700" />
            <h3 className="text-xl font-black text-slate-900">
              Connect with Local ASHA Worker
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Village ASHA workers carry community diagnostic tablets and can book doorstep visits on behalf of elderly, illiterate, or offline villagers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ashaWorkers.map((worker, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-health-400 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-health-100 text-health-800 px-2 py-0.5 rounded-full">
                    Certified ASHA
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{worker.assignedPhc}</span>
                </div>
                <h4 className="font-extrabold text-slate-900 text-base">{worker.name}</h4>
                <p className="text-xs text-slate-600 mt-0.5">{worker.designation}</p>
                <p className="text-xs font-semibold text-emerald-800 mt-2">Area: {worker.village}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{worker.experience}</p>
              </div>

              <a
                href={`tel:${worker.phone}`}
                className="mt-4 w-full py-2.5 bg-health-700 hover:bg-health-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call {worker.phone}</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
