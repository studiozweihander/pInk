import { PLACEHOLDER_IMAGE, VIEW_MODES, CSS_CLASSES } from './constants.js';
import { appState } from './state.js';
import { handleImageError } from './api-utils.js';

export class CardRenderer {
  constructor() {
    this.cardsContainer = document.getElementById('cards');
  }

  createComicCard(comic) {
    const metaInfo = [
      `Lançamento: ${comic.year || 'N/A'}`,
      `Edições: ${comic.total_issues || 0}`,
      `Idioma: ${comic.language || 'N/A'}`,
      `Editora: ${comic.publisher || 'N/A'}`
    ].join(' | ');

    const slug = comic.slug || this.generateSimpleSlug(comic.title || 'comic-sem-titulo');

    return `
      <div class="card" data-id="${comic.id}" onclick="window.viewComicIssues('${slug}')">
        <div class="card-image">
          <img src="${comic.cover || PLACEHOLDER_IMAGE}"
               alt="${comic.title}"
               crossorigin="anonymous"
               referrerpolicy="no-referrer"
               data-error-handled="false"
               data-retried="false"
               onerror="handleImageError(this)">
        </div>
        <div class="card-info">
          <h3 class="card-title">${comic.title}</h3>
          <div class="card-meta">${metaInfo}</div>
        </div>
      </div>
    `;
  }

  createIssueCard(issue) {
    const genres = Array.isArray(issue.genres)
      ? issue.genres.join(', ')
      : (issue.genres || '').replace(/,/g, ', ');

    const metaInfo = [
      `Ano: ${issue.year || 'N/A'}`,
      `Tamanho: ${issue.size || 'N/A'}`,
      `Gêneros: ${genres || 'N/A'}`
    ].join(' | ');

    return `
      <div class="card" data-id="${issue.id}" onclick="window.viewIssueDetails(${issue.id})">
        <div class="card-image">
          <img src="${issue.cover || PLACEHOLDER_IMAGE}"
               alt="${issue.title}"
               data-error-handled="false"
               onerror="handleImageError(this)">
        </div>
        <div class="card-info">
          <h3 class="card-title">${issue.title}</h3>
          <div class="card-meta">${metaInfo}</div>
        </div>
      </div>
    `;
  }

  generateSimpleSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .replace(/^-|-$/g, '');
  }

  renderComics(comics) {
    if (comics.length === 0) {
      this.showEmptyState('quadrinhos');
      return;
    }

    this.cardsContainer.className = `cards has-content${appState.viewMode === VIEW_MODES.LIST ? ` ${CSS_CLASSES.listView}` : ''}`;
    this.cardsContainer.innerHTML = comics.map(comic => this.createComicCard(comic)).join('');
  }

  renderIssues(issues) {
    if (issues.length === 0) {
      this.showEmptyState('edicoes');
      return;
    }

    this.cardsContainer.className = `cards has-content${appState.viewMode === VIEW_MODES.LIST ? ` ${CSS_CLASSES.listView}` : ''}`;
    this.cardsContainer.innerHTML = issues.map(issue => this.createIssueCard(issue)).join('');
  }

  showEmptyState(type = 'quadrinhos') {
    const messages = {
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
    };

    const msg = messages[type];
    this.cardsContainer.className = 'cards state-message';
    this.cardsContainer.innerHTML = `
      <div class="empty-state">
        <h3>${msg.icon} ${msg.title}</h3>
        <p>${msg.subtitle}</p>
      </div>
    `;
  }

  setViewMode(mode) {
    const previousMode = appState.viewMode;
    appState.viewMode = mode;

    if (this.cardsContainer) {
      this.cardsContainer.classList.toggle(CSS_CLASSES.listView, mode === VIEW_MODES.LIST);

      if (appState.currentView === 'home' && appState.allComics.length > 0) {
        this.renderComics(appState.allComics);
      } else if (appState.currentView === 'issues' && appState.currentIssues.length > 0) {
        this.renderIssues(appState.currentIssues);
      }
    }

    try {
      window.viewModePreference = mode;
    } catch (e) {
      console.warn('Não foi possível salvar preferência:', e);
    }

    if (previousMode !== mode) {
      this.highlightActiveControl(mode);
    }
  }

  highlightActiveControl(mode) {
    const viewGridButton = document.getElementById('view-grid');
    const viewListButton = document.getElementById('view-list');

    const activeButton = mode === VIEW_MODES.GRID ? viewGridButton : viewListButton;
    if (!activeButton) return;

    activeButton.style.transform = 'scale(1.1)';
    activeButton.style.boxShadow = '0 0 8px rgba(231, 143, 222, 0.5)';

    setTimeout(() => {
      activeButton.style.transform = '';
      activeButton.style.boxShadow = '';
    }, 300);
  }

  loadViewModePreference() {
    try {
      const savedMode = window.viewModePreference || VIEW_MODES.GRID;
      if (savedMode && (savedMode === VIEW_MODES.GRID || savedMode === VIEW_MODES.LIST)) {
        this.setViewMode(savedMode);
      }
    } catch (e) {
      console.warn('Não foi possível carregar preferência de visualização:', e);
      this.setViewMode(VIEW_MODES.GRID);
    }
  }
}

export const cardRenderer = new CardRenderer();
