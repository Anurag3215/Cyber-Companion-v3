import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  Share,
} from 'react-native';
import { useAuth } from '../services/AuthContext';
import { GlassCard } from '../design-system/GlassCard';
import { GlassTokens } from '../design-system/glassTokens';

interface SecurityScoreScreenProps {
  onBack: () => void;
  onNavigateToPermissionAnalyzer?: () => void;
  isDark?: boolean;
}

export const SecurityScoreScreen: React.FC<SecurityScoreScreenProps> = ({
  onBack,
  onNavigateToPermissionAnalyzer,
  isDark = true,
}) => {
  const { user } = useAuth();
  const score = typeof user?.securityScore === 'number' ? user.securityScore : 78;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `My Cyber Companion security score is ${score}/100! Protected against phishing, rogue Wi-Fi, and intrusive permissions.`,
      });
    } catch (_err) {
      // Ignore
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#070D18' : '#F4F8FC' }]}>
      {/* Top Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={onBack}
          style={[
            styles.headerBtn,
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
          Security Score
        </Text>

        <TouchableOpacity
          onPress={handleShare}
          style={[
            styles.headerBtn,
            {
              backgroundColor: isDark ? 'rgba(14, 27, 56, 0.8)' : '#FFFFFF',
              borderColor: isDark ? 'rgba(56, 189, 248, 0.2)' : '#DCE6F0',
            },
          ]}
          activeOpacity={0.75}
        >
          <Text style={{ fontSize: 16 }}>🔗</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.column}>
          {/* Main Score Arc Section matching showcase */}
          <View style={styles.scoreHeroSection}>
            <View
              style={[
                styles.scoreCircleOuter,
                {
                  borderColor: isDark ? 'rgba(56, 189, 248, 0.25)' : '#DCE6F0',
                  backgroundColor: isDark ? '#0E1B38' : '#FFFFFF',
                },
              ]}
            >
              <Text style={[styles.mainScoreNumber, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                {score}
              </Text>
              <Text style={[styles.mainScoreMax, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                /100
              </Text>

              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: 'rgba(16, 185, 129, 0.18)',
                    borderColor: '#10B981',
                  },
                ]}
              >
                <Text style={styles.statusBadgeText}>Good</Text>
              </View>
            </View>

            <Text style={[styles.scoreSummaryText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              Your device protection is strong. Review recommendations below to reach 90+.
            </Text>
          </View>

          {/* Score Breakdown Card matching showcase */}
          <GlassCard
            isDark={isDark}
            elevation="soft"
            borderRadius={24}
            style={[
              styles.breakdownCard,
              {
                backgroundColor: isDark ? '#0E1B38' : 'rgba(255, 255, 255, 0.95)',
                borderColor: isDark ? 'rgba(56, 189, 248, 0.22)' : 'rgba(2, 132, 199, 0.22)',
              },
            ]}
          >
            <Text style={[styles.breakdownTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              Score Breakdown
            </Text>

            {/* Bar 1: Network Security 85/100 */}
            <View style={styles.barItemWrap}>
              <View style={styles.barHeaderRow}>
                <Text style={[styles.barLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                  Network Security
                </Text>
                <Text style={[styles.barValue, { color: '#38BDF8' }]}>85/100</Text>
              </View>
              <View style={styles.track}>
                <View style={[styles.fill, { width: '85%', backgroundColor: '#2563EB' }]} />
              </View>
            </View>

            {/* Bar 2: App Permissions 70/100 */}
            <View style={styles.barItemWrap}>
              <View style={styles.barHeaderRow}>
                <Text style={[styles.barLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                  App Permissions
                </Text>
                <Text style={[styles.barValue, { color: '#F59E0B' }]}>70/100</Text>
              </View>
              <View style={styles.track}>
                <View style={[styles.fill, { width: '70%', backgroundColor: '#F59E0B' }]} />
              </View>
            </View>

            {/* Bar 3: Device Security 90/100 */}
            <View style={styles.barItemWrap}>
              <View style={styles.barHeaderRow}>
                <Text style={[styles.barLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                  Device Security
                </Text>
                <Text style={[styles.barValue, { color: '#10B981' }]}>90/100</Text>
              </View>
              <View style={styles.track}>
                <View style={[styles.fill, { width: '90%', backgroundColor: '#10B981' }]} />
              </View>
            </View>

            {/* Bar 4: Safe Browsing 80/100 */}
            <View style={styles.barItemWrap}>
              <View style={styles.barHeaderRow}>
                <Text style={[styles.barLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                  Safe Browsing
                </Text>
                <Text style={[styles.barValue, { color: '#38BDF8' }]}>80/100</Text>
              </View>
              <View style={styles.track}>
                <View style={[styles.fill, { width: '80%', backgroundColor: '#0284C7' }]} />
              </View>
            </View>
          </GlassCard>

          {/* Top Improvement Card */}
          <GlassCard
            isDark={isDark}
            elevation="soft"
            borderRadius={22}
            style={[
              styles.improvementCard,
              {
                backgroundColor: isDark ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.08)',
                borderColor: 'rgba(245, 158, 11, 0.35)',
              },
            ]}
          >
            <View style={styles.improvementInnerRow}>
              <View style={styles.alertIconBubble}>
                <Text style={{ fontSize: 20 }}>⚡</Text>
              </View>
              <View style={styles.improvementTextWrap}>
                <Text style={[styles.improvementTitle, { color: isDark ? '#FBBF24' : '#B45309' }]}>
                  Top Improvement
                </Text>
                <Text style={[styles.improvementBody, { color: isDark ? '#F1F5F9' : '#1E293B' }]}>
                  Revoke location access for 2 background apps to boost your score by +8 points.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.reviewAppsBtn}
              onPress={onNavigateToPermissionAnalyzer}
              activeOpacity={0.85}
            >
              <Text style={styles.reviewAppsBtnText}>Review Apps</Text>
            </TouchableOpacity>
          </GlassCard>
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
  headerBtn: {
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
    gap: 18,
  },
  scoreHeroSection: {
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  scoreCircleOuter: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 8,
  },
  mainScoreNumber: {
    fontSize: 54,
    fontWeight: '900',
    letterSpacing: -2,
    lineHeight: 58,
  },
  mainScoreMax: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: -4,
  },
  statusBadge: {
    marginTop: 6,
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
  },
  statusBadgeText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '800',
  },
  scoreSummaryText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: 320,
    fontWeight: '500',
  },
  breakdownCard: {
    padding: 20,
    borderWidth: 1.2,
    gap: 16,
  },
  breakdownTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  barItemWrap: {
    gap: 6,
  },
  barHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  barLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  barValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
  improvementCard: {
    padding: 18,
    borderWidth: 1.2,
    gap: 14,
  },
  improvementInnerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  alertIconBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  improvementTextWrap: {
    flex: 1,
    gap: 3,
  },
  improvementTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  improvementBody: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  reviewAppsBtn: {
    backgroundColor: '#2563EB',
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  reviewAppsBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
