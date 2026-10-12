import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../services/AuthContext';
import { AuthModal } from '../components/AuthModal';

interface ProfileScreenProps {
  isDark?: boolean;
  onNavigateToScanners?: () => void;
  onReplayIntro?: () => void;
  toggleTheme?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  isDark = false,
  onNavigateToScanners,
  onReplayIntro,
  toggleTheme,
}) => {
  const { user, isAuthenticated, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [wifiAlerts, setWifiAlerts] = useState(true);
  const [urlInterception, setUrlInterception] = useState(true);
  const [quietHours, setQuietHours] = useState(true);
  const [fixApplied, setFixApplied] = useState<{ [key: string]: boolean }>({});

  const bg = isDark ? '#090D16' : '#F8FAFC';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const subtextColor = isDark ? '#94A3B8' : '#475569';
  const cardBg = isDark ? '#1E293B' : '#FFFFFF';
  const borderCol = isDark ? '#334155' : '#E2E8F0';
  const teal = isDark ? '#2DD4BF' : '#0D9488';
  const emerald = '#10B981';

  const handleClearCache = () => {
    Alert.alert(
      'Clear Local Data',
      'This will erase local scan cache and offline activity records. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out Sentinel Session', 'Are you sure you want to end this authenticated session?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          Alert.alert('Signed Out', 'You are now operating in anonymous local mode.');
        },
      },
    ]);
  };

  const toggleFix = (key: string) => {
    setFixApplied((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const displayName = user?.name || 'Arun V.';
  const displayEmail = user?.email || 'arun@cybercompanion.io';
  const displayScore = user?.securityScore || 78;

  return (
    <View style={[styles.safeArea, { backgroundColor: bg }]}>
      <ScrollView
        style={[styles.container, { backgroundColor: bg }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Operator Card */}
        <View style={[styles.profileCard, { backgroundColor: cardBg, borderColor: borderCol }]}>
          <View style={[styles.avatarCircle, { backgroundColor: teal }]}>
            <Text style={styles.avatarText}>{displayName.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={[styles.profileName, { color: textColor }]}>{displayName}</Text>
              <View style={[styles.tierPill, { borderColor: emerald }]}>
                <Text style={[styles.tierText, { color: emerald }]}>
                  {user?.tier || 'PRO_SENTINEL'}
                </Text>
              </View>
            </View>
            <Text style={[styles.profileEmail, { color: subtextColor }]}>{displayEmail}</Text>
            <Text style={[styles.profileStatus, { color: teal }]}>
              Verified Sentinel · Security Score {displayScore}/100
            </Text>
          </View>
        </View>

        {/* Authentication & Theme Actions */}
        <View style={styles.authRow}>
          {isAuthenticated ? (
            <TouchableOpacity
              style={[styles.authBtn, { backgroundColor: isDark ? '#334155' : '#F1F5F9', borderColor: borderCol }]}
              onPress={handleSignOut}
              activeOpacity={0.8}
            >
              <Text style={[styles.authBtnText, { color: '#EF4444' }]}>🚪 Sign Out Operator</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.authBtn, { backgroundColor: teal }]}
              onPress={() => setShowAuthModal(true)}
              activeOpacity={0.8}
            >
              <Text style={[styles.authBtnText, { color: '#FFFFFF' }]}>🔐 Sign In / Authenticate</Text>
            </TouchableOpacity>
          )}

          {toggleTheme && (
            <TouchableOpacity
              style={[styles.authBtn, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: borderCol }]}
              onPress={toggleTheme}
              activeOpacity={0.8}
            >
              <Text style={[styles.authBtnText, { color: textColor }]}>
                {isDark ? '☀️ Switch to Light' : '🌙 Switch to Dark'}
              </Text>
            </TouchableOpacity>
          )}

          {onReplayIntro && (
            <TouchableOpacity
              style={[styles.authBtn, { backgroundColor: isDark ? '#1E293B' : '#F0FDFA', borderColor: teal }]}
              onPress={onReplayIntro}
              activeOpacity={0.8}
            >
              <Text style={[styles.authBtnText, { color: teal }]}>🎬 Replay 3D Intro</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Quick Fixes Recommendation Card */}
        <View
          style={[
            styles.fixesSection,
            {
              backgroundColor: isDark ? '#1E293B' : '#F0FDFA',
              borderColor: isDark ? '#334155' : '#CCFBF1',
            },
          ]}
        >
          <Text style={[styles.fixesHeader, { color: teal }]}>RECOMMENDED ACTIONS</Text>
          <Text style={[styles.fixesTitle, { color: textColor }]}>
            3 quick fixes lift your score to 92
          </Text>

          <View style={styles.fixList}>
            <TouchableOpacity
              style={styles.fixItem}
              onPress={() => toggleFix('fix1')}
              activeOpacity={0.7}
            >
              <Text style={styles.fixCheckIcon}>{fixApplied['fix1'] ? '✅' : '⚪'}</Text>
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
              <Text style={styles.fixCheckIcon}>{fixApplied['fix2'] ? '✅' : '⚪'}</Text>
              <View style={styles.fixTextCol}>
                <Text style={[styles.fixItemTitle, { color: textColor }]}>
                  Disable auto-join to unencrypted Wi-Fi
                </Text>
                <Text style={[styles.fixItemSub, { color: subtextColor }]}>
                  Prevents Evil Twin spoofing in public venues
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.fixItem}
              onPress={() => toggleFix('fix3')}
              activeOpacity={0.7}
            >
              <Text style={styles.fixCheckIcon}>{fixApplied['fix3'] ? '✅' : '⚪'}</Text>
              <View style={styles.fixTextCol}>
                <Text style={[styles.fixItemTitle, { color: textColor }]}>
                  Enable sandboxed QR link interception
                </Text>
                <Text style={[styles.fixItemSub, { color: subtextColor }]}>
                  Inspects phishing targets before launching
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Guardian Preferences Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Protection Settings</Text>

          <View style={[styles.settingRow, { borderBottomColor: borderCol }]}>
            <View style={styles.settingTextWrap}>
              <Text style={[styles.settingLabel, { color: textColor }]}>Wi-Fi Sentinel Checks</Text>
              <Text style={[styles.settingDesc, { color: subtextColor }]}>
                Real-time alert on connecting to unencrypted networks
              </Text>
            </View>
            <Switch
              value={wifiAlerts}
              onValueChange={setWifiAlerts}
              trackColor={{ false: '#334155', true: teal }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.settingRow, { borderBottomColor: borderCol }]}>
            <View style={styles.settingTextWrap}>
              <Text style={[styles.settingLabel, { color: textColor }]}>Link & SSRF Guard</Text>
              <Text style={[styles.settingDesc, { color: subtextColor }]}>
                Block private RFC1918 loopback routing & homoglyphs
              </Text>
            </View>
            <Switch
              value={urlInterception}
              onValueChange={setUrlInterception}
              trackColor={{ false: '#334155', true: teal }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.settingRow, { borderBottomColor: borderCol }]}>
            <View style={styles.settingTextWrap}>
              <Text style={[styles.settingLabel, { color: textColor }]}>Quiet Hours</Text>
              <Text style={[styles.settingDesc, { color: subtextColor }]}>
                Mute non-critical threat tips between 22:00 – 07:00
              </Text>
            </View>
            <Switch
              value={quietHours}
              onValueChange={setQuietHours}
              trackColor={{ false: '#334155', true: teal }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Privacy & Zero-Trust Pledge Box */}
        <View style={[styles.privacyBox, { backgroundColor: cardBg, borderColor: borderCol }]}>
          <Text style={[styles.privacyHeading, { color: teal }]}>🔒 Zero-Trust Privacy Pledge</Text>
          <Text style={[styles.privacyText, { color: subtextColor }]}>
            Cyber Companion operates with strict on-device isolation. No scanned QR payloads, user
            URLs, Wi-Fi BSSIDs, or installed app catalogs are transmitted to external cloud systems.
          </Text>

          <TouchableOpacity
            style={styles.clearBtn}
            onPress={handleClearCache}
            activeOpacity={0.8}
          >
            <Text style={styles.clearBtnText}>Clear Local Scan Cache & Telemetry</Text>
          </TouchableOpacity>
        </View>

        {/* App Version Stamp */}
        <Text style={[styles.versionText, { color: subtextColor }]}>
          Cyber Companion v3.0.0 (Build 2026.10) · Final Release Candidate
        </Text>
      </ScrollView>

      {/* Auth Modal */}
      <AuthModal
        visible={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        isDark={isDark}
      />
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
    paddingTop: 8,
    paddingBottom: 40,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileName: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  tierPill: {
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  tierText: {
    fontSize: 9,
    fontWeight: '800',
  },
  profileEmail: {
    fontSize: 11,
    marginTop: 1,
  },
  profileStatus: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  authRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  authBtn: {
    flex: 1,
    minWidth: '45%',
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  fixesSection: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
  },
  fixesHeader: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  fixesTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  fixList: {
    gap: 10,
  },
  fixItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fixCheckIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  fixTextCol: {
    flex: 1,
  },
  fixItemTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  fixItemSub: {
    fontSize: 11,
    marginTop: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
    marginBottom: 8,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingTextWrap: {
    flex: 1,
    paddingRight: 14,
  },
  settingLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  settingDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  privacyBox: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  privacyHeading: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 4,
  },
  privacyText: {
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 12,
  },
  clearBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
  },
  clearBtnText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '700',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
  },
});
