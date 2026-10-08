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
import { ScoreGauge } from '../design-system/ScoreGauge';
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

  // Time-based friendly greeting
  const hour = new Date().getHours();
  const greetingTime = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const bg = isDark ? '#090D16' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const subtextColor = isDark ? '#94A3B8' : '#64748B';
  const cardBg = isDark ? '#1E293B' : '#FFFFFF';
  const borderCol = isDark ? '#334155' : '#F1F5F9';
  const tipBg = isDark ? '#1E293B' : '#F8FAFC';

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
      <ScrollView style={[styles.container, { backgroundColor: bg }]} contentContainerStyle={styles.content}>
        
        {/* Top Tagline */}
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

        {/* Circular Score Gauge */}
        <View style={styles.gaugeContainer}>
          <ScoreGauge score={78} potentialScore={92} fixesCount={3} isDark={isDark} />
        </View>

        {/* 2x2 Quick Action Grid */}
        <View style={styles.gridContainer}>
          <View style={styles.gridRow}>
            {/* 1. Check Wi-Fi */}
            <TouchableOpacity
              style={[
                styles.actionCard,
                { backgroundColor: cardBg, borderColor: wifiChecked ? '#0D9488' : borderCol },
              ]}
              onPress={handleWifiCheck}
              activeOpacity={0.7}
            >
              <Text style={styles.actionIcon}>📶</Text>
              <Text style={[styles.actionLabel, { color: textColor }]}>
                {wifiChecked ? 'Wi-Fi: Secure' : 'Check Wi-Fi'}
              </Text>
            </TouchableOpacity>

            {/* 2. Check a Link (opens reference Screen 2) */}
            <TouchableOpacity
              style={[
                styles.actionCard,
                { backgroundColor: cardBg, borderColor: borderCol },
              ]}
              onPress={() => setShowLinkCheckModal(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.actionIcon}>🔗</Text>
              <Text style={[styles.actionLabel, { color: textColor }]}>Check a link</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.gridRow}>
            {/* 3. Scan QR Code */}
            <TouchableOpacity
              style={[
                styles.actionCard,
                { backgroundColor: cardBg, borderColor: borderCol },
              ]}
              onPress={() => setShowQrModal(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.actionIcon}>⛶</Text>
              <Text style={[styles.actionLabel, { color: textColor }]}>Scan QR code</Text>
            </TouchableOpacity>

            {/* 4. Review Apps */}
            <TouchableOpacity
              style={[
                styles.actionCard,
                { backgroundColor: cardBg, borderColor: appsReviewed ? '#0D9488' : borderCol },
              ]}
              onPress={handleAppReview}
              activeOpacity={0.7}
            >
              <Text style={styles.actionIcon}>🛡️</Text>
              <Text style={[styles.actionLabel, { color: textColor }]}>
                {appsReviewed ? 'Apps: Clean' : 'Review apps'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* TODAY'S TIP Card */}
        <TouchableOpacity
          style={[styles.tipCard, { backgroundColor: tipBg, borderColor: borderCol }]}
          onPress={onNavigateToLearn}
          activeOpacity={0.8}
        >
          <Text style={styles.tipBadge}>TODAY'S TIP</Text>
          <Text style={[styles.tipText, { color: textColor }]}>
            Free Wi-Fi names can be faked. Ask staff.
          </Text>
        </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  topTagline: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: -0.2,
  },
  headerSection: {
    marginBottom: 16,
  },
  greetingText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  headlineText: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  gaugeContainer: {
    alignItems: 'center',
    marginVertical: 14,
  },
  gridContainer: {
    marginTop: 18,
    marginBottom: 24,
    gap: 12,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: 10,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  tipCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    marginTop: 4,
  },
  tipBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6B7280',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
});
