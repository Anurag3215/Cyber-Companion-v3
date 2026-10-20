import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ApiClient, ExplainerResponse } from '../services/apiClient';

interface AiExplainerModalProps {
  visible: boolean;
  onClose: () => void;
  query: string;
  immutableVerdict?: 'SAFE' | 'SUSPICIOUS' | 'MALICIOUS' | 'UNKNOWN';
  detectedFlags?: string[];
  isDark?: boolean;
}

export const AiExplainerModal: React.FC<AiExplainerModalProps> = ({
  visible,
  onClose,
  query,
  immutableVerdict = 'UNKNOWN',
  detectedFlags = [],
  isDark = true,
}) => {
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<ExplainerResponse | null>(null);

  useEffect(() => {
    if (visible && query) {
      let isMounted = true;
      setLoading(true);
      ApiClient.explainThreat({
        query,
        immutableVerdict,
        detectedFlags,
      })
        .then((res) => {
          if (isMounted) {
            setExplanation(res);
            setLoading(false);
          }
        })
        .catch(() => {
          if (isMounted) setLoading(false);
        });

      return () => {
        isMounted = false;
      };
    }
  }, [visible, query, immutableVerdict, detectedFlags]);

  const bg = isDark ? '#090D16' : '#FFFFFF';
  const cardBg = isDark ? '#1E293B' : '#F8FAFC';
  const borderCol = isDark ? '#334155' : '#E2E8F0';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const subtextColor = isDark ? '#94A3B8' : '#64748B';
  const teal = isDark ? '#2DD4BF' : '#0D9488';
  const emerald = '#10B981';
  const danger = '#EF4444';
  const amber = '#F59E0B';

  const verdictColor =
    immutableVerdict === 'MALICIOUS'
      ? danger
      : immutableVerdict === 'SUSPICIOUS'
      ? amber
      : immutableVerdict === 'SAFE'
      ? emerald
      : teal;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: borderCol }]}>
          <View style={styles.headerLeft}>
            <Text style={styles.assistantIcon}>🤖</Text>
            <View>
              <Text style={[styles.headerTitle, { color: textColor }]}>
                AI Threat Explainer
              </Text>
              <Text style={[styles.headerSub, { color: teal }]}>
                Curated RAG · Deterministic Reasoning
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.closeBtn, { backgroundColor: cardBg, borderColor: borderCol }]}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={[styles.closeBtnText, { color: textColor }]}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Query Summary Card */}
          <View style={[styles.queryCard, { backgroundColor: cardBg, borderColor: borderCol }]}>
            <Text style={[styles.queryLabel, { color: subtextColor }]}>INVESTIGATED TARGET / QUERY</Text>
            <Text style={[styles.queryText, { color: textColor }]} numberOfLines={3}>
              {query || 'Threat telemetry analysis'}
            </Text>

            <View style={styles.badgeRow}>
              <View style={[styles.verdictBadge, { borderColor: verdictColor, backgroundColor: `${verdictColor}15` }]}>
                <View style={[styles.verdictDot, { backgroundColor: verdictColor }]} />
                <Text style={[styles.verdictText, { color: verdictColor }]}>
                  {immutableVerdict} VERDICT
                </Text>
              </View>

              <View style={[styles.groundedBadge, { borderColor: teal, backgroundColor: `${teal}15` }]}>
                <Text style={[styles.groundedText, { color: teal }]}>
                  ✓ RAG Grounded
                </Text>
              </View>
            </View>

            {detectedFlags.length > 0 && (
              <View style={styles.flagsWrap}>
                <Text style={[styles.flagsLabel, { color: subtextColor }]}>TRIGGERED INDICATORS:</Text>
                <View style={styles.flagsList}>
                  {detectedFlags.map((flag, idx) => (
                    <View key={idx} style={[styles.flagPill, { backgroundColor: isDark ? '#334155' : '#E2E8F0' }]}>
                      <Text style={[styles.flagPillText, { color: textColor }]}>{flag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Loading Indicator */}
          {loading && (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color={teal} />
              <Text style={[styles.loadingText, { color: subtextColor }]}>
                Retrieving knowledge base insights & synthesizing plain-language guidance...
              </Text>
            </View>
          )}

          {/* Explanation Content */}
          {!loading && explanation && (
            <>
              {/* Plain Language Breakdown */}
              <View style={[styles.sectionCard, { backgroundColor: cardBg, borderColor: borderCol }]}>
                <Text style={[styles.sectionTitle, { color: teal }]}>PLAIN-LANGUAGE BREAKDOWN</Text>
                <Text style={[styles.explanationBody, { color: textColor }]}>
                  {explanation.explanation}
                </Text>
              </View>

              {/* Citations from Knowledge Base */}
              <View style={[styles.sectionCard, { backgroundColor: cardBg, borderColor: borderCol }]}>
                <Text style={[styles.sectionTitle, { color: teal }]}>CURATED KNOWLEDGE BASE CITATIONS</Text>
                {explanation.citations.map((cite, i) => (
                  <View key={i} style={styles.citationRow}>
                    <Text style={styles.citationIcon}>📚</Text>
                    <Text style={[styles.citationText, { color: subtextColor }]}>{cite}</Text>
                  </View>
                ))}
              </View>

              {/* Step-by-Step Remediation Actions */}
              <View style={[styles.sectionCard, { backgroundColor: cardBg, borderColor: borderCol }]}>
                <Text style={[styles.sectionTitle, { color: emerald }]}>RECOMMENDED DEFENSE STEPS</Text>
                {explanation.recommendedActions.map((action, i) => (
                  <View key={i} style={styles.actionItem}>
                    <View style={[styles.actionNum, { backgroundColor: `${emerald}20`, borderColor: emerald }]}>
                      <Text style={[styles.actionNumText, { color: emerald }]}>{i + 1}</Text>
                    </View>
                    <Text style={[styles.actionText, { color: textColor }]}>{action}</Text>
                  </View>
                ))}
              </View>

              {/* Zero-Hallucination Disclaimer */}
              <View style={[styles.disclaimerCard, { backgroundColor: isDark ? '#022C22' : '#F0FDFA', borderColor: emerald }]}>
                <Text style={styles.disclaimerIcon}>🛡️</Text>
                <Text style={[styles.disclaimerText, { color: isDark ? '#A7F3D0' : '#065F46' }]}>
                  Pure Grounded Defense: Verdicts are calculated using deterministic math & verified threat feeds, never generative AI hallucination.
                </Text>
              </View>
            </>
          )}
        </ScrollView>

        {/* Bottom Button */}
        <View style={[styles.footer, { borderTopColor: borderCol, backgroundColor: bg }]}>
          <TouchableOpacity
            style={[styles.doneBtn, { backgroundColor: teal }]}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.doneBtnText}>Acknowledge & Close</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  assistantIcon: {
    fontSize: 28,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },
  queryCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  queryLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  queryText: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  verdictBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  verdictDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  verdictText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  groundedBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  groundedText: {
    fontSize: 12,
    fontWeight: '700',
  },
  flagsWrap: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#33415540',
  },
  flagsLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 6,
  },
  flagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  flagPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  flagPillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  loadingBox: {
    padding: 30,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  sectionCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  explanationBody: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
  },
  citationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 2,
  },
  citationIcon: {
    fontSize: 14,
  },
  citationText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 4,
  },
  actionNum: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionNumText: {
    fontSize: 11,
    fontWeight: '800',
  },
  actionText: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '500',
    flex: 1,
  },
  disclaimerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  disclaimerIcon: {
    fontSize: 20,
  },
  disclaimerText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
    flex: 1,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  doneBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
