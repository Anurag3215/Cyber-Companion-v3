/**
 * Cyber Companion glass tokens — teal / trust-blue / soft-white identity.
 *
 * Brand colours (spec): teal #0D9488, trust blue #3B82F6, light bg #F4F8FC,
 * navy #10243E, dark bg #0B1220, secondary text #64748B, border #DCE6F0.
 * Semantic colours are reserved for security meaning only:
 *   safe #15803D · warning #B45309 · danger #B91C1C · info #1D4ED8.
 *
 * Contrast notes (WCAG AA, 4.5:1 for normal text):
 *  - #0D9488 on white is ~3.7:1, so it is used for rings/icons/fills.
 *    Teal TEXT and button fills use `primaryText` / `primaryDark` (#0F766E, ~5.5:1).
 *  - Semantic colours on dark navy are too dim at their light-mode values, so
 *    dark mode uses lighter tints of the same hues.
 */
export const GlassTokens = {
  colors: {
    light: {
      background: '#F4F8FC',
      backgroundGradient: ['#EAF3FB', '#F4F8FC', '#E8F5F4'],
      glassBg: 'rgba(255, 255, 255, 0.74)',
      glassElevated: 'rgba(255, 255, 255, 0.90)',
      glassPressed: 'rgba(255, 255, 255, 0.96)',
      glassFloatingNav: 'rgba(255, 255, 255, 0.86)',
      glassBorder: 'rgba(220, 230, 240, 0.95)',
      glassHighlight: 'rgba(255, 255, 255, 0.98)',
      glassInnerShadow: 'rgba(255, 255, 255, 0.4)',
      border: '#DCE6F0',

      textPrimary: '#10243E',
      textSecondary: '#475569',
      textMuted: '#64748B',

      // Brand
      primary: '#0D9488',
      primaryDark: '#0F766E',
      primaryText: '#0F766E',
      primaryLight: '#CCFBF1',
      primaryGlass: 'rgba(13, 148, 136, 0.10)',
      primaryGlow: 'rgba(13, 148, 136, 0.22)',
      blue: '#3B82F6',
      blueGlass: 'rgba(59, 130, 246, 0.10)',

      // Semantic security colours
      green: '#15803D',
      greenBg: 'rgba(21, 128, 61, 0.10)',
      greenBorder: 'rgba(21, 128, 61, 0.28)',
      amber: '#B45309',
      amberBg: 'rgba(180, 83, 9, 0.10)',
      amberBorder: 'rgba(180, 83, 9, 0.28)',
      red: '#B91C1C',
      redBg: 'rgba(185, 28, 28, 0.09)',
      redBorder: 'rgba(185, 28, 28, 0.28)',
      info: '#1D4ED8',
      infoBg: 'rgba(29, 78, 216, 0.09)',
      infoBorder: 'rgba(29, 78, 216, 0.26)',

      // Ambient orbs
      orb1: '#99E2DA',
      orb2: '#BFDBFE',
      orb3: '#DDE7FB',

      // Showcase tokens
      cardNavy: '#FFFFFF',
      cardBorderCyan: 'rgba(56, 189, 248, 0.35)',
      cardGlow: 'rgba(56, 189, 248, 0.12)',
      accentCyan: '#0284C7',
      actionBlue: '#2563EB',
      actionBlueDark: '#1D4ED8',
    },

    dark: {
      background: '#0B1220',
      backgroundGradient: ['#0B1220', '#0F1D33', '#0A1626'],
      glassBg: 'rgba(16, 36, 62, 0.64)',
      glassElevated: 'rgba(22, 48, 80, 0.76)',
      glassPressed: 'rgba(30, 62, 100, 0.86)',
      glassFloatingNav: 'rgba(14, 30, 52, 0.88)',
      glassBorder: 'rgba(148, 197, 255, 0.16)',
      glassHighlight: 'rgba(190, 220, 255, 0.26)',
      glassInnerShadow: 'rgba(255, 255, 255, 0.05)',
      border: 'rgba(148, 197, 255, 0.16)',

      textPrimary: '#F1F6FC',
      textSecondary: '#B4C2D6',
      textMuted: '#8EA0B8',

      primary: '#14B8A6',
      primaryDark: '#0D9488',
      primaryText: '#5EEAD4',
      primaryLight: '#0F3D3E',
      primaryGlass: 'rgba(20, 184, 166, 0.16)',
      primaryGlow: 'rgba(20, 184, 166, 0.30)',
      blue: '#60A5FA',
      blueGlass: 'rgba(96, 165, 250, 0.14)',

      green: '#4ADE80',
      greenBg: 'rgba(74, 222, 128, 0.14)',
      greenBorder: 'rgba(74, 222, 128, 0.34)',
      amber: '#FBBF24',
      amberBg: 'rgba(251, 191, 36, 0.14)',
      amberBorder: 'rgba(251, 191, 36, 0.34)',
      red: '#F87171',
      redBg: 'rgba(248, 113, 113, 0.15)',
      redBorder: 'rgba(248, 113, 113, 0.38)',
      info: '#7DB2FF',
      infoBg: 'rgba(125, 178, 255, 0.14)',
      infoBorder: 'rgba(125, 178, 255, 0.34)',

      orb1: '#0F4C4B',
      orb2: '#14325E',
      orb3: '#10243E',

      // Showcase tokens matching reference UI
      cardNavy: '#0E1B38',
      cardBorderCyan: 'rgba(56, 189, 248, 0.22)',
      cardGlow: 'rgba(56, 189, 248, 0.18)',
      accentCyan: '#38BDF8',
      actionBlue: '#2563EB',
      actionBlueDark: '#1D4ED8',
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
      shadowColor: '#10243E',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.07,
      shadowRadius: 16,
      elevation: 2,
    },
    floating: {
      shadowColor: '#10243E',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.12,
      shadowRadius: 28,
      elevation: 6,
    },
    glow: {
      shadowColor: '#0D9488',
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

  /** Layout limits shared by every screen so wide viewports stay readable. */
  layout: {
    maxContentWidth: 640,
    minTouchTarget: 44,
  },
};

export const glassColors = GlassTokens.colors;
export const glassRadii = GlassTokens.radii;
export const glassShadows = GlassTokens.shadows;
export const glassBorder = {
  light: {
    subtle: 'rgba(220, 230, 240, 0.95)',
    highlight: 'rgba(255, 255, 255, 0.98)',
  },
  dark: {
    subtle: 'rgba(148, 197, 255, 0.16)',
    highlight: 'rgba(190, 220, 255, 0.26)',
  },
};
