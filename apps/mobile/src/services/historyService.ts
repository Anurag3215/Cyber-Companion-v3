import { Storage } from '../storage/StorageAdapter';

export interface HistoryRecord {
  id: string;
  type: 'link' | 'wifi' | 'qr' | 'app';
  icon: string;
  title: string;
  subtext: string;
  time: string;
  verdict: 'dangerous' | 'warning' | 'safe';
  verdictLabel: string;
  details?: {
    threatTitle?: string;
    consensusText?: string;
    explanation?: string;
    findings?: string[];
  };
}

const STORAGE_KEY_HISTORY = '@cyber_companion_history_records_v1';

export async function getHistoryRecords(): Promise<HistoryRecord[]> {
  try {
    const raw = await Storage.getItem(STORAGE_KEY_HISTORY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function addHistoryRecord(record: Omit<HistoryRecord, 'id' | 'time'>): Promise<HistoryRecord[]> {
  try {
    const existing = await getHistoryRecords();
    const newRecord: HistoryRecord = {
      ...record,
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      time: 'Just now',
    };
    // Keep maximum 40 most recent scans
    const updated = [newRecord, ...existing.slice(0, 39)];
    await Storage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export async function clearAllHistoryRecords(): Promise<void> {
  try {
    await Storage.removeItem(STORAGE_KEY_HISTORY);
  } catch {}
}
