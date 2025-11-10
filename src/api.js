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
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          throw new Error(`Server returned ${response.status}. Expected JSON, got: ${contentType || 'unknown'}`);
        }
        
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        throw new Error(`Expected JSON but received ${contentType}. Response: ${responseText.substring(0, 200)}`);
      }

      const data = await response.json();

      if (!data.success) {
        const errorMessage = data.message || 'API returned error';
        throw new Error(errorMessage);
      }

      return data;

    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new Error('Request timeout - check your connection');
      }

      if (error.message.includes('fetch')) {
        throw new Error('Connection error - check server availability');
      }

      if (error.message.includes('JSON')) {
        throw new Error(`Invalid response format - ${error.message}`);
      }

      throw error;
    }
  }

  async getAllComics() {
    return this.request('/comics');
  }

  async getComicById(id) {
    if (!id) {
      throw new Error('Comic ID is required');
    }
    return this.request(`/comics/${encodeURIComponent(id)}`);
  }

  async getComicIssues(id) {
    if (!id) {
      throw new Error('Comic ID is required');
    }
    return this.request(`/comics/${encodeURIComponent(id)}/issues`);
  }

  async getIssueById(id) {
    if (!id) {
      throw new Error('Issue ID is required');
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
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const api = new ApiClient();

if (typeof window !== 'undefined') {
  window.api = api;
}