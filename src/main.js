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
const logo = document.getElementById('logo');

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

function createComicCard(comic) {
  const year = comic.year || '';
  const issues = comic.total_issues || 0;
  const metaText = `Lançamento: ${year} | Edições: ${issues} | Idioma: ${comic.language} | Editora: ${comic.publisher}`;
  
  return `
    <div class="card" data-id="${comic.id}" onclick="viewComicIssues(${comic.id})">
      <div class="card-image">
        <img src="${comic.cover || '/assets/covers/default.jpg'}" alt="${comic.title}" 
             onerror="this.src='/assets/covers/default.jpg'">
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
             onerror="this.src='/assets/covers/default.jpg'">
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
        <p>Tente ajustar sua busca ou verifique se o backend está rodando.</p>
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
    console.log('📡 Buscando quadrinhos da API...');
    
    const isOnline = await api.healthCheck();
    if (!isOnline) {
      throw new Error('Backend não está respondendo. Execute "npm start" em outro terminal.');
    }
    
    const response = await api.getAllComics();
    allComics = response.data;
    
    console.log(`✅ Carregados ${allComics.length} quadrinhos`);
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
  console.log(`🔍 Encontrados ${filtered.length} quadrinhos para "${searchTerm}"`);
}

function filterIssues(searchTerm) {
  if (!searchTerm.trim()) {
    renderIssues(currentIssues, currentComic);
    return;
  }
  
  const filtered = currentIssues.filter(issue => 
    issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (issue.series && issue.series.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (issue.genres && issue.genres.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (issue.issueNumber && issue.issueNumber.toString().includes(searchTerm))
  );
  
  renderIssues(filtered, currentComic);
  console.log(`🔍 Encontradas ${filtered.length} edições para "${searchTerm}"`);
}

async function loadComicIssues(comicId) {
  if (isLoading) return;
  
  showLoading();
  
  try {
    console.log(`📖 Carregando edições do quadrinho ID: ${comicId}`);
    
    const [comicResponse, issuesResponse] = await Promise.all([
      api.getComicById(comicId),
      api.getComicIssues(comicId)
    ]);
    
    currentComic = comicResponse.data;
    currentIssues = issuesResponse.data;
    
    console.log(`✅ Carregadas ${currentIssues.length} edições para "${currentComic.title}"`);
    renderIssues(currentIssues, currentComic);
    updateHeader();
    
  } catch (error) {
    console.error('❌ Erro ao carregar edições:', error);
    showError(error.message);
  } finally {
    isLoading = false;
  }
}

function updateHeader() {
  if (currentView === 'home') {
    breadcrumb.textContent = '';
    searchInput.placeholder = 'Buscar quadrinho...';
    logo.style.cursor = 'default';
  } else if (currentView === 'issues' && currentComic) {
    breadcrumb.textContent = ` > ${currentComic.title} (${currentComic.year || 'N/A'})`;
    searchInput.placeholder = 'Buscar edição...';
    logo.style.cursor = 'pointer';
  }
}

window.viewComicIssues = function(comicId) {
  currentView = 'issues';
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
  console.log('🏠 Voltou para página inicial');
};

let currentIssueData = null;

window.viewIssueDetails = async function(issueId) {
  console.log(`📄 Abrindo detalhes da edição ID: ${issueId}`);
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
  
  // Mostrar modal com loading
  modal.classList.add('open');
  modalTitle.textContent = 'Carregando...';
  modalSynopsis.textContent = 'Carregando informações...';
  
  // Reset outros campos
  modalSeries.textContent = '-';
  modalGenres.textContent = '-';
  modalYear.textContent = '-';
  modalSize.textContent = '-';
  modalLanguage.textContent = '-';
  downloadSize.textContent = '';
  modalCover.src = '';
  
  try {
    // Buscar dados da edição
    console.log(`🔍 Buscando dados da edição ID: ${issueId}`);
    const response = await api.getIssueById(issueId);
    currentIssueData = response.data;
    
    console.log('✅ Dados da edição carregados:', currentIssueData);
    
    // Preencher modal com dados
    modalTitle.textContent = currentIssueData.title || 'Título não disponível';
    modalCover.src = currentIssueData.cover || '/assets/covers/default.jpg';
    modalCover.alt = currentIssueData.title || 'Capa da edição';
    
    modalSynopsis.textContent = currentIssueData.synopsis || 'Sinopse não disponível para esta edição.';
    
    modalSeries.textContent = currentIssueData.series || 'N/A';
    
    // Formatar gêneros
    let genres = currentIssueData.genres;
    if (genres) {
      genres = Array.isArray(genres) ? genres.join(', ') : genres.replace(/,/g, ', ');
    }
    modalGenres.textContent = genres || 'N/A';
    
    modalYear.textContent = currentIssueData.year || 'N/A';
    modalSize.textContent = currentIssueData.size || 'N/A';
    modalLanguage.textContent = currentIssueData.language || 'N/A';
    
    // Formatar tamanho do download
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
  
  // Aguardar animação antes de limpar dados
  setTimeout(() => {
    currentIssueData = null;
    
    // Reset campos
    document.getElementById('modal-title').textContent = 'Carregando...';
    document.getElementById('modal-cover').src = '';
    document.getElementById('modal-synopsis').textContent = 'Carregando sinopse...';
    document.getElementById('modal-series').textContent = '-';
    document.getElementById('modal-genres').textContent = '-';
    document.getElementById('modal-year').textContent = '-';
    document.getElementById('modal-size').textContent = '-';
    document.getElementById('modal-language').textContent = '-';
    document.getElementById('download-size').textContent = '';
  }, 300);
  
  console.log('❌ Modal fechado');
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
  
  console.log(`📥 Iniciando download da edição: ${currentIssueData.title}`);
  
  // Abrir link em nova aba
  window.open(currentIssueData.link, '_blank');
  
  // Log para tracking
  console.log(`✅ Download iniciado: ${currentIssueData.title} (${currentIssueData.size || 'Tamanho desconhecido'})`);
};

document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ DOM carregado, iniciando aplicação...');
  
  // Event listener para busca
  searchInput.addEventListener('input', (e) => {
    if (currentView === 'home') {
      filterComics(e.target.value);
    } else if (currentView === 'issues') {
      filterIssues(e.target.value);
    }
  });
  
  // Event listeners do modal
  // Fechar modal ao pressionar ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.getElementById('modal').classList.contains('open')) {
      closeModal();
    }
  });
  
  // Impedir erro na imagem do modal
  document.getElementById('modal-cover').addEventListener('error', function() {
    this.src = '/assets/covers/default.jpg';
  });
  
  // Carregar dados iniciais
  loadAllComics();
});
window.api = api;
window.loadAllComics = loadAllComics;
