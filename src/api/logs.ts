import { collection, getDocs, query, orderBy, addDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

export interface LogEntry {
  id: string;
  action: string;
  categoryId?: string;
  adminId: string;
  timestamp: { seconds: number; nanoseconds: number };
}

// Fetch once (non-live)
export async function fetchLogs(): Promise<LogEntry[]> {
  const q = query(collection(db, 'logs'), orderBy('timestamp', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<LogEntry, 'id'>),
  }));
}

// Firestore write helper
export async function logAction(action: string, adminId: string, extraData: any = {}) {
  await addDoc(collection(db, 'logs'), {
    action,
    adminId,
    timestamp: new Date(),
    ...extraData,
  });
}

// Real-time listener
export function subscribeToLogs(callback: (logs: LogEntry[]) => void) {
  const q = query(collection(db, 'logs'), orderBy('timestamp', 'desc'));

  return onSnapshot(q, (snapshot) => {
    const logs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<LogEntry, 'id'>),
    }));
    callback(logs);
  });
}
