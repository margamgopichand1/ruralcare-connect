export interface QueuedAction {
  id: string;
  type: 'visit_request' | 'consultation_draft' | 'prescription_draft';
  payload: any;
  timestamp: string;
  status: 'pending' | 'syncing' | 'synced';
}

const OFFLINE_QUEUE_KEY = 'ruralcare_offline_queue';

export function getOfflineQueue(): QueuedAction[] {
  try {
    const data = localStorage.getItem(OFFLINE_QUEUE_KEY);
    return data ? JSON.parse(data) : [];
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
    timestamp: new Date().toISOString(),
    status: 'pending'
  };

  const queue = getOfflineQueue();
  queue.push(item);
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  return item;
}

export async function processOfflineQueue(onItemSynced?: (item: QueuedAction) => void): Promise<number> {
  const queue = getOfflineQueue();
  if (queue.length === 0) return 0;

  // Simulate remote batch synchronization with mock server
  await new Promise((resolve) => setTimeout(resolve, 1500));

  for (const item of queue) {
    item.status = 'synced';
    if (onItemSynced) onItemSynced(item);
  }

  // Clear synced items
  localStorage.removeItem(OFFLINE_QUEUE_KEY);
  return queue.length;
}
