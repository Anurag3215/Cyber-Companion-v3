export const GlassTokens = {
  colors: {
    // Light Mode (Apple Liquid Glass: Soft white, pale mint, subtle ambient reflections)
    light: {
      background: '#F4FBF7',
      backgroundGradient: ['#F0FDF4', '#F4FBF7', '#E6F4EA'],
      glassBg: 'rgba(255, 255, 255, 0.72)',
      glassElevated: 'rgba(255, 255, 255, 0.88)',
      glassPressed: 'rgba(255, 255, 255, 0.95)',
      glassFloatingNav: 'rgba(255, 255, 255, 0.82)',
      glassBorder: 'rgba(255, 255, 255, 0.75)',
      glassHighlight: 'rgba(255, 255, 255, 0.95)',
      glassInnerShadow: 'rgba(255, 255, 255, 0.4)',
      
      textPrimary: '#0F172A',
      textSecondary: '#475569',
      textMuted: '#94A3B8',

      // Deep emerald / forest green accents for positive security states and primary actions
      primary: '#059669',
      primaryDark: '#047857',
      primaryLight: '#D1FAE5',
      primaryGlass: 'rgba(5, 150, 105, 0.12)',
      primaryGlow: 'rgba(16, 185, 129, 0.25)',

      // Warning and Danger accents
      amber: '#D97706',
      amberBg: 'rgba(245, 158, 11, 0.12)',
      amberBorder: 'rgba(245, 158, 11, 0.3)',
      red: '#DC2626',
      redBg: 'rgba(239, 68, 68, 0.12)',
      redBorder: 'rgba(239, 68, 68, 0.3)',

      // Ambient Orbs
      orb1: '#A7F3D0',
      orb2: '#BAE6FD',
      orb3: '#E0E7FF',
    },

    // Dark Mode (Deep Cyber Obsidian Glass: translucent dark glass with subtle neon specular rim)
    dark: {
      background: '#090D16',
      backgroundGradient: ['#090D16', '#0F172A', '#060B12'],
      glassBg: 'rgba(15, 23, 42, 0.68)',
      glassElevated: 'rgba(30, 41, 59, 0.78)',
      glassPressed: 'rgba(51, 65, 85, 0.85)',
      glassFloatingNav: 'rgba(15, 23, 42, 0.84)',
      glassBorder: 'rgba(255, 255, 255, 0.14)',
      glassHighlight: 'rgba(255, 255, 255, 0.24)',
      glassInnerShadow: 'rgba(255, 255, 255, 0.05)',

      textPrimary: '#F8FAFC',
      textSecondary: '#94A3B8',
      textMuted: '#64748B',

      // Deep emerald / cyber teal
      primary: '#10B981',
      primaryDark: '#059669',
      primaryLight: '#064E3B',
      primaryGlass: 'rgba(16, 185, 129, 0.16)',
      primaryGlow: 'rgba(16, 185, 129, 0.35)',

      // Warning and Danger accents
      amber: '#F59E0B',
      amberBg: 'rgba(245, 158, 11, 0.15)',
      amberBorder: 'rgba(245, 158, 11, 0.35)',
      red: '#EF4444',
      redBg: 'rgba(239, 68, 68, 0.16)',
      redBorder: 'rgba(239, 68, 68, 0.4)',

      // Ambient Orbs
      orb1: '#064E3B',
      orb2: '#0C4A6E',
      orb3: '#1E1B4B',
    },
  },

  radii: {
    xs: 8,
    sm: 12,
    md: 18,
    lg: 24,
    xl: 32,
    nav: 36,
    full: 9999,
  },

  shadows: {
    soft: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.06,
      shadowRadius: 16,
      elevation: 2,
    },
    floating: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.12,
      shadowRadius: 28,
      elevation: 6,
    },
    glow: {
      shadowColor: '#10B981',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 14,
      elevation: 4,
    },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 28,
    xxxl: 36,
  },
};

export const glassColors = GlassTokens.colors;
export const glassRadii = GlassTokens.radii;
export const glassShadows = GlassTokens.shadows;
export const glassBorder = {
  light: {
    subtle: 'rgba(255, 255, 255, 0.75)',
    highlight: 'rgba(255, 255, 255, 0.95)',
  },
  dark: {
    subtle: 'rgba(255, 255, 255, 0.14)',
    highlight: 'rgba(255, 255, 255, 0.24)',
  },
};
