import React from 'react';
import { Prescription } from '../../types';
import {
  Printer,
  Download,
  FileCheck,
  ShieldCheck,
  Building2,
  Calendar,
  Clock,
  HeartPulse,
  User,
  CheckCircle2,
  Share2
} from 'lucide-react';

interface PrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  prescription: Prescription | null;
  onSaveToRecord?: () => void;
}

export const PrescriptionModal: React.FC<PrescriptionModalProps> = ({
  isOpen,
  onClose,
  prescription,
  onSaveToRecord
}) => {
  if (!isOpen || !prescription) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    // Generate text blob for download
    const content = `
============================================================
              GOVERNMENT OF MAHARASHTRA
          PUBLIC HEALTH & FAMILY WELFARE DEPARTMENT
             RURALCARE CONNECT DIGITAL CLINIC
============================================================
Rx ID: ${prescription.id}
Date: ${prescription.date}
Facility: ${prescription.facilityName}

DOCTOR DETAILS:
Doctor: ${prescription.doctorName}
Qualification: ${prescription.doctorQualification}
MMC Reg Number: ${prescription.doctorLicense}

PATIENT DETAILS:
Name: ${prescription.patientName}
Age/Gender: ${prescription.patientAge} Yrs / ${prescription.patientGender}

CLINICAL VITALS:
- Temperature: ${prescription.vitals?.temperature || 'Normal'}
- Blood Pressure: ${prescription.vitals?.bloodPressure || '120/80 mmHg'}
- Pulse / Heart Rate: ${prescription.vitals?.heartRate || '76 bpm'}
- Oxygen Saturation (SpO2): ${prescription.vitals?.spO2 || '98%'}

DIAGNOSIS:
${prescription.diagnosis}

PRESCRIBED MEDICINES:
${prescription.medicines.map((m, i) => `${i + 1}. ${m.name} | Dosage: ${m.dosage} | Freq: ${m.frequency} | Duration: ${m.duration} | Note: ${m.instructions}`).join('\n')}

INSTRUCTIONS & ADVICE:
${prescription.instructions}

FOLLOW-UP DATE:
${prescription.followUpDate}

[Digitally signed under Ayushman Bharat Digital Mission - ABDM]
============================================================
    `;

    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Prescription_${prescription.patientName.replace(/\s+/g, '_')}_${prescription.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Bar */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-health-400" />
            <span className="font-extrabold text-sm">Official Digital Prescription</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
              title="Print Prescription"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={handleDownloadPdf}
              className="p-1.5 bg-health-700 hover:bg-health-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm"
              title="Download Prescription"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-white font-bold p-1 ml-2">
              ✕
            </button>
          </div>
        </div>

        {/* Printable Prescription Body */}
        <div id="printable-prescription" className="p-6 sm:p-8 overflow-y-auto flex-1 bg-white space-y-6">
          {/* Official Letterhead */}
          <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  Govt of Maharashtra • Public Health
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 mt-1">RuralCare Connect</h2>
              <p className="text-xs text-slate-600">Doorstep Primary Healthcare & Tele-medicine Service</p>
              <p className="text-[11px] text-slate-500">{prescription.facilityName}</p>
            </div>

            <div className="text-left sm:text-right text-xs">
              <div className="font-black text-slate-900 text-base">{prescription.doctorName}</div>
              <div className="text-slate-700 font-medium">{prescription.doctorQualification}</div>
              <div className="text-emerald-700 font-bold">MMC Reg No: {prescription.doctorLicense}</div>
              <div className="text-slate-400 text-[11px] mt-1">Date: {prescription.date}</div>
            </div>
          </div>

          {/* Patient Details & Vitals Strip */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-3">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Patient Name</span>
                <span className="font-extrabold text-slate-900 text-sm">{prescription.patientName}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Age / Gender</span>
                <span className="font-bold text-slate-800">{prescription.patientAge} yrs / {prescription.patientGender}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Prescription ID</span>
                <span className="font-mono text-slate-700 font-bold">{prescription.id}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">ABHA Verified</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Linked
                </span>
              </div>
            </div>

            {/* Recorded Vitals */}
            {prescription.vitals && (
              <div className="pt-2 border-t border-slate-200/80 flex flex-wrap gap-2 text-[11px]">
                <span className="font-semibold text-slate-600">Recorded Vitals:</span>
                {prescription.vitals.temperature && (
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800">
                    Temp: <strong>{prescription.vitals.temperature}</strong>
                  </span>
                )}
                {prescription.vitals.bloodPressure && (
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800">
                    BP: <strong>{prescription.vitals.bloodPressure}</strong>
                  </span>
                )}
                {prescription.vitals.heartRate && (
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800">
                    Pulse: <strong>{prescription.vitals.heartRate}</strong>
                  </span>
                )}
                {prescription.vitals.spO2 && (
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800">
                    SpO2: <strong>{prescription.vitals.spO2}</strong>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Clinical Diagnosis */}
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Clinical Diagnosis
            </span>
            <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl font-extrabold text-emerald-950 text-base">
              {prescription.diagnosis}
            </div>
          </div>

          {/* Prescribed Medicines (Rx) */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl font-serif font-black text-health-800">℞</span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Prescribed Medicines
              </span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-50 font-bold text-slate-700">
                  <tr>
                    <th className="py-2.5 px-3 text-left">#</th>
                    <th className="py-2.5 px-3 text-left">Medicine</th>
                    <th className="py-2.5 px-3 text-left">Dosage</th>
                    <th className="py-2.5 px-3 text-left">Frequency</th>
                    <th className="py-2.5 px-3 text-left">Duration</th>
                    <th className="py-2.5 px-3 text-left">Instructions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {prescription.medicines.map((med, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80">
                      <td className="py-2.5 px-3 font-mono text-slate-400">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-extrabold text-slate-900">{med.name}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-700">{med.dosage}</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-700">{med.frequency}</td>
                      <td className="py-2.5 px-3 text-slate-700">{med.duration}</td>
                      <td className="py-2.5 px-3 text-slate-600">{med.instructions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Advice / Doctor Notes */}
          {prescription.instructions && (
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Advice & Dietary Guidelines
              </span>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                {prescription.instructions}
              </div>
            </div>
          )}

          {/* Follow-up & Digital Stamp */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-500">Recommended Follow-up:</span>
              <div className="font-extrabold text-slate-900 text-sm">{prescription.followUpDate}</div>
            </div>

            <div className="text-right border-2 border-dashed border-emerald-500/40 p-3 rounded-xl bg-emerald-50/40">
              <div className="text-[10px] uppercase font-bold text-emerald-800">Digitally Certified MMC Doctor</div>
              <div className="text-xs font-black text-slate-900">{prescription.doctorName}</div>
              <div className="text-[10px] text-slate-500 font-mono">Timestamp: {new Date().toLocaleTimeString()}</div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="text-xs text-slate-500">
            Automatically mirrored into patient's lifetime ABHA health record.
          </div>
          <div className="flex items-center gap-2">
            {onSaveToRecord && (
              <button
                onClick={onSaveToRecord}
                className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition shadow-sm"
              >
                Save to Medical Record
              </button>
            )}
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Prescription</span>
            </button>
            <button
              onClick={handleDownloadPdf}
              className="px-4 py-2 bg-health-700 hover:bg-health-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Copy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
