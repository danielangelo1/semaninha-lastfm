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
  PRIMARY: '#c3000d',
  SECONDARY: '#ff6b6b',
  TERTIARY: '#1db954',
  TEXT_PRIMARY: '#ffffff',
  TEXT_SECONDARY: '#aaaaaa',
  TEXT_TERTIARY: '#888888',
  TEXT_SHADOW: 'rgba(0, 0, 0, 0.3)',
  FOOTER: '#666666',
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
  PERIOD: '12month',
  LIMIT: 3, // 3x3 grid = 9 items, we'll use top 5
  TOP_COUNT: 5,
} as const;

// Wrapped Messages
export const WRAPPED_MESSAGES = {
  SUCCESS: 'Wrapped gerado com sucesso! 🎉',
  ERROR_USERNAME_REQUIRED: 'Por favor, insira seu nome de usuário do Last.fm',
  ERROR_GENERATION: 'Erro ao gerar o Wrapped',
  LOADING: 'Criando seu Wrapped... Isso pode levar alguns segundos ✨',
} as const;

// Wrapped Sections Configuration
export const WRAPPED_SECTIONS = [
  {
    title: 'TOP 5 ARTISTAS',
    color: WRAPPED_COLORS.PRIMARY,
    key: 'artists' as const,
  },
  {
    title: 'TOP 5 MÚSICAS',
    color: WRAPPED_COLORS.SECONDARY,
    key: 'tracks' as const,
  },
  {
    title: 'TOP 5 ÁLBUNS',
    color: WRAPPED_COLORS.TERTIARY,
    key: 'albums' as const,
  },
] as const;
