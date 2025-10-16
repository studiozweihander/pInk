import { appState } from "./state.js";
import { navigationSystem } from "./navigation.js";
import { eventHandlers } from "./event-handlers.js";
import { filterSystem } from "./filters.js";
import { modalSystem } from "./modal.js";
import { searchSystem } from "./search.js";
import { viewControls } from "./view-controls.js";
import { handleImageError } from "./api-utils.js";
import { ControlsBarAutoHide } from "./auto-hide.js";

export class App {
  constructor() {
    this.api = window.api;
  }

  async init() {
    try {
      eventHandlers.init();

      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
          this._handleDOMContentLoaded();
        });
      } else {
        this._handleDOMContentLoaded();
      }

      this._exposeGlobalFunctions();
    } catch (error) {
      throw error;
    }
  }

  _handleDOMContentLoaded() {
    window.addEventListener("popstate", (event) => {
      navigationSystem.handlePopState(event.state);
    });

    const initialState = navigationSystem.parseURL();
    navigationSystem.navigateTo(
      initialState.view,
      initialState.identifier,
      initialState.isNumericId
    );

    new ControlsBarAutoHide();
  }

  _exposeGlobalFunctions() {
    window.viewComicIssues = (identifier) =>
      navigationSystem.viewComicIssues(identifier);
    window.backToHome = () => navigationSystem.backToHome();

    window.viewIssueDetails = async (issueId) => {
      await modalSystem.openModal(issueId);
    };
    window.closeModal = () => {
      modalSystem.closeModal();
    };
    window.downloadIssue = () => {
      modalSystem.downloadIssue();
    };

    window.toggleFilters = () => {
      const dropdown = document.getElementById("filter-dropdown");
      const isOpen = dropdown?.classList.contains("open");
      filterSystem.toggleFilters(!isOpen);
    };
    window.toggleFilter = (type, value) =>
      filterSystem.toggleFilter(type, value);
    window.toggleIssueFilter = (type, value) =>
      filterSystem.toggleIssueFilter(type, value);
    window.clearFilter = (type) => filterSystem.clearFilter(type);
    window.clearAllFilters = () => filterSystem.clearAllFilters();

    window.setViewMode = (mode) => viewControls.setViewMode(mode);

    window.handleImageError = (imgElement) => {
      handleImageError(imgElement);
    };
    window.api = this.api;
    window.loadAllComics = () => navigationSystem.loadAllComics();

    window.sendEmailWithBody = () => {
      const emailContent = document.getElementById("footer-email")?.value;
      if (!emailContent?.trim()) {
        alert("Por favor, digite sua solicitação antes de enviar.");
        return;
      }

      const encodedContent = encodeURIComponent(emailContent);
      const mailtoURL = `mailto:comics.pink@gmail.com?subject=Solicitação de quadrinho&body=Olá, eu gostaria que vocês adicionassem o seguinte quadrinho: ${encodedContent}`;
      window.location.href = mailtoURL;
    };

    window.appState = appState;
    window.pInk = this;
  }

  getStatus() {
    return {
      initialized: true,
      currentView: appState.currentView,
      viewMode: appState.viewMode,
      isLoading: appState.isLoading,
      hasActiveFilters: appState.getActiveFilterCount(),
      totalComics: appState.allComics?.length || 0,
      totalIssues: appState.currentIssues?.length || 0,
      modules: {
        state: appState.toJSON(),
        navigation: {
          canGoBack: appState.currentView !== "home",
          currentPath: window.location.pathname,
        },
        filters: {
          activeCount: appState.getActiveFilterCount(),
          hasFilters: appState.hasActiveFilters(),
        },
      },
    };
  }

  restart() {
    window.location.reload();
  }

  debug() {
    console.group("🐛 pInk Debug Information");
    console.log("App Status:", this.getStatus());
    console.log("Event Handlers:", eventHandlers.getEventHandlerInfo());
    console.log("Search Stats:", searchSystem.getSearchStats());
    console.log("View Controls Stats:", viewControls.getStats());
    console.log("Auto-hide State:", new ControlsBarAutoHide().getState());
    console.groupEnd();
  }
}

export const app = new App();
