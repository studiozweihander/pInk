const API_BASE_URL = (() => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    
    if (hostname.includes('vercel.app') || hostname.includes('pInk-')) {
      return '/api';
    }
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:3000/api';
    }
    
    return `${protocol}//${hostname}/api`;
  }
  return '/api';
})();

const REQUEST_TIMEOUT = 15000;

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

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
          'Accept': 'application/json',
          ...options.headers
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      if (!data.success) {
        const errorMessage = data.message || data.error || 'API returned error';
        throw new Error(errorMessage);
      }

      return data;

    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new Error('Timeout - Verifique sua conexão. O servidor pode estar demando para responder.');
      }

      if (error.message.includes('fetch')) {
        throw new Error('Erro de conexão - Verifique se o servidor está disponível.');
      }

      if (error.message.includes('JSON')) {
        throw new Error(`Erro de formato de dados - ${error.message}`);
      }

      throw error;
    }
  }

  async getAllComics() {
    return this.request('/comics');
  }

  async getComicById(id) {
    if (!id) {
      throw new Error('ID do quadrinho é obrigatório');
    }
    return this.request(`/comics/${encodeURIComponent(id)}`);
  }

  async getComicIssues(id) {
    if (!id) {
      throw new Error('ID do quadrinho é obrigatório');
    }
    return this.request(`/comics/${encodeURIComponent(id)}/issues`);
  }

  async getIssueById(id) {
    if (!id) {
      throw new Error('ID da edição é obrigatório');
    }
    return this.request(`/issues/${encodeURIComponent(id)}`);
  }

  async searchIssues(query = '', limit = 50, offset = 0) {
    const params = new URLSearchParams({
      search: query,
      limit: limit.toString(),
      offset: offset.toString()
    });

    return this.request(`/issues?${params}`);
  }

  async healthCheck() {
    try {
      const healthUrl = this.baseURL.replace('/api', '/health');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(healthUrl, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        return false;
      }
      
      const data = await response.json();
      return data.success === true;
    } catch (error) {
      return false;
    }
  }
}

export const api = new ApiClient();

if (typeof window !== 'undefined') {
  window.api = api;
}