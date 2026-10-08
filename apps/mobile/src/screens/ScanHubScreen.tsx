import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Tokens } from '../design-system/tokens';
import { RiskBadge } from '../design-system/RiskBadge';
import { ScanResultSheet } from '../design-system/ScanResultSheet';

export const ScanHubScreen: React.FC = () => {
  const [urlInput, setUrlInput] = useState('');
  const [activeResult, setActiveResult] = useState<any>(null);

  const handleTestUrlScan = () => {
    if (!urlInput.trim()) return;
    const isMockMalicious =
      urlInput.includes('phish') || urlInput.includes('bank-update') || urlInput.includes('login-verify');

    setActiveResult({
      target: urlInput,
      verdict: isMockMalicious ? 'MALICIOUS' : 'SAFE',
      confidenceScore: isMockMalicious ? 96 : 99,
      plainLanguageExplanation: isMockMalicious
        ? 'This URL uses deceptive characters imitating a known financial institution. Submitting passwords here will compromise your account.'
        : 'Domain has valid SSL certificates, legitimate age, and clean reputation across all threat engines.',
      recommendation: isMockMalicious
        ? 'Do not open this link or enter passwords. Delete the message containing it.'
        : 'URL appears safe for general browsing.',
      heuristicsTriggered: isMockMalicious
        ? ['Punycode homoglyph detected', 'Newly registered domain (< 48 hrs)', 'Known phishing keyword pattern']
        : [],
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Threat Inspection Hub</Text>
      <Text style={styles.subtitle}>
        Analyze Wi-Fi encryption, scan URLs for phishing, or decode QR codes safely.
      </Text>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Current Wi-Fi Status</Text>
          <RiskBadge level="SAFE" label="WPA3 SECURE" />
        </View>
        <Text style={styles.networkName}>Connected: Office_Secure_5GHz</Text>
        <Text style={styles.networkDetail}>Signal: -58 dBm · Encryption: Protected Management Frames enabled</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Live URL Threat Scanner</Text>
        <Text style={styles.cardDetail}>
          Inspect links before opening to prevent phishing and malware infections.
        </Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Enter or paste URL (e.g. https://...)"
            placeholderTextColor="#64748B"
            value={urlInput}
            onChangeText={setUrlInput}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity style={styles.scanBtn} onPress={handleTestUrlScan}>
            <Text style={styles.scanBtnText}>Scan</Text>
          </TouchableOpacity>
        </View>
      </View>

      {activeResult && (
        <ScanResultSheet
          target={activeResult.target}
          verdict={activeResult.verdict}
          confidenceScore={activeResult.confidenceScore}
          plainLanguageExplanation={activeResult.plainLanguageExplanation}
          recommendation={activeResult.recommendation}
          heuristicsTriggered={activeResult.heuristicsTriggered}
          onDismiss={() => setActiveResult(null)}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Tokens.colors.dark.background,
  },
  content: {
    padding: Tokens.spacing.lg,
  },
  title: {
    fontSize: Tokens.typography.titleLarge.fontSize,
    fontWeight: Tokens.typography.titleLarge.fontWeight,
    color: Tokens.colors.dark.textPrimary,
  },
  subtitle: {
    fontSize: Tokens.typography.body.fontSize,
    color: Tokens.colors.dark.textSecondary,
    marginTop: 4,
    marginBottom: Tokens.spacing.lg,
  },
  card: {
    backgroundColor: Tokens.colors.dark.surface,
    borderRadius: Tokens.radii.lg,
    padding: Tokens.spacing.lg,
    borderWidth: 1,
    borderColor: Tokens.colors.dark.border,
    marginBottom: Tokens.spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Tokens.spacing.xs,
  },
  cardTitle: {
    fontSize: Tokens.typography.bodyBold.fontSize,
    fontWeight: Tokens.typography.bodyBold.fontWeight,
    color: Tokens.colors.dark.textPrimary,
  },
  networkName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#38BDF8',
    marginTop: 4,
  },
  networkDetail: {
    fontSize: 12,
    color: Tokens.colors.dark.textMuted,
    marginTop: 2,
  },
  cardDetail: {
    fontSize: 13,
    color: Tokens.colors.dark.textSecondary,
    marginVertical: Tokens.spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  input: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderRadius: Tokens.radii.md,
    borderWidth: 1,
    borderColor: Tokens.colors.dark.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#F8FAFC',
    fontSize: 14,
  },
  scanBtn: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 20,
    borderRadius: Tokens.radii.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
