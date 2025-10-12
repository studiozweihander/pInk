import { navigationSystem } from './navigation.js';
import { modalSystem } from './modal.js';
import { searchSystem } from './search.js';
import { viewControls } from './view-controls.js';
import { filterSystem } from './filters.js';
import { ControlsBarAutoHide } from './auto-hide.js';

export class EventHandlers {
  constructor() {
    this.api = window.api;
  }

  init() {
    this._setupGlobalEventHandlers();
    this._setupModalEventHandlers();
    this._setupFooterEventHandlers();
    this._initializeModules();
  }

  _setupGlobalEventHandlers() {
    const logoContainer = document.querySelector('.logo-container');
    if (logoContainer) {
      logoContainer.addEventListener('click', () => {
        if (window.appState?.currentView === 'issues') {
          navigationSystem.backToHome();
        }
      });
    }
  }

  _setupModalEventHandlers() {
    const modalCover = document.getElementById('modal-cover');
    if (modalCover) {
      modalCover.addEventListener('error', function () {
        window.handleImageError(this);
      });
    }
  }

  _setupFooterEventHandlers() {
    const footerEmail = document.getElementById('footer-email');
    if (footerEmail) {
      footerEmail.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
          window.sendEmailWithBody();
        }
      });
    }
  }

  _initializeModules() {
    searchSystem.init();
    viewControls.init();
    modalSystem.initEventListeners();
    navigationSystem.init();
  }

  setupBrowserNavigation() {
    window.addEventListener('popstate', (event) => {
      navigationSystem.handlePopState(event.state);
    });
  }

  handleDOMContentLoaded() {
    this.setupBrowserNavigation();
    const initialState = navigationSystem.parseURL();
    navigationSystem.navigateTo(initialState.view, initialState.identifier, initialState.isNumericId);
    new ControlsBarAutoHide();
  }

  getEventHandlerInfo() {
    return {
      hasLogoClickHandler: !!document.querySelector('.logo-container')?.onclick,
      hasModalCoverErrorHandler: !!document.getElementById('modal-cover')?.onerror,
      hasFooterEmailHandler: !!document.getElementById('footer-email')?.onkeypress,
      hasPopstateHandler: !!window.onpopstate,
      hasKeydownHandler: !!document.onkeydown,
      modules: {
        search: searchSystem.getSearchStats(),
        viewControls: viewControls.getStats(),
        autoHide: new ControlsBarAutoHide().getState()
      }
    };
  }
}

export const eventHandlers = new EventHandlers();
