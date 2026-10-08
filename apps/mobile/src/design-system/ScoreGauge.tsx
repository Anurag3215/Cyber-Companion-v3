import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Tokens } from './tokens';

interface ScoreGaugeProps {
  score: number; // 0 - 100
  band?: 'CRITICAL' | 'AT_RISK' | 'MODERATE' | 'SECURE';
  size?: number;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, band, size = 130 }) => {
  const calculatedBand =
    band || (score >= 85 ? 'SECURE' : score >= 70 ? 'MODERATE' : score >= 50 ? 'AT_RISK' : 'CRITICAL');

  const gaugeColor =
    calculatedBand === 'SECURE'
      ? Tokens.colors.risk.safe.border
      : calculatedBand === 'MODERATE'
      ? Tokens.colors.risk.moderate.border
      : calculatedBand === 'AT_RISK'
      ? Tokens.colors.risk.atRisk.border
      : Tokens.colors.risk.critical.border;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View
        style={[
          styles.outerRing,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: gaugeColor,
          },
        ]}
      >
        <Text style={[styles.scoreText, { color: gaugeColor }]}>{Math.round(score)}</Text>
        <Text style={styles.bandText}>{calculatedBand.replace('_', ' ')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Tokens.spacing.md,
  },
  outerRing: {
    borderWidth: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
  },
  scoreText: {
    fontSize: 38,
    fontWeight: '800',
  },
  bandText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 2,
    letterSpacing: 0.5,
  },
});
