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
let activeFilters = {
    publisher: [],
    year: [],
    language: []
};
let activeIssueFilters = {
    year: []
};
let availableFilters = {
    publishers: [],
    years: [],
    languages: []
};
let availableIssueFilters = {
    years: []
};
let isFilterDropdownOpen = false;

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

function extractFiltersFromComics(comics) {
    const publishers = new Set();
    const years = new Set();
    const languages = new Set();
    
    comics.forEach(comic => {
        if (comic.publisher && comic.publisher !== 'N/A') {
            publishers.add(comic.publisher);
        }
        if (comic.year && comic.year !== 'N/A') {
            years.add(comic.year.toString());
        }
        if (comic.language && comic.language !== 'N/A') {
            languages.add(comic.language);
        }
    });
    
    availableFilters.publishers = Array.from(publishers).sort();
    availableFilters.years = Array.from(years).sort((a, b) => b - a);
    availableFilters.languages = Array.from(languages).sort((a, b) => a.localeCompare(b));
    
    populateFilterOptions();
}

function extractFiltersFromIssues(issues) {
    const years = new Set();
    
    issues.forEach(issue => {
        if (issue.year && issue.year !== 'N/A') {
            years.add(issue.year.toString());
        }
    });
    
    availableIssueFilters.years = Array.from(years).sort((a, b) => b - a);
    
    populateIssueFilterOptions();
}

function populateFilterOptions() {
    const title1 = document.getElementById('filter-title-1');
    const title2 = document.getElementById('filter-title-2');
    const title3 = document.getElementById('filter-title-3');
    
    if (title1) title1.textContent = 'Editora';
    if (title2) title2.textContent = 'Ano de Lançamento';
    if (title3) title3.textContent = 'Idioma';
    
    const sections = document.querySelectorAll('.filter-section');
    sections.forEach(section => {
        section.style.display = 'block';
    });
    
    const publisherOptions = document.getElementById('publisher-options');
    if (availableFilters.publishers.length > 0) {
        publisherOptions.innerHTML = availableFilters.publishers.map(publisher => `
            <label class="filter-option">
                <input type="checkbox" value="${publisher}" onchange="toggleFilter('publisher', '${publisher}')">
                <span class="filter-label">${publisher}</span>
            </label>
        `).join('');
    } else {
        publisherOptions.innerHTML = '<div class="filter-empty">Nenhuma editora encontrada</div>';
    }
    
    const yearOptions = document.getElementById('year-options');
    if (availableFilters.years.length > 0) {
        yearOptions.innerHTML = availableFilters.years.map(year => `
            <label class="filter-option">
                <input type="checkbox" value="${year}" onchange="toggleFilter('year', '${year}')">
                <span class="filter-label">${year}</span>
            </label>
        `).join('');
    } else {
        yearOptions.innerHTML = '<div class="filter-empty">Nenhum ano encontrado</div>';
    }
    
    const languageOptions = document.getElementById('language-options');
    if (availableFilters.languages.length > 0) {
        languageOptions.innerHTML = availableFilters.languages.map(language => `
            <label class="filter-option">
                <input type="checkbox" value="${language}" onchange="toggleFilter('language', '${language}')">
                <span class="filter-label">${language}</span>
            </label>
        `).join('');
    } else {
        languageOptions.innerHTML = '<div class="filter-empty">Nenhum idioma encontrado</div>';
    }
}

function populateIssueFilterOptions() {
    const title2 = document.getElementById('filter-title-2');
    
    if (title2) title2.textContent = 'Ano de Lançamento';
    
    const sections = document.querySelectorAll('.filter-section');
    sections.forEach((section, index) => {
        section.style.display = index === 1 ? 'block' : 'none';
    });
    
    const yearOptions = document.getElementById('year-options');
    if (availableIssueFilters.years.length > 0) {
        yearOptions.innerHTML = availableIssueFilters.years.map(year => `
            <label class="filter-option">
                <input type="checkbox" value="${year}" onchange="toggleIssueFilter('year', '${year}')">
                <span class="filter-label">${year}</span>
            </label>
        `).join('');
    } else {
        yearOptions.innerHTML = '<div class="filter-empty">Nenhum ano encontrado</div>';
    }
}

function toggleFilter(type, value) {
    if (activeFilters[type].includes(value)) {
        activeFilters[type] = activeFilters[type].filter(item => item !== value);
    } else {
        activeFilters[type].push(value);
    }
    
    updateFilterButton();
    applyFilters();
}

function toggleIssueFilter(type, value) {
    if (activeIssueFilters[type].includes(value)) {
        activeIssueFilters[type] = activeIssueFilters[type].filter(item => item !== value);
    } else {
        activeIssueFilters[type].push(value);
    }
    
    updateFilterButton();
    applyFilters();
}

function clearFilter(type) {
    if (currentView === 'home') {
        activeFilters[type] = [];
    } else if (currentView === 'issues') {
        activeIssueFilters[type] = [];
    }
    updateFilterCheckboxes(type);
    updateFilterButton();
    applyFilters();
}

function clearAllFilters() {
    if (currentView === 'home') {
        Object.keys(activeFilters).forEach(key => {
            activeFilters[key] = [];
        });
    } else if (currentView === 'issues') {
        Object.keys(activeIssueFilters).forEach(key => {
            activeIssueFilters[key] = [];
        });
    }
    updateAllFilterCheckboxes();
    updateFilterButton();
    applyFilters();
}

function updateFilterCheckboxes(type) {
    const container = document.getElementById(`${type}-options`);
    if (container) {
        const checkboxes = container.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
    }
}

function updateAllFilterCheckboxes() {
    if (currentView === 'home') {
        Object.keys(activeFilters).forEach(type => {
            updateFilterCheckboxes(type === 'publisher' ? 'publisher' : type);
        });
    } else if (currentView === 'issues') {
        updateFilterCheckboxes('year');
    }
}

function updateFilterButton() {
    const filterButton = document.getElementById('filter-button');
    let totalActiveFilters = 0;
    
    if (currentView === 'home') {
        totalActiveFilters = Object.values(activeFilters).reduce((sum, filters) => sum + filters.length, 0);
    } else if (currentView === 'issues') {
        totalActiveFilters = Object.values(activeIssueFilters).reduce((sum, filters) => sum + filters.length, 0);
    }
    
    if (totalActiveFilters > 0) {
        filterButton.classList.add('has-filters');
        filterButton.setAttribute('data-count', totalActiveFilters);
    } else {
        filterButton.classList.remove('has-filters');
        filterButton.removeAttribute('data-count');
    }
}

function applyFilters() {
    const searchTerm = searchInput.value;
    
    if (currentView === 'home') {
        if (!allComics || allComics.length === 0) return;
        
        let filteredComics = [...allComics];
        
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase();
            filteredComics = filteredComics.filter(comic => 
                comic.title.toLowerCase().includes(searchLower) ||
                (comic.publisher || '').toLowerCase().includes(searchLower) ||
                (comic.language || '').toLowerCase().includes(searchLower)
            );
        }
        
        if (activeFilters.publisher.length > 0) {
            filteredComics = filteredComics.filter(comic => 
                activeFilters.publisher.includes(comic.publisher)
            );
        }
        
        if (activeFilters.year.length > 0) {
            filteredComics = filteredComics.filter(comic => 
                activeFilters.year.includes(comic.year?.toString())
            );
        }
        
        if (activeFilters.language.length > 0) {
            filteredComics = filteredComics.filter(comic => 
                activeFilters.language.includes(comic.language)
            );
        }
        
        renderComics(filteredComics);
        
    } else if (currentView === 'issues') {
        if (!currentIssues || currentIssues.length === 0) return;
        
        let filteredIssues = [...currentIssues];
        
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase().trim();
            const filtered = currentIssues.filter(issue => {
                const titleText = (issue.title || '').toLowerCase();
                return titleText.includes(searchLower);
            });
            filteredIssues = filtered;
        }
        
        if (activeIssueFilters.year.length > 0) {
            filteredIssues = filteredIssues.filter(issue => 
                activeIssueFilters.year.includes(issue.year?.toString())
            );
        }
        
        renderIssues(filteredIssues);
    }
}

function toggleFilters() {
    const dropdown = document.getElementById('filter-dropdown');
    const filterButton = document.getElementById('filter-button');
    
    if (isFilterDropdownOpen) {
        closeFilters();
    } else {
        openFilters();
    }
}

function openFilters() {
    const dropdown = document.getElementById('filter-dropdown');
    const filterButton = document.getElementById('filter-button');
    
    dropdown.classList.add('open');
    filterButton.classList.add('active');
    isFilterDropdownOpen = true;
    
    setTimeout(() => {
        document.addEventListener('click', closeFiltersOnClickOutside);
    }, 10);
}

function closeFilters() {
    const dropdown = document.getElementById('filter-dropdown');
    const filterButton = document.getElementById('filter-button');
    
    dropdown.classList.remove('open');
    filterButton.classList.remove('active');
    isFilterDropdownOpen = false;
    
    document.removeEventListener('click', closeFiltersOnClickOutside);
}

function closeFiltersOnClickOutside(event) {
    const dropdown = document.getElementById('filter-dropdown');
    const filterContainer = document.querySelector('.filter-container');
    
    if (!filterContainer.contains(event.target)) {
        closeFilters();
    }
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
      
      extractFiltersFromComics(allComics);
      
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
    
    extractFiltersFromIssues(currentIssues);
    
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
  if (!searchTerm.trim() && Object.values(activeFilters).every(arr => arr.length === 0)) {
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
    const titleText = (issue.title || '').toLowerCase();

    return titleText.includes(searchLower);
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
    
    populateFilterOptions();
    
  } else if (currentView === 'issues' && currentComic) {
    breadcrumb.textContent = `${currentComic.title} (${currentComic.year || 'N/A'})`;
    searchInput.placeholder = 'Buscar edição...';
    logoContainer.classList.add('has-navigation');
    logoContainer.style.cursor = 'pointer';
    
    populateIssueFilterOptions();
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
  searchInput.value = '';
  
  Object.keys(activeIssueFilters).forEach(key => {
    activeIssueFilters[key] = [];
  });
  
  if (allComics && allComics.length > 0) {
    extractFiltersFromComics(allComics);
  }
  
  renderComics(allComics);
  updateHeader();
  
  updateFilterButton();
  
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
    
    if (e.key === 'Escape' && isFilterDropdownOpen) {
        closeFilters();
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

let controlsAutoHide = null;

function initializeControlsAutoHide() {
  if (controlsAutoHide) {
    controlsAutoHide.destroy();
  }
  
  controlsAutoHide = new ControlsBarAutoHide();
}

window.backToHome = function() {
  if (currentView === 'home') return;

  currentView = 'home';
  searchInput.value = '';
  
  Object.keys(activeIssueFilters).forEach(key => {
    activeIssueFilters[key] = [];
  });
  
  if (allComics && allComics.length > 0) {
    extractFiltersFromComics(allComics);
  }
  
  renderComics(allComics);
  updateHeader();
  updateFilterButton();
};

function enhancedViewComicIssues(comicId) {
  currentView = 'issues';
  searchInput.value = '';
  loadComicIssues(comicId);
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

  document.getElementById('footer-email').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendEmailWithBody();
    }
  });

  initializeControlsBar();
  initializeTooltips();
  loadViewModePreference();
  
  new ControlsBarAutoHide();
  
  loadAllComics();
});

function sendEmailWithBody() {
  const emailContent = document.getElementById('footer-email').value;

  if (!emailContent.trim()) {
    alert('Por favor, digite sua solicitação antes de enviar.');
    return;
  }

  const encodedContent = encodeURIComponent(emailContent);
  const mailtoURL = `mailto:comics.pink@gmail.com?subject=Solicitação de quadrinho&body=Olá, eu gostaria que vocês adicionassem o seguinte quadrinho: ${encodedContent}`;

  window.location.href = mailtoURL;
};

class ControlsBarAutoHide {
  constructor() {
    this.controlsBar = document.querySelector('.controls-bar');
    this.container = document.querySelector('.container');
    this.scrollableContent = document.querySelector('.scrollable-content');
    
    if (!this.controlsBar || !this.container) return;
    
    this.lastScrollTop = 0;
    this.isHidden = false;
    this.scrollThreshold = 50;
    
    this.init();
  }
  
  init() {
    this.setupStyles();
    this.bindScrollListeners();
    
    window.addEventListener('resize', () => this.setupStyles());
  }
  
  setupStyles() {
    if (!this.controlsBar || !this.container) return;
    
    this.controlsBar.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    this.container.style.transition = 'margin-top 0.3s ease';
    
    this.controlsBar.style.transform = 'translateY(0)';
    this.controlsBar.style.opacity = '1';
    this.container.style.marginTop = '';
  }
  
  bindScrollListeners() {
    const handleScroll = (scrollElement) => {
      const currentScrollTop = scrollElement === window 
        ? window.pageYOffset || document.documentElement.scrollTop
        : scrollElement.scrollTop;
      
      this.onScroll(currentScrollTop);
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
  
  onScroll(currentScrollTop) {
    if (currentScrollTop <= 10) {
      if (this.isHidden) {
        this.showControls();
      }
      this.lastScrollTop = currentScrollTop;
      return;
    }
    
    const scrollDifference = Math.abs(currentScrollTop - this.lastScrollTop);
    
    if (scrollDifference < this.scrollThreshold) {
      return;
    }
    
    const scrollDirection = currentScrollTop > this.lastScrollTop ? 'down' : 'up';
    
    if (scrollDirection === 'down' && !this.isHidden) {
      this.hideControls();
    } else if (scrollDirection === 'up' && this.isHidden) {
      this.showControls();
    }
    
    this.lastScrollTop = currentScrollTop;
  }
  
  hideControls() {
    if (!this.controlsBar || this.isHidden) return;
    
    const controlsBarHeight = this.controlsBar.offsetHeight - 16;

    this.controlsBar.style.transform = 'translateY(-100%)';
    this.controlsBar.style.opacity = '0';
    this.container.style.marginTop = `-${controlsBarHeight}px`;
    
    this.isHidden = true;
  }
  
  showControls() {
    if (!this.controlsBar || !this.isHidden) return;
    
    this.controlsBar.style.transform = 'translateY(0)';
    this.controlsBar.style.opacity = '1';
    this.container.style.marginTop = '';
    
    this.isHidden = false;
  }
  
  forceShow() {
    this.controlsBar.style.transform = 'translateY(0)';
    this.controlsBar.style.opacity = '1';
    this.container.style.marginTop = '';
    this.isHidden = false;
  }
  
  reset() {
    this.lastScrollTop = 0;
    this.isHidden = false;
    this.forceShow();
  }
  
  destroy() {
    if (this.controlsBar) {
      this.controlsBar.style.transform = '';
      this.controlsBar.style.opacity = '';
    }
    
    if (this.container) {
      this.container.style.marginTop = '';
    }
  }
}

window.toggleFilters = toggleFilters;
window.toggleFilter = toggleFilter;
window.toggleIssueFilter = toggleIssueFilter;
window.clearFilter = clearFilter;
window.clearAllFilters = clearAllFilters;
window.viewComicIssues = enhancedViewComicIssues;
window.handleImageError = handleImageError;
window.api = api;
window.loadAllComics = loadAllComics;
window.sendEmailWithBody = sendEmailWithBody;