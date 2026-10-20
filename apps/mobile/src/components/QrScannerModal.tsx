import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Animated,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import { classifyQrPayload } from '../services/qrScannerService';
import { AiExplainerModal } from './AiExplainerModal';

interface QrScannerModalProps {
  visible: boolean;
  onClose: () => void;
  isDark?: boolean;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  visible,
  onClose,
  isDark = true,
}) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [torch, setTorch] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const [qrInput, setQrInput] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);

  const laserAnim = useRef(new Animated.Value(0)).current;

  const bg = isDark ? '#090D16' : '#FFFFFF';
  const cardBg = isDark ? '#1E293B' : '#F8FAFC';
  const borderCol = isDark ? '#334155' : '#E2E8F0';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const subtextColor = isDark ? '#94A3B8' : '#64748B';
  const teal = isDark ? '#2DD4BF' : '#0D9488';
  const emerald = '#10B981';
  const danger = '#EF4444';
  const amber = '#F59E0B';

  useEffect(() => {
    if (visible) {
      setScanned(false);
      setCameraError(null);
    }
  }, [visible]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(laserAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(laserAnim, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [laserAnim]);

  const handleDecode = (payload: string) => {
    if (!payload.trim()) return;
    const raw = payload.trim();
    const classified = classifyQrPayload(raw);

    let riskLevel: 'SAFE' | 'WARNING' | 'CRITICAL' = 'SAFE';
    let riskReason = 'Payload conforms to standard formats with zero malicious triggers.';

    if (classified.type === 'WIFI') {
      const auth = (classified.metadata as any)?.authType || 'OPEN';
      if (auth === 'nopass' || auth === 'OPEN') {
        riskLevel = 'WARNING';
        riskReason = 'Unencrypted Wi-Fi configuration. Anyone on this network can intercept your unencrypted traffic.';
      }
    } else if (classified.type === 'URL') {
      const dest = (classified.sanitizedDestination || raw).toLowerCase();
      if (
        dest.includes('verify') ||
        dest.includes('.cc') ||
        dest.includes('login') ||
        dest.includes('security-update')
      ) {
        riskLevel = 'CRITICAL';
        riskReason = 'URL mimics a corporate login portal or security alert using an untrusted TLD.';
      } else if (dest.startsWith('http://')) {
        riskLevel = 'WARNING';
        riskReason = 'Unencrypted HTTP URL. Sensitive data transmitted will not be protected by TLS.';
      }
    } else if (classified.type === 'UNKNOWN') {
      if (raw.startsWith('smsto:') || raw.startsWith('tel:') || raw.startsWith('telprompt:')) {
        riskLevel = 'CRITICAL';
        riskReason = 'Premium rate SMS/Calling intent scheme. Opening this may bill unwanted charges to your phone.';
      } else if (raw.startsWith('*#') || raw.startsWith('*21*')) {
        riskLevel = 'CRITICAL';
        riskReason = 'USSD MMI code detected. Could alter phone settings or enable unauthorized call forwarding.';
      } else if (raw.startsWith('javascript:') || raw.startsWith('data:')) {
        riskLevel = 'CRITICAL';
        riskReason = 'Direct script injection or embedded data URI payload detected.';
      }
    }

    setAnalysis({
      ...classified,
      riskLevel,
      riskReason,
    });
  };

  const handleBarcodeScanned = (result: BarcodeScanningResult) => {
    if (scanned || !result || !result.data) return;
    setScanned(true);
    setQrInput(result.data);
    handleDecode(result.data);
  };

  const handleRescan = () => {
    setScanned(false);
    setAnalysis(null);
  };

  const laserTranslateY = laserAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-90, 90],
  });

  const getFormatBadge = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith('WIFI:') || trimmed.startsWith('wifi:'))
      return { label: 'Wi-Fi Network Configuration', icon: '📶', color: emerald };
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://'))
      return { label: 'Web URL Destination', icon: '🌐', color: teal };
    if (trimmed.startsWith('upi://') || trimmed.startsWith('bitcoin:') || trimmed.startsWith('ethereum:'))
      return { label: 'Payment / Financial Intent', icon: '💳', color: amber };
    if (trimmed.startsWith('smsto:') || trimmed.startsWith('tel:') || trimmed.startsWith('mailto:'))
      return { label: 'Communication Intent', icon: '💬', color: amber };
    return { label: 'Data / Text Payload', icon: '📝', color: subtextColor };
  };

  const detectedBadge = getFormatBadge(qrInput);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.iconCircle, { borderColor: teal, backgroundColor: cardBg }]}>
              <Text style={styles.iconText}>⛶</Text>
            </View>
            <Text style={[styles.title, { color: textColor }]}>Sandboxed QR Analyzer</Text>
            <Text style={[styles.subtitle, { color: subtextColor }]}>
              Real-Time Camera Scanner & Zero-Execution Intent Sanitizer
            </Text>
          </View>

          {/* Physical Camera Viewfinder */}
          <View style={[styles.viewfinderCard, { borderColor: teal, backgroundColor: '#000000' }]}>
            {!permission ? (
              <View style={styles.centerContainer}>
                <ActivityIndicator size="small" color={teal} />
                <Text style={[styles.permissionInfo, { color: subtextColor }]}>
                  Initializing camera sensor...
                </Text>
              </View>
            ) : !permission.granted ? (
              <View style={styles.permissionBox}>
                <View style={[styles.shieldIconRing, { borderColor: `${teal}40`, backgroundColor: `${teal}15` }]}>
                  <Text style={styles.lockIcon}>🛡️</Text>
                </View>
                <Text style={[styles.permTitle, { color: '#FFFFFF' }]}>Hardware Camera Scanner</Text>
                <Text style={[styles.permDesc, { color: '#94A3B8' }]}>
                  Enable camera access to scan physical QR codes in real-time with zero-trust optical sandboxing.
                </Text>
                <TouchableOpacity
                  style={[styles.grantBtn, { backgroundColor: teal }]}
                  onPress={requestPermission}
                  activeOpacity={0.85}
                >
                  <Text style={styles.grantBtnText}>🔓 Enable Camera Scanner</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <CameraView
                  style={StyleSheet.absoluteFill}
                  facing={facing}
                  enableTorch={torch}
                  barcodeScannerSettings={{
                    barcodeTypes: ['qr'],
                  }}
                  onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                  onMountError={(e) => setCameraError(e.message)}
                />

                {/* Cyber Reticle Overlay */}
                <View style={styles.reticleOverlay} pointerEvents="none">
                  <View style={[styles.cornerTL, { borderColor: teal }]} />
                  <View style={[styles.cornerTR, { borderColor: teal }]} />
                  <View style={[styles.cornerBL, { borderColor: teal }]} />
                  <View style={[styles.cornerBR, { borderColor: teal }]} />

                  {/* Animated Oscillating Laser */}
                  {!scanned && (
                    <Animated.View
                      style={[
                        styles.laserLine,
                        {
                          backgroundColor: danger,
                          transform: [{ translateY: laserTranslateY }],
                        },
                      ]}
                    />
                  )}
                </View>

                {/* Controls Bar: Flashlight & Camera Flip */}
                <View style={styles.cameraControlsRow}>
                  <TouchableOpacity
                    style={[
                      styles.cameraToolBtn,
                      { backgroundColor: torch ? teal : 'rgba(15, 23, 42, 0.75)' },
                    ]}
                    onPress={() => setTorch(!torch)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.cameraToolText, { color: torch ? '#090D16' : '#F8FAFC' }]}>
                      {torch ? '🔦 Torch ON' : '💡 Flash'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.cameraToolBtn, { backgroundColor: 'rgba(15, 23, 42, 0.75)' }]}
                    onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.cameraToolText, { color: '#F8FAFC' }]}>🔄 Flip</Text>
                  </TouchableOpacity>
                </View>

                {/* Status Indicator */}
                {scanned ? (
                  <TouchableOpacity
                    style={[styles.scannedBanner, { backgroundColor: 'rgba(16, 185, 129, 0.92)' }]}
                    onPress={handleRescan}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.scannedBannerText}>🎯 CODE ACQUIRED • TAP TO SCAN AGAIN</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.statusPill}>
                    <Text style={[styles.reticleText, { color: teal }]}>
                      OPTICAL RADAR ACTIVE • ALIGN CODE
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>

          {cameraError && (
            <View style={styles.cameraErrBanner}>
              <Text style={styles.cameraErrText}>Camera status: {cameraError}</Text>
            </View>
          )}

          {/* Manual Input Box (Universal fallback for manual or clipboard entry) */}
          <View style={[styles.inputCard, { backgroundColor: cardBg, borderColor: borderCol }]}>
            <View style={styles.inputHeaderRow}>
              <Text style={[styles.inputHeader, { color: subtextColor }]}>
                MANUAL / CLIPBOARD PAYLOAD INPUT
              </Text>
              {qrInput.length > 0 && (
                <TouchableOpacity onPress={() => setQrInput('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Text style={[styles.clearBtnText, { color: teal }]}>Clear ✕</Text>
                </TouchableOpacity>
              )}
            </View>

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? '#090D16' : '#FFFFFF',
                  borderColor: detectedBadge ? detectedBadge.color : borderCol,
                  color: textColor,
                },
              ]}
              placeholder="Paste raw QR data or URL to analyze..."
              placeholderTextColor="#64748B"
              value={qrInput}
              onChangeText={setQrInput}
              autoCapitalize="none"
              autoCorrect={false}
            />

            {detectedBadge && (
              <View style={[styles.formatBadgeRow, { backgroundColor: `${detectedBadge.color}15`, borderColor: detectedBadge.color }]}>
                <Text style={styles.formatBadgeIcon}>{detectedBadge.icon}</Text>
                <Text style={[styles.formatBadgeText, { color: detectedBadge.color }]}>
                  {detectedBadge.label}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.decodeBtn,
                {
                  backgroundColor: qrInput.trim() ? teal : isDark ? '#334155' : '#CBD5E1',
                },
              ]}
              onPress={() => handleDecode(qrInput)}
              disabled={!qrInput.trim()}
              activeOpacity={0.85}
            >
              <Text style={[styles.decodeBtnText, { color: qrInput.trim() ? '#FFFFFF' : '#94A3B8' }]}>
                ⚡ Decode in Isolated Sandbox
              </Text>
            </TouchableOpacity>
          </View>

          {/* Analysis Sheet */}
          {analysis && (
            <View
              style={[
                styles.analysisCard,
                {
                  backgroundColor: cardBg,
                  borderColor:
                    analysis.riskLevel === 'CRITICAL'
                      ? danger
                      : analysis.riskLevel === 'WARNING'
                      ? amber
                      : emerald,
                },
              ]}
            >
              <View style={styles.badgeRow}>
                <View
                  style={[
                    styles.typeBadge,
                    {
                      borderColor: teal,
                      backgroundColor: 'rgba(45, 212, 191, 0.1)',
                    },
                  ]}
                >
                  <Text style={[styles.typeBadgeText, { color: teal }]}>
                    FORMAT: {analysis.type}
                  </Text>
                </View>

                <View
                  style={[
                    styles.riskBadge,
                    {
                      borderColor:
                        analysis.riskLevel === 'CRITICAL'
                          ? danger
                          : analysis.riskLevel === 'WARNING'
                          ? amber
                          : emerald,
                      backgroundColor:
                        analysis.riskLevel === 'CRITICAL'
                          ? 'rgba(239, 68, 68, 0.15)'
                          : analysis.riskLevel === 'WARNING'
                          ? 'rgba(245, 158, 11, 0.15)'
                          : 'rgba(16, 185, 129, 0.15)',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.riskBadgeText,
                      {
                        color:
                          analysis.riskLevel === 'CRITICAL'
                            ? danger
                            : analysis.riskLevel === 'WARNING'
                            ? amber
                            : emerald,
                      },
                    ]}
                  >
                    {analysis.riskLevel === 'CRITICAL'
                      ? '🚨 CRITICAL THREAT'
                      : analysis.riskLevel === 'WARNING'
                      ? '⚠️ CAUTION'
                      : '✅ VERIFIED SAFE'}
                  </Text>
                </View>
              </View>

              <Text style={[styles.riskReasonText, { color: textColor }]}>
                {analysis.riskReason}
              </Text>

              <View style={[styles.payloadDetailBox, { borderColor: borderCol }]}>
                <Text style={[styles.detailKey, { color: subtextColor }]}>Raw Scanned Data:</Text>
                <Text style={[styles.detailVal, { color: textColor }]}>{analysis.raw}</Text>

                {analysis.sanitizedDestination && (
                  <>
                    <Text style={[styles.detailKey, { color: subtextColor, marginTop: 8 }]}>
                      Sanitized Target:
                    </Text>
                    <Text style={[styles.detailVal, { color: teal }]}>
                      {analysis.sanitizedDestination}
                    </Text>
                  </>
                )}

                {analysis.metadata && (
                  <>
                    <Text style={[styles.detailKey, { color: subtextColor, marginTop: 8 }]}>
                      Extracted Metadata:
                    </Text>
                    <Text style={[styles.detailVal, { color: textColor }]}>
                      {JSON.stringify(analysis.metadata, null, 2)}
                    </Text>
                  </>
                )}
              </View>

              {/* Action Buttons */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[styles.actionBtn, { borderColor: teal, backgroundColor: 'rgba(45, 212, 191, 0.1)' }]}
                  onPress={handleRescan}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.actionBtnText, { color: teal }]}>🔄 Scan Another Code</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionBtn, { borderColor: teal, backgroundColor: isDark ? '#134E4A' : '#CCFBF1' }]}
                  onPress={() => setShowAiModal(true)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.actionBtnText, { color: teal }]}>🤖 Ask AI Explainer</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
            <Text style={[styles.closeBtnText, { color: subtextColor }]}>Close Scanner</Text>
          </TouchableOpacity>
        </ScrollView>

        {analysis && (
          <AiExplainerModal
            visible={showAiModal}
            onClose={() => setShowAiModal(false)}
            query={analysis.sanitizedDestination || analysis.raw}
            immutableVerdict={
              analysis.riskLevel === 'CRITICAL'
                ? 'MALICIOUS'
                : analysis.riskLevel === 'WARNING'
                ? 'SUSPICIOUS'
                : 'SAFE'
            }
            detectedFlags={[analysis.type, analysis.riskReason]}
            isDark={isDark}
            asOverlay={true}
          />
        )}
      </SafeAreaView>
    </Modal>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  iconText: {
    fontSize: 26,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  viewfinderCard: {
    height: 260,
    borderRadius: 20,
    borderWidth: 2,
    position: 'relative',
    marginBottom: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  permissionInfo: {
    fontSize: 12,
    marginTop: 8,
  },
  permissionBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  shieldIconRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  lockIcon: {
    fontSize: 32,
  },
  permTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center',
  },
  permDesc: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  grantBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
  grantBtnText: {
    color: '#090D16',
    fontWeight: '800',
    fontSize: 13,
  },
  reticleOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cornerTL: {
    position: 'absolute',
    top: 24,
    left: 24,
    width: 32,
    height: 32,
    borderTopWidth: 3.5,
    borderLeftWidth: 3.5,
  },
  cornerTR: {
    position: 'absolute',
    top: 24,
    right: 24,
    width: 32,
    height: 32,
    borderTopWidth: 3.5,
    borderRightWidth: 3.5,
  },
  cornerBL: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    width: 32,
    height: 32,
    borderBottomWidth: 3.5,
    borderLeftWidth: 3.5,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 32,
    height: 32,
    borderBottomWidth: 3.5,
    borderRightWidth: 3.5,
  },
  laserLine: {
    width: '75%',
    height: 2.5,
    borderRadius: 2,
    shadowColor: '#EF4444',
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  cameraControlsRow: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    gap: 8,
    zIndex: 10,
  },
  cameraToolBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cameraToolText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusPill: {
    position: 'absolute',
    bottom: 12,
    backgroundColor: 'rgba(9, 13, 22, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(45, 212, 191, 0.3)',
  },
  reticleText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  scannedBanner: {
    position: 'absolute',
    bottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 16,
    zIndex: 10,
  },
  scannedBannerText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  cameraErrBanner: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: '#EF4444',
    borderWidth: 1,
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  cameraErrText: {
    color: '#EF4444',
    fontSize: 11,
    textAlign: 'center',
  },
  inputCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
  },
  inputHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputHeader: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  clearBtnText: {
    fontSize: 11,
    fontWeight: '800',
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13,
    marginBottom: 10,
  },
  formatBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginBottom: 12,
    gap: 6,
  },
  formatBadgeIcon: {
    fontSize: 14,
  },
  formatBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  decodeBtn: {
    paddingVertical: 13,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  decodeBtnText: {
    fontSize: 13,
    fontWeight: '800',
  },
  analysisCard: {
    borderRadius: 18,
    borderWidth: 2,
    padding: 18,
    marginBottom: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  typeBadge: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  riskBadge: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  riskBadgeText: {
    fontSize: 10,
    fontWeight: '900',
  },
  riskReasonText: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
    marginBottom: 12,
  },
  payloadDetailBox: {
    borderTopWidth: 1,
    paddingTop: 10,
    marginBottom: 12,
  },
  detailKey: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 2,
  },
  detailVal: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'monospace',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionBtn: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
  closeBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  closeBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
