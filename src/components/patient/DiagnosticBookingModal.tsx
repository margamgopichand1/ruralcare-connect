import React, { useState } from 'react';
import { getDiagnosticTests, getPatientDiagnosticBookings, bookDiagnosticTest, simulateReportGeneration } from '../../services/diagnosticService';
import { DiagnosticTestItem, DiagnosticBooking } from '../../types';
import {
  Activity,
  FileCheck2,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Search,
  Download,
  ShieldCheck,
  Building2,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DiagnosticBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId?: string;
  patientName?: string;
}

export const DiagnosticBookingModal: React.FC<DiagnosticBookingModalProps> = ({
  isOpen,
  onClose,
  patientId = 'pat-1',
  patientName = 'Ramesh Patil'
}) => {
  const [activeTab, setActiveTab] = useState<'search' | 'my_reports'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTest, setSelectedTest] = useState<DiagnosticTestItem | null>(null);
  const [selectedFacility, setSelectedFacility] = useState('PHC Karegaon');
  const [selectedDate, setSelectedDate] = useState('2026-09-15');
  const [selectedSlot, setSelectedSlot] = useState('09:30 AM');
  const [bookings, setBookings] = useState<DiagnosticBooking[]>(() => getPatientDiagnosticBookings(patientId));
  const [viewingReport, setViewingReport] = useState<DiagnosticBooking | null>(null);

  if (!isOpen) return null;

  const tests = getDiagnosticTests().filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBookTest = () => {
    if (!selectedTest) return;

    const newBooking = bookDiagnosticTest({
      patientId,
      patientName,
      testId: selectedTest.id,
      facilityName: selectedFacility,
      date: selectedDate,
      slot: selectedSlot
    });

    setBookings(getPatientDiagnosticBookings(patientId));
    setSelectedTest(null);
    setActiveTab('my_reports');
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  };

  const handleGenerateReportNow = (bookingId: string) => {
    const updated = simulateReportGeneration(bookingId);
    if (updated) {
      setBookings(getPatientDiagnosticBookings(patientId));
      setViewingReport(updated);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-800 to-emerald-900 p-5 sm:p-6 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-xl font-bold p-1 rounded-lg hover:bg-white/10 transition"
          >
            ✕
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold mb-2">
            <Activity className="w-3.5 h-3.5 text-emerald-300" />
            <span>Public Diagnostic Network • NHM Integrated Labs</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Diagnostic Coordination</h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1">
            Book automated pathology tests, imaging, and ECGs at nearby Primary Health Centres and Rural Hospitals.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 shrink-0">
          <button
            onClick={() => setActiveTab('search')}
            className={`pb-3 px-4 text-xs font-extrabold border-b-2 transition ${
              activeTab === 'search'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Available Tests & Booking
          </button>
          <button
            onClick={() => setActiveTab('my_reports')}
            className={`pb-3 px-4 text-xs font-extrabold border-b-2 transition ${
              activeTab === 'my_reports'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            My Reports & Results ({bookings.length})
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {viewingReport ? (
            /* Report Detail Preview */
            <div className="space-y-4 animate-fadeIn">
              <button
                onClick={() => setViewingReport(null)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                ← Back to Reports List
              </button>

              <div className="border-2 border-emerald-500/40 rounded-3xl p-6 bg-slate-50 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                      Govt Public Health Diagnostic Laboratory
                    </span>
                    <h3 className="text-lg font-black text-slate-900">{viewingReport.testName}</h3>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">
                    ✓ Verified by Doctor
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Patient Name</span>
                    <strong className="text-slate-800 font-bold">{viewingReport.patientName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Facility</span>
                    <strong className="text-slate-800 font-bold">{viewingReport.facilityName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Report Date</span>
                    <strong className="text-slate-800 font-bold">{viewingReport.reportDate}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Reviewing Doctor</span>
                    <strong className="text-emerald-700 font-bold">{viewingReport.reviewedByDoctor || 'Dr. Priya Sharma'}</strong>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Diagnostic Findings & Clinical Interpretation:
                  </div>
                  <p className="text-xs text-slate-700 font-mono leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {viewingReport.findingsSummary}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-500">
                    ✓ Automatically synchronized with your longitudinal ABHA record
                  </span>
                  <button
                    onClick={() => alert('Simulated PDF Download: Diagnostic report downloaded to local device.')}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Report (PDF)</span>
                  </button>
                </div>
              </div>
            </div>
          ) : activeTab === 'search' ? (
            /* Search & Booking Tab */
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tests (e.g. CBC, X-Ray, ECG, Ultrasound, HbA1c)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                />
              </div>

              {selectedTest ? (
                /* Schedule Slot Screen */
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-700 uppercase">Selected Diagnostic</span>
                      <h3 className="text-base font-black text-slate-900">{selectedTest.name}</h3>
                    </div>
                    <button
                      onClick={() => setSelectedTest(null)}
                      className="text-xs text-slate-500 hover:text-slate-800 font-bold"
                    >
                      Change Test
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Select Facility:</label>
                      <select
                        value={selectedFacility}
                        onChange={(e) => setSelectedFacility(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800"
                      >
                        {selectedTest.participatingFacilities.map((f) => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Time Slot:</label>
                      <select
                        value={selectedSlot}
                        onChange={(e) => setSelectedSlot(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800"
                      >
                        <option value="09:00 AM">09:00 AM (Fasting Sample)</option>
                        <option value="09:30 AM">09:30 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="02:30 PM">02:30 PM</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleBookTest}
                    className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                  >
                    <span>Confirm Booking at {selectedFacility}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                /* Test Catalog Cards */
                <div className="space-y-3">
                  {tests.map((test) => (
                    <div
                      key={test.id}
                      className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 p-4 transition-all shadow-sm hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-slate-900 text-sm">{test.name}</h4>
                          <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                            {test.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2">{test.description}</p>
                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                          <span className="flex items-center gap-1 font-semibold text-teal-700">
                            <Clock className="w-3 h-3" /> Turnaround: {test.turnaroundTime}
                          </span>
                          <span>•</span>
                          <span>Sample: {test.sampleType}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedTest(test)}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-sm transition shrink-0"
                      >
                        Book Test
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* My Reports Tab */
            <div className="space-y-3">
              {bookings.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No diagnostic bookings recorded yet.
                </div>
              ) : (
                bookings.map((b) => (
                  <div
                    key={b.id}
                    className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-slate-900 text-sm">{b.testName}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          b.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {b.status === 'completed' ? '✓ Report Ready' : 'Sample Processing'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Facility: <strong>{b.facilityName}</strong> • Date: {b.date} ({b.slot})
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {b.status === 'completed' ? (
                        <button
                          onClick={() => setViewingReport(b)}
                          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-sm transition"
                        >
                          View Report
                        </button>
                      ) : (
                        <button
                          onClick={() => handleGenerateReportNow(b.id)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Simulate Lab Results</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
