import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Tokens } from '../design-system/tokens';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const STEPS = [
  {
    title: 'Proactive Wi-Fi & Link Protection',
    description:
      'Cyber Companion analyzes open networks and deceptive links before you interact with them, preventing Man-in-the-Middle attacks and credential theft.',
    highlight: 'Zero Silent Background Tracking',
  },
  {
    title: 'QR Code Sandboxing & App Audits',
    description:
      'Preview destinations from scanned QR codes safely and audit installed apps for risky background permissions like SMS or Location.',
    highlight: '100% On-Device Analysis',
  },
  {
    title: 'Deterministic Security Score',
    description:
      'Receive an objective 0–100 Security Health Score with plain-language top 3 fixes to keep your digital life resilient.',
    highlight: 'No AI Hallucinations · Pure Math',
  },
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const step = STEPS[currentStep];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Step {currentStep + 1} of 3</Text>
        </View>

        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.description}>{step.description}</Text>

        <View style={styles.highlightBox}>
          <Text style={styles.highlightText}>{step.highlight}</Text>
        </View>

        <View style={styles.dotsRow}>
          {STEPS.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === currentStep ? styles.dotActive : styles.dotInactive]}
            />
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        {currentStep < STEPS.length - 1 ? (
          <TouchableOpacity style={styles.skipBtn} onPress={onComplete}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ flex: 1 }} />
        )}
        <TouchableOpacity style={styles.primaryBtn} onPress={handleNext}>
          <Text style={styles.btnText}>
            {currentStep === STEPS.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Tokens.colors.dark.background,
  },
  content: {
    flex: 1,
    padding: Tokens.spacing.xl,
    justifyContent: 'center',
  },
  badge: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Tokens.radii.full,
    alignSelf: 'flex-start',
    marginBottom: Tokens.spacing.md,
    borderWidth: 1,
    borderColor: '#334155',
  },
  badgeText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Tokens.colors.dark.textPrimary,
    lineHeight: 32,
    marginBottom: Tokens.spacing.md,
  },
  description: {
    fontSize: 15,
    color: Tokens.colors.dark.textSecondary,
    lineHeight: 22,
    marginBottom: Tokens.spacing.lg,
  },
  highlightBox: {
    backgroundColor: '#064E3B',
    padding: Tokens.spacing.md,
    borderRadius: Tokens.radii.md,
    borderWidth: 1,
    borderColor: '#10B981',
    marginBottom: Tokens.spacing.xl,
  },
  highlightText: {
    color: '#D1FAE5',
    fontWeight: '700',
    fontSize: 13,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: '#38BDF8',
  },
  dotInactive: {
    width: 8,
    backgroundColor: '#334155',
  },
  footer: {
    flexDirection: 'row',
    padding: Tokens.spacing.xl,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Tokens.colors.dark.border,
  },
  skipBtn: {
    flex: 1,
  },
  skipText: {
    color: Tokens.colors.dark.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  primaryBtn: {
    backgroundColor: '#0284C7',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: Tokens.radii.md,
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
