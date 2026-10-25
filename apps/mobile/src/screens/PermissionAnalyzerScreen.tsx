import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { GlassCard } from '../design-system/GlassCard';
import { GlassTokens } from '../design-system/glassTokens';

interface PermissionAnalyzerScreenProps {
  onBack: () => void;
  isDark?: boolean;
}

type FilterTab = 'INSTALLED_APPS' | 'PERMISSIONS' | 'RISK_LEVEL';

interface AppItem {
  name: string;
  glyph: string;
  permissionCount: number;
  risk: 'HIGH' | 'MEDIUM' | 'LOW';
  permissions: string[];
}

const APPS_DATA: AppItem[] = [
  {
    name: 'WhatsApp',
    glyph: '💬',
    permissionCount: 12,
    risk: 'HIGH',
    permissions: ['Camera', 'Microphone', 'Contacts', 'Storage'],
  },
  {
    name: 'Facebook',
    glyph: '👥',
    permissionCount: 8,
    risk: 'MEDIUM',
    permissions: ['Location', 'Contacts', 'Storage'],
  },
  {
    name: 'Instagram',
    glyph: '📷',
    permissionCount: 6,
    risk: 'LOW',
    permissions: ['Storage', 'Camera'],
  },
  {
    name: 'Google Chrome',
    glyph: '🌐',
    permissionCount: 5,
    risk: 'LOW',
    permissions: ['Storage', 'Network'],
  },
  {
    name: 'YouTube',
    glyph: '▶️',
    permissionCount: 4,
    risk: 'LOW',
    permissions: ['Storage'],
  },
];

export const PermissionAnalyzerScreen: React.FC<PermissionAnalyzerScreenProps> = ({
  onBack,
  isDark = true,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('INSTALLED_APPS');
  const [expandedApp, setExpandedApp] = useState<string | null>(null);

  const filteredApps = [...APPS_DATA].sort((a, b) => {
    if (activeFilter === 'RISK_LEVEL') {
      const order = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      return order[a.risk] - order[b.risk];
    }
    if (activeFilter === 'PERMISSIONS') {
      return b.permissionCount - a.permissionCount;
    }
    return 0;
  });

  const getRiskBadgeProps = (risk: AppItem['risk']) => {
    switch (risk) {
      case 'HIGH':
        return {
          label: 'High Risk',
          bg: 'rgba(239, 68, 68, 0.18)',
          border: '#EF4444',
          text: '#EF4444',
        };
      case 'MEDIUM':
        return {
          label: 'Medium',
          bg: 'rgba(245, 158, 11, 0.18)',
          border: '#F59E0B',
          text: '#F59E0B',
        };
      case 'LOW':
        return {
          label: 'Low',
          bg: 'rgba(16, 185, 129, 0.18)',
          border: '#10B981',
          text: '#10B981',
        };
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#070D18' : '#F4F8FC' }]}>
      {/* Top Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={onBack}
          style={[
            styles.backBtn,
            {
              backgroundColor: isDark ? 'rgba(14, 27, 56, 0.8)' : '#FFFFFF',
              borderColor: isDark ? 'rgba(56, 189, 248, 0.2)' : '#DCE6F0',
            },
          ]}
          activeOpacity={0.75}
        >
          <Text style={[styles.backArrow, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>←</Text>
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
          Permission Analyzer
        </Text>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.column}>
          {/* Filter Pills matching showcase */}
          <View style={styles.filterPillsRow}>
            <TouchableOpacity
              style={[
                styles.filterPill,
                activeFilter === 'INSTALLED_APPS'
                  ? styles.activeFilterPill
                  : [
                      styles.inactiveFilterPill,
                      {
                        backgroundColor: isDark ? '#0E1B38' : '#FFFFFF',
                        borderColor: isDark ? 'rgba(56, 189, 248, 0.2)' : '#DCE6F0',
                      },
                    ],
              ]}
              onPress={() => setActiveFilter('INSTALLED_APPS')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.filterPillText,
                  {
                    color:
                      activeFilter === 'INSTALLED_APPS'
                        ? '#FFFFFF'
                        : isDark
                        ? '#94A3B8'
                        : '#64748B',
                  },
                ]}
              >
                Installed Apps
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterPill,
                activeFilter === 'PERMISSIONS'
                  ? styles.activeFilterPill
                  : [
                      styles.inactiveFilterPill,
                      {
                        backgroundColor: isDark ? '#0E1B38' : '#FFFFFF',
                        borderColor: isDark ? 'rgba(56, 189, 248, 0.2)' : '#DCE6F0',
                      },
                    ],
              ]}
              onPress={() => setActiveFilter('PERMISSIONS')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.filterPillText,
                  {
                    color:
                      activeFilter === 'PERMISSIONS'
                        ? '#FFFFFF'
                        : isDark
                        ? '#94A3B8'
                        : '#64748B',
                  },
                ]}
              >
                Permissions
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterPill,
                activeFilter === 'RISK_LEVEL'
                  ? styles.activeFilterPill
                  : [
                      styles.inactiveFilterPill,
                      {
                        backgroundColor: isDark ? '#0E1B38' : '#FFFFFF',
                        borderColor: isDark ? 'rgba(56, 189, 248, 0.2)' : '#DCE6F0',
                      },
                    ],
              ]}
              onPress={() => setActiveFilter('RISK_LEVEL')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.filterPillText,
                  {
                    color:
                      activeFilter === 'RISK_LEVEL'
                        ? '#FFFFFF'
                        : isDark
                        ? '#94A3B8'
                        : '#64748B',
                  },
                ]}
              >
                Risk Level
              </Text>
            </TouchableOpacity>
          </View>

          {/* App Cards List matching showcase */}
          <View style={styles.appsList}>
            {filteredApps.map((app) => {
              const badge = getRiskBadgeProps(app.risk);
              const isExpanded = expandedApp === app.name;

              return (
                <TouchableOpacity
                  key={app.name}
                  activeOpacity={0.8}
                  onPress={() => setExpandedApp(isExpanded ? null : app.name)}
                >
                  <GlassCard
                    isDark={isDark}
                    elevation="soft"
                    borderRadius={20}
                    style={[
                      styles.appCard,
                      {
                        backgroundColor: isDark ? '#0E1B38' : 'rgba(255, 255, 255, 0.95)',
                        borderColor: isDark ? 'rgba(56, 189, 248, 0.18)' : '#E2E8F0',
                      },
                    ]}
                  >
                    <View style={styles.appCardHeader}>
                      <View style={styles.appIconCircle}>
                        <Text style={{ fontSize: 22 }}>{app.glyph}</Text>
                      </View>

                      <View style={styles.appInfoWrap}>
                        <Text style={[styles.appName, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                          {app.name}
                        </Text>
                        <Text style={[styles.appPermCount, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                          {app.permissionCount} permissions
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.riskBadge,
                          {
                            backgroundColor: badge.bg,
                            borderColor: badge.border,
                          },
                        ]}
                      >
                        <Text style={[styles.riskBadgeText, { color: badge.text }]}>
                          {badge.label}
                        </Text>
                      </View>
                    </View>

                    {/* Permissions list */}
                    <View style={styles.permissionsPillsRow}>
                      {app.permissions.map((perm, idx) => (
                        <View
                          key={idx}
                          style={[
                            styles.permPill,
                            {
                              backgroundColor: isDark
                                ? 'rgba(10, 20, 42, 0.8)'
                                : '#F1F5F9',
                              borderColor: isDark
                                ? 'rgba(56, 189, 248, 0.12)'
                                : '#E2E8F0',
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.permPillText,
                              { color: isDark ? '#CBD5E1' : '#475569' },
                            ]}
                          >
                            {perm}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </GlassCard>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Bottom Card: Why permissions matter? */}
          <GlassCard
            isDark={isDark}
            elevation="soft"
            borderRadius={22}
            style={[
              styles.whyCard,
              {
                backgroundColor: isDark ? '#0E1B38' : 'rgba(255, 255, 255, 0.95)',
                borderColor: isDark ? 'rgba(56, 189, 248, 0.2)' : 'rgba(2, 132, 199, 0.2)',
              },
            ]}
          >
            <View style={styles.whyInnerRow}>
              <View style={styles.whyIconBubble}>
                <Text style={{ fontSize: 20 }}>🛡️</Text>
              </View>
              <View style={styles.whyTextWrap}>
                <Text style={[styles.whyTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                  Why permissions matter?
                </Text>
                <Text style={[styles.whyBody, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  Apps with excessive permissions can access sensitive personal data in the background without your explicit real-time knowledge.
                </Text>
              </View>
            </View>
          </GlassCard>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 44 : 50,
    paddingBottom: 14,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  column: {
    width: '100%',
    maxWidth: GlassTokens.layout.maxContentWidth,
    gap: 16,
  },
  filterPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1.2,
  },
  activeFilterPill: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  inactiveFilterPill: {},
  filterPillText: {
    fontSize: 13,
    fontWeight: '700',
  },
  appsList: {
    gap: 12,
  },
  appCard: {
    padding: 16,
    borderWidth: 1.2,
    gap: 12,
  },
  appCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  appIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appInfoWrap: {
    flex: 1,
    gap: 2,
  },
  appName: {
    fontSize: 16,
    fontWeight: '700',
  },
  appPermCount: {
    fontSize: 12,
    fontWeight: '500',
  },
  riskBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
  },
  riskBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  permissionsPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  permPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  permPillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  whyCard: {
    padding: 18,
    borderWidth: 1.2,
    marginTop: 6,
  },
  whyInnerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  whyIconBubble: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  whyTextWrap: {
    flex: 1,
    gap: 4,
  },
  whyTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  whyBody: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
  },
});
