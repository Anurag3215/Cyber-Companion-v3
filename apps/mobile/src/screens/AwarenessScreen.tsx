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

const QUICK_QUESTIONS = [
  { label: 'Quishing & Fake QRs', query: 'What is QR code phishing (quishing) and how does it compromise accounts?' },
  { label: 'Evil Twin Wi-Fi', query: 'How does an Evil Twin rogue Wi-Fi access point intercept my traffic?' },
  { label: 'SMS OTP Stealers', query: 'Why is an app requesting SMS and Internet permission a major risk?' },
  { label: 'Punycode Spoofing', query: 'How do attackers use Punycode IDN homoglyphs to impersonate brands?' },
  { label: 'URL Shortener Traps', query: 'Why are shortened links dangerous in text messages and emails?' },
];

const TIPS = [
  {
    id: '1',
    category: 'WIFI_SAFETY',
    categoryLabel: 'Wi-Fi Safety',
    title: 'Free Wi-Fi names can be faked. Ask staff.',
    summary:
      'Attackers set up "Evil Twin" hotspots with identical names (e.g., Starbucks_Free) right outside coffee shops. Always confirm the official network name and password with venue staff before connecting.',
    actionableAdvice: 'Turn off auto-connect to open Wi-Fi in your phone settings.',
    grade: 5,
  },
  {
    id: '2',
    category: 'PHISHING_AWARENESS',
    categoryLabel: 'Phishing Awareness',
    title: 'Recognize Fake Delivery SMS (Smishing)',
    summary:
      'Fraudulent SMS messages claim a parcel is held for a $1.50 customs fee and urge you to click a link. Legitimate couriers like FedEx or DHL never demand debit card details via unexpected text messages.',
    actionableAdvice: 'Inspect the sender phone number and check parcel tracking on the courier app directly.',
    grade: 6,
  },
  {
    id: '3',
    category: 'QR_HYGIENE',
    categoryLabel: 'QR Code Hygiene',
    title: 'Why QR Code Spoofing Works',
    summary:
      'Scammers stick fraudulent printed QR codes over legitimate parking meter or restaurant payment stickers. Your camera lens cannot visually differentiate safe vs. malicious QR patterns.',
    actionableAdvice: 'Always preview the full destination domain before completing any payment.',
    grade: 6,
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

  const bg = isDark ? '#090D16' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const subtextColor = isDark ? '#94A3B8' : '#64748B';
  const cardBg = isDark ? '#1E293B' : '#FFFFFF';
  const borderCol = isDark ? '#334155' : '#F1F5F9';
  const bannerBg = isDark ? '#134E4A' : '#F0FDFA';
  const bannerBorder = isDark ? '#115E59' : '#CCFBF1';
  const teal = isDark ? '#2DD4BF' : '#0D9488';

  const handleLaunchAiQuery = (query: string) => {
    if (!query.trim()) return;
    setActiveAiQuery(query.trim());
    setShowAiModal(true);
  };

  return (
    <View style={[styles.safeArea, { backgroundColor: bg }]}>
      <ScrollView style={[styles.container, { backgroundColor: bg }]} contentContainerStyle={styles.content}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: textColor }]}>Learn & Protect</Text>
          <Text style={[styles.subtitle, { color: subtextColor }]}>
            Bite-sized, plain-language guides and interactive AI assistant to keep you safe.
          </Text>
        </View>

        {/* Interactive Ask Cyber Companion AI Box */}
        <View style={[styles.aiSearchCard, { backgroundColor: cardBg, borderColor: borderCol }]}>
          <View style={styles.aiHeaderRow}>
            <Text style={styles.aiIcon}>🤖</Text>
            <View style={styles.aiHeaderTextWrap}>
              <Text style={[styles.aiCardTitle, { color: textColor }]}>Ask Cyber Companion</Text>
              <Text style={[styles.aiCardSubtitle, { color: teal }]}>
                RAG Knowledge Base · Instant Plain-Language Explanations
              </Text>
            </View>
          </View>

          <View style={styles.inputRow}>
            <TextInput
              style={[
                styles.aiInput,
                {
                  backgroundColor: isDark ? '#090D16' : '#F8FAFC',
                  borderColor: borderCol,
                  color: textColor,
                },
              ]}
              placeholder="Ask anything (e.g. What is Quishing?)"
              placeholderTextColor="#64748B"
              value={customQuery}
              onChangeText={setCustomQuery}
              onSubmitEditing={() => handleLaunchAiQuery(customQuery)}
            />
            <TouchableOpacity
              style={[styles.aiSubmitBtn, { backgroundColor: teal }]}
              onPress={() => handleLaunchAiQuery(customQuery)}
              activeOpacity={0.8}
            >
              <Text style={styles.aiSubmitBtnText}>Ask AI</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Questions Chips */}
          <View style={styles.quickChipsWrap}>
            <Text style={[styles.quickChipsLabel, { color: subtextColor }]}>POPULAR THREAT TOPICS:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
              {QUICK_QUESTIONS.map((q, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.chipBtn,
                    {
                      backgroundColor: isDark ? '#334155' : '#F1F5F9',
                      borderColor: borderCol,
                    },
                  ]}
                  onPress={() => handleLaunchAiQuery(q.query)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipBtnText, { color: teal }]}>{q.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Featured Tip of the Day */}
        <View style={[styles.featuredCard, { backgroundColor: bannerBg, borderColor: bannerBorder }]}>
          <Text style={styles.featuredBadge}>TODAY'S FEATURED TIP</Text>
          <Text style={[styles.featuredTitle, { color: textColor }]}>
            Free Wi-Fi names can be faked. Ask staff.
          </Text>
          <Text style={[styles.featuredBody, { color: subtextColor }]}>
            Never connect to generic hotspot names like "Free_Airport_Wi-Fi" without verifying with desk personnel.
          </Text>
        </View>

        {/* Guide Cards */}
        <Text style={[styles.sectionHeading, { color: textColor }]}>Security Guides</Text>


        <View style={styles.cardsContainer}>
          {TIPS.map((tip) => {
            const isExpanded = expandedId === tip.id;

            return (
              <TouchableOpacity
                key={tip.id}
                style={[
                  styles.card,
                  { backgroundColor: cardBg, borderColor: borderCol },
                  isExpanded && { borderColor: '#0D9488' },
                ]}
                onPress={() => setExpandedId(isExpanded ? null : tip.id)}
                activeOpacity={0.8}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.badgeRow}>
                    <Text style={styles.categoryBadge}>{tip.categoryLabel}</Text>
                    <Text style={[styles.gradeBadge, { color: subtextColor }]}>Grade {tip.grade} reading</Text>
                  </View>
                  <Text style={styles.expandChevron}>{isExpanded ? '▲' : '▼'}</Text>
                </View>

                <Text style={[styles.cardTitle, { color: textColor }]}>{tip.title}</Text>
                <Text style={[styles.cardSummary, { color: subtextColor }]} numberOfLines={isExpanded ? undefined : 2}>
                  {tip.summary}
                </Text>

                {isExpanded && (
                  <>
                    <View style={[styles.actionBox, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}>
                      <Text style={styles.actionBoxTitle}>💡 Quick Action:</Text>
                      <Text style={[styles.actionBoxText, { color: textColor }]}>
                        {tip.actionableAdvice}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.explainMoreBtn,
                        {
                          borderColor: teal,
                          backgroundColor: isDark ? '#134E4A' : '#CCFBF1',
                        },
                      ]}
                      onPress={() => handleLaunchAiQuery(`${tip.title}: ${tip.summary}`)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.explainMoreText, { color: teal }]}>
                        🤖 Ask AI: Deep Dive on this Topic →
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </TouchableOpacity>
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
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 18,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
    lineHeight: 20,
  },
  aiSearchCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
  },
  aiHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  aiIcon: {
    fontSize: 26,
  },
  aiHeaderTextWrap: {
    flex: 1,
  },
  aiCardTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  aiCardSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  aiInput: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 13,
  },
  aiSubmitBtn: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiSubmitBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  quickChipsWrap: {
    gap: 6,
  },
  quickChipsLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  chipsScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  chipBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  chipBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  featuredCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    marginBottom: 24,
  },
  featuredBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F766E',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  featuredTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.2,
    marginBottom: 6,
  },
  featuredBody: {
    fontSize: 13,
    lineHeight: 19,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 14,
  },
  cardsContainer: {
    gap: 14,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D9488',
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  gradeBadge: {
    fontSize: 11,
    fontWeight: '500',
  },
  expandChevron: {
    fontSize: 11,
    color: '#94A3B8',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
    marginBottom: 6,
  },
  cardSummary: {
    fontSize: 13,
    lineHeight: 19,
  },
  actionBox: {
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
  },
  actionBoxTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D9488',
    marginBottom: 2,
  },
  actionBoxText: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  explainMoreBtn: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  explainMoreText: {
    fontSize: 12,
    fontWeight: '800',
  },
});
