import React, { useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassTokens } from './glassTokens';

export type TabKey =
  | 'home'
  | 'tools'
  | 'awareness'
  | 'settings'
  | 'scan'
  | 'history'
  | 'learn'
  | 'me';

export interface TabItem {
  key: TabKey;
  label: string;
  icon: string;
}

export function normalizeNavTab(t: TabKey): 'home' | 'tools' | 'awareness' | 'settings' {
  if (t === 'scan' || t === 'history') return 'tools';
  if (t === 'learn') return 'awareness';
  if (t === 'me') return 'settings';
  return t;
}

const TABS: TabItem[] = [
  { key: 'home', label: 'Home', icon: '🏠' },
  { key: 'tools', label: 'Tools', icon: '🛠️' },
  { key: 'awareness', label: 'Awareness', icon: '💡' },
  { key: 'settings', label: 'Settings', icon: '⚙️' },
];

export interface GlassNavigationBarProps {
  currentTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  onQuickAction?: () => void;
  quickActionLabel?: string;
  isDark?: boolean;
}

export const GlassNavigationBar: React.FC<GlassNavigationBarProps> = ({
  currentTab,
  onSelectTab,
  onQuickAction,
  quickActionLabel = '⚡ Quick Scan',
  isDark = false,
}) => {
  const insets = useSafeAreaInsets();
  const theme = isDark ? GlassTokens.colors.dark : GlassTokens.colors.light;

  // Floating offset based on safe area
  const bottomMargin = Math.max(insets.bottom, 12) + 6;

  return (
    <View style={[styles.floatingWrapper, { bottom: bottomMargin }]}>
      {/* Optional Top Floating Capsule Pill (inspired by reference "Capture" pill) */}
      {onQuickAction && (
        <TouchableOpacity
          style={[
            styles.quickActionPill,
            GlassTokens.shadows.soft,
            {
              backgroundColor: isDark ? 'rgba(30, 41, 59, 0.85)' : 'rgba(255, 255, 255, 0.92)',
              borderColor: theme.glassBorder,
              borderTopColor: theme.glassHighlight,
            },
          ]}
          onPress={onQuickAction}
          activeOpacity={0.8}
        >
          {Platform.OS !== 'web' ? (
            <BlurView
              intensity={40}
              tint={isDark ? 'dark' : 'light'}
              style={StyleSheet.absoluteFill}
            />
          ) : null}
          <View style={styles.quickActionContent}>
            <View style={[styles.quickActionDot, { backgroundColor: theme.primary }]} />
            <Text style={[styles.quickActionText, { color: theme.textPrimary }]}>
              {quickActionLabel}
            </Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Main Floating Glass Navigation Bar Container */}
      <View
        style={[
          styles.navBarContainer,
          GlassTokens.shadows.floating,
          {
            backgroundColor: theme.glassFloatingNav,
            borderColor: theme.glassBorder,
            borderTopColor: theme.glassHighlight,
          },
        ]}
      >
        {Platform.OS !== 'web' ? (
          <BlurView
            intensity={65}
            tint={isDark ? 'dark' : 'light'}
            style={StyleSheet.absoluteFill}
          />
        ) : null}

        {/* Specular Top Rim */}
        <View
          style={[
            styles.specularRim,
            {
              borderTopColor: theme.glassHighlight,
            },
          ]}
          pointerEvents="none"
        />

        {/* Nav Tabs */}
        <View style={styles.tabsRow}>
          {TABS.map((tab) => {
            const isSelected = normalizeNavTab(currentTab) === tab.key;

            return (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tabButton,
                  isSelected && [
                    styles.selectedTabBubble,
                    {
                      backgroundColor: isDark
                        ? 'rgba(255, 255, 255, 0.12)'
                        : 'rgba(5, 150, 105, 0.12)',
                      borderColor: isDark
                        ? 'rgba(255, 255, 255, 0.22)'
                        : 'rgba(5, 150, 105, 0.28)',
                      borderTopColor: isDark
                        ? 'rgba(255, 255, 255, 0.35)'
                        : 'rgba(5, 150, 105, 0.45)',
                    },
                  ],
                ]}
                onPress={() => onSelectTab(tab.key)}
                activeOpacity={0.75}
              >
                <Text
                  style={[
                    styles.tabIcon,
                    {
                      transform: [{ scale: isSelected ? 1.08 : 1 }],
                      opacity: isSelected ? 1 : 0.65,
                    },
                  ]}
                >
                  {tab.icon}
                </Text>
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: isSelected
                        ? theme.primary
                        : theme.textSecondary,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                  numberOfLines={1}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingWrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    alignItems: 'center',
    zIndex: 100,
  },
  quickActionPill: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.2,
    marginBottom: 8,
    overflow: 'hidden',
  },
  quickActionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quickActionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  navBarContainer: {
    width: '100%',
    maxWidth: 560,
    borderRadius: GlassTokens.radii.nav,
    borderWidth: 1.2,
    overflow: 'hidden',
    position: 'relative',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  specularRim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1.5,
    borderRadius: GlassTokens.radii.nav,
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    paddingHorizontal: 4,
    borderRadius: 22,
    marginHorizontal: 2,
  },
  selectedTabBubble: {
    borderWidth: 1.2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  tabIcon: {
    fontSize: 19,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 11,
    letterSpacing: -0.2,
  },
});
