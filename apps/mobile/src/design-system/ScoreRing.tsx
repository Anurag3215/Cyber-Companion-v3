import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { GlassTokens } from './glassTokens';

export type ScoreRingBand = 'SECURE' | 'MODERATE' | 'AT_RISK' | 'CRITICAL';

/** Same thresholds as @cyber-companion/scoring-core `determineScoreBand`. */
export const bandForScore = (score: number): ScoreRingBand =>
  score >= 85 ? 'SECURE' : score >= 70 ? 'MODERATE' : score >= 50 ? 'AT_RISK' : 'CRITICAL';

export const BAND_LABEL: Record<ScoreRingBand, string> = {
  SECURE: 'Well protected',
  MODERATE: 'Mostly protected',
  AT_RISK: 'Needs attention',
  CRITICAL: 'Action needed',
};

export interface ScoreRingProps {
  /** 0-100, or null/undefined when the user has not been assessed yet. */
  score?: number | null;
  size?: number;
  isDark?: boolean;
}

/**
 * Circular score indicator built from plain Views (no SVG dependency, works on
 * native and web). Two clipped half-rings are rotated to sweep the arc; the sweep
 * uses the native driver and is skipped when the OS asks for reduced motion.
 */
export const ScoreRing: React.FC<ScoreRingProps> = ({ score, size = 168, isDark = false }) => {
  const theme = isDark ? GlassTokens.colors.dark : GlassTokens.colors.light;
  const hasScore = typeof score === 'number' && !Number.isNaN(score);
  const target = hasScore ? Math.max(0, Math.min(100, score as number)) / 100 : 0;
  const progress = useRef(new Animated.Value(0)).current;
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled?.()
      .then((v) => mounted && setReduceMotion(!!v))
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      progress.setValue(target);
      return;
    }
    Animated.timing(progress, {
      toValue: target,
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [target, reduceMotion, progress]);

  const stroke = Math.max(10, Math.round(size * 0.085));
  const band = hasScore ? bandForScore(score as number) : null;
  const arcColor =
    band === 'SECURE'
      ? theme.green
      : band === 'MODERATE'
        ? theme.primary
        : band === 'AT_RISK'
          ? theme.amber
          : band === 'CRITICAL'
            ? theme.red
            : theme.border;
  const trackColor = isDark ? 'rgba(148, 197, 255, 0.14)' : 'rgba(16, 36, 62, 0.08)';

  const rightRot = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['-135deg', '45deg', '45deg'],
  });
  const leftRot = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['45deg', '45deg', '225deg'],
  });

  const arcStyle = {
    position: 'absolute' as const,
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: stroke,
    borderColor: 'transparent',
    borderTopColor: arcColor,
    borderRightColor: arcColor,
  };

  const label = hasScore
    ? `Security score ${Math.round(score as number)} out of 100. ${BAND_LABEL[band as ScoreRingBand]}.`
    : 'Security score not available yet. Run a check to get your score.';

  return (
    <View
      style={{ width: size, height: size }}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={hasScore ? { min: 0, max: 100, now: Math.round(score as number) } : undefined}
    >
      {/* Track */}
      <View
        style={[
          StyleSheet.absoluteFill,
          { borderRadius: size / 2, borderWidth: stroke, borderColor: trackColor },
        ]}
      />

      {hasScore && (
        <>
          {/* First 180°: right half */}
          <View style={[styles.half, { left: size / 2, width: size / 2, height: size }]}>
            <Animated.View style={[arcStyle, { left: -size / 2, transform: [{ rotate: rightRot }] }]} />
          </View>
          {/* Second 180°: left half */}
          <View style={[styles.half, { left: 0, width: size / 2, height: size }]}>
            <Animated.View style={[arcStyle, { left: 0, transform: [{ rotate: leftRot }] }]} />
          </View>
        </>
      )}

      {/* Centre readout */}
      <View style={[StyleSheet.absoluteFill, styles.center]} pointerEvents="none">
        {hasScore ? (
          <>
            <Text style={[styles.value, { color: theme.textPrimary, fontSize: size * 0.3 }]}>
              {Math.round(score as number)}
            </Text>
            <Text style={[styles.outOf, { color: theme.textMuted }]}>out of 100</Text>
          </>
        ) : (
          <>
            <Text style={[styles.value, { color: theme.textMuted, fontSize: size * 0.3 }]}>–</Text>
            <Text style={[styles.outOf, { color: theme.textMuted }]}>not checked yet</Text>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  half: { position: 'absolute', top: 0, overflow: 'hidden' },
  center: { alignItems: 'center', justifyContent: 'center' },
  value: { fontWeight: '800', letterSpacing: -1 },
  outOf: { fontSize: 12, fontWeight: '500', marginTop: 2 },
});
