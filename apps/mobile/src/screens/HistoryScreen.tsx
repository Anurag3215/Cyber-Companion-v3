import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from 'react-native';
import { ScoreHistorySparkline } from '../components/ScoreHistorySparkline';
import { GlassCard } from '../design-system/GlassCard';
import { GlassPrimaryButton } from '../design-system/GlassPrimaryButton';
import { GlassTokens } from '../design-system/glassTokens';

interface HistoryItem {
  id: string;
  type: 'link' | 'wifi' | 'qr' | 'app';
  icon: string;
  title: string;
  subtext: string;
  time: string;
  verdict: 'dangerous' | 'warning' | 'safe';
  verdictLabel: string;
  details?: {
    threatTitle?: string;
    consensusText?: string;
    explanation?: string;
    findings?: string[];
  };
}

const REAL_DEFAULT_HISTORY: HistoryItem[] = [
  {
    id: 'h-1',
    type: 'wifi',
    icon: '📶',
    title: 'Redmi 15C 5G',
    subtext: 'Physical Hotspot · 2.4 GHz (Ch 1) · WPA2',
    time: 'Recent Scan',
    verdict: 'warning',
    verdictLabel: 'Caution',
    details: {
      threatTitle: 'Ambient Wi-Fi Encryption Audit',
      consensusText: 'Caution · WPA2 without 802.11w PMF',
      explanation: 'Network traffic is encrypted with WPA2-Personal, but lacks 802.11w Protected Management Frames. Susceptible to deauth frame injection jamming.',
      findings: [
        'WPA2-PSK Authentication active',
        '802.11w PMF Disabled (Deauth susceptible)',
        'Radio Signal: -62 dBm (Strong proximity)',
      ],
    },
  },
  {
    id: 'h-2',
    type: 'app',
    icon: '🛡️',
    title: 'SuperVPN Client',
    subtext: 'com.jrzheng.supervpnpayment · Overlay Right',
    time: 'Recent Audit',
    verdict: 'warning',
    verdictLabel: 'Caution',
    details: {
      threatTitle: 'App Permission Security Audit',
      consensusText: 'Caution · SYSTEM_ALERT_WINDOW',
      explanation: 'Application requests permission to display overlays across all screens, creating clickjacking and credential overlay vectors.',
      findings: [
        'SYSTEM_ALERT_WINDOW permission granted',
        'QUERY_ALL_PACKAGES permission scoped',
      ],
    },
  },
  {
    id: 'h-3',
    type: 'app',
    icon: '💳',
    title: 'Paytm Payments',
    subtext: 'net.one97.paytm · Verified Financial Sandbox',
    time: 'Recent Audit',
    verdict: 'safe',
    verdictLabel: 'Safe',
    details: {
      threatTitle: 'Verified Application Sandbox',
      consensusText: 'Clean · Scoped sensitive permissions',
      explanation: 'Permissions are strictly scoped to financial transactions, camera QR scanning, and user-authorized banking OTP verification.',
      findings: [
        'SMS access scoped to user-triggered payment verification',
        'Zero background audio or location harvesting',
      ],
    },
  },
];

interface HistoryScreenProps {
  isDark?: boolean;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ isDark = false }) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'link' | 'wifi' | 'qr' | 'app'>('all');
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>(REAL_DEFAULT_HISTORY);

  const theme = isDark ? GlassTokens.colors.dark : GlassTokens.colors.light;

  const filteredItems =
    selectedFilter === 'all'
      ? historyItems
      : historyItems.filter((item) => item.type === selectedFilter);

  const filterTabs = [
    { key: 'all', label: 'All' },
    { key: 'link', label: 'Links' },
    { key: 'wifi', label: 'Wi-Fi' },
    { key: 'qr', label: 'QR' },
    { key: 'app', label: 'Apps' },
  ] as const;

  const getVerdictColors = (verdict: HistoryItem['verdict']) => {
    switch (verdict) {
      case 'dangerous':
        return {
          bg: theme.redBg,
          text: theme.red,
          border: theme.redBorder,
        };
      case 'warning':
        return {
          bg: theme.amberBg,
          text: theme.amber,
          border: theme.amberBorder,
        };
      case 'safe':
      default:
        return {
          bg: theme.primaryGlass,
          text: theme.primary,
          border: isDark ? 'rgba(16, 185, 129, 0.35)' : 'rgba(5, 150, 105, 0.25)',
        };
    }
  };

  return (
    <View style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            Security History
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Timeline of past Wi-Fi audits, link inspections, and on-device privacy checks.
          </Text>
        </View>

        {/* 7-Day Score Sparkline Glass Card */}
        <GlassCard
          isDark={isDark}
          elevation="soft"
          borderRadius={GlassTokens.radii.xl}
          style={styles.sparklineCard}
        >
          <View style={styles.sparklineInner}>
            <View style={styles.sparklineHeader}>
              <Text style={[styles.sparklineTitle, { color: theme.textMuted }]}>
                7-DAY DEFENSE TREND
              </Text>
              <Text style={[styles.sparklineScore, { color: theme.primary }]}>
                +14 pts gained
              </Text>
            </View>
            <ScoreHistorySparkline history={[68, 71, 70, 74, 76, 78]} />
          </View>
        </GlassCard>

        {/* Filter Capsule Chips */}
        <View style={styles.filterRow}>
          {filterTabs.map((tab) => {
            const isActive = selectedFilter === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isActive
                      ? isDark
                        ? 'rgba(16, 185, 129, 0.18)'
                        : 'rgba(5, 150, 105, 0.12)'
                      : theme.glassBg,
                    borderColor: isActive
                      ? theme.primary
                      : theme.glassBorder,
                  },
                ]}
                onPress={() => setSelectedFilter(tab.key)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    {
                      color: isActive ? theme.primary : theme.textSecondary,
                      fontWeight: isActive ? '700' : '500',
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* History Item Cards List */}
        <View style={styles.listContainer}>
          {filteredItems.length === 0 ? (
            <GlassCard
              isDark={isDark}
              elevation="none"
              borderRadius={GlassTokens.radii.lg}
              style={styles.emptyCard}
            >
              <View style={styles.emptyCardContent}>
                <Text style={styles.emptyIcon}>🛡️</Text>
                <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
                  No items in this category
                </Text>
                <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                  Security audits and scans will appear here automatically.
                </Text>
              </View>
            </GlassCard>
          ) : (
            filteredItems.map((item) => {
              const vColors = getVerdictColors(item.verdict);

              return (
                <GlassCard
                  key={item.id}
                  isDark={isDark}
                  onPress={() => setSelectedItem(item)}
                  interactive={true}
                  elevation="soft"
                  borderRadius={GlassTokens.radii.lg}
                  style={styles.historyCard}
                >
                  <View style={styles.historyCardContent}>
                    {/* Icon Bubble */}
                    <View
                      style={[
                        styles.iconBubble,
                        {
                          backgroundColor: isDark
                            ? 'rgba(255, 255, 255, 0.08)'
                            : 'rgba(255, 255, 255, 0.9)',
                          borderColor: theme.glassHighlight,
                        },
                      ]}
                    >
                      <Text style={styles.itemIcon}>{item.icon}</Text>
                    </View>

                    {/* Middle Info */}
                    <View style={styles.middleInfo}>
                      <Text style={[styles.itemTitle, { color: theme.textPrimary }]} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={[styles.itemSubtext, { color: theme.textSecondary }]} numberOfLines={1}>
                        {item.subtext}
                      </Text>
                      <Text style={[styles.itemTime, { color: theme.textMuted }]}>
                        {item.time}
                      </Text>
                    </View>

                    {/* Right Verdict Pill */}
                    <View
                      style={[
                        styles.verdictPill,
                        {
                          backgroundColor: vColors.bg,
                          borderColor: vColors.border,
                        },
                      ]}
                    >
                      <Text style={[styles.verdictText, { color: vColors.text }]}>
                        {item.verdictLabel}
                      </Text>
                    </View>
                  </View>
                </GlassCard>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Item Detail Inspection Modal */}
      {selectedItem && (
        <Modal
          visible={Boolean(selectedItem)}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setSelectedItem(null)}
        >
          <SafeAreaView
            style={[
              styles.modalContainer,
              { backgroundColor: isDark ? '#090D16' : '#F4FBF7' },
            ]}
          >
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleWrap}>
                <Text style={styles.modalIcon}>{selectedItem.icon}</Text>
                <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                  {selectedItem.title}
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.closeBtn,
                  { backgroundColor: theme.glassBg, borderColor: theme.glassBorder },
                ]}
                onPress={() => setSelectedItem(null)}
              >
                <Text style={[styles.closeBtnText, { color: theme.textPrimary }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalContent}>
              <GlassCard
                isDark={isDark}
                elevation="soft"
                borderRadius={GlassTokens.radii.lg}
                style={styles.modalCard}
              >
                <View style={styles.modalCardInner}>
                  <Text style={[styles.modalCardHeading, { color: theme.textMuted }]}>
                    FINDINGS & TELEMETRY
                  </Text>
                  <Text style={[styles.threatTitle, { color: theme.textPrimary }]}>
                    {selectedItem.details?.threatTitle || 'Audit Details'}
                  </Text>
                  <Text style={[styles.explanation, { color: theme.textSecondary }]}>
                    {selectedItem.details?.explanation || selectedItem.subtext}
                  </Text>

                  {selectedItem.details?.findings && (
                    <View style={styles.findingsList}>
                      {selectedItem.details.findings.map((f, i) => (
                        <View key={i} style={styles.findingRow}>
                          <Text style={{ color: theme.primary }}>✓</Text>
                          <Text style={[styles.findingText, { color: theme.textPrimary }]}>
                            {f}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </GlassCard>

              <GlassPrimaryButton
                title="Done"
                onPress={() => setSelectedItem(null)}
                isDark={isDark}
                style={styles.doneBtn}
              />
            </ScrollView>
          </SafeAreaView>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 115, // Clear floating glass navigation bar
    gap: 16,
  },
  header: {
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
    marginTop: 4,
  },
  sparklineCard: {
    marginTop: 4,
  },
  sparklineInner: {
    padding: 18,
    gap: 12,
  },
  sparklineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sparklineTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  sparklineScore: {
    fontSize: 12,
    fontWeight: '700',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.2,
  },
  filterChipText: {
    fontSize: 12,
    letterSpacing: -0.1,
  },
  listContainer: {
    gap: 10,
  },
  historyCard: {
    marginVertical: 2,
  },
  historyCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  iconBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemIcon: {
    fontSize: 20,
  },
  middleInfo: {
    flex: 1,
    gap: 2,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  itemSubtext: {
    fontSize: 12,
    fontWeight: '500',
  },
  itemTime: {
    fontSize: 11,
    marginTop: 2,
  },
  verdictPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
  },
  verdictText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  emptyCard: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCardContent: {
    alignItems: 'center',
    gap: 8,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  modalHeaderTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  modalIcon: {
    fontSize: 22,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  modalContent: {
    padding: 20,
    gap: 16,
  },
  modalCard: {
    marginVertical: 4,
  },
  modalCardInner: {
    padding: 20,
    gap: 10,
  },
  modalCardHeading: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  threatTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  explanation: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  findingsList: {
    marginTop: 8,
    gap: 8,
  },
  findingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  findingText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    flex: 1,
  },
  doneBtn: {
    marginTop: 8,
  },
});
