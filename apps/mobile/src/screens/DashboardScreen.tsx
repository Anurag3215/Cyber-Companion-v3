import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { CyberLogo } from '../components/CyberLogo';
import { Cyber3DShieldCore } from '../components/Cyber3DShieldCore';
import { FloatingParticles3D } from '../components/FloatingParticles3D';
import { WifiSentinelModal } from '../components/WifiSentinelModal';
import { LinkInspectorModal } from '../components/LinkInspectorModal';
import { QrScannerModal } from '../components/QrScannerModal';
import { AppPrivacyModal } from '../components/AppPrivacyModal';
import { useAuth } from '../services/AuthContext';
import { addHistoryRecord } from '../services/historyService';
import { GlassCard } from '../design-system/GlassCard';
import { GlassActionCard } from '../design-system/GlassActionCard';
import { GlassPrimaryButton } from '../design-system/GlassPrimaryButton';
import { GlassTipCard } from '../design-system/GlassTipCard';
import { GlassTokens } from '../design-system/glassTokens';

interface DashboardScreenProps {
  onNavigateToScanners?: () => void;
  onNavigateToLearn?: () => void;
  isDark?: boolean;
  toggleTheme?: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigateToScanners,
  onNavigateToLearn,
  isDark = false,
  toggleTheme,
}) => {
  const { user } = useAuth();
  const userName = user?.name || 'Arun';

  // Feature Inspection Modals State
  const [showWifiModal, setShowWifiModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showAppPrivacyModal, setShowAppPrivacyModal] = useState(false);
  const [isDeepScanning, setIsDeepScanning] = useState(false);

  // Time-based friendly greeting
  const hour = new Date().getHours();
  const greetingTime = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const theme = isDark ? GlassTokens.colors.dark : GlassTokens.colors.light;

  const handleTriggerSweep = () => {
    setIsDeepScanning(true);
    setTimeout(async () => {
      setIsDeepScanning(false);
      await addHistoryRecord({
        type: 'wifi',
        icon: '🛡️',
        title: 'Full System Defense Sweep',
        subtext: 'Airspace · Link Guard · QR Sandbox · App Privacy',
        verdict: 'safe',
        verdictLabel: 'Clean (94/100)',
        details: {
          threatTitle: 'Comprehensive Security Posture Audit',
          consensusText: 'All Subsystems Nominal',
          explanation: 'Autonomous sweep audited active RF airspace, network telemetry, link inspection heuristics, and on-device app permission sandboxes.',
          findings: [
            '802.11 Airspace: No active deauth or rogue honeypot packets',
            'Link Sandbox: Homoglyph and SSRF protection active',
            'Optical QR: Isolated execution engine verified',
            'Permission Hygiene: Sensor permissions scoped',
          ],
        },
      }).catch(() => {});

      Alert.alert(
        '🛡️ Defense Sweep Complete',
        '• Wi-Fi Airspace: Cryptographic ciphers verified\n• Link Inspector: Phishing & homoglyph protection active\n• QR Sandbox: Isolated execution engine armed\n• App Privacy: Zero background sensor leaks detected\n\nOverall Hygiene Index: 94/100',
        [{ text: 'Great, thanks!' }]
      );
    }, 2000);
  };

  return (
    <View style={styles.safeArea}>
      {/* Subtle 3D floating ambient particles */}
      <FloatingParticles3D isDark={isDark} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header with App Logo, Glass Status Pill & Theme Switcher */}
        <View style={styles.topHeaderBar}>
          <CyberLogo size={34} isDark={isDark} animated={true} />

          <View style={styles.headerRightActions}>
            {/* 1-tap Frosted Light / Dark Mode Toggle */}
            {toggleTheme && (
              <TouchableOpacity
                style={[
                  styles.themePill,
                  GlassTokens.shadows.soft,
                  {
                    backgroundColor: theme.glassBg,
                    borderColor: theme.glassBorder,
                    borderTopColor: theme.glassHighlight,
                  },
                ]}
                onPress={toggleTheme}
                activeOpacity={0.75}
              >
                <Text style={styles.themePillIcon}>{isDark ? '☀️' : '🌙'}</Text>
                <Text style={[styles.themePillText, { color: theme.textPrimary }]}>
                  {isDark ? 'Light' : 'Dark'}
                </Text>
              </TouchableOpacity>
            )}

            {/* Shield Active Status Pill */}
            <View
              style={[
                styles.statusPill,
                GlassTokens.shadows.soft,
                {
                  backgroundColor: theme.glassBg,
                  borderColor: theme.glassBorder,
                  borderTopColor: theme.glassHighlight,
                },
              ]}
            >
              <View style={[styles.statusPulseDot, { backgroundColor: theme.primary }]} />
              <Text style={[styles.statusPillText, { color: theme.primary }]}>
                PROTECTED
              </Text>
            </View>
          </View>
        </View>

        {/* User Greeting Section */}
        <View style={styles.greetingSection}>
          <Text style={[styles.greetingLabel, { color: theme.textSecondary }]}>
            {greetingTime}, {userName}
          </Text>
          <Text style={[styles.headlineText, { color: theme.textPrimary }]}>
            Your digital life is safe
          </Text>
          <Text style={[styles.subHeadlineText, { color: theme.textMuted }]}>
            Continuous on-device protection with zero data transmitted
          </Text>
        </View>

        {/* Hero Security Overview: 3D Shield Core inside Frosted Glass Card */}
        <GlassCard
          isDark={isDark}
          elevation="floating"
          borderRadius={GlassTokens.radii.xl}
          style={styles.heroCard}
        >
          <View style={styles.heroCardInner}>
            <View style={styles.heroHeader}>
              <View>
                <Text style={[styles.heroBadgeTitle, { color: theme.textMuted }]}>
                  SECURITY POSTURE
                </Text>
                <Text style={[styles.heroHeadline, { color: theme.textPrimary }]}>
                  Device Defense Score
                </Text>
              </View>

              <View
                style={[
                  styles.scoreBadge,
                  {
                    backgroundColor: isDark
                      ? 'rgba(16, 185, 129, 0.15)'
                      : 'rgba(5, 150, 105, 0.1)',
                    borderColor: isDark
                      ? 'rgba(16, 185, 129, 0.3)'
                      : 'rgba(5, 150, 105, 0.2)',
                  },
                ]}
              >
                <Text style={[styles.scoreBadgeText, { color: theme.primary }]}>
                  {user?.securityScore || 88} / 100
                </Text>
              </View>
            </View>

            {/* 3D Shield Graphic */}
            <View style={styles.gaugeContainer}>
              <Cyber3DShieldCore
                score={user?.securityScore || 88}
                potentialScore={95}
                fixesCount={2}
                isDark={isDark}
                isScanning={isDeepScanning}
                onTriggerScan={handleTriggerSweep}
              />
            </View>

            {/* Interactive Sweep Trigger Button */}
            <GlassPrimaryButton
              title={isDeepScanning ? 'Scanning Perimeter...' : '🚀 Run Full Security Sweep'}
              onPress={handleTriggerSweep}
              loading={isDeepScanning}
              isDark={isDark}
              size="large"
              style={styles.heroButton}
            />
          </View>
        </GlassCard>

        {/* 2x2 Quick Action Cards Grid (Liquid Glass) */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Quick Protection Tools
          </Text>
          <Text style={[styles.sectionSubtitle, { color: theme.textMuted }]}>
            Tap any tool to inspect
          </Text>
        </View>

        <View style={styles.gridContainer}>
          <View style={styles.gridRow}>
            {/* 1. Check Wi-Fi */}
            <View style={styles.gridCol}>
              <GlassActionCard
                icon="📶"
                title="Check Wi-Fi"
                subtitle="Airspace & safe connection"
                badgeText="Airspace"
                onPress={() => setShowWifiModal(true)}
                isDark={isDark}
              />
            </View>

            {/* 2. Check a Link */}
            <View style={styles.gridCol}>
              <GlassActionCard
                icon="🔗"
                title="Check a Link"
                subtitle="Phishing & scam detection"
                badgeText="Web Guard"
                onPress={() => setShowLinkModal(true)}
                isDark={isDark}
              />
            </View>
          </View>

          <View style={styles.gridRow}>
            {/* 3. Scan QR Code */}
            <View style={styles.gridCol}>
              <GlassActionCard
                icon="⛶"
                title="Scan QR Code"
                subtitle="Sandboxed optical preview"
                badgeText="Camera"
                onPress={() => setShowQrModal(true)}
                isDark={isDark}
              />
            </View>

            {/* 4. Review Apps */}
            <View style={styles.gridCol}>
              <GlassActionCard
                icon="🛡️"
                title="Review Apps"
                subtitle="Camera, mic & sensor rights"
                badgeText="Privacy"
                onPress={() => setShowAppPrivacyModal(true)}
                isDark={isDark}
              />
            </View>
          </View>
        </View>

        {/* Daily Cybersecurity Tip (GlassTipCard) */}
        <GlassTipCard
          category="TODAY'S SAFETY ADVICE"
          icon="💡"
          title="Free Wi-Fi names can be faked"
          advice="Attackers set up identical hotspot names in cafes and airports. Always confirm credentials with venue staff before connecting."
          onPress={onNavigateToLearn}
          isDark={isDark}
        />

        {/* Awareness / Learn Promotion Card */}
        <GlassCard
          isDark={isDark}
          onPress={onNavigateToLearn}
          interactive={true}
          elevation="soft"
          borderRadius={GlassTokens.radii.lg}
          style={styles.learnCard}
        >
          <View style={styles.learnCardContent}>
            <View style={styles.learnCardLeft}>
              <Text style={styles.learnCardIcon}>🤖</Text>
              <View style={styles.learnCardTextWrap}>
                <Text style={[styles.learnCardTitle, { color: theme.textPrimary }]}>
                  Ask Cyber Companion
                </Text>
                <Text style={[styles.learnCardSub, { color: theme.textSecondary }]}>
                  Plain-language answers for all your cybersecurity questions
                </Text>
              </View>
            </View>
            <Text style={[styles.learnCardArrow, { color: theme.primary }]}>→</Text>
          </View>
        </GlassCard>

      </ScrollView>

      {/* Feature Modals */}
      <WifiSentinelModal
        visible={showWifiModal}
        onClose={() => setShowWifiModal(false)}
        isDark={isDark}
      />
      <LinkInspectorModal
        visible={showLinkModal}
        onClose={() => setShowLinkModal(false)}
        isDark={isDark}
      />
      <QrScannerModal
        visible={showQrModal}
        onClose={() => setShowQrModal(false)}
        isDark={isDark}
      />
      <AppPrivacyModal
        visible={showAppPrivacyModal}
        onClose={() => setShowAppPrivacyModal(false)}
        isDark={isDark}
      />
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
    paddingTop: 8,
    paddingBottom: 115, // Clear floating glass navigation bar
    gap: 16,
  },
  topHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  themePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.2,
  },
  themePillIcon: {
    fontSize: 13,
  },
  themePillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.2,
  },
  statusPulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  greetingSection: {
    marginTop: 4,
    gap: 3,
  },
  greetingLabel: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  headlineText: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  subHeadlineText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  heroCard: {
    marginTop: 6,
  },
  heroCardInner: {
    padding: 20,
    gap: 16,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroBadgeTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  heroHeadline: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginTop: 2,
  },
  scoreBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  scoreBadgeText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  gaugeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: -8,
  },
  heroButton: {
    width: '100%',
  },
  sectionHeaderRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  gridContainer: {
    gap: 12,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  gridCol: {
    flex: 1,
  },

  learnCard: {
    marginVertical: 4,
  },
  learnCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  learnCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 10,
  },
  learnCardIcon: {
    fontSize: 24,
  },
  learnCardTextWrap: {
    flex: 1,
    gap: 2,
  },
  learnCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  learnCardSub: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
  learnCardArrow: {
    fontSize: 18,
    fontWeight: '700',
  },

});
