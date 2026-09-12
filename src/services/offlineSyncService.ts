export interface QueuedAction {
  id: string;
  type: 'visit_request' | 'consultation_draft' | 'prescription_draft' | 'patient_reg' | 'clinical_note';
  payload: any;
  timestamp: string;
  status: 'pending' | 'syncing' | 'synced';
}

const OFFLINE_QUEUE_KEY = 'ruralcare_offline_queue';

const defaultSeedQueue: QueuedAction[] = [
  {
    id: 'queue-seed-1',
    type: 'patient_reg',
    payload: { name: 'Kisan Shinde', village: 'Karegaon Wasti', age: 62, condition: 'Joint Arthritis' },
    timestamp: '15 min ago',
    status: 'pending'
  },
  {
    id: 'queue-seed-2',
    type: 'clinical_note',
    payload: { patientName: 'Pooja Jadhav', note: 'Hb 8.1 g/dL checked by ASHA. Advised iron supplements.' },
    timestamp: '25 min ago',
    status: 'pending'
  },
  {
    id: 'queue-seed-3',
    type: 'patient_reg',
    payload: { name: 'Balasaheb Gaikwad', village: 'Pabal Phata', age: 50, condition: 'Hypertension Screening' },
    timestamp: '40 min ago',
    status: 'pending'
  }
];

export function getOfflineQueue(): QueuedAction[] {
  try {
    const data = localStorage.getItem(OFFLINE_QUEUE_KEY);
    if (!data) {
      localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(defaultSeedQueue));
      return defaultSeedQueue;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error reading offline queue', e);
    return [];
  }
}

export function queueOfflineAction(type: QueuedAction['type'], payload: any): QueuedAction {
  const item: QueuedAction = {
    id: `queue-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    type,
    payload,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'pending'
  };

  const queue = getOfflineQueue();
  queue.push(item);
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  window.dispatchEvent(new CustomEvent('ruralcare_offline_queue_changed'));
  return item;
}

export async function processOfflineQueue(onItemSynced?: (item: QueuedAction) => void): Promise<number> {
  const queue = getOfflineQueue();
  if (queue.length === 0) return 0;

  // Simulate remote batch synchronization with mock public health server
  await new Promise((resolve) => setTimeout(resolve, 1500));

  for (const item of queue) {
    item.status = 'synced';
    if (onItemSynced) onItemSynced(item);
  }

  // Clear synced items
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify([]));
  window.dispatchEvent(new CustomEvent('ruralcare_offline_queue_changed'));
  return queue.length;
}
