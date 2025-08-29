import './styles/style.css';
import { api } from './api.js';

console.log('🎨 pInk - Catálogo de Quadrinhos');

const PLACEHOLDER_IMAGE = 'https://placehold.co/300x450/242424/e78fde?text=Imagem+Não+Disponível&font=source-sans-pro';

let allComics = [];
let currentComic = null;
let currentIssues = [];
let currentIssueData = null;
let isLoading = false;
let currentView = 'home';
let viewMode = 'grid';

const cardsContainer = document.getElementById('cards');
const searchInput = document.getElementById('search');
const breadcrumb = document.getElementById('breadcrumb');
const logoContainer = document.querySelector('.logo-container');
const searchToggle = document.getElementById('search-toggle');
const searchInputContainer = document.getElementById('search-input-container');
const searchClose = document.getElementById('search-close');
const controlsBar = document.querySelector('.controls-bar');
const backButtonControls = document.getElementById('back-button');
const viewGridButton = document.getElementById('view-grid');
const viewListButton = document.getElementById('view-list');

function handleImageError(imgElement) {
  if (imgElement.dataset.errorHandled === 'true') return;
  
  const originalSrc = imgElement.src;
  
  console.log('❌ Erro ao carregar imagem:', originalSrc);
  
  if (originalSrc.includes('supabase.co/storage') && !imgElement.dataset.retried) {
    
    imgElement.dataset.retried = 'true';
    imgElement.dataset.errorHandled = 'false';
    
    const testImg = new Image();
    testImg.crossOrigin = 'anonymous';
    testImg.referrerPolicy = 'no-referrer';
    
    testImg.onload = function() {
      imgElement.src = originalSrc;
      imgElement.crossOrigin = 'anonymous';
      imgElement.referrerPolicy = 'no-referrer';
    };
    
    testImg.onerror = function() {
      imgElement.dataset.errorHandled = 'true';
      imgElement.src = PLACEHOLDER_IMAGE;
      imgElement.alt = 'Capa não disponível';
      imgElement.style.transition = 'opacity 0.3s ease';
      imgElement.style.opacity = '0.8';
    };
    
    testImg.src = originalSrc;
    return;
  }

  imgElement.dataset.errorHandled = 'true';
  imgElement.src = PLACEHOLDER_IMAGE;
  imgElement.alt = 'Capa não disponível';
  imgElement.style.transition = 'opacity 0.3s ease';
  imgElement.style.opacity = '0.8';
}

function showLoading() {
  isLoading = true;
  cardsContainer.className = 'cards state-message';
  cardsContainer.innerHTML = `
    <div class="loading">
      <div class="loading-spinner"></div>
      <p>Carregando quadrinhos...</p>
    </div>
  `;
}

function showError(message) {
  cardsContainer.className = 'cards state-message';
  cardsContainer.innerHTML = `
    <div class="error">
      <h3>❌ Erro ao carregar quadrinhos</h3>
      <p>${message}</p>
      <button onclick="location.reload()" class="retry-btn">Tentar novamente</button>
    </div>
  `;
}

function showEmptyState(type = 'quadrinhos') {
  cardsContainer.className = 'cards state-message';
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
  cardsContainer.innerHTML = `
    <div class="empty-state">
      <h3>${msg.icon} ${msg.title}</h3>
      <p>${msg.subtitle}</p>
    </div>
  `;
}

function createComicCard(comic) {
  const metaInfo = [
    `Lançamento: ${comic.year || 'N/A'}`,
    `Edições: ${comic.total_issues || 0}`,
    `Idioma: ${comic.language || 'N/A'}`,
    `Editora: ${comic.publisher || 'N/A'}`
  ].join(' | ');
  
  return `
    <div class="card" data-id="${comic.id}" onclick="viewComicIssues(${comic.id})">
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

function createIssueCard(issue) {
  const genres = Array.isArray(issue.genres) 
    ? issue.genres.join(', ') 
    : (issue.genres || '').replace(/,/g, ', ');
    
  const metaInfo = [
    `Ano: ${issue.year || 'N/A'}`,
    `Tamanho: ${issue.size || 'N/A'}`,
    `Gêneros: ${genres || 'N/A'}`
  ].join(' | ');
  
  return `
    <div class="card" data-id="${issue.id}" onclick="viewIssueDetails(${issue.id})">
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

function renderComics(comics) {
  if (comics.length === 0) {
    showEmptyState('quadrinhos');
    return;
  }

  cardsContainer.className = `cards has-content${viewMode === 'list' ? ' list-view' : ''}`;
  cardsContainer.innerHTML = comics.map(createComicCard).join('');
}

function renderIssues(issues) {
  if (issues.length === 0) {
    showEmptyState('edicoes');
    return;
  }

  cardsContainer.className = `cards has-content${viewMode === 'list' ? ' list-view' : ''}`;
  cardsContainer.innerHTML = issues.map(createIssueCard).join('');
}

async function loadAllComics() {
  if (isLoading) return;
  
  showLoading();
  
  if (controlsBar) {
    controlsBar.style.opacity = '0.7';
  }
  
  try {
    const isOnline = await api.healthCheck();
    if (!isOnline) {
      throw new Error('Backend não está respondendo. Execute "npm start" em outro terminal.');
    }
    
    const response = await api.getAllComics();
    allComics = response.data;
    renderComics(allComics);
    
    if (controlsBar) {
      controlsBar.style.opacity = '1';
    }
    
    if (viewMode === 'list') {
      cardsContainer.classList.add('list-view');
    }
    
    setTimeout(() => {
      if (currentView === 'home') {
        console.log('💡 Dicas: Ctrl+1 (Grade), Ctrl+2 (Lista), ESC (Voltar)');
      }
    }, 2000);
    
  } catch (error) {
    console.error('❌ Erro ao carregar quadrinhos:', error);
    showError(error.message);
    
    if (controlsBar) {
      controlsBar.style.opacity = '1';
    }
  } finally {
    isLoading = false;
  }
}

async function loadComicIssues(comicId) {
  if (isLoading) return;
  showLoading();
  
  try {
    const [comicResponse, issuesResponse] = await Promise.all([
      api.getComicById(comicId),
      api.getComicIssues(comicId)
    ]);
    
    currentComic = comicResponse.data;
    currentIssues = issuesResponse.data;
    
    console.log('✅ Dados carregados:', { comic: currentComic, issues: currentIssues.length });
    
    renderIssues(currentIssues);
    updateHeader();
    
  } catch (error) {
    console.error('❌ Erro ao carregar edições:', error);
    showError(error.message);
    currentComic = null;
    currentIssues = [];
  } finally {
    isLoading = false;
  }
}

function filterComics(searchTerm) {
  if (!searchTerm.trim()) {
    renderComics(allComics);
    return;
  }
  
  const searchLower = searchTerm.toLowerCase();
  const filtered = allComics.filter(comic => 
    comic.title.toLowerCase().includes(searchLower) ||
    (comic.publisher || '').toLowerCase().includes(searchLower) ||
    (comic.language || '').toLowerCase().includes(searchLower)
  );
  
  renderComics(filtered);
}

function filterIssues(searchTerm) {
  if (!currentIssues || currentIssues.length === 0) return;
  
  if (!searchTerm.trim()) {
    renderIssues(currentIssues);
    return;
  }
  
  const searchLower = searchTerm.toLowerCase().trim();
  const filtered = currentIssues.filter(issue => {
    const searchableText = [
      issue.title || '',
      issue.series || '',
      Array.isArray(issue.genres) ? issue.genres.join(' ') : (issue.genres || ''),
      issue.issueNumber?.toString() || '',
      issue.year?.toString() || ''
    ].join(' ').toLowerCase();
    
    return searchableText.includes(searchLower);
  });
  renderIssues(filtered);
}

function updateControlsVisibility() {
  if (currentView === 'home') {
    backButtonControls.style.display = 'none';
    document.querySelector('.view-toggle').style.display = 'flex';
  } else if (currentView === 'issues') {
    backButtonControls.style.display = 'flex';
    document.querySelector('.view-toggle').style.display = 'flex';
  }
}

function updateHeader() {
  if (currentView === 'home') {
    breadcrumb.textContent = '';
    searchInput.placeholder = 'Buscar quadrinho...';
    logoContainer.classList.remove('has-navigation');
    logoContainer.style.cursor = 'default';
  } else if (currentView === 'issues' && currentComic) {
    breadcrumb.textContent = `${currentComic.title} (${currentComic.year || 'N/A'})`;
    searchInput.placeholder = 'Buscar edição...';
    logoContainer.classList.add('has-navigation');
    logoContainer.style.cursor = 'pointer';
  }
  
  updateControlsVisibility();
}

window.viewComicIssues = function(comicId) {
  currentView = 'issues';
  searchInput.value = '';
  loadComicIssues(comicId);
};

window.backToHome = function() {
  if (currentView === 'home') return;

  currentView = 'home';
  currentComic = null;
  currentIssues = [];
  searchInput.value = '';
  
  renderComics(allComics);
  updateHeader();
};

window.viewIssueDetails = async function(issueId) {
  await openModal(issueId);
};

async function openModal(issueId) {
  const modal = document.getElementById('modal');
  const elements = {
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

  modal.classList.add('open');
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
  
  try {
    const response = await api.getIssueById(issueId);
    currentIssueData = response.data;
    
    elements.title.textContent = currentIssueData.title || 'Título não disponível';
    elements.cover.alt = currentIssueData.title || 'Capa da edição';
    elements.cover.src = currentIssueData.cover || PLACEHOLDER_IMAGE;
    elements.synopsis.textContent = currentIssueData.synopsis || 'Sinopse não disponível para esta edição.';
    
    const metadata = {
      series: currentIssueData.series,
      genres: Array.isArray(currentIssueData.genres) 
        ? currentIssueData.genres.join(', ') 
        : (currentIssueData.genres || '').replace(/,/g, ', '),
      year: currentIssueData.year,
      size: currentIssueData.size,
      language: currentIssueData.language
    };
    
    Object.entries(metadata).forEach(([key, value]) => {
      elements[key].textContent = value || 'N/A';
    });
    
    if (currentIssueData.size) {
      elements.downloadSize.textContent = `(${currentIssueData.size})`;
    }

    handleCreditsDisplay(currentIssueData, elements);
    
  } catch (error) {
    elements.creditsItem.style.display = 'none';
    elements.modalCredits.textContent = 'Não informado';
  }
}

function handleCreditsDisplay(issueData, elements) {
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

function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

window.handleCreditsDisplay = handleCreditsDisplay;
window.isValidUrl = isValidUrl;

window.closeModal = function() {
  const modal = document.getElementById('modal');
  modal.classList.remove('open');
  
  setTimeout(() => {
    currentIssueData = null;
  }, 300);
};

window.downloadIssue = function() {
  if (!currentIssueData?.link) {
    alert('❌ Link de download não disponível para esta edição.');
    return;
  }
  window.open(currentIssueData.link, '_blank');
};

function toggleMobileSearch(show) {
  if (show) {
    searchInputContainer.classList.add('active');
    searchInput.focus();
  } else {
    searchInputContainer.classList.remove('active');
    searchInput.blur();
  }
}

function loadViewModePreference() {
  try {
    const savedMode = window.viewModePreference || 'grid';
    if (savedMode && (savedMode === 'grid' || savedMode === 'list')) {
      setViewMode(savedMode);
    }
  } catch (e) {
    console.warn('Não foi possível carregar preferência de visualização:', e);
    setViewMode('grid');
  }
}

function animateViewChange() {
  cardsContainer.style.opacity = '0.7';
  cardsContainer.style.transform = 'scale(0.98)';
  
  setTimeout(() => {
    cardsContainer.style.opacity = '1';
    cardsContainer.style.transform = 'scale(1)';
  }, 150);
}

function highlightActiveControl(mode) {
  const activeButton = mode === 'grid' ? viewGridButton : viewListButton;
  
  activeButton.style.transform = 'scale(1.1)';
  activeButton.style.boxShadow = '0 0 8px rgba(231, 143, 222, 0.5)';
  
  setTimeout(() => {
    activeButton.style.transform = '';
    activeButton.style.boxShadow = '';
  }, 300);
}

window.setViewMode = function(mode) {
  const previousMode = viewMode;
  viewMode = mode;
  
  viewGridButton.classList.toggle('active', mode === 'grid');
  viewListButton.classList.toggle('active', mode === 'list');
  
  cardsContainer.classList.toggle('list-view', mode === 'list');
  
  try {
    window.viewModePreference = mode;
  } catch (e) {
    console.warn('Não foi possível salvar preferência:', e);
  }
  
  if (previousMode !== mode) {
    highlightActiveControl(mode);
  }
};

function initializeControlsBar() {
  if (backButtonControls) {
    backButtonControls.addEventListener('click', (e) => {
      e.preventDefault();
      backToHome();
    });
  }
  
  if (viewGridButton) {
    viewGridButton.addEventListener('click', (e) => {
      e.preventDefault();
      if (viewMode !== 'grid') {
        animateViewChange();
        setTimeout(() => setViewMode('grid'), 75);
      }
    });
  }
  
  if (viewListButton) {
    viewListButton.addEventListener('click', (e) => {
      e.preventDefault();
      if (viewMode !== 'list') {
        animateViewChange();
        setTimeout(() => setViewMode('list'), 75);
      }
    });
  }
  
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === '1') {
        e.preventDefault();
        animateViewChange();
        setTimeout(() => setViewMode('grid'), 75);
      } else if (e.key === '2') {
        e.preventDefault();
        animateViewChange();
        setTimeout(() => setViewMode('list'), 75);
      }
    }
    
    if (e.key === 'Escape' && currentView === 'issues') {
      const modal = document.getElementById('modal');
      if (!modal.classList.contains('open')) {
        e.preventDefault();
        backToHome();
      }
    }
  });
  
  cardsContainer.style.transition = 'opacity 0.15s ease, transform 0.15s ease';
}

function initializeTooltips() {
  if (backButtonControls) {
    backButtonControls.setAttribute('title', 'Voltar para quadrinhos (ESC)');
  }
  
  if (viewGridButton) {
    viewGridButton.setAttribute('title', 'Visualização em Grade (Ctrl+1)');
  }
  
  if (viewListButton) {
    viewListButton.setAttribute('title', 'Visualização em Lista (Ctrl+2)');
  }
}

class ControlsBarAutoHide {
  constructor() {
    this.controlsBar = document.querySelector('.controls-bar');
    this.scrollableContent = document.querySelector('.scrollable-content');
    
    if (!this.controlsBar) return;
    
    this.lastScrollTop = 0;
    this.isHidden = false;
    this.scrollThreshold = 50
    this.hideTimeout = null;
    this.showTimeout = null;
    
    this.init();
  }
  
  init() {
    this.setupStyles();
    
    this.bindScrollListeners();
    
    window.addEventListener('resize', () => this.setupStyles());
  }
  
  setupStyles() {
    if (!this.controlsBar) return;
    
    this.controlsBar.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease';
    this.controlsBar.style.transform = 'translateY(0)';
    this.controlsBar.style.opacity = '1';
    
    const computedStyle = getComputedStyle(this.controlsBar);
    if (computedStyle.position !== 'sticky' && computedStyle.position !== 'fixed') {
      this.controlsBar.style.position = 'relative';
      this.controlsBar.style.zIndex = '10';
    }
  }
  
  bindScrollListeners() {

    let ticking = false;
    
    const handleScroll = (scrollElement) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.onScroll(scrollElement);
          ticking = false;
        });
        ticking = true;
      }
    };
    

    if (this.scrollableContent) {
      this.scrollableContent.addEventListener('scroll', () => {
        handleScroll(this.scrollableContent);
      }, { passive: true });
    }
    
    window.addEventListener('scroll', () => {
  
      if (!this.scrollableContent || this.scrollableContent.scrollHeight <= this.scrollableContent.clientHeight) {
        handleScroll(window);
      }
    }, { passive: true });
  }
  
  onScroll(scrollElement) {
    if (!this.controlsBar) return;
    
    const currentScrollTop = scrollElement === window 
      ? window.pageYOffset || document.documentElement.scrollTop
      : scrollElement.scrollTop;
    
    if (currentScrollTop <= 10) {
      this.showControls();
      this.lastScrollTop = currentScrollTop;
      return;
    }
    
    const scrollDifference = Math.abs(currentScrollTop - this.lastScrollTop);
    
    if (scrollDifference < this.scrollThreshold) {
      return;
    }

    if (currentScrollTop > this.lastScrollTop && !this.isHidden) {
      this.hideControls();
    }

    else if (currentScrollTop < this.lastScrollTop && this.isHidden) {
      this.showControls();
    }
    
    this.lastScrollTop = currentScrollTop;
  }
  
  hideControls() {
    if (!this.controlsBar || this.isHidden) return;
    
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
    
    this.hideTimeout = setTimeout(() => {
      if (!this.controlsBar) return;
      
      const controlsHeight = this.controlsBar.offsetHeight;
      const container = document.querySelector('.container');
      
      this.controlsBar.style.transform = 'translateY(100%)';
      this.controlsBar.style.opacity = '0';
      
      if (container) {
        container.style.transition = 'margin-top 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        container.style.marginTop = `calc(-${controlsHeight}px + 10px)`;
      }
      
      this.isHidden = true;
      
      this.controlsBar.classList.add('controls-hidden');
      
      console.log('🫥 Controls hidden');
    }, 100);
  }
  
  showControls() {
    if (!this.controlsBar || !this.isHidden) return;
    
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
    
    this.showTimeout = setTimeout(() => {
      if (!this.controlsBar) return;
      
      const container = document.querySelector('.container');
      
      this.controlsBar.style.transform = 'translateY(0)';
      this.controlsBar.style.opacity = '1';
      
      if (container) {
        container.style.transition = 'margin-bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        container.style.marginTop = '';
      }
      
      this.isHidden = false;
      
      this.controlsBar.classList.remove('controls-hidden');
    }, 50);
  }
  
  forceShow() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
    
    const container = document.querySelector('.container');
    if (container) {
      container.style.marginTop = '';
    }
    
    this.showControls();
  }
  
  reset() {
    this.lastScrollTop = 0;
    this.isHidden = false;
    
    const container = document.querySelector('.container');
    if (container) {
      container.style.transition = '';
      container.style.marginTop = '';
    }
    
    this.forceShow();
  }
  
  destroy() {
    if (this.hideTimeout) clearTimeout(this.hideTimeout);
    if (this.showTimeout) clearTimeout(this.showTimeout);
    
    if (this.controlsBar) {
      this.controlsBar.style.transform = '';
      this.controlsBar.style.opacity = '';
      this.controlsBar.classList.remove('controls-hidden');
    }
    
    const container = document.querySelector('.container');
    if (container) {
      container.style.transition = '';
      container.style.marginTop = '';
    }
  }
}
let controlsAutoHide = null;
function initializeControlsAutoHide() {
  if (controlsAutoHide) {
    controlsAutoHide.destroy();
  }
  
  controlsAutoHide = new ControlsBarAutoHide();
}
function enhancedBackToHome() {
  if (currentView === 'home') return;

  currentView = 'home';
  currentComic = null;
  currentIssues = [];
  searchInput.value = '';
  
  renderComics(allComics);
  updateHeader();
  
  if (controlsAutoHide) {
    controlsAutoHide.reset();
  }
}

function enhancedViewComicIssues(comicId) {
  currentView = 'issues';
  searchInput.value = '';
  loadComicIssues(comicId);
  
  if (controlsAutoHide) {
    setTimeout(() => {
      if (controlsAutoHide) {
        controlsAutoHide.reset();
      }
    }, 100);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  function handleSearchInput(e) {
    const searchTerm = e.target.value;
    
    if (currentView === 'home') {
      filterComics(searchTerm);
    } else if (currentView === 'issues') {
      filterIssues(searchTerm);
    }
  }
  
  ['input', 'keyup'].forEach(event => {
    searchInput.addEventListener(event, handleSearchInput);
  });
  
  searchInput.addEventListener('paste', (e) => {
    setTimeout(() => handleSearchInput(e), 10);
  });

  searchToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMobileSearch(true);
  });
  
  searchClose.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMobileSearch(false);
  });

  document.addEventListener('click', (e) => {
    if (!searchInputContainer.contains(e.target) && !searchToggle.contains(e.target)) {
      if (searchInputContainer.classList.contains('active')) {
        toggleMobileSearch(false);
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('modal');
      if (modal.classList.contains('open')) {
        closeModal();
      } else if (searchInputContainer.classList.contains('active')) {
        toggleMobileSearch(false);
      }
    }
  });

  document.getElementById('modal-cover').addEventListener('error', function() {
    handleImageError(this);
  });

  logoContainer.addEventListener('click', () => {
    if (currentView === 'issues') {
      backToHome();
    }
  });

  initializeControlsBar();
  initializeTooltips();
  loadViewModePreference();
  
  setTimeout(() => {
    initializeControlsAutoHide();
  }, 500);
  
  loadAllComics();
});

window.backToHome = enhancedBackToHome;
window.viewComicIssues = enhancedViewComicIssues;
window.handleImageError = handleImageError;
window.api = api;
window.loadAllComics = loadAllComics;
window.controlsAutoHide = () => controlsAutoHide;