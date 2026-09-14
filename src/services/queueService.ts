import { QueueItem, QueuePriority } from '../types';
import { mockQueueItems } from '../data/mockData';

const QUEUE_STORAGE_KEY = 'ruralcare_clinical_queue';
const QUEUE_AUDIT_STORAGE_KEY = 'ruralcare_queue_audit_logs';

// Clinical priority order weights (Critical highest priority)
const PRIORITY_WEIGHTS: Record<QueuePriority, number> = {
  critical: 3,
  urgent: 2,
  normal: 1
};

export interface QueuePriorityAuditLog {
  id: string;
  queueId: string;
  patientName: string;
  tokenNumber: string;
  oldPriority: QueuePriority;
  newPriority: QueuePriority;
  clinicianName: string;
  timestamp: string;
  reason: string;
}

export function getQueuePriorityAuditLogs(): QueuePriorityAuditLog[] {
  try {
    const data = localStorage.getItem(QUEUE_AUDIT_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading queue audit logs', e);
  }
  return [
    {
      id: 'audit-init-1',
      queueId: 'q-2',
      patientName: 'Devidas Shinde',
      tokenNumber: 'A-022',
      oldPriority: 'normal',
      newPriority: 'urgent',
      clinicianName: 'Dr. Priya Sharma (Medical Officer)',
      timestamp: '14 Sep 2026, 09:15 AM',
      reason: 'Clinical assessment: Severe dyspnea and wheezing in chronic COPD patient'
    }
  ];
}

export function getQueueItems(): QueueItem[] {
  try {
    const data = localStorage.getItem(QUEUE_STORAGE_KEY);
    if (data) {
      const items: QueueItem[] = JSON.parse(data);
      return sortQueueByClinicalPriority(items);
    }
  } catch (e) {
    console.error('Error reading queue', e);
  }
  const defaultItems = sortQueueByClinicalPriority([...mockQueueItems]);
  saveQueueItems(defaultItems);
  return defaultItems;
}

export function saveQueueItems(items: QueueItem[]) {
  try {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('ruralcare_queue_updated'));
  } catch (e) {
    console.error('Error saving queue', e);
  }
}

/**
 * Key Innovation: Dynamic Clinical Priority Queue
 * Sorts patients strictly by Clinical Urgency assessed by authorized doctors/staff,
 * NOT simply First-Come-First-Served.
 */
export function sortQueueByClinicalPriority(items: QueueItem[]): QueueItem[] {
  return [...items].sort((a, b) => {
    // In-consultation always stays at the top
    if (a.status === 'in_consultation' && b.status !== 'in_consultation') return -1;
    if (b.status === 'in_consultation' && a.status !== 'in_consultation') return 1;

    // Compare priority weights
    const weightDiff = PRIORITY_WEIGHTS[b.priority] - PRIORITY_WEIGHTS[a.priority];
    if (weightDiff !== 0) return weightDiff;

    // Secondary sort: Token number / Arrival order
    return a.tokenNumber.localeCompare(b.tokenNumber);
  });
}

/**
 * Clinician-controlled priority update (Requirement 11).
 * Controlled by authorized healthcare staff, not autonomous AI.
 * Records a full verifiable audit trail with clinician identity and justification.
 */
export function updatePatientClinicalPriority(
  queueId: string,
  newPriority: QueuePriority,
  clinicianName: string,
  notes?: string
): QueueItem[] {
  const current = getQueueItems();
  let auditEntry: QueuePriorityAuditLog | null = null;

  const updated = current.map((item) => {
    if (item.id === queueId) {
      auditEntry = {
        id: `audit-${Date.now()}`,
        queueId: item.id,
        patientName: item.patientName,
        tokenNumber: item.tokenNumber,
        oldPriority: item.priority,
        newPriority,
        clinicianName,
        timestamp: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
        reason: notes || `Clinical triage upgrade based on doctor examination.`
      };

      return {
        ...item,
        priority: newPriority,
        updatedByClinicalStaff: true,
        notes: notes || `Clinical priority updated to ${newPriority.toUpperCase()} by ${clinicianName}`
      };
    }
    return item;
  });

  if (auditEntry) {
    try {
      const logs = getQueuePriorityAuditLogs();
      logs.unshift(auditEntry);
      localStorage.setItem(QUEUE_AUDIT_STORAGE_KEY, JSON.stringify(logs));
    } catch (e) {
      console.error('Error saving queue audit log', e);
    }
  }

  const sorted = sortQueueByClinicalPriority(updated);
  saveQueueItems(sorted);
  return sorted;
}

export function updateQueueStatus(
  queueId: string,
  status: 'waiting' | 'in_consultation' | 'completed' | 'referred'
): QueueItem[] {
  const current = getQueueItems();
  const updated = current.map((item) => {
    if (item.id === queueId) {
      return { ...item, status };
    }
    return item;
  });
  const sorted = sortQueueByClinicalPriority(updated);
  saveQueueItems(sorted);
  return sorted;
}

export function addNewPatientToQueue(
  patientId: string,
  patientName: string,
  age: number,
  gender: 'Male' | 'Female' | 'Other',
  reason: string,
  priority: QueuePriority = 'normal'
): QueueItem {
  const current = getQueueItems();
  const nextNumber = current.length + 28;
  const tokenNumber = `A-0${nextNumber}`;

  const newItem: QueueItem = {
    id: `q-${Date.now()}`,
    tokenNumber,
    patientId,
    patientName,
    age,
    gender,
    reason,
    priority,
    status: 'waiting',
    estimatedWaitMinutes: priority === 'critical' ? 5 : priority === 'urgent' ? 15 : 35,
    arrivedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    notes: 'Token issued via RuralCare Connect'
  };

  const updated = [newItem, ...current];
  const sorted = sortQueueByClinicalPriority(updated);
  saveQueueItems(sorted);
  return newItem;
}
