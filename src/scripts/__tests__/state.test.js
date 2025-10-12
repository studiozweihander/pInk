import { AppState } from '../state.js';
import { VIEWS, VIEW_MODES, FILTER_TYPES } from '../constants.js';

global.document = {
  querySelector: () => null,
  getElementById: () => null
};

console.log('🧪 Running tests for state.js...\n');

test('AppState should initialize with correct default values', () => {
  const state = new AppState();

  assert(state.currentView === VIEWS.HOME);
  assert(state.viewMode === VIEW_MODES.GRID);
  assert(state.isLoading === false);
  assert(state.isFilterDropdownOpen === false);
  assert(Array.isArray(state.allComics));
  assert(Array.isArray(state.currentIssues));
  assert(state.currentComic === null);
  assert(state.currentIssueData === null);
});

test('AppState should manage filters correctly', () => {
  const state = new AppState();

  state.addFilter(FILTER_TYPES.PUBLISHER, 'Marvel');
  assert(state.activeFilters[FILTER_TYPES.PUBLISHER].includes('Marvel'));

  state.removeFilter(FILTER_TYPES.PUBLISHER, 'Marvel');
  assert(!state.activeFilters[FILTER_TYPES.PUBLISHER].includes('Marvel'));

  state.addFilter(FILTER_TYPES.YEAR, '2020');
  state.addFilter(FILTER_TYPES.LANGUAGE, 'Português');
  assert(state.getActiveFilterCount() === 2);
});

test('AppState should reset filters correctly', () => {
  const state = new AppState();

  state.addFilter(FILTER_TYPES.PUBLISHER, 'DC');
  state.addFilter(FILTER_TYPES.YEAR, '2019');

  state.resetFilters(VIEWS.HOME);

  assert(state.getActiveFilterCount() === 0);
  assert(state.activeFilters[FILTER_TYPES.PUBLISHER].length === 0);
  assert(state.activeFilters[FILTER_TYPES.YEAR].length === 0);
});

test('AppState should manage issue filters separately', () => {
  const state = new AppState();

  state.addFilter(FILTER_TYPES.YEAR, '2020');
  state.addFilter(FILTER_TYPES.YEAR, '2019', VIEWS.ISSUES);

  assert(state.getActiveFilterCount(VIEWS.HOME) === 1);
  assert(state.getActiveFilterCount(VIEWS.ISSUES) === 1);

  state.resetFilters(VIEWS.ISSUES);
  assert(state.getActiveFilterCount(VIEWS.HOME) === 1);
  assert(state.getActiveFilterCount(VIEWS.ISSUES) === 0);
});

test('AppState should correctly detect active filters', () => {
  const state = new AppState();

  assert(!state.hasActiveFilters());

  state.addFilter(FILTER_TYPES.PUBLISHER, 'Marvel');
  assert(state.hasActiveFilters());

  state.resetFilters();
  assert(!state.hasActiveFilters());
});

test('AppState should serialize correctly for debugging', () => {
  const state = new AppState();

  const serialized = state.toJSON();

  assert(typeof serialized === 'object');
  assert(typeof serialized.data === 'object');
  assert(typeof serialized.ui === 'object');
  assert(typeof serialized.filters === 'object');
  assert('allComicsCount' in serialized.data);
  assert('currentView' in serialized.ui);
  assert('activeFilters' in serialized.filters);
});

test('AppState should manage data state correctly', () => {
  const state = new AppState();

  const mockComic = { id: 1, title: 'Test Comic' };
  const mockIssue = { id: 1, title: 'Test Issue' };

  state.allComics = [mockComic];
  state.currentComic = mockComic;
  state.currentIssues = [mockIssue];
  state.currentIssueData = mockIssue;
  assert(state.allComics.length === 1);
  assert(state.currentComic.title === 'Test Comic');
  assert(state.currentIssues.length === 1);
  assert(state.currentIssueData.title === 'Test Issue');

  state.currentIssueData = null;
  assert(state.currentIssueData === null);
});

console.log('\n🏁 State tests completed!');
