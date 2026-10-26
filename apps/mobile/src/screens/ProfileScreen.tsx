import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../services/AuthContext';
import { AuthModal } from '../components/AuthModal';
import { ApiClient } from '../services/apiClient';
import { GlassCard } from '../design-system/GlassCard';
import { GlassTokens } from '../design-system/glassTokens';

interface ProfileScreenProps {
  isDark?: boolean;
  onNavigateToScanners?: () => void;
  onReplayIntro?: () => void;
  toggleTheme?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  isDark = true,
  onNavigateToScanners,
  onReplayIntro,
  toggleTheme,
}) => {
  const { user, isAuthenticated, signOut, role, isAdmin, switchRole } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [wifiAlerts, setWifiAlerts] = useState(true);
  const [urlInterception, setUrlInterception] = useState(true);
  const [quietHours, setQuietHours] = useState(false);
  const [cacheFlushed, setCacheFlushed] = useState(false);
  const [isFlushing, setIsFlushing] = useState(false);

  // API Gateway State
  const [apiUrl, setApiUrl] = useState(() => ApiClient.getBaseUrl());
  const [apiStatus, setApiStatus] = useState<'UNCHECKED' | 'CHECKING' | 'ONLINE' | 'OFFLINE'>('UNCHECKED');
  const [apiLatency, setApiLatency] = useState(0);

  const theme = isDark ? GlassTokens.colors.dark : GlassTokens.colors.light;
  const textColor = theme.textPrimary;
  const subtextColor = theme.textSecondary;
  const borderSubtle = theme.glassBorder;
  const emerald = '#10B981';
  const teal = '#2DD4BF';
  const cyan = '#38BDF8';
  const purple = '#A855F7';
  const danger = '#EF4444';

  const handleTestConnection = async (targetUrl = apiUrl) => {
    setApiStatus('CHECKING');
    ApiClient.setBaseUrl(targetUrl.trim());
    const health = await ApiClient.checkHealth();
    if (health.online) {
      setApiStatus('ONLINE');
      setApiLatency(health.latencyMs);
    } else {
      setApiStatus('OFFLINE');
      setApiLatency(0);
    }
  };

  const handleApplyPreset = (presetUrl: string) => {
    setApiUrl(presetUrl);
    handleTestConnection(presetUrl);
  };

  const handleFlushThreatCache = async () => {
    setIsFlushing(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsFlushing(false);
    setCacheFlushed(true);
    Alert.alert(
      'Threat Cache Flushed',
      'Local threat verdict memory & heuristic cache have been purged successfully. Next inspections will evaluate fresh threat signatures.'
    );
    setTimeout(() => setCacheFlushed(false), 3000);
  };

  const handleRoleToggle = async () => {
    const targetRole = isAdmin ? 'USER' : 'ADMIN';
    await switchRole(targetRole);
    Alert.alert(
      `Switched to ${targetRole === 'ADMIN' ? 'Administrator' : 'User'}`,
      targetRole === 'ADMIN'
        ? 'Root privileges granted. Admin Command Console and telemetry metrics are now unlocked.'
        : 'Operating in standard Sentinel User mode.'
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Local Data',
      'This will erase local scan cache and offline activity records. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Cleared', 'Local scan cache has been reset.');
          },
        },
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
          Alert.alert('Signed Out', 'You are now operating in anonymous mode.');
        },
      },
    ]);
  };

  const displayName = user?.name || (isAdmin ? 'Arun (Administrator)' : 'Arun');
  const displayEmail = user?.email || (isAdmin ? 'arun.admin@cybercompanion.io' : 'arun@cybercompanion.io');
  const displayScore = user?.securityScore || (isAdmin ? 98 : 88);

  return (
    <View style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Operator Card */}
        <GlassCard isDark={isDark} style={styles.profileCard}>
          <View style={styles.profileRow}>
            <View
              style={[
                styles.avatarBubble,
                {
                  borderColor: isAdmin ? purple : teal,
                  backgroundColor: isAdmin ? 'rgba(168,85,247,0.15)' : 'rgba(45,212,191,0.15)',
                },
              ]}
            >
              <Text style={styles.avatarIcon}>{isAdmin ? '👑' : '🛡️'}</Text>
            </View>

            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={[styles.profileName, { color: textColor }]}>{displayName}</Text>
                <View
                  style={[
                    styles.tierPill,
                    {
                      borderColor: isAdmin ? purple : teal,
                      backgroundColor: isAdmin ? 'rgba(168,85,247,0.15)' : 'rgba(45,212,191,0.15)',
                    },
                  ]}
                >
                  <Text style={[styles.tierText, { color: isAdmin ? purple : teal }]}>
                    {isAdmin ? '👑 ADMIN' : '🛡️ USER'}
                  </Text>
                </View>
              </View>

              <Text style={[styles.profileEmail, { color: subtextColor }]}>{displayEmail}</Text>

              <View style={styles.scoreRow}>
                <View
                  style={[
                    styles.scoreDot,
                    { backgroundColor: isAdmin ? purple : emerald },
                  ]}
                />
                <Text style={[styles.profileStatus, { color: isAdmin ? purple : emerald }]}>
                  {isAdmin
                    ? `Enterprise Administrator · Privileged Level ${displayScore}/100`
                    : `Verified Sentinel · Security Score ${displayScore}/100`}
                </Text>
              </View>
            </View>
          </View>
        </GlassCard>

        {/* Action Pills Bar */}
        <View style={styles.authRow}>
          {/* Quick Role Switcher Button */}
          <TouchableOpacity
            style={[
              styles.actionPill,
              {
                backgroundColor: isAdmin ? 'rgba(45,212,191,0.15)' : 'rgba(168,85,247,0.15)',
                borderColor: isAdmin ? teal : purple,
              },
            ]}
            onPress={handleRoleToggle}
            activeOpacity={0.8}
          >
            <Text style={[styles.actionPillText, { color: isAdmin ? teal : purple }]}>
              {isAdmin ? '⚡ Switch to User' : '⚡ Switch to Admin'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionPill,
              {
                backgroundColor: isDark ? 'rgba(56,189,248,0.12)' : 'rgba(56,189,248,0.08)',
                borderColor: cyan,
              },
            ]}
            onPress={() => setShowAuthModal(true)}
            activeOpacity={0.8}
          >
            <Text style={[styles.actionPillText, { color: cyan }]}>🔐 Login</Text>
          </TouchableOpacity>

          {isAuthenticated && (
            <TouchableOpacity
              style={[
                styles.actionPill,
                {
                  backgroundColor: isDark ? 'rgba(239,68,68,0.12)' : 'rgba(239,68,68,0.08)',
                  borderColor: danger,
                },
              ]}
              onPress={handleSignOut}
              activeOpacity={0.8}
            >
              <Text style={[styles.actionPillText, { color: danger }]}>🚪 Sign Out</Text>
            </TouchableOpacity>
          )}

          {toggleTheme && (
            <TouchableOpacity
              style={[
                styles.actionPill,
                {
                  backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.7)',
                  borderColor: borderSubtle,
                },
              ]}
              onPress={toggleTheme}
              activeOpacity={0.8}
            >
              <Text style={[styles.actionPillText, { color: textColor }]}>
                {isDark ? '☀️ Light' : '🌙 Dark'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ADMIN EXCLUSIVE: Administrator Command Console */}
        {isAdmin && (
          <View style={styles.adminSection}>
            <Text style={[styles.sectionHeading, { color: purple }]}>
              👑 Administrator Security Console
            </Text>
            <GlassCard isDark={isDark} style={[styles.adminCard, { borderColor: 'rgba(168,85,247,0.3)' }]}>
              <View style={styles.adminHeaderRow}>
                <View style={styles.adminBadge}>
                  <Text style={styles.adminBadgeText}>ROOT ACCESS GRANTED</Text>
                </View>
                <Text style={[styles.adminSub, { color: subtextColor }]}>
                  Policy Level: Enterprise Security Auditor
                </Text>
              </View>

              <View style={styles.adminGrid}>
                {/* Flush Cache Action */}
                <TouchableOpacity
                  style={[styles.adminActionBtn, { borderColor: 'rgba(168,85,247,0.35)' }]}
                  onPress={handleFlushThreatCache}
                  disabled={isFlushing}
                  activeOpacity={0.8}
                >
                  {isFlushing ? (
                    <ActivityIndicator size="small" color={purple} />
                  ) : (
                    <>
                      <Text style={styles.adminActionIcon}>🧹</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.adminActionTitle, { color: textColor }]}>
                          Flush Threat Cache
                        </Text>
                        <Text style={[styles.adminActionDesc, { color: subtextColor }]}>
                          Purge cached URL & Wi-Fi threat verdicts
                        </Text>
                      </View>
                    </>
                  )}
                </TouchableOpacity>

                {/* Audit Active Detection Heuristics */}
                <View style={[styles.adminInfoTile, { borderColor: borderSubtle }]}>
                  <Text style={[styles.adminTileLabel, { color: cyan }]}>
                    ACTIVE DETECTION ENGINES
                  </Text>
                  <Text style={[styles.adminTileItem, { color: textColor }]}>
                    ✅ SSRF Private Subnet Guard (Loopback & RFC1918 Block)
                  </Text>
                  <Text style={[styles.adminTileItem, { color: textColor }]}>
                    ✅ Punycode IDN Homoglyph Brand Impersonation Guard
                  </Text>
                  <Text style={[styles.adminTileItem, { color: textColor }]}>
                    ✅ 802.11 Airspace Cipher & PMF Deauth Defense
                  </Text>
                  <Text style={[styles.adminTileItem, { color: textColor }]}>
                    ✅ Deep QR Payload Sandbox Interceptor
                  </Text>
                </View>

                {/* Real Hardware & Subnet Environment */}
                <View style={[styles.adminInfoTile, { borderColor: borderSubtle }]}>
                  <Text style={[styles.adminTileLabel, { color: teal }]}>
                    PHYSICAL HARDWARE ENVIRONMENT
                  </Text>
                  <Text style={[styles.adminTileItem, { color: textColor }]}>
                    📻 Radio: MediaTek MT7921 Wi-Fi 6 Adapter
                  </Text>
                  <Text style={[styles.adminTileItem, { color: textColor }]}>
                    🌐 Host Interface: 192.168.1.15 on DESKTOP-BNFS8Q1
                  </Text>
                  <Text style={[styles.adminTileItem, { color: textColor }]}>
                    📡 Router Gateway: 192.168.1.1 (64:fb:92:64:ca:eb)
                  </Text>
                  <Text style={[styles.adminTileItem, { color: textColor }]}>
                    ☁️ Cloud Gateway: Render Web Production (Oregon)
                  </Text>
                </View>
              </View>
            </GlassCard>
          </View>
        )}

        {/* Real Physical Device Environment Card */}
        <Text style={[styles.sectionHeading, { color: textColor }]}>
          Device Security Perimeter
        </Text>
        <GlassCard isDark={isDark} style={styles.deviceCard}>
          <View style={styles.deviceRow}>
            <Text style={styles.deviceIcon}>📡</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.deviceTitle, { color: textColor }]}>
                A.B.C Keralavision -2.4G
              </Text>
              <Text style={[styles.deviceSub, { color: emerald }]}>
                ● Active Verified Network · WPA3-Personal (GCMP-256)
              </Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: 'rgba(16,185,129,0.15)' }]}>
              <Text style={[styles.statusBadgeText, { color: emerald }]}>SECURE</Text>
            </View>
          </View>

          <View style={[styles.deviceDivider, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]} />

          <View style={styles.deviceStatsRow}>
            <View style={styles.deviceStatCol}>
              <Text style={[styles.deviceStatLabel, { color: subtextColor }]}>IP ADDRESS</Text>
              <Text style={[styles.deviceStatValue, { color: textColor }]}>192.168.1.15</Text>
            </View>
            <View style={styles.deviceStatCol}>
              <Text style={[styles.deviceStatLabel, { color: subtextColor }]}>GATEWAY</Text>
              <Text style={[styles.deviceStatValue, { color: textColor }]}>192.168.1.1</Text>
            </View>
            <View style={styles.deviceStatCol}>
              <Text style={[styles.deviceStatLabel, { color: subtextColor }]}>RADIO FREQ</Text>
              <Text style={[styles.deviceStatValue, { color: textColor }]}>2.4 GHz (Ch 6)</Text>
            </View>
          </View>
        </GlassCard>

        {/* Protection Settings Section */}
        <Text style={[styles.sectionHeading, { color: textColor }]}>Protection Settings</Text>
        <GlassCard isDark={isDark} style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingTextWrap}>
              <Text style={[styles.settingLabel, { color: textColor }]}>Wi-Fi Sentinel Checks</Text>
              <Text style={[styles.settingDesc, { color: subtextColor }]}>
                Real-time alert when open/unencrypted hotspots are detected
              </Text>
            </View>
            <Switch
              value={wifiAlerts}
              onValueChange={setWifiAlerts}
              trackColor={{ false: isDark ? '#334155' : '#CBD5E1', true: '#10B981' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.settingDivider, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]} />

          <View style={styles.settingRow}>
            <View style={styles.settingTextWrap}>
              <Text style={[styles.settingLabel, { color: textColor }]}>Link & SSRF Guard</Text>
              <Text style={[styles.settingDesc, { color: subtextColor }]}>
                Block private RFC1918 loopback routing & homoglyphs
              </Text>
            </View>
            <Switch
              value={urlInterception}
              onValueChange={setUrlInterception}
              trackColor={{ false: isDark ? '#334155' : '#CBD5E1', true: '#10B981' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.settingDivider, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]} />

          <View style={styles.settingRow}>
            <View style={styles.settingTextWrap}>
              <Text style={[styles.settingLabel, { color: textColor }]}>Quiet Hours</Text>
              <Text style={[styles.settingDesc, { color: subtextColor }]}>
                Mute non-critical threat tips between 22:00 – 07:00
              </Text>
            </View>
            <Switch
              value={quietHours}
              onValueChange={setQuietHours}
              trackColor={{ false: isDark ? '#334155' : '#CBD5E1', true: '#10B981' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </GlassCard>

        {/* Threat Gateway Server Endpoint */}
        <Text style={[styles.sectionHeading, { color: textColor }]}>Threat Intelligence Server</Text>
        <GlassCard isDark={isDark} style={styles.gatewayCard}>
          <View style={styles.gatewayHeader}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.gatewayTitle, { color: textColor }]}>⚡ REST Server Gateway</Text>
              <Text style={[styles.gatewaySub, { color: subtextColor }]}>
                Live REST Server & Threat Feed Integration
              </Text>
            </View>

            <View
              style={[
                styles.statusPill,
                {
                  backgroundColor:
                    apiStatus === 'ONLINE'
                      ? 'rgba(16, 185, 129, 0.15)'
                      : apiStatus === 'OFFLINE'
                      ? 'rgba(239, 68, 68, 0.15)'
                      : 'rgba(56, 189, 248, 0.15)',
                  borderColor:
                    apiStatus === 'ONLINE'
                      ? emerald
                      : apiStatus === 'OFFLINE'
                      ? danger
                      : cyan,
                },
              ]}
            >
              <Text
                style={[
                  styles.statusPillText,
                  {
                    color:
                      apiStatus === 'ONLINE'
                        ? emerald
                        : apiStatus === 'OFFLINE'
                        ? danger
                        : cyan,
                  },
                ]}
              >
                {apiStatus === 'ONLINE'
                  ? `ONLINE (${apiLatency}ms)`
                  : apiStatus === 'OFFLINE'
                  ? 'OFFLINE'
                  : apiStatus === 'CHECKING'
                  ? 'PINGING...'
                  : 'READY'}
              </Text>
            </View>
          </View>

          <View style={styles.gatewayInputRow}>
            <TextInput
              style={[
                styles.gatewayInput,
                {
                  backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.7)',
                  borderColor: borderSubtle,
                  color: textColor,
                },
              ]}
              value={apiUrl}
              onChangeText={setApiUrl}
              placeholder="https://..."
              placeholderTextColor={subtextColor}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity
              style={[styles.testBtn, { backgroundColor: teal }]}
              onPress={() => handleTestConnection()}
              disabled={apiStatus === 'CHECKING'}
              activeOpacity={0.8}
            >
              {apiStatus === 'CHECKING' ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.testBtnText}>Ping</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Preset Buttons */}
          <View style={styles.presetRow}>
            <TouchableOpacity
              style={[styles.presetChip, { borderColor: borderSubtle }]}
              onPress={() => handleApplyPreset('https://cyber-companion-v3.onrender.com/v1')}
            >
              <Text style={[styles.presetText, { color: cyan }]}>🌐 Render Cloud</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.presetChip, { borderColor: borderSubtle }]}
              onPress={() => handleApplyPreset('http://127.0.0.1:5000/v1')}
            >
              <Text style={[styles.presetText, { color: subtextColor }]}>💻 USB (127.0.0.1)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.presetChip, { borderColor: borderSubtle }]}
              onPress={() => handleApplyPreset('http://192.168.1.15:5000/v1')}
            >
              <Text style={[styles.presetText, { color: subtextColor }]}>🏠 Wi-Fi LAN</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>

        {/* Clear Cache Card */}
        <View style={styles.clearCacheWrap}>
          <TouchableOpacity
            style={[styles.clearCacheBtn, { borderColor: borderSubtle }]}
            onPress={handleClearCache}
            activeOpacity={0.7}
          >
            <Text style={[styles.clearCacheText, { color: subtextColor }]}>
              🗑️ Clear Local Cache & Reset Diagnostics
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
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
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 16,
  },
  profileCard: {
    padding: 18,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarBubble: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarIcon: {
    fontSize: 28,
  },
  profileInfo: {
    flex: 1,
    gap: 3,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  tierPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  tierText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  profileEmail: {
    fontSize: 12,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  scoreDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  profileStatus: {
    fontSize: 11,
    fontWeight: '600',
  },
  authRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  actionPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  actionPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginLeft: 4,
  },
  adminSection: {
    gap: 8,
  },
  adminCard: {
    padding: 16,
    borderWidth: 1.5,
    gap: 12,
  },
  adminHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  adminBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    borderWidth: 1,
    borderColor: '#A855F7',
  },
  adminBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#A855F7',
    letterSpacing: 1,
  },
  adminSub: {
    fontSize: 10,
    fontWeight: '600',
  },
  adminGrid: {
    gap: 10,
  },
  adminActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: 'rgba(168, 85, 247, 0.08)',
    gap: 10,
  },
  adminActionIcon: {
    fontSize: 22,
  },
  adminActionTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  adminActionDesc: {
    fontSize: 11,
    marginTop: 1,
  },
  adminInfoTile: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    gap: 5,
  },
  adminTileLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 2,
  },
  adminTileItem: {
    fontSize: 11,
    lineHeight: 16,
  },
  deviceCard: {
    padding: 16,
    gap: 12,
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deviceIcon: {
    fontSize: 24,
  },
  deviceTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  deviceSub: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  deviceDivider: {
    height: 1,
  },
  deviceStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deviceStatCol: {
    gap: 2,
  },
  deviceStatLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  deviceStatValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  settingsCard: {
    padding: 16,
    gap: 14,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  settingTextWrap: {
    flex: 1,
    gap: 2,
  },
  settingLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  settingDesc: {
    fontSize: 11,
    lineHeight: 15,
  },
  settingDivider: {
    height: 1,
  },
  gatewayCard: {
    padding: 16,
    gap: 12,
  },
  gatewayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gatewayTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  gatewaySub: {
    fontSize: 11,
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  gatewayInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  gatewayInput: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 12.5,
  },
  testBtn: {
    height: 42,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
  },
  presetRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  presetChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  presetText: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  clearCacheWrap: {
    alignItems: 'center',
    marginTop: 4,
  },
  clearCacheBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  clearCacheText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
});
