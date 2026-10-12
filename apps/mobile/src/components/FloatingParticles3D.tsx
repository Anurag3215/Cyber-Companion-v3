import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing, Platform } from 'react-native';

interface FloatingParticles3DProps {
  isDark?: boolean;
}

export const FloatingParticles3D: React.FC<FloatingParticles3DProps> = ({ isDark = true }) => {
  const drift1 = useRef(new Animated.Value(0)).current;
  const drift2 = useRef(new Animated.Value(0)).current;
  const drift3 = useRef(new Animated.Value(0)).current;

  const nodeColor1 = isDark ? '#2DD4BF' : '#0D9488';
  const nodeColor2 = isDark ? '#38BDF8' : '#0284C7';
  const nodeColor3 = isDark ? '#10B981' : '#0F766E';

  useEffect(() => {
    const loop1 = Animated.loop(
      Animated.sequence([
        Animated.timing(drift1, {
          toValue: 1,
          duration: 7000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(drift1, {
          toValue: 0,
          duration: 7000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );

    const loop2 = Animated.loop(
      Animated.sequence([
        Animated.timing(drift2, {
          toValue: 1,
          duration: 9000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(drift2, {
          toValue: 0,
          duration: 9000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );

    const loop3 = Animated.loop(
      Animated.sequence([
        Animated.timing(drift3, {
          toValue: 1,
          duration: 11000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(drift3, {
          toValue: 0,
          duration: 11000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );

    loop1.start();
    loop2.start();
    loop3.start();

    return () => {
      loop1.stop();
      loop2.stop();
      loop3.stop();
    };
  }, []);

  const d1Y = drift1.interpolate({ inputRange: [0, 1], outputRange: [0, -25] });
  const d1X = drift1.interpolate({ inputRange: [0, 1], outputRange: [0, 15] });

  const d2Y = drift2.interpolate({ inputRange: [0, 1], outputRange: [0, 30] });
  const d2X = drift2.interpolate({ inputRange: [0, 1], outputRange: [0, -20] });

  const d3Y = drift3.interpolate({ inputRange: [0, 1], outputRange: [0, -20] });
  const d3X = drift3.interpolate({ inputRange: [0, 1], outputRange: [0, -15] });

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Node Cluster 1 */}
      <Animated.View
        style={[
          styles.particle,
          {
            top: 60,
            left: '12%',
            backgroundColor: nodeColor1,
            transform: [{ translateY: d1Y }, { translateX: d1X }],
          },
        ]}
      />

      {/* Node Cluster 2 */}
      <Animated.View
        style={[
          styles.particle,
          {
            top: 140,
            right: '10%',
            backgroundColor: nodeColor2,
            width: 7,
            height: 7,
            borderRadius: 3.5,
            transform: [{ translateY: d2Y }, { translateX: d2X }],
          },
        ]}
      />

      {/* Node Cluster 3 */}
      <Animated.View
        style={[
          styles.particle,
          {
            top: 240,
            left: '8%',
            backgroundColor: nodeColor3,
            width: 5,
            height: 5,
            borderRadius: 2.5,
            transform: [{ translateY: d3Y }, { translateX: d3X }],
          },
        ]}
      />

      {/* Node Cluster 4 */}
      <Animated.View
        style={[
          styles.particle,
          {
            top: 340,
            right: '15%',
            backgroundColor: nodeColor1,
            width: 6,
            height: 6,
            borderRadius: 3,
            transform: [{ translateY: d1Y }, { translateX: d2X }],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    zIndex: 0,
  },
  particle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.35,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 2,
  },
});
