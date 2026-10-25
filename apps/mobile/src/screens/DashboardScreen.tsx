import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { CyberLogo } from '../components/CyberLogo';
import { WifiSentinelModal } from '../components/WifiSentinelModal';
import { LinkInspectorModal } from '../components/LinkInspectorModal';
import { QrScannerModal } from '../components/QrScannerModal';
import { AppPrivacyModal } from '../components/AppPrivacyModal';
import { useAuth } from '../services/AuthContext';
import { GlassCard } from '../design-system/GlassCard';
import { GlassPrimaryButton } from '../design-system/GlassPrimaryButton';
import { GlassTipCard } from '../design-system/GlassTipCard';
import { GlassTokens } from '../design-system/glassTokens';
import { ScoreRing, bandForScore, BAND_LABEL } from '../design-system/ScoreRing';
import { IconTile } from '../design-system/IconTile';

interface DashboardScreenProps {
  onNavigateToScanners?: () => void;
  onNavigateToLearn?: () => void;
  isDark?: boolean;
  toggleTheme?: () => void;
}

type ToolKey = 'wifi' | 'link' | 'qr' | 'apps';

const TOOLS: Array<{
  key: ToolKey;
  glyph: string;
  title: string;
  subtitle: string;
  tone: 'teal' | 'blue';
}> = [
  { key: 'wifi', glyph: '📶', title: 'Wi-Fi check', subtitle: 'Is this network safe?', tone: 'teal' },
  { key: 'link', glyph: '🔗', title: 'Link check', subtitle: 'Spot scams & phishing', tone: 'blue' },
  { key: 'qr', glyph: '⛶', title: 'QR scanner', subtitle: 'Preview before opening', tone: 'blue' },
  { key: 'apps', glyph: '🛡️', title: 'App permissions', subtitle: 'What your apps can access', tone: 'teal' },
];

const formatWhen = (iso?: string): string | null => {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
};

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigateToLearn,
  isDark = false,
  toggleTheme,
}) => {
  const { user } = useAuth();
  const theme = isDark ? GlassTokens.colors.dark : GlassTokens.colors.light;
  const firstName = (user?.name || '').split(' ')[0];

  const [openTool, setOpenTool] = useState<ToolKey | null>(null);
  const close = () => setOpenTool(null);

  const hour = new Date().getHours();
  const greetingTime = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Only trust a score that a real assessment produced (see AuthContext.updateScore).
  const assessedAt = user?.scoreUpdatedAt;
  const score = assessedAt && typeof user?.securityScore === 'number' ? user.securityScore : null;
  const band = score === null ? null : bandForScore(score);
  const lastChecked = formatWhen(assessedAt);

  const bandColor =
    band === 'SECURE'
      ? theme.green
      : band === 'MODERATE'
        ? theme.primaryText
        : band === 'AT_RISK'
          ? theme.amber
          : band === 'CRITICAL'
            ? theme.red
            : theme.textMuted;

  const explanation =
    score === null
      ? 'Your score appears here after your first check. It only reflects checks you have actually run.'
      : band === 'SECURE'
        ? 'Your recent checks look good. Keep checking new links and networks to stay protected.'
        : 'Your score combines your recent Wi-Fi, link and app checks. Run another check to improve it.';

  return (
    <View style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.column}>
          {/* Header */}
          <View style={styles.topHeaderBar}>
            <CyberLogo size={34} isDark={isDark} animated={false} />
            {toggleTheme && (
              <TouchableOpacity
                onPress={toggleTheme}
                activeOpacity={0.75}
                accessibilityRole="button"
                accessibilityLabel={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
                style={[
                  styles.themeButton,
                  {
                    backgroundColor: theme.glassBg,
                    borderColor: theme.glassBorder,
                  },
                ]}
              >
                <Text style={styles.themeButtonIcon}>{isDark ? '☀️' : '🌙'}</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.greetingSection}>
            <Text style={[styles.greetingLabel, { color: theme.textSecondary }]}>
              {greetingTime}
              {firstName ? `, ${firstName}` : ''}
            </Text>
            <Text style={[styles.headlineText, { color: theme.textPrimary }]}>
              {score === null ? "Let's check your protection" : BAND_LABEL[band!]}
            </Text>
          </View>

          {/* Security overview */}
          <GlassCard
            isDark={isDark}
            elevation="floating"
            borderRadius={GlassTokens.radii.xl}
            style={styles.heroCard}
          >
            <View style={styles.heroInner}>
              <ScoreRing score={score} size={140} isDark={isDark} />
              <Text style={[styles.heroStatus, { color: bandColor }]}>
                {score === null ? 'Not checked yet' : BAND_LABEL[band!]}
              </Text>
              <Text style={[styles.heroExplain, { color: theme.textSecondary }]}>
                {explanation}
              </Text>
              {lastChecked && (
                <Text style={[styles.heroMeta, { color: theme.textMuted }]}>
                  Last updated {lastChecked}
                </Text>
              )}
            </View>
          </GlassCard>

          {/* Recommended action — derived from real state only */}
          {score === null && (
            <GlassCard
              isDark={isDark}
              elevation="soft"
              borderRadius={GlassTokens.radii.lg}
              style={styles.recoCard}
            >
              <View style={styles.recoInner}>
                <Text style={[styles.recoLabel, { color: theme.primaryText }]}>
                  RECOMMENDED NEXT STEP
                </Text>
                <Text style={[styles.recoTitle, { color: theme.textPrimary }]}>
                  Check the Wi-Fi you're on
                </Text>
                <Text style={[styles.recoBody, { color: theme.textSecondary }]}>
                  It takes a few seconds and tells you whether this network is safe for banking and
                  logins.
                </Text>
                <GlassPrimaryButton
                  title="Check my Wi-Fi"
                  onPress={() => setOpenTool('wifi')}
                  isDark={isDark}
                  size="large"
                  style={styles.recoButton}
                />
              </View>
            </GlassCard>
          )}

          {/* Quick tools */}
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Protection tools</Text>
          <View style={styles.grid}>
            {TOOLS.map((t) => (
              <View key={t.key} style={styles.gridCell}>
                <GlassCard
                  isDark={isDark}
                  onPress={() => setOpenTool(t.key)}
                  interactive
                  elevation="soft"
                  borderRadius={GlassTokens.radii.lg}
                  style={styles.toolCard}
                >
                  <View
                    style={styles.toolInner}
                    accessible
                    accessibilityRole="button"
                    accessibilityLabel={`${t.title}. ${t.subtitle}`}
                  >
                    <IconTile glyph={t.glyph} tone={t.tone} isDark={isDark} size={46} />
                    <Text style={[styles.toolTitle, { color: theme.textPrimary }]}>{t.title}</Text>
                    <Text style={[styles.toolSub, { color: theme.textSecondary }]}>
                      {t.subtitle}
                    </Text>
                  </View>
                </GlassCard>
              </View>
            ))}
          </View>

          {/* Awareness */}
          <GlassTipCard
            category="TODAY'S SAFETY TIP"
            icon="💡"
            title="Free Wi-Fi names can be faked"
            advice="Attackers set up hotspots with the same name as a café or airport. Confirm the exact network name with staff before connecting."
            onPress={onNavigateToLearn}
            isDark={isDark}
          />
        </View>
      </ScrollView>

      <WifiSentinelModal visible={openTool === 'wifi'} onClose={close} isDark={isDark} />
      <LinkInspectorModal visible={openTool === 'link'} onClose={close} isDark={isDark} />
      <QrScannerModal visible={openTool === 'qr'} onClose={close} isDark={isDark} />
      <AppPrivacyModal visible={openTool === 'apps'} onClose={close} isDark={isDark} />
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 140, alignItems: 'center' },
  column: { width: '100%', maxWidth: GlassTokens.layout.maxContentWidth },
  topHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 12,
  },
  themeButton: {
    width: GlassTokens.layout.minTouchTarget,
    height: GlassTokens.layout.minTouchTarget,
    borderRadius: GlassTokens.layout.minTouchTarget / 2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeButtonIcon: { fontSize: 18 },
  greetingSection: { paddingBottom: 16 },
  greetingLabel: { fontSize: 15, fontWeight: '500', marginBottom: 4 },
  headlineText: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5, lineHeight: 34 },
  heroCard: { marginBottom: 16 },
  heroInner: { alignItems: 'center', paddingVertical: 20, paddingHorizontal: 20 },
  heroStatus: { fontSize: 17, fontWeight: '700', marginTop: 14 },
  heroExplain: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 6,
    maxWidth: 420,
  },
  heroMeta: { fontSize: 13, marginTop: 10 },
  recoCard: { marginBottom: 20 },
  recoInner: { padding: 18 },
  recoLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 6 },
  recoTitle: { fontSize: 20, fontWeight: '700', marginBottom: 6 },
  recoBody: { fontSize: 15, lineHeight: 22 },
  recoButton: { marginTop: 12 },
  sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 12, marginTop: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6, marginBottom: 12 },
  gridCell: { width: '50%', padding: 6 },
  toolCard: { minHeight: 148 },
  toolInner: { padding: 16 },
  toolTitle: { fontSize: 16, fontWeight: '700', marginTop: 12 },
  toolSub: { fontSize: 13, lineHeight: 18, marginTop: 2 },
});
