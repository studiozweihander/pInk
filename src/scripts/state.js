import { FILTER_TYPES, VIEWS, VIEW_MODES } from './constants.js';

class AppState {
  constructor() {
    this._allComics = [];
    this._currentComic = null;
    this._currentIssues = [];
    this._currentIssueData = null;
    this._isLoading = false;
    this._currentView = VIEWS.HOME;
    this._viewMode = VIEW_MODES.GRID;
    this._activeFilters = {
      [FILTER_TYPES.PUBLISHER]: [],
      [FILTER_TYPES.YEAR]: [],
      [FILTER_TYPES.LANGUAGE]: []
    };
    this._activeIssueFilters = {
      [FILTER_TYPES.YEAR]: []
    };
    this._availableFilters = {
      publishers: [],
      years: [],
      languages: []
    };
    this._availableIssueFilters = {
      years: []
    };
    this._isFilterDropdownOpen = false;
  }

  get allComics() { return this._allComics; }
  set allComics(value) { this._allComics = value; }

  get currentComic() { return this._currentComic; }
  set currentComic(value) { this._currentComic = value; }

  get currentIssues() { return this._currentIssues; }
  set currentIssues(value) { this._currentIssues = value; }

  get currentIssueData() { return this._currentIssueData; }
  set currentIssueData(value) { this._currentIssueData = value; }

  get isLoading() { return this._isLoading; }
  set isLoading(value) { this._isLoading = value; }

  get currentView() { return this._currentView; }
  set currentView(value) { this._currentView = value; }

  get viewMode() { return this._viewMode; }
  set viewMode(value) { this._viewMode = value; }

  get activeFilters() { return this._activeFilters; }
  set activeFilters(value) { this._activeFilters = value; }

  get activeIssueFilters() { return this._activeIssueFilters; }
  set activeIssueFilters(value) { this._activeIssueFilters = value; }

  get availableFilters() { return this._availableFilters; }
  set availableFilters(value) { this._availableFilters = value; }

  get availableIssueFilters() { return this._availableIssueFilters; }
  set availableIssueFilters(value) { this._availableIssueFilters = value; }

  get isFilterDropdownOpen() { return this._isFilterDropdownOpen; }
  set isFilterDropdownOpen(value) { this._isFilterDropdownOpen = value; }

  resetFilters(view = VIEWS.HOME) {
    if (view === VIEWS.HOME) {
      Object.keys(this._activeFilters).forEach(key => {
        this._activeFilters[key] = [];
      });
    } else if (view === VIEWS.ISSUES) {
      Object.keys(this._activeIssueFilters).forEach(key => {
        this._activeIssueFilters[key] = [];
      });
    }
  }

  addFilter(type, value, view = VIEWS.HOME) {
    const filters = view === VIEWS.HOME ? this._activeFilters : this._activeIssueFilters;
    if (!filters[type].includes(value)) {
      filters[type].push(value);
    }
  }

  removeFilter(type, value, view = VIEWS.HOME) {
    const filters = view === VIEWS.HOME ? this._activeFilters : this._activeIssueFilters;
    filters[type] = filters[type].filter(item => item !== value);
  }

  hasActiveFilters(view = VIEWS.HOME) {
    const filters = view === VIEWS.HOME ? this._activeFilters : this._activeIssueFilters;
    return Object.values(filters).some(arr => arr.length > 0);
  }

  getActiveFilterCount(view = VIEWS.HOME) {
    const filters = view === VIEWS.HOME ? this._activeFilters : this._activeIssueFilters;
    return Object.values(filters).reduce((sum, arr) => sum + arr.length, 0);
  }

  toJSON() {
    return {
      data: {
        allComicsCount: this._allComics.length,
        currentComic: this._currentComic?.title || null,
        currentIssuesCount: this._currentIssues.length,
        currentIssueData: this._currentIssueData?.title || null
      },
      ui: {
        isLoading: this._isLoading,
        currentView: this._currentView,
        viewMode: this._viewMode
      },
      filters: {
        activeFilters: this._activeFilters,
        activeIssueFilters: this._activeIssueFilters,
        availableFilters: this._availableFilters,
        availableIssueFilters: this._availableIssueFilters,
        isFilterDropdownOpen: this._isFilterDropdownOpen
      }
    };
  }
}

export const appState = new AppState();
