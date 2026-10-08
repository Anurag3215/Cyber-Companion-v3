import { NotificationService, DEFAULT_NOTIFICATION_PREFS } from '../src/services/notificationService';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(async () => {
    service = new NotificationService();
    await service.init();
    await service.clearAggregatedEvents();
  });

  test('default preferences enable all categories with quiet hours 22:00 to 08:00', async () => {
    const prefs = await service.getPreferences();
    expect(prefs.enabled).toBe(true);
    expect(prefs.categories.dailyTips).toBe(true);
    expect(prefs.categories.threatAlerts).toBe(true);
    expect(prefs.quietHours.enabled).toBe(true);
    expect(prefs.quietHours.startHour).toBe(22);
    expect(prefs.quietHours.endHour).toBe(8);
  });

  test('correctly identifies overnight quiet hours', () => {
    const lateNight = new Date('2026-10-09T23:30:00');
    const earlyMorning = new Date('2026-10-09T03:15:00');
    const afternoon = new Date('2026-10-09T14:00:00');

    expect(service.isQuietHours(lateNight)).toBe(true);
    expect(service.isQuietHours(earlyMorning)).toBe(true);
    expect(service.isQuietHours(afternoon)).toBe(false);
  });

  test('suppresses daily tips during quiet hours', () => {
    const midnight = new Date('2026-10-09T00:30:00');
    const shouldDeliver = service.shouldDeliverNotification('dailyTips', false, midnight);
    expect(shouldDeliver).toBe(false);

    const counts = service.getAggregatedEvents();
    expect(counts['notification_suppressed_quiet_hours']).toBe(1);
  });

  test('allows critical threat alerts during quiet hours when override is enabled', () => {
    const midnight = new Date('2026-10-09T00:30:00');
    const shouldDeliver = service.shouldDeliverNotification('threatAlerts', true, midnight);
    expect(shouldDeliver).toBe(true);
  });

  test('respects disabled category toggles', async () => {
    await service.savePreferences({
      ...DEFAULT_NOTIFICATION_PREFS,
      categories: {
        ...DEFAULT_NOTIFICATION_PREFS.categories,
        dailyTips: false,
      },
    });

    const afternoon = new Date('2026-10-09T14:00:00');
    expect(service.shouldDeliverNotification('dailyTips', false, afternoon)).toBe(false);
    expect(service.shouldDeliverNotification('threatAlerts', false, afternoon)).toBe(true);
  });

  test('privacy-minimal analytics tallies coarse counts without PII', () => {
    service.logPrivacyMinimalEvent({ type: 'tip_viewed' });
    service.logPrivacyMinimalEvent({ type: 'tip_viewed' });
    service.logPrivacyMinimalEvent({ type: 'scan_performed' });

    const counts = service.getAggregatedEvents();
    expect(counts['tip_viewed']).toBe(2);
    expect(counts['scan_performed']).toBe(1);
    expect(Object.keys(counts)).not.toContain('user');
    expect(Object.keys(counts)).not.toContain('url');
  });
});
