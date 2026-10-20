import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  SafeAreaView,
} from 'react-native';
import { LinkCheckSheet } from '../components/LinkCheckSheet';
import { ScoreHistorySparkline } from '../components/ScoreHistorySparkline';

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
    title: 'DESKTOP-BNFS8Q1 4220',
    subtext: 'Physical Hotspot · 2.4 GHz (Ch 11) · WPA2',
    time: 'Recent Scan',
    verdict: 'warning',
    verdictLabel: 'Caution',
    details: {
      threatTitle: 'Ambient Wi-Fi Encryption Audit',
      consensusText: 'Caution · WPA2 without 802.11w PMF',
      explanation: 'Network traffic is encrypted with WPA2-Personal, but lacks 802.11w Protected Management Frames. Vulnerable to deauth frame injection.',
      findings: [
        'WPA2-PSK Authentication active',
        '802.11w PMF Disabled (Deauth susceptible)',
        'Radio Signal: -40 dBm (Strong proximity)',
      ],
    },
  },
  {
    id: 'h-2',
    type: 'app',
    icon: '🛡️',
    title: 'SuperVPN Fast Client',
    subtext: 'com.jrzheng.supervpnpayment · System Overlay',
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

  const bg = isDark ? '#090D16' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const subtextColor = isDark ? '#94A3B8' : '#64748B';
  const cardBg = isDark ? '#1E293B' : '#FFFFFF';
  const borderCol = isDark ? '#334155' : '#F1F5F9';

  const filteredItems = selectedFilter === 'all'
    ? historyItems
    : historyItems.filter((item) => item.type === selectedFilter);

  const filterTabs = [
    { key: 'all', label: 'All' },
    { key: 'link', label: 'Links' },
    { key: 'wifi', label: 'Wi-Fi' },
    { key: 'qr', label: 'QR' },
    { key: 'app', label: 'Apps' },
  ] as const;

  return (
    <View style={[styles.safeArea, { backgroundColor: bg }]}>
      <ScrollView style={[styles.container, { backgroundColor: bg }]} contentContainerStyle={styles.content}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: textColor }]}>Scan History</Text>
          <Text style={[styles.subtitle, { color: subtextColor }]}>
            Review past security checks and threat verdicts
          </Text>
        </View>

        {/* 7-Day Score Sparkline */}
        <View style={styles.sparklineContainer}>
          <ScoreHistorySparkline history={[68, 71, 70, 74, 76, 78]} />
        </View>

        {/* Filter Chips */}
        <View style={styles.filterRow}>
          {filterTabs.map((tab) => {
            const isActive = selectedFilter === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isActive ? '#0F172A' : isDark ? '#1E293B' : '#F1F5F9',
                    borderColor: borderCol,
                  },
                ]}
                onPress={() => setSelectedFilter(tab.key)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    { color: isActive ? '#FFFFFF' : subtextColor, fontWeight: isActive ? '700' : '500' },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* List of Scans */}
        <View style={styles.listContainer}>
          {filteredItems.length === 0 ? (
            <View style={[styles.emptyContainer, { backgroundColor: cardBg, borderColor: borderCol }]}>
              <Text style={styles.emptyIcon}>🛡️</Text>
              <Text style={[styles.emptyTitle, { color: textColor }]}>No Logs in This Category</Text>
              <Text style={[styles.emptySub, { color: subtextColor }]}>
                Real-time security telemetry will populate here as you run live scans.
              </Text>
            </View>
          ) : (
            filteredItems.map((item) => {
              const badgeBg =
                item.verdict === 'dangerous'
                  ? '#FEF2F2'
                  : item.verdict === 'warning'
                  ? '#FFFBEB'
                  : '#ECFDF5';
              const badgeTextColor =
                item.verdict === 'dangerous'
                  ? '#DC2626'
                  : item.verdict === 'warning'
                  ? '#D97706'
                  : '#059669';

              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.historyCard, { backgroundColor: cardBg, borderColor: borderCol }]}
                  onPress={() => setSelectedItem(item)}
                  activeOpacity={0.7}
                >
                  <View style={styles.cardLeft}>
                    <View style={[styles.iconWrap, { backgroundColor: isDark ? '#334155' : '#F8FAFC' }]}>
                      <Text style={styles.iconText}>{item.icon}</Text>
                    </View>
                    <View style={styles.textWrap}>
                      <Text style={[styles.cardTitle, { color: textColor }]} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={[styles.cardSubtext, { color: subtextColor }]} numberOfLines={1}>
                        {item.subtext}
                      </Text>
                      <Text style={[styles.cardTime, { color: subtextColor }]}>{item.time}</Text>
                    </View>
                  </View>

                  <View style={[styles.badgePill, { backgroundColor: badgeBg }]}>
                    <Text style={[styles.badgeText, { color: badgeTextColor }]}>
                      {item.verdictLabel}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Item Detail Modal */}
      {selectedItem && (
        <Modal
          visible={!!selectedItem}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setSelectedItem(null)}
        >
          <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#0F172A' : '#FFFFFF' }}>
            <LinkCheckSheet
              url={selectedItem.title}
              isThreat={selectedItem.verdict !== 'safe'}
              threatTitle={selectedItem.details?.threatTitle || selectedItem.verdictLabel}
              consensusText={selectedItem.details?.consensusText || 'Detailed scan breakdown'}
              explanation={selectedItem.details?.explanation || selectedItem.subtext}
              findings={selectedItem.details?.findings || []}
              onClose={() => setSelectedItem(null)}
              isDark={isDark}
            />
          </SafeAreaView>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  sparklineContainer: {
    marginBottom: 20,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 13,
  },
  listContainer: {
    gap: 12,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 20,
  },
  textWrap: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  cardSubtext: {
    fontSize: 13,
    fontWeight: '400',
    marginTop: 2,
  },
  cardTime: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
  },
  badgePill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  emptyContainer: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    marginVertical: 12,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
});
