import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Tokens } from './tokens';
import { RiskBadge, RiskLevel } from './RiskBadge';

interface ScanResultSheetProps {
  target: string;
  verdict: 'SAFE' | 'SUSPICIOUS' | 'MALICIOUS' | 'UNKNOWN';
  confidenceScore: number;
  plainLanguageExplanation: string;
  recommendation: string;
  heuristicsTriggered?: string[];
  onDismiss: () => void;
  onProceedAnyway?: () => void;
}

export const ScanResultSheet: React.FC<ScanResultSheetProps> = ({
  target,
  verdict,
  confidenceScore,
  plainLanguageExplanation,
  recommendation,
  heuristicsTriggered = [],
  onDismiss,
  onProceedAnyway,
}) => {
  const riskLevel: RiskLevel =
    verdict === 'MALICIOUS'
      ? 'CRITICAL'
      : verdict === 'SUSPICIOUS'
      ? 'AT_RISK'
      : verdict === 'SAFE'
      ? 'SAFE'
      : 'MODERATE';

  return (
    <View style={styles.sheet}>
      <View style={styles.headerRow}>
        <RiskBadge level={riskLevel} label={verdict} />
        <Text style={styles.confidenceText}>{confidenceScore}% Confidence</Text>
      </View>

      <Text style={styles.targetText} numberOfLines={2}>
        {target}
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What Does This Mean?</Text>
        <Text style={styles.explanationText}>{plainLanguageExplanation}</Text>
      </View>

      {heuristicsTriggered.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Red Flags Detected:</Text>
          {heuristicsTriggered.map((flag, idx) => (
            <Text key={idx} style={styles.bulletText}>
              • {flag}
            </Text>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommended Action:</Text>
        <Text style={styles.recommendationText}>{recommendation}</Text>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.primaryButton} onPress={onDismiss}>
          <Text style={styles.primaryButtonText}>
            {verdict === 'MALICIOUS' ? 'Block & Close' : 'Got It'}
          </Text>
        </TouchableOpacity>
        {verdict !== 'SAFE' && onProceedAnyway && (
          <TouchableOpacity style={styles.secondaryButton} onPress={onProceedAnyway}>
            <Text style={styles.secondaryButtonText}>Ignore Risk</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: '#0F172A',
    borderRadius: Tokens.radii.lg,
    padding: Tokens.spacing.lg,
    borderWidth: 1,
    borderColor: Tokens.colors.dark.border,
    marginVertical: Tokens.spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Tokens.spacing.sm,
  },
  confidenceText: {
    fontSize: 12,
    color: Tokens.colors.dark.textSecondary,
    fontWeight: '600',
  },
  targetText: {
    fontSize: Tokens.typography.titleMedium.fontSize,
    fontWeight: Tokens.typography.titleMedium.fontWeight,
    color: Tokens.colors.dark.textPrimary,
    marginBottom: Tokens.spacing.md,
  },
  section: {
    marginVertical: Tokens.spacing.xs,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#38BDF8',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  explanationText: {
    fontSize: Tokens.typography.body.fontSize,
    color: Tokens.colors.dark.textSecondary,
    lineHeight: 20,
  },
  bulletText: {
    fontSize: 13,
    color: '#F87171',
    lineHeight: 18,
    marginLeft: 6,
  },
  recommendationText: {
    fontSize: Tokens.typography.bodyBold.fontSize,
    color: '#F8FAFC',
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: Tokens.spacing.lg,
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#0284C7',
    paddingVertical: 12,
    borderRadius: Tokens.radii.md,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: Tokens.radii.md,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#EF4444',
    fontWeight: '600',
    fontSize: 13,
  },
});
