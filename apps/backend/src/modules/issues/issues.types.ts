export interface IssueDB {
  id: string;
  comic_id: string;
  number: number;
  title: string;
  description?: string | null;
  published_at?: string | null;
  cover?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Issue {
  id: string;
  comicId: string;
  number: number;
  title: string;
  description?: string | null;
  publishedAt?: string | null;
  cover?: string | null;
}
