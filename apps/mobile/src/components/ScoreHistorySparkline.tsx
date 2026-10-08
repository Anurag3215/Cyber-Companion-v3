import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Tokens } from '../design-system/tokens';

interface ScoreHistorySparklineProps {
  history?: number[]; // e.g. [70, 75, 72, 80, 85, 88]
}

export const ScoreHistorySparkline: React.FC<ScoreHistorySparklineProps> = ({
  history = [65, 72, 70, 78, 82, 88],
}) => {
  const maxScore = 100;
  const minScore = 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>7-Day Score Trajectory</Text>
      <View style={styles.chartArea}>
        {history.map((val, idx) => {
          const heightPercent = Math.max(10, Math.min(100, (val / maxScore) * 100));
          const isLatest = idx === history.length - 1;
          return (
            <View key={idx} style={styles.barCol}>
              <View
                style={[
                  styles.bar,
                  { height: `${heightPercent}%` },
                  isLatest && styles.barLatest,
                ]}
              />
              <Text style={[styles.barVal, isLatest && styles.barValLatest]}>{val}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Tokens.colors.dark.surface,
    padding: Tokens.spacing.md,
    borderRadius: Tokens.radii.md,
    marginVertical: Tokens.spacing.sm,
    borderWidth: 1,
    borderColor: Tokens.colors.dark.border,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    color: Tokens.colors.dark.textSecondary,
    marginBottom: Tokens.spacing.md,
    textTransform: 'uppercase',
  },
  chartArea: {
    flexDirection: 'row',
    height: 70,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  barCol: {
    alignItems: 'center',
    width: 28,
    height: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: 14,
    backgroundColor: '#0284C7',
    borderRadius: 4,
  },
  barLatest: {
    backgroundColor: '#10B981',
  },
  barVal: {
    fontSize: 10,
    color: Tokens.colors.dark.textMuted,
    marginTop: 4,
  },
  barValLatest: {
    color: '#10B981',
    fontWeight: '700',
  },
});
