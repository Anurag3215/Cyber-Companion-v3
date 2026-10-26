import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Animated,
  Easing,
  TextInput,
  ScrollView,
} from 'react-native';
import { QrCube3DVisual } from '../components/Showcase3DVisuals';
import { GlassTokens } from '../design-system/glassTokens';

interface QrScannerScreenProps {
  onBack: () => void;
  onScanComplete: (qrData: string) => void;
  isDark?: boolean;
}

const DEMO_QR_VECTORS = [
  {
    id: 'quish-parking',
    title: 'Quishing Parking Meter Fraud',
    subtitle: 'Physical sticker replacement vector',
    category: 'QUISHING FRAUD',
    payload: 'http://city-parking-pay.quick-bill.info/pay?meter=982',
    icon: '🅿️',
    badgeColor: '#EF4444',
    badgeText: 'CRITICAL',
  },
  {
    id: 'malware-apk',
    title: 'Android Malware APK Drive-By',
    subtitle: 'Fake mandatory security patch download',
    category: 'MALICIOUS APK',
    payload: 'http://update-android-security.com/system-patch.apk',
    icon: '⚠️',
    badgeColor: '#EF4444',
    badgeText: 'CRITICAL',
  },
  {
    id: 'rogue-wifi',
    title: 'Rogue Wi-Fi Auto-Connect Trap',
    subtitle: 'Evil Twin unencrypted airspace beacon',
    category: 'ROGUE HOTSPOT',
    payload: 'WIFI:S:Free_Airport_VIP_WiFi;T:nopass;;',
    icon: '📶',
    badgeColor: '#F59E0B',
    badgeText: 'HIGH RISK',
  },
  {
    id: 'banking-phish',
    title: 'Banking Credential Phishing',
    subtitle: 'Financial portal spoofing gateway',
    category: 'CREDENTIAL HARVEST',
    payload: 'http://secure-login.chase-verify-billing.com/auth',
    icon: '💳',
    badgeColor: '#EF4444',
    badgeText: 'CRITICAL',
  },
  {
    id: 'safe-portal',
    title: 'Verified Corporate Service',
    subtitle: 'EV TLS 1.3 certified cloud destination',
    category: 'LEGITIMATE SERVICE',
    payload: 'https://legitimate-service.com/portal',
    icon: '🛡️',
    badgeColor: '#10B981',
    badgeText: 'SECURE',
  },
];

export const QrScannerScreen: React.FC<QrScannerScreenProps> = ({
  onBack,
  onScanComplete,
  isDark = true,
}) => {
  const [torchOn, setTorchOn] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  // Animated scan line
  const scanProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanProgress, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(scanProgress, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const progressWidth = scanProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['15%', '92%'],
  });

  const handleTestSample = (sampleUrl: string) => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      onScanComplete(sampleUrl);
    }, 600);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#070D18' : '#F4F8FC' }]}>
      {/* Top Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={onBack}
          style={[
            styles.headerBtn,
            {
              backgroundColor: isDark ? 'rgba(14, 27, 56, 0.8)' : '#FFFFFF',
              borderColor: isDark ? 'rgba(56, 189, 248, 0.2)' : '#DCE6F0',
            },
          ]}
          activeOpacity={0.75}
        >
          <Text style={[styles.backArrow, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>←</Text>
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
          QR Scanner
        </Text>

        <TouchableOpacity
          onPress={() => setTorchOn((prev) => !prev)}
          style={[
            styles.headerBtn,
            {
              backgroundColor: torchOn
                ? 'rgba(245, 158, 11, 0.25)'
                : isDark
                ? 'rgba(14, 27, 56, 0.8)'
                : '#FFFFFF',
              borderColor: torchOn
                ? '#F59E0B'
                : isDark
                ? 'rgba(56, 189, 248, 0.2)'
                : '#DCE6F0',
            },
          ]}
          activeOpacity={0.75}
        >
          <Text style={{ fontSize: 16 }}>⚡</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.column}>
          {/* Camera Viewfinder matching showcase */}
          <View style={styles.viewfinderOuter}>
            <View
              style={[
                styles.viewfinderBox,
                {
                  backgroundColor: isDark ? '#0B1528' : '#0F172A',
                  borderColor: isDark ? 'rgba(56, 189, 248, 0.3)' : 'rgba(255, 255, 255, 0.2)',
                },
              ]}
            >
              {/* 4 White Corner Target Reticles */}
              <View style={[styles.cornerBracket, styles.topLeftCorner]} />
              <View style={[styles.cornerBracket, styles.topRightCorner]} />
              <View style={[styles.cornerBracket, styles.bottomLeftCorner]} />
              <View style={[styles.cornerBracket, styles.bottomRightCorner]} />

              {/* 3D Holographic QR Cube inside */}
              <QrCube3DVisual size={160} isDark={true} />
            </View>

            {/* Scanning Status Pill with Animated Progress */}
            <View
              style={[
                styles.statusPill,
                {
                  backgroundColor: isDark ? '#0E1B38' : 'rgba(255, 255, 255, 0.95)',
                  borderColor: isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(2, 132, 199, 0.25)',
                },
              ]}
            >
              <Text style={[styles.statusText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                {isSimulating ? 'Analyzing QR payload...' : 'Align QR code within the frame'}
              </Text>
              <View style={styles.progressBarTrack}>
                <Animated.View style={[styles.progressBarFill, { width: progressWidth }]} />
              </View>
            </View>
          </View>

          {/* Client Demo Threat Test Suite */}
          <View style={styles.testSection}>
            <View style={styles.sectionTitleRow}>
              <Text style={[styles.testSectionTitle, { color: isDark ? '#38BDF8' : '#0284C7' }]}>
                CLIENT DEMO & THREAT TEST VECTORS
              </Text>
              <View style={[styles.countBadge, { backgroundColor: isDark ? 'rgba(56, 189, 248, 0.15)' : '#E0F2FE' }]}>
                <Text style={{ fontSize: 11, fontWeight: '800', color: '#38BDF8' }}>5 VECTORS</Text>
              </View>
            </View>

            <Text style={[styles.sectionSubtitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              Tap any test vector below to trigger instant real-time payload inspection:
            </Text>

            {DEMO_QR_VECTORS.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.sampleBtn,
                  {
                    backgroundColor: isDark ? '#0E1B38' : '#FFFFFF',
                    borderColor: isDark ? 'rgba(56, 189, 248, 0.2)' : '#DCE6F0',
                  },
                ]}
                onPress={() => handleTestSample(item.payload)}
                activeOpacity={0.8}
              >
                <Text style={styles.sampleIcon}>{item.icon}</Text>
                <View style={{ flex: 1, gap: 3 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text
                      style={[styles.sampleBtnTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                    <View style={[styles.vectorBadge, { backgroundColor: item.badgeColor }]}>
                      <Text style={styles.vectorBadgeText}>{item.badgeText}</Text>
                    </View>
                  </View>
                  <Text
                    style={[styles.sampleBtnSub, { color: isDark ? '#94A3B8' : '#64748B' }]}
                    numberOfLines={1}
                  >
                    {item.payload}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}

            {/* Manual Paste Row */}
            <View style={{ marginTop: 10, gap: 8 }}>
              <Text style={[styles.inputLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                OR INSPECT CUSTOM QR PAYLOAD / URL:
              </Text>
              <View
                style={[
                  styles.manualInputRow,
                  {
                    backgroundColor: isDark ? '#0E1B38' : '#FFFFFF',
                    borderColor: isDark ? 'rgba(56, 189, 248, 0.2)' : '#DCE6F0',
                  },
                ]}
              >
                <TextInput
                  style={[styles.manualTextInput, { color: isDark ? '#FFFFFF' : '#0F172A' }]}
                  placeholder="Paste QR payload or raw link..."
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  value={manualInput}
                  onChangeText={setManualInput}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={[styles.manualSubmitBtn, { opacity: !manualInput.trim() ? 0.6 : 1 }]}
                  onPress={() => {
                    if (manualInput.trim()) onScanComplete(manualInput.trim());
                  }}
                  disabled={!manualInput.trim()}
                >
                  <Text style={styles.manualSubmitText}>Inspect</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 44 : 50,
    paddingBottom: 14,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  column: {
    width: '100%',
    maxWidth: GlassTokens.layout.maxContentWidth,
    alignItems: 'center',
    gap: 20,
  },
  viewfinderOuter: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 12,
  },
  viewfinderBox: {
    width: 270,
    height: 270,
    borderRadius: 28,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  cornerBracket: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: '#FFFFFF',
  },
  topLeftCorner: {
    top: 20,
    left: 20,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 10,
  },
  topRightCorner: {
    top: 20,
    right: 20,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 10,
  },
  bottomLeftCorner: {
    bottom: 20,
    left: 20,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 10,
  },
  bottomRightCorner: {
    bottom: 20,
    right: 20,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 10,
  },
  statusPill: {
    marginTop: 18,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    width: 280,
    gap: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  progressBarTrack: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#38BDF8',
    borderRadius: 2,
  },
  testSection: {
    width: '100%',
    gap: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  testSectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  sectionSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    marginBottom: 4,
  },
  sampleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  sampleIcon: {
    fontSize: 22,
  },
  sampleBtnTitle: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  sampleBtnSub: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  vectorBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 6,
  },
  vectorBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  manualInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 6,
    gap: 10,
  },
  manualTextInput: {
    flex: 1,
    height: 44,
    fontSize: 14,
  },
  manualSubmitBtn: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
  },
  manualSubmitText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
