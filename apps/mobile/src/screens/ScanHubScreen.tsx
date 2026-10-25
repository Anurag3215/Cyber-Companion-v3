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
import { WifiSentinelModal } from '../components/WifiSentinelModal';
import { LinkInspectorModal } from '../components/LinkInspectorModal';
import { QrScannerModal } from '../components/QrScannerModal';
import { AppPrivacyModal } from '../components/AppPrivacyModal';
import { ApiClient, ThreatInspectionResponse } from '../services/apiClient';
import { GlassCard } from '../design-system/GlassCard';
import { GlassActionCard } from '../design-system/GlassActionCard';
import { GlassResultCard } from '../design-system/GlassResultCard';
import { GlassTokens } from '../design-system/glassTokens';

interface ScanHubScreenProps {
  onNavigateToWifiAnalyzer?: () => void;
  onNavigateToUrlScanner?: () => void;
  onNavigateToQrScanner?: () => void;
  onNavigateToPermissionAnalyzer?: () => void;
  isDark?: boolean;
}

export const ScanHubScreen: React.FC<ScanHubScreenProps> = ({
  onNavigateToWifiAnalyzer,
  onNavigateToUrlScanner,
  onNavigateToQrScanner,
  onNavigateToPermissionAnalyzer,
  isDark = true,
}) => {
  const [showWifiModal, setShowWifiModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showAppPrivacyModal, setShowAppPrivacyModal] = useState(false);

  // Quick Direct URL Scan
  const [urlInput, setUrlInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ThreatInspectionResponse | null>(null);

  const theme = isDark ? GlassTokens.colors.dark : GlassTokens.colors.light;

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
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            Threat Inspection Hub
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Zero-Trust defensive perimeter: inspect Wi-Fi airspaces, suspicious links, QR codes, and app permissions.
          </Text>
        </View>

        {/* 4 Inspection Engines Grid */}
        <Text style={[styles.sectionTitle, { color: theme.primary }]}>
          CORE DEFENSE SUITE
        </Text>

        <View style={styles.enginesGrid}>
          {/* Row 1: Wi-Fi & Link */}
          <View style={styles.gridRow}>
            <View style={styles.gridCol}>
              <GlassActionCard
                icon="📶"
                title="Wi-Fi Sentinel"
                subtitle="Rogue AP & beacon analysis"
                badgeText="Airspace"
                onPress={() =>
                  onNavigateToWifiAnalyzer ? onNavigateToWifiAnalyzer() : setShowWifiModal(true)
                }
                isDark={isDark}
              />
            </View>

            <View style={styles.gridCol}>
              <GlassActionCard
                icon="🔗"
                title="Link Inspector"
                subtitle="Phishing & scam detection"
                badgeText="Guarded"
                onPress={() =>
                  onNavigateToUrlScanner ? onNavigateToUrlScanner() : setShowLinkModal(true)
                }
                isDark={isDark}
              />
            </View>
          </View>

          {/* Row 2: QR & Apps */}
          <View style={styles.gridRow}>
            <View style={styles.gridCol}>
              <GlassActionCard
                icon="⛶"
                title="QR Scanner"
                subtitle="Live camera sandbox"
                badgeText="Camera"
                onPress={() =>
                  onNavigateToQrScanner ? onNavigateToQrScanner() : setShowQrModal(true)
                }
                isDark={isDark}
              />
            </View>

            <View style={styles.gridCol}>
              <GlassActionCard
                icon="🛡️"
                title="App Privacy"
                subtitle="On-device sensor auditor"
                badgeText="Privacy"
                onPress={() =>
                  onNavigateToPermissionAnalyzer
                    ? onNavigateToPermissionAnalyzer()
                    : setShowAppPrivacyModal(true)
                }
                isDark={isDark}
              />
            </View>
          </View>
        </View>

        {/* Quick URL Scanner Glass Card */}
        <GlassCard
          isDark={isDark}
          elevation="floating"
          borderRadius={GlassTokens.radii.xl}
          style={styles.quickCard}
        >
          <View style={styles.quickCardInner}>
            <View style={styles.quickCardHeaderRow}>
              <Text style={styles.quickCardIcon}>⚡</Text>
              <View style={styles.quickCardTitleWrap}>
                <Text style={[styles.quickScanHeader, { color: theme.textPrimary }]}>
                  Quick Web Link Check
                </Text>
                <Text style={[styles.quickScanSub, { color: theme.textSecondary }]}>
                  Paste any web link or SMS message link before opening:
                </Text>
              </View>
            </View>

            <View style={styles.quickInputRow}>
              <TextInput
                style={[
                  styles.quickInput,
                  {
                    backgroundColor: isDark ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.9)',
                    borderColor: theme.glassBorder,
                    color: theme.textPrimary,
                  },
                ]}
                placeholder="https://example.com/verify-account"
                placeholderTextColor="#64748B"
                value={urlInput}
                onChangeText={setUrlInput}
                autoCapitalize="none"
                autoCorrect={false}
                onSubmitEditing={handleQuickScan}
              />

              {urlInput.length > 0 && (
                <TouchableOpacity
                  style={styles.clearBtn}
                  onPress={() => {
                    setUrlInput('');
                    setScanResult(null);
                  }}
                >
                  <Text style={[styles.clearBtnText, { color: theme.textMuted }]}>✕</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[
                  styles.quickBtn,
                  {
                    backgroundColor: theme.primary,
                    opacity: isScanning || !urlInput.trim() ? 0.7 : 1,
                  },
                ]}
                onPress={handleQuickScan}
                disabled={isScanning || !urlInput.trim()}
                activeOpacity={0.8}
              >
                {isScanning ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.quickBtnText}>Check Link</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Glass Result Card when scanned */}
            {scanResult && (
              <GlassResultCard
                verdict={
                  scanResult.verdict === 'MALICIOUS'
                    ? 'DANGER'
                    : scanResult.verdict === 'SUSPICIOUS'
                    ? 'CAUTION'
                    : 'SAFE'
                }
                title={
                  scanResult.verdict === 'MALICIOUS'
                    ? 'Dangerous Phishing Link Detected'
                    : scanResult.verdict === 'SUSPICIOUS'
                    ? 'Suspicious Link Anomalies Found'
                    : 'Verified Safe to Open'
                }
                target={scanResult.target}
                explanation={scanResult.plainLanguageExplanation}
                recommendation={scanResult.recommendation}
                score={scanResult.confidenceScore}
                primaryActionLabel={
                  scanResult.verdict === 'MALICIOUS'
                    ? 'Block Link'
                    : scanResult.verdict === 'SUSPICIOUS'
                    ? 'Inspect Deeply'
                    : 'Acknowledge'
                }
                onPrimaryAction={() => {
                  if (scanResult.verdict === 'MALICIOUS') {
                    setUrlInput('');
                    setScanResult(null);
                  } else {
                    setShowLinkModal(true);
                  }
                }}
                isDark={isDark}
              />
            )}
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
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scroll: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 115, // Clear floating glass navigation bar
    gap: 16,
  },
  header: {
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.6,
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
    gap: 12,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  gridCol: {
    flex: 1,
  },
  quickCard: {
    marginTop: 6,
  },
  quickCardInner: {
    padding: 18,
    gap: 14,
  },
  quickCardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quickCardIcon: {
    fontSize: 24,
  },
  quickCardTitleWrap: {
    flex: 1,
    gap: 2,
  },
  quickScanHeader: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  quickScanSub: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
  quickInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    position: 'relative',
  },
  quickInput: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    borderWidth: 1.2,
    paddingHorizontal: 14,
    paddingRight: 36,
    fontSize: 13,
  },
  clearBtn: {
    position: 'absolute',
    right: 120,
    padding: 8,
  },
  clearBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  quickBtn: {
    height: 46,
    paddingHorizontal: 18,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
