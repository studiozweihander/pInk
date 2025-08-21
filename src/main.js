import './styles/style.css';
import { api } from './api.js';

console.log('🎨 pInk - Catálogo de Quadrinhos');

let allComics = [];
let currentComic = null;
let currentIssues = [];
let isLoading = false;
let currentView = 'home';

const cardsContainer = document.getElementById('cards');
const searchInput = document.getElementById('search');
const breadcrumb = document.getElementById('breadcrumb');
const logoContainer = document.querySelector('.logo-container');
const searchToggle = document.getElementById('search-toggle');
const searchInputContainer = document.getElementById('search-input-container');
const searchClose = document.getElementById('search-close');

function showLoading() {
  isLoading = true;
  cardsContainer.innerHTML = `
    <div class="loading">
      <div class="loading-spinner"></div>
      <p>Carregando quadrinhos...</p>
    </div>
  `;
}

function showError(message) {
  cardsContainer.innerHTML = `
    <div class="error">
      <h3>❌ Erro ao carregar quadrinhos</h3>
      <p>${message}</p>
      <button onclick="location.reload()" class="retry-btn">Tentar novamente</button>
    </div>
  `;
}

function handleImageError(imgElement, fallbackSrc = '/assets/covers/default.jpg') {
  if (imgElement.dataset.errorHandled === 'true') {
    console.log('🖼️ Imagem já processada para erro:', imgElement.src);
    return;
  }
  
  imgElement.dataset.errorHandled = 'true';
  
  console.log('❌ Erro ao carregar imagem:', imgElement.src);
  console.log('🔄 Tentando fallback:', fallbackSrc);
  
  imgElement.src = fallbackSrc;
  
  setTimeout(() => {
    if (imgElement.dataset.errorHandled === 'true' && imgElement.src.includes('default.jpg')) {
      imgElement.style.opacity = '0.5';
      imgElement.alt = 'Imagem não disponível';
    }
  }, 1000);
}

function createComicCard(comic) {
  const year = comic.year || '';
  const issues = comic.total_issues || 0;
  const metaText = `Lançamento: ${year} | Edições: ${issues} | Idioma: ${comic.language} | Editora: ${comic.publisher}`;
  
  return `
    <div class="card" data-id="${comic.id}" onclick="viewComicIssues(${comic.id})">
      <div class="card-image">
        <img src="${comic.cover || '/assets/covers/default.jpg'}" alt="${comic.title}" 
             data-error-handled="false"
             onerror="handleImageError(this)">
      </div>
      <div class="card-info">
        <h3 class="card-title">${comic.title}</h3>
        <div class="card-meta">${metaText}</div>
      </div>
    </div>
  `;
}

function createIssueCard(issue) {
  const year = issue.year || '';
  const size = issue.size || '';
  const genres = issue.genres ? 
    (Array.isArray(issue.genres) ? issue.genres.join(', ') : issue.genres.replace(/,/g, ', ')) 
    : '';
  const metaText = `Ano: ${year} | Tamanho: ${size} | Gêneros: ${genres}`;
  
  return `
    <div class="card" data-id="${issue.id}" onclick="viewIssueDetails(${issue.id})">
      <div class="card-image">
        <img src="${issue.cover || '/assets/covers/default.jpg'}" alt="${issue.title}" 
             data-error-handled="false"
             onerror="handleImageError(this)">
      </div>
      <div class="card-info">
        <h3 class="card-title">${issue.title}</h3>
        <div class="card-meta">${metaText}</div>
      </div>
    </div>
  `;
}

function renderComics(comics) {
  if (comics.length === 0) {
    cardsContainer.innerHTML = `
      <div class="empty-state">
        <h3>📚 Nenhum quadrinho encontrado</h3>
        <p>Verifique sua busca ou este quadrinho ainda não foi adicionado.</p>
      </div>
    `;
    return;
  }

  const cardsHTML = comics.map(createComicCard).join('');
  cardsContainer.innerHTML = cardsHTML;
}

function renderIssues(issues, comic) {
  if (issues.length === 0) {
    cardsContainer.innerHTML = `
      <div class="empty-state">
        <h3>📖 Nenhuma edição encontrada</h3>
        <p>Este quadrinho ainda não possui edições cadastradas.</p>
      </div>
    `;
    return;
  }

  const issuesHTML = issues.map(createIssueCard).join('');
  cardsContainer.innerHTML = issuesHTML;
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

function filterComics(searchTerm) {
  if (!searchTerm.trim()) {
    renderComics(allComics);
    return;
  }
  
  const filtered = allComics.filter(comic => 
    comic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (comic.publisher && comic.publisher.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (comic.language && comic.language.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  renderComics(filtered);
}

function filterIssues(searchTerm) {
  console.log('🔍 Filtrando edições. Termo:', searchTerm);
  console.log('📚 Current Issues:', currentIssues);
  console.log('🎯 Current Comic:', currentComic);
  
  if (!currentIssues || currentIssues.length === 0) {
    console.warn('⚠️ Nenhuma edição carregada para filtrar');
    return;
  }
  
  if (!currentComic) {
    console.warn('⚠️ Quadrinho atual não definido');
    return;
  }
  
  if (!searchTerm.trim()) {
    console.log('✅ Mostrando todas as edições');
    renderIssues(currentIssues, currentComic);
    return;
  }
  
  const searchLower = searchTerm.toLowerCase().trim();
  
  const filtered = currentIssues.filter(issue => {
    if (issue.title && issue.title.toLowerCase().includes(searchLower)) {
      return true;
    }
    
    if (issue.series && issue.series.toLowerCase().includes(searchLower)) {
      return true;
    }
    
    if (issue.genres) {
      let genresStr = '';
      if (Array.isArray(issue.genres)) {
        genresStr = issue.genres.join(' ').toLowerCase();
      } else if (typeof issue.genres === 'string') {
        genresStr = issue.genres.toLowerCase();
      }
      if (genresStr.includes(searchLower)) {
        return true;
      }
    }
    
    if (issue.issueNumber && issue.issueNumber.toString().includes(searchTerm)) {
      return true;
    }
    
    if (issue.year && issue.year.toString().includes(searchTerm)) {
      return true;
    }
    
    return false;
  });
  
  console.log(`📋 Encontradas ${filtered.length} edições de ${currentIssues.length}`);
  renderIssues(filtered, currentComic);
}

async function loadComicIssues(comicId) {
  if (isLoading) return;
  
  console.log('📚 Carregando edições para quadrinho ID:', comicId);
  showLoading();
  
  try {
    const [comicResponse, issuesResponse] = await Promise.all([
      api.getComicById(comicId),
      api.getComicIssues(comicId)
    ]);
    
    currentComic = comicResponse.data;
    currentIssues = issuesResponse.data;
    
    console.log('✅ Dados carregados:');
    console.log('🎯 Comic:', currentComic);
    console.log('📖 Issues:', currentIssues);
    
    renderIssues(currentIssues, currentComic);
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
  console.log('🎯 Navegando para edições do quadrinho ID:', comicId);
  currentView = 'issues';
  searchInput.value = '';
  console.log('📍 View alterada para:', currentView);
  loadComicIssues(comicId);
};

window.backToHome = function() {
  if (currentView === 'home') return;
  
  console.log('🏠 Voltando para home');
  currentView = 'home';
  currentComic = null;
  currentIssues = [];
  searchInput.value = '';
  console.log('📍 View alterada para:', currentView);
  
  renderComics(allComics);
  updateHeader();
};

let currentIssueData = null;

window.viewIssueDetails = async function(issueId) {
  await openModal(issueId);
};

async function openModal(issueId) {
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modal-title');
  const modalCover = document.getElementById('modal-cover');
  const modalSynopsis = document.getElementById('modal-synopsis');
  const modalSeries = document.getElementById('modal-series');
  const modalGenres = document.getElementById('modal-genres');
  const modalYear = document.getElementById('modal-year');
  const modalSize = document.getElementById('modal-size');
  const modalLanguage = document.getElementById('modal-language');
  const downloadSize = document.getElementById('download-size');
  
  modal.classList.add('open');
  modalTitle.textContent = 'Carregando...';
  modalSynopsis.textContent = 'Carregando informações...';
  
  modalSeries.textContent = '-';
  modalGenres.textContent = '-';
  modalYear.textContent = '-';
  modalSize.textContent = '-';
  modalLanguage.textContent = '-';
  downloadSize.textContent = '';
  
  modalCover.src = '';
  modalCover.alt = 'Carregando...';
  modalCover.dataset.errorHandled = 'false';
  modalCover.style.opacity = '1';
  
  try {
    const response = await api.getIssueById(issueId);
    currentIssueData = response.data;
    
    modalTitle.textContent = currentIssueData.title || 'Título não disponível';
    modalCover.alt = currentIssueData.title || 'Capa da edição';
    
    modalCover.dataset.errorHandled = 'false';
    modalCover.style.opacity = '1';
    const coverSrc = currentIssueData.cover || '/assets/covers/default.jpg';
    modalCover.src = coverSrc;
    
    modalSynopsis.textContent = currentIssueData.synopsis || 'Sinopse não disponível para esta edição.';
    
    modalSeries.textContent = currentIssueData.series || 'N/A';
    
    let genres = currentIssueData.genres;
    if (genres) {
      genres = Array.isArray(genres) ? genres.join(', ') : genres.replace(/,/g, ', ');
    }
    modalGenres.textContent = genres || 'N/A';
    
    modalYear.textContent = currentIssueData.year || 'N/A';
    modalSize.textContent = currentIssueData.size || 'N/A';
    modalLanguage.textContent = currentIssueData.language || 'N/A';
    
    if (currentIssueData.size) {
      downloadSize.textContent = `(${currentIssueData.size})`;
    }
    
  } catch (error) {
    console.error('❌ Erro ao carregar dados da edição:', error);
    modalTitle.textContent = 'Erro ao carregar';
    modalSynopsis.textContent = 'Não foi possível carregar os detalhes desta edição. Tente novamente mais tarde.';
  }
}

window.closeModal = function() {
  const modal = document.getElementById('modal');
  modal.classList.remove('open');
  
  setTimeout(() => {
    currentIssueData = null;
    
    document.getElementById('modal-title').textContent = 'Carregando...';
    const modalCover = document.getElementById('modal-cover');
    modalCover.src = '';
    modalCover.dataset.errorHandled = 'false';
    modalCover.style.opacity = '1';
    document.getElementById('modal-synopsis').textContent = 'Carregando sinopse...';
    document.getElementById('modal-series').textContent = '-';
    document.getElementById('modal-genres').textContent = '-';
    document.getElementById('modal-year').textContent = '-';
    document.getElementById('modal-size').textContent = '-';
    document.getElementById('modal-language').textContent = '-';
    document.getElementById('download-size').textContent = '';
  }, 300);
};

window.downloadIssue = function() {
  if (!currentIssueData) {
    console.warn('⚠️ Nenhuma edição carregada para download');
    return;
  }
  
  if (!currentIssueData.link) {
    alert('❌ Link de download não disponível para esta edição.');
    return;
  }
  window.open(currentIssueData.link, '_blank');
};

window.handleImageError = handleImageError;

document.addEventListener('DOMContentLoaded', () => {
  function handleSearchInput(e) {
    const searchTerm = e.target.value;
    
    console.log('🔍 Busca ativada:', searchTerm);
    console.log('📍 View atual:', currentView);
    
    if (currentView === 'home') {
      console.log('🏠 Filtrando quadrinhos');
      filterComics(searchTerm);
    } else if (currentView === 'issues') {
      console.log('📚 Filtrando edições');
      filterIssues(searchTerm);
    } else {
      console.warn('⚠️ View não reconhecida:', currentView);
    }
  }
  
  searchInput.addEventListener('input', handleSearchInput);
  searchInput.addEventListener('keyup', handleSearchInput);
  
  searchInput.addEventListener('paste', (e) => {
    setTimeout(() => handleSearchInput(e), 10);
  });
  
  function toggleMobileSearch(show) {
    if (show) {
      searchInputContainer.classList.add('active');
      searchInput.focus();
    } else {
      searchInputContainer.classList.remove('active');
      searchInput.blur();
    }
  }

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
  
  const modalCover = document.getElementById('modal-cover');
  modalCover.addEventListener('error', function() {
    handleImageError(this);
  });
  
  loadAllComics();
});

window.api = api;
window.loadAllComics = loadAllComics;