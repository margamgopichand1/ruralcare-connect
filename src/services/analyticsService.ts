import { DistrictMetrics } from '../types';
import { initialDistrictMetrics } from '../data/mockData';

const METRICS_STORAGE_KEY = 'ruralcare_district_metrics';

export function getDistrictMetrics(): DistrictMetrics {
  try {
    const data = localStorage.getItem(METRICS_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to get district metrics', e);
  }
  return initialDistrictMetrics;
}

export function recordNewVisitCompleted(): DistrictMetrics {
  const current = getDistrictMetrics();
  current.visitsToday += 1;
  current.totalPatients += 1;
  current.doctorUtilizationRate = Math.min(96, current.doctorUtilizationRate + 1);

  // Update requests trend for current hour
  if (current.requestsTrend.length > 0) {
    const last = current.requestsTrend[current.requestsTrend.length - 1];
    last.requests += 1;
  }

  try {
    localStorage.setItem(METRICS_STORAGE_KEY, JSON.stringify(current));
  } catch (e) {
    console.error('Failed to update metrics', e);
  }

  return current;
}

export function recordNewEmergencyTriggered(): DistrictMetrics {
  const current = getDistrictMetrics();
  current.emergencyCases += 1;

  // Add critical alert
  current.criticalAlerts.unshift({
    id: `alt-${Date.now()}`,
    type: 'emergency',
    title: 'Emergency 108 Alert Dispatched',
    description: 'Active emergency escalation in Shirur block; 108 ambulance en route.',
    severity: 'critical',
    time: 'Just now'
  });

  try {
    localStorage.setItem(METRICS_STORAGE_KEY, JSON.stringify(current));
  } catch (e) {
    console.error('Failed to update metrics', e);
  }

  return current;
}
