import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { classifyQrPayload } from '../services/qrScannerService';

interface QrScannerModalProps {
  visible: boolean;
  onClose: () => void;
  isDark?: boolean;
}

const SAMPLE_QR_PAYLOADS = [
  { label: 'Wi-Fi Config', value: 'WIFI:S:Starbucks_Guest_Open;T:nopass;P:;;' },
  { label: 'Phishing URL', value: 'https://secure-appleid-verify.cc/login' },
  { label: 'Crypto Address', value: 'bitcoin:1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa?amount=0.05' },
  { label: 'Malicious SMS Intent', value: 'smsto:+19005550199:SEND_TOKEN_AUTH' },
  { label: 'Verified Safe', value: 'https://www.github.com' },
];

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  visible,
  onClose,
  isDark = true,
}) => {
  const [qrInput, setQrInput] = useState('WIFI:S:Starbucks_Guest_Open;T:nopass;P:;;');
  const [analysis, setAnalysis] = useState<any>(null);

  const bg = isDark ? '#090D16' : '#FFFFFF';
  const cardBg = isDark ? '#1E293B' : '#F8FAFC';
  const borderCol = isDark ? '#334155' : '#E2E8F0';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const subtextColor = isDark ? '#94A3B8' : '#64748B';
  const teal = isDark ? '#2DD4BF' : '#0D9488';
  const emerald = '#10B981';
  const danger = '#EF4444';
  const amber = '#F59E0B';

  const handleDecode = (payload: string) => {
    if (!payload.trim()) return;
    const classified = classifyQrPayload(payload.trim());

    // Enrich with deep security analysis
    let riskLevel: 'SAFE' | 'WARNING' | 'CRITICAL' = 'SAFE';
    let riskReason = 'Payload conforms to standard formats with zero malicious triggers.';

    if (classified.type === 'WIFI') {
      const auth = (classified.metadata as any)?.authType || 'OPEN';
      if (auth === 'nopass' || auth === 'OPEN') {
        riskLevel = 'WARNING';
        riskReason = 'Unencrypted Wi-Fi configuration. Anyone on this network can intercept your unencrypted traffic.';
      }
    } else if (classified.type === 'URL') {
      const dest = classified.sanitizedDestination || '';
      if (dest.includes('verify') || dest.includes('.cc') || dest.includes('login')) {
        riskLevel = 'CRITICAL';
        riskReason = 'URL mimics a corporate login portal and uses an untrusted TLD.';
      }
    } else if (classified.type === 'UNKNOWN') {
      if (payload.startsWith('smsto:') || payload.startsWith('tel:')) {
        riskLevel = 'CRITICAL';
        riskReason = 'Premium rate SMS/Calling intent scheme. Opening this may bill unwanted charges to your phone.';
      }
    }

    setAnalysis({
      ...classified,
      riskLevel,
      riskReason,
    });
  };

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
              Zero-Execution Payload Preview & Intent Sanitizer
            </Text>
          </View>

          {/* Scanner Viewfinder Simulator */}
          <View style={[styles.viewfinderCard, { backgroundColor: isDark ? '#090D16' : '#F1F5F9', borderColor: teal }]}>
            <View style={[styles.cornerTL, { borderColor: teal }]} />
            <View style={[styles.cornerTR, { borderColor: teal }]} />
            <View style={[styles.cornerBL, { borderColor: teal }]} />
            <View style={[styles.cornerBR, { borderColor: teal }]} />
            <View style={[styles.laserLine, { backgroundColor: danger }]} />
            <Text style={[styles.reticleText, { color: teal }]}>SCANNER RETICLE ARMED</Text>
          </View>

          {/* Input Box */}
          <View style={[styles.inputCard, { backgroundColor: cardBg, borderColor: borderCol }]}>
            <Text style={[styles.inputHeader, { color: subtextColor }]}>OR PASTE QR PAYLOAD / BARCODE</Text>
            <TextInput
              style={[styles.input, { backgroundColor: isDark ? '#090D16' : '#FFFFFF', borderColor: borderCol, color: textColor }]}
              placeholder="WIFI:S:MyNet;T:WPA;P:pass;;"
              placeholderTextColor="#64748B"
              value={qrInput}
              onChangeText={setQrInput}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity
              style={[styles.decodeBtn, { backgroundColor: teal }]}
              onPress={() => handleDecode(qrInput)}
              activeOpacity={0.85}
            >
              <Text style={styles.decodeBtnText}>⚡ Decode in Isolated Sandbox</Text>
            </TouchableOpacity>
          </View>

          {/* Preset Test Samples */}
          <View style={styles.samplesSection}>
            <Text style={[styles.samplesLabel, { color: subtextColor }]}>TEST VECTORS PRESETS:</Text>
            <View style={styles.chipsRow}>
              {SAMPLE_QR_PAYLOADS.map((sample, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.chip, { backgroundColor: cardBg, borderColor: borderCol }]}
                  onPress={() => {
                    setQrInput(sample.value);
                    handleDecode(sample.value);
                  }}
                >
                  <Text style={[styles.chipText, { color: teal }]}>{sample.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
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
                    {analysis.riskLevel}
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
                      Sanitized Execution Target:
                    </Text>
                    <Text style={[styles.detailVal, { color: teal }]}>
                      {analysis.sanitizedDestination}
                    </Text>
                  </>
                )}

                {analysis.metadata && (
                  <>
                    <Text style={[styles.detailKey, { color: subtextColor, marginTop: 8 }]}>
                      Parsed Fields:
                    </Text>
                    <Text style={[styles.detailVal, { color: textColor }]}>
                      {JSON.stringify(analysis.metadata, null, 2)}
                    </Text>
                  </>
                )}
              </View>
            </View>
          )}

          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
            <Text style={[styles.closeBtnText, { color: subtextColor }]}>Close Scanner</Text>
          </TouchableOpacity>
        </ScrollView>
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
    height: 140,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 16,
    overflow: 'hidden',
  },
  cornerTL: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 24,
    height: 24,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  cornerTR: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  cornerBL: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    width: 24,
    height: 24,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 24,
    height: 24,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  laserLine: {
    width: '80%',
    height: 2,
    opacity: 0.8,
  },
  reticleText: {
    position: 'absolute',
    bottom: 14,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  inputCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
  },
  inputHeader: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13,
    marginBottom: 12,
  },
  decodeBtn: {
    paddingVertical: 13,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  decodeBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  samplesSection: {
    marginBottom: 16,
  },
  samplesLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '700',
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
  closeBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  closeBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
