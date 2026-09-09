import React from 'react';
import { HeartHandshake, Phone, ShieldCheck, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-10 pb-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-health-600 flex items-center justify-center text-white font-bold">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="text-white font-extrabold text-lg">RuralCare Connect</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              "Bringing the doctor to the doorstep" — A digital public-health initiative designed to connect rural and underserved communities with verified doctors, maintain ABHA-compliant unified digital health records, and provide real-time 108 emergency escalation.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="px-2.5 py-1 bg-health-950/80 border border-health-600/40 text-health-400 rounded text-xs font-mono">
                Smart India Hackathon 2026 | PS 26133
              </span>
              <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded text-xs">
                Theme: MedTech / BioTech
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-3">Public Health</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Government of Maharashtra</li>
              <li>National Health Mission (NHM)</li>
              <li>Ayushman Bharat Digital Mission (ABDM)</li>
              <li>District Health Office, Pune</li>
              <li>108 Emergency Medical Services</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-3">Emergency Helplines</h4>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-2 text-red-400 font-bold">
                <Phone className="w-4 h-4" />
                <span>108 — Free Emergency Ambulance</span>
              </div>
              <div className="flex items-center gap-2 text-amber-400 font-semibold">
                <Phone className="w-4 h-4" />
                <span>104 — Maharashtra Health Advice Helpline</span>
              </div>
              <p className="text-xs text-slate-500 pt-2">
                Prototype demonstration build. Integrated with mock REST service layer for seamless migration to Node.js/PostgreSQL/PostGIS.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 RuralCare Connect — Public Health Digital Infrastructure. Built for SIH 2026.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-health-500" />
              ABHA & Consent-Architecture Ready
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
