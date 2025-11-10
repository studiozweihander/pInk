const API_BASE_URL = (() => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    if (hostname.includes('vercel.app') || hostname.includes('pInk-')) {
      return '/api';
    }
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:3000/api';
    }
    
    return `${window.location.protocol}//${hostname}/api`;
  }
  return '/api';
})();

const REQUEST_TIMEOUT = 15000;

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.requestId = 0;
    this.init();
  }

  init() {
    if (typeof window !== 'undefined') {
      window.debugAPI = () => {
        console.log('API Debug - Base URL:', this.baseURL);
        console.log('API Debug - Environment:', window.location.hostname.includes('vercel.app') || window.location.hostname.includes('pInk-') ? 'Production' : 'Development');
        console.log('API Debug - Hostname:', window.location.hostname);
      };
    }
  }

  generateRequestId() {
    return `req_${Date.now()}_${++this.requestId}`;
  }

  logRequest(id, method, url) {
    console.log(`Request [${id}]: ${method} ${url}`);
  }

  logResponse(id, status, duration) {
    const success = status >= 200 && status < 300;
    console.log(`Response [${id}]: ${status} ${success ? 'OK' : 'ERROR'}, duration: ${duration}ms`);
  }

  logError(id, error, context) {
    console.error(`Error [${id}]: ${error.message} ${context}`);
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
    const requestId = this.generateRequestId();
    const startTime = Date.now();

    try {
      this.logRequest(requestId, options.method || 'GET', url);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers
        }
      });

      const duration = Date.now() - startTime;
      const contentType = response.headers.get('content-type');
      
      this.logResponse(requestId, response.status, duration);

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          const errorMsg = `Expected JSON but received ${contentType}. Response: ${text.substring(0, 200)}`;
          this.logError(requestId, new Error(errorMsg), 'Non-JSON response');
          throw new Error(`Invalid response format - ${errorMsg}`);
        }
        
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`;
        this.logError(requestId, new Error(errorMessage), `HTTP ${response.status} error`);
        throw new Error(errorMessage);
      }

      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        const errorMsg = `Expected JSON but received ${contentType}. Response: ${responseText.substring(0, 200)}`;
        this.logError(requestId, new Error(errorMsg), 'Invalid content type');
        throw new Error(`Invalid response format - ${errorMsg}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        const errorMessage = data.message || 'API returned error';
        this.logError(requestId, new Error(errorMessage), 'API error');
        throw new Error(errorMessage);
      }

      return data;

    } catch (error) {
      if (error.name === 'AbortError') {
        this.logError(requestId, error, 'Request timeout');
        throw new Error('Request timeout - check your connection');
      }

      if (error.message.includes('fetch')) {
        this.logError(requestId, error, 'Connection error');
        throw new Error('Connection error - check server availability');
      }

      if (error.message.includes('JSON') || error.message.includes('response format')) {
        this.logError(requestId, error, 'Invalid response format');
        throw new Error(`Invalid response format - ${error.message}`);
      }

      this.logError(requestId, error, 'Unexpected error');
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