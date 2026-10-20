import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { TiltCard3D } from '../components/TiltCard3D';
import { WifiSentinelModal } from '../components/WifiSentinelModal';
import { LinkInspectorModal } from '../components/LinkInspectorModal';
import { QrScannerModal } from '../components/QrScannerModal';
import { AppPrivacyModal } from '../components/AppPrivacyModal';
import { ApiClient, ThreatInspectionResponse } from '../services/apiClient';

interface ScanHubScreenProps {
  isDark?: boolean;
}

export const ScanHubScreen: React.FC<ScanHubScreenProps> = ({ isDark = true }) => {
  const [showWifiModal, setShowWifiModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showAppPrivacyModal, setShowAppPrivacyModal] = useState(false);

  // Quick Direct URL Scan
  const [urlInput, setUrlInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ThreatInspectionResponse | null>(null);

  const bg = isDark ? '#090D16' : '#F8FAFC';
  const cardBg = isDark ? '#1E293B' : '#FFFFFF';
  const borderCol = isDark ? '#334155' : '#E2E8F0';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const subtextColor = isDark ? '#94A3B8' : '#64748B';
  const teal = isDark ? '#2DD4BF' : '#0D9488';
  const emerald = '#10B981';
  const danger = '#EF4444';
  const amber = '#F59E0B';

  const handleQuickScan = async () => {
    if (!urlInput.trim()) return;
    setIsScanning(true);
    try {
      const res = await ApiClient.inspectUrl(urlInput.trim());
      setScanResult(res);
    } catch {
      // Handled inside inspectUrl
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: textColor }]}>Threat Inspection Hub</Text>
          <Text style={[styles.subtitle, { color: subtextColor }]}>
            Zero-Trust defensive perimeter: audit networks, links, physical QR codes, and permissions.
          </Text>
        </View>

        {/* 4 Inspection Engines Grid */}
        <Text style={[styles.sectionTitle, { color: teal }]}>CORE INSPECTION SUITE</Text>

        <View style={styles.enginesGrid}>
          {/* 1. Wi-Fi Sentinel */}
          <TiltCard3D isDark={isDark} onPress={() => setShowWifiModal(true)}>
            <View style={styles.engineCardInner}>
              <View style={styles.engineTopRow}>
                <Text style={styles.engineIcon}>📶</Text>
                <View style={[styles.engineBadge, { backgroundColor: `${emerald}20`, borderColor: emerald }]}>
                  <Text style={[styles.engineBadgeText, { color: emerald }]}>PRE-CRIME ACTIVE</Text>
                </View>
              </View>
              <Text style={[styles.engineName, { color: textColor }]}>Wi-Fi Sentinel</Text>
              <Text style={[styles.engineDesc, { color: subtextColor }]}>
                Pre-connection 802.11 beacon evaluation. Detect Evil Twin honeypots, Pineapple APs, and unencrypted airspaces before you connect.
              </Text>
              <Text style={[styles.engineAction, { color: teal }]}>Launch Wi-Fi Scanner →</Text>
            </View>
          </TiltCard3D>

          {/* 2. Optical QR Scanner */}
          <TiltCard3D isDark={isDark} onPress={() => setShowQrModal(true)}>
            <View style={styles.engineCardInner}>
              <View style={styles.engineTopRow}>
                <Text style={styles.engineIcon}>⛶</Text>
                <View style={[styles.engineBadge, { backgroundColor: `${teal}20`, borderColor: teal }]}>
                  <Text style={[styles.engineBadgeText, { color: teal }]}>LIVE CAMERA</Text>
                </View>
              </View>
              <Text style={[styles.engineName, { color: textColor }]}>QR & Barcode Guard</Text>
              <Text style={[styles.engineDesc, { color: subtextColor }]}>
                Real-time camera optical decoder with automated sandbox URL & intent inspection to eliminate Quishing threats.
              </Text>
              <Text style={[styles.engineAction, { color: teal }]}>Launch QR Scanner →</Text>
            </View>
          </TiltCard3D>

          {/* 3. Link & Phishing Inspector */}
          <TiltCard3D isDark={isDark} onPress={() => setShowLinkModal(true)}>
            <View style={styles.engineCardInner}>
              <View style={styles.engineTopRow}>
                <Text style={styles.engineIcon}>🔗</Text>
                <View style={[styles.engineBadge, { backgroundColor: `${amber}20`, borderColor: amber }]}>
                  <Text style={[styles.engineBadgeText, { color: amber }]}>SSRF GUARDED</Text>
                </View>
              </View>
              <Text style={[styles.engineName, { color: textColor }]}>Link & Phishing Inspector</Text>
              <Text style={[styles.engineDesc, { color: subtextColor }]}>
                Multi-engine lexical heuristics, Punycode IDN homoglyph traps, brand impersonation, and private RFC1918 loopback blocking.
              </Text>
              <Text style={[styles.engineAction, { color: teal }]}>Launch Link Inspector →</Text>
            </View>
          </TiltCard3D>

          {/* 4. App Privacy Auditor */}
          <TiltCard3D isDark={isDark} onPress={() => setShowAppPrivacyModal(true)}>
            <View style={styles.engineCardInner}>
              <View style={styles.engineTopRow}>
                <Text style={styles.engineIcon}>🛡️</Text>
                <View style={[styles.engineBadge, { backgroundColor: `${emerald}20`, borderColor: emerald }]}>
                  <Text style={[styles.engineBadgeText, { color: emerald }]}>ON-DEVICE ONLY</Text>
                </View>
              </View>
              <Text style={[styles.engineName, { color: textColor }]}>App Permission Auditor</Text>
              <Text style={[styles.engineDesc, { color: subtextColor }]}>
                Inspect installed apps for dangerous sensor combinations (SMS + Internet OTP interception, Background Mic + Auto-start).
              </Text>
              <Text style={[styles.engineAction, { color: teal }]}>Review Permissions →</Text>
            </View>
          </TiltCard3D>
        </View>

        {/* Quick URL Scanner Card */}
        <View style={[styles.quickScanCard, { backgroundColor: cardBg, borderColor: borderCol }]}>
          <Text style={[styles.quickScanHeader, { color: textColor }]}>Quick URL Inspection</Text>
          <Text style={[styles.quickScanSub, { color: subtextColor }]}>
            Paste any suspicious link to check against live threat heuristics:
          </Text>

          <View style={styles.quickInputRow}>
            <TextInput
              style={[
                styles.quickInput,
                {
                  backgroundColor: isDark ? '#090D16' : '#F8FAFC',
                  borderColor: borderCol,
                  color: textColor,
                },
              ]}
              placeholder="https://example.com/login"
              placeholderTextColor="#64748B"
              value={urlInput}
              onChangeText={setUrlInput}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={[styles.quickBtn, { backgroundColor: teal }]}
              onPress={handleQuickScan}
              disabled={isScanning}
              activeOpacity={0.8}
            >
              {isScanning ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.quickBtnText}>Inspect</Text>
              )}
            </TouchableOpacity>
          </View>

          {scanResult && (
            <View
              style={[
                styles.scanResultBox,
                {
                  borderColor:
                    scanResult.verdict === 'MALICIOUS'
                      ? danger
                      : scanResult.verdict === 'SUSPICIOUS'
                      ? amber
                      : emerald,
                },
              ]}
            >
              <View style={styles.scanVerdictRow}>
                <Text
                  style={[
                    styles.scanVerdictBadge,
                    {
                      color:
                        scanResult.verdict === 'MALICIOUS'
                          ? danger
                          : scanResult.verdict === 'SUSPICIOUS'
                          ? amber
                          : emerald,
                    },
                  ]}
                >
                  VERDICT: {scanResult.verdict} ({scanResult.confidenceScore}% confidence)
                </Text>
              </View>
              <Text style={[styles.scanExplanation, { color: textColor }]}>
                {scanResult.plainLanguageExplanation}
              </Text>
              <Text style={[styles.scanRecommendation, { color: subtextColor }]}>
                Action: {scanResult.recommendation}
              </Text>
            </View>
          )}
        </View>
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
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 16,
  },
  header: {
    marginBottom: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  enginesGrid: {
    gap: 14,
  },
  engineCardInner: {
    padding: 16,
    gap: 8,
  },
  engineTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  engineIcon: {
    fontSize: 24,
  },
  engineBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  engineBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  engineName: {
    fontSize: 16,
    fontWeight: '800',
  },
  engineDesc: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
  },
  engineAction: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  quickScanCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 8,
  },
  quickScanHeader: {
    fontSize: 15,
    fontWeight: '800',
  },
  quickScanSub: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: 10,
  },
  quickInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickInput: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 13,
  },
  quickBtn: {
    height: 42,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  scanResultBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  scanVerdictRow: {
    flexDirection: 'row',
  },
  scanVerdictBadge: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  scanExplanation: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '500',
  },
  scanRecommendation: {
    fontSize: 11,
    lineHeight: 16,
  },
});
