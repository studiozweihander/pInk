import { VIEWS, FILTER_TYPES } from './constants.js';
import { appState } from './state.js';
import { uiUtils } from './ui-utils.js';
import { cardRenderer } from './card-renderer.js';
import { filterSystem } from './filters.js';

export class NavigationSystem {
  constructor() {
    this.api = window.api;
  }

  async loadAllComics() {
    if (appState.isLoading) return;

    uiUtils.showLoading();
    uiUtils.setControlsLoading(true);

    try {
      const isOnline = await this.api.healthCheck();
      if (!isOnline) {
        throw new Error('Backend não está respondendo. Execute "npm start" em outro terminal.');
      }

      const response = await this.api.getAllComics();
      appState.allComics = response.data;

      filterSystem.extractFiltersFromComics(appState.allComics);
      cardRenderer.renderComics(appState.allComics);

      uiUtils.setControlsLoading(false);

      if (appState.viewMode === 'list') {
        cardRenderer.cardsContainer?.classList.add('list-view');
      }

    } catch (error) {
      uiUtils.showError(error.message);
      uiUtils.setControlsLoading(false);
    } finally {
      appState.isLoading = false;
    }
  }

  async loadComicIssues(identifier, isNumericId = false) {
    if (appState.isLoading) return;
    uiUtils.showLoading();

    if (!identifier || identifier === 'undefined') {
      uiUtils.showError('Erro interno: identificador inválido');
      return;
    }

    try {
      const [comicResponse, issuesResponse] = await Promise.all([
        this.api.getComicById(identifier),
        this.api.getComicIssues(identifier)
      ]);

      appState.currentComic = comicResponse.data;
      appState.currentIssues = issuesResponse.data;

      filterSystem.extractFiltersFromIssues(appState.currentIssues);
      cardRenderer.renderIssues(appState.currentIssues);

      this.updateHeader();

    } catch (error) {
      uiUtils.showError(error.message);
      appState.currentComic = null;
      appState.currentIssues = [];
    } finally {
      appState.isLoading = false;
    }
  }

  viewComicIssues(identifier) {
    appState.currentView = VIEWS.ISSUES;
    this.updateURL(VIEWS.ISSUES, identifier);

    const isNumericId = !isNaN(identifier) && !isNaN(parseFloat(identifier));
    this.loadComicIssues(identifier, isNumericId);
  }

  backToHome() {
    if (appState.currentView === VIEWS.HOME) return;

    if (appState.currentView === VIEWS.ISSUES || appState.currentView === VIEWS.ABOUT || appState.currentView === VIEWS.HOW_TO_USE) {
      appState.currentView = VIEWS.HOME;

      const searchInput = document.getElementById('search');
      if (searchInput) {
        searchInput.value = '';
        searchInput.style.display = 'block';
      }

      Object.keys(appState.activeIssueFilters).forEach(key => {
        appState.activeIssueFilters[key] = [];
      });

      if (!appState.allComics || appState.allComics.length === 0) {
        this.loadAllComics();
      } else {
        if (appState.allComics && appState.allComics.length > 0) {
          filterSystem.extractFiltersFromComics(appState.allComics);
        }
        cardRenderer.renderComics(appState.allComics);
      }

      this.updateHeader();
      filterSystem.updateFilterButton();
      this.updateURL(VIEWS.HOME);
    }
  }

  async loadStaticPage(page) {
    try {
      const response = await fetch(`/${page}.html`);
      if (!response.ok) throw new Error('Página não encontrada');

      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const pageContent = doc.querySelector('.container') || doc.body;

      const currentContainer = document.querySelector('.container');
      if (currentContainer) {
        currentContainer.innerHTML = pageContent.innerHTML;
      }

      const title = doc.querySelector('title')?.textContent || 'pInk';
      document.title = title;

    } catch (error) {
      console.error('Erro ao carregar página:', error);
      uiUtils.showError('Página não encontrada');
    }
  }

  updateURL(view, comicId = null) {
    let url = '/';

    if (view === VIEWS.ISSUES && comicId) {
      url = `/comics/${comicId}`;
    } else if (view === VIEWS.ABOUT) {
      url = '/about';
    } else if (view === VIEWS.HOW_TO_USE) {
      url = '/how-to-use';
    }

    if (url !== window.location.pathname) {
      window.history.pushState({ view, comicId }, '', url);
    }
  }

  parseURL() {
    const path = window.location.pathname;

    if (path === '/' || path === '') {
      return { view: VIEWS.HOME };
    } else if (path.startsWith('/comics/')) {
      const identifier = path.split('/comics/')[1];
      if (identifier && identifier.length > 0) {
        const isNumericId = !isNaN(identifier) && !isNaN(parseFloat(identifier));
        return { view: VIEWS.ISSUES, identifier, isNumericId };
      }
    } else if (path === '/about') {
      return { view: VIEWS.ABOUT };
    } else if (path === '/how-to-use') {
      return { view: VIEWS.HOW_TO_USE };
    }

    return { view: VIEWS.HOME };
  }

  handlePopState(state) {
    const parsedState = state || this.parseURL();
    this.navigateTo(parsedState.view, parsedState.identifier, parsedState.isNumericId);
  }

  navigateTo(view, identifier = null, isNumericId = false) {
    if (view === VIEWS.HOME) {
      this._navigateToHome();
    } else if (view === VIEWS.ISSUES && identifier) {
      this._navigateToIssues(identifier, isNumericId);
    } else if (view === VIEWS.ABOUT) {
      this._navigateToAbout();
    } else if (view === VIEWS.HOW_TO_USE) {
      this._navigateToHowToUse();
    }
  }

  _navigateToHome() {
    appState.currentView = VIEWS.HOME;

    const searchInput = document.getElementById('search');
    if (searchInput) {
      searchInput.value = '';
    }

    // Reset issue filters
    Object.keys(appState.activeIssueFilters).forEach(key => {
      appState.activeIssueFilters[key] = [];
    });

    // Load comics data if not already loaded
    if (!appState.allComics || appState.allComics.length === 0) {
      this.loadAllComics();
    } else {
      filterSystem.extractFiltersFromComics(appState.allComics);
      cardRenderer.renderComics(appState.allComics);
    }

    this.updateHeader();
    filterSystem.updateFilterButton();
    this.updateURL(VIEWS.HOME);
  }

  _navigateToIssues(identifier, isNumericId) {
    appState.currentView = VIEWS.ISSUES;
    this.loadComicIssues(identifier, isNumericId);
  }
  
  _navigateToAbout() {
    appState.currentView = VIEWS.ABOUT;
    this.loadStaticPage('about');
  }

  _navigateToHowToUse() {
    appState.currentView = VIEWS.HOW_TO_USE;
    this.loadStaticPage('how-to-use');
  }

  updateHeader() {
    if (appState.currentView === VIEWS.HOME) {
      this._updateHomeHeader();
    } else if (appState.currentView === VIEWS.ISSUES && appState.currentComic) {
      this._updateIssuesHeader();
    } else if (appState.currentView === VIEWS.ABOUT) {
      this._updateAboutHeader();
    } else if (appState.currentView === VIEWS.HOW_TO_USE) {
      this._updateHowToUseHeader();
    }

    this._updateControlsVisibility();
  }

  _updateHomeHeader() {
    uiUtils.updateBreadcrumb('');
    uiUtils.updateSearchPlaceholder('Buscar quadrinho...');
    uiUtils.toggleLogoNavigation(false);
    filterSystem.populateFilterOptions();
  }

  _updateIssuesHeader() {
    const breadcrumbText = `${appState.currentComic.title} (${appState.currentComic.year || 'N/A'})`;
    uiUtils.updateBreadcrumb(breadcrumbText);
    uiUtils.updateSearchPlaceholder('Buscar edição...');
    uiUtils.toggleLogoNavigation(true);
    filterSystem.populateIssueFilterOptions();
  }

  _updateAboutHeader() {
    uiUtils.updateBreadcrumb('Sobre');
    uiUtils.toggleSearchVisibility(false);
    uiUtils.toggleLogoNavigation(true);
  }

  _updateHowToUseHeader() {
    uiUtils.updateBreadcrumb('Como Usar');
    uiUtils.toggleSearchVisibility(false);
    uiUtils.toggleLogoNavigation(true);
  }

  _updateControlsVisibility() {
    const backButtonControls = document.getElementById('back-button');
    const viewToggle = document.querySelector('.view-toggle');

    if (appState.currentView === VIEWS.HOME) {
      if (backButtonControls) backButtonControls.style.display = 'none';
      if (viewToggle) viewToggle.style.display = 'flex';
    } else if (appState.currentView === VIEWS.ISSUES) {
      if (backButtonControls) backButtonControls.style.display = 'flex';
      if (viewToggle) viewToggle.style.display = 'flex';
    } else if (appState.currentView === VIEWS.ABOUT || appState.currentView === VIEWS.HOW_TO_USE) {
      if (backButtonControls) backButtonControls.style.display = 'flex';
      if (viewToggle) viewToggle.style.display = 'none';
    }
  }

  init() {
    window.addEventListener('popstate', (event) => {
      this.handlePopState(event.state);
    });

    const initialState = this.parseURL();
    this.navigateTo(initialState.view, initialState.identifier, initialState.isNumericId);
  }
}
export const navigationSystem = new NavigationSystem();
