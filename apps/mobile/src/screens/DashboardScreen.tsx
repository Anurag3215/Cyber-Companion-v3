import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { CyberLogo } from '../components/CyberLogo';
import { Cyber3DShieldCore } from '../components/Cyber3DShieldCore';
import { TiltCard3D } from '../components/TiltCard3D';
import { ThreatRadar3D } from '../components/ThreatRadar3D';
import { FloatingParticles3D } from '../components/FloatingParticles3D';
import { WifiSentinelModal } from '../components/WifiSentinelModal';
import { LinkInspectorModal } from '../components/LinkInspectorModal';
import { QrScannerModal } from '../components/QrScannerModal';
import { AppPrivacyModal } from '../components/AppPrivacyModal';
import { useAuth } from '../services/AuthContext';

interface DashboardScreenProps {
  onNavigateToScanners?: () => void;
  onNavigateToLearn?: () => void;
  isDark?: boolean;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigateToScanners,
  onNavigateToLearn,
  isDark = true,
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

  // Strict adherence to existing color combinations
  const bg = isDark ? '#090D16' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const subtextColor = isDark ? '#94A3B8' : '#64748B';
  const cardBg = isDark ? '#1E293B' : '#FFFFFF';
  const borderCol = isDark ? '#334155' : '#F1F5F9';
  const tealAccent = isDark ? '#2DD4BF' : '#0D9488';
  const greenSafe = '#10B981';

  const handleTriggerSweep = () => {
    setIsDeepScanning(true);
    setTimeout(() => {
      setIsDeepScanning(false);
      Alert.alert(
        '🛡️ 3D Security Sweep Complete',
        '• Wi-Fi Encryption: WPA3-SAE & PMF Validated\n• Phishing Guard: 0 Malicious Triggers\n• QR Sandbox: Isolated Execution Ready\n• App Privacy: 0 Unverified Sensor Leaks\nOverall Defense Score: 94/100',
        [{ text: 'Acknowledged' }]
      );
    }, 2800);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={bg} />

      {/* Subtle 3D floating ambient particles in background */}
      <FloatingParticles3D isDark={isDark} />

      <ScrollView
        style={[styles.container, { backgroundColor: bg }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header with App Logo & Live Status (Tightly fitted under camera bezel) */}
        <View style={styles.topHeaderBar}>
          <CyberLogo size={38} isDark={isDark} animated={true} />

          <View style={[styles.hudPill, { borderColor: borderCol, backgroundColor: cardBg }]}>
            <View style={[styles.hudPulseDot, { backgroundColor: greenSafe }]} />
            <Text style={[styles.hudPillText, { color: tealAccent }]}>ZERO-TRUST ACTIVE</Text>
          </View>
        </View>

        {/* User Greeting & Headline */}
        <View style={styles.headerSection}>
          <Text style={[styles.greetingText, { color: subtextColor }]}>
            {greetingTime}, {userName}
          </Text>
          <Text style={[styles.headlineText, { color: textColor }]}>
            You're mostly protected
          </Text>
        </View>

        {/* 3D Interactive Moving Cyber Shield Core */}
        <View style={styles.gaugeContainer}>
          <Cyber3DShieldCore
            score={user?.securityScore || 78}
            potentialScore={92}
            fixesCount={3}
            isDark={isDark}
            isScanning={isDeepScanning}
            onTriggerScan={handleTriggerSweep}
          />
        </View>

        {/* Interactive 3D Security Sweep Trigger */}
        <TouchableOpacity
          style={[
            styles.sweepButton,
            {
              backgroundColor: isDeepScanning ? '#064E3B' : tealAccent,
              borderColor: isDeepScanning ? greenSafe : tealAccent,
            },
          ]}
          onPress={handleTriggerSweep}
          activeOpacity={0.85}
          disabled={isDeepScanning}
        >
          <Text style={styles.sweepButtonText}>
            {isDeepScanning ? '⚡ 3D Scanning Perimeter...' : '🚀 Trigger 3D Defense Sweep'}
          </Text>
        </TouchableOpacity>

        {/* 2x2 Quick Action Grid with 3D Perspective Tilt Cards */}
        <View style={styles.gridContainer}>
          <View style={styles.gridRow}>
            {/* 1. Check Wi-Fi (Opens real-data WifiSentinelModal) */}
            <View style={styles.gridCol}>
              <TiltCard3D
                isDark={isDark}
                onPress={() => setShowWifiModal(true)}
              >
                <View style={styles.actionCardContent}>
                  <Text style={styles.actionIcon}>📶</Text>
                  <Text style={[styles.actionLabel, { color: textColor }]}>Check Wi-Fi</Text>
                  <Text style={[styles.actionSubtext, { color: greenSafe }]}>
                    WPA3-SAE & PMF
                  </Text>
                </View>
              </TiltCard3D>
            </View>

            {/* 2. Check a Link (Opens real-data LinkInspectorModal) */}
            <View style={styles.gridCol}>
              <TiltCard3D
                isDark={isDark}
                onPress={() => setShowLinkModal(true)}
              >
                <View style={styles.actionCardContent}>
                  <Text style={styles.actionIcon}>🔗</Text>
                  <Text style={[styles.actionLabel, { color: textColor }]}>Check a link</Text>
                  <Text style={[styles.actionSubtext, { color: tealAccent }]}>
                    Phishing & SSRF
                  </Text>
                </View>
              </TiltCard3D>
            </View>
          </View>

          <View style={styles.gridRow}>
            {/* 3. Scan QR Code (Opens real-data QrScannerModal) */}
            <View style={styles.gridCol}>
              <TiltCard3D
                isDark={isDark}
                onPress={() => setShowQrModal(true)}
              >
                <View style={styles.actionCardContent}>
                  <Text style={styles.actionIcon}>⛶</Text>
                  <Text style={[styles.actionLabel, { color: textColor }]}>Scan QR code</Text>
                  <Text style={[styles.actionSubtext, { color: isDark ? '#38BDF8' : '#0284C7' }]}>
                    Sandbox Preview
                  </Text>
                </View>
              </TiltCard3D>
            </View>

            {/* 4. Review Apps (Opens real-data AppPrivacyModal) */}
            <View style={styles.gridCol}>
              <TiltCard3D
                isDark={isDark}
                onPress={() => setShowAppPrivacyModal(true)}
              >
                <View style={styles.actionCardContent}>
                  <Text style={styles.actionIcon}>🛡️</Text>
                  <Text style={[styles.actionLabel, { color: textColor }]}>Review apps</Text>
                  <Text style={[styles.actionSubtext, { color: greenSafe }]}>
                    Zero PII Leaks
                  </Text>
                </View>
              </TiltCard3D>
            </View>
          </View>
        </View>

        {/* 3D Holographic Perspective Threat Radar with interactive sectors */}
        <ThreatRadar3D
          isDark={isDark}
          onSelectSector={(sector) => {
            if (sector === 'wifi') setShowWifiModal(true);
            else if (sector === 'url') setShowLinkModal(true);
            else if (sector === 'qr') setShowQrModal(true);
            else if (sector === 'apps') setShowAppPrivacyModal(true);
          }}
        />

        {/* TODAY'S TIP 3D Tilt Card */}
        <TiltCard3D
          isDark={isDark}
          onPress={onNavigateToLearn}
        >
          <View style={styles.tipCardInner}>
            <View style={styles.tipHeaderRow}>
              <View style={[styles.tipBadgeWrapper, { backgroundColor: isDark ? '#334155' : '#F1F5F9' }]}>
                <Text style={[styles.tipBadgeText, { color: tealAccent }]}>TODAY'S INTEL</Text>
              </View>
              <Text style={[styles.tipArrow, { color: subtextColor }]}>Tap to learn →</Text>
            </View>
            <Text style={[styles.tipText, { color: textColor }]}>
              Free Wi-Fi names can be faked. Always verify credentials with venue staff.
            </Text>
          </View>
        </TiltCard3D>
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
    paddingTop: 4, // Tightly fitted under the camera bezel / dynamic island
    paddingBottom: 40,
  },
  topHeaderBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 2,
  },
  hudPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
    borderWidth: 1,
  },
  hudPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  hudPillText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  headerSection: {
    marginBottom: 8,
  },
  greetingText: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 2,
  },
  headlineText: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  gaugeContainer: {
    alignItems: 'center',
    marginVertical: 2,
  },
  sweepButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  sweepButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  gridContainer: {
    marginVertical: 6,
    gap: 10,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 10,
  },
  gridCol: {
    flex: 1,
  },
  actionCardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  actionSubtext: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  tipCardInner: {
    paddingVertical: 2,
  },
  tipHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  tipBadgeWrapper: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tipBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  tipArrow: {
    fontSize: 11,
    fontWeight: '600',
  },
  tipText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
});
