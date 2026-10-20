import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Easing,
  Platform,
} from 'react-native';
import { CyberLogo } from './CyberLogo';

interface AppIntro3DProps {
  onComplete: () => void;
  isDark?: boolean;
}

const INTRO_SLIDES = [
  {
    key: '1',
    badge: 'STAGE 01 · THREAT PERIMETER',
    title: 'Zero-Trust Cyber Sentinel',
    subtitle: 'Real-Time Dynamic Security Intelligence',
    description:
      'Continuous on-device heuristic audit protects your identity before you tap, scan, or connect. Zero user telemetry ever leaves your handset.',
    icon: '🛡️',
    stat: '100% On-Device',
  },
  {
    key: '2',
    badge: 'STAGE 02 · ZERO EXECUTION RISK',
    title: 'Sandboxed QR & Link Defense',
    subtitle: 'Deep Homoglyph & SSRF Protection',
    description:
      'Inspect deceptive Punycode links, phishing domains, and malicious QR intent payloads inside an isolated security sandbox before opening.',
    icon: '⛶',
    stat: '4/4 Intel Feeds',
  },
  {
    key: '3',
    badge: 'STAGE 03 · HARDENED PRIVACY',
    title: 'Sensor & Permission Auditor',
    subtitle: 'Pure Deterministic Scoring',
    description:
      'Eliminate background eavesdropping and sensor exfiltration with instant permission reviews and actionable one-tap security fixes.',
    icon: '⚡',
    stat: '0-100 Monotonic Score',
  },
];

export const AppIntro3D: React.FC<AppIntro3DProps> = ({ onComplete, isDark = true }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 3D Stage Animation Values
  const spinY = useRef(new Animated.Value(0)).current;
  const spinX = useRef(new Animated.Value(0)).current;
  const pulseCore = useRef(new Animated.Value(1)).current;
  const slideFade = useRef(new Animated.Value(1)).current;
  const slideTranslate = useRef(new Animated.Value(0)).current;

  const bg = isDark ? '#090D16' : '#FFFFFF';
  const cardBg = isDark ? '#1E293B' : '#F8FAFC';
  const borderCol = isDark ? '#334155' : '#E2E8F0';
  const teal = isDark ? '#2DD4BF' : '#0D9488';
  const emerald = '#10B981';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const subtextColor = isDark ? '#94A3B8' : '#64748B';

  useEffect(() => {
    const loopY = Animated.loop(
      Animated.timing(spinY, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: Platform.OS !== 'web',
      })
    );

    const loopX = Animated.loop(
      Animated.timing(spinX, {
        toValue: 1,
        duration: 12000,
        easing: Easing.linear,
        useNativeDriver: Platform.OS !== 'web',
      })
    );

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseCore, {
          toValue: 1.1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(pulseCore, {
          toValue: 0.92,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );

    loopY.start();
    loopX.start();
    pulse.start();

    return () => {
      loopY.stop();
      loopX.stop();
      pulse.stop();
    };
  }, []);

  const handleNext = () => {
    if (currentIndex < INTRO_SLIDES.length - 1) {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(slideFade, { toValue: 0, duration: 150, useNativeDriver: true }),
          Animated.timing(slideTranslate, { toValue: -20, duration: 150, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(slideFade, { toValue: 1, duration: 250, useNativeDriver: true }),
          Animated.timing(slideTranslate, { toValue: 0, duration: 250, useNativeDriver: true }),
        ]),
      ]).start();

      setCurrentIndex((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const rotY = spinY.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const rotX = spinX.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const currentSlide = INTRO_SLIDES[currentIndex];

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <CyberLogo size={36} isDark={isDark} animated={true} />
        <TouchableOpacity style={styles.skipBtn} onPress={onComplete} activeOpacity={0.7}>
          <Text style={[styles.skipText, { color: subtextColor }]}>Skip Intro</Text>
        </TouchableOpacity>
      </View>

      {/* 3D Animated Hero Stage */}
      <View style={styles.hero3DStage}>
        <Animated.View
          style={[
            styles.stageContainer,
            {
              transform: [{ perspective: 1000 }, { rotateX: '20deg' }],
            },
          ]}
        >
          {/* Outer Gyro Ring 1 */}
          <Animated.View
            style={[
              styles.gyroRing1,
              {
                borderColor: teal,
                transform: [{ rotateY: rotY }, { rotateX: '65deg' }],
              },
            ]}
          >
            <View style={[styles.gyroBeacon, { backgroundColor: teal }]} />
          </Animated.View>

          {/* Outer Gyro Ring 2 */}
          <Animated.View
            style={[
              styles.gyroRing2,
              {
                borderColor: emerald,
                transform: [{ rotateZ: rotY }, { rotateY: '50deg' }],
              },
            ]}
          >
            <View style={[styles.gyroBeacon, { backgroundColor: emerald }]} />
          </Animated.View>

          {/* Inner 3D Centerpiece Emblem */}
          <Animated.View
            style={[
              styles.centerpiece,
              {
                backgroundColor: cardBg,
                borderColor: teal,
                transform: [{ scale: pulseCore }],
              },
            ]}
          >
            <Text style={styles.centerIcon}>{currentSlide.icon}</Text>
            <View style={[styles.statPill, { borderColor: emerald }]}>
              <Text style={[styles.statText, { color: emerald }]}>{currentSlide.stat}</Text>
            </View>
          </Animated.View>
        </Animated.View>
      </View>

      {/* Slide Text Content */}
      <Animated.View
        style={[
          styles.contentSection,
          {
            opacity: slideFade,
            transform: [{ translateY: slideTranslate }],
          },
        ]}
      >
        <View style={[styles.badgePill, { borderColor: teal, backgroundColor: cardBg }]}>
          <Text style={[styles.badgeText, { color: teal }]}>{currentSlide.badge}</Text>
        </View>

        <Text style={[styles.slideTitle, { color: textColor }]}>{currentSlide.title}</Text>
        <Text style={[styles.slideSubtitle, { color: teal }]}>{currentSlide.subtitle}</Text>
        <Text style={[styles.slideDesc, { color: subtextColor }]}>
          {currentSlide.description}
        </Text>
      </Animated.View>

      {/* Footer Navigation */}
      <View style={styles.footerSection}>
        {/* Pagination Dots */}
        <View style={styles.dotsRow}>
          {INTRO_SLIDES.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                {
                  backgroundColor: idx === currentIndex ? teal : borderCol,
                  width: idx === currentIndex ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: teal }]}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.actionBtnText}>
            {currentIndex === INTRO_SLIDES.length - 1 ? 'Enter Command Center →' : 'Continue →'}
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
    paddingTop: 16,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  skipBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  skipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  hero3DStage: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 240,
  },
  stageContainer: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  gyroRing1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  gyroRing2: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 2,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  gyroBeacon: {
    width: 10,
    height: 10,
    borderRadius: 5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 4,
  },
  centerpiece: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  centerIcon: {
    fontSize: 40,
    marginBottom: 4,
  },
  statPill: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  statText: {
    fontSize: 9,
    fontWeight: '800',
  },
  contentSection: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  badgePill: {
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  slideSubtitle: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
  slideDesc: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  footerSection: {
    gap: 16,
    marginTop: 12,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  actionBtn: {
    paddingVertical: 15,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
