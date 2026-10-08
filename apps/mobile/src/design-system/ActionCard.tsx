import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Tokens } from './tokens';

interface ActionCardProps {
  title: string;
  description: string;
  pointGain?: number;
  severity?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  onPressAction?: () => void;
  actionButtonText?: string;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  pointGain,
  severity = 'MEDIUM',
  onPressAction,
  actionButtonText = 'Resolve Now',
}) => {
  const accentColor =
    severity === 'CRITICAL'
      ? Tokens.colors.risk.critical.border
      : severity === 'HIGH'
      ? Tokens.colors.risk.atRisk.border
      : Tokens.colors.risk.moderate.border;

  return (
    <View style={[styles.card, { borderLeftColor: accentColor }]}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        {pointGain && (
          <View style={styles.gainBadge}>
            <Text style={styles.gainText}>+{pointGain} pts</Text>
          </View>
        )}
      </View>
      <Text style={styles.description}>{description}</Text>
      {onPressAction && (
        <TouchableOpacity style={styles.button} onPress={onPressAction} activeOpacity={0.8}>
          <Text style={styles.buttonText}>{actionButtonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Tokens.colors.dark.surface,
    borderRadius: Tokens.radii.md,
    padding: Tokens.spacing.lg,
    marginVertical: Tokens.spacing.sm,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: Tokens.colors.dark.border,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Tokens.spacing.xs,
  },
  title: {
    fontSize: Tokens.typography.bodyBold.fontSize,
    fontWeight: Tokens.typography.bodyBold.fontWeight,
    color: Tokens.colors.dark.textPrimary,
    flex: 1,
    marginRight: Tokens.spacing.sm,
  },
  gainBadge: {
    backgroundColor: '#064E3B',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Tokens.radii.full,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  gainText: {
    color: '#D1FAE5',
    fontSize: 11,
    fontWeight: '700',
  },
  description: {
    fontSize: Tokens.typography.body.fontSize,
    color: Tokens.colors.dark.textSecondary,
    lineHeight: 20,
    marginTop: 4,
  },
  button: {
    marginTop: Tokens.spacing.md,
    backgroundColor: '#0284C7',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: Tokens.radii.sm,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '600',
  },
});
