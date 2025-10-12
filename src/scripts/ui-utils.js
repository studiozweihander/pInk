import { DOM_SELECTORS, STATE_MESSAGES, CSS_CLASSES } from './constants.js';
import { appState } from './state.js';

export class UIUtils {
  constructor() {
    this.cardsContainer = document.querySelector(DOM_SELECTORS.cardsContainer);
    this.controlsBar = document.querySelector(DOM_SELECTORS.controlsBar);
  }

  showLoading() {
    appState.isLoading = true;
    this._updateContainerClass(CSS_CLASSES.loading);
    this._setContainerContent(`
      <div class="loading">
        <div class="loading-spinner"></div>
        <p>${STATE_MESSAGES.loading.title}</p>
      </div>
    `);
  }

  showError(message) {
    this._updateContainerClass(CSS_CLASSES.error);
    this._setContainerContent(`
      <div class="error">
        <h3>${STATE_MESSAGES.error.icon} ${STATE_MESSAGES.error.title}</h3>
        <p>${message}</p>
        <button onclick="location.reload()" class="retry-btn">Tentar novamente</button>
      </div>
    `);
  }

  showEmptyState(type = 'quadrinhos') {
    this._updateContainerClass(CSS_CLASSES.emptyState);

    const message = STATE_MESSAGES.empty[type] || STATE_MESSAGES.empty.quadrinhos;
    this._setContainerContent(`
      <div class="empty-state">
        <h3>${message.icon} ${message.title}</h3>
        <p>${message.subtitle}</p>
      </div>
    `);
  }

  _updateContainerClass(additionalClass) {
    if (!this.cardsContainer) return;
    this.cardsContainer.className = `cards state-message ${additionalClass}`.trim();
  }

  _setContainerContent(content) {
    if (!this.cardsContainer) return;
    this.cardsContainer.innerHTML = content;
  }

  setControlsLoading(show) {
    if (!this.controlsBar) return;
    if (show) {
      this.controlsBar.style.opacity = '0.7';
    } else {
      this.controlsBar.style.opacity = '1';
    }
  }

  animateViewChange() {
    if (!this.cardsContainer) return;
    this.cardsContainer.style.opacity = '0.7';
    this.cardsContainer.style.transform = 'scale(0.98)';
    setTimeout(() => {
      this.cardsContainer.style.opacity = '1';
      this.cardsContainer.style.transform = 'scale(1)';
    }, 150);
  }

  highlightActiveControl(mode) {
    const viewGridButton = document.querySelector(DOM_SELECTORS.viewGridButton);
    const viewListButton = document.querySelector(DOM_SELECTORS.viewListButton);
    const activeButton = mode === 'grid' ? viewGridButton : viewListButton;
    if (!activeButton) return;
    activeButton.style.transform = 'scale(1.1)';
    activeButton.style.boxShadow = '0 0 8px rgba(231, 143, 222, 0.5)';
    setTimeout(() => {
      activeButton.style.transform = '';
      activeButton.style.boxShadow = '';
    }, 300);
  }

  updateFilterButton(filterCount) {
    const filterButton = document.querySelector(DOM_SELECTORS.filterButton);
    if (!filterButton) return;
    if (filterCount > 0) {
      filterButton.classList.add(CSS_CLASSES.hasFilters);
      filterButton.setAttribute('data-count', filterCount);
    } else {
      filterButton.classList.remove(CSS_CLASSES.hasFilters);
      filterButton.removeAttribute('data-count');
    }
  }

  toggleMobileSearch(show) {
    const searchInputContainer = document.querySelector(DOM_SELECTORS.searchInputContainer);
    const searchInput = document.querySelector(DOM_SELECTORS.searchInput);
    if (!searchInputContainer || !searchInput) return;
    if (show) {
      searchInputContainer.classList.add(CSS_CLASSES.active);
      searchInput.focus();
    } else {
      searchInputContainer.classList.remove(CSS_CLASSES.active);
      searchInput.blur();
    }
  }

  updateBreadcrumb(text) {
    const breadcrumb = document.querySelector(DOM_SELECTORS.breadcrumb);
    if (breadcrumb) {
      breadcrumb.textContent = text;
    }
  }

  updateSearchPlaceholder(placeholder) {
    const searchInput = document.querySelector(DOM_SELECTORS.searchInput);
    if (searchInput) {
      searchInput.placeholder = placeholder;
    }
  }

  toggleLogoNavigation(hasNavigation) {
    const logoContainer = document.querySelector(DOM_SELECTORS.logoContainer);
    if (!logoContainer) return;
    if (hasNavigation) {
      logoContainer.classList.add('has-navigation');
      logoContainer.style.cursor = 'pointer';
    } else {
      logoContainer.classList.remove('has-navigation');
      logoContainer.style.cursor = 'default';
    }
  }

  toggleSearchVisibility(visible) {
    const searchInput = document.querySelector(DOM_SELECTORS.searchInput);
    if (searchInput) {
      searchInput.style.display = visible ? 'block' : 'none';
    }
  }

  getDOMElements() {
    return {
      cardsContainer: this.cardsContainer,
      searchInput: document.querySelector(DOM_SELECTORS.searchInput),
      breadcrumb: document.querySelector(DOM_SELECTORS.breadcrumb),
      logoContainer: document.querySelector(DOM_SELECTORS.logoContainer),
      searchToggle: document.querySelector(DOM_SELECTORS.searchToggle),
      searchInputContainer: document.querySelector(DOM_SELECTORS.searchInputContainer),
      searchClose: document.querySelector(DOM_SELECTORS.searchClose),
      controlsBar: this.controlsBar,
      backButtonControls: document.querySelector(DOM_SELECTORS.backButtonControls),
      viewGridButton: document.querySelector(DOM_SELECTORS.viewGridButton),
      viewListButton: document.querySelector(DOM_SELECTORS.viewListButton),
      filterButton: document.querySelector(DOM_SELECTORS.filterButton),
      filterDropdown: document.querySelector(DOM_SELECTORS.filterDropdown),
      modal: document.querySelector(DOM_SELECTORS.modal),
      modalCover: document.querySelector(DOM_SELECTORS.modalCover)
    };
  }
}

export const uiUtils = new UIUtils();
