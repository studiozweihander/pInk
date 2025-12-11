import type { ComicBase, Idiom, Publisher, Author } from "@pink/shared";

export type ComicDB = ComicBase;

export interface ComicWithRelations extends ComicDB {
  idiom?: Idiom | null;
  publisher?: Publisher | null;
  authors?: Author[];
};

export interface ComicFilters {
  publisherId?: number;
  idiomId?: number;
  year?: number;
  search?: string;
};

export interface PaginationOptions {
  limit?: number;
  offset?: number;
};

export interface PaginatedComics {
  comics: ComicDB[];
  total: number;
  hasMore: boolean;
};
