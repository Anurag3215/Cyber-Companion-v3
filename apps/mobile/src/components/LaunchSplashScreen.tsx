import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Easing,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { CyberLogo } from './CyberLogo';

interface LaunchSplashScreenProps {
  onFinish: () => void;
  isDark?: boolean;
}

export const LaunchSplashScreen: React.FC<LaunchSplashScreenProps> = ({
  onFinish,
  isDark = true,
}) => {
  // Animation drivers
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const ringScale = useRef(new Animated.Value(1)).current;
  const ringOpacity = useRef(new Animated.Value(0.6)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const exitFade = useRef(new Animated.Value(1)).current;

  const [statusText, setStatusText] = useState('Arming zero-trust threat engine...');

  useEffect(() => {
    // 1. Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 1800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
    ]).start();

    // 2. Continuous glowing ring pulse
    const ringLoop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(ringScale, {
            toValue: 1.45,
            duration: 900,
            easing: Easing.out(Easing.ease),
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.timing(ringOpacity, {
            toValue: 0,
            duration: 900,
            useNativeDriver: Platform.OS !== 'web',
          }),
        ]),
        Animated.parallel([
          Animated.timing(ringScale, {
            toValue: 1,
            duration: 0,
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.timing(ringOpacity, {
            toValue: 0.6,
            duration: 0,
            useNativeDriver: Platform.OS !== 'web',
          }),
        ]),
      ])
    );
    ringLoop.start();

    // 3. Status messages progression
    const t1 = setTimeout(() => {
      setStatusText('Auditing ambient airspace & ciphers...');
    }, 600);

    const t2 = setTimeout(() => {
      setStatusText('Loading on-device threat intelligence...');
    }, 1200);

    const t3 = setTimeout(() => {
      setStatusText('Perimeter secured. Welcome.');
    }, 1650);

    // 4. Smooth exit transition
    const tEnd = setTimeout(() => {
      Animated.timing(exitFade, {
        toValue: 0,
        duration: 350,
        useNativeDriver: Platform.OS !== 'web',
      }).start(() => {
        onFinish();
      });
    }, 2000);

    return () => {
      ringLoop.stop();
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(tEnd);
    };
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: exitFade }]}>
      <TouchableOpacity
        style={styles.touchWrap}
        activeOpacity={1}
        onPress={onFinish}
      >
        {/* Glowing Halo Rings */}
        <Animated.View
          style={[
            styles.haloRing,
            {
              transform: [{ scale: ringScale }],
              opacity: ringOpacity,
            },
          ]}
        />

        {/* Center Cyber Shield Logo */}
        <Animated.View
          style={[
            styles.logoWrap,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.logoBadgeOuter}>
            <CyberLogo size={78} isDark={true} animated={true} />
          </View>
        </Animated.View>

        {/* Branding Typography */}
        <Animated.View style={[styles.textWrap, { opacity: fadeAnim }]}>
          <Text style={styles.brandTitle}>CYBER COMPANION</Text>
          <Text style={styles.brandSubtitle}>AUTONOMOUS DEFENSE SENTINEL</Text>
        </Animated.View>

        {/* Security Progress Meter */}
        <View style={styles.meterContainer}>
          <View style={styles.meterTrack}>
            <Animated.View style={[styles.meterFill, { width: progressWidth }]} />
          </View>
          <Text style={styles.statusLabel}>{statusText}</Text>
        </View>

        {/* Zero-Trust Badge */}
        <View style={styles.tagBadge}>
          <Text style={styles.tagBadgeText}>🔒 100% STANDALONE ON-DEVICE ARCHITECTURE</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#070D18',
    zIndex: 9999,
  },
  touchWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  haloRing: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 2,
    borderColor: '#38BDF8',
  },
  logoWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 26,
  },
  logoBadgeOuter: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(14, 27, 56, 0.9)',
    borderWidth: 2,
    borderColor: '#38BDF8',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 24,
    elevation: 12,
  },
  textWrap: {
    alignItems: 'center',
    gap: 6,
    marginBottom: 36,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  brandSubtitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 2.2,
  },
  meterContainer: {
    width: '100%',
    maxWidth: 280,
    alignItems: 'center',
    gap: 12,
  },
  meterTrack: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(56, 189, 248, 0.18)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  meterFill: {
    height: '100%',
    backgroundColor: '#38BDF8',
    borderRadius: 2,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    textAlign: 'center',
    minHeight: 18,
  },
  tagBadge: {
    position: 'absolute',
    bottom: 40,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(14, 27, 56, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
  },
  tagBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 0.8,
  },
});
