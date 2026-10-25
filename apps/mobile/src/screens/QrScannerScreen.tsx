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
    }, 700);
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

          {/* Instant Test Samples & Manual Input */}
          <View style={styles.testSection}>
            <Text style={[styles.testSectionTitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              OR TEST WITH SAMPLE PAYLOADS:
            </Text>

            <TouchableOpacity
              style={[
                styles.sampleBtn,
                {
                  backgroundColor: isDark ? '#0E1B38' : '#FFFFFF',
                  borderColor: isDark ? 'rgba(56, 189, 248, 0.2)' : '#DCE6F0',
                },
              ]}
              onPress={() => handleTestSample('https://legitimate-service.com/portal')}
              activeOpacity={0.8}
            >
              <Text style={[styles.sampleIcon, { color: '#10B981' }]}>✓</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.sampleBtnTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                  Test Safe QR Code
                </Text>
                <Text style={[styles.sampleBtnSub, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  https://legitimate-service.com/portal
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.sampleBtn,
                {
                  backgroundColor: isDark ? '#0E1B38' : '#FFFFFF',
                  borderColor: isDark ? 'rgba(239, 68, 68, 0.2)' : '#DCE6F0',
                },
              ]}
              onPress={() => handleTestSample('http://suspicious-phish.net/login')}
              activeOpacity={0.8}
            >
              <Text style={[styles.sampleIcon, { color: '#EF4444' }]}>⚠️</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.sampleBtnTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                  Test Suspicious Quishing QR
                </Text>
                <Text style={[styles.sampleBtnSub, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  http://suspicious-phish.net/login
                </Text>
              </View>
            </TouchableOpacity>

            {/* Manual Paste Row */}
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
                placeholder="Paste QR link or text..."
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
    width: 28,
    height: 28,
    borderColor: '#FFFFFF',
  },
  topLeftCorner: {
    top: 14,
    left: 14,
    borderTopWidth: 3.5,
    borderLeftWidth: 3.5,
    borderTopLeftRadius: 8,
  },
  topRightCorner: {
    top: 14,
    right: 14,
    borderTopWidth: 3.5,
    borderRightWidth: 3.5,
    borderTopRightRadius: 8,
  },
  bottomLeftCorner: {
    bottom: 14,
    left: 14,
    borderBottomWidth: 3.5,
    borderLeftWidth: 3.5,
    borderBottomLeftRadius: 8,
  },
  bottomRightCorner: {
    bottom: 14,
    right: 14,
    borderBottomWidth: 3.5,
    borderRightWidth: 3.5,
    borderBottomRightRadius: 8,
  },
  statusPill: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1.2,
    alignItems: 'center',
    gap: 8,
    width: 270,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  progressBarTrack: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#38BDF8',
    borderRadius: 2,
  },
  testSection: {
    width: '100%',
    gap: 10,
    marginTop: 6,
  },
  testSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  sampleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1.2,
    gap: 12,
  },
  sampleIcon: {
    fontSize: 20,
    fontWeight: '900',
  },
  sampleBtnTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  sampleBtnSub: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 1,
  },
  manualInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1.2,
    paddingHorizontal: 14,
    height: 52,
    gap: 10,
    marginTop: 4,
  },
  manualTextInput: {
    flex: 1,
    fontSize: 13,
  },
  manualSubmitBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  manualSubmitText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
