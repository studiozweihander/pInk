export interface Author {
  id: number;
  name: string;
  bio?: string;
  avatar?: string;
}

export interface Comic {
  id: number;
  title: string;
  total_issues: number;
  year: number;
  cover: string;
  language: string;
  publisher: string;
  authors?: Author[];
}

export interface Issue {
  id: number;
  title: string;
  issueNumber: number;
  year: number;
  size: string;
  series: string;
  genres: string | string[];
  link: string;
  cover: string;
  synopsis: string;
  language: string;
  comic_title?: string;
  comic_year?: number;
  publisher?: string;
  authors?: Author[];
  credito?: string;
  creditoLink?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  meta?: {
    count?: number;
    total?: number;
    comic_id?: number;
    pagination?: {
      limit: number;
      offset: number;
      has_more: boolean;
    };
  };
  count?: number;
  total?: number;
  pagination?: {
    limit: number;
    offset: number;
    has_more: boolean;
  };
  comic_id?: number;
}

const API_BASE_URL = "";

async function parseApiResponse<T>(response: Response): Promise<ApiResponse<T>> {
  let payload: ApiResponse<T> | null = null;

  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new Error(`Resposta invalida da API (nao-JSON) - HTTP ${response.status}`);
  }

  if (!response.ok) {
    const apiMessage = payload?.error || `HTTP ${response.status}`;
    throw new Error(apiMessage);
  }

  if (!payload || !payload.success || payload.data === undefined) {
    throw new Error(payload?.error || `Resposta invalida da API - HTTP ${response.status}`);
  }

  return payload;
}

export const api = {
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch {
      return false;
    }
  },

  async getAllComics(): Promise<ApiResponse<Comic[]>> {
    const response = await fetch(`${API_BASE_URL}/api/comics`);
    return parseApiResponse<Comic[]>(response);
  },

  async getComicById(id: number | string): Promise<ApiResponse<Comic>> {
    const response = await fetch(`${API_BASE_URL}/api/comics/${id}`);
    return parseApiResponse<Comic>(response);
  },

  async getComicIssues(id: number | string): Promise<ApiResponse<Issue[]>> {
    const response = await fetch(`${API_BASE_URL}/api/comics/${id}/issues`);
    return parseApiResponse<Issue[]>(response);
  },

  async getIssueById(id: number | string): Promise<ApiResponse<Issue>> {
    const response = await fetch(`${API_BASE_URL}/api/issues/${id}`);
    return parseApiResponse<Issue>(response);
  },

  async getAllIssues(
    limit = 50,
    offset = 0,
    search = ""
  ): Promise<ApiResponse<Issue[]>> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });
    if (search) params.append("search", search);

    const response = await fetch(`${API_BASE_URL}/api/issues?${params}`);
    return parseApiResponse<Issue[]>(response);
  },
};
