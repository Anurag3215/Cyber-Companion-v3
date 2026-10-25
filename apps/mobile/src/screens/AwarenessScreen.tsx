import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { PhoneShield3DVisual } from '../components/Showcase3DVisuals';
import { AiExplainerModal } from '../components/AiExplainerModal';
import { GlassCard } from '../design-system/GlassCard';
import { GlassTokens } from '../design-system/glassTokens';

interface AwarenessScreenProps {
  isDark?: boolean;
}

interface TopicItem {
  id: string;
  glyph: string;
  title: string;
  description: string;
  query: string;
}

const TOPICS: TopicItem[] = [
  {
    id: 'threats',
    glyph: '⚠️',
    title: 'Common Threats',
    description: 'Malware, Ransomware, Social Engineering',
    query: 'Explain Common Threats like Malware, Ransomware, and Social Engineering',
  },
  {
    id: 'browsing',
    glyph: '🌐',
    title: 'Safe Browsing',
    description: 'HTTPS, SSL Certificates, Safe Downloads',
    query: 'How to practice Safe Browsing with HTTPS and SSL Certificates?',
  },
  {
    id: 'tips',
    glyph: '💡',
    title: 'Quick Tips',
    description: 'Password Hygiene, 2FA, Public Wi-Fi Precautions',
    query: 'What are essential cybersecurity Quick Tips for passwords, 2FA, and Wi-Fi?',
  },
];

export const AwarenessScreen: React.FC<AwarenessScreenProps> = ({ isDark = true }) => {
  const [activeQuery, setActiveQuery] = useState<string | null>(null);
  const [showAiModal, setShowAiModal] = useState(false);
  const [customSearch, setCustomSearch] = useState('');

  const handleLaunchQuery = (q: string) => {
    setActiveQuery(q);
    setShowAiModal(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#070D18' : '#F4F8FC' }]}>
      {/* Top Header Bar */}
      <View style={styles.headerBar}>
        <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
          Awareness
        </Text>

        <TouchableOpacity
          style={[
            styles.headerBtn,
            {
              backgroundColor: isDark ? 'rgba(14, 27, 56, 0.8)' : '#FFFFFF',
              borderColor: isDark ? 'rgba(56, 189, 248, 0.2)' : '#DCE6F0',
            },
          ]}
          onPress={() => handleLaunchQuery('What are today\'s latest cybersecurity threats?')}
          activeOpacity={0.75}
        >
          <Text style={{ fontSize: 16 }}>🔍</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.column}>
          {/* Hero Featured Card matching showcase Screen 10 */}
          <GlassCard
            isDark={isDark}
            elevation="floating"
            borderRadius={28}
            style={[
              styles.heroCard,
              {
                backgroundColor: isDark ? '#0E1B38' : 'rgba(255, 255, 255, 0.95)',
                borderColor: isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(2, 132, 199, 0.25)',
              },
            ]}
          >
            <View style={styles.heroRow}>
              {/* Left copy */}
              <View style={styles.heroLeftCol}>
                <Text style={[styles.heroBadge, { color: isDark ? '#38BDF8' : '#0284C7' }]}>
                  FEATURED GUIDE
                </Text>
                <Text style={[styles.heroHeadline, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                  Spot Phishing Attempts
                </Text>
                <Text style={[styles.heroSubtitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  Learn how attackers disguise malicious links and emails to steal your credentials.
                </Text>

                <TouchableOpacity
                  style={styles.learnMoreLink}
                  onPress={() => handleLaunchQuery('How to spot phishing attempts and fake links?')}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.learnMoreText, { color: isDark ? '#38BDF8' : '#0284C7' }]}>
                    Learn More →
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Right 3D Visual */}
              <View style={styles.heroRightCol}>
                <PhoneShield3DVisual size={120} isDark={isDark} />
              </View>
            </View>
          </GlassCard>

          {/* Quick AI Search Box */}
          <View
            style={[
              styles.searchBarWrapper,
              {
                backgroundColor: isDark ? '#0E1B38' : '#FFFFFF',
                borderColor: isDark ? 'rgba(56, 189, 248, 0.18)' : '#DCE6F0',
              },
            ]}
          >
            <Text style={{ fontSize: 16 }}>🤖</Text>
            <TextInput
              style={[styles.searchInput, { color: isDark ? '#FFFFFF' : '#0F172A' }]}
              placeholder="Ask Cyber Companion AI..."
              placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
              value={customSearch}
              onChangeText={setCustomSearch}
              onSubmitEditing={() => {
                if (customSearch.trim()) {
                  handleLaunchQuery(customSearch.trim());
                  setCustomSearch('');
                }
              }}
            />
            {customSearch.length > 0 && (
              <TouchableOpacity
                style={styles.askAiBtn}
                onPress={() => {
                  handleLaunchQuery(customSearch.trim());
                  setCustomSearch('');
                }}
              >
                <Text style={styles.askAiBtnText}>Ask</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Section: Topics */}
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              Topics
            </Text>
          </View>

          {/* Topics List matching showcase */}
          <View style={styles.topicsList}>
            {TOPICS.map((topic) => (
              <TouchableOpacity
                key={topic.id}
                onPress={() => handleLaunchQuery(topic.query)}
                activeOpacity={0.8}
              >
                <GlassCard
                  isDark={isDark}
                  elevation="soft"
                  borderRadius={20}
                  style={[
                    styles.topicCard,
                    {
                      backgroundColor: isDark ? '#0E1B38' : 'rgba(255, 255, 255, 0.95)',
                      borderColor: isDark ? 'rgba(56, 189, 248, 0.18)' : '#E2E8F0',
                    },
                  ]}
                >
                  <View style={styles.topicRow}>
                    <View style={styles.topicIconBubble}>
                      <Text style={{ fontSize: 20 }}>{topic.glyph}</Text>
                    </View>

                    <View style={styles.topicTextWrap}>
                      <Text style={[styles.topicTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                        {topic.title}
                      </Text>
                      <Text style={[styles.topicDesc, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                        {topic.description}
                      </Text>
                    </View>

                    <Text style={[styles.topicChevron, { color: isDark ? '#38BDF8' : '#0284C7' }]}>
                      ›
                    </Text>
                  </View>
                </GlassCard>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* AI Explainer Modal */}
      {activeQuery && (
        <AiExplainerModal
          visible={showAiModal}
          onClose={() => setShowAiModal(false)}
          query={activeQuery}
          isDark={isDark}
        />
      )}
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120, // Clearance for bottom navigation bar
    alignItems: 'center',
  },
  column: {
    width: '100%',
    maxWidth: GlassTokens.layout.maxContentWidth,
    gap: 16,
  },
  heroCard: {
    borderWidth: 1.5,
    padding: 20,
    marginTop: 4,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroLeftCol: {
    flex: 1.2,
    gap: 6,
    paddingRight: 8,
  },
  heroBadge: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  heroHeadline: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
    lineHeight: 25,
  },
  heroSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  learnMoreLink: {
    marginTop: 6,
  },
  learnMoreText: {
    fontSize: 14,
    fontWeight: '700',
  },
  heroRightCol: {
    flex: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderRadius: 25,
    borderWidth: 1.2,
    paddingHorizontal: 16,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
  },
  askAiBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  askAiBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  sectionHeaderRow: {
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  topicsList: {
    gap: 12,
  },
  topicCard: {
    padding: 16,
    borderWidth: 1.2,
  },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  topicIconBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicTextWrap: {
    flex: 1,
    gap: 2,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  topicDesc: {
    fontSize: 12,
    fontWeight: '500',
  },
  topicChevron: {
    fontSize: 24,
    fontWeight: '400',
  },
});
