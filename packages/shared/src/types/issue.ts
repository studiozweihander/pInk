import type { ComicBase, Idiom } from './entities'

export interface Issue {
  id: number
  title: string
  issueNumber: number
  year: number
  size: string
  series: string
  genres?: string | null
  link: string
  cover: string
  synopsis?: string | null
  comicId: number
  idiomId: number
  credito?: string | null
  creditoLink?: string | null
}

export interface IssueDetail extends Issue {
  comic?: ComicBase | null
  idiom?: Idiom | null
}