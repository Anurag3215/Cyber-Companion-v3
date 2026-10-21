import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { AiExplainerModal } from '../components/AiExplainerModal';
import { GlassCard } from '../design-system/GlassCard';
import { GlassTipCard } from '../design-system/GlassTipCard';
import { GlassTokens } from '../design-system/glassTokens';

interface TipItem {
  id: string;
  category: string;
  categoryLabel: string;
  title: string;
  summary: string;
  actionableAdvice: string;
  grade: number;
}

const QUICK_QUESTIONS = [
  { label: 'Ethical Hacking', query: 'What is ethical hacking and penetration testing?' },
  { label: 'Quishing & Fake QRs', query: 'How does QR code phishing (quishing) work?' },
  { label: 'Evil Twin Wi-Fi', query: 'How do hackers set up fake Wi-Fi hotspots?' },
  { label: 'SMS OTP Stealers', query: 'Can hackers steal my SMS one-time passwords?' },
  { label: 'Ransomware', query: 'How does ransomware lock my phone and files?' },
  { label: 'Zero-Trust', query: 'What is zero-trust security and how does it protect me?' },
];

const TIPS: TipItem[] = [
  {
    id: '1',
    category: 'WIFI_SECURITY',
    categoryLabel: 'Wi-Fi Safety',
    title: 'Free Wi-Fi names can be faked. Ask staff.',
    summary:
      'Attackers set up "Evil Twin" hotspots with identical names (e.g., Starbucks_Free) right outside coffee shops. Always confirm the official network name and password with venue staff before connecting.',
    actionableAdvice: 'Turn off "Auto-Join Hotspots" in your phone settings to prevent silent rogue connections.',
    grade: 5,
  },
  {
    id: '2',
    category: 'LINK_SAFETY',
    categoryLabel: 'Link Safety',
    title: 'Inspect Lookalike "Punycode" Web Links',
    summary:
      'Scammers register web domains replacing Latin letters with lookalike Greek or Cyrillic characters (like replacing "o" with Cyrillic "о"). The address looks identical on your screen, but sends you to a fake banking login.',
    actionableAdvice: 'Always bookmark your bank and payment websites rather than clicking links in SMS messages.',
    grade: 6,
  },
  {
    id: '3',
    category: 'QR_SCAMS',
    categoryLabel: 'QR Codes',
    title: 'Never Pay via QR Stickers on Public Meters',
    summary:
      'Fraudsters print fake QR code stickers and paste them over real parking meters and restaurant menus. Scanning them opens fake payment gateways designed to harvest your credit card numbers.',
    actionableAdvice: 'Feel the QR code with your finger—if it is a sticker stuck over a metal plate, report it and do not scan.',
    grade: 4,
  },
  {
    id: '4',
    category: 'APP_PERMISSIONS',
    categoryLabel: 'App Permissions',
    title: 'Audit Microphone and Camera Rights',
    summary:
      'Simple utility apps like flashlights, calculators, and wallpaper packs never require background microphone or contacts access. Overprivileged apps may log keystrokes or exfiltrate sensor telemetry.',
    actionableAdvice: 'Revoke "Always Allow" permissions for any app you do not actively use.',
    grade: 5,
  },
];

interface AwarenessScreenProps {
  isDark?: boolean;
}

export const AwarenessScreen: React.FC<AwarenessScreenProps> = ({ isDark = false }) => {
  const [expandedId, setExpandedId] = useState<string | null>('1');
  const [customQuery, setCustomQuery] = useState('');
  const [activeAiQuery, setActiveAiQuery] = useState<string | null>(null);
  const [showAiModal, setShowAiModal] = useState(false);

  const theme = isDark ? GlassTokens.colors.dark : GlassTokens.colors.light;

  const handleLaunchAiQuery = (query: string) => {
    if (!query.trim()) return;
    setActiveAiQuery(query.trim());
    setShowAiModal(true);
  };

  return (
    <View style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            Learn & Protect
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Plain-language security guides and AI intelligence to keep ordinary citizens safe.
          </Text>
        </View>

        {/* Ask Cyber Companion AI Glass Card */}
        <GlassCard
          isDark={isDark}
          elevation="floating"
          borderRadius={GlassTokens.radii.xl}
          style={styles.aiSearchCard}
        >
          <View style={styles.aiCardContent}>
            <View style={styles.aiHeaderRow}>
              <View
                style={[
                  styles.aiIconBubble,
                  {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.9)',
                    borderColor: theme.glassHighlight,
                  },
                ]}
              >
                <Text style={styles.aiIcon}>🤖</Text>
              </View>

              <View style={styles.aiHeaderTextWrap}>
                <Text style={[styles.aiCardTitle, { color: theme.textPrimary }]}>
                  Ask Cyber Companion
                </Text>
                <Text style={[styles.aiCardSubtitle, { color: theme.primary }]}>
                  Instant Plain-Language Answers
                </Text>
              </View>
            </View>

            {/* Input Bar */}
            <View style={styles.inputRow}>
              <TextInput
                style={[
                  styles.aiInput,
                  {
                    backgroundColor: isDark ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.9)',
                    borderColor: theme.glassBorder,
                    color: theme.textPrimary,
                  },
                ]}
                placeholder="Ask anything (e.g. What is Ethical Hacking?)"
                placeholderTextColor="#64748B"
                value={customQuery}
                onChangeText={setCustomQuery}
                onSubmitEditing={() => handleLaunchAiQuery(customQuery)}
              />

              {customQuery.length > 0 && (
                <TouchableOpacity
                  style={styles.clearBtn}
                  onPress={() => setCustomQuery('')}
                >
                  <Text style={[styles.clearBtnText, { color: theme.textMuted }]}>✕</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[
                  styles.aiSubmitBtn,
                  {
                    backgroundColor: theme.primary,
                    opacity: !customQuery.trim() ? 0.7 : 1,
                  },
                ]}
                onPress={() => handleLaunchAiQuery(customQuery)}
                disabled={!customQuery.trim()}
                activeOpacity={0.8}
              >
                <Text style={styles.aiSubmitBtnText}>Ask AI</Text>
              </TouchableOpacity>
            </View>

            {/* Quick Question Chips */}
            <View style={styles.quickChipsWrap}>
              <Text style={[styles.quickChipsLabel, { color: theme.textMuted }]}>
                POPULAR TOPICS:
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsScroll}
              >
                {QUICK_QUESTIONS.map((q, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.chipBtn,
                      {
                        backgroundColor: isDark
                          ? 'rgba(255, 255, 255, 0.08)'
                          : 'rgba(255, 255, 255, 0.85)',
                        borderColor: theme.glassBorder,
                      },
                    ]}
                    onPress={() => handleLaunchAiQuery(q.query)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.chipBtnText, { color: theme.primary }]}>
                      {q.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </GlassCard>

        {/* Featured Tip of the Day */}
        <GlassTipCard
          category="TODAY'S FEATURED ADVICE"
          icon="💡"
          title="Free Wi-Fi names can be faked. Ask staff."
          advice="Never connect to generic hotspot names without verifying credentials with desk personnel. Unencrypted networks expose cleartext data."
          onPress={() => handleLaunchAiQuery('How to verify safe public Wi-Fi?')}
          isDark={isDark}
        />

        {/* Citizen Security Guides Section */}
        <View style={styles.guidesHeaderRow}>
          <Text style={[styles.sectionHeading, { color: theme.textPrimary }]}>
            Citizen Safety Guides
          </Text>
          <Text style={[styles.sectionSubheading, { color: theme.textMuted }]}>
            Tap to expand advice
          </Text>
        </View>

        <View style={styles.cardsContainer}>
          {TIPS.map((tip) => {
            const isExpanded = expandedId === tip.id;

            return (
              <GlassCard
                key={tip.id}
                isDark={isDark}
                onPress={() => setExpandedId(isExpanded ? null : tip.id)}
                interactive={true}
                elevation="soft"
                borderRadius={GlassTokens.radii.lg}
                style={styles.guideCard}
              >
                <View style={styles.guideCardContent}>
                  <View style={styles.cardHeader}>
                    <View style={styles.badgeRow}>
                      <View
                        style={[
                          styles.categoryPill,
                          {
                            backgroundColor: isDark
                              ? 'rgba(16, 185, 129, 0.12)'
                              : 'rgba(5, 150, 105, 0.08)',
                            borderColor: isDark
                              ? 'rgba(16, 185, 129, 0.25)'
                              : 'rgba(5, 150, 105, 0.18)',
                          },
                        ]}
                      >
                        <Text style={[styles.categoryBadge, { color: theme.primary }]}>
                          {tip.categoryLabel}
                        </Text>
                      </View>
                      <Text style={[styles.gradeBadge, { color: theme.textMuted }]}>
                        Grade {tip.grade} reading
                      </Text>
                    </View>
                    <Text style={[styles.expandChevron, { color: theme.textMuted }]}>
                      {isExpanded ? '▲' : '▼'}
                    </Text>
                  </View>

                  <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
                    {tip.title}
                  </Text>
                  <Text
                    style={[styles.cardSummary, { color: theme.textSecondary }]}
                    numberOfLines={isExpanded ? undefined : 2}
                  >
                    {tip.summary}
                  </Text>

                  {isExpanded && (
                    <View style={styles.expandedContent}>
                      <View
                        style={[
                          styles.actionBox,
                          {
                            backgroundColor: isDark
                              ? 'rgba(0, 0, 0, 0.25)'
                              : 'rgba(255, 255, 255, 0.7)',
                            borderColor: theme.glassBorder,
                          },
                        ]}
                      >
                        <Text style={styles.actionBoxTitle}>💡 Practical Action:</Text>
                        <Text style={[styles.actionBoxText, { color: theme.textPrimary }]}>
                          {tip.actionableAdvice}
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={[
                          styles.explainMoreBtn,
                          {
                            backgroundColor: isDark
                              ? 'rgba(16, 185, 129, 0.15)'
                              : 'rgba(5, 150, 105, 0.1)',
                            borderColor: isDark
                              ? 'rgba(16, 185, 129, 0.3)'
                              : 'rgba(5, 150, 105, 0.25)',
                          },
                        ]}
                        onPress={() => handleLaunchAiQuery(`${tip.title}: ${tip.summary}`)}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.explainMoreText, { color: theme.primary }]}>
                          🤖 Ask AI: Deep Dive on this Topic →
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </GlassCard>
            );
          })}
        </View>
      </ScrollView>

      {activeAiQuery && (
        <AiExplainerModal
          visible={showAiModal}
          onClose={() => setShowAiModal(false)}
          query={activeAiQuery}
          isDark={isDark}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
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
  aiSearchCard: {
    marginTop: 4,
  },
  aiCardContent: {
    padding: 18,
    gap: 12,
  },
  aiHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aiIconBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiIcon: {
    fontSize: 22,
  },
  aiHeaderTextWrap: {
    flex: 1,
    gap: 2,
  },
  aiCardTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  aiCardSubtitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    position: 'relative',
  },
  aiInput: {
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
    right: 88,
    padding: 8,
  },
  clearBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  aiSubmitBtn: {
    height: 46,
    paddingHorizontal: 18,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiSubmitBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  quickChipsWrap: {
    gap: 8,
    marginTop: 4,
  },
  quickChipsLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  chipsScroll: {
    gap: 8,
  },
  chipBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
  },
  chipBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  guidesHeaderRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  sectionSubheading: {
    fontSize: 12,
    fontWeight: '500',
  },
  cardsContainer: {
    gap: 12,
  },
  guideCard: {
    marginVertical: 2,
  },
  guideCardContent: {
    padding: 18,
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  categoryBadge: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  gradeBadge: {
    fontSize: 11,
    fontWeight: '500',
  },
  expandChevron: {
    fontSize: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  cardSummary: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  expandedContent: {
    marginTop: 8,
    gap: 10,
  },
  actionBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  actionBoxTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981',
  },
  actionBoxText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  explainMoreBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  explainMoreText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
