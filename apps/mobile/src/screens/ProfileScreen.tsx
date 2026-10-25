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

  // API Gateway State
  const [apiUrl, setApiUrl] = useState(() => ApiClient.getBaseUrl());
  const [apiStatus, setApiStatus] = useState<'UNCHECKED' | 'CHECKING' | 'ONLINE' | 'OFFLINE'>('UNCHECKED');
  const [apiLatency, setApiLatency] = useState(0);

  const theme = isDark ? GlassTokens.colors.dark : GlassTokens.colors.light;
  const textColor = theme.textPrimary;
  const subtextColor = theme.textSecondary;
  const borderSubtle = theme.glassBorder;
  const emerald = '#10B981';
  const teal = '#0D9488';
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
    <View style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Operator Card in Liquid Glass */}
        <GlassCard isDark={isDark} style={styles.profileCard}>
          <View style={styles.profileRow}>
            <View style={styles.avatarBubble}>
              <Text style={styles.avatarText}>{displayName.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={[styles.profileName, { color: textColor }]}>{displayName}</Text>
                <View style={styles.tierPill}>
                  <Text style={styles.tierText}>{user?.tier || 'PRO_SENTINEL'}</Text>
                </View>
              </View>
              <Text style={[styles.profileEmail, { color: subtextColor }]}>{displayEmail}</Text>
              <View style={styles.scoreRow}>
                <View style={styles.scoreDot} />
                <Text style={[styles.profileStatus, { color: '#047857' }]}>
                  Verified Sentinel · Security Score {displayScore}/100
                </Text>
              </View>
            </View>
          </View>
        </GlassCard>

        {/* Action Pills Bar */}
        <View style={styles.authRow}>
          {isAuthenticated ? (
            <TouchableOpacity
              style={[
                styles.actionPill,
                {
                  backgroundColor: isDark ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.08)',
                  borderColor: 'rgba(239,68,68,0.3)',
                },
              ]}
              onPress={handleSignOut}
              activeOpacity={0.8}
            >
              <Text style={[styles.actionPillText, { color: danger }]}>🚪 Sign Out</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.actionPill,
                {
                  backgroundColor: isDark ? 'rgba(16,185,129,0.2)' : 'rgba(5,150,105,0.12)',
                  borderColor: 'rgba(16,185,129,0.3)',
                },
              ]}
              onPress={() => setShowAuthModal(true)}
              activeOpacity={0.8}
            >
              <Text style={[styles.actionPillText, { color: emerald }]}>🔐 Authenticate</Text>
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

          {onReplayIntro && (
            <TouchableOpacity
              style={[
                styles.actionPill,
                {
                  backgroundColor: isDark ? 'rgba(13,148,136,0.2)' : 'rgba(204,251,241,0.6)',
                  borderColor: 'rgba(13,148,136,0.3)',
                },
              ]}
              onPress={onReplayIntro}
              activeOpacity={0.8}
            >
              <Text style={[styles.actionPillText, { color: teal }]}>🎬 3D Intro</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Quick Fixes Recommendation Card */}
        <GlassCard isDark={isDark} style={styles.fixesCard}>
          <View style={styles.fixesHeaderRow}>
            <Text style={styles.fixesBadge}>SECURITY BOOST</Text>
            <Text style={styles.fixesPointsBadge}>+14 pts available</Text>
          </View>
          <Text style={[styles.fixesTitle, { color: textColor }]}>
            3 quick steps lift your score to 92
          </Text>

          <View style={styles.fixList}>
            <TouchableOpacity
              style={styles.fixItem}
              onPress={() => toggleFix('fix1')}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.fixCheckbox,
                  fixApplied['fix1'] && styles.fixCheckboxActive,
                ]}
              >
                <Text style={styles.fixCheckmark}>{fixApplied['fix1'] ? '✓' : ''}</Text>
              </View>
              <View style={styles.fixTextCol}>
                <Text style={[styles.fixItemTitle, { color: textColor }]}>
                  Revoke background microphone access
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
              <View
                style={[
                  styles.fixCheckbox,
                  fixApplied['fix2'] && styles.fixCheckboxActive,
                ]}
              >
                <Text style={styles.fixCheckmark}>{fixApplied['fix2'] ? '✓' : ''}</Text>
              </View>
              <View style={styles.fixTextCol}>
                <Text style={[styles.fixItemTitle, { color: textColor }]}>
                  Disable auto-join to open Wi-Fi
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
              <View
                style={[
                  styles.fixCheckbox,
                  fixApplied['fix3'] && styles.fixCheckboxActive,
                ]}
              >
                <Text style={styles.fixCheckmark}>{fixApplied['fix3'] ? '✓' : ''}</Text>
              </View>
              <View style={styles.fixTextCol}>
                <Text style={[styles.fixItemTitle, { color: textColor }]}>
                  Enable sandboxed QR link interception
                </Text>
                <Text style={[styles.fixItemSub, { color: subtextColor }]}>
                  Inspects phishing targets before opening browser
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </GlassCard>

        {/* Protection Settings Section in GlassCard */}
        <Text style={[styles.sectionHeading, { color: textColor }]}>Protection Settings</Text>
        <GlassCard isDark={isDark} style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingTextWrap}>
              <Text style={[styles.settingLabel, { color: textColor }]}>Wi-Fi Sentinel Checks</Text>
              <Text style={[styles.settingDesc, { color: subtextColor }]}>
                Real-time alert when connecting to unencrypted networks
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

        {/* Threat Gateway Endpoint in GlassCard */}
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
                  borderColor:
                    apiStatus === 'ONLINE'
                      ? 'rgba(16,185,129,0.4)'
                      : apiStatus === 'OFFLINE'
                      ? 'rgba(239,68,68,0.4)'
                      : 'rgba(203,213,225,0.4)',
                  backgroundColor:
                    apiStatus === 'ONLINE'
                      ? 'rgba(16,185,129,0.12)'
                      : apiStatus === 'OFFLINE'
                      ? 'rgba(239,68,68,0.12)'
                      : 'rgba(255,255,255,0.4)',
                },
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor:
                      apiStatus === 'ONLINE'
                        ? emerald
                        : apiStatus === 'OFFLINE'
                        ? danger
                        : apiStatus === 'CHECKING'
                        ? teal
                        : '#94A3B8',
                  },
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  {
                    color:
                      apiStatus === 'ONLINE'
                        ? emerald
                        : apiStatus === 'OFFLINE'
                        ? danger
                        : apiStatus === 'CHECKING'
                        ? teal
                        : subtextColor,
                  },
                ]}
              >
                {apiStatus === 'ONLINE'
                  ? `ONLINE (${apiLatency}ms)`
                  : apiStatus === 'OFFLINE'
                  ? 'OFFLINE'
                  : apiStatus === 'CHECKING'
                  ? 'CHECKING...'
                  : 'UNTESTED'}
              </Text>
            </View>
          </View>

          <View style={styles.urlInputRow}>
            <TextInput
              style={[
                styles.urlInput,
                {
                  backgroundColor: isDark ? 'rgba(15,23,42,0.6)' : 'rgba(255,255,255,0.8)',
                  borderColor: borderSubtle,
                  color: textColor,
                },
              ]}
              value={apiUrl}
              onChangeText={setApiUrl}
              placeholder="http://localhost:5000/v1"
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.testBtn}
              onPress={() => handleTestConnection()}
              disabled={apiStatus === 'CHECKING'}
              activeOpacity={0.8}
            >
              {apiStatus === 'CHECKING' ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.testBtnText}>Test Ping</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.presetRow}>
            <Text style={[styles.presetLabel, { color: subtextColor }]}>PRESETS:</Text>
            <TouchableOpacity
              style={[
                styles.presetBtn,
                {
                  backgroundColor: isDark ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.12)',
                  borderColor: isDark ? 'rgba(52,211,153,0.4)' : 'rgba(16,185,129,0.3)',
                },
              ]}
              onPress={() => handleApplyPreset('https://cyber-companion-v3.onrender.com/v1')}
            >
              <Text style={[styles.presetBtnText, { color: '#10B981', fontWeight: 'bold' }]}>Cloud 24/7</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.presetBtn,
                {
                  backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.6)',
                  borderColor: borderSubtle,
                },
              ]}
              onPress={() => handleApplyPreset('http://192.168.1.15:5000/v1')}
            >
              <Text style={[styles.presetBtnText, { color: textColor }]}>Wi-Fi LAN</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.presetBtn,
                {
                  backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.6)',
                  borderColor: borderSubtle,
                },
              ]}
              onPress={() => handleApplyPreset('http://127.0.0.1:5000/v1')}
            >
              <Text style={[styles.presetBtnText, { color: textColor }]}>Localhost</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>

        {/* Zero-Trust Privacy Pledge in GlassCard */}
        <GlassCard isDark={isDark} style={styles.privacyCard}>
          <Text style={[styles.privacyHeading, { color: '#047857' }]}>🔒 Zero-Trust Privacy Pledge</Text>
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
        </GlassCard>

        {/* App Version Stamp */}
        <Text style={[styles.versionText, { color: subtextColor }]}>
          Cyber Companion v3.0.0 · Final Release Candidate
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
    paddingBottom: 125, // Extra clearance for floating navigation bar
  },
  profileCard: {
    marginBottom: 14,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBubble: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#0D9488',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
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
    gap: 8,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  tierPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  tierText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 0.4,
  },
  profileEmail: {
    fontSize: 12,
    marginTop: 2,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 5,
  },
  scoreDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  profileStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  authRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  actionPill: {
    flex: 1,
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  actionPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  fixesCard: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  fixesHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  fixesBadge: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: '#059669',
  },
  fixesPointsBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  fixesTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 14,
  },
  fixList: {
    gap: 12,
  },
  fixItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fixCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  fixCheckboxActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  fixCheckmark: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
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
    marginTop: 2,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
    marginBottom: 10,
    marginLeft: 4,
  },
  settingsCard: {
    marginBottom: 20,
    paddingVertical: 4,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingDivider: {
    height: 1,
    width: '100%',
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
  gatewayCard: {
    marginBottom: 20,
  },
  gatewayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  gatewayTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  gatewaySub: {
    fontSize: 11,
    marginTop: 2,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  urlInputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  urlInput: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 12,
  },
  testBtn: {
    height: 42,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#0D9488',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  testBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  presetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  presetLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  presetBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  presetBtnText: {
    fontSize: 10,
    fontWeight: '700',
  },
  privacyCard: {
    marginBottom: 20,
  },
  privacyHeading: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 6,
  },
  privacyText: {
    fontSize: 11,
    lineHeight: 17,
    marginBottom: 14,
  },
  clearBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
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
