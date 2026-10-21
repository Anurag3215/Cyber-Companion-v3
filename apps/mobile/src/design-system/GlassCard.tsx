import React, { useRef } from 'react';
import {
  StyleSheet,
  View,
  ViewStyle,
  Animated,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { GlassTokens } from './glassTokens';

export interface GlassCardProps {
  children?: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  isDark?: boolean;
  onPress?: () => void;
  interactive?: boolean;
  elevation?: 'soft' | 'floating' | 'none';
  borderRadius?: number;
  intensity?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  isDark = false,
  onPress,
  interactive = false,
  elevation = 'soft',
  borderRadius = GlassTokens.radii.lg,
  intensity = 50,
}) => {
  const theme = isDark ? GlassTokens.colors.dark : GlassTokens.colors.light;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (!interactive && !onPress) return;
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      friction: 8,
      tension: 100,
    }).start();
  };

  const handlePressOut = () => {
    if (!interactive && !onPress) return;
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 100,
    }).start();
  };

  const shadowStyle =
    elevation === 'floating'
      ? GlassTokens.shadows.floating
      : elevation === 'soft'
      ? GlassTokens.shadows.soft
      : {};

  const cardContent = (
    <Animated.View
      style={[
        styles.outerContainer,
        {
          borderRadius,
          transform: [{ scale: scaleAnim }],
        },
        shadowStyle,
        style,
      ]}
    >
      <View
        style={[
          styles.glassWrapper,
          {
            borderRadius,
            backgroundColor: theme.glassBg,
            borderColor: theme.glassBorder,
            borderTopColor: theme.glassHighlight,
          },
        ]}
      >
        {Platform.OS !== 'web' ? (
          <BlurView
            intensity={intensity}
            tint={isDark ? 'dark' : 'light'}
            style={[StyleSheet.absoluteFill, { borderRadius }]}
          />
        ) : null}

        {/* Specular Top Reflection Rim Light */}
        <View
          style={[
            styles.specularRim,
            {
              borderTopColor: theme.glassHighlight,
              borderRadius,
            },
          ]}
          pointerEvents="none"
        />

        {/* Inner Content */}
        <View style={styles.inner}>{children}</View>
      </View>
    </Animated.View>
  );

  if (onPress || interactive) {
    return (
      <TouchableWithoutFeedback
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {cardContent}
      </TouchableWithoutFeedback>
    );
  }

  return cardContent;
};

const styles = StyleSheet.create({
  outerContainer: {
    marginVertical: 4,
  },
  glassWrapper: {
    overflow: 'hidden',
    borderWidth: 1.2,
    position: 'relative',
  },
  specularRim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1.5,
    opacity: 0.9,
  },
  inner: {
    position: 'relative',
    zIndex: 1,
  },
});
