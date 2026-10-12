import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Platform,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
} from 'react-native';

interface TiltCard3DProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  isDark?: boolean;
  activeBorderColor?: string;
}

export const TiltCard3D: React.FC<TiltCard3DProps> = ({
  children,
  style,
  onPress,
  isDark = true,
  activeBorderColor,
}) => {
  const tiltX = useRef(new Animated.Value(0)).current;
  const tiltY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const [isHovered, setIsHovered] = useState(false);

  // Default color palette
  const cardBg = isDark ? '#1E293B' : '#FFFFFF';
  const defaultBorder = isDark ? '#334155' : '#F1F5F9';
  const borderColor = activeBorderColor || (isHovered ? (isDark ? '#2DD4BF' : '#0D9488') : defaultBorder);

  // Web Mouse Hover & Tilt Logic
  const handleMouseMove = (e: any) => {
    if (Platform.OS !== 'web') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * 10;
    const rotY = ((x - centerX) / centerX) * 10;

    Animated.parallel([
      Animated.timing(tiltX, {
        toValue: rotX,
        duration: 80,
        useNativeDriver: false,
      }),
      Animated.timing(tiltY, {
        toValue: rotY,
        duration: 80,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    Animated.spring(scale, {
      toValue: 1.025,
      friction: 7,
      tension: 50,
      useNativeDriver: false,
    }).start();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    Animated.parallel([
      Animated.spring(tiltX, {
        toValue: 0,
        friction: 6,
        tension: 40,
        useNativeDriver: false,
      }),
      Animated.spring(tiltY, {
        toValue: 0,
        friction: 6,
        tension: 40,
        useNativeDriver: false,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: false,
      }),
    ]).start();
  };

  // Mobile Press In / Out Handlers
  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 0.97,
        friction: 8,
        tension: 60,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.spring(tiltX, {
        toValue: 4,
        friction: 8,
        tension: 60,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 7,
        tension: 50,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.spring(tiltX, {
        toValue: 0,
        friction: 7,
        tension: 50,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();
  };

  const rotXString = tiltX.interpolate({
    inputRange: [-20, 20],
    outputRange: ['-20deg', '20deg'],
  });

  const rotYString = tiltY.interpolate({
    inputRange: [-20, 20],
    outputRange: ['-20deg', '20deg'],
  });

  const webEvents =
    Platform.OS === 'web'
      ? {
          onMouseMove: handleMouseMove,
          onMouseEnter: handleMouseEnter,
          onMouseLeave: handleMouseLeave,
        }
      : {};

  return (
    <Animated.View
      style={[
        styles.perspectiveContainer,
        {
          transform: [
            { perspective: 900 },
            { rotateX: rotXString },
            { rotateY: rotYString },
            { scale },
          ],
        },
      ]}
      {...(webEvents as any)}
    >
      <TouchableOpacity
        style={[
          styles.cardBase,
          {
            backgroundColor: cardBg,
            borderColor,
          },
          style,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.88}
      >
        {/* Subtle Specular Glow when hovered */}
        {isHovered && <View style={styles.hoverGlow} />}
        <View style={styles.innerLayer}>{children}</View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  perspectiveContainer: {
    marginVertical: 4,
  },
  cardBase: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 16,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  hoverGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#2DD4BF',
    opacity: 0.8,
  },
  innerLayer: {
    position: 'relative',
    zIndex: 2,
  },
});
