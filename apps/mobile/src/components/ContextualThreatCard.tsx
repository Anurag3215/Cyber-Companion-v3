import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Tokens } from '../design-system/tokens';

interface ContextualThreatCardProps {
  threatType: 'PUNYCODE' | 'IP_HOST' | 'OPEN_WIFI' | 'SMS_PERM' | 'GENERIC_PHISH';
}

const THREAT_EXPLANATIONS = {
  PUNYCODE: {
    title: 'Why Are Lookalike Letters Dangerous?',
    explanation:
      'Attackers register domain names using foreign alphabets (such as Cyrillic or Greek) that look identical to letters like "a", "c", or "o". When tapped, they lead to an attacker server designed to mimic your bank or email provider.',
    prevention: [
      'Bookmark critical banking and shopping websites directly.',
      'Check if the browser address bar contains weird prefixes like "xn--".',
      'Never trust login links received unexpectedly via SMS or chat.',
    ],
  },
  IP_HOST: {
    title: 'Why Are Numeric IP Links Suspicious?',
    explanation:
      'Legitimate companies register branded domain names. Attackers often deploy malicious infrastructure directly on raw IP addresses to bypass automated domain blocking.',
    prevention: [
      'Avoid entering credentials on sites starting with numeric IPs (e.g. 192.x.x.x).',
      'Look for official .com or regional domain names.',
    ],
  },
  OPEN_WIFI: {
    title: 'How Can Attackers Spy on Public Wi-Fi?',
    explanation:
      'Unencrypted hotspots do not encrypt radio transmissions between your phone and the router. An attacker sitting nearby can capture your unencrypted traffic or spoof your DNS queries to fake login portals.',
    prevention: [
      'Use mobile cellular data when entering passwords.',
      'Connect via an encrypted VPN tunnel whenever public Wi-Fi is necessary.',
    ],
  },
  SMS_PERM: {
    title: 'Why Is SMS Access So Risky for Apps?',
    explanation:
      'Your SMS inbox contains two-factor authentication (2FA) one-time passwords (OTPs). Rogue utility apps with SMS rights can read and forward OTPs to hackers without showing notifications.',
    prevention: [
      'Revoke SMS permission from all utility apps that are not your primary SMS app.',
      'Switch to hardware keys or authenticator apps (TOTP) where possible.',
    ],
  },
  GENERIC_PHISH: {
    title: 'How Phishing Deceives Users',
    explanation:
      'Phishing websites rely on emotional urgency ("Account Suspended in 24 Hours!") to panic you into revealing login credentials.',
    prevention: [
      'Pause and independently verify claims through official customer service channels.',
      'Never input sensitive data on links clicked from emails or text messages.',
    ],
  },
};

export const ContextualThreatCard: React.FC<ContextualThreatCardProps> = ({ threatType }) => {
  const content = THREAT_EXPLANATIONS[threatType] || THREAT_EXPLANATIONS.GENERIC_PHISH;

  return (
    <View style={styles.card}>
      <Text style={styles.badge}>Security Deep Dive</Text>
      <Text style={styles.title}>{content.title}</Text>
      <Text style={styles.explanation}>{content.explanation}</Text>

      <Text style={styles.subHeading}>How to stay protected:</Text>
      {content.prevention.map((step, idx) => (
        <Text key={idx} style={styles.step}>
          • {step}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0F172A',
    borderRadius: Tokens.radii.lg,
    padding: Tokens.spacing.lg,
    borderWidth: 1,
    borderColor: '#38BDF8',
    marginVertical: Tokens.spacing.sm,
  },
  badge: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Tokens.spacing.xs,
  },
  title: {
    fontSize: Tokens.typography.titleMedium.fontSize,
    fontWeight: Tokens.typography.titleMedium.fontWeight,
    color: Tokens.colors.dark.textPrimary,
    marginBottom: Tokens.spacing.sm,
  },
  explanation: {
    fontSize: Tokens.typography.body.fontSize,
    color: Tokens.colors.dark.textSecondary,
    lineHeight: 21,
    marginBottom: Tokens.spacing.md,
  },
  subHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: Tokens.spacing.xs,
  },
  step: {
    fontSize: 13,
    color: '#CBD5E1',
    lineHeight: 19,
    marginLeft: 4,
    marginBottom: 4,
  },
});
