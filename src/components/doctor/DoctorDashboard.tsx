import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockDoctors } from '../../data/mockData';
import { QueueItem, QueuePriority, Doctor } from '../../types';
import {
  getQueueItems,
  updatePatientClinicalPriority,
  updateQueueStatus,
  getQueuePriorityAuditLogs,
  QueuePriorityAuditLog
} from '../../services/queueService';
import {
  Stethoscope,
  ShieldCheck,
  Clock,
  MapPin,
  AlertTriangle,
  UserCheck,
  CheckCircle,
  Users,
  Activity,
  ArrowRight,
  Sparkles,
  ArrowUpDown,
  FileText,
  Share2,
  Calendar,
  Pill,
  Video
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DoctorDashboardProps {
  onOpenConsultation: (queueItem: QueueItem) => void;
  onOpenPriorityModal: (queueItem: QueueItem) => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  onOpenConsultation,
  onOpenPriorityModal
}) => {
  const { currentDoctor } = useAuth();
  const doctor = currentDoctor || mockDoctors[0];

  const [queue, setQueue] = useState<QueueItem[]>(() => getQueueItems());
  const [auditLogs, setAuditLogs] = useState<QueuePriorityAuditLog[]>(() => getQueuePriorityAuditLogs());
  const [priorityUpdatedAlert, setPriorityUpdatedAlert] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<'all' | 'critical' | 'urgent' | 'normal'>('all');

  useEffect(() => {
    const handleUpdate = () => {
      setQueue(getQueueItems());
      setAuditLogs(getQueuePriorityAuditLogs());
    };
    window.addEventListener('ruralcare_queue_updated', handleUpdate);
    return () => window.removeEventListener('ruralcare_queue_updated', handleUpdate);
  }, []);

  // Counts
  const criticalCount = queue.filter((q) => q.priority === 'critical').length;
  const urgentCount = queue.filter((q) => q.priority === 'urgent').length;
  const normalCount = queue.filter((q) => q.priority === 'normal').length;
  const waitingCount = queue.filter((q) => q.status === 'waiting').length;

  const handleQuickPriorityUpgrade = (item: QueueItem) => {
    const nextPriority: QueuePriority = item.priority === 'normal' ? 'urgent' : 'critical';
    const updated = updatePatientClinicalPriority(
      item.id,
      nextPriority,
      doctor.name,
      `Priority escalated to ${nextPriority.toUpperCase()} by ${doctor.name} during clinical assessment.`
    );
    setQueue(updated);
    setAuditLogs(getQueuePriorityAuditLogs());
    setPriorityUpdatedAlert(`Queue priority updated based on clinical assessment: ${item.patientName} (${item.tokenNumber}) re-sequenced to ${nextPriority.toUpperCase()}.`);

    setTimeout(() => {
      setPriorityUpdatedAlert(null);
    }, 4500);
  };

  const filteredQueue = queue.filter((q) => {
    if (filterPriority !== 'all' && q.priority !== filterPriority) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-7 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <img
            src={doctor.avatar}
            alt={doctor.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-400 shadow-md shrink-0"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                PHC Medical Officer & Tele-Specialist
              </span>
              <span className="text-slate-400 text-xs font-mono hidden sm:inline">Reg: {doctor.licenseNumber}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">{doctor.name}</h1>
            <p className="text-xs sm:text-sm text-emerald-100">
              {doctor.qualification} • {doctor.specialization} • Coverage: {doctor.serviceArea}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950/60 p-2.5 rounded-2xl border border-slate-800 self-start md:self-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-emerald-300">OPD Active • Digital Consultations Ready</span>
        </div>
      </div>

      {/* METRICS COUNTER STRIP (Critical, Urgent, Normal, Referrals) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Critical */}
        <div
          onClick={() => setFilterPriority('critical')}
          className={`p-4 rounded-2xl border-2 cursor-pointer transition ${
            filterPriority === 'critical'
              ? 'border-red-600 bg-red-50 text-red-950 shadow-md'
              : 'border-red-200 bg-red-50/50 hover:bg-red-50 text-red-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-700">Critical Clinical</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-3xl font-black mt-1 font-mono text-red-600">{String(criticalCount).padStart(2, '0')}</div>
          <div className="text-[11px] text-red-700/80 mt-1">Requires immediate triage</div>
        </div>

        {/* Urgent */}
        <div
          onClick={() => setFilterPriority('urgent')}
          className={`p-4 rounded-2xl border-2 cursor-pointer transition ${
            filterPriority === 'urgent'
              ? 'border-amber-600 bg-amber-50 text-amber-950 shadow-md'
              : 'border-amber-200 bg-amber-50/50 hover:bg-amber-50 text-amber-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Urgent Priority</span>
            <Activity className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-black mt-1 font-mono text-amber-600">{String(urgentCount).padStart(2, '0')}</div>
          <div className="text-[11px] text-amber-700/80 mt-1">Expedited queue slot</div>
        </div>

        {/* Normal */}
        <div
          onClick={() => setFilterPriority('normal')}
          className={`p-4 rounded-2xl border-2 cursor-pointer transition ${
            filterPriority === 'normal'
              ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-md'
              : 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Normal Routine</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black mt-1 font-mono text-emerald-600">{String(normalCount).padStart(2, '0')}</div>
          <div className="text-[11px] text-emerald-700/80 mt-1">Standard OPD order</div>
        </div>

        {/* Total Waiting */}
        <div
          onClick={() => setFilterPriority('all')}
          className={`p-4 rounded-2xl border-2 cursor-pointer transition ${
            filterPriority === 'all'
              ? 'border-slate-800 bg-slate-900 text-white shadow-md'
              : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">Total in Queue</span>
            <Users className="w-4 h-4" />
          </div>
          <div className="text-3xl font-black mt-1 font-mono">{String(queue.length).padStart(2, '0')}</div>
          <div className="text-[11px] opacity-80 mt-1">{waitingCount} currently waiting</div>
        </div>
      </div>

      {/* Dynamic Clinical Priority Reorder Notice Banner (Requirement 9) */}
      {priorityUpdatedAlert && (
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-4 rounded-2xl shadow-lg border-2 border-emerald-400 flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-2.5">
            <ArrowUpDown className="w-5 h-5 text-amber-300" />
            <span className="text-xs sm:text-sm font-black">
              {priorityUpdatedAlert}
            </span>
          </div>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
            Clinician Controlled
          </span>
        </div>
      )}

      {/* DYNAMIC CLINICAL PRIORITY QUEUE TABLE (Requirement 9 & 10) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900">Dynamic Clinical Priority Queue</h2>
              <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-300">
                Key SIH Innovation
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Patients are dynamically sequenced by clinical triage status assessed by authorized medical personnel.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterPriority('all')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                filterPriority === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({queue.length})
            </button>
            <button
              onClick={() => setFilterPriority('critical')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                filterPriority === 'critical' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100'
              }`}
            >
              Critical ({criticalCount})
            </button>
          </div>
        </div>

        {/* Priority Queue Explanation Callout */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-slate-700">
          <Sparkles className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
          <span>
            <strong>Clinician Queue Control:</strong> When a doctor or triage nurse upgrades patient urgency (e.g. Patient B from Normal to Critical), the queue immediately re-sequences them above routine tokens (<code>Critical → Urgent → Normal</code>). Queue priority is governed by authorized doctors, not autonomous AI.
          </span>
        </div>

        {/* Patients Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-black uppercase text-slate-400">
                <th className="py-3 px-3">Token</th>
                <th className="py-3 px-3">Patient</th>
                <th className="py-3 px-3">Age / Gender</th>
                <th className="py-3 px-3">Clinical Priority</th>
                <th className="py-3 px-3">Reason / Presentation</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Clinical Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredQueue.map((item) => (
                <tr
                  key={item.id}
                  className={`transition-all ${
                    item.status === 'in_consultation'
                      ? 'bg-teal-50/70 font-semibold'
                      : item.priority === 'critical'
                      ? 'bg-red-50/40 hover:bg-red-50/70'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="py-3 px-3 font-mono font-black text-slate-900 text-sm">
                    {item.tokenNumber}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-extrabold text-slate-900">{item.patientName}</div>
                    {item.updatedByClinicalStaff && (
                      <span className="text-[10px] text-emerald-700 font-semibold">Priority updated ✓</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    {item.age} yrs • {item.gender}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
                      item.priority === 'critical'
                        ? 'bg-red-600 text-white animate-pulse'
                        : item.priority === 'urgent'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {item.priority === 'critical' && '● '}
                      {item.priority}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 max-w-xs truncate" title={item.reason}>
                    {item.reason}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.status === 'in_consultation'
                        ? 'bg-teal-700 text-white'
                        : item.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {item.status === 'in_consultation' ? 'In Consultation' : item.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Priority Update Button */}
                      <button
                        onClick={() => handleQuickPriorityUpgrade(item)}
                        title="Clinically upgrade queue priority"
                        className="p-1.5 rounded-lg border border-slate-200 hover:border-amber-500 text-amber-700 bg-amber-50 hover:bg-amber-100 transition text-[11px] font-bold flex items-center gap-1"
                      >
                        <ArrowUpDown className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Update Priority</span>
                      </button>

                      {/* Start Consultation */}
                      <button
                        onClick={() => onOpenConsultation(item)}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-lg shadow-sm transition flex items-center gap-1"
                      >
                        <span>Open Patient</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CLINICAL PRIORITY AUDIT TRAIL (Requirement 11) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-700" />
            <h3 className="font-black text-slate-900 text-sm sm:text-base">
              Clinical Priority Override Audit Trail
            </h3>
          </div>
          <span className="text-[10px] uppercase font-bold text-slate-400">
            Immutable Clinician Log
          </span>
        </div>

        <p className="text-xs text-slate-500">
          Statutory compliance: Demonstrates that all dynamic queue priority re-orderings are authorized by certified medical professionals and not autonomously decided by algorithmic models.
        </p>

        <div className="space-y-2 pt-1">
          {auditLogs.slice(0, 4).map((log) => (
            <div
              key={log.id}
              className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <strong className="text-slate-900 font-extrabold">{log.patientName}</strong>
                  <span className="font-mono text-slate-500 text-[11px]">({log.tokenNumber})</span>
                  <span className="text-slate-400">•</span>
                  <span className="uppercase text-[10px] font-bold text-slate-500">{log.oldPriority}</span>
                  <span className="text-amber-600 font-bold">→</span>
                  <span className="uppercase text-[10px] font-extrabold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                    {log.newPriority}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 italic">"{log.reason}"</div>
              </div>

              <div className="text-right text-[11px] text-slate-400 shrink-0">
                <div className="font-semibold text-slate-700">{log.clinicianName}</div>
                <div>{log.timestamp}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
