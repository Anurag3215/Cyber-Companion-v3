import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Easing,
  Platform,
} from 'react-native';

interface VisualProps {
  size?: number;
  isDark?: boolean;
}

// 1. 3D GLOWING SHIELD (Welcome & Dashboard Hero)
export const Shield3DVisual: React.FC<VisualProps> = ({ size = 180, isDark = true }) => {
  const spinY = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseCore = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(spinY, {
        toValue: 1,
        duration: 9000,
        easing: Easing.linear,
        useNativeDriver: Platform.OS !== 'web',
      })
    );

    const float = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(floatAnim, {
          toValue: 6,
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseCore, {
          toValue: 1.08,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(pulseCore, {
          toValue: 0.94,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );

    spin.start();
    float.start();
    pulse.start();

    return () => {
      spin.stop();
      float.stop();
      pulse.stop();
    };
  }, []);

  const rotY = spinY.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.visualContainer, { width: size, height: size }]}>
      {/* Glowing Cyber Base Pedestal */}
      <View style={[styles.pedestalOuter, { width: size * 0.85, height: size * 0.3 }]}>
        <View style={[styles.pedestalGlow, { width: size * 0.7, height: size * 0.2 }]} />
        <Animated.View
          style={[
            styles.pedestalRing,
            {
              width: size * 0.75,
              height: size * 0.25,
              transform: [{ rotateZ: rotY }],
            },
          ]}
        />
      </View>

      {/* Floating 3D Shield */}
      <Animated.View
        style={[
          styles.shieldWrapper,
          {
            width: size * 0.65,
            height: size * 0.72,
            transform: [
              { translateY: floatAnim },
              { perspective: 800 },
              { rotateX: '12deg' },
            ],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.shieldBody,
            {
              transform: [{ scale: pulseCore }],
            },
          ]}
        >
          {/* Glass Gloss Layer */}
          <View style={styles.shieldGloss} />
          {/* Emblem Icon */}
          <Text style={[styles.shieldIcon, { fontSize: size * 0.28 }]}>🛡️</Text>
          {/* Center Trust Lock */}
          <View style={styles.shieldCoreBadge}>
            <View style={styles.shieldCoreDot} />
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

// 2. 3D WI-FI ORB (Wi-Fi Risk Analyzer)
export const WifiOrb3DVisual: React.FC<VisualProps> = ({ size = 180, isDark = true }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const wave1 = useRef(new Animated.Value(0)).current;
  const wave2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.95,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );

    const waveAnim1 = Animated.loop(
      Animated.timing(wave1, {
        toValue: 1,
        duration: 2000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: Platform.OS !== 'web',
      })
    );

    const waveAnim2 = Animated.loop(
      Animated.timing(wave2, {
        toValue: 1,
        duration: 2000,
        delay: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: Platform.OS !== 'web',
      })
    );

    pulse.start();
    waveAnim1.start();
    waveAnim2.start();

    return () => {
      pulse.stop();
      waveAnim1.stop();
      waveAnim2.stop();
    };
  }, []);

  const scaleWave1 = wave1.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1.35],
  });
  const opacityWave1 = wave1.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.8, 0.4, 0],
  });

  const scaleWave2 = wave2.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1.35],
  });
  const opacityWave2 = wave2.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.8, 0.4, 0],
  });

  return (
    <View style={[styles.visualContainer, { width: size, height: size }]}>
      {/* Radar Wave 1 */}
      <Animated.View
        style={[
          styles.radarWave,
          {
            width: size * 0.85,
            height: size * 0.85,
            borderRadius: (size * 0.85) / 2,
            opacity: opacityWave1,
            transform: [{ scale: scaleWave1 }],
          },
        ]}
      />
      {/* Radar Wave 2 */}
      <Animated.View
        style={[
          styles.radarWave,
          {
            width: size * 0.85,
            height: size * 0.85,
            borderRadius: (size * 0.85) / 2,
            opacity: opacityWave2,
            transform: [{ scale: scaleWave2 }],
          },
        ]}
      />

      {/* Cyber Base Pedestal */}
      <View style={[styles.pedestalOuter, { width: size * 0.8, height: size * 0.28 }]}>
        <View style={[styles.pedestalGlow, { width: size * 0.65, height: size * 0.18 }]} />
      </View>

      {/* Center Wi-Fi Orb */}
      <Animated.View
        style={[
          styles.wifiOrb,
          {
            width: size * 0.48,
            height: size * 0.48,
            borderRadius: (size * 0.48) / 2,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <Text style={[styles.wifiIcon, { fontSize: size * 0.24 }]}>📶</Text>
      </Animated.View>
    </View>
  );
};

// 3. 3D INTERLOCKING CHAIN LINKS (URL Scanner)
export const ChainLinks3DVisual: React.FC<VisualProps> = ({ size = 180, isDark = true }) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const spinZ = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const float = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -6,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(floatAnim, {
          toValue: 6,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );

    const spin = Animated.loop(
      Animated.sequence([
        Animated.timing(spinZ, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(spinZ, {
          toValue: 0,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );

    float.start();
    spin.start();

    return () => {
      float.stop();
      spin.stop();
    };
  }, []);

  const rotZ = spinZ.interpolate({
    inputRange: [0, 1],
    outputRange: ['-6deg', '6deg'],
  });

  return (
    <View style={[styles.visualContainer, { width: size, height: size }]}>
      {/* Background Cyber Grid Glow */}
      <View style={[styles.gridHalo, { width: size * 0.75, height: size * 0.75 }]} />

      {/* Floating 3D Chain Links */}
      <Animated.View
        style={[
          styles.chainWrapper,
          {
            transform: [{ translateY: floatAnim }, { rotateZ: rotZ }],
          },
        ]}
      >
        <View style={styles.chainLink1}>
          <View style={styles.chainInnerHole} />
        </View>
        <View style={styles.chainLink2}>
          <View style={styles.chainInnerHole} />
        </View>
        {/* Glow Spark */}
        <View style={styles.chainSparkle} />
      </Animated.View>
    </View>
  );
};

// 4. 3D RED WARNING PRISM (URL Result - Suspicious/Malicious)
export const WarningPrism3DVisual: React.FC<VisualProps> = ({ size = 180, isDark = true }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.12,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.95,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );

    pulse.start();
    return () => pulse.stop();
  }, []);

  return (
    <View style={[styles.visualContainer, { width: size, height: size }]}>
      {/* Red Danger Halo */}
      <View
        style={[
          styles.dangerHalo,
          { width: size * 0.8, height: size * 0.8, borderRadius: (size * 0.8) / 2 },
        ]}
      />

      {/* 3D Warning Prism */}
      <Animated.View
        style={[
          styles.prismTriangle,
          {
            width: size * 0.58,
            height: size * 0.54,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <Text style={[styles.dangerIcon, { fontSize: size * 0.3 }]}>⚠️</Text>
      </Animated.View>
    </View>
  );
};

// 5. 3D HOLOGRAPHIC QR CUBE (QR Scanner)
export const QrCube3DVisual: React.FC<VisualProps> = ({ size = 180, isDark = true }) => {
  const spinY = useRef(new Animated.Value(0)).current;
  const scanBeam = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(spinY, {
        toValue: 1,
        duration: 10000,
        easing: Easing.linear,
        useNativeDriver: Platform.OS !== 'web',
      })
    );

    const beam = Animated.loop(
      Animated.sequence([
        Animated.timing(scanBeam, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(scanBeam, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );

    spin.start();
    beam.start();

    return () => {
      spin.stop();
      beam.stop();
    };
  }, []);

  const rotY = spinY.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const beamTranslateY = scanBeam.interpolate({
    inputRange: [0, 1],
    outputRange: [-size * 0.22, size * 0.22],
  });

  return (
    <View style={[styles.visualContainer, { width: size, height: size }]}>
      {/* 3D Glass QR Cube */}
      <Animated.View
        style={[
          styles.qrCube,
          {
            width: size * 0.54,
            height: size * 0.54,
            transform: [
              { perspective: 800 },
              { rotateX: '15deg' },
              { rotateY: rotY },
            ],
          },
        ]}
      >
        <Text style={[styles.qrIconText, { fontSize: size * 0.28 }]}>⛶</Text>
        {/* Hologram Scanner Beam */}
        <Animated.View
          style={[
            styles.cyanScanBeam,
            {
              width: size * 0.6,
              transform: [{ translateY: beamTranslateY }],
            },
          ]}
        />
      </Animated.View>
    </View>
  );
};

// 6. 3D SAFE BADGE (QR Result - Safe)
export const SafeCheck3DVisual: React.FC<VisualProps> = ({ size = 180, isDark = true }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.96,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  return (
    <View style={[styles.visualContainer, { width: size, height: size }]}>
      <View
        style={[
          styles.safeHalo,
          { width: size * 0.8, height: size * 0.8, borderRadius: (size * 0.8) / 2 },
        ]}
      />
      <Animated.View
        style={[
          styles.safeBadge,
          {
            width: size * 0.52,
            height: size * 0.52,
            borderRadius: (size * 0.52) / 2,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <Text style={[styles.safeIconText, { fontSize: size * 0.28 }]}>✓</Text>
      </Animated.View>
    </View>
  );
};

// 7. 3D PHONE WITH CYBER SHIELD (Cyber Awareness Hero)
export const PhoneShield3DVisual: React.FC<VisualProps> = ({ size = 140, isDark = true }) => {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const float = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -6,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(floatAnim, {
          toValue: 6,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );
    float.start();
    return () => float.stop();
  }, []);

  return (
    <View style={[styles.visualContainer, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.phoneFrame,
          {
            width: size * 0.55,
            height: size * 0.85,
            transform: [
              { translateY: floatAnim },
              { perspective: 600 },
              { rotateY: '-15deg' },
              { rotateX: '8deg' },
            ],
          },
        ]}
      >
        <View style={styles.phoneScreen}>
          <View style={styles.phoneLockIcon}>
            <Text style={{ fontSize: size * 0.2 }}>🔒</Text>
          </View>
          <View style={styles.phonePulseBar} />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  visualContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pedestalOuter: {
    position: 'absolute',
    bottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pedestalGlow: {
    backgroundColor: 'rgba(56, 189, 248, 0.22)',
    borderRadius: 9999,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 16,
    elevation: 8,
  },
  pedestalRing: {
    position: 'absolute',
    borderRadius: 9999,
    borderWidth: 1.5,
    borderColor: 'rgba(56, 189, 248, 0.45)',
    borderStyle: 'dashed',
  },
  shieldWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldBody: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1E3A8A',
    borderRadius: 36,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    borderWidth: 2,
    borderColor: '#38BDF8',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  shieldGloss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
  },
  shieldIcon: {
    textAlign: 'center',
  },
  shieldCoreBadge: {
    position: 'absolute',
    bottom: 14,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(56, 189, 248, 0.3)',
    borderWidth: 1,
    borderColor: '#38BDF8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldCoreDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38BDF8',
  },
  radarWave: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#38BDF8',
  },
  wifiOrb: {
    backgroundColor: '#1E3A8A',
    borderWidth: 2.5,
    borderColor: '#38BDF8',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 18,
    elevation: 8,
  },
  wifiIcon: {
    textAlign: 'center',
  },
  gridHalo: {
    position: 'absolute',
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
    borderRadius: 9999,
  },
  chainWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chainLink1: {
    width: 72,
    height: 44,
    borderRadius: 22,
    borderWidth: 9,
    borderColor: '#38BDF8',
    backgroundColor: 'transparent',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
    marginRight: -18,
  },
  chainLink2: {
    width: 72,
    height: 44,
    borderRadius: 22,
    borderWidth: 9,
    borderColor: '#2563EB',
    backgroundColor: 'transparent',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  chainInnerHole: {
    flex: 1,
  },
  chainSparkle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    top: 6,
    right: 28,
  },
  dangerHalo: {
    position: 'absolute',
    backgroundColor: 'rgba(239, 68, 68, 0.16)',
  },
  prismTriangle: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 2.5,
    borderColor: '#EF4444',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.7,
    shadowRadius: 16,
    elevation: 8,
  },
  dangerIcon: {
    textAlign: 'center',
  },
  qrCube: {
    backgroundColor: 'rgba(30, 58, 138, 0.75)',
    borderWidth: 2,
    borderColor: '#38BDF8',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 14,
    elevation: 6,
    overflow: 'hidden',
  },
  qrIconText: {
    color: '#38BDF8',
  },
  cyanScanBeam: {
    position: 'absolute',
    height: 3,
    backgroundColor: '#38BDF8',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 5,
  },
  safeHalo: {
    position: 'absolute',
    backgroundColor: 'rgba(16, 185, 129, 0.18)',
  },
  safeBadge: {
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 14,
    elevation: 8,
  },
  safeIconText: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  phoneFrame: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    borderWidth: 2.5,
    borderColor: '#38BDF8',
    padding: 6,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 8,
  },
  phoneScreen: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  phoneLockIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  phonePulseBar: {
    width: '60%',
    height: 4,
    borderRadius: 2,
    backgroundColor: '#38BDF8',
  },
});
