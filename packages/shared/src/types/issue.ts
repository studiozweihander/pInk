import type { ComicBase, Idiom } from './entities'

export interface Issue {
  id: string
  comicId: string
  number: number
  title: string
  description?: string | null
  publishedAt?: string | null
  cover?: string | null
}

export interface IssueDetail extends Issue {
  comic?: ComicBase | null
  idiom?: Idiom | null
}
