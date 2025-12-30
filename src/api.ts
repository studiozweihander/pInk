export interface Comic {
  id: number;
  title: string;
  total_issues: number;
  year: number;
  cover: string;
  language: string;
  publisher: string;
  authors?: any[];
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
  authors?: any[];
  credito?: string;
  creditoLink?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  total?: number;
}

const API_BASE_URL = ""; // Vite proxy will handle this

export const api = {
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      return false;
    }
  },

  async getAllComics(): Promise<ApiResponse<Comic[]>> {
    const response = await fetch(`${API_BASE_URL}/api/comics`);
    if (!response.ok) throw new Error("Falha ao carregar quadrinhos");
    return (await response.json()) as ApiResponse<Comic[]>;
  },

  async getComicById(id: number | string): Promise<ApiResponse<Comic>> {
    const response = await fetch(`${API_BASE_URL}/api/comics/${id}`);
    if (!response.ok)
      throw new Error("Falha ao carregar detalhes do quadrinho");
    return (await response.json()) as ApiResponse<Comic>;
  },

  async getComicIssues(id: number | string): Promise<ApiResponse<Issue[]>> {
    const response = await fetch(`${API_BASE_URL}/api/comics/${id}/issues`);
    if (!response.ok) throw new Error("Falha ao carregar edições");
    return (await response.json()) as ApiResponse<Issue[]>;
  },

  async getIssueById(id: number | string): Promise<ApiResponse<Issue>> {
    const response = await fetch(`${API_BASE_URL}/api/issues/${id}`);
    if (!response.ok) throw new Error("Falha ao carregar detalhes da edição");
    return (await response.json()) as ApiResponse<Issue>;
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
    if (!response.ok) throw new Error("Falha ao carregar edições");
    return (await response.json()) as ApiResponse<Issue[]>;
  },
};
