import { VIEWS, FILTER_TYPES } from './constants.js';
import { appState } from './state.js';
import { uiUtils } from './ui-utils.js';
import { cardRenderer } from './card-renderer.js';
import { filterSystem } from './filters.js';

export class SearchSystem {
  constructor() {
    this.searchInput = document.getElementById('search');
    this.searchToggle = document.getElementById('search-toggle');
    this.searchInputContainer = document.getElementById('search-input-container');
    this.searchClose = document.getElementById('search-close');
  }

  init() {
    this._setupEventListeners();
  }

  _setupEventListeners() {
    if (this.searchInput) {
      ['input', 'keyup'].forEach(event => {
        this.searchInput.addEventListener(event, this.handleSearchInput.bind(this));
      });

      this.searchInput.addEventListener('paste', (e) => {
        setTimeout(() => this.handleSearchInput(e), 10);
      });
    }

    if (this.searchToggle) {
      this.searchToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        uiUtils.toggleMobileSearch(true);
        this.searchInput?.focus();
      });
    }

    if (this.searchClose) {
      this.searchClose.addEventListener('click', (e) => {
        e.stopPropagation();
        uiUtils.toggleMobileSearch(false);
        this.searchInput?.blur();
      });
    }

    document.addEventListener('click', (e) => {
      if (this.searchInputContainer && this.searchToggle &&
          !this.searchInputContainer.contains(e.target) &&
          !this.searchToggle.contains(e.target)) {
        if (this.searchInputContainer.classList.contains('active')) {
          uiUtils.toggleMobileSearch(false);
        }
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.searchInputContainer?.classList.contains('active')) {
        uiUtils.toggleMobileSearch(false);
      }
    });
  }

  handleSearchInput(e) {
    const searchTerm = e.target.value;

    if (appState.currentView === VIEWS.HOME) {
      this.filterComics(searchTerm);
    } else if (appState.currentView === VIEWS.ISSUES) {
      this.filterIssues(searchTerm);
    }
  }

  filterComics(searchTerm) {
    if (!searchTerm.trim() && !appState.hasActiveFilters(VIEWS.HOME)) {
      cardRenderer.renderComics(appState.allComics);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = appState.allComics.filter(comic =>
      comic.title.toLowerCase().includes(searchLower)
    );

    cardRenderer.renderComics(filtered);
  }

  filterIssues(searchTerm) {
    if (!appState.currentIssues || appState.currentIssues.length === 0) return;

    if (!searchTerm.trim()) {
      cardRenderer.renderIssues(appState.currentIssues);
      return;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    const filtered = appState.currentIssues.filter(issue => {
      const titleText = (issue.title || '').toLowerCase();
      return titleText.includes(searchLower);
    });

    cardRenderer.renderIssues(filtered);
  }

  clearSearch() {
    if (this.searchInput) {
      this.searchInput.value = '';
    }

    filterSystem.applyFilters();
  }

  focusSearch() {
    if (this.searchInput) {
      this.searchInput.focus();
      if (window.innerWidth <= 768) {
        uiUtils.toggleMobileSearch(true);
      }
    }
  }
  focusSearch() {
    if (this.searchInput) {
      this.searchInput.focus();
      if (window.innerWidth <= 768) {
        uiUtils.toggleMobileSearch(true);
      }
    }
  }

  getCurrentSearchTerm() {
    return this.searchInput ? this.searchInput.value : '';
  }

  setSearchTerm(term) {
    if (this.searchInput) {
      this.searchInput.value = term;
      this.handleSearchInput({ target: this.searchInput });
    }
  }

  isSearchActive() {
    return this.searchInput ? this.searchInput.value.trim().length > 0 : false;
  }

  getSearchStats() {
    return {
      currentTerm: this.getCurrentSearchTerm(),
      isActive: this.isSearchActive(),
      currentView: appState.currentView,
      totalComics: appState.allComics?.length || 0,
      totalIssues: appState.currentIssues?.length || 0
    };
  }
}

export const searchSystem = new SearchSystem();
