import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

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

  const bg = isDark ? '#090D16' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const subtextColor = isDark ? '#94A3B8' : '#64748B';
  const cardBg = isDark ? '#1E293B' : '#FFFFFF';
  const borderCol = isDark ? '#334155' : '#F1F5F9';
  const bannerBg = isDark ? '#134E4A' : '#F0FDFA';
  const bannerBorder = isDark ? '#115E59' : '#CCFBF1';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bg }]}>
      <ScrollView style={[styles.container, { backgroundColor: bg }]} contentContainerStyle={styles.content}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: textColor }]}>Learn & Protect</Text>
          <Text style={[styles.subtitle, { color: subtextColor }]}>
            Bite-sized, plain-language guides to keep you safe everywhere you browse.
          </Text>
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
                  <View style={[styles.actionBox, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}>
                    <Text style={styles.actionBoxTitle}>💡 Quick Action:</Text>
                    <Text style={[styles.actionBoxText, { color: textColor }]}>
                      {tip.actionableAdvice}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
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
});
