export interface ITip {
  id: string;
  title: string;
  summary: string; // <= 60 words, 6th-grade level
  category: 'WIFI_SAFETY' | 'PHISHING_AWARENESS' | 'QR_HYGIENE' | 'PASSWORD_SECURITY' | 'APP_PERMISSIONS' | 'DEVICE_CARE';
  actionText?: string;
  readingLevelGrade: number;
  published: boolean;
  createdAt: Date;
}

export const TipCollection = 'cyber_tips';
