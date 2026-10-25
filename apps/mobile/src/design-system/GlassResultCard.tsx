import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { GlassCard } from './GlassCard';
import { GlassPrimaryButton } from './GlassPrimaryButton';
import { GlassTokens } from './glassTokens';

export type ResultVerdict = 'SAFE' | 'CAUTION' | 'DANGER' | 'INFO';

export interface GlassResultCardProps {
  verdict: ResultVerdict;
  title: string;
  target?: string;
  explanation: string;
  recommendation: string;
  score?: number; // 0 (safest) to 100 (critical danger)
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  isDark?: boolean;
}

export const GlassResultCard: React.FC<GlassResultCardProps> = ({
  verdict,
  title,
  target,
  explanation,
  recommendation,
  score,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
  isDark = false,
}) => {
  const theme = isDark ? GlassTokens.colors.dark : GlassTokens.colors.light;

  // Determine verdict visual tokens
  let accentColor = theme.primary;
  let verdictBadgeBg = theme.primaryGlass;
  let verdictBadgeBorder = isDark ? 'rgba(16, 185, 129, 0.35)' : 'rgba(5, 150, 105, 0.25)';
  let verdictIcon = '🛡️';
  let verdictLabel = 'SAFE';

  if (verdict === 'CAUTION') {
    accentColor = theme.amber;
    verdictBadgeBg = theme.amberBg;
    verdictBadgeBorder = theme.amberBorder;
    verdictIcon = '⚠️';
    verdictLabel = 'CAUTION';
  } else if (verdict === 'DANGER') {
    accentColor = theme.red;
    verdictBadgeBg = theme.redBg;
    verdictBadgeBorder = theme.redBorder;
    verdictIcon = '🚨';
    verdictLabel = 'HIGH RISK';
  } else if (verdict === 'INFO') {
    accentColor = isDark ? '#38BDF8' : '#0284C7';
    verdictBadgeBg = isDark ? 'rgba(56, 189, 248, 0.15)' : 'rgba(2, 132, 199, 0.1)';
    verdictBadgeBorder = isDark ? 'rgba(56, 189, 248, 0.3)' : 'rgba(2, 132, 199, 0.2)';
    verdictIcon = 'ℹ️';
    verdictLabel = 'ADVISORY';
  }

  return (
    <GlassCard
      isDark={isDark}
      elevation="floating"
      borderRadius={GlassTokens.radii.xl}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Top Header: Verdict Pill & Optional Score */}
        <View style={styles.headerRow}>
          <View
            style={[
              styles.verdictPill,
              {
                backgroundColor: verdictBadgeBg,
                borderColor: verdictBadgeBorder,
              },
            ]}
          >
            <Text style={styles.verdictIcon}>{verdictIcon}</Text>
            <Text style={[styles.verdictText, { color: accentColor }]}>{verdictLabel}</Text>
          </View>

          {score !== undefined ? (
            <View
              style={[
                styles.scorePill,
                {
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.85)',
                  borderColor: theme.glassBorder,
                },
              ]}
            >
              <Text style={[styles.scoreLabel, { color: theme.textMuted }]}>Threat Score:</Text>
              <Text style={[styles.scoreValue, { color: accentColor }]}>{score}/100</Text>
            </View>
          ) : null}
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>

        {/* Target display if available */}
        {target ? (
          <View
            style={[
              styles.targetBox,
              {
                backgroundColor: isDark ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.04)',
                borderColor: theme.glassBorder,
              },
            ]}
          >
            <Text style={[styles.targetText, { color: theme.textSecondary }]} numberOfLines={1}>
              {target}
            </Text>
          </View>
        ) : null}

        {/* Plain Language Explanation */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeading, { color: theme.textMuted }]}>WHAT THIS MEANS</Text>
          <Text style={[styles.explanationText, { color: theme.textPrimary }]}>
            {explanation}
          </Text>
        </View>

        {/* Actionable Citizen Recommendation */}
        <View
          style={[
            styles.recommendationBox,
            {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.7)',
              borderColor: theme.glassBorder,
            },
          ]}
        >
          <Text style={styles.recommendationIcon}>💡</Text>
          <View style={styles.recommendationContent}>
            <Text style={[styles.recommendationTitle, { color: theme.textPrimary }]}>
              Recommended Action:
            </Text>
            <Text style={[styles.recommendationText, { color: theme.textSecondary }]}>
              {recommendation}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          {onPrimaryAction && primaryActionLabel ? (
            <View style={styles.buttonFlex}>
              <GlassPrimaryButton
                title={primaryActionLabel}
                onPress={onPrimaryAction}
                variant={verdict === 'DANGER' ? 'danger' : 'primary'}
                isDark={isDark}
                size="normal"
              />
            </View>
          ) : null}

          {onSecondaryAction && secondaryActionLabel ? (
            <View style={styles.buttonFlex}>
              <GlassPrimaryButton
                title={secondaryActionLabel}
                onPress={onSecondaryAction}
                variant="glass"
                isDark={isDark}
                size="normal"
              />
            </View>
          ) : null}
        </View>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  content: {
    padding: 20,
    gap: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  verdictPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  verdictIcon: {
    fontSize: 14,
  },
  verdictText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
  },
  scoreLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  scoreValue: {
    fontSize: 12,
    fontWeight: '800',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
    lineHeight: 24,
  },
  targetBox: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  targetText: {
    fontSize: 13,
    fontFamily: 'monospace',
  },
  section: {
    gap: 4,
  },
  sectionHeading: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  explanationText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  recommendationBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  recommendationIcon: {
    fontSize: 18,
    marginTop: 1,
  },
  recommendationContent: {
    flex: 1,
    gap: 2,
  },
  recommendationTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  recommendationText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  buttonFlex: {
    flex: 1,
  },
});
