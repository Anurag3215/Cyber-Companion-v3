import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Platform,
  Easing,
  TouchableOpacity,
  PanResponder,
  GestureResponderEvent,
} from 'react-native';
import * as THREE from 'three';

interface Cyber3DShieldCoreProps {
  score: number;
  potentialScore?: number;
  fixesCount?: number;
  isDark?: boolean;
  isScanning?: boolean;
  onTriggerScan?: () => void;
}

export const Cyber3DShieldCore: React.FC<Cyber3DShieldCoreProps> = ({
  score = 78,
  potentialScore = 92,
  fixesCount = 3,
  isDark = true,
  isScanning = false,
  onTriggerScan,
}) => {
  // Existing color combination mappings
  const primaryTeal = isDark ? '#2DD4BF' : '#0D9488';
  const accentBorder = isDark ? '#334155' : '#E2E8F0';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const subtextColor = isDark ? '#94A3B8' : '#64748B';
  const containerBg = isDark ? '#090D16' : '#FFFFFF';
  const cardBg = isDark ? '#1E293B' : '#F8FAFC';

  // Dynamic score state color from existing palette
  const statusColor =
    score >= 80 ? '#10B981' : score >= 70 ? '#0D9488' : score >= 50 ? '#F59E0B' : '#EF4444';
  const statusBg =
    score >= 80 ? '#064E3B' : score >= 70 ? '#064E3B' : score >= 50 ? '#78350F' : '#881337';
  const statusLabel =
    score >= 85 ? 'OPTIMAL' : score >= 70 ? 'PROTECTED' : score >= 50 ? 'MODERATE' : 'AT RISK';

  // Native 3D Animation Values
  const spinY = useRef(new Animated.Value(0)).current;
  const spinX = useRef(new Animated.Value(0)).current;
  const spinZ = useRef(new Animated.Value(0)).current;
  const pulseCore = useRef(new Animated.Value(1)).current;
  const scanSweep = useRef(new Animated.Value(0)).current;
  const tiltX = useRef(new Animated.Value(0)).current;
  const tiltY = useRef(new Animated.Value(0)).current;

  // Web Three.js canvas ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Loop native 3D rotations for silky 60fps performance
  useEffect(() => {
    const duration = isScanning ? 4000 : 12000;

    const loopY = Animated.loop(
      Animated.timing(spinY, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: Platform.OS !== 'web',
      })
    );

    const loopX = Animated.loop(
      Animated.timing(spinX, {
        toValue: 1,
        duration: duration * 1.5,
        easing: Easing.linear,
        useNativeDriver: Platform.OS !== 'web',
      })
    );

    const loopZ = Animated.loop(
      Animated.timing(spinZ, {
        toValue: 1,
        duration: duration * 1.2,
        easing: Easing.linear,
        useNativeDriver: Platform.OS !== 'web',
      })
    );

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseCore, {
          toValue: 1.08,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(pulseCore, {
          toValue: 0.94,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );

    loopY.start();
    loopX.start();
    loopZ.start();
    pulse.start();

    return () => {
      loopY.stop();
      loopX.stop();
      loopZ.stop();
      pulse.stop();
    };
  }, [isScanning]);

  // Scanning sweep pulse
  useEffect(() => {
    if (isScanning) {
      scanSweep.setValue(0);
      Animated.loop(
        Animated.timing(scanSweep, {
          toValue: 1,
          duration: 1500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        })
      ).start();
    } else {
      scanSweep.setValue(0);
    }
  }, [isScanning]);

  // Three.js interactive 3D rendering for Web
  useEffect(() => {
    if (Platform.OS !== 'web' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const width = 280;
    const height = 280;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5.2;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // Outer Geodesic Icosahedron Wireframe
    const hexColor = parseInt(statusColor.replace('#', '0x'), 16);
    const icoGeo = new THREE.IcosahedronGeometry(1.65, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: hexColor,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.45 : 0.6,
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    scene.add(icoMesh);

    // Inner Glowing Core (Octahedron)
    const innerGeo = new THREE.OctahedronGeometry(0.85, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x2dd4bf : 0x0d9488,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerMesh);

    // 3D Orbital Gyroscope Ring 1 (Horizontal / Equatorial)
    const ring1Geo = new THREE.TorusGeometry(2.1, 0.02, 8, 64);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x38bdf8 : 0x0284c7,
      transparent: true,
      opacity: 0.5,
    });
    const ring1Mesh = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1Mesh.rotation.x = Math.PI / 2.3;
    scene.add(ring1Mesh);

    // 3D Orbital Gyroscope Ring 2 (Polar Gimbal)
    const ring2Geo = new THREE.TorusGeometry(2.25, 0.02, 8, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: hexColor,
      transparent: true,
      opacity: 0.45,
    });
    const ring2Mesh = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2Mesh.rotation.y = Math.PI / 3;
    scene.add(ring2Mesh);

    // Orbiting Satellite Defense Nodes
    const satelliteCount = 4;
    const satellites: THREE.Mesh[] = [];
    const satGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const satMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
    });

    for (let i = 0; i < satelliteCount; i++) {
      const sat = new THREE.Mesh(satGeo, satMat);
      scene.add(sat);
      satellites.push(sat);
    }

    // Floating Particles / Cyber Dust
    const particleCount = 28;
    const partGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 4.5;
      positions[i + 1] = (Math.random() - 0.5) * 4.5;
      positions[i + 2] = (Math.random() - 0.5) * 4.5;
    }
    partGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const partMat = new THREE.PointsMaterial({
      color: isDark ? 0x94a3b8 : 0x64748b,
      size: 0.045,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(partGeo, partMat);
    scene.add(particles);

    // Mouse tilt tracking
    let targetRotX = 0;
    let targetRotY = 0;
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / height) * 2 - 1);
      targetRotX = y * 0.4;
      targetRotY = x * 0.4;
    };
    canvas.addEventListener('mousemove', onMouseMove);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const speedMult = isScanning ? 3.0 : 1.0;

      // Rotate Outer & Inner Meshes
      icoMesh.rotation.y += 0.007 * speedMult;
      icoMesh.rotation.x += 0.004 * speedMult;

      innerMesh.rotation.y -= 0.012 * speedMult;
      innerMesh.rotation.z += 0.008 * speedMult;

      // Gyroscope Counter-rotation
      ring1Mesh.rotation.z += 0.009 * speedMult;
      ring2Mesh.rotation.x -= 0.007 * speedMult;

      // Orbiting satellites
      satellites.forEach((sat, idx) => {
        const angle = elapsedTime * 1.2 * speedMult + (idx * Math.PI * 2) / satelliteCount;
        sat.position.x = Math.cos(angle) * 2.1;
        sat.position.y = Math.sin(angle * 0.8) * 0.6;
        sat.position.z = Math.sin(angle) * 2.1;
      });

      // Smooth tilt dampening toward pointer
      scene.rotation.x += (targetRotX - scene.rotation.x) * 0.06;
      scene.rotation.y += (targetRotY - scene.rotation.y) * 0.06;

      // Pulse inner core scale
      const pulseScale = 1.0 + Math.sin(elapsedTime * 2.5) * 0.08;
      innerMesh.scale.set(pulseScale, pulseScale, pulseScale);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousemove', onMouseMove);
      renderer.dispose();
      icoGeo.dispose();
      icoMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      satGeo.dispose();
      satMat.dispose();
      partGeo.dispose();
      partMat.dispose();
    };
  }, [isDark, statusColor, isScanning]);

  // Touch gesture responder for Native 3D tilting
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_e: GestureResponderEvent, gestureState) => {
        const dx = Math.max(-25, Math.min(25, gestureState.dx / 4));
        const dy = Math.max(-25, Math.min(25, -gestureState.dy / 4));
        tiltY.setValue(dx);
        tiltX.setValue(dy);
      },
      onPanResponderRelease: () => {
        Animated.parallel([
          Animated.spring(tiltX, {
            toValue: 0,
            friction: 6,
            tension: 40,
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.spring(tiltY, {
            toValue: 0,
            friction: 6,
            tension: 40,
            useNativeDriver: Platform.OS !== 'web',
          }),
        ]).start();
      },
    })
  ).current;

  // Native rotation interpolations
  const rotateYInterpolation = spinY.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const rotateXInterpolation = spinX.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const rotateZInterpolation = spinZ.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'],
  });

  const tiltXInterpolation = tiltX.interpolate({
    inputRange: [-25, 25],
    outputRange: ['-20deg', '20deg'],
  });

  const tiltYInterpolation = tiltY.interpolate({
    inputRange: [-25, 25],
    outputRange: ['-20deg', '20deg'],
  });

  const scanScale = scanSweep.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 2.0],
  });

  const scanOpacity = scanSweep.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0.9, 0.5, 0],
  });

  return (
    <View style={styles.outerContainer}>
      {/* 3D Viewport Area */}
      <View style={styles.viewport} {...panResponder.panHandlers}>
        {/* WebGL Three.js on Web */}
        {Platform.OS === 'web' ? (
          <View style={styles.canvasWrapper}>
            <canvas
              ref={canvasRef as any}
              style={{
                width: 280,
                height: 280,
                display: 'block',
                cursor: 'grab',
              }}
            />
          </View>
        ) : (
          /* Native 3D Hardware Accelerated Gyroscope Elements */
          <Animated.View
            style={[
              styles.native3DStage,
              {
                transform: [
                  { perspective: 1000 },
                  { rotateX: tiltXInterpolation },
                  { rotateY: tiltYInterpolation },
                ],
              },
            ]}
          >
            {/* 3D Ring 1 - Equatorial Rotation */}
            <Animated.View
              style={[
                styles.nativeRing1,
                {
                  borderColor: primaryTeal,
                  transform: [{ rotateY: rotateYInterpolation }, { rotateX: '65deg' }],
                },
              ]}
            >
              <View style={[styles.orbitalNode, { backgroundColor: primaryTeal }]} />
            </Animated.View>

            {/* 3D Ring 2 - Polar Gimbal Counter-Rotation */}
            <Animated.View
              style={[
                styles.nativeRing2,
                {
                  borderColor: statusColor,
                  transform: [{ rotateZ: rotateZInterpolation }, { rotateY: '50deg' }],
                },
              ]}
            >
              <View style={[styles.orbitalNode, { backgroundColor: statusColor }]} />
            </Animated.View>

            {/* 3D Ring 3 - Outer Gyroscope */}
            <Animated.View
              style={[
                styles.nativeRing3,
                {
                  borderColor: isDark ? '#38BDF8' : '#0284C7',
                  transform: [{ rotateX: rotateXInterpolation }],
                },
              ]}
            />
          </Animated.View>
        )}

        {/* Dynamic Scanning Wave */}
        {isScanning && (
          <Animated.View
            style={[
              styles.scanningWave,
              {
                borderColor: statusColor,
                opacity: scanOpacity,
                transform: [{ scale: scanScale }],
              },
            ]}
          />
        )}

        {/* Central Floating 3D Score Core */}
        <Animated.View
          style={[
            styles.floatingCoreCard,
            {
              backgroundColor: isDark ? 'rgba(15, 23, 42, 0.88)' : 'rgba(255, 255, 255, 0.92)',
              borderColor: statusColor,
              transform: [{ scale: pulseCore }],
            },
          ]}
        >
          <Text style={[styles.scoreValue, { color: textColor }]}>{Math.round(score)}</Text>
          <Text style={[styles.scoreScale, { color: subtextColor }]}>/100</Text>

          <View style={[styles.statusBadge, { backgroundColor: statusBg, borderColor: statusColor }]}>
            <Text style={[styles.statusBadgeText, { color: isDark ? '#F8FAFC' : '#FFFFFF' }]}>
              {statusLabel}
            </Text>
          </View>
        </Animated.View>
      </View>

      {/* Uplift telemetry sub-bar */}
      {fixesCount > 0 && potentialScore > score && (
        <TouchableOpacity
          style={[
            styles.upliftBar,
            { backgroundColor: cardBg, borderColor: accentBorder },
          ]}
          onPress={onTriggerScan}
          activeOpacity={0.8}
        >
          <View style={styles.upliftDot} />
          <Text style={[styles.upliftText, { color: subtextColor }]}>
            <Text style={{ fontWeight: '700', color: primaryTeal }}>
              +{potentialScore - score} pts possible:
            </Text>{' '}
            {fixesCount} security recommendations
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  viewport: {
    width: 280,
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  canvasWrapper: {
    width: 280,
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
  },
  native3DStage: {
    width: 260,
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  nativeRing1: {
    position: 'absolute',
    width: 230,
    height: 230,
    borderRadius: 115,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  nativeRing2: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
    borderWidth: 2,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  nativeRing3: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 1,
    borderStyle: 'dotted',
  },
  orbitalNode: {
    width: 10,
    height: 10,
    borderRadius: 5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  scanningWave: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 3,
  },
  floatingCoreCard: {
    position: 'absolute',
    width: 136,
    height: 136,
    borderRadius: 68,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  scoreValue: {
    fontSize: 44,
    fontWeight: '900',
    letterSpacing: -1.5,
    lineHeight: 46,
  },
  scoreScale: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: -2,
    letterSpacing: 0.5,
  },
  statusBadge: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  upliftBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  upliftDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  upliftText: {
    fontSize: 12,
  },
});
