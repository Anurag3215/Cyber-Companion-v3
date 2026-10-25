import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GlassTokens } from './glassTokens';

export interface IconTileProps {
  glyph: string;
  size?: number;
  tone?: 'teal' | 'blue';
  isDark?: boolean;
}

/**
 * Consistent soft "glass tile" container for feature glyphs. Uses a layered
 * highlight instead of an image so it costs nothing at runtime. The glyph is a
 * text symbol today; swap for optimized 3D PNG/WebP assets via `glyph` later.
 */
export const IconTile: React.FC<IconTileProps> = ({
  glyph,
  size = 48,
  tone = 'teal',
  isDark = false,
}) => {
  const theme = isDark ? GlassTokens.colors.dark : GlassTokens.colors.light;
  const base = tone === 'teal' ? theme.primaryGlass : theme.blueGlass;
  const rim = tone === 'teal' ? theme.primary : theme.blue;
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.tile,
        {
          width: size,
          height: size,
          borderRadius: size * 0.32,
          backgroundColor: base,
          borderColor: rim + '55',
        },
      ]}
    >
      <View
        pointerEvents="none"
        style={[
          styles.sheen,
          {
            borderTopLeftRadius: size * 0.32,
            borderTopRightRadius: size * 0.32,
            height: size * 0.5,
            backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.55)',
          },
        ]}
      />
      <Text style={{ fontSize: size * 0.46 }}>{glyph}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tile: { alignItems: 'center', justifyContent: 'center', borderWidth: 1, overflow: 'hidden' },
  sheen: { position: 'absolute', top: 0, left: 0, right: 0 },
});
