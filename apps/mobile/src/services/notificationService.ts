import { Storage } from '../storage/StorageAdapter';

export type NotificationCategory = 'dailyTips' | 'threatAlerts' | 'securityCheckups' | 'scoreDrops';

export interface QuietHoursConfig {
  enabled: boolean;
  startHour: number; // 0-23
  startMinute: number; // 0-59
  endHour: number; // 0-23
  endMinute: number; // 0-59
  allowHighSeverityOverride: boolean;
}

export interface NotificationPreferences {
  enabled: boolean;
  categories: Record<NotificationCategory, boolean>;
  quietHours: QuietHoursConfig;
}

export interface NotificationPayload {
  id: string;
  category: NotificationCategory;
  title: string;
  body: string;
  isCritical?: boolean;
  scheduledTime?: number; // epoch ms
}

export type PrivacyMinimalEventType =
  | 'tip_viewed'
  | 'tip_shared'
  | 'scan_performed'
  | 'threat_blocked'
  | 'notification_delivered'
  | 'notification_suppressed_quiet_hours'
  | 'notification_suppressed_disabled';

export interface PrivacyMinimalEvent {
  type: PrivacyMinimalEventType;
  timestamp?: number;
}

export const DEFAULT_NOTIFICATION_PREFS: NotificationPreferences = {
  enabled: true,
  categories: {
    dailyTips: true,
    threatAlerts: true,
    securityCheckups: true,
    scoreDrops: true,
  },
  quietHours: {
    enabled: true,
    startHour: 22,
    startMinute: 0,
    endHour: 8,
    endMinute: 0,
    allowHighSeverityOverride: true,
  },
};

const PREFS_KEY = 'cyber_companion_notification_prefs';
const ANALYTICS_KEY = 'cyber_companion_minimal_analytics';

export class NotificationService {
  private prefs: NotificationPreferences = { ...DEFAULT_NOTIFICATION_PREFS };
  private initialized = false;
  private eventCounts: Record<string, number> = {};

  async init(): Promise<void> {
    if (this.initialized) return;
    try {
      const stored = await Storage.getItem(PREFS_KEY);
      if (stored) {
        this.prefs = { ...DEFAULT_NOTIFICATION_PREFS, ...JSON.parse(stored) };
      }
      const storedEvents = await Storage.getItem(ANALYTICS_KEY);
      if (storedEvents) {
        this.eventCounts = JSON.parse(storedEvents);
      }
    } catch {
      this.prefs = { ...DEFAULT_NOTIFICATION_PREFS };
    }
    this.initialized = true;
  }

  async getPreferences(): Promise<NotificationPreferences> {
    await this.init();
    return { ...this.prefs };
  }

  async savePreferences(prefs: NotificationPreferences): Promise<void> {
    this.prefs = { ...prefs };
    await Storage.setItem(PREFS_KEY, JSON.stringify(this.prefs));
  }

  isQuietHours(now: Date = new Date()): boolean {
    const qh = this.prefs.quietHours;
    if (!qh.enabled) return false;

    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const startMinutes = qh.startHour * 60 + qh.startMinute;
    const endMinutes = qh.endHour * 60 + qh.endMinute;

    if (startMinutes > endMinutes) {
      // Overnight range, e.g. 22:00 -> 08:00
      return currentMinutes >= startMinutes || currentMinutes < endMinutes;
    } else {
      // Same-day range, e.g. 13:00 -> 14:00
      return currentMinutes >= startMinutes && currentMinutes < endMinutes;
    }
  }

  shouldDeliverNotification(
    category: NotificationCategory,
    isCritical = false,
    now: Date = new Date()
  ): boolean {
    if (!this.prefs.enabled) {
      this.logPrivacyMinimalEvent({ type: 'notification_suppressed_disabled' });
      return false;
    }

    if (!this.prefs.categories[category]) {
      this.logPrivacyMinimalEvent({ type: 'notification_suppressed_disabled' });
      return false;
    }

    if (this.isQuietHours(now)) {
      if (isCritical && this.prefs.quietHours.allowHighSeverityOverride) {
        return true;
      }
      this.logPrivacyMinimalEvent({ type: 'notification_suppressed_quiet_hours' });
      return false;
    }

    return true;
  }

  async scheduleNotification(payload: NotificationPayload, now: Date = new Date()): Promise<boolean> {
    await this.init();
    const canDeliver = this.shouldDeliverNotification(payload.category, payload.isCritical, now);
    if (!canDeliver) {
      return false;
    }

    // Record delivery in privacy-minimal counter (strictly anonymized, aggregate count only)
    this.logPrivacyMinimalEvent({ type: 'notification_delivered' });
    return true;
  }

  logPrivacyMinimalEvent(event: PrivacyMinimalEvent): void {
    // Zero PII: strictly tally known coarse event types
    this.eventCounts[event.type] = (this.eventCounts[event.type] || 0) + 1;
    // Persist async without blocking
    Storage.setItem(ANALYTICS_KEY, JSON.stringify(this.eventCounts)).catch(() => {});
  }

  getAggregatedEvents(): Record<string, number> {
    return { ...this.eventCounts };
  }

  async clearAggregatedEvents(): Promise<void> {
    this.eventCounts = {};
    await Storage.removeItem(ANALYTICS_KEY);
  }
}

export const notificationService = new NotificationService();
