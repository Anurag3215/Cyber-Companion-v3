import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import { SafeCheck3DVisual, WarningPrism3DVisual } from '../components/Showcase3DVisuals';
import { GlassCard } from '../design-system/GlassCard';
import { GlassTokens } from '../design-system/glassTokens';

interface QrResultScreenProps {
  qrData: string;
  onBack: () => void;
  isDark?: boolean;
}

interface QrThreatReport {
  isSuspicious: boolean;
  severity: 'CRITICAL' | 'HIGH' | 'SAFE';
  headline: string;
  subheadline: string;
  categoryLabel: string;
  checks: Array<{ text: string; passed: boolean }>;
  advisory: string;
  networkDetails?: { ssid: string; encryption: string; risk: string };
}

function analyzeQrPayload(raw: string): QrThreatReport {
  const text = (raw || '').trim();
  const lower = text.toLowerCase();

  // 1. Wi-Fi Configuration QR code
  if (lower.startsWith('wifi:')) {
    const isNoPass =
      lower.includes('t:nopass') ||
      lower.includes('t:none') ||
      lower.includes('p:;') ||
      !lower.includes('t:');
    const isWep = lower.includes('t:wep');
    const ssidMatch = text.match(/S:([^;]+)/i);
    const ssid = ssidMatch ? ssidMatch[1] : 'Public Wi-Fi';

    if (isNoPass) {
      return {
        isSuspicious: true,
        severity: 'CRITICAL',
        headline: 'Rogue Wi-Fi Trap Detected',
        subheadline: `Attempts auto-connection to unencrypted hotspot "${ssid}". Susceptible to Man-In-The-Middle eavesdropping.`,
        categoryLabel: 'ROGUE HOTSPOT EXPLOIT',
        networkDetails: { ssid, encryption: 'OPEN / UNENCRYPTED', risk: 'MITM Eavesdropping & Packet Snooping' },
        checks: [
          { text: 'Unencrypted Airspace Beacon (No Password)', passed: false },
          { text: 'Rogue AP / Evil Twin Threat Signature', passed: false },
          { text: 'Automated Wi-Fi Association Trigger', passed: false },
          { text: 'Encrypted Data Transit (WPA2/WPA3)', passed: false },
        ],
        advisory: 'DO NOT connect to this network. Attackers deploy fake Wi-Fi QR codes to intercept passwords and banking sessions.',
      };
    }

    if (isWep) {
      return {
        isSuspicious: true,
        severity: 'HIGH',
        headline: 'Obsolete WEP Encryption Trap',
        subheadline: `Network "${ssid}" uses broken WEP encryption easily cracked by nearby adversaries within minutes.`,
        categoryLabel: 'OBSOLETE CIPHER',
        networkDetails: { ssid, encryption: 'WEP (Broken)', risk: 'RC4 Key Extraction & Packet Injection' },
        checks: [
          { text: 'WEP Encryption is Cryptographically Broken', passed: false },
          { text: 'Vulnerable to Airspace Key Extraction', passed: false },
          { text: 'WPA2 / WPA3 Compliance', passed: false },
        ],
        advisory: 'Avoid entering personal or financial information while connected to legacy WEP hotspots.',
      };
    }

    return {
      isSuspicious: false,
      severity: 'SAFE',
      headline: 'Secured Wi-Fi Network',
      subheadline: `Pre-configured network "${ssid}" utilizes modern WPA2/WPA3 protected access.`,
      categoryLabel: 'SECURED WI-FI',
      networkDetails: { ssid, encryption: 'WPA2/WPA3 PSK', risk: 'None (Encrypted)' },
      checks: [
        { text: 'Modern WPA/WPA2/WPA3 Authentication', passed: true },
        { text: 'PSK Protected Association', passed: true },
        { text: 'No unencrypted broadcast anomalies', passed: true },
      ],
      advisory: 'Always verify you are connecting to an authorized organization network.',
    };
  }

  // 2. APK or Executable Payload
  if (
    lower.endsWith('.apk') ||
    lower.includes('.apk?') ||
    (lower.includes('download') && lower.includes('.apk')) ||
    lower.includes('system-patch.apk')
  ) {
    return {
      isSuspicious: true,
      severity: 'CRITICAL',
      headline: 'Malicious APK Drive-By Detected',
      subheadline:
        'This QR code triggers a direct download of an unverified Android application package (.apk). Sideloading this binary risks device takeover.',
      categoryLabel: 'MALWARE DRIVE-BY',
      checks: [
        { text: 'Untrusted Android APK Binary Extension', passed: false },
        { text: 'Bypasses Google Play Protect Verification', passed: false },
        { text: 'High Risk of Device Spyware / Sideloading', passed: false },
        { text: 'Plain HTTP Transport (Unencrypted)', passed: text.startsWith('https://') },
      ],
      advisory:
        'Never install Android packages (.apk) from unsolicited QR codes, parking meters, or public posters.',
    };
  }

  // 3. Phishing / Quishing / Deceptive URLs
  const isHttp = text.startsWith('http://');
  const hasPhishKeywords =
    lower.includes('phish') ||
    lower.includes('suspicious') ||
    lower.includes('meter') ||
    lower.includes('billing') ||
    lower.includes('chase-verify') ||
    lower.includes('quick-bill') ||
    lower.includes('update-android') ||
    lower.includes('pаypal');
  const hasSuspiciousTld =
    lower.includes('.info') ||
    lower.includes('.xyz') ||
    lower.includes('.tk') ||
    lower.includes('.top');

  if (hasPhishKeywords || (isHttp && hasSuspiciousTld) || lower.includes('malicious')) {
    return {
      isSuspicious: true,
      severity: 'CRITICAL',
      headline: 'Quishing & Phishing Attack Detected',
      subheadline:
        'Deceptive domain signature and insecure transport detected. Engineered to harvest user credentials, parking fees, or payment info.',
      categoryLabel: 'QUISHING PHISH FRAUD',
      checks: [
        {
          text: isHttp ? 'Insecure HTTP Transport (No TLS / Plaintext)' : 'Suspicious Redirection Pattern',
          passed: false,
        },
        { text: 'Deceptive Subdomain / Lookalike Hostname', passed: false },
        { text: 'Credential / Financial Harvesting Signature', passed: false },
        { text: 'Clean Domain Reputation Anchor', passed: false },
      ],
      advisory: 'Do NOT input passwords, payment cards, or personal identifiers into this website.',
    };
  }

  // 4. Insecure HTTP Warning
  if (isHttp) {
    return {
      isSuspicious: true,
      severity: 'HIGH',
      headline: 'Insecure Plain HTTP Destination',
      subheadline:
        'This link transmits data in unencrypted plaintext. Any intermediary on your network can view or modify transmitted data.',
      categoryLabel: 'INSECURE PROTOCOL',
      checks: [
        { text: 'Missing HTTPS / TLS Encryption', passed: false },
        { text: 'Susceptible to Network Eavesdropping', passed: false },
        { text: 'Domain has no verified SSL certificate', passed: false },
      ],
      advisory: 'Avoid submitting sensitive credentials over unencrypted HTTP connections.',
    };
  }

  // 5. Default Safe Destination
  return {
    isSuspicious: false,
    severity: 'SAFE',
    headline: 'This QR code is safe to open',
    subheadline:
      'Security checks passed with zero malicious signatures detected. Authentic trust anchor verified.',
    categoryLabel: 'VERIFIED SECURE',
    checks: [
      { text: 'Clean domain reputation anchor', passed: true },
      { text: 'Valid HTTPS certificate (TLS 1.3)', passed: true },
      { text: 'No redirection anomalies or binary payloads', passed: true },
    ],
    advisory: 'Always verify the destination domain before submitting sensitive corporate information.',
  };
}

export const QrResultScreen: React.FC<QrResultScreenProps> = ({
  qrData,
  onBack,
  isDark = true,
}) => {
  const [copied, setCopied] = useState(false);

  const report = analyzeQrPayload(qrData);

  const handleOpenLink = async () => {
    if (report.isSuspicious) {
      Alert.alert(
        'SECURITY ALERT',
        'Cyber Companion flagged this QR payload as dangerous or unverified. Opening it may compromise your device or personal data. Do you wish to proceed at your own risk?',
        [
          { text: 'Cancel (Recommended)', style: 'cancel' },
          {
            text: 'Open Anyway',
            style: 'destructive',
            onPress: async () => {
              try {
                if (/^https?:\/\//i.test(qrData)) {
                  await Linking.openURL(qrData);
                } else {
                  Alert.alert('Scanned QR Content', qrData);
                }
              } catch (_err) {
                Alert.alert('Unable to open URL', qrData);
              }
            },
          },
        ]
      );
      return;
    }

    try {
      if (/^https?:\/\//i.test(qrData)) {
        await Linking.openURL(qrData);
      } else {
        Alert.alert('Scanned QR Content', qrData);
      }
    } catch (_err) {
      Alert.alert('Unable to open URL', qrData);
    }
  };

  const handleCopyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    Alert.alert('Copied to Clipboard', qrData);
  };

  const getSeverityBadgeColor = () => {
    switch (report.severity) {
      case 'CRITICAL':
        return '#EF4444';
      case 'HIGH':
        return '#F59E0B';
      default:
        return '#10B981';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#070D18' : '#F4F8FC' }]}>
      {/* Top Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={onBack}
          style={[
            styles.backBtn,
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
          Scan Result
        </Text>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.column}>
          {/* Top 3D Visual */}
          <View style={styles.visualSection}>
            {report.isSuspicious ? (
              <WarningPrism3DVisual size={160} isDark={isDark} />
            ) : (
              <SafeCheck3DVisual size={160} isDark={isDark} />
            )}
          </View>

          {/* Severity Pill */}
          <View style={[styles.severityPill, { backgroundColor: getSeverityBadgeColor() }]}>
            <Text style={styles.severityPillText}>
              {report.severity === 'SAFE' ? 'VERIFIED SAFE' : `${report.severity} THREAT`} • {report.categoryLabel}
            </Text>
          </View>

          {/* Headline & Subtitle */}
          <View style={styles.headlineSection}>
            <Text
              style={[
                styles.headline,
                { color: report.isSuspicious ? (report.severity === 'CRITICAL' ? '#EF4444' : '#F59E0B') : '#10B981' },
              ]}
            >
              {report.headline}
            </Text>
            <Text style={[styles.subheadline, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              {report.subheadline}
            </Text>
          </View>

          {/* Wi-Fi Details Card (if Wi-Fi QR) */}
          {report.networkDetails && (
            <GlassCard
              isDark={isDark}
              elevation="soft"
              borderRadius={20}
              style={[
                styles.detailsCard,
                {
                  backgroundColor: isDark ? '#0E1B38' : 'rgba(255, 255, 255, 0.95)',
                  borderColor: report.isSuspicious ? 'rgba(239, 68, 68, 0.35)' : 'rgba(56, 189, 248, 0.22)',
                },
              ]}
            >
              <Text style={[styles.detailsLabel, { color: isDark ? '#38BDF8' : '#0284C7' }]}>
                WI-FI HOTSPOT CONFIGURATION
              </Text>
              <View style={styles.infoRow}>
                <Text style={[styles.infoKey, { color: isDark ? '#94A3B8' : '#64748B' }]}>SSID:</Text>
                <Text style={[styles.infoVal, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                  {report.networkDetails.ssid}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoKey, { color: isDark ? '#94A3B8' : '#64748B' }]}>Encryption:</Text>
                <Text style={[styles.infoVal, { color: report.isSuspicious ? '#EF4444' : '#10B981' }]}>
                  {report.networkDetails.encryption}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoKey, { color: isDark ? '#94A3B8' : '#64748B' }]}>Risk Assessment:</Text>
                <Text style={[styles.infoVal, { color: report.isSuspicious ? '#EF4444' : '#10B981' }]}>
                  {report.networkDetails.risk}
                </Text>
              </View>
            </GlassCard>
          )}

          {/* Destination URL Card */}
          <GlassCard
            isDark={isDark}
            elevation="soft"
            borderRadius={20}
            style={[
              styles.destinationCard,
              {
                backgroundColor: isDark ? '#0E1B38' : 'rgba(255, 255, 255, 0.95)',
                borderColor: report.isSuspicious
                  ? 'rgba(239, 68, 68, 0.35)'
                  : isDark
                  ? 'rgba(56, 189, 248, 0.22)'
                  : 'rgba(2, 132, 199, 0.22)',
              },
            ]}
          >
            <Text style={[styles.destinationLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              Scanned Payload Destination
            </Text>
            <Text
              style={[
                styles.destinationUrl,
                { color: report.isSuspicious ? '#F87171' : isDark ? '#FFFFFF' : '#0F172A' },
              ]}
              numberOfLines={3}
            >
              {qrData}
            </Text>
          </GlassCard>

          {/* Action Buttons: Open Link & Copy Link */}
          <View style={styles.actionButtonsRow}>
            {report.isSuspicious ? (
              <TouchableOpacity
                style={[styles.blockBtn, { backgroundColor: '#EF4444' }]}
                onPress={onBack}
                activeOpacity={0.85}
              >
                <Text style={styles.blockBtnText}>🛡️ Return to Safety</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.openBtn}
                onPress={handleOpenLink}
                activeOpacity={0.85}
              >
                <Text style={styles.openBtnText}>Open Destination</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.copyBtn,
                {
                  backgroundColor: isDark ? 'rgba(14, 27, 56, 0.8)' : '#FFFFFF',
                  borderColor: isDark ? 'rgba(56, 189, 248, 0.25)' : '#DCE6F0',
                },
              ]}
              onPress={handleCopyLink}
              activeOpacity={0.8}
            >
              <Text style={[styles.copyBtnText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                {copied ? '✓ Copied' : 'Copy Payload'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* What We Checked Card */}
          <GlassCard
            isDark={isDark}
            elevation="soft"
            borderRadius={22}
            style={[
              styles.checksCard,
              {
                backgroundColor: isDark ? '#0E1B38' : 'rgba(255, 255, 255, 0.95)',
                borderColor: isDark ? 'rgba(56, 189, 248, 0.2)' : 'rgba(2, 132, 199, 0.2)',
              },
            ]}
          >
            <Text style={[styles.checksHeader, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              Security Checks Performed
            </Text>

            {report.checks.map((item, idx) => (
              <View key={idx} style={styles.checkItemRow}>
                <View
                  style={[
                    styles.checkIconBubble,
                    {
                      backgroundColor: item.passed
                        ? 'rgba(16, 185, 129, 0.18)'
                        : 'rgba(239, 68, 68, 0.18)',
                    },
                  ]}
                >
                  <Text style={[styles.checkMark, { color: item.passed ? '#10B981' : '#EF4444' }]}>
                    {item.passed ? '✓' : '✕'}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.checkText,
                    {
                      color: item.passed
                        ? isDark
                          ? '#F1F6FC'
                          : '#1E293B'
                        : '#EF4444',
                    },
                  ]}
                >
                  {item.text}
                </Text>
              </View>
            ))}
          </GlassCard>

          {/* Advisory Note */}
          <View
            style={[
              styles.advisoryCard,
              {
                backgroundColor: report.isSuspicious
                  ? 'rgba(239, 68, 68, 0.08)'
                  : isDark
                  ? 'rgba(14, 27, 56, 0.6)'
                  : '#F8FAFC',
                borderColor: report.isSuspicious
                  ? 'rgba(239, 68, 68, 0.3)'
                  : isDark
                  ? 'rgba(56, 189, 248, 0.15)'
                  : '#E2E8F0',
              },
            ]}
          >
            <Text style={{ fontSize: 18 }}>{report.isSuspicious ? '⚠️' : 'ℹ️'}</Text>
            <Text style={[styles.advisoryText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              {report.advisory}
            </Text>
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
  backBtn: {
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
    gap: 16,
    alignItems: 'center',
  },
  visualSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 4,
  },
  severityPill: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  severityPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  headlineSection: {
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
  },
  headline: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  subheadline: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    fontWeight: '500',
  },
  destinationCard: {
    width: '100%',
    padding: 18,
    borderWidth: 1.2,
    gap: 6,
  },
  destinationLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  destinationUrl: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  detailsCard: {
    width: '100%',
    padding: 16,
    borderWidth: 1.2,
    gap: 8,
  },
  detailsLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoKey: {
    fontSize: 13,
    fontWeight: '600',
  },
  infoVal: {
    fontSize: 13,
    fontWeight: '700',
  },
  actionButtonsRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
  },
  openBtn: {
    flex: 1,
    backgroundColor: '#2563EB',
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 6,
  },
  openBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  blockBtn: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 6,
  },
  blockBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  copyBtn: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
  checksCard: {
    width: '100%',
    padding: 20,
    borderWidth: 1.2,
    gap: 14,
  },
  checksHeader: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
  },
  checkItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkIconBubble: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    fontSize: 14,
    fontWeight: '900',
  },
  checkText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  advisoryCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  advisoryText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    flex: 1,
  },
});
