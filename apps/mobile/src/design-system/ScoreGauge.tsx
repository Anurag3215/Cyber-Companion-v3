import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ScoreGaugeProps {
  score?: number; // 0 - 100
  potentialScore?: number; // e.g. 92
  fixesCount?: number; // e.g. 3
  isDark?: boolean;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score = 78,
  potentialScore = 92,
  fixesCount = 3,
  isDark = false,
}) => {
  // Determine color and band label
  const ringColor =
    score >= 80 ? '#0F766E' : score >= 70 ? '#0D9488' : score >= 50 ? '#D97706' : '#DC2626';

  const bandLabel =
    score >= 85 ? 'Excellent' : score >= 70 ? 'Good' : score >= 50 ? 'Moderate' : 'Critical';

  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const subtextColor = isDark ? '#94A3B8' : '#64748B';
  const ringBg = isDark ? '#1E293B' : '#FFFFFF';

  return (
    <View style={styles.container}>
      {/* Circular Gauge Ring */}
      <View
        style={[
          styles.outerRing,
          {
            borderColor: ringColor,
            backgroundColor: ringBg,
          },
        ]}
      >
        <Text style={[styles.scoreNumber, { color: textColor }]}>{Math.round(score)}</Text>
      </View>

      {/* Band text */}
      <Text style={[styles.bandText, { color: subtextColor }]}>{bandLabel}</Text>

      {/* Uplift fix subtext */}
      {fixesCount > 0 && potentialScore > score && (
        <View style={styles.fixesRow}>
          <Text style={[styles.fixesText, { color: subtextColor }]}>
            {fixesCount} quick fixes lift it to {potentialScore}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  outerRing: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 9,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  scoreNumber: {
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: -1,
  },
  bandText: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 10,
  },
  fixesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  fixesText: {
    fontSize: 13,
    fontWeight: '400',
  },
});
