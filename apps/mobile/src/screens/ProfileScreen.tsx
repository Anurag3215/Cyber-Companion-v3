import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';

interface ProfileScreenProps {
  userName?: string;
  isDark?: boolean;
  onNavigateToScanners?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  userName = 'Arun',
  isDark = false,
  onNavigateToScanners,
}) => {
  const [wifiAlerts, setWifiAlerts] = useState(true);
  const [urlInterception, setUrlInterception] = useState(true);
  const [quietHours, setQuietHours] = useState(true);
  const [fixApplied, setFixApplied] = useState<{ [key: string]: boolean }>({});

  const bg = isDark ? '#090D16' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const subtextColor = isDark ? '#94A3B8' : '#64748B';
  const cardBg = isDark ? '#1E293B' : '#FFFFFF';
  const borderCol = isDark ? '#334155' : '#F1F5F9';

  const handleClearCache = () => {
    Alert.alert(
      'Clear Local Data',
      'This will erase local scan cache and offline activity records. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => {} },
      ],
    );
  };

  const toggleFix = (key: string) => {
    setFixApplied((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bg }]}>
      <ScrollView style={[styles.container, { backgroundColor: bg }]} contentContainerStyle={styles.content}>
        
        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: cardBg, borderColor: borderCol }]}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: textColor }]}>{userName}</Text>
            <Text style={[styles.profileStatus, { color: '#0D9488' }]}>
              Mostly Protected · Score 78/100
            </Text>
          </View>
        </View>

        {/* Quick Fixes Recommendation Card */}
        <View style={[styles.fixesSection, { backgroundColor: isDark ? '#1E293B' : '#F0FDFA', borderColor: '#CCFBF1' }]}>
          <Text style={styles.fixesHeader}>RECOMMENDED ACTIONS</Text>
          <Text style={[styles.fixesTitle, { color: textColor }]}>
            3 quick fixes lift your score to 92
          </Text>

          <View style={styles.fixList}>
            <TouchableOpacity
              style={styles.fixItem}
              onPress={() => toggleFix('fix1')}
              activeOpacity={0.7}
            >
              <Text style={styles.fixCheckIcon}>
                {fixApplied['fix1'] ? '✅' : '⚪'}
              </Text>
              <View style={styles.fixTextCol}>
                <Text style={[styles.fixItemTitle, { color: textColor }]}>
                  Revoke background mic access
                </Text>
                <Text style={[styles.fixItemSub, { color: subtextColor }]}>
                  Flashlight Ultra Pro requested audio permissions
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.fixItem}
              onPress={() => toggleFix('fix2')}
              activeOpacity={0.7}
            >
              <Text style={styles.fixCheckIcon}>
                {fixApplied['fix2'] ? '✅' : '⚪'}
              </Text>
              <View style={styles.fixTextCol}>
                <Text style={[styles.fixItemTitle, { color: textColor }]}>
                  Disconnect from open airport hotspot
                </Text>
                <Text style={[styles.fixItemSub, { color: subtextColor }]}>
                  Switch to encrypted cellular data
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.fixItem}
              onPress={() => toggleFix('fix3')}
              activeOpacity={0.7}
            >
              <Text style={styles.fixCheckIcon}>
                {fixApplied['fix3'] ? '✅' : '⚪'}
              </Text>
              <View style={styles.fixTextCol}>
                <Text style={[styles.fixItemTitle, { color: textColor }]}>
                  Enable DNS-over-HTTPS fallback
                </Text>
                <Text style={[styles.fixItemSub, { color: subtextColor }]}>
                  Prevents ISP and DNS snooping
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings & Alert Controls */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Alert Preferences</Text>

          <View style={[styles.settingRow, { borderBottomColor: borderCol }]}>
            <View style={styles.settingTextWrap}>
              <Text style={[styles.settingLabel, { color: textColor }]}>Insecure Wi-Fi Banners</Text>
              <Text style={[styles.settingDesc, { color: subtextColor }]}>
                Warn immediately when connecting to open networks
              </Text>
            </View>
            <Switch
              value={wifiAlerts}
              onValueChange={setWifiAlerts}
              trackColor={{ true: '#0D9488', false: '#CBD5E1' }}
            />
          </View>

          <View style={[styles.settingRow, { borderBottomColor: borderCol }]}>
            <View style={styles.settingTextWrap}>
              <Text style={[styles.settingLabel, { color: textColor }]}>Clipboard URL Scanning</Text>
              <Text style={[styles.settingDesc, { color: subtextColor }]}>
                Prompt before opening newly copied links
              </Text>
            </View>
            <Switch
              value={urlInterception}
              onValueChange={setUrlInterception}
              trackColor={{ true: '#0D9488', false: '#CBD5E1' }}
            />
          </View>

          <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
            <View style={styles.settingTextWrap}>
              <Text style={[styles.settingLabel, { color: textColor }]}>Quiet Hours (22:00 - 08:00)</Text>
              <Text style={[styles.settingDesc, { color: subtextColor }]}>
                Only high-risk active threats trigger alarms at night
              </Text>
            </View>
            <Switch
              value={quietHours}
              onValueChange={setQuietHours}
              trackColor={{ true: '#0D9488', false: '#CBD5E1' }}
            />
          </View>
        </View>

        {/* Privacy & Zero-Trust Pledge */}
        <View style={[styles.privacyBox, { backgroundColor: cardBg, borderColor: borderCol }]}>
          <Text style={styles.privacyHeading}>🛡️ Zero-Trust & Privacy Guarantee</Text>
          <Text style={[styles.privacyText, { color: subtextColor }]}>
            Cyber Companion is strictly private. Your browsing URLs, Wi-Fi networks, and app data never leave your device. All threat scoring uses pure, deterministic algorithms without generative hallucination.
          </Text>

          <TouchableOpacity style={styles.clearBtn} onPress={handleClearCache} activeOpacity={0.7}>
            <Text style={styles.clearBtnText}>Clear Local Cache & Scan History</Text>
          </TouchableOpacity>
        </View>

        {/* Version info */}
        <Text style={[styles.versionText, { color: subtextColor }]}>
          Cyber Companion v3 · v1.0.0 Release
        </Text>
      </ScrollView>
    </SafeAreaView>
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#0D9488',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  profileStatus: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  fixesSection: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    marginBottom: 24,
  },
  fixesHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F766E',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  fixesTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 14,
    letterSpacing: -0.2,
  },
  fixList: {
    gap: 12,
  },
  fixItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fixCheckIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  fixTextCol: {
    flex: 1,
  },
  fixItemTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  fixItemSub: {
    fontSize: 12,
    marginTop: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  settingTextWrap: {
    flex: 1,
    paddingRight: 16,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  settingDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  privacyBox: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    marginBottom: 20,
  },
  privacyHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0D9488',
    marginBottom: 6,
  },
  privacyText: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 16,
  },
  clearBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
  },
  clearBtnText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '700',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 8,
  },
});
