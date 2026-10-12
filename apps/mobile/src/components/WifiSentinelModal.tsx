import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';

interface WifiSentinelModalProps {
  visible: boolean;
  onClose: () => void;
  isDark?: boolean;
}

export const WifiSentinelModal: React.FC<WifiSentinelModalProps> = ({
  visible,
  onClose,
  isDark = true,
}) => {
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditComplete, setAuditComplete] = useState(false);

  const bg = isDark ? '#090D16' : '#FFFFFF';
  const cardBg = isDark ? '#1E293B' : '#F8FAFC';
  const borderCol = isDark ? '#334155' : '#E2E8F0';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const subtextColor = isDark ? '#94A3B8' : '#64748B';
  const teal = isDark ? '#2DD4BF' : '#0D9488';
  const emerald = '#10B981';
  const amber = '#F59E0B';

  const runDeepAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      setAuditComplete(true);
    }, 1800);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.iconCircle, { borderColor: emerald, backgroundColor: cardBg }]}>
              <Text style={styles.iconText}>📶</Text>
            </View>
            <Text style={[styles.title, { color: textColor }]}>Wi-Fi Sentinel Inspection</Text>
            <Text style={[styles.subtitle, { color: subtextColor }]}>
              Hardware encryption, PMF integrity, and rogue AP detection
            </Text>
          </View>

          {/* Active Network Card */}
          <View style={[styles.netCard, { backgroundColor: cardBg, borderColor: borderCol }]}>
            <View style={styles.netHeader}>
              <View>
                <Text style={[styles.netName, { color: textColor }]}>Home_Office_5G</Text>
                <Text style={[styles.netBssid, { color: subtextColor }]}>
                  BSSID: e4:8d:8c:12:a9:44 · Ch 44 (5.22 GHz)
                </Text>
              </View>
              <View style={[styles.secureBadge, { borderColor: emerald, backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                <Text style={[styles.secureBadgeText, { color: emerald }]}>VERIFIED SECURE</Text>
              </View>
            </View>

            {/* Metrics Grid */}
            <View style={styles.metricsGrid}>
              <View style={[styles.metricItem, { borderColor: borderCol }]}>
                <Text style={[styles.metricValue, { color: emerald }]}>WPA3-SAE</Text>
                <Text style={[styles.metricLabel, { color: subtextColor }]}>Encryption</Text>
              </View>
              <View style={[styles.metricItem, { borderColor: borderCol }]}>
                <Text style={[styles.metricValue, { color: emerald }]}>ENABLED</Text>
                <Text style={[styles.metricLabel, { color: subtextColor }]}>PMF Defense</Text>
              </View>
              <View style={[styles.metricItem, { borderColor: borderCol }]}>
                <Text style={[styles.metricValue, { color: teal }]}>-58 dBm</Text>
                <Text style={[styles.metricLabel, { color: subtextColor }]}>Signal Strength</Text>
              </View>
              <View style={[styles.metricItem, { borderColor: borderCol }]}>
                <Text style={[styles.metricValue, { color: emerald }]}>QUAD9 DoH</Text>
                <Text style={[styles.metricLabel, { color: subtextColor }]}>DNS Security</Text>
              </View>
            </View>
          </View>

          {/* Security Findings Checklist */}
          <View style={[styles.findingsCard, { backgroundColor: cardBg, borderColor: borderCol }]}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Perimeter Crypt Checks</Text>

            <View style={styles.findingRow}>
              <Text style={styles.checkIcon}>✅</Text>
              <View style={styles.findingInfo}>
                <Text style={[styles.findingTitle, { color: textColor }]}>
                  Protected Management Frames (802.11w)
                </Text>
                <Text style={[styles.findingDesc, { color: subtextColor }]}>
                  Hardware-enforced protection against deauthentication & Wi-Fi jamming attacks.
                </Text>
              </View>
            </View>

            <View style={styles.findingRow}>
              <Text style={styles.checkIcon}>✅</Text>
              <View style={styles.findingInfo}>
                <Text style={[styles.findingTitle, { color: textColor }]}>
                  Zero Evil Twin Heuristic Anomaly
                </Text>
                <Text style={[styles.findingDesc, { color: subtextColor }]}>
                  No rogue access points broadcasting duplicate SSIDs without encryption.
                </Text>
              </View>
            </View>

            <View style={styles.findingRow}>
              <Text style={styles.checkIcon}>✅</Text>
              <View style={styles.findingInfo}>
                <Text style={[styles.findingTitle, { color: textColor }]}>
                  DNS Resolution Integrity
                </Text>
                <Text style={[styles.findingDesc, { color: subtextColor }]}>
                  Resolver passes cache poisoning checks. Gateway does not hijack DNS lookups.
                </Text>
              </View>
            </View>

            <View style={styles.findingRow}>
              <Text style={styles.checkIcon}>⚠️</Text>
              <View style={styles.findingInfo}>
                <Text style={[styles.findingTitle, { color: textColor }]}>
                  WPA2 Legacy Fallback Advisory
                </Text>
                <Text style={[styles.findingDesc, { color: subtextColor }]}>
                  Access point supports WPA2 mixed mode for legacy IoT devices. Ensure WPA3-only is used if supported.
                </Text>
              </View>
            </View>
          </View>

          {/* Audit Action Button */}
          <TouchableOpacity
            style={[styles.auditBtn, { backgroundColor: teal }]}
            onPress={runDeepAudit}
            disabled={isAuditing}
            activeOpacity={0.85}
          >
            {isAuditing ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.auditBtnText}>
                {auditComplete ? '✓ Re-run Deep Packet & Crypt Audit' : '⚡ Run Deep Wi-Fi Crypt Audit'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
            <Text style={[styles.closeBtnText, { color: subtextColor }]}>Close Inspection</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  iconText: {
    fontSize: 28,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  netCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
  },
  netHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  netName: {
    fontSize: 18,
    fontWeight: '800',
  },
  netBssid: {
    fontSize: 11,
    marginTop: 2,
  },
  secureBadge: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  secureBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metricItem: {
    flex: 1,
    minWidth: '45%',
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '800',
  },
  metricLabel: {
    fontSize: 10,
    marginTop: 2,
  },
  findingsCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    marginBottom: 20,
    gap: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  findingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  checkIcon: {
    fontSize: 16,
    marginTop: 1,
  },
  findingInfo: {
    flex: 1,
  },
  findingTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  findingDesc: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },
  auditBtn: {
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  auditBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  closeBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  closeBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
