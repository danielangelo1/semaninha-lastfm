// Canvas Configuration
export const CANVAS_CONFIG = {
  WIDTH: 1300,
  HEIGHT: 1300,
  BACKGROUND_COLOR: '#f5f5f5',
  IMAGE_FORMAT: 'image/png',
} as const;

// Grid Configuration
export const GRID_CONFIG = {
  MIN_SIZE: 2,
  MAX_SIZE: 10,
  DEFAULT_SIZE: 5,
} as const;

// Time Periods
export const TIME_PERIODS = [
  { value: '7day', label: 'Últimos 7 dias' },
  { value: '1month', label: 'Último mês' },
  { value: '3month', label: 'Últimos 3 meses' },
  { value: '6month', label: 'Últimos 6 meses' },
  { value: '12month', label: 'Último ano' },
  { value: 'overall', label: 'Geral' },
] as const;

// Content Types
export const CONTENT_TYPES = [
  { value: 'album', label: 'Álbuns' },
  { value: 'artist', label: 'Artistas' },
  // { value: 'track', label: 'Músicas' },
] as const;

// Grid Size Options: square sizes ("5") plus rectangular "columnsxrows" layouts
const SQUARE_GRID_SIZES = Array.from({ length: GRID_CONFIG.MAX_SIZE - GRID_CONFIG.MIN_SIZE + 1 }, (_, i) => {
  const size = i + GRID_CONFIG.MIN_SIZE;
  return { value: size.toString(), label: `${size}x${size}` };
});

export const GRID_SIZES = [
  SQUARE_GRID_SIZES[0],
  { value: '2x6', label: '2x6' },
  ...SQUARE_GRID_SIZES.slice(1),
];

// API Configuration
export const API_CONFIG = {
  SPOTIFY_TOKEN_BUFFER_MS: 60000, // 1 minute buffer before token expiry
} as const;

// Error Messages (user-facing errors are translated, see "errors" in the locales)
export const ERROR_MESSAGES = {
  CANVAS_CONTEXT_ERROR: 'Canvas context not found',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: 'user',
  PERIOD: 'period',
  LIMIT: 'limit',
  SHOW_ALBUM: 'showAlbum',
  SHOW_PLAYS: 'showPlays',
  TYPE: 'type',
} as const;

// Default Values
export const DEFAULT_VALUES = {
  PERIOD: '1month',
  LIMIT: '5',
  SHOW_ALBUM: false,
  SHOW_PLAYS: false,
  TYPE: 'album',
} as const;

// Support / donations
export const SUPPORT_CONFIG = {
  // Pix key shown on the /support page; the Pix card stays hidden while empty
  PIX_KEY: 'ab2a1d57-52ac-4499-963c-271ff6b4a6a4',
} as const;
