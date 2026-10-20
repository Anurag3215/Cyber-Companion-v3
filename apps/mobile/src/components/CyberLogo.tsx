import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated, Easing, Platform } from 'react-native';

interface CyberLogoProps {
  size?: number;
  showText?: boolean;
  isDark?: boolean;
  animated?: boolean;
}

export const CyberLogo: React.FC<CyberLogoProps> = ({
  size = 54,
  showText = true,
  isDark = true,
  animated = true,
}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.4)).current;

  const teal = isDark ? '#2DD4BF' : '#0D9488';
  const emerald = '#10B981';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const subtextColor = isDark ? '#94A3B8' : '#64748B';

  useEffect(() => {
    if (!animated) return;

    const spin = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 9000,
        easing: Easing.linear,
        useNativeDriver: Platform.OS !== 'web',
      })
    );

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.95,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );

    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.9,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(glowAnim, {
          toValue: 0.4,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );

    spin.start();
    pulse.start();
    glow.start();

    return () => {
      spin.stop();
      pulse.stop();
      glow.stop();
    };
  }, [animated]);

  const spinInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const shieldScale = size / 54;

  return (
    <View style={styles.container}>
      <View style={[styles.emblemWrapper, { width: size, height: size }]}>
        {/* Outer Hex Shield Border */}
        <Animated.View
          style={[
            styles.outerShield,
            {
              width: size,
              height: size,
              borderColor: teal,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          {/* Orbital Gimbal Ring */}
          {animated && (
            <Animated.View
              style={[
                styles.orbitalRing,
                {
                  width: size * 1.15,
                  height: size * 1.15,
                  borderColor: emerald,
                  transform: [{ rotate: spinInterpolate }],
                },
              ]}
            >
              <View style={[styles.orbitalNode, { backgroundColor: teal }]} />
            </Animated.View>
          )}

          {/* Inner Hex Core with Shield Icon */}
          <View style={[styles.innerCore, { backgroundColor: isDark ? '#090D16' : '#FFFFFF', borderColor: teal }]}>
            <Text style={[styles.coreIcon, { fontSize: 20 * shieldScale }]}>🛡️</Text>
          </View>
        </Animated.View>
      </View>

      {showText && (
        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <Text style={[styles.brandTitle, { color: textColor }]}>CYBER</Text>
            <Text style={[styles.brandAccent, { color: teal }]}>COMPANION</Text>
            <View style={[styles.versionPill, { borderColor: teal }]}>
              <Text style={[styles.versionText, { color: teal }]}>v3</Text>
            </View>
          </View>
          <Text style={[styles.tagline, { color: subtextColor }]}>
            Zero-Trust Threat Defense Sentinel
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emblemWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  outerShield: {
    borderWidth: 2,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2DD4BF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  orbitalRing: {
    position: 'absolute',
    borderWidth: 1.5,
    borderRadius: 9999,
    borderStyle: 'dashed',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  orbitalNode: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: -3,
  },
  innerCore: {
    width: '75%',
    height: '75%',
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coreIcon: {
    textAlign: 'center',
  },
  textContainer: {
    marginLeft: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  brandAccent: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  versionPill: {
    borderWidth: 1,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
    marginLeft: 2,
  },
  versionText: {
    fontSize: 9,
    fontWeight: '800',
  },
  tagline: {
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 0.2,
    marginTop: 1,
  },
});
