import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { CyberLogo } from '../components/CyberLogo';
import { Shield3DVisual } from '../components/Showcase3DVisuals';
import { WifiSentinelModal } from '../components/WifiSentinelModal';
import { LinkInspectorModal } from '../components/LinkInspectorModal';
import { QrScannerModal } from '../components/QrScannerModal';
import { AppPrivacyModal } from '../components/AppPrivacyModal';
import { useAuth } from '../services/AuthContext';
import { GlassCard } from '../design-system/GlassCard';
import { GlassTokens } from '../design-system/glassTokens';

interface DashboardScreenProps {
  onNavigateToScanners?: () => void;
  onNavigateToLearn?: () => void;
  onNavigateToWifiAnalyzer?: () => void;
  onNavigateToUrlScanner?: () => void;
  onNavigateToQrScanner?: () => void;
  onNavigateToPermissionAnalyzer?: () => void;
  onNavigateToSecurityScore?: () => void;
  isDark?: boolean;
  toggleTheme?: () => void;
}

type ToolKey = 'wifi' | 'url' | 'qr' | 'permissions';

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigateToLearn,
  onNavigateToWifiAnalyzer,
  onNavigateToUrlScanner,
  onNavigateToQrScanner,
  onNavigateToPermissionAnalyzer,
  onNavigateToSecurityScore,
  isDark = true,
  toggleTheme,
}) => {
  const { user } = useAuth();
  const theme = isDark ? GlassTokens.colors.dark : GlassTokens.colors.light;

  const displayName = user?.name || 'Anurag';
  const score = typeof user?.securityScore === 'number' ? user.securityScore : 78;

  const [activeModal, setActiveModal] = useState<ToolKey | null>(null);

  const handleToolPress = (tool: ToolKey) => {
    switch (tool) {
      case 'wifi':
        if (onNavigateToWifiAnalyzer) onNavigateToWifiAnalyzer();
        else setActiveModal('wifi');
        break;
      case 'url':
        if (onNavigateToUrlScanner) onNavigateToUrlScanner();
        else setActiveModal('url');
        break;
      case 'qr':
        if (onNavigateToQrScanner) onNavigateToQrScanner();
        else setActiveModal('qr');
        break;
      case 'permissions':
        if (onNavigateToPermissionAnalyzer) onNavigateToPermissionAnalyzer();
        else setActiveModal('permissions');
        break;
    }
  };

  const getStatusText = (s: number) => {
    if (s >= 80) return 'Good';
    if (s >= 65) return 'Moderate';
    return 'Action Needed';
  };

  return (
    <View style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.column}>
          {/* Header Bar */}
          <View style={styles.topHeaderBar}>
            <View style={styles.brandRow}>
              <CyberLogo size={32} isDark={isDark} animated={false} />
              <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                Cyber Companion
              </Text>
            </View>

            <View style={styles.headerRightActions}>
              {toggleTheme && (
                <TouchableOpacity
                  onPress={toggleTheme}
                  activeOpacity={0.75}
                  accessibilityRole="button"
                  accessibilityLabel={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
                  style={[
                    styles.iconBtn,
                    {
                      backgroundColor: isDark ? 'rgba(14, 27, 56, 0.8)' : '#FFFFFF',
                      borderColor: isDark ? 'rgba(56, 189, 248, 0.2)' : '#DCE6F0',
                    },
                  ]}
                >
                  <Text style={{ fontSize: 16 }}>{isDark ? '☀️' : '🌙'}</Text>
                </TouchableOpacity>
              )}

              {/* Notification Bell with Badge */}
              <TouchableOpacity
                style={[
                  styles.iconBtn,
                  {
                    backgroundColor: isDark ? 'rgba(14, 27, 56, 0.8)' : '#FFFFFF',
                    borderColor: isDark ? 'rgba(56, 189, 248, 0.2)' : '#DCE6F0',
                  },
                ]}
                activeOpacity={0.75}
                accessibilityRole="button"
                accessibilityLabel="Notifications"
              >
                <Text style={{ fontSize: 16 }}>🔔</Text>
                <View style={styles.notificationDot} />
              </TouchableOpacity>
            </View>
          </View>

          {/* User Greeting Section */}
          <View style={styles.greetingSection}>
            <Text style={[styles.greetingHeadline, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              Hello, {displayName} 👋
            </Text>
            <Text style={[styles.greetingSubtitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              Good digital habits keep you safe. Let's stay one step ahead.
            </Text>
          </View>

          {/* Hero Security Score Card matching reference showcase */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={onNavigateToSecurityScore}
            accessibilityRole="button"
            accessibilityLabel={`Security score is ${score} out of 100. Status is ${getStatusText(score)}. Tap to view detailed breakdown.`}
          >
            <GlassCard
              isDark={isDark}
              elevation="floating"
              borderRadius={28}
              style={[
                styles.scoreHeroCard,
                {
                  backgroundColor: isDark ? '#0E1B38' : 'rgba(255, 255, 255, 0.92)',
                  borderColor: isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(2, 132, 199, 0.25)',
                },
              ]}
            >
              <View style={styles.scoreHeroInner}>
                {/* Left Side: Score Arc & Details */}
                <View style={styles.scoreLeftCol}>
                  <View style={styles.scoreArcWrap}>
                    <Text style={[styles.scoreNumber, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                      {score}
                    </Text>
                    <Text style={[styles.scoreMax, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                      /100
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.statusPill,
                      {
                        backgroundColor:
                          score >= 80
                            ? 'rgba(16, 185, 129, 0.18)'
                            : 'rgba(56, 189, 248, 0.18)',
                        borderColor:
                          score >= 80 ? '#10B981' : isDark ? '#38BDF8' : '#0284C7',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        { color: score >= 80 ? '#10B981' : isDark ? '#38BDF8' : '#0284C7' },
                      ]}
                    >
                      {getStatusText(score)}
                    </Text>
                  </View>

                  <Text style={[styles.lastCheckedText, { color: isDark ? '#64748B' : '#94A3B8' }]}>
                    Last checked · Today, 9:42 AM
                  </Text>
                </View>

                {/* Right Side: Floating 3D Shield Illustration */}
                <View style={styles.scoreRightCol}>
                  <Shield3DVisual size={125} isDark={isDark} />
                </View>
              </View>
            </GlassCard>
          </TouchableOpacity>

          {/* Quick Tools Header */}
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              Quick Tools
            </Text>
          </View>

          {/* 2x2 Quick Tools Grid */}
          <View style={styles.toolsGrid}>
            {/* Tool 1: Wi-Fi Risk Analyzer */}
            <TouchableOpacity
              style={styles.toolCol}
              onPress={() => handleToolPress('wifi')}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.toolCard,
                  {
                    backgroundColor: isDark ? '#0E1B38' : 'rgba(255, 255, 255, 0.9)',
                    borderColor: isDark ? 'rgba(56, 189, 248, 0.18)' : '#DCE6F0',
                  },
                ]}
              >
                <View style={[styles.toolIconCircle, { backgroundColor: 'rgba(37, 99, 235, 0.2)' }]}>
                  <Text style={styles.toolGlyph}>📶</Text>
                </View>
                <Text style={[styles.toolTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                  Wi-Fi Risk Analyzer
                </Text>
                <Text style={[styles.toolSub, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  Check network safety
                </Text>
              </View>
            </TouchableOpacity>

            {/* Tool 2: URL Scanner */}
            <TouchableOpacity
              style={styles.toolCol}
              onPress={() => handleToolPress('url')}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.toolCard,
                  {
                    backgroundColor: isDark ? '#0E1B38' : 'rgba(255, 255, 255, 0.9)',
                    borderColor: isDark ? 'rgba(56, 189, 248, 0.18)' : '#DCE6F0',
                  },
                ]}
              >
                <View style={[styles.toolIconCircle, { backgroundColor: 'rgba(37, 99, 235, 0.2)' }]}>
                  <Text style={styles.toolGlyph}>🌐</Text>
                </View>
                <Text style={[styles.toolTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                  URL Scanner
                </Text>
                <Text style={[styles.toolSub, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  Detect malicious links
                </Text>
              </View>
            </TouchableOpacity>

            {/* Tool 3: QR Scanner */}
            <TouchableOpacity
              style={styles.toolCol}
              onPress={() => handleToolPress('qr')}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.toolCard,
                  {
                    backgroundColor: isDark ? '#0E1B38' : 'rgba(255, 255, 255, 0.9)',
                    borderColor: isDark ? 'rgba(56, 189, 248, 0.18)' : '#DCE6F0',
                  },
                ]}
              >
                <View style={[styles.toolIconCircle, { backgroundColor: 'rgba(37, 99, 235, 0.2)' }]}>
                  <Text style={styles.toolGlyph}>⛶</Text>
                </View>
                <Text style={[styles.toolTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                  QR Scanner
                </Text>
                <Text style={[styles.toolSub, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  Safe QR code decoding
                </Text>
              </View>
            </TouchableOpacity>

            {/* Tool 4: Permission Analyzer */}
            <TouchableOpacity
              style={styles.toolCol}
              onPress={() => handleToolPress('permissions')}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.toolCard,
                  {
                    backgroundColor: isDark ? '#0E1B38' : 'rgba(255, 255, 255, 0.9)',
                    borderColor: isDark ? 'rgba(56, 189, 248, 0.18)' : '#DCE6F0',
                  },
                ]}
              >
                <View style={[styles.toolIconCircle, { backgroundColor: 'rgba(37, 99, 235, 0.2)' }]}>
                  <Text style={styles.toolGlyph}>🛡️</Text>
                </View>
                <Text style={[styles.toolTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                  Permission Analyzer
                </Text>
                <Text style={[styles.toolSub, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  Audit risky permissions
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Security Tip Card */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onNavigateToLearn}
            style={styles.tipCardWrap}
          >
            <View
              style={[
                styles.tipCard,
                {
                  backgroundColor: isDark ? '#0E1B38' : 'rgba(255, 255, 255, 0.9)',
                  borderColor: isDark ? 'rgba(245, 158, 11, 0.3)' : 'rgba(245, 158, 11, 0.3)',
                },
              ]}
            >
              <View style={styles.tipInnerRow}>
                <View style={styles.tipIconBubble}>
                  <Text style={{ fontSize: 22 }}>💡</Text>
                </View>
                <View style={styles.tipTextWrap}>
                  <Text style={[styles.tipTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                    Security Tip
                  </Text>
                  <Text style={[styles.tipBody, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                    Avoid connecting to open public Wi-Fi networks without an encrypted VPN tunnel.
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Fallback Modals */}
      <WifiSentinelModal
        visible={activeModal === 'wifi'}
        onClose={() => setActiveModal(null)}
        isDark={isDark}
      />
      <LinkInspectorModal
        visible={activeModal === 'url'}
        onClose={() => setActiveModal(null)}
        isDark={isDark}
      />
      <QrScannerModal
        visible={activeModal === 'qr'}
        onClose={() => setActiveModal(null)}
        isDark={isDark}
      />
      <AppPrivacyModal
        visible={activeModal === 'permissions'}
        onClose={() => setActiveModal(null)}
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
    paddingTop: Platform.OS === 'android' ? 12 : 8,
    paddingBottom: 130, // Clearance for bottom navigation bar
    alignItems: 'center',
  },
  column: {
    width: '100%',
    maxWidth: GlassTokens.layout.maxContentWidth,
  },
  topHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#EF4444',
  },
  greetingSection: {
    marginTop: 12,
    marginBottom: 16,
  },
  greetingHeadline: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  greetingSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  scoreHeroCard: {
    marginBottom: 20,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  scoreHeroInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  scoreLeftCol: {
    flex: 1.1,
    gap: 6,
  },
  scoreArcWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: -1.5,
    lineHeight: 52,
  },
  scoreMax: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 3,
  },
  statusPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 2,
    marginBottom: 6,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  lastCheckedText: {
    fontSize: 12,
    fontWeight: '500',
  },
  scoreRightCol: {
    flex: 0.9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeaderRow: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginBottom: 14,
  },
  toolCol: {
    width: '50%',
    padding: 6,
  },
  toolCard: {
    borderRadius: 20,
    borderWidth: 1.2,
    padding: 16,
    minHeight: 142,
    justifyContent: 'space-between',
  },
  toolIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  toolGlyph: {
    fontSize: 20,
  },
  toolTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  toolSub: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
  tipCardWrap: {
    marginTop: 4,
  },
  tipCard: {
    borderRadius: 20,
    borderWidth: 1.2,
    padding: 16,
  },
  tipInnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  tipIconBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipTextWrap: {
    flex: 1,
    gap: 2,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  tipBody: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
});
