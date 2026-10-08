import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Tokens } from '../design-system/tokens';

interface AnimatedScoreGaugeProps {
  score: number;
  band: 'CRITICAL' | 'AT_RISK' | 'MODERATE' | 'SECURE';
  isPartialScore?: boolean;
  unmeasuredVectors?: string[];
  size?: number;
}

export const AnimatedScoreGauge: React.FC<AnimatedScoreGaugeProps> = ({
  score,
  band,
  isPartialScore = false,
  unmeasuredVectors = [],
  size = 140,
}) => {
  const bandColor =
    band === 'SECURE'
      ? '#10B981'
      : band === 'MODERATE'
      ? '#F59E0B'
      : band === 'AT_RISK'
      ? '#F97316'
      : '#EF4444';

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.gaugeCircle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: bandColor,
          },
        ]}
      >
        <Text style={[styles.scoreNumber, { color: bandColor }]}>{Math.round(score)}</Text>
        <Text style={styles.bandLabel}>{band.replace('_', ' ')}</Text>
      </View>

      {isPartialScore && (
        <View style={styles.partialBanner}>
          <Text style={styles.partialText}>
            Partial Score · Scan Wi-Fi or URLs to calibrate full score
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginVertical: Tokens.spacing.md,
  },
  gaugeCircle: {
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
  },
  scoreNumber: {
    fontSize: 42,
    fontWeight: '800',
  },
  bandLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginTop: 2,
  },
  partialBanner: {
    backgroundColor: '#78350F',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Tokens.radii.full,
    borderWidth: 1,
    borderColor: '#F59E0B',
    marginTop: Tokens.spacing.sm,
  },
  partialText: {
    color: '#FEF3C7',
    fontSize: 11,
    fontWeight: '600',
  },
});
