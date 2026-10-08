import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Tokens } from './tokens';

export type RiskLevel = 'SAFE' | 'MODERATE' | 'AT_RISK' | 'CRITICAL';

interface RiskBadgeProps {
  level: RiskLevel;
  label?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, label }) => {
  const colorConfig =
    level === 'SAFE'
      ? Tokens.colors.risk.safe
      : level === 'MODERATE'
      ? Tokens.colors.risk.moderate
      : level === 'AT_RISK'
      ? Tokens.colors.risk.atRisk
      : Tokens.colors.risk.critical;

  return (
    <View style={[styles.badge, { backgroundColor: colorConfig.bg, borderColor: colorConfig.border }]}>
      <Text style={[styles.text, { color: colorConfig.text }]}>
        {label || level.replace('_', ' ')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Tokens.radii.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: Tokens.typography.caption.fontSize,
    fontWeight: Tokens.typography.caption.fontWeight,
    textTransform: 'uppercase',
  },
});
