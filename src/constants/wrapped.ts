// Year shown in the Wrapped (current year, since the feature runs at year end)
export const WRAPPED_YEAR = new Date().getFullYear();

// Wrapped Canvas Configuration
export const WRAPPED_CANVAS_CONFIG = {
  WIDTH: 1080,
  HEIGHT: 1920,
  BACKGROUND_GRADIENT: {
    START: '#1a1a2e',
    MIDDLE: '#16213e',
    END: '#0f3460',
  },
  DECORATIVE_CIRCLES: [
    { x: 900, y: 200, radius: 300, color: 'rgba(195, 0, 13, 0.1)' },
    { x: 150, y: 1700, radius: 250, color: 'rgba(255, 107, 107, 0.1)' },
  ],
} as const;

// Wrapped Colors
export const WRAPPED_COLORS = {
  BACKGROUND: '#0e0e0f',
  GLOW: 'rgba(195, 0, 13, 0.42)',
  ACCENT: '#e5262f',
  TEXT_PRIMARY: '#ffffff',
  TEXT_SECONDARY: 'rgba(255, 255, 255, 0.56)',
  TEXT_TERTIARY: 'rgba(255, 255, 255, 0.34)',
  RULE: 'rgba(255, 255, 255, 0.12)',
} as const;

// Wrapped Typography
export const WRAPPED_TYPOGRAPHY = {
  FONT_FAMILY: 'Poppins, sans-serif',
  HEADER: {
    TITLE_SIZE: 48,
    TITLE_WEIGHT: '700',
    YEAR_SIZE: 72,
    YEAR_WEIGHT: '900',
    USERNAME_SIZE: 32,
    USERNAME_WEIGHT: '400',
  },
  SECTION: {
    TITLE_SIZE: 36,
    TITLE_WEIGHT: '700',
  },
  ITEM: {
    RANK_SIZE: 24,
    RANK_WEIGHT: '700',
    NAME_SIZE: 28,
    NAME_WEIGHT: '600',
    DETAIL_SIZE: 20,
    DETAIL_WEIGHT: '400',
  },
  FOOTER: {
    SIZE: 24,
    WEIGHT: '400',
  },
} as const;

// Wrapped Layout
export const WRAPPED_LAYOUT = {
  PADDING: {
    HORIZONTAL: 80,
    VERTICAL: 120,
  },
  SPACING: {
    HEADER: 60,
    SECTION: 100,
    ITEM: 75,
    BETWEEN_SECTIONS: 40,
  },
  RANK_CIRCLE: {
    RADIUS: 25,
    OFFSET_X: 30,
    OFFSET_Y: -15,
  },
  TEXT_OFFSET: {
    FROM_RANK: 50,
    DETAIL_Y: 30,
  },
  MAX_TEXT_WIDTH: 700,
} as const;

// Wrapped API Configuration
export const WRAPPED_API_CONFIG = {
  // Max entries Last.fm returns for a weekly chart; also caps the distinct counts
  CHART_LIMIT: 1000,
  TOP_COUNT: 5,
} as const;
