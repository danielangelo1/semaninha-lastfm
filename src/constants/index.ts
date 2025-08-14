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
  { value: 'album', label: 'Álbums' },
  { value: 'artist', label: 'Artistas' },
] as const;

// Grid Size Options
export const GRID_SIZES = Array.from({ length: GRID_CONFIG.MAX_SIZE - GRID_CONFIG.MIN_SIZE + 1 }, (_, i) => {
  const size = i + GRID_CONFIG.MIN_SIZE;
  return { value: size.toString(), label: `${size}x${size}` };
});

// API Configuration
export const API_CONFIG = {
  SPOTIFY_TOKEN_BUFFER_MS: 60000, // 1 minute buffer before token expiry
  REQUEST_TIMEOUT_MS: 10000, // 10 seconds
  MAX_RETRY_ATTEMPTS: 3,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  USER_NOT_FOUND: 'Usuário não encontrado',
  INSUFFICIENT_DATA: 'Você não tem dados suficientes para gerar a imagem :(, tente diminuir o tamanho',
  CANVAS_CONTEXT_ERROR: 'Canvas context not found',
  API_REQUEST_ERROR: 'Erro na requisição',
  USER_REQUIRED: 'Usuário é obrigatório',
  PERIOD_REQUIRED: 'Período é obrigatório',
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
  LIMIT: 5,
  SHOW_ALBUM: false,
  SHOW_PLAYS: false,
  TYPE: 'album',
} as const;
