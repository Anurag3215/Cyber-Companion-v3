import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';

interface LinkCheckSheetProps {
  url?: string;
  isThreat?: boolean;
  threatTitle?: string;
  consensusText?: string;
  explanation?: string;
  findings?: string[];
  onClose: () => void;
  onReport?: () => void;
  onLearnWhy?: () => void;
  isDark?: boolean;
}

export const LinkCheckSheet: React.FC<LinkCheckSheetProps> = ({
  url = 'secure-paypa1-login.com/verify',
  isThreat = true,
  threatTitle = "Don't open this link",
  consensusText = 'Dangerous · 4 of 4 sources agree',
  explanation = 'It copies a PayPal login page to steal your password. The "1" in "paypa1" is a number, not the letter "l".',
  findings = [
    'Reported as phishing by Google',
    'Looks like a well-known brand',
    'Website created 2 days ago',
  ],
  onClose,
  onReport,
  onLearnWhy,
  isDark = false,
}) => {
  const bg = isDark ? '#0F172A' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#111827';
  const subtextColor = isDark ? '#94A3B8' : '#4B5563';
  const borderCol = isDark ? '#334155' : '#E5E7EB';
  const urlBoxBg = isDark ? '#1E293B' : '#F3F4F6';

  return (
    <ScrollView style={[styles.container, { backgroundColor: bg }]} contentContainerStyle={styles.content}>
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: textColor }]}>Link check</Text>
      </View>

      {/* Target URL Pill */}
      <View style={[styles.urlPill, { backgroundColor: urlBoxBg, borderColor: borderCol }]}>
        <Text style={[styles.urlText, { color: subtextColor }]} numberOfLines={1}>
          {url}
        </Text>
      </View>

      {/* Threat Alert Card */}
      {isThreat ? (
        <View style={styles.threatCard}>
          <View style={styles.threatHeaderRow}>
            <View style={styles.alertIconCircle}>
              <Text style={styles.alertIcon}>!</Text>
            </View>
            <View style={styles.threatTitleCol}>
              <Text style={styles.threatTitle}>{threatTitle}</Text>
              <Text style={styles.consensusText}>{consensusText}</Text>
            </View>
          </View>
          <Text style={styles.explanationText}>{explanation}</Text>
        </View>
      ) : (
        <View style={styles.safeCard}>
          <Text style={styles.safeTitle}>✓ Link appears safe</Text>
          <Text style={styles.safeExplanation}>No known threats or phishing indicators detected.</Text>
        </View>
      )}

      {/* What we found */}
      <View style={styles.findingsSection}>
        <Text style={[styles.findingsTitle, { color: textColor }]}>What we found</Text>
        {findings.map((finding, idx) => (
          <View key={idx} style={styles.findingRow}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={[styles.findingText, { color: subtextColor }]}>{finding}</Text>
          </View>
        ))}
      </View>

      {/* Primary Action Button */}
      <TouchableOpacity style={styles.primaryButton} onPress={onClose} activeOpacity={0.8}>
        <Text style={styles.primaryButtonText}>Close and stay safe</Text>
      </TouchableOpacity>

      {/* Secondary Action Row */}
      <View style={styles.secondaryRow}>
        <TouchableOpacity
          style={[styles.secondaryButton, { borderColor: borderCol }]}
          onPress={onReport || onClose}
          activeOpacity={0.7}
        >
          <Text style={[styles.secondaryButtonText, { color: textColor }]}>Report link</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryButton, { borderColor: borderCol }]}
          onPress={onLearnWhy || onClose}
          activeOpacity={0.7}
        >
          <Text style={[styles.secondaryButtonText, { color: textColor }]}>Learn why</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  urlPill: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 20,
  },
  urlText: {
    fontSize: 14,
    fontWeight: '500',
  },
  threatCard: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  threatHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  alertIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  alertIcon: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 18,
    lineHeight: 22,
  },
  threatTitleCol: {
    flex: 1,
  },
  threatTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#991B1B',
    letterSpacing: -0.3,
  },
  consensusText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#DC2626',
    marginTop: 2,
  },
  explanationText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
    fontWeight: '400',
  },
  safeCard: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  safeTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#065F46',
  },
  safeExplanation: {
    fontSize: 14,
    color: '#047857',
    marginTop: 4,
  },
  findingsSection: {
    marginBottom: 32,
  },
  findingsTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 14,
    letterSpacing: -0.2,
  },
  findingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bulletDot: {
    fontSize: 16,
    color: '#9CA3AF',
    marginRight: 10,
    lineHeight: 20,
  },
  findingText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  primaryButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 14,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 28,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
