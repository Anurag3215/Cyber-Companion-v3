import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { GamificationState, INITIAL_BADGES } from '../services/gamificationService';

interface BadgesAndStreaksViewProps {
  state: GamificationState;
  onTogglePause?: (paused: boolean) => void;
  isDark?: boolean;
}

export const BadgesAndStreaksView: React.FC<BadgesAndStreaksViewProps> = ({
  state,
  onTogglePause,
  isDark = false,
}) => {
  const containerBg = isDark ? '#161B22' : '#FFFFFF';
  const cardBg = isDark ? '#21262D' : '#F6F8FA';
  const textColor = isDark ? '#F0F6FC' : '#1F2328';
  const subtextColor = isDark ? '#8B949E' : '#656D76';
  const borderCol = isDark ? '#30363D' : '#D0D7DE';

  return (
    <ScrollView style={[styles.container, { backgroundColor: containerBg }]}>
      {/* Streak Header */}
      <View style={[styles.streakCard, { backgroundColor: cardBg, borderColor: borderCol }]}>
        <View style={styles.streakHeader}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <View>
            <Text style={[styles.streakNumber, { color: textColor }]}>
              {state.currentStreak} Day{state.currentStreak === 1 ? '' : 's'}
            </Text>
            <Text style={[styles.streakSub, { color: subtextColor }]}>
              {state.isPaused ? 'Streak paused (no penalties)' : 'Active awareness streak'}
            </Text>
          </View>
        </View>

        {onTogglePause && (
          <TouchableOpacity
            style={[styles.pauseBtn, { borderColor: borderCol }]}
            onPress={() => onTogglePause(!state.isPaused)}
            accessibilityRole="button"
            accessibilityLabel={state.isPaused ? 'Resume streak tracking' : 'Pause streak tracking'}
          >
            <Text style={[styles.pauseBtnText, { color: textColor }]}>
              {state.isPaused ? 'Resume Streak' : 'Pause Streak'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Weekly Summary */}
      <View style={[styles.sectionCard, { backgroundColor: cardBg, borderColor: borderCol }]}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Weekly Summary</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.metricBox}>
            <Text style={styles.metricVal}>{state.weeklyHistory.scansCount}</Text>
            <Text style={[styles.metricLabel, { color: subtextColor }]}>Scans Run</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricVal}>{state.weeklyHistory.threatsAvoidedCount}</Text>
            <Text style={[styles.metricLabel, { color: subtextColor }]}>Threats Avoided</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricVal}>{state.weeklyHistory.tipsReadCount}</Text>
            <Text style={[styles.metricLabel, { color: subtextColor }]}>Tips Read</Text>
          </View>
        </View>
      </View>

      {/* Badges Achievements */}
      <View style={[styles.sectionCard, { backgroundColor: cardBg, borderColor: borderCol }]}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Achievements</Text>
        {Object.values(state.badges || INITIAL_BADGES).map((b) => {
          const isUnlocked = Boolean(b.unlockedAt);
          return (
            <View
              key={b.id}
              style={[
                styles.badgeRow,
                {
                  opacity: isUnlocked ? 1.0 : 0.5,
                  borderBottomColor: borderCol,
                },
              ]}
              accessibilityRole="text"
              accessibilityLabel={`${b.title}: ${b.description}. ${isUnlocked ? 'Unlocked' : 'Locked'}`}
            >
              <Text style={styles.badgeIcon}>{isUnlocked ? '🏆' : '🔒'}</Text>
              <View style={styles.badgeTextCol}>
                <Text style={[styles.badgeTitle, { color: textColor }]}>{b.title}</Text>
                <Text style={[styles.badgeDesc, { color: subtextColor }]}>{b.description}</Text>
                {isUnlocked && (
                  <Text style={styles.unlockedDate}>
                    Unlocked {new Date(b.unlockedAt!).toLocaleDateString()}
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  streakCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  streakEmoji: {
    fontSize: 32,
  },
  streakNumber: {
    fontSize: 20,
    fontWeight: '700',
  },
  streakSub: {
    fontSize: 12,
  },
  pauseBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  pauseBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sectionCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metricBox: {
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0969DA',
  },
  metricLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 12,
  },
  badgeIcon: {
    fontSize: 24,
  },
  badgeTextCol: {
    flex: 1,
  },
  badgeTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  badgeDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  unlockedDate: {
    fontSize: 11,
    color: '#1A7F37',
    marginTop: 4,
    fontWeight: '500',
  },
});
