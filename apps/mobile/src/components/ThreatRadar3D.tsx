import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Easing,
  Platform,
  TouchableOpacity,
} from 'react-native';

interface ThreatRadar3DProps {
  isDark?: boolean;
  onSelectSector?: (sector: string) => void;
}

export const ThreatRadar3D: React.FC<ThreatRadar3DProps> = ({
  isDark = true,
  onSelectSector,
}) => {
  const sweepAngle = useRef(new Animated.Value(0)).current;
  const pulseWave = useRef(new Animated.Value(0.4)).current;

  const bg = isDark ? '#1E293B' : '#F8FAFC';
  const borderCol = isDark ? '#334155' : '#E2E8F0';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const subtextColor = isDark ? '#94A3B8' : '#64748B';
  const radarGreen = '#10B981';
  const radarTeal = isDark ? '#2DD4BF' : '#0D9488';
  const radarSky = isDark ? '#38BDF8' : '#0284C7';

  useEffect(() => {
    const sweep = Animated.loop(
      Animated.timing(sweepAngle, {
        toValue: 1,
        duration: 5000,
        easing: Easing.linear,
        useNativeDriver: Platform.OS !== 'web',
      })
    );

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseWave, {
          toValue: 1,
          duration: 2000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(pulseWave, {
          toValue: 0.4,
          duration: 2000,
          easing: Easing.in(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );

    sweep.start();
    pulse.start();

    return () => {
      sweep.stop();
      pulse.stop();
    };
  }, []);

  const sweepRotation = sweepAngle.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { backgroundColor: bg, borderColor: borderCol }]}>
      {/* Header Info */}
      <View style={styles.headerRow}>
        <View style={styles.titleWithDot}>
          <View style={[styles.liveIndicator, { backgroundColor: radarGreen }]} />
          <Text style={[styles.titleText, { color: textColor }]}>3D Defense Radar</Text>
        </View>
        <View style={[styles.badge, { borderColor: radarTeal }]}>
          <Text style={[styles.badgeText, { color: radarTeal }]}>4/4 ARMED</Text>
        </View>
      </View>

      <Text style={[styles.subtitleText, { color: subtextColor }]}>
        Continuous on-device threat perimeter monitoring
      </Text>

      {/* 3D Tilted Perspective Radar Disc */}
      <View style={styles.radarViewport}>
        <Animated.View
          style={[
            styles.radarDisc,
            {
              borderColor: borderCol,
              transform: [{ perspective: 700 }, { rotateX: '52deg' }],
            },
          ]}
        >
          {/* Concentric rings */}
          <View style={[styles.ringOuter, { borderColor: borderCol }]} />
          <View style={[styles.ringMid, { borderColor: borderCol }]} />
          <View style={[styles.ringInner, { borderColor: borderCol }]} />

          {/* Crosshairs */}
          <View style={[styles.axisH, { backgroundColor: borderCol }]} />
          <View style={[styles.axisV, { backgroundColor: borderCol }]} />

          {/* Rotating Sweep Beam */}
          <Animated.View
            style={[
              styles.sweepLine,
              {
                backgroundColor: radarTeal,
                transform: [{ rotate: sweepRotation }],
              },
            ]}
          />

          {/* Sector 1 Blip: Wi-Fi Sentinel (Top-Left) */}
          <TouchableOpacity
            style={[styles.blipContainer, { top: 38, left: 45 }]}
            onPress={() => onSelectSector && onSelectSector('wifi')}
          >
            <View style={[styles.blipDot, { backgroundColor: radarGreen }]} />
            <Text style={[styles.blipLabel, { color: radarGreen }]}>Wi-Fi</Text>
          </TouchableOpacity>

          {/* Sector 2 Blip: Phishing URL Guard (Top-Right) */}
          <TouchableOpacity
            style={[styles.blipContainer, { top: 44, right: 40 }]}
            onPress={() => onSelectSector && onSelectSector('url')}
          >
            <View style={[styles.blipDot, { backgroundColor: radarTeal }]} />
            <Text style={[styles.blipLabel, { color: radarTeal }]}>Links</Text>
          </TouchableOpacity>

          {/* Sector 3 Blip: Sandboxed QR Scanner (Bottom-Left) */}
          <TouchableOpacity
            style={[styles.blipContainer, { bottom: 42, left: 50 }]}
            onPress={() => onSelectSector && onSelectSector('qr')}
          >
            <View style={[styles.blipDot, { backgroundColor: radarSky }]} />
            <Text style={[styles.blipLabel, { color: radarSky }]}>QR</Text>
          </TouchableOpacity>

          {/* Sector 4 Blip: App Privacy Sentinel (Bottom-Right) */}
          <TouchableOpacity
            style={[styles.blipContainer, { bottom: 36, right: 48 }]}
            onPress={() => onSelectSector && onSelectSector('apps')}
          >
            <View style={[styles.blipDot, { backgroundColor: radarGreen }]} />
            <Text style={[styles.blipLabel, { color: radarGreen }]}>Apps</Text>
          </TouchableOpacity>

          {/* Center Nexus */}
          <View style={[styles.centerNexus, { backgroundColor: radarTeal }]} />
        </Animated.View>
      </View>

      {/* Telemetry Vectors Footer */}
      <View style={styles.footerRow}>
        <View style={styles.vectorItem}>
          <Text style={[styles.vectorVal, { color: radarGreen }]}>WPA3-SAE</Text>
          <Text style={[styles.vectorKey, { color: subtextColor }]}>Wi-Fi Crypt</Text>
        </View>
        <View style={styles.vectorDivider} />
        <View style={styles.vectorItem}>
          <Text style={[styles.vectorVal, { color: radarTeal }]}>SSRF GUARD</Text>
          <Text style={[styles.vectorKey, { color: subtextColor }]}>Link Engine</Text>
        </View>
        <View style={styles.vectorDivider} />
        <View style={styles.vectorItem}>
          <Text style={[styles.vectorVal, { color: radarSky }]}>SANDBOXED</Text>
          <Text style={[styles.vectorKey, { color: subtextColor }]}>QR Parser</Text>
        </View>
        <View style={styles.vectorDivider} />
        <View style={styles.vectorItem}>
          <Text style={[styles.vectorVal, { color: radarGreen }]}>0 PII LEAK</Text>
          <Text style={[styles.vectorKey, { color: subtextColor }]}>App Privacy</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginVertical: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  titleWithDot: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  titleText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  subtitleText: {
    fontSize: 12,
    marginBottom: 8,
  },
  radarViewport: {
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarDisc: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
  },
  ringOuter: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  ringMid: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1,
  },
  ringInner: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1,
    borderStyle: 'dotted',
  },
  axisH: {
    position: 'absolute',
    width: 216,
    height: 1,
  },
  axisV: {
    position: 'absolute',
    width: 1,
    height: 216,
  },
  sweepLine: {
    position: 'absolute',
    width: 100,
    height: 2,
    top: 109,
    left: 110,
    transformOrigin: '0% 50%',
    opacity: 0.7,
  },
  centerNexus: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  blipContainer: {
    position: 'absolute',
    alignItems: 'center',
    padding: 4,
  },
  blipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 5,
    elevation: 3,
  },
  blipLabel: {
    fontSize: 9,
    fontWeight: '800',
    marginTop: 2,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.15)',
  },
  vectorItem: {
    flex: 1,
    alignItems: 'center',
  },
  vectorVal: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  vectorKey: {
    fontSize: 9,
    marginTop: 1,
  },
  vectorDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
  },
});
