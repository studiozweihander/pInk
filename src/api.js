// API Client para comunicação com backend
const API_BASE_URL = 'http://localhost:3000/api';

// Timeout para requests
const REQUEST_TIMEOUT = 10000;

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Método genérico para fazer requests com timeout
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'API returned error');
      }
      
      return data;
      
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - verifique se o backend está rodando');
      }
      
      if (error.message.includes('fetch')) {
        throw new Error('Erro de conexão - verifique se o backend está rodando na porta 3000');
      }
      
      throw error;
    }
  }

  // GET /api/comics - Lista todos os quadrinhos
  async getAllComics() {
    return this.request('/comics');
  }

  // GET /api/comics/:id - Detalhes de um quadrinho
  async getComicById(id) {
    return this.request(`/comics/${id}`);
  }

  // GET /api/comics/:id/issues - Lista edições de um quadrinho
  async getComicIssues(id) {
    return this.request(`/comics/${id}/issues`);
  }

  // GET /api/issues/:id - Detalhes de uma edição
  async getIssueById(id) {
    return this.request(`/issues/${id}`);
  }

  // GET /api/issues - Busca geral de edições
  async searchIssues(query = '', limit = 50, offset = 0) {
    const params = new URLSearchParams({
      search: query,
      limit: limit.toString(),
      offset: offset.toString()
    });
    
    return this.request(`/issues?${params}`);
  }

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`http://localhost:3000/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const api = new ApiClient();
