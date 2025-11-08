export interface Idiom {
  id: number
  name: string
}

export interface Publisher {
  id: number
  name: string
}

export interface Author {
  id: number
  name: string
}

export interface ComicBase {
  id: number
  title: string
  year: number
  cover: string | null
  idiomId: number | null
  publisherId: number | null
  issuesCount: number
}
