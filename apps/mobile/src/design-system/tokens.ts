export const Tokens = {
  colors: {
    dark: {
      background: '#0B1220',
      surface: '#10243E',
      surfaceElevated: '#334155',
      border: '#334155',
      textPrimary: '#F8FAFC',
      textSecondary: '#94A3B8',
      textMuted: '#64748B',
      primary: '#14B8A6',
      primaryDark: '#0D9488',
    },
    light: {
      background: '#F4F8FC',
      surface: '#FFFFFF',
      surfaceElevated: '#F1F5F9',
      border: '#DCE6F0',
      textPrimary: '#10243E',
      textSecondary: '#475569',
      textMuted: '#94A3B8',
      primary: '#0D9488',
      primaryDark: '#0F766E',
    },
    risk: {
      safe: {
        bg: '#064E3B',
        text: '#D1FAE5',
        border: '#10B981',
      },
      moderate: {
        bg: '#78350F',
        text: '#FEF3C7',
        border: '#F59E0B',
      },
      atRisk: {
        bg: '#7C2D12',
        text: '#FFEDD5',
        border: '#F97316',
      },
      critical: {
        bg: '#881337',
        text: '#FFE4E6',
        border: '#EF4444',
      },
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  radii: {
    sm: 6,
    md: 10,
    lg: 16,
    full: 9999,
  },
  typography: {
    titleLarge: { fontSize: 24, fontWeight: '700' as const, lineHeight: 30 },
    titleMedium: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
    body: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
    bodyBold: { fontSize: 14, fontWeight: '600' as const, lineHeight: 20 },
    caption: { fontSize: 12, fontWeight: '500' as const, lineHeight: 16 },
  },
};
