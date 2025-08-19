import './style.css';
import { api } from './api.js';

console.log('🎨 pInk - Catálogo de Quadrinhos');
console.log('📦 Projeto refatorado com Vite + Vanilla JS');

// Estado da aplicação
let allComics = [];
let isLoading = false;

// Elementos DOM
const cardsContainer = document.getElementById('cards');
const searchInput = document.getElementById('search');

// Função para mostrar loading
function showLoading() {
  isLoading = true;
  cardsContainer.innerHTML = `
    <div class="loading">
      <div class="loading-spinner"></div>
      <p>Carregando quadrinhos...</p>
    </div>
  `;
}

// Função para mostrar erro
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
    <div class="card" data-id="${comic.id}" onclick="viewComicDetails(${comic.id})">
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

// Função para renderizar quadrinhos
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

// Função para carregar todos os quadrinhos
async function loadAllComics() {
  if (isLoading) return;
  
  showLoading();
  
  try {
    console.log('📡 Buscando quadrinhos da API...');
    
    // Verifica se backend está online
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

// Função para filtrar quadrinhos (busca local)
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

// Função para ver detalhes do quadrinho (será implementada depois)
window.viewComicDetails = function(comicId) {
  console.log(`📖 Clicou no quadrinho ID: ${comicId}`);
  // TODO: Implementar navegação para página de detalhes ou modal
  alert(`Funcionalidade em desenvolvimento!\nQuadrinho ID: ${comicId}`);
};

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ DOM carregado, iniciando aplicação...');
  
  // Configurar busca
  searchInput.addEventListener('input', (e) => {
    filterComics(e.target.value);
  });
  
  // Carregar quadrinhos iniciais
  loadAllComics();
});

// Debugging global
window.api = api;
window.loadAllComics = loadAllComics;
