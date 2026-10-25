import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { GlassCard } from './GlassCard';
import { GlassTokens } from './glassTokens';

export interface GlassActionCardProps {
  icon: string;
  title: string;
  subtitle: string;
  badgeText?: string;
  badgeColor?: string;
  onPress: () => void;
  isDark?: boolean;
}

export const GlassActionCard: React.FC<GlassActionCardProps> = ({
  icon,
  title,
  subtitle,
  badgeText,
  badgeColor,
  onPress,
  isDark = false,
}) => {
  const theme = isDark ? GlassTokens.colors.dark : GlassTokens.colors.light;
  const badgeCol = badgeColor || theme.primary;

  return (
    <GlassCard
      isDark={isDark}
      onPress={onPress}
      interactive={true}
      elevation="soft"
      borderRadius={GlassTokens.radii.lg}
      style={styles.cardContainer}
    >
      <View style={styles.content}>
        {/* Top Row: Icon Bubble & Optional Pill Badge */}
        <View style={styles.headerRow}>
          <View
            style={[
              styles.iconBubble,
              {
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.9)',
                borderColor: theme.glassHighlight,
              },
            ]}
          >
            <Text style={styles.iconText}>{icon}</Text>
          </View>

          {badgeText ? (
            <View
              style={[
                styles.badgePill,
                {
                  backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(5, 150, 105, 0.08)',
                  borderColor: isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(5, 150, 105, 0.2)',
                },
              ]}
            >
              <Text style={[styles.badgeText, { color: badgeCol }]}>{badgeText}</Text>
            </View>
          ) : (
            <Text style={[styles.chevron, { color: theme.textMuted }]}>→</Text>
          )}
        </View>

        {/* Text Section */}
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.textPrimary }]} numberOfLines={1}>
            {title}
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]} numberOfLines={2}>
            {subtitle}
          </Text>
        </View>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    minHeight: 140,
  },
  content: {
    padding: 16,
    justifyContent: 'space-between',
    minHeight: 140,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  iconBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  iconText: {
    fontSize: 22,
  },
  chevron: {
    fontSize: 16,
    fontWeight: '700',
  },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  textContainer: {
    marginTop: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
});
