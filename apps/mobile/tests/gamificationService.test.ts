import { GamificationService, INITIAL_BADGES } from '../src/services/gamificationService';

describe('GamificationService', () => {
  let service: GamificationService;

  beforeEach(async () => {
    service = new GamificationService();
    await service.init();
  });

  test('initial state has 0 streak and all badges locked', async () => {
    const state = await service.getState();
    expect(state.currentStreak).toBe(0);
    expect(state.isPaused).toBe(false);
    expect(state.badges['FIRST_SCAN']?.unlockedAt).toBeUndefined();
  });

  test('recording a scan increments scan count and unlocks FIRST_SCAN badge', async () => {
    const state = await service.recordActivity('scan', new Date('2026-10-09T10:00:00'));
    expect(state.weeklyHistory.scansCount).toBe(1);
    expect(state.currentStreak).toBe(1);
    expect(state.badges['FIRST_SCAN']?.unlockedAt).toBeDefined();
  });

  test('streak advances on consecutive days', async () => {
    await service.recordActivity('tip', new Date('2026-10-08T10:00:00'));
    const state2 = await service.recordActivity('tip', new Date('2026-10-09T10:00:00'));
    expect(state2.currentStreak).toBe(2);
  });

  test('streak does not penalize or increment when paused', async () => {
    await service.recordActivity('tip', new Date('2026-10-08T10:00:00'));
    await service.togglePauseStreaks(true);
    const state = await service.recordActivity('tip', new Date('2026-10-15T10:00:00'));
    // Paused state preserves streak rather than resetting or penalizing
    expect(state.currentStreak).toBe(1);
    expect(state.isPaused).toBe(true);
  });

  test('weekly summary aggregates stats correctly', async () => {
    await service.recordActivity('scan');
    await service.recordActivity('scan');
    await service.recordActivity('threat_avoided');
    await service.recordActivity('tip');

    const summary = service.getWeeklySummary();
    expect(summary.scansCount).toBe(2);
    expect(summary.threatsAvoidedCount).toBe(1);
    expect(summary.tipsReadCount).toBe(1);
  });
});
