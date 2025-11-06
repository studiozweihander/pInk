import { FILTER_TYPES, VIEWS } from './constants.js';
import { appState } from './state.js';

export class FilterSystem {
  extractFiltersFromComics(comics) {
    const publishers = new Set();
    const years = new Set();
    const languages = new Set();

    comics.forEach(comic => {
      if (comic.publisher && comic.publisher !== 'N/A') {
        publishers.add(comic.publisher);
      }
      if (comic.year && comic.year !== 'N/A') {
        years.add(comic.year.toString());
      }
      if (comic.language && comic.language !== 'N/A') {
        languages.add(comic.language);
      }
    });

    appState.availableFilters = {
      publishers: Array.from(publishers).sort(),
      years: Array.from(years).sort((a, b) => b - a),
      languages: Array.from(languages).sort((a, b) => a.localeCompare(b))
    };

    this.populateFilterOptions();
  }

  extractFiltersFromIssues(issues) {
    const years = new Set();

    issues.forEach(issue => {
      if (issue.year && issue.year !== 'N/A') {
        years.add(issue.year.toString());
      }
    });

    appState.availableIssueFilters = {
      years: Array.from(years).sort((a, b) => b - a)
    };

    this.populateIssueFilterOptions();
  }

  populateFilterOptions() {
    const title1 = document.getElementById('filter-title-1');
    const title2 = document.getElementById('filter-title-2');
    const title3 = document.getElementById('filter-title-3');

    if (title1) title1.textContent = 'Editora';
    if (title2) title2.textContent = 'Ano de Lançamento';
    if (title3) title3.textContent = 'Idioma';

    const sections = document.querySelectorAll('.filter-section');
    sections.forEach(section => {
      section.style.display = 'block';
    });

    this._populatePublisherOptions();
    this._populateYearOptions('comic');
    this._populateLanguageOptions();
  }

  populateIssueFilterOptions() {
    const title2 = document.getElementById('filter-title-2');
    if (title2) title2.textContent = 'Ano de Lançamento';

    const sections = document.querySelectorAll('.filter-section');
    sections.forEach((section, index) => {
      section.style.display = index === 1 ? 'block' : 'none';
    });

    this._populateYearOptions('issue');
  }

  _populatePublisherOptions() {
    const publisherOptions = document.getElementById('publisher-options');
    if (!publisherOptions) return;

    if (appState.availableFilters.publishers.length > 0) {
      publisherOptions.innerHTML = appState.availableFilters.publishers.map(publisher => `
        <label class="filter-option">
          <input type="checkbox" value="${publisher}" ${appState.activeFilters[FILTER_TYPES.PUBLISHER].includes(publisher) ? 'checked' : ''} onchange="window.toggleFilter('${FILTER_TYPES.PUBLISHER}', '${publisher}')">
          <span class="filter-label">${publisher}</span>
        </label>
      `).join('');
    } else {
      publisherOptions.innerHTML = '<div class="filter-empty">Nenhuma editora encontrada</div>';
    }
  }

  _populateYearOptions(type) {
    const yearOptions = document.getElementById('year-options');
    if (!yearOptions) return;

    const years = type === 'comic'
      ? appState.availableFilters.years
      : appState.availableIssueFilters.years;

    const activeFilters = type === 'comic'
      ? appState.activeFilters[FILTER_TYPES.YEAR]
      : appState.activeIssueFilters[FILTER_TYPES.YEAR];

    if (years.length > 0) {
      yearOptions.innerHTML = years.map(year => `
        <label class="filter-option">
          <input type="checkbox" value="${year}" ${activeFilters.includes(year) ? 'checked' : ''} onchange="window.toggle${type === 'comic' ? 'Filter' : 'IssueFilter'}('${FILTER_TYPES.YEAR}', '${year}')">
          <span class="filter-label">${year}</span>
        </label>
      `).join('');
    } else {
      yearOptions.innerHTML = '<div class="filter-empty">Nenhum ano encontrado</div>';
    }
  }

  _populateLanguageOptions() {
    const languageOptions = document.getElementById('language-options');
    if (!languageOptions) return;

    if (appState.availableFilters.languages.length > 0) {
      languageOptions.innerHTML = appState.availableFilters.languages.map(language => `
        <label class="filter-option">
          <input type="checkbox" value="${language}" ${appState.activeFilters[FILTER_TYPES.LANGUAGE].includes(language) ? 'checked' : ''} onchange="window.toggleFilter('${FILTER_TYPES.LANGUAGE}', '${language}')">
          <span class="filter-label">${language}</span>
        </label>
      `).join('');
    } else {
      languageOptions.innerHTML = '<div class="filter-empty">Nenhum idioma encontrado</div>';
    }
  }

  toggleFilter(type, value) {
    const filters = appState.activeFilters;

    if (filters[type].includes(value)) {
      filters[type] = filters[type].filter(item => item !== value);
    } else {
      filters[type].push(value);
    }

    this.updateFilterButton();
    this.applyFilters();
  }

  toggleIssueFilter(type, value) {
    const filters = appState.activeIssueFilters;

    if (filters[type].includes(value)) {
      filters[type] = filters[type].filter(item => item !== value);
    } else {
      filters[type].push(value);
    }

    this.updateFilterButton();
    this.applyFilters();
  }

  clearFilter(type) {
    if (appState.currentView === VIEWS.HOME) {
      appState.activeFilters[type] = [];
    } else if (appState.currentView === VIEWS.ISSUES) {
      appState.activeIssueFilters[type] = [];
    }

    this.updateFilterCheckboxes(type);
    this.updateFilterButton();
    this.applyFilters();
  }

  clearAllFilters() {
    if (appState.currentView === VIEWS.HOME) {
      Object.keys(appState.activeFilters).forEach(key => {
        appState.activeFilters[key] = [];
      });
    } else if (appState.currentView === VIEWS.ISSUES) {
      Object.keys(appState.activeIssueFilters).forEach(key => {
        appState.activeIssueFilters[key] = [];
      });
    }

    this.updateAllFilterCheckboxes();
    this.updateFilterButton();
    this.applyFilters();
  }

  updateFilterCheckboxes(type) {
    const container = document.getElementById(`${type}-options`);
    if (container) {
      const checkboxes = container.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(checkbox => {
        checkbox.checked = false;
      });
    }
  }

  updateAllFilterCheckboxes() {
    if (appState.currentView === VIEWS.HOME) {
      Object.keys(appState.activeFilters).forEach(type => {
        this.updateFilterCheckboxes(type === FILTER_TYPES.PUBLISHER ? 'publisher' : type);
      });
    } else if (appState.currentView === VIEWS.ISSUES) {
      this.updateFilterCheckboxes('year');
    }
  }

  updateFilterButton() {
    const filterButton = document.getElementById('filter-button');
    if (!filterButton) return;

    const totalActiveFilters = appState.getActiveFilterCount(appState.currentView);

    if (totalActiveFilters > 0) {
      filterButton.classList.add('has-filters');
      filterButton.setAttribute('data-count', totalActiveFilters);
    } else {
      filterButton.classList.remove('has-filters');
      filterButton.removeAttribute('data-count');
    }
  }

  applyFilters(searchTerm = '') {
    if (appState.currentView === VIEWS.HOME) {
      this._applyComicFilters(searchTerm);
    } else if (appState.currentView === VIEWS.ISSUES) {
      this._applyIssueFilters(searchTerm);
    }
  }

  _applyComicFilters(searchTerm) {
    if (!appState.allComics || appState.allComics.length === 0) return;

    import('./card-renderer.js').then(({ cardRenderer }) => {
      let filteredComics = [...appState.allComics];

      if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase();
        filteredComics = filteredComics.filter(comic =>
          comic.title.toLowerCase().includes(searchLower)
        );
      }

      if (appState.activeFilters[FILTER_TYPES.PUBLISHER].length > 0) {
        filteredComics = filteredComics.filter(comic =>
          appState.activeFilters[FILTER_TYPES.PUBLISHER].includes(comic.publisher)
        );
      }

      if (appState.activeFilters[FILTER_TYPES.YEAR].length > 0) {
        filteredComics = filteredComics.filter(comic =>
          appState.activeFilters[FILTER_TYPES.YEAR].includes(comic.year?.toString())
        );
      }

      if (appState.activeFilters[FILTER_TYPES.LANGUAGE].length > 0) {
        filteredComics = filteredComics.filter(comic =>
          appState.activeFilters[FILTER_TYPES.LANGUAGE].includes(comic.language)
        );
      }

      cardRenderer.renderComics(filteredComics);
    });
  }

  _applyIssueFilters(searchTerm) {
    if (!appState.currentIssues || appState.currentIssues.length === 0) return;

    import('./card-renderer.js').then(({ cardRenderer }) => {
      let filteredIssues = [...appState.currentIssues];

      if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase().trim();
        filteredIssues = appState.currentIssues.filter(issue => {
          const titleText = (issue.title || '').toLowerCase();
          return titleText.includes(searchLower);
        });
      }

      if (appState.activeIssueFilters[FILTER_TYPES.YEAR].length > 0) {
        filteredIssues = filteredIssues.filter(issue =>
          appState.activeIssueFilters[FILTER_TYPES.YEAR].includes(issue.year?.toString())
        );
      }

      cardRenderer.renderIssues(filteredIssues);
    });
  }

  toggleFilters(open) {
    const dropdown = document.getElementById('filter-dropdown');
    const filterButton = document.getElementById('filter-button');

    if (!dropdown || !filterButton) return;

    if (open) {
      this.openFilters(dropdown, filterButton);
    } else {
      this.closeFilters(dropdown, filterButton);
    }
  }

  openFilters(dropdown, filterButton) {
    dropdown.classList.add('open');
    filterButton.classList.add('active');
    appState.isFilterDropdownOpen = true;

    setTimeout(() => {
      document.addEventListener('click', this._handleClickOutside.bind(this));
    }, 10);
  }

  closeFilters(dropdown, filterButton) {
    dropdown.classList.remove('open');
    filterButton.classList.remove('active');
    appState.isFilterDropdownOpen = false;

    document.removeEventListener('click', this._handleClickOutside.bind(this));
  }

  _handleClickOutside(event) {
    const dropdown = document.getElementById('filter-dropdown');
    const filterContainer = document.querySelector('.filter-container');

    if (!filterContainer?.contains(event.target)) {
      this.closeFilters(dropdown, document.getElementById('filter-button'));
    }
  }
}

export const filterSystem = new FilterSystem();
