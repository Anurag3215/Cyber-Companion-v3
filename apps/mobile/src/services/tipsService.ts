import { Storage } from '../storage/StorageAdapter';

export interface CyberTipItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  readingLevelGrade: number;
}

const FALLBACK_TIPS: CyberTipItem[] = [
  {
    id: 'tip-local-1',
    title: 'Recognize Fake Delivery SMS',
    summary:
      'Fraudulent SMS messages claim a parcel is delayed and prompt you to click a link. Official couriers never ask for banking details via SMS.',
    category: 'PHISHING_AWARENESS',
    readingLevelGrade: 5,
  },
  {
    id: 'tip-local-2',
    title: 'Dangers of Open Wi-Fi Networks',
    summary:
      'Open hotspots lack wireless encryption. Anyone in range can use packet-sniffing software to view unencrypted credentials.',
    category: 'WIFI_SAFETY',
    readingLevelGrade: 6,
  },
];

const DAILY_TIP_KEY = '@cyber_daily_tip';

export class TipsService {
  static async getDailyTip(): Promise<CyberTipItem> {
    try {
      const response = await fetch('http://localhost:5000/v1/tips/daily');
      if (response.ok) {
        const tip: CyberTipItem = await response.json();
        await Storage.setItem(DAILY_TIP_KEY, JSON.stringify(tip));
        return tip;
      }
    } catch {
      // Network failed, try local cache
    }

    const cached = await Storage.getItem(DAILY_TIP_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // Fall through
      }
    }

    return FALLBACK_TIPS[0];
  }
}
