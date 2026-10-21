import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { GlassCard } from './GlassCard';
import { GlassTokens } from './glassTokens';

export interface GlassTipCardProps {
  category?: string;
  title: string;
  advice: string;
  icon?: string;
  onPress?: () => void;
  isDark?: boolean;
}

export const GlassTipCard: React.FC<GlassTipCardProps> = ({
  category = "TODAY'S SAFETY TIP",
  title,
  advice,
  icon = '💡',
  onPress,
  isDark = false,
}) => {
  const theme = isDark ? GlassTokens.colors.dark : GlassTokens.colors.light;

  return (
    <GlassCard
      isDark={isDark}
      onPress={onPress}
      interactive={Boolean(onPress)}
      elevation="soft"
      borderRadius={GlassTokens.radii.lg}
      style={styles.card}
    >
      <View style={styles.content}>
        {/* Header Row: Category Badge & Tap Action */}
        <View style={styles.headerRow}>
          <View
            style={[
              styles.categoryBadge,
              {
                backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(5, 150, 105, 0.08)',
                borderColor: isDark ? 'rgba(16, 185, 129, 0.25)' : 'rgba(5, 150, 105, 0.18)',
              },
            ]}
          >
            <Text style={styles.categoryIcon}>{icon}</Text>
            <Text style={[styles.categoryText, { color: theme.primary }]}>{category}</Text>
          </View>

          {onPress ? (
            <Text style={[styles.tapHint, { color: theme.textMuted }]}>Learn more →</Text>
          ) : null}
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>

        {/* Practical Advice in Everyday Language */}
        <Text style={[styles.advice, { color: theme.textSecondary }]}>{advice}</Text>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
  },
  content: {
    padding: 18,
    gap: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryIcon: {
    fontSize: 12,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  tapHint: {
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
    lineHeight: 22,
  },
  advice: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
  },
});
