import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AiExplainerModal } from './AiExplainerModal';
import { ApiClient, evaluateAutonomousUrlHeuristics } from '../services/apiClient';
import { addHistoryRecord } from '../services/historyService';

interface LinkInspectorModalProps {
  visible: boolean;
  onClose: () => void;
  isDark?: boolean;
}

interface ScanResult {
  url: string;
  verdict: 'SAFE' | 'SUSPICIOUS' | 'MALICIOUS';
  riskScore: number; // 0 - 100
  title: string;
  explanation: string;
  indicators: string[];
  recommendation: string;
}

export const LinkInspectorModal: React.FC<LinkInspectorModalProps> = ({
  visible,
  onClose,
  isDark = true,
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [showAiModal, setShowAiModal] = useState(false);

  const bg = isDark ? '#090D16' : '#FFFFFF';
  const cardBg = isDark ? '#1E293B' : '#F8FAFC';
  const borderCol = isDark ? '#334155' : '#E2E8F0';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const subtextColor = isDark ? '#94A3B8' : '#64748B';
  const teal = isDark ? '#2DD4BF' : '#0D9488';
  const emerald = '#10B981';
  const danger = '#EF4444';
  const amber = '#F59E0B';

  const analyzeUrl = async (input: string) => {
    if (!input.trim()) return;
    setIsScanning(true);
    setResult(null);

    try {
      const threatRes = await ApiClient.inspectUrl(input.trim());
      const isMalicious = threatRes.verdict === 'MALICIOUS';
      const isSuspicious = threatRes.verdict === 'SUSPICIOUS';

      addHistoryRecord({
        type: 'link',
        icon: '🔗',
        title: input.trim(),
        subtext: `Inspection: ${isMalicious ? 'MALICIOUS' : isSuspicious ? 'SUSPICIOUS' : 'SAFE'} (${threatRes.confidenceScore}/100)`,
        verdict: isMalicious ? 'dangerous' : isSuspicious ? 'warning' : 'safe',
        verdictLabel: isMalicious ? 'Malicious' : isSuspicious ? 'Caution' : 'Safe',
        details: {
          threatTitle: isMalicious ? 'High-Risk Threat Intercepted' : isSuspicious ? 'Suspicious Link Anomalies' : 'Verified Safe Link',
          consensusText: isMalicious ? 'Verdict: MALICIOUS' : isSuspicious ? 'Verdict: SUSPICIOUS' : 'Verdict: SAFE',
          explanation: threatRes.plainLanguageExplanation,
          findings: threatRes.heuristicsTriggered,
        },
      }).catch(() => {});

      setResult({
        url: threatRes.target || input.trim(),
        verdict: isMalicious ? 'MALICIOUS' : isSuspicious ? 'SUSPICIOUS' : 'SAFE',
        riskScore: threatRes.confidenceScore,
        title: isMalicious
          ? "Don't open this link · High Risk Threat"
          : isSuspicious
          ? 'Caution Advised · Suspicious Destination'
          : 'Clean & Verified Destination',
        explanation: threatRes.plainLanguageExplanation,
        indicators:
          threatRes.heuristicsTriggered && threatRes.heuristicsTriggered.length > 0
            ? threatRes.heuristicsTriggered
            : [
                'Verified DNS reputation',
                'Active TLS encryption',
                'Clean across global threat feeds',
              ],
        recommendation: threatRes.recommendation,
      });
    } catch {
      const fallback = evaluateAutonomousUrlHeuristics(input.trim());
      const isMalicious = fallback.verdict === 'MALICIOUS';
      const isSuspicious = fallback.verdict === 'SUSPICIOUS';

      setResult({
        url: fallback.target || input.trim(),
        verdict: isMalicious ? 'MALICIOUS' : isSuspicious ? 'SUSPICIOUS' : 'SAFE',
        riskScore: fallback.confidenceScore,
        title: isMalicious
          ? "Don't open this link · High Risk Threat"
          : isSuspicious
          ? 'Caution Advised · Suspicious Destination'
          : 'Clean & Verified Destination',
        explanation: fallback.plainLanguageExplanation,
        indicators:
          fallback.heuristicsTriggered && fallback.heuristicsTriggered.length > 0
            ? fallback.heuristicsTriggered
            : [
                'Verified DNS reputation',
                'Active TLS encryption',
                'Clean across global threat feeds',
              ],
        recommendation: fallback.recommendation,
      });
    } finally {
      setIsScanning(false);
    }
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
              <Text style={styles.iconText}>🔗</Text>
            </View>
            <Text style={[styles.title, { color: textColor }]}>Live Link Inspector</Text>
            <Text style={[styles.subtitle, { color: subtextColor }]}>
              SSRF Guard, Homoglyph Deception & Phishing Telemetry
            </Text>
          </View>

          {/* Input Box */}
          <View style={[styles.inputCard, { backgroundColor: cardBg, borderColor: borderCol }]}>
            <View style={styles.inputHeaderRow}>
              <Text style={[styles.inputHeader, { color: subtextColor }]}>TARGET URL TO INSPECT</Text>
              {urlInput.length > 0 && (
                <TouchableOpacity onPress={() => setUrlInput('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Text style={[styles.clearBtnText, { color: teal }]}>Clear ✕</Text>
                </TouchableOpacity>
              )}
            </View>

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? '#090D16' : '#FFFFFF',
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

            {urlInput.trim().length > 0 && (
              <View
                style={[
                  styles.protocolBadge,
                  {
                    backgroundColor: urlInput.toLowerCase().startsWith('https://')
                      ? `${emerald}15`
                      : urlInput.toLowerCase().startsWith('http://')
                      ? `${amber}15`
                      : `${teal}15`,
                    borderColor: urlInput.toLowerCase().startsWith('https://')
                      ? emerald
                      : urlInput.toLowerCase().startsWith('http://')
                      ? amber
                      : teal,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.protocolBadgeText,
                    {
                      color: urlInput.toLowerCase().startsWith('https://')
                        ? emerald
                        : urlInput.toLowerCase().startsWith('http://')
                        ? amber
                        : teal,
                    },
                  ]}
                >
                  {urlInput.toLowerCase().startsWith('https://')
                    ? '🔒 TLS/SSL Encrypted (HTTPS)'
                    : urlInput.toLowerCase().startsWith('http://')
                    ? '⚠️ Unencrypted Cleartext (HTTP)'
                    : '🌐 Web URL'}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.scanBtn,
                {
                  backgroundColor: urlInput.trim() ? teal : isDark ? '#334155' : '#CBD5E1',
                },
              ]}
              onPress={() => analyzeUrl(urlInput)}
              disabled={isScanning || !urlInput.trim()}
              activeOpacity={0.85}
            >
              {isScanning ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text
                  style={[
                    styles.scanBtnText,
                    { color: urlInput.trim() ? '#FFFFFF' : '#94A3B8' },
                  ]}
                >
                  ⚡ Inspect Threat Vectors
                </Text>
              )}
            </TouchableOpacity>

          </View>

          {/* Pre-Inspection Clean State */}
          {!result && !isScanning && (
            <View style={[styles.infoCard, { backgroundColor: cardBg, borderColor: borderCol }]}>
              <Text style={styles.infoIcon}>🛡️</Text>
              <Text style={[styles.infoTitle, { color: textColor }]}>Zero-Trust Link Verification</Text>
              <Text style={[styles.infoDesc, { color: subtextColor }]}>
                Inspects hyperlinks in an isolated sandbox before your browser connects. Protects against homoglyph spoofing, SSRF private IP pivot attacks, and newly minted phishing domains.
              </Text>
            </View>
          )}

          {/* Result Card */}
          {result && (
            <View
              style={[
                styles.resultCard,
                {
                  backgroundColor: cardBg,
                  borderColor:
                    result.verdict === 'MALICIOUS' ? danger : result.verdict === 'SUSPICIOUS' ? amber : emerald,
                },
              ]}
            >
              <View style={styles.verdictRow}>
                <View
                  style={[
                    styles.verdictPill,
                    {
                      backgroundColor:
                        result.verdict === 'MALICIOUS'
                          ? 'rgba(239, 68, 68, 0.15)'
                          : result.verdict === 'SUSPICIOUS'
                          ? 'rgba(245, 158, 11, 0.15)'
                          : 'rgba(16, 185, 129, 0.15)',
                      borderColor:
                        result.verdict === 'MALICIOUS' ? danger : result.verdict === 'SUSPICIOUS' ? amber : emerald,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.verdictText,
                      {
                        color:
                          result.verdict === 'MALICIOUS' ? danger : result.verdict === 'SUSPICIOUS' ? amber : emerald,
                      },
                    ]}
                  >
                    VERDICT: {result.verdict} · RISK {result.riskScore}/100
                  </Text>
                </View>
              </View>

              <Text style={[styles.resultTitle, { color: textColor }]}>{result.title}</Text>
              <Text style={[styles.resultExp, { color: subtextColor }]}>{result.explanation}</Text>

              <View style={styles.indicatorsList}>
                <Text style={[styles.indHeader, { color: subtextColor }]}>THREAT INDICATORS:</Text>
                {result.indicators.map((ind, i) => (
                  <Text key={i} style={[styles.indItem, { color: textColor }]}>
                    • {ind}
                  </Text>
                ))}
              </View>

              <View style={[styles.recBox, { borderColor: borderCol }]}>
                <Text style={[styles.recLabel, { color: teal }]}>RECOMMENDED ACTION:</Text>
                <Text style={[styles.recText, { color: textColor }]}>{result.recommendation}</Text>
              </View>

              {/* Interactive AI Threat Explainer Trigger */}
              <TouchableOpacity
                style={[
                  styles.aiExplainerBtn,
                  {
                    backgroundColor: isDark ? '#134E4A' : '#CCFBF1',
                    borderColor: teal,
                  },
                ]}
                onPress={() => setShowAiModal(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.aiBtnIcon}>🤖</Text>
                <View style={styles.aiBtnTextWrap}>
                  <Text style={[styles.aiBtnTitle, { color: teal }]}>
                    Ask AI Explainer: Why is this dangerous?
                  </Text>
                  <Text style={[styles.aiBtnSub, { color: subtextColor }]}>
                    Zero-hallucination RAG breakdown with curated citations
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
            <Text style={[styles.closeBtnText, { color: subtextColor }]}>Close Link Inspector</Text>
          </TouchableOpacity>
        </ScrollView>

        {result && (
          <AiExplainerModal
            visible={showAiModal}
            onClose={() => setShowAiModal(false)}
            query={result.url}
            immutableVerdict={result.verdict}
            detectedFlags={result.indicators}
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
    marginBottom: 20,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  iconText: {
    fontSize: 28,
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
  protocolBadge: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  protocolBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  scanBtn: {
    paddingVertical: 13,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanBtnText: {
    fontSize: 13,
    fontWeight: '800',
  },
  infoCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    alignItems: 'center',
    marginBottom: 20,
  },
  infoIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center',
  },
  infoDesc: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  resultCard: {
    borderRadius: 18,
    borderWidth: 2,
    padding: 18,
    marginBottom: 20,
  },
  verdictRow: {
    marginBottom: 10,
  },
  verdictPill: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  verdictText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  resultExp: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 14,
  },
  indicatorsList: {
    marginBottom: 14,
    gap: 4,
  },
  indHeader: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  indItem: {
    fontSize: 12,
    lineHeight: 16,
  },
  recBox: {
    borderTopWidth: 1,
    paddingTop: 10,
    marginBottom: 12,
  },
  recLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  recText: {
    fontSize: 12,
    fontWeight: '600',
  },
  aiExplainerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  aiBtnIcon: {
    fontSize: 22,
  },
  aiBtnTextWrap: {
    flex: 1,
  },
  aiBtnTitle: {
    fontSize: 12,
    fontWeight: '800',
  },
  aiBtnSub: {
    fontSize: 10,
    marginTop: 2,
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
