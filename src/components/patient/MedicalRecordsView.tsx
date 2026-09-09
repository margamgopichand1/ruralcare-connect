import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MedicalRecordItem, Referral } from '../../types';
import { getPatientMedicalRecords } from '../../services/medicalRecordService';
import { getPatientReferrals } from '../../services/referralService';
import { getStoredPrescriptions } from '../../services/prescriptionService';
import {
  FileText,
  Calendar,
  Clock,
  ShieldCheck,
  Stethoscope,
  Building2,
  Share2,
  Filter,
  CheckCircle,
  AlertCircle,
  Eye,
  HeartPulse
} from 'lucide-react';

interface MedicalRecordsViewProps {
  onViewPrescriptionById?: (prescriptionId: string) => void;
}

export const MedicalRecordsView: React.FC<MedicalRecordsViewProps> = ({
  onViewPrescriptionById
}) => {
  const { currentPatient } = useAuth();
  const patientId = currentPatient?.id || 'pat-1';

  const [records, setRecords] = useState<MedicalRecordItem[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    setRecords(getPatientMedicalRecords(patientId));
    setReferrals(getPatientReferrals(patientId));
  }, [patientId]);

  const filteredRecords = records.filter((r) => {
    if (filterType === 'all') return true;
    return r.type === filterType;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* ABHA EHR Header Strip */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Ayushman Bharat Digital Mission (ABDM) Compatible</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              Unified Digital Health Locker
            </h1>
            <p className="text-sm text-blue-200 max-w-xl leading-relaxed">
              This record seamlessly follows the patient across Sub-Centers, PHCs, CHCs, and District Hospitals. Fully portable across Government of Maharashtra public health networks.
            </p>
          </div>

          <div className="p-4 bg-white/10 rounded-2xl border border-white/20 text-xs space-y-1.5 self-start md:self-auto min-w-[220px]">
            <div>
              <span className="text-blue-300">Patient:</span>{' '}
              <strong className="text-white">{currentPatient?.name || 'Ramesh Patil'}</strong>
            </div>
            <div>
              <span className="text-blue-300">ABHA Health ID:</span>{' '}
              <strong className="text-emerald-300 font-mono">{currentPatient?.abhaId || '14-8892-3021-9981'}</strong>
            </div>
            <div>
              <span className="text-blue-300">Blood Group:</span>{' '}
              <strong className="text-white">{currentPatient?.bloodGroup || 'B+'}</strong>
            </div>
            <div>
              <span className="text-blue-300">Known Allergies:</span>{' '}
              <strong className="text-amber-300">
                {currentPatient?.allergies.join(', ') || 'None recorded'}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Active Referrals Alert Strip */}
      {referrals.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Share2 className="w-4 h-4 text-purple-600" />
            <span>Active Hospital Referrals ({referrals.length})</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {referrals.map((ref) => (
              <div
                key={ref.id}
                className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-purple-900 bg-purple-200/80 px-2.5 py-0.5 rounded-full">
                    {ref.specialistType} Referral
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white font-bold text-slate-700 border border-purple-200">
                    Status: <strong className="text-purple-700 uppercase">{ref.status}</strong>
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">{ref.hospitalName}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{ref.facilityAddress}</p>
                </div>

                <div className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-purple-100">
                  <span className="font-bold text-slate-900">Clinical Reason:</span> {ref.reason}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Referred by {ref.doctorName}</span>
                  <span>Date: {ref.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            Chronological Care Timeline
          </h2>
          <p className="text-xs text-slate-500">
            All clinical interactions, vitals checkups, doorstep visits, and prescriptions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 text-xs font-bold border border-slate-300 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-health-500 shadow-sm"
          >
            <option value="all">All Facilities & Encounters</option>
            <option value="consultation">Doorstep Consultations</option>
            <option value="phc_visit">PHC Clinic Visits</option>
            <option value="district_hospital">District Hospital Admissions</option>
          </select>
        </div>
      </div>

      {/* Longitudinal Timeline Component */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 space-y-8 ml-2 sm:ml-4">
        {filteredRecords.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-sm">
            No medical records matching this filter.
          </div>
        ) : (
          filteredRecords.map((record, index) => (
            <div key={record.id} className="relative group">
              {/* Timeline dot */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-white border-4 border-health-600 shadow-sm group-hover:scale-125 transition-transform flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-health-700" />
              </div>

              {/* Record Content Card */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 hover:border-health-400 hover:shadow-md transition shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                      {record.date}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-health-50 text-health-800 border border-health-200">
                      {record.type.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{record.facilityName}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {record.title}
                  </h3>
                  <p className="text-xs font-medium text-emerald-800 mt-0.5">
                    Attending Provider: {record.providerName}
                  </p>
                </div>

                {record.diagnosis && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <span className="font-bold text-slate-700 block mb-0.5">Diagnosis:</span>
                    <span className="font-extrabold text-slate-900 text-sm">{record.diagnosis}</span>
                  </div>
                )}

                {/* Vitals Strip */}
                {record.vitals && (
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    {record.vitals.temperature && (
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
                        Temp: <strong>{record.vitals.temperature}</strong>
                      </span>
                    )}
                    {record.vitals.bloodPressure && (
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
                        BP: <strong>{record.vitals.bloodPressure}</strong>
                      </span>
                    )}
                    {record.vitals.heartRate && (
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
                        Pulse: <strong>{record.vitals.heartRate}</strong>
                      </span>
                    )}
                    {record.vitals.spO2 && (
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
                        SpO2: <strong>{record.vitals.spO2}</strong>
                      </span>
                    )}
                  </div>
                )}

                <p className="text-xs text-slate-600 leading-relaxed">
                  {record.details}
                </p>

                {/* Action if prescription linked */}
                {record.prescriptionId && onViewPrescriptionById && (
                  <div className="pt-2 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => onViewPrescriptionById(record.prescriptionId!)}
                      className="px-3.5 py-1.5 bg-health-50 hover:bg-health-100 text-health-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-health-200"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Linked Digital Prescription</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
