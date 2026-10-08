import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Tokens } from '../design-system/tokens';
import { TipCard } from '../design-system/TipCard';

const TIPS = [
  {
    title: 'Recognize Fake Delivery SMS (Smishing)',
    summary:
      'Fraudulent SMS messages claim your parcel is delayed and prompt you to click a link. Official couriers never ask for card details via SMS.',
    category: 'PHISHING_AWARENESS',
    grade: 6,
  },
  {
    title: 'Dangers of Open Wi-Fi Networks',
    summary:
      'Open hotspots lack wireless encryption. Anyone in range can use packet-sniffing software to view unencrypted traffic and credentials.',
    category: 'WIFI_SAFETY',
    grade: 5,
  },
  {
    title: 'Why QR Code Spoofing Works',
    summary:
      'Attackers place sticky labels with fraudulent QR codes over real ones on parking meters. Always preview the web address before paying.',
    category: 'QR_HYGIENE',
    grade: 6,
  },
  {
    title: 'Audit Microphone and Camera Rights',
    summary:
      'Flashlight, wallpaper, or calculator apps do not need audio or camera permissions. Regularly review and revoke unneeded device access.',
    category: 'APP_PERMISSIONS',
    grade: 5,
  },
];

export const AwarenessScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Awareness & Learning</Text>
      <Text style={styles.subtitle}>
        Bite-sized, plain-language digital hygiene guides to keep you protected.
      </Text>

      {TIPS.map((tip, idx) => (
        <TipCard
          key={idx}
          title={tip.title}
          summary={tip.summary}
          category={tip.category}
          readingGrade={tip.grade}
        />
      ))}
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
  title: {
    fontSize: Tokens.typography.titleLarge.fontSize,
    fontWeight: Tokens.typography.titleLarge.fontWeight,
    color: Tokens.colors.dark.textPrimary,
  },
  subtitle: {
    fontSize: Tokens.typography.body.fontSize,
    color: Tokens.colors.dark.textSecondary,
    marginTop: 4,
    marginBottom: Tokens.spacing.lg,
  },
});
