import {
  PLACEHOLDER_IMAGE,
  REQUEST_TIMEOUT,
  FILTER_TYPES,
  VIEW_MODES,
  VIEWS,
  DOM_SELECTORS,
  STATE_MESSAGES,
  FILTER_LABELS,
  KEYBOARD_SHORTCUTS,
  ANIMATION_TIMINGS,
  CSS_CLASSES
} from '../constants.js';

function test(description, testFn) {
  try {
    testFn();
    console.log(`✅ ${description}`);
  } catch (error) {
    console.error(`❌ ${description}: ${error.message}`);
  }
}

function assert(condition, message = 'Assertion failed') {
  if (!condition) {
    throw new Error(message);
  }
}

console.log('🧪 Running tests for constants.js...\n');

test('PLACEHOLDER_IMAGE should be a valid URL', () => {
  assert(typeof PLACEHOLDER_IMAGE === 'string');
  assert(PLACEHOLDER_IMAGE.includes('placehold.co'));
  assert(PLACEHOLDER_IMAGE.includes('300x450'));
});

test('REQUEST_TIMEOUT should be a number greater than 0', () => {
  assert(typeof REQUEST_TIMEOUT === 'number');
  assert(REQUEST_TIMEOUT > 0);
  assert(REQUEST_TIMEOUT === 10000);
});

test('FILTER_TYPES should have correct structure', () => {
  assert(FILTER_TYPES.PUBLISHER === 'publisher');
  assert(FILTER_TYPES.YEAR === 'year');
  assert(FILTER_TYPES.LANGUAGE === 'language');
});

test('VIEW_MODES should have correct structure', () => {
  assert(VIEW_MODES.GRID === 'grid');
  assert(VIEW_MODES.LIST === 'list');
});
test('VIEWS should have correct structure', () => {
  assert(VIEWS.HOME === 'home');
  assert(VIEWS.ISSUES === 'issues');
  assert(VIEWS.ABOUT === 'about');
  assert(VIEWS.HOW_TO_USE === 'how-to-use');
});

test('DOM_SELECTORS should have all required selectors', () => {
  assert(DOM_SELECTORS.cardsContainer === '#cards');
  assert(DOM_SELECTORS.searchInput === '#search');
  assert(DOM_SELECTORS.modal === '#modal');
});

test('STATE_MESSAGES should have correct structure', () => {
  assert(STATE_MESSAGES.loading.title === 'Carregando quadrinhos...');
  assert(STATE_MESSAGES.error.icon === '❌');
  assert(STATE_MESSAGES.empty.quadrinhos.title === 'Nenhum quadrinho encontrado');
});

  test('FILTER_LABELS should have correct labels', () => {
  assert(FILTER_LABELS.publisher === 'Editora');
  assert(FILTER_LABELS.year === 'Ano de Lançamento');
  assert(FILTER_LABELS.language === 'Idioma');
});

test('KEYBOARD_SHORTCUTS should have correct shortcuts', () => {
  assert(KEYBOARD_SHORTCUTS.GRID_MODE === '1');
  assert(KEYBOARD_SHORTCUTS.LIST_MODE === '2');
  assert(KEYBOARD_SHORTCUTS.BACK === 'Escape');
});

test('ANIMATION_TIMINGS should have positive values', () => {
  assert(ANIMATION_TIMINGS.FAST === 150);
  assert(ANIMATION_TIMINGS.NORMAL === 300);
  assert(ANIMATION_TIMINGS.SLOW === 500);
});

test('CSS_CLASSES should have correct class names', () => {
  assert(CSS_CLASSES.loading === 'loading');
  assert(CSS_CLASSES.active === 'active');
  assert(CSS_CLASSES.listView === 'list-view');
});

console.log('\n🏁 Constants tests completed!');
