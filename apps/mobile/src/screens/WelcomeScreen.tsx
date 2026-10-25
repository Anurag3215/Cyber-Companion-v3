import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { Shield3DVisual } from '../components/Showcase3DVisuals';
import { GlassTokens } from '../design-system/glassTokens';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  isDark?: boolean;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onGetStarted,
  onSignIn,
  isDark = true,
}) => {
  const theme = isDark ? GlassTokens.colors.dark : GlassTokens.colors.light;

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#070D18' : '#F4F8FC' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Hero Visual Area */}
      <View style={styles.heroSection}>
        <Shield3DVisual size={220} isDark={isDark} />
      </View>

      {/* Typography & Copy */}
      <View style={styles.copySection}>
        <Text style={[styles.appBrand, { color: isDark ? '#38BDF8' : theme.primary }]}>
          CYBER COMPANION
        </Text>
        <Text style={[styles.tagline, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
          Stay Aware. Stay Safe.
        </Text>
        <Text style={[styles.description, { color: isDark ? '#94A3B8' : '#64748B' }]}>
          Your real-time shield against digital threats, malicious links, and insecure networks.
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsSection}>
        {/* Primary Action Button */}
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={onGetStarted}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Get Started with Cyber Companion"
        >
          <Text style={styles.primaryBtnText}>Get Started</Text>
          <Text style={styles.arrowIcon}>→</Text>
        </TouchableOpacity>

        {/* Secondary Action Button */}
        <TouchableOpacity
          style={[
            styles.secondaryBtn,
            {
              backgroundColor: isDark ? 'rgba(14, 27, 56, 0.75)' : 'rgba(255, 255, 255, 0.9)',
              borderColor: isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(2, 132, 199, 0.25)',
            },
          ]}
          onPress={onSignIn}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Sign In to your account"
        >
          <Text style={[styles.secondaryBtnText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
            Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 48 : 56,
    paddingBottom: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroSection: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  copySection: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 28,
  },
  appBrand: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2.2,
    marginBottom: 10,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.8,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    fontWeight: '500',
    maxWidth: 340,
  },
  actionsSection: {
    width: '100%',
    maxWidth: 400,
    gap: 14,
  },
  primaryBtn: {
    backgroundColor: '#2563EB',
    height: 56,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 6,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  arrowIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 8,
  },
  secondaryBtn: {
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
