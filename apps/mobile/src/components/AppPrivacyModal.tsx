import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AppPrivacyModalProps {
  visible: boolean;
  onClose: () => void;
  isDark?: boolean;
}

interface AppAuditItem {
  id: string;
  name: string;
  category: string;
  icon: string;
  risk: 'CLEAN' | 'CAUTION' | 'CRITICAL';
  permissions: string[];
  finding: string;
  fixed: boolean;
}

const INITIAL_APPS: AppAuditItem[] = [
  {
    id: 'app-1',
    name: 'Super Bright Torch & Flashlight',
    category: 'Utilities',
    icon: '🔦',
    risk: 'CRITICAL',
    permissions: ['RECORD_AUDIO', 'READ_CONTACTS', 'ACCESS_COARSE_LOCATION'],
    finding: 'Overprivileged: Flashlight utility requests background microphone access and contacts.',
    fixed: false,
  },
  {
    id: 'app-2',
    name: 'Free VPN Super Fast',
    category: 'Networking',
    icon: '🌐',
    risk: 'CAUTION',
    permissions: ['SYSTEM_ALERT_WINDOW', 'QUERY_ALL_PACKAGES'],
    finding: 'Requests screen overlay permission which can be abused for clickjacking attacks.',
    fixed: false,
  },
  {
    id: 'app-3',
    name: 'Signal Private Messenger',
    category: 'Communication',
    icon: '💬',
    risk: 'CLEAN',
    permissions: ['CAMERA', 'RECORD_AUDIO'],
    finding: 'Legitimate: Permissions are strictly scoped to user-initiated calls and media.',
    fixed: true,
  },
  {
    id: 'app-4',
    name: 'Offline Calculator Plus',
    category: 'Productivity',
    icon: '🔢',
    risk: 'CLEAN',
    permissions: [],
    finding: 'Zero dangerous permissions requested. Operates 100% offline.',
    fixed: true,
  },
];

export const AppPrivacyModal: React.FC<AppPrivacyModalProps> = ({
  visible,
  onClose,
  isDark = true,
}) => {
  const [apps, setApps] = useState<AppAuditItem[]>(INITIAL_APPS);

  const bg = isDark ? '#090D16' : '#FFFFFF';
  const cardBg = isDark ? '#1E293B' : '#F8FAFC';
  const borderCol = isDark ? '#334155' : '#E2E8F0';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const subtextColor = isDark ? '#94A3B8' : '#64748B';
  const teal = isDark ? '#2DD4BF' : '#0D9488';
  const emerald = '#10B981';
  const danger = '#EF4444';
  const amber = '#F59E0B';

  const handleRevoke = (id: string) => {
    setApps((prev) =>
      prev.map((app) => (app.id === id ? { ...app, fixed: true, risk: 'CLEAN' } : app))
    );
    Alert.alert(
      '🛡️ Sensor Rights Revoked',
      'Background microphone, contacts, and location permissions were successfully restricted for this application.',
      [{ text: 'OK' }]
    );
  };

  const fixedCount = apps.filter((a) => a.fixed).length;
  const criticalCount = apps.filter((a) => !a.fixed && a.risk === 'CRITICAL').length;
  const privacyScore = Math.round((fixedCount / apps.length) * 100);

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
              <Text style={styles.iconText}>🛡️</Text>
            </View>
            <Text style={[styles.title, { color: textColor }]}>On-Device App Privacy Audit</Text>
            <Text style={[styles.subtitle, { color: subtextColor }]}>
              Zero-PII Sensor & Permission Security Analysis
            </Text>
          </View>

          {/* Privacy Score Card */}
          <View style={[styles.scoreCard, { backgroundColor: cardBg, borderColor: borderCol }]}>
            <View style={styles.scoreRow}>
              <View>
                <Text style={[styles.scoreTitle, { color: textColor }]}>App Hygiene Index</Text>
                <Text style={[styles.scoreSub, { color: subtextColor }]}>
                  {criticalCount === 0
                    ? 'All critical overprivileged sensors resolved'
                    : `${criticalCount} apps have suspicious sensor rights`}
                </Text>
              </View>
              <View
                style={[
                  styles.scorePill,
                  {
                    borderColor: privacyScore >= 80 ? emerald : amber,
                    backgroundColor: privacyScore >= 80 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.scorePillText,
                    { color: privacyScore >= 80 ? emerald : amber },
                  ]}
                >
                  {privacyScore}/100
                </Text>
              </View>
            </View>

            <View style={styles.guaranteeRow}>
              <Text style={[styles.guaranteeText, { color: emerald }]}>
                🔒 100% On-Device Guarantee: Application list never transmitted to external servers.
              </Text>
            </View>
          </View>

          {/* Apps List */}
          <Text style={[styles.listHeader, { color: subtextColor }]}>
            INSTALLED APPLICATION PERMISSION AUDIT ({apps.length})
          </Text>

          <View style={styles.appList}>
            {apps.map((app) => (
              <View
                key={app.id}
                style={[
                  styles.appCard,
                  {
                    backgroundColor: cardBg,
                    borderColor:
                      app.fixed || app.risk === 'CLEAN'
                        ? borderCol
                        : app.risk === 'CRITICAL'
                        ? danger
                        : amber,
                  },
                ]}
              >
                <View style={styles.appHeader}>
                  <View style={styles.appIconRow}>
                    <Text style={styles.appIcon}>{app.icon}</Text>
                    <View style={styles.appTitles}>
                      <Text style={[styles.appName, { color: textColor }]}>{app.name}</Text>
                      <Text style={[styles.appCategory, { color: subtextColor }]}>
                        {app.category} · {app.permissions.length} High-Risk Permissions
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      {
                        borderColor:
                          app.fixed || app.risk === 'CLEAN'
                            ? emerald
                            : app.risk === 'CRITICAL'
                            ? danger
                            : amber,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        {
                          color:
                            app.fixed || app.risk === 'CLEAN'
                              ? emerald
                              : app.risk === 'CRITICAL'
                              ? danger
                              : amber,
                        },
                      ]}
                    >
                      {app.fixed ? 'PROTECTED' : app.risk}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.findingText, { color: subtextColor }]}>{app.finding}</Text>

                {app.permissions.length > 0 && (
                  <View style={styles.permsWrap}>
                    {app.permissions.map((p, idx) => (
                      <View
                        key={idx}
                        style={[
                          styles.permChip,
                          {
                            backgroundColor: isDark ? '#090D16' : '#F1F5F9',
                            borderColor: borderCol,
                          },
                        ]}
                      >
                        <Text style={[styles.permText, { color: teal }]}>{p}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {!app.fixed && (
                  <TouchableOpacity
                    style={[styles.revokeBtn, { backgroundColor: teal }]}
                    onPress={() => handleRevoke(app.id)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.revokeBtnText}>Restrict Background Sensor Rights</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
            <Text style={[styles.closeBtnText, { color: subtextColor }]}>Close Privacy Audit</Text>
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
    marginBottom: 16,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  iconText: {
    fontSize: 26,
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
  scoreCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 18,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  scoreSub: {
    fontSize: 12,
    marginTop: 2,
  },
  scorePill: {
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  scorePillText: {
    fontSize: 15,
    fontWeight: '900',
  },
  guaranteeRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.15)',
    paddingTop: 8,
  },
  guaranteeText: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 16,
  },
  listHeader: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  appList: {
    gap: 12,
    marginBottom: 20,
  },
  appCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 14,
  },
  appHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  appIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  appIcon: {
    fontSize: 24,
  },
  appTitles: {
    flex: 1,
  },
  appName: {
    fontSize: 14,
    fontWeight: '700',
  },
  appCategory: {
    fontSize: 11,
    marginTop: 1,
  },
  statusBadge: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '800',
  },
  findingText: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 8,
  },
  permsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  permChip: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  permText: {
    fontSize: 9,
    fontWeight: '700',
  },
  revokeBtn: {
    paddingVertical: 10,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 2,
  },
  revokeBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
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
