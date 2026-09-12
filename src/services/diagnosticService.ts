import { DiagnosticBooking, DiagnosticTestItem } from '../types';
import { mockDiagnosticTests, mockDiagnosticBookings } from '../data/mockData';

const DIAGNOSTICS_STORAGE_KEY = 'ruralcare_diagnostic_bookings';

export function getDiagnosticTests(): DiagnosticTestItem[] {
  return mockDiagnosticTests;
}

export function getPatientDiagnosticBookings(patientId: string): DiagnosticBooking[] {
  try {
    const data = localStorage.getItem(DIAGNOSTICS_STORAGE_KEY);
    if (data) {
      const stored: DiagnosticBooking[] = JSON.parse(data);
      const combined = [...stored, ...mockDiagnosticBookings.filter((d) => !stored.some((s) => s.id === d.id))];
      return combined.filter((b) => b.patientId === patientId);
    }
  } catch (e) {
    console.error('Error reading diagnostic bookings', e);
  }
  return mockDiagnosticBookings.filter((b) => b.patientId === patientId);
}

export function bookDiagnosticTest(params: {
  patientId: string;
  patientName: string;
  testId: string;
  facilityName: string;
  date: string;
  slot: string;
}): DiagnosticBooking {
  const testInfo = mockDiagnosticTests.find((t) => t.id === params.testId) || mockDiagnosticTests[0];

  const newBooking: DiagnosticBooking = {
    id: `diag-book-${Date.now()}`,
    patientId: params.patientId,
    patientName: params.patientName,
    testId: testInfo.id,
    testName: testInfo.name,
    facilityId: 'fac-1',
    facilityName: params.facilityName,
    facilityDistanceKm: 1.2,
    date: params.date,
    slot: params.slot,
    status: 'scheduled'
  };

  try {
    const all = getPatientDiagnosticBookings(params.patientId);
    all.unshift(newBooking);
    localStorage.setItem(DIAGNOSTICS_STORAGE_KEY, JSON.stringify(all));
  } catch (e) {
    console.error('Error saving diagnostic booking', e);
  }

  return newBooking;
}

export function simulateReportGeneration(bookingId: string): DiagnosticBooking | null {
  try {
    const raw = localStorage.getItem(DIAGNOSTICS_STORAGE_KEY);
    let bookings: DiagnosticBooking[] = raw ? JSON.parse(raw) : [...mockDiagnosticBookings];

    let target = bookings.find((b) => b.id === bookingId);
    if (!target) {
      target = mockDiagnosticBookings.find((b) => b.id === bookingId);
      if (target) bookings.push(target);
    }

    if (target) {
      target.status = 'completed';
      target.reportDate = new Date().toLocaleString();
      target.findingsSummary = 'Diagnostic sample processed by PHC automated analyzer. Vitals and parameters verified within acceptable clinical ranges. Signed by Dr. Priya Sharma.';
      target.reviewedByDoctor = 'Dr. Priya Sharma';
      localStorage.setItem(DIAGNOSTICS_STORAGE_KEY, JSON.stringify(bookings));
      return target;
    }
  } catch (e) {
    console.error('Error simulating report', e);
  }
  return null;
}
