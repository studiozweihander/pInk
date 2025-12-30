export interface Idiom {
  id: number;
  name: string;
}

export interface Publisher {
  id: number;
  name: string;
}

export interface Author {
  id: number;
  name: string;
  bio?: string;
  avatar?: string;
}

export interface Comic {
  id: number;
  title: string;
  issues: number;
  year: number;
  cover: string;
  publisherId: number;
  idiomId: number;
  Publisher?: Publisher;
  Idiom?: Idiom;
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
  comicId: number;
  idiomId: number;
  Idiom?: Idiom;
  Comic?: Comic & { Publisher?: Publisher };
  credito?: string;
  creditoLink?: string;
}
