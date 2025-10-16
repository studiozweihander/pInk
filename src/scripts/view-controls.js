import { VIEW_MODES, ANIMATION_TIMINGS } from "./constants.js";
import { appState } from "./state.js";
import { cardRenderer } from "./card-renderer.js";
import { uiUtils } from "./ui-utils.js";

export class ViewControls {
  constructor() {
    this.viewGridButton = document.getElementById("view-grid");
    this.viewListButton = document.getElementById("view-list");
    this.backButtonControls = document.getElementById("back-button");
  }

  init() {
    this._setupEventListeners();
    this._setupTooltips();
    this.loadViewModePreference();
  }

  _setupEventListeners() {
    if (this.backButtonControls) {
      this.backButtonControls.addEventListener("click", (e) => {
        e.preventDefault();
        this._navigateBack();
      });
    }

    if (this.viewGridButton) {
      this.viewGridButton.addEventListener("click", (e) => {
        e.preventDefault();
        if (appState.viewMode !== VIEW_MODES.GRID) {
          this._switchToGridView();
        }
      });
    }

    if (this.viewListButton) {
      this.viewListButton.addEventListener("click", (e) => {
        e.preventDefault();
        if (appState.viewMode !== VIEW_MODES.LIST) {
          this._switchToListView();
        }
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "1") {
          e.preventDefault();
          this._switchToGridView();
        } else if (e.key === "2") {
          e.preventDefault();
          this._switchToListView();
        }
      }

      if (e.key === "Escape" && appState.currentView === "issues") {
        const modal = document.getElementById("modal");
        if (!modal?.classList.contains("open")) {
          e.preventDefault();
          this._navigateBack();
        }
      }
    });

    const cardsContainer = document.getElementById("cards");
    if (cardsContainer) {
      cardsContainer.style.transition =
        "opacity 0.15s ease, transform 0.15s ease";
    }
  }

  _setupTooltips() {
    if (this.backButtonControls) {
      this.backButtonControls.setAttribute(
        "title",
        "Voltar para quadrinhos (ESC)"
      );
    }

    if (this.viewGridButton) {
      this.viewGridButton.setAttribute(
        "title",
        "Visualização em Grade (Ctrl+1)"
      );
    }

    if (this.viewListButton) {
      this.viewListButton.setAttribute(
        "title",
        "Visualização em Lista (Ctrl+2)"
      );
    }
  }

  _switchToGridView() {
    uiUtils.animateViewChange();
    setTimeout(() => {
      this.setViewMode(VIEW_MODES.GRID);
    }, ANIMATION_TIMINGS.FAST);
  }

  _switchToListView() {
    uiUtils.animateViewChange();
    setTimeout(() => {
      this.setViewMode(VIEW_MODES.LIST);
    }, ANIMATION_TIMINGS.FAST);
  }

  _navigateBack() {
    const { navigationSystem } = require("./navigation.js");
    navigationSystem.backToHome();
  }

  setViewMode(mode) {
    const previousMode = appState.viewMode;
    appState.viewMode = mode;

    if (this.viewGridButton && this.viewListButton) {
      this.viewGridButton.classList.remove("active");
      this.viewListButton.classList.remove("active");

      if (mode === VIEW_MODES.GRID) {
        this.viewGridButton.classList.add("active");
      } else {
        this.viewListButton.classList.add("active");
      }
    }

    const cardsContainer = document.getElementById("cards");
    if (cardsContainer) {
      cardsContainer.classList.toggle("list-view", mode === VIEW_MODES.LIST);
      if (appState.currentView === "home" && appState.allComics.length > 0) {
        cardRenderer.renderComics(appState.allComics);
      } else if (
        appState.currentView === "issues" &&
        appState.currentIssues.length > 0
      ) {
        cardRenderer.renderIssues(appState.currentIssues);
      }
    }

    try {
      window.viewModePreference = mode;
    } catch (e) {
      console.warn("Não foi possível salvar preferência:", e);
    }

    if (previousMode !== mode) {
      uiUtils.highlightActiveControl(mode);
    }
  }

  loadViewModePreference() {
    try {
      const savedMode = window.viewModePreference || VIEW_MODES.GRID;
      if (
        savedMode &&
        (savedMode === VIEW_MODES.GRID || savedMode === VIEW_MODES.LIST)
      ) {
        this.setViewMode(savedMode);
      }
    } catch (e) {
      console.warn("Não foi possível carregar preferência de visualização:", e);
      this.setViewMode(VIEW_MODES.GRID);
    }
  }

  getCurrentViewMode() {
    return appState.viewMode;
  }

  toggleViewMode() {
    const newMode =
      appState.viewMode === VIEW_MODES.GRID ? VIEW_MODES.LIST : VIEW_MODES.GRID;
    this.setViewMode(newMode);
  }

  isGridMode() {
    return appState.viewMode === VIEW_MODES.GRID;
  }

  isListMode() {
    return appState.viewMode === VIEW_MODES.LIST;
  }

  updateControlsVisibility() {
    if (appState.currentView === "home") {
      if (this.backButtonControls)
        this.backButtonControls.style.display = "none";
      const viewToggle = document.querySelector(".view-toggle");
      if (viewToggle) viewToggle.style.display = "flex";
    } else if (appState.currentView === "issues") {
      if (this.backButtonControls)
        this.backButtonControls.style.display = "flex";
      const viewToggle = document.querySelector(".view-toggle");
      if (viewToggle) viewToggle.style.display = "flex";
    } else if (
      appState.currentView === "about" ||
      appState.currentView === "how-to-use"
    ) {
      if (this.backButtonControls)
        this.backButtonControls.style.display = "flex";
      const viewToggle = document.querySelector(".view-toggle");
      if (viewToggle) viewToggle.style.display = "none";
    }
  }

  getStats() {
    return {
      currentMode: appState.viewMode,
      isGridMode: this.isGridMode(),
      isListMode: this.isListMode(),
      currentView: appState.currentView,
      hasGridButton: !!this.viewGridButton,
      hasListButton: !!this.viewListButton,
      hasBackButton: !!this.backButtonControls,
    };
  }
}

export const viewControls = new ViewControls();
