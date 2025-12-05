import type { ComicBase, Idiom, Publisher, Author } from './entities'

export interface Comic extends ComicBase {}

export interface ComicAuthor {
  comicId: number
  authorId: number
}

export interface ComicDetail extends Comic {
  idiom?: Idiom
  publisher?: Publisher
  authors?: Author[]
}
