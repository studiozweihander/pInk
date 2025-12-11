export const API_ENDPOINTS = {
  COMICS: '/api/comics',
  ISSUES: '/api/issues',
  HEALTH: '/health',
} as const;

export const PLACEHOLDER_IMAGE =
  'https://placehold.co/300x450/242424/e78fde?text=Imagem+Não+Disponível';

export const REQUEST_TIMEOUT = 10000;

export const VIEW_MODES = {
  GRID: 'grid',
  LIST: 'list',
} as const;

export const FILTER_TYPES = {
  PUBLISHER: 'publisher',
  YEAR: 'year',
  LANGUAGE: 'language',
} as const;
