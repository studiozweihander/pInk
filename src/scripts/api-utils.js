import { PLACEHOLDER_IMAGE } from './constants.js';

export class ApiUtils {
  static async createSlug(title) {
    try {
      const response = await fetch(`${window.api.baseURL}/comics/utils/slugify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title })
      });

      if (!response.ok) {
        throw new Error('Failed to generate slug');
      }

      const data = await response.json();
      return data.slug;
    } catch (error) {
      return this.generateFallbackSlug(title);
    }
  }
  
  static async createSlug(title) {
    try {
      const response = await fetch(`${window.api.baseURL}/comics/utils/slugify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title })
      });

      if (!response.ok) {
        throw new Error('Failed to generate slug');
      }

      const data = await response.json();
      return data.slug;
    } catch (error) {
      return this.generateFallbackSlug(title);
    }
  }

  static generateFallbackSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .replace(/^-|-$/g, '');
  }
  static generateFallbackSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .replace(/^-|-$/g, '');
  }

  static handleImageError(imgElement) {
    if (imgElement.dataset.errorHandled === 'true') return;

    const originalSrc = imgElement.src;

    if (originalSrc.includes('supabase.co/storage') && !imgElement.dataset.retried) {
      imgElement.dataset.retried = 'true';
      imgElement.dataset.errorHandled = 'false';

      const testImg = new Image();
      testImg.crossOrigin = 'anonymous';
      testImg.referrerPolicy = 'no-referrer';

      testImg.onload = function () {
        imgElement.src = originalSrc;
        imgElement.crossOrigin = 'anonymous';
        imgElement.referrerPolicy = 'no-referrer';
      };

      testImg.onerror = function () {
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

  static isValidUrl(string) {
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  static throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }
}

export const createSlug = ApiUtils.createSlug.bind(ApiUtils);
export const handleImageError = ApiUtils.handleImageError.bind(ApiUtils);
export const isValidUrl = ApiUtils.isValidUrl.bind(ApiUtils);
