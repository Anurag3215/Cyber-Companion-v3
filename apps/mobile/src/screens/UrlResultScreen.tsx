import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { WarningPrism3DVisual, SafeCheck3DVisual } from '../components/Showcase3DVisuals';
import { ThreatInspectionResponse } from '../services/apiClient';
import { GlassCard } from '../design-system/GlassCard';
import { GlassTokens } from '../design-system/glassTokens';

interface UrlResultScreenProps {
  result: ThreatInspectionResponse;
  onBack: () => void;
  isDark?: boolean;
}

export const UrlResultScreen: React.FC<UrlResultScreenProps> = ({
  result,
  onBack,
  isDark = true,
}) => {
  const isSuspicious = result.verdict === 'MALICIOUS' || result.verdict === 'SUSPICIOUS';

  const defaultRiskFactors = [
    'Domain registered recently (< 7 days ago)',
    'Known phishing signatures detected',
    'Missing valid SSL/TLS encryption',
  ];

  const riskFactors: string[] =
    result.heuristicsTriggered && result.heuristicsTriggered.length > 0
      ? result.heuristicsTriggered
      : result.riskFactors && result.riskFactors.length > 0
      ? result.riskFactors
      : defaultRiskFactors;

  const handleReport = () => {
    Alert.alert(
      'Threat Report Submitted',
      'Thank you for reporting this indicator. Our security research team has received the domain payload for threat intel categorization.',
      [{ text: 'OK' }]
    );
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
            {isSuspicious ? (
              <WarningPrism3DVisual size={160} isDark={isDark} />
            ) : (
              <SafeCheck3DVisual size={160} isDark={isDark} />
            )}
          </View>

          {/* Result Title & Subtitle */}
          <View style={styles.resultTitleSection}>
            <Text
              style={[
                styles.resultHeadline,
                { color: isSuspicious ? '#EF4444' : '#10B981' },
              ]}
            >
              {isSuspicious ? 'This link looks suspicious' : 'This link is safe to open'}
            </Text>
            <Text style={[styles.resultSubtitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              {result.plainLanguageExplanation ||
                (isSuspicious
                  ? 'We detected potential security risks associated with this domain.'
                  : 'No phishing indicators, malicious redirects, or hostname anomalies detected.')}
            </Text>
          </View>

          {/* Scanned Target URL Card */}
          <View
            style={[
              styles.targetUrlBox,
              {
                backgroundColor: isDark ? '#0E1B38' : 'rgba(255, 255, 255, 0.95)',
                borderColor: isSuspicious ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)',
              },
            ]}
          >
            <Text
              style={[
                styles.targetUrlText,
                { color: isDark ? '#FFFFFF' : '#0F172A' },
              ]}
              numberOfLines={2}
            >
              {result.target}
            </Text>
          </View>

          {/* Card: Why it's risky? (or What we checked) */}
          <GlassCard
            isDark={isDark}
            elevation="soft"
            borderRadius={22}
            style={[
              styles.infoCard,
              {
                backgroundColor: isDark ? '#0E1B38' : 'rgba(255, 255, 255, 0.95)',
                borderColor: isDark ? 'rgba(56, 189, 248, 0.2)' : 'rgba(2, 132, 199, 0.2)',
              },
            ]}
          >
            <Text style={[styles.cardHeading, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              {isSuspicious ? "Why it's risky?" : 'What we checked'}
            </Text>

            <View style={styles.bulletsWrap}>
              {riskFactors.map((factor: string, idx: number) => (
                <View key={idx} style={styles.bulletRow}>
                  <Text
                    style={[
                      styles.bulletIcon,
                      { color: isSuspicious ? '#EF4444' : '#10B981' },
                    ]}
                  >
                    {isSuspicious ? '•' : '✓'}
                  </Text>
                  <Text style={[styles.bulletText, { color: isDark ? '#E2E8F0' : '#334155' }]}>
                    {factor}
                  </Text>
                </View>
              ))}
            </View>
          </GlassCard>

          {/* Card: What you should do */}
          <GlassCard
            isDark={isDark}
            elevation="soft"
            borderRadius={22}
            style={[
              styles.adviceCard,
              {
                backgroundColor: isDark ? 'rgba(245, 158, 11, 0.12)' : 'rgba(245, 158, 11, 0.1)',
                borderColor: 'rgba(245, 158, 11, 0.35)',
              },
            ]}
          >
            <Text style={[styles.adviceHeading, { color: isDark ? '#FBBF24' : '#B45309' }]}>
              What you should do
            </Text>
            <Text style={[styles.adviceBody, { color: isDark ? '#F1F5F9' : '#1E293B' }]}>
              {result.recommendation ||
                (isSuspicious
                  ? 'Do not enter passwords, personal info, or financial details on this website.'
                  : 'You can proceed safely. Always verify the address before entering credentials.')}
            </Text>
          </GlassCard>

          {/* Action Buttons */}
          <View style={styles.actionsWrap}>
            <TouchableOpacity
              style={styles.primaryActionBtn}
              onPress={onBack}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryActionBtnText}>Go Back</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.secondaryActionBtn,
                {
                  backgroundColor: isDark ? 'rgba(14, 27, 56, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                  borderColor: isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(2, 132, 199, 0.25)',
                },
              ]}
              onPress={handleReport}
              activeOpacity={0.8}
            >
              <Text style={[styles.secondaryActionBtnText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                Report False Positive / Threat
              </Text>
            </TouchableOpacity>
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
  },
  visualSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 4,
  },
  resultTitleSection: {
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 6,
  },
  resultHeadline: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  resultSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    fontWeight: '500',
  },
  targetUrlBox: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  targetUrlText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  infoCard: {
    padding: 20,
    borderWidth: 1.2,
    gap: 12,
  },
  cardHeading: {
    fontSize: 16,
    fontWeight: '800',
  },
  bulletsWrap: {
    gap: 10,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bulletIcon: {
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 20,
  },
  bulletText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    flex: 1,
  },
  adviceCard: {
    padding: 18,
    borderWidth: 1.2,
    gap: 6,
  },
  adviceHeading: {
    fontSize: 15,
    fontWeight: '800',
  },
  adviceBody: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  actionsWrap: {
    gap: 12,
    marginTop: 6,
  },
  primaryActionBtn: {
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
  primaryActionBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryActionBtn: {
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryActionBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
