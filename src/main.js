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

const cardsContainer = document.getElementById('cards');
const searchInput = document.getElementById('search');
const breadcrumb = document.getElementById('breadcrumb');
const logoContainer = document.querySelector('.logo-container');
const searchToggle = document.getElementById('search-toggle');
const searchInputContainer = document.getElementById('search-input-container');
const searchClose = document.getElementById('search-close');

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

  cardsContainer.className = 'cards has-content';
  cardsContainer.innerHTML = comics.map(createComicCard).join('');
}

function renderIssues(issues) {
  if (issues.length === 0) {
    showEmptyState('edicoes');
    return;
  }

  cardsContainer.className = 'cards has-content';
  cardsContainer.innerHTML = issues.map(createIssueCard).join('');
}

async function loadAllComics() {
  if (isLoading) return;
  
  showLoading();
  
  try {
    const isOnline = await api.healthCheck();
    if (!isOnline) {
      throw new Error('Backend não está respondendo. Execute "npm start" em outro terminal.');
    }
    
    const response = await api.getAllComics();
    allComics = response.data;
    renderComics(allComics);
    
  } catch (error) {
    console.error('❌ Erro ao carregar quadrinhos:', error);
    showError(error.message);
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
    elements.creditsSection.style.display = 'none';
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
      if (document.getElementById('modal').classList.contains('open')) {
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
  

  loadAllComics();
});

window.handleImageError = handleImageError;
window.api = api;
window.loadAllComics = loadAllComics;