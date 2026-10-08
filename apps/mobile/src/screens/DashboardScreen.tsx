import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { ScoreGauge } from '../design-system/ScoreGauge';
import { ActionCard } from '../design-system/ActionCard';
import { TipCard } from '../design-system/TipCard';
import { Tokens } from '../design-system/tokens';

interface DashboardScreenProps {
  onNavigateToScanners: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigateToScanners }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.scoreCard}>
        <Text style={styles.scoreCardTitle}>Device Cyber Posture</Text>
        <ScoreGauge score={88} band="SECURE" size={140} />
        
        <View style={styles.breakdownGrid}>
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownVal}>95%</Text>
            <Text style={styles.breakdownLabel}>Network</Text>
          </View>
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownVal}>90%</Text>
            <Text style={styles.breakdownLabel}>URL Safety</Text>
          </View>
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownVal}>80%</Text>
            <Text style={styles.breakdownLabel}>Permissions</Text>
          </View>
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownVal}>85%</Text>
            <Text style={styles.breakdownLabel}>Device OS</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Actions to Improve (+15 pts)</Text>
        <ActionCard
          title="Disconnect from Unencrypted Cafe Wi-Fi"
          description="Traffic on this open hotspot can be intercepted via packet sniffing."
          pointGain={10}
          severity="CRITICAL"
          onPressAction={onNavigateToScanners}
          actionButtonText="Inspect Network"
        />
        <ActionCard
          title="Review Torch Utility SMS Access"
          description="Application 'SuperBright Torch' has permission to read incoming SMS OTPs."
          pointGain={5}
          severity="HIGH"
          onPressAction={onNavigateToScanners}
          actionButtonText="Audit Permission"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Cyber Tip</Text>
        <TipCard
          title="Beware of Quishing Attacks"
          summary="Malicious QR codes placed over legitimate ones can direct you to credential harvesting pages. Always inspect destination URLs before logging in."
          category="QR_HYGIENE"
          readingGrade={6}
        />
      </View>
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
  scoreCard: {
    backgroundColor: Tokens.colors.dark.surface,
    borderRadius: Tokens.radii.lg,
    padding: Tokens.spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Tokens.colors.dark.border,
    marginBottom: Tokens.spacing.lg,
  },
  scoreCardTitle: {
    fontSize: Tokens.typography.titleMedium.fontSize,
    fontWeight: Tokens.typography.titleMedium.fontWeight,
    color: Tokens.colors.dark.textPrimary,
  },
  breakdownGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: Tokens.spacing.md,
    paddingTop: Tokens.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Tokens.colors.dark.border,
  },
  breakdownItem: {
    alignItems: 'center',
  },
  breakdownVal: {
    fontSize: 15,
    fontWeight: '700',
    color: '#38BDF8',
  },
  breakdownLabel: {
    fontSize: 11,
    color: Tokens.colors.dark.textMuted,
    marginTop: 2,
  },
  section: {
    marginBottom: Tokens.spacing.lg,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Tokens.colors.dark.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Tokens.spacing.sm,
  },
});
