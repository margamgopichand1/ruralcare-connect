import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Language } from '../../types';
import { Globe, ChevronDown } from 'lucide-react';

const languages: { code: Language; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' }
];

export const LanguageSelector: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const current = languages.find((l) => l.code === language) || languages[0];

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition shadow-sm focus:outline-none focus:ring-2 focus:ring-health-500"
        title="Change Language"
      >
        <Globe className="w-4 h-4 text-health-600" />
        <span className="font-semibold">{current.native}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-44 rounded-xl shadow-xl bg-white ring-1 ring-black ring-opacity-5 z-50 py-1.5 border border-slate-100">
            <div className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Select Language
            </div>
            {languages.map((item) => (
              <button
                key={item.code}
                onClick={() => {
                  setLanguage(item.code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-health-50 transition ${
                  language === item.code ? 'bg-health-50 text-health-800 font-bold' : 'text-slate-700'
                }`}
              >
                <span>{item.native}</span>
                <span className="text-xs text-slate-400 font-normal">({item.label})</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
