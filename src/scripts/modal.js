import { PLACEHOLDER_IMAGE } from './constants.js';
import { appState } from './state.js';
import { isValidUrl } from './api-utils.js';

export class ModalSystem {
  constructor() {
    this.api = window.api;
  }

  async openModal(issueId) {
    const modal = document.getElementById('modal');
    const elements = this._getModalElements();

    if (!modal || !elements) return;

    modal.classList.add('open');
    this._setLoadingState(elements);

    try {
      const response = await this.api.getIssueById(issueId);
      appState.currentIssueData = response.data;

      this._populateModalContent(elements, response.data);

    } catch (error) {
      this._setErrorState(elements);
    }
  }

  closeModal() {
    const modal = document.getElementById('modal');
    if (!modal) return;

    modal.classList.remove('open');

    setTimeout(() => {
      appState.currentIssueData = null;
    }, 300);
  }

  _getModalElements() {
    const modal = document.getElementById('modal');
    if (!modal) return null;

    return {
      title: document.getElementById('modal-title'),
      cover: document.getElementById('modal-cover'),
      synopsis: document.getElementById('modal-synopsis'),
      series: document.getElementById('modal-series'),
      genres: document.getElementById('modal-genres'),
      year: document.getElementById('modal-year'),
      size: document.getElementById('modal-size'),
      language: document.getElementById('modal-language'),
      downloadSize: document.getElementById('download-size'),
      creditsItem: document.getElementById('credits-item'),
      modalCredits: document.getElementById('modal-credits')
    };
  }

  _setLoadingState(elements) {
    elements.title.textContent = 'Carregando...';
    elements.synopsis.textContent = 'Carregando informações...';

    ['series', 'genres', 'year', 'size', 'language'].forEach(key => {
      elements[key].textContent = '-';
    });
    elements.downloadSize.textContent = '';

    elements.creditsItem.style.display = 'none';
    elements.modalCredits.textContent = '-';
    elements.modalCredits.className = '';
    elements.modalCredits.onclick = null;

    elements.cover.src = PLACEHOLDER_IMAGE;
    elements.cover.alt = 'Carregando...';
    elements.cover.dataset.errorHandled = 'false';
    elements.cover.style.transition = 'opacity 0.3s ease';
    elements.cover.style.opacity = '1';
  }

  _populateModalContent(elements, issueData) {
    elements.title.textContent = issueData.title || 'Título não disponível';
    elements.cover.alt = issueData.title || 'Capa da edição';
    elements.cover.src = issueData.cover || PLACEHOLDER_IMAGE;
    elements.synopsis.textContent = issueData.synopsis || 'Sinopse não disponível para esta edição.';

    const metadata = {
      series: issueData.series,
      genres: Array.isArray(issueData.genres)
        ? issueData.genres.join(', ')
        : (issueData.genres || '').replace(/,/g, ', '),
      year: issueData.year,
      size: issueData.size,
      language: issueData.language
    };

    Object.entries(metadata).forEach(([key, value]) => {
      elements[key].textContent = value || 'N/A';
    });
    if (issueData.size) {
      elements.downloadSize.textContent = `(${issueData.size})`;
    }

    this._handleCreditsDisplay(issueData, elements);
  }

  _handleCreditsDisplay(issueData, elements) {
    const { credito, creditoLink } = issueData;

    if (!credito || credito.trim() === '') {
      elements.creditsItem.style.display = 'none';
      return;
    }

    elements.creditsItem.style.display = 'flex';

    if (creditoLink && creditoLink.trim() !== '' && isValidUrl(creditoLink)) {
      elements.modalCredits.textContent = credito;
      elements.modalCredits.className = 'credits-link clickable';
      elements.modalCredits.onclick = () => {
        try {
          window.open(creditoLink, '_blank', 'noopener,noreferrer');
        } catch (error) {
          console.warn('❌ Erro ao abrir link de créditos:', error);
          alert('❌ Não foi possível abrir o link de créditos.');
        }
      };
      elements.modalCredits.setAttribute('aria-label', `Abrir site do ${credito}`);
      elements.modalCredits.setAttribute('title', `Clique para visitar ${creditoLink}`);
    } else {
      elements.modalCredits.textContent = credito;
      elements.modalCredits.className = 'credits-link';
      elements.modalCredits.onclick = null;
      elements.modalCredits.removeAttribute('aria-label');
      elements.modalCredits.removeAttribute('title');
    }
  }

  _setErrorState(elements) {
    elements.creditsItem.style.display = 'none';
    elements.modalCredits.textContent = 'Não informado';
  }
  downloadIssue() {
    if (!appState.currentIssueData?.link) {
      alert('❌ Link de download não disponível para esta edição.');
      return;
    }
    window.open(appState.currentIssueData.link, '_blank');
  }

  initEventListeners() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modal = document.getElementById('modal');
        if (modal?.classList.contains('open')) {
          this.closeModal();
        }
      }
    });

    document.addEventListener('click', (e) => {
      const modal = document.getElementById('modal');
      if (modal?.classList.contains('open') && e.target === modal) {
        this.closeModal();
      }
    });
  }
}

export const modalSystem = new ModalSystem();
