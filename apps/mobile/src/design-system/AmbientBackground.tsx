import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Dimensions } from 'react-native';
import { GlassTokens } from './glassTokens';

interface AmbientBackgroundProps {
  isDark?: boolean;
  children?: React.ReactNode;
}

const { width, height } = Dimensions.get('window');

export const AmbientBackground: React.FC<AmbientBackgroundProps> = ({
  isDark = false,
  children,
}) => {
  const theme = isDark ? GlassTokens.colors.dark : GlassTokens.colors.light;

  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop1 = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim1, {
          toValue: 1,
          duration: 9000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim1, {
          toValue: 0,
          duration: 9000,
          useNativeDriver: true,
        }),
      ])
    );

    const loop2 = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim2, {
          toValue: 1,
          duration: 12000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim2, {
          toValue: 0,
          duration: 12000,
          useNativeDriver: true,
        }),
      ])
    );

    loop1.start();
    loop2.start();

    return () => {
      loop1.stop();
      loop2.stop();
    };
  }, [floatAnim1, floatAnim2]);

  const translateY1 = floatAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 30],
  });

  const translateX1 = floatAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const translateY2 = floatAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -25],
  });

  const translateX2 = floatAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 25],
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Background Ambient Glowing Orbs */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {/* Orb 1: Mint Glow (Top Right) */}
        <Animated.View
          style={[
            styles.orb,
            {
              width: width * 0.75,
              height: width * 0.75,
              top: -width * 0.15,
              right: -width * 0.15,
              backgroundColor: theme.orb1,
              opacity: isDark ? 0.35 : 0.45,
              transform: [{ translateY: translateY1 }, { translateX: translateX1 }],
            },
          ]}
        />

        {/* Orb 2: Soft Sky / Cyan Glow (Center Left) */}
        <Animated.View
          style={[
            styles.orb,
            {
              width: width * 0.85,
              height: width * 0.85,
              top: height * 0.28,
              left: -width * 0.25,
              backgroundColor: theme.orb2,
              opacity: isDark ? 0.25 : 0.4,
              transform: [{ translateY: translateY2 }, { translateX: translateX2 }],
            },
          ]}
        />

        {/* Orb 3: Lavender / Mint Ambient (Bottom Center) */}
        <View
          style={[
            styles.orb,
            {
              width: width * 0.9,
              height: width * 0.9,
              bottom: -width * 0.2,
              alignSelf: 'center',
              backgroundColor: theme.orb3,
              opacity: isDark ? 0.2 : 0.35,
            },
          ]}
        />
      </View>

      {/* Foreground Content */}
      <View style={styles.contentWrap}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  orb: {
    position: 'absolute',
    borderRadius: 9999,
  },
  contentWrap: {
    flex: 1,
  },
});
