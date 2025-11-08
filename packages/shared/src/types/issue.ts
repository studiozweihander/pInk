import type { ComicBase, Idiom } from './entities'

export interface Issue {
  id: number
  title: string
  issueNumber: number
  year: number | null
  size: string | null
  series: string | null
  genres: string[] | null
  link: string | null
  cover: string | null
  synopsis: string | null
  comicId: number | null
  idiomId: number | null
  credito: string | null
  creditoLink: string | null
}

export interface IssueDetail extends Issue {
  comic?: ComicBase | null
  idiom?: Idiom | null
}
