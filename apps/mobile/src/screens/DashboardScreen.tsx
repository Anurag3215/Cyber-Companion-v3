import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
} from 'react-native';
import { Cyber3DShieldCore } from '../components/Cyber3DShieldCore';
import { TiltCard3D } from '../components/TiltCard3D';
import { ThreatRadar3D } from '../components/ThreatRadar3D';
import { FloatingParticles3D } from '../components/FloatingParticles3D';
import { LinkCheckSheet } from '../components/LinkCheckSheet';
import { classifyQrPayload } from '../services/qrScannerService';

interface DashboardScreenProps {
  onNavigateToScanners?: () => void;
  onNavigateToLearn?: () => void;
  userName?: string;
  isDark?: boolean;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigateToScanners,
  onNavigateToLearn,
  userName = 'Arun',
  isDark = false,
}) => {
  const [showLinkCheckModal, setShowLinkCheckModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrInput, setQrInput] = useState('WIFI:S:Airport_Free;T:WPA;P:password;;');
  const [qrResult, setQrResult] = useState<any>(null);

  const [wifiChecked, setWifiChecked] = useState(false);
  const [appsReviewed, setAppsReviewed] = useState(false);
  const [isDeepScanning, setIsDeepScanning] = useState(false);

  // Time-based friendly greeting
  const hour = new Date().getHours();
  const greetingTime = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Strict adherence to existing color palette
  const bg = isDark ? '#090D16' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const subtextColor = isDark ? '#94A3B8' : '#64748B';
  const cardBg = isDark ? '#1E293B' : '#FFFFFF';
  const borderCol = isDark ? '#334155' : '#F1F5F9';
  const tipBg = isDark ? '#1E293B' : '#F8FAFC';
  const tealAccent = isDark ? '#2DD4BF' : '#0D9488';
  const greenSafe = '#10B981';

  const handleTriggerSweep = () => {
    setIsDeepScanning(true);
    setTimeout(() => {
      setIsDeepScanning(false);
      Alert.alert(
        '🛡️ 3D Security Sweep Complete',
        '• Wi-Fi Encryption: Verified Protected\n• Phishing Guard: Zero Threat Signatures\n• App Sandbox: Clean Telemetry Isolation\nOverall Defense: 100% Monitored',
        [{ text: 'Acknowledged' }]
      );
    }, 2800);
  };

  const handleWifiCheck = () => {
    setWifiChecked(true);
    Alert.alert(
      '📶 Wi-Fi Sentinel Check',
      'Connected: Home_Office_5G\nSecurity: WPA3-SAE with Protected Management Frames (PMF)\nVerdict: SAFE · Encrypted network',
      [{ text: 'OK' }]
    );
  };

  const handleAppReview = () => {
    setAppsReviewed(true);
    Alert.alert(
      '🛡️ On-Device App Permission Audit',
      'Audited: 42 Installed Applications\nCritical Telemetry Leaks: 0\nPrivacy Guarantee: No data left this device\nVerdict: CLEAN',
      [{ text: 'OK' }]
    );
  };

  const handleDecodeQr = () => {
    if (!qrInput.trim()) return;
    const classified = classifyQrPayload(qrInput);
    setQrResult(classified);
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
        {/* Top Tagline with Live Security HUD Pill */}
        <View style={styles.topHudRow}>
          <View style={[styles.hudPill, { borderColor: borderCol, backgroundColor: cardBg }]}>
            <View style={[styles.hudPulseDot, { backgroundColor: greenSafe }]} />
            <Text style={[styles.hudPillText, { color: subtextColor }]}>
              ZERO-TRUST · SSRF GUARD ACTIVE
            </Text>
          </View>
        </View>

        <Text style={[styles.topTagline, { color: subtextColor }]}>
          Know what's safe before you tap, scan, or connect
        </Text>

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
            score={78}
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
            {/* 1. Check Wi-Fi */}
            <View style={styles.gridCol}>
              <TiltCard3D
                isDark={isDark}
                activeBorderColor={wifiChecked ? tealAccent : undefined}
                onPress={handleWifiCheck}
              >
                <View style={styles.actionCardContent}>
                  <Text style={styles.actionIcon}>📶</Text>
                  <Text style={[styles.actionLabel, { color: textColor }]}>
                    {wifiChecked ? 'Wi-Fi: Secure' : 'Check Wi-Fi'}
                  </Text>
                  <Text style={[styles.actionSubtext, { color: subtextColor }]}>
                    {wifiChecked ? 'WPA3 Protected' : 'Audit Encryption'}
                  </Text>
                </View>
              </TiltCard3D>
            </View>

            {/* 2. Check a Link */}
            <View style={styles.gridCol}>
              <TiltCard3D
                isDark={isDark}
                onPress={() => setShowLinkCheckModal(true)}
              >
                <View style={styles.actionCardContent}>
                  <Text style={styles.actionIcon}>🔗</Text>
                  <Text style={[styles.actionLabel, { color: textColor }]}>Check a link</Text>
                  <Text style={[styles.actionSubtext, { color: subtextColor }]}>
                    Phishing & SSRF
                  </Text>
                </View>
              </TiltCard3D>
            </View>
          </View>

          <View style={styles.gridRow}>
            {/* 3. Scan QR Code */}
            <View style={styles.gridCol}>
              <TiltCard3D
                isDark={isDark}
                onPress={() => setShowQrModal(true)}
              >
                <View style={styles.actionCardContent}>
                  <Text style={styles.actionIcon}>⛶</Text>
                  <Text style={[styles.actionLabel, { color: textColor }]}>Scan QR code</Text>
                  <Text style={[styles.actionSubtext, { color: subtextColor }]}>
                    Sandbox Preview
                  </Text>
                </View>
              </TiltCard3D>
            </View>

            {/* 4. Review Apps */}
            <View style={styles.gridCol}>
              <TiltCard3D
                isDark={isDark}
                activeBorderColor={appsReviewed ? tealAccent : undefined}
                onPress={handleAppReview}
              >
                <View style={styles.actionCardContent}>
                  <Text style={styles.actionIcon}>🛡️</Text>
                  <Text style={[styles.actionLabel, { color: textColor }]}>
                    {appsReviewed ? 'Apps: Clean' : 'Review apps'}
                  </Text>
                  <Text style={[styles.actionSubtext, { color: subtextColor }]}>
                    {appsReviewed ? '0 PII Leaks' : 'Sensor Audit'}
                  </Text>
                </View>
              </TiltCard3D>
            </View>
          </View>
        </View>

        {/* 3D Holographic Perspective Threat Radar */}
        <ThreatRadar3D
          isDark={isDark}
          onSelectSector={(sector) => {
            if (sector === 'wifi') handleWifiCheck();
            else if (sector === 'url') setShowLinkCheckModal(true);
            else if (sector === 'qr') setShowQrModal(true);
            else if (sector === 'apps') handleAppReview();
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

      {/* Screen 2: Link Check Modal */}
      <Modal
        visible={showLinkCheckModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowLinkCheckModal(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#0F172A' : '#FFFFFF' }}>
          <LinkCheckSheet
            url="secure-paypa1-login.com/verify"
            isThreat={true}
            threatTitle="Don't open this link"
            consensusText="Dangerous · 4 of 4 sources agree"
            explanation="It copies a PayPal login page to steal your password. The &quot;1&quot; in &quot;paypa1&quot; is a number, not the letter &quot;l&quot;."
            findings={[
              'Reported as phishing by Google',
              'Looks like a well-known brand',
              'Website created 2 days ago',
            ]}
            onClose={() => setShowLinkCheckModal(false)}
            isDark={isDark}
          />
        </SafeAreaView>
      </Modal>

      {/* Sandboxed QR Scanner Modal */}
      <Modal
        visible={showQrModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowQrModal(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#0F172A' : '#FFFFFF' }}>
          <ScrollView style={{ flex: 1, padding: 24 }}>
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: textColor }}>
                Sandboxed QR Scanner
              </Text>
              <Text style={{ fontSize: 13, color: subtextColor, marginTop: 4 }}>
                Decodes and previews QR content before launching any apps or URLs
              </Text>
            </View>

            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: textColor, marginBottom: 8 }}>
                QR Code Payload
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: borderCol,
                  borderRadius: 14,
                  padding: 14,
                  color: textColor,
                  backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
                }}
                value={qrInput}
                onChangeText={setQrInput}
                placeholder="Enter or paste QR payload"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: '#0D9488',
                paddingVertical: 14,
                borderRadius: 24,
                alignItems: 'center',
                marginBottom: 20,
              }}
              onPress={handleDecodeQr}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 14 }}>
                Decode & Sandbox Preview
              </Text>
            </TouchableOpacity>

            {qrResult && (
              <View
                style={{
                  backgroundColor: isDark ? '#1E293B' : '#F0FDFA',
                  borderColor: '#99F6E4',
                  borderWidth: 1,
                  borderRadius: 18,
                  padding: 16,
                  marginBottom: 20,
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: '800', color: '#0F766E', marginBottom: 4 }}>
                  CLASSIFICATION: {qrResult.type}
                </Text>
                <Text style={{ fontSize: 14, color: textColor, marginBottom: 4 }}>
                  Raw: {qrResult.raw}
                </Text>
                {qrResult.metadata && (
                  <Text style={{ fontSize: 13, color: subtextColor }}>
                    Details: {JSON.stringify(qrResult.metadata)}
                  </Text>
                )}
                {qrResult.sanitizedDestination && (
                  <Text style={{ fontSize: 13, color: '#0D9488', marginTop: 4 }}>
                    Sanitized Target: {qrResult.sanitizedDestination}
                  </Text>
                )}
              </View>
            )}

            <TouchableOpacity
              style={{
                backgroundColor: isDark ? '#334155' : '#F3F4F6',
                paddingVertical: 14,
                borderRadius: 24,
                alignItems: 'center',
              }}
              onPress={() => setShowQrModal(false)}
            >
              <Text style={{ color: textColor, fontWeight: '600', fontSize: 14 }}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
    paddingTop: 12,
    paddingBottom: 40,
  },
  topHudRow: {
    alignItems: 'center',
    marginBottom: 8,
  },
  hudPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
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
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  topTagline: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 14,
    letterSpacing: -0.2,
  },
  headerSection: {
    marginBottom: 10,
  },
  greetingText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  headlineText: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  gaugeContainer: {
    alignItems: 'center',
    marginVertical: 4,
  },
  sweepButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginVertical: 10,
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
    marginVertical: 8,
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
    fontWeight: '500',
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
