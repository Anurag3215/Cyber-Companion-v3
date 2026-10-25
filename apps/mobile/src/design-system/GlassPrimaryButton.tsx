import React, { useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  TouchableWithoutFeedback,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { GlassTokens } from './glassTokens';

export interface GlassPrimaryButtonProps {
  title: string;
  onPress: () => void;
  icon?: string;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'glass' | 'danger';
  isDark?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'normal' | 'large' | 'compact';
}

export const GlassPrimaryButton: React.FC<GlassPrimaryButtonProps> = ({
  title,
  onPress,
  icon,
  loading = false,
  disabled = false,
  variant = 'primary',
  isDark = false,
  style,
  textStyle,
  size = 'normal',
}) => {
  const theme = isDark ? GlassTokens.colors.dark : GlassTokens.colors.light;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled || loading) return;
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      friction: 8,
      tension: 120,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled || loading) return;
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 120,
    }).start();
  };

  // Variant Styling
  let bg = theme.primary;
  let borderColor = theme.primaryDark;
  let textColor = '#FFFFFF';
  let shadow = GlassTokens.shadows.glow;

  if (variant === 'glass') {
    bg = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.85)';
    borderColor = theme.glassBorder;
    textColor = theme.textPrimary;
    shadow = GlassTokens.shadows.soft;
  } else if (variant === 'danger') {
    bg = theme.red;
    borderColor = isDark ? '#B91C1C' : '#991B1B';
    textColor = '#FFFFFF';
    shadow = GlassTokens.shadows.soft;
  }

  const verticalPadding = size === 'large' ? 18 : size === 'compact' ? 10 : 14;
  const horizontalPadding = size === 'large' ? 28 : size === 'compact' ? 16 : 22;
  const fontSize = size === 'large' ? 16 : size === 'compact' ? 13 : 15;

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
    >
      <Animated.View
        style={[
          styles.container,
          shadow,
          {
            backgroundColor: bg,
            borderColor,
            paddingVertical: verticalPadding,
            paddingHorizontal: horizontalPadding,
            opacity: disabled ? 0.6 : 1,
            transform: [{ scale: scaleAnim }],
          },
          style,
        ]}
      >
        {/* Specular Top Rim Light */}
        <View
          style={[
            styles.specularRim,
            {
              borderTopColor:
                variant === 'primary' ? 'rgba(255, 255, 255, 0.45)' : theme.glassHighlight,
            },
          ]}
          pointerEvents="none"
        />

        {loading ? (
          <ActivityIndicator size="small" color={textColor} />
        ) : (
          <View style={styles.row}>
            {icon ? <Text style={styles.icon}>{icon}</Text> : null}
            <Text style={[styles.text, { color: textColor, fontSize }, textStyle]}>
              {title}
            </Text>
          </View>
        )}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: GlassTokens.radii.full,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  specularRim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1.2,
    borderRadius: GlassTokens.radii.full,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  icon: {
    fontSize: 18,
  },
  text: {
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});
