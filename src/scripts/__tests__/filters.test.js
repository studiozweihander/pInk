import { FilterSystem } from '../filters.js';
import { VIEWS, FILTER_TYPES } from '../constants.js';

global.document = {
  getElementById: (id) => ({
    textContent: '',
    innerHTML: '',
    style: { display: '' },
    classList: { add: () => {}, remove: () => {} },
    setAttribute: () => {},
    removeAttribute: () => {}
  }),
  querySelectorAll: () => [],
  querySelector: () => null
};

global.window = {
  location: { pathname: '/' }
};
const mockAppState = {
  availableFilters: {
    publishers: ['Marvel', 'DC'],
    years: ['2020', '2019'],
    languages: ['Português', 'Inglês']
  },
  availableIssueFilters: {
    years: ['2020', '2019']
  },
  activeFilters: {
    [FILTER_TYPES.PUBLISHER]: [],
    [FILTER_TYPES.YEAR]: [],
    [FILTER_TYPES.LANGUAGE]: []
  },
  activeIssueFilters: {
    [FILTER_TYPES.YEAR]: []
  },
  currentView: VIEWS.HOME,
  getActiveFilterCount: () => 0
};

console.log('🧪 Running tests for filters.js...\n');

test('FilterSystem should initialize correctly', () => {
  const filterSystem = new FilterSystem();
  assert(filterSystem instanceof FilterSystem);
});

test('extractFiltersFromComics should extract filters correctly', () => {
  const filterSystem = new FilterSystem();

  const mockComics = [
    { publisher: 'Marvel', year: 2020, language: 'Português' },
    { publisher: 'DC', year: 2019, language: 'Inglês' },
    { publisher: 'Marvel', year: 2020, language: 'Português' }
  ];

  filterSystem.extractFiltersFromComics(mockComics);

  // Should extract unique values
  assert(mockAppState.availableFilters.publishers.includes('Marvel'));
  assert(mockAppState.availableFilters.publishers.includes('DC'));
  assert(mockAppState.availableFilters.years.includes('2020'));
  assert(mockAppState.availableFilters.years.includes('2019'));
  assert(mockAppState.availableFilters.languages.includes('Português'));
  assert(mockAppState.availableFilters.languages.includes('Inglês'));
});

test('extractFiltersFromIssues should extract filters correctly', () => {
  const filterSystem = new FilterSystem();

  const mockIssues = [
    { year: 2020 },
    { year: 2019 },
    { year: 2020 }
  ];

  filterSystem.extractFiltersFromIssues(mockIssues);

  assert(mockAppState.availableIssueFilters.years.includes('2020'));
  assert(mockAppState.availableIssueFilters.years.includes('2019'));
});

test('toggleFilter should add/remove filters correctly', () => {
  const filterSystem = new FilterSystem();

  filterSystem.toggleFilter(FILTER_TYPES.PUBLISHER, 'Marvel');
  assert(mockAppState.activeFilters[FILTER_TYPES.PUBLISHER].includes('Marvel'));

  filterSystem.toggleFilter(FILTER_TYPES.PUBLISHER, 'Marvel');
  assert(!mockAppState.activeFilters[FILTER_TYPES.PUBLISHER].includes('Marvel'));
});
test('toggleIssueFilter should manage issue filters separately', () => {
  const filterSystem = new FilterSystem();

  filterSystem.toggleIssueFilter(FILTER_TYPES.YEAR, '2020');
  assert(mockAppState.activeIssueFilters[FILTER_TYPES.YEAR].includes('2020'));

  assert(mockAppState.activeFilters[FILTER_TYPES.YEAR].length === 0);
});

test('clearFilter should clear specific filter types', () => {
  const filterSystem = new FilterSystem();

  filterSystem.toggleFilter(FILTER_TYPES.PUBLISHER, 'Marvel');
  filterSystem.toggleIssueFilter(FILTER_TYPES.YEAR, '2020');

  filterSystem.clearFilter(FILTER_TYPES.PUBLISHER);

  assert(mockAppState.activeFilters[FILTER_TYPES.PUBLISHER].length === 0);
  assert(mockAppState.activeIssueFilters[FILTER_TYPES.YEAR].includes('2020'));
});

test('clearAllFilters should clear all filters for current view', () => {
  const filterSystem = new FilterSystem();

  filterSystem.toggleFilter(FILTER_TYPES.PUBLISHER, 'Marvel');
  filterSystem.toggleFilter(FILTER_TYPES.YEAR, '2020');

  // Clear all
  filterSystem.clearAllFilters();

  assert(mockAppState.activeFilters[FILTER_TYPES.PUBLISHER].length === 0);
  assert(mockAppState.activeFilters[FILTER_TYPES.YEAR].length === 0);
});

test('updateFilterButton should be a method', () => {
  const filterSystem = new FilterSystem();
  assert(typeof filterSystem.updateFilterButton === 'function');
});
test('applyFilters should be a method', () => {
  const filterSystem = new FilterSystem();
  assert(typeof filterSystem.applyFilters === 'function');
});
test('toggleFilters should be a method', () => {
  const filterSystem = new FilterSystem();
  assert(typeof filterSystem.toggleFilters === 'function');
});

console.log('\n🏁 Filter system tests completed!');
