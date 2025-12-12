import type { Comic, ComicDetail } from "@pink/shared";
import type { ComicDB } from "./comics.types";
import type { Idiom, Publisher, Author } from "@pink/shared";

export class ComicsMapper {
  static toComic(
    comicDB: ComicDB,
    idiom: Idiom | undefined,
    publisher: Publisher | undefined
  ): Comic {
    return {
      id: comicDB.id,
      title: comicDB.title,
      year: comicDB.year,
      cover: comicDB.cover,
      idiomId: comicDB.idiomId,
      publisherId: comicDB.publisherId,
      issues: comicDB.issues,
    };
  }

  static toComicDetail(
    comicDB: ComicDB,
    idiom?: Idiom | null,
    publisher?: Publisher | null,
    authors?: Author[]
  ): ComicDetail {
    return {
      id: comicDB.id,
      title: comicDB.title,
      year: comicDB.year,
      cover: comicDB.cover,
      idiomId: comicDB.idiomId,
      publisherId: comicDB.publisherId,
      issues: comicDB.issues,
      idiom: idiom || undefined,
      publisher: publisher || undefined,
      authors: authors || [],
    };
  }

  static toComics(
    comicsDB: ComicDB[],
    idiomsMap?: Map<number, Idiom>,
    publishersMap?: Map<number, Publisher>
  ): Comic[] {
    return comicsDB.map((comic) => {
      const idiom =
        comic.idiomId && idiomsMap ? idiomsMap.get(comic.idiomId) : undefined;
      const publisher =
        comic.publisherId && publishersMap
          ? publishersMap.get(comic.publisherId)
          : undefined;

      return this.toComic(comic, idiom, publisher);
    });
  }

  static toComicDetails(
    comicsDB: ComicDB[],
    idiomsMap?: Map<number, Idiom>,
    publishersMap?: Map<number, Publisher>,
    authorsMap?: Map<number, Author[]>
  ): ComicDetail[] {
    return comicsDB.map((comic) => {
      const idiom =
        comic.idiomId && idiomsMap ? idiomsMap.get(comic.idiomId) : undefined;
      const publisher =
        comic.publisherId && publishersMap
          ? publishersMap.get(comic.publisherId)
          : undefined;
      const authors = authorsMap ? authorsMap.get(comic.id) : undefined;

      return this.toComicDetail(comic, idiom, publisher, authors);
    });
  }
}