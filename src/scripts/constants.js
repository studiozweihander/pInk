export const PLACEHOLDER_IMAGE = 'https://placehold.co/300x450/242424/e78fde?text=Imagem+Não+Disponível&font=source-sans-pro';

export const REQUEST_TIMEOUT = 10000;

export const FILTER_TYPES = {
  PUBLISHER: 'publisher',
  YEAR: 'year',
  LANGUAGE: 'language'
};

export const VIEW_MODES = {
  GRID: 'grid',
  LIST: 'list'
};

export const VIEWS = {
  HOME: 'home',
  ISSUES: 'issues',
  ABOUT: 'about',
  HOW_TO_USE: 'how-to-use'
};

export const DOM_SELECTORS = {
  cardsContainer: '#cards',
  searchInput: '#search',
  breadcrumb: '#breadcrumb',
  logoContainer: '.logo-container',
  searchToggle: '#search-toggle',
  searchInputContainer: '#search-input-container',
  searchClose: '#search-close',
  controlsBar: '.controls-bar',
  backButtonControls: '#back-button',
  viewGridButton: '#view-grid',
  viewListButton: '#view-list',
  filterButton: '#filter-button',
  filterDropdown: '#filter-dropdown',
  modal: '#modal',
  modalCover: '#modal-cover'
};

export const STATE_MESSAGES = {
  loading: {
    icon: '⏳',
    title: 'Carregando quadrinhos...',
    subtitle: ''
  },
  error: {
    icon: '❌',
    title: 'Erro ao carregar quadrinhos',
    subtitle: ''
  },
  empty: {
    quadrinhos: {
      icon: '📚',
      title: 'Nenhum quadrinho encontrado',
      subtitle: 'Verifique sua busca ou este quadrinho ainda não foi adicionado.'
    },
    edicoes: {
      icon: '📖',
      title: 'Nenhuma edição encontrada',
      subtitle: 'Este quadrinho ainda não possui edições cadastradas.'
    }
  }
};

export const FILTER_LABELS = {
  publisher: 'Editora',
  year: 'Ano de Lançamento',
  language: 'Idioma'
};

export const KEYBOARD_SHORTCUTS = {
  GRID_MODE: '1',
  LIST_MODE: '2',
  BACK: 'Escape'
};

export const ANIMATION_TIMINGS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
};

export const CSS_CLASSES = {
  loading: 'loading',
  error: 'error',
  emptyState: 'empty-state',
  card: 'card',
  active: 'active',
  open: 'open',
  listView: 'list-view',
  hasFilters: 'has-filters',
  clickable: 'clickable'
};
