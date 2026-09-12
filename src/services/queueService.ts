import { QueueItem, QueuePriority } from '../types';
import { mockQueueItems } from '../data/mockData';

const QUEUE_STORAGE_KEY = 'ruralcare_clinical_queue';

// Clinical priority order weights (Critical highest priority)
const PRIORITY_WEIGHTS: Record<QueuePriority, number> = {
  critical: 3,
  urgent: 2,
  normal: 1
};

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
 * Clinician-controlled priority update.
 * Controlled by authorized healthcare staff, not autonomous AI.
 */
export function updatePatientClinicalPriority(
  queueId: string,
  newPriority: QueuePriority,
  clinicianName: string,
  notes?: string
): QueueItem[] {
  const current = getQueueItems();
  const updated = current.map((item) => {
    if (item.id === queueId) {
      return {
        ...item,
        priority: newPriority,
        updatedByClinicalStaff: true,
        notes: notes || `Clinical priority updated to ${newPriority.toUpperCase()} by ${clinicianName}`
      };
    }
    return item;
  });

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
