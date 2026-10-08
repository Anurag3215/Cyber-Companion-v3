import { Storage } from '../storage/StorageAdapter';

export interface Badge {
  id: string;
  title: string;
  description: string;
  unlockedAt?: string; // ISO string
  icon: string;
}

export interface GamificationState {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null; // 'YYYY-MM-DD'
  isPaused: boolean; // Ethical feature: user can pause streaks without penalty
  badges: Record<string, Badge>;
  weeklyHistory: {
    weekStarting: string;
    scansCount: number;
    tipsReadCount: number;
    threatsAvoidedCount: number;
  };
}

export const INITIAL_BADGES: Record<string, Badge> = {
  FIRST_SCAN: {
    id: 'FIRST_SCAN',
    title: 'First Guard',
    description: 'Completed your first threat scan.',
    icon: 'shield-check',
  },
  WIFI_GUARDIAN: {
    id: 'WIFI_GUARDIAN',
    title: 'Wi-Fi Guardian',
    description: 'Audited your connected Wi-Fi network.',
    icon: 'wifi',
  },
  PERMISSION_PRUNER: {
    id: 'PERMISSION_PRUNER',
    title: 'Permission Pruner',
    description: 'Reviewed application permissions on device.',
    icon: 'lock',
  },
  CYBER_AWARE_7: {
    id: 'CYBER_AWARE_7',
    title: 'Awareness Sentinel',
    description: 'Maintained a 7-day cybersecurity awareness streak.',
    icon: 'flame',
  },
  FORTRESS_BUILDER: {
    id: 'FORTRESS_BUILDER',
    title: 'Fortress Builder',
    description: 'Achieved a device security score of 85 or above.',
    icon: 'trophy',
  },
};

const GAMIFICATION_KEY = 'cyber_companion_gamification_state';

export class GamificationService {
  private state: GamificationState = {
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: null,
    isPaused: false,
    badges: { ...INITIAL_BADGES },
    weeklyHistory: {
      weekStarting: new Date().toISOString().slice(0, 10),
      scansCount: 0,
      tipsReadCount: 0,
      threatsAvoidedCount: 0,
    },
  };
  private initialized = false;

  async init(): Promise<void> {
    if (this.initialized) return;
    try {
      const data = await Storage.getItem(GAMIFICATION_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        this.state = {
          ...this.state,
          ...parsed,
          badges: { ...INITIAL_BADGES, ...parsed.badges },
        };
      }
    } catch {
      // Fallback to default state
    }
    this.initialized = true;
  }

  async getState(): Promise<GamificationState> {
    await this.init();
    return { ...this.state };
  }

  async recordActivity(type: 'tip' | 'scan' | 'threat_avoided', date = new Date()): Promise<GamificationState> {
    await this.init();
    const dateStr = date.toISOString().slice(0, 10);

    // Update weekly aggregates
    if (type === 'scan') this.state.weeklyHistory.scansCount += 1;
    if (type === 'tip') this.state.weeklyHistory.tipsReadCount += 1;
    if (type === 'threat_avoided') this.state.weeklyHistory.threatsAvoidedCount += 1;

    // Check streak progression (ethical: no dark pattern guilt, allows pause)
    if (!this.state.isPaused) {
      if (!this.state.lastActiveDate) {
        this.state.currentStreak = 1;
      } else if (this.state.lastActiveDate !== dateStr) {
        const last = new Date(this.state.lastActiveDate);
        const current = new Date(dateStr);
        const diffDays = Math.round((current.getTime() - last.getTime()) / (1000 * 3600 * 24));

        if (diffDays === 1) {
          this.state.currentStreak += 1;
        } else if (diffDays > 1) {
          // Streak restart without punitive messaging
          this.state.currentStreak = 1;
        }
      }
      this.state.lastActiveDate = dateStr;
      if (this.state.currentStreak > this.state.longestStreak) {
        this.state.longestStreak = this.state.currentStreak;
      }
    }

    // Evaluate badge milestones
    if (type === 'scan' && !this.state.badges['FIRST_SCAN']?.unlockedAt) {
      this.unlockBadge('FIRST_SCAN');
    }
    if (this.state.currentStreak >= 7 && !this.state.badges['CYBER_AWARE_7']?.unlockedAt) {
      this.unlockBadge('CYBER_AWARE_7');
    }

    await this.persist();
    return { ...this.state };
  }

  async unlockBadge(badgeId: string): Promise<boolean> {
    await this.init();
    if (this.state.badges[badgeId] && !this.state.badges[badgeId].unlockedAt) {
      this.state.badges[badgeId] = {
        ...this.state.badges[badgeId],
        unlockedAt: new Date().toISOString(),
      };
      await this.persist();
      return true;
    }
    return false;
  }

  async togglePauseStreaks(pause: boolean): Promise<void> {
    await this.init();
    this.state.isPaused = pause;
    await this.persist();
  }

  getWeeklySummary(): {
    weekStarting: string;
    scansCount: number;
    tipsReadCount: number;
    threatsAvoidedCount: number;
    currentStreak: number;
  } {
    return {
      ...this.state.weeklyHistory,
      currentStreak: this.state.currentStreak,
    };
  }

  private async persist(): Promise<void> {
    await Storage.setItem(GAMIFICATION_KEY, JSON.stringify(this.state));
  }
}

export const gamificationService = new GamificationService();
