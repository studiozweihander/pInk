import { ComicsRepository } from "./comics.repository";
import { ComicsMapper } from "./comics.mapper";
import type { Comic, ComicDetail } from "@pink/shared";
import type { ComicFilters, PaginationOptions } from "./comics.types";

export class ComicsService {
  private repository: ComicsRepository;

  constructor(repository: ComicsRepository = new ComicsRepository()) {
    this.repository = repository;
  }

  async getAllComics(options?: PaginationOptions): Promise<{
    comics: Comic[];
    total: number;
    hasMore: boolean;
  }> {
    const result = await this.repository.findAll(options);

    const idiomsIds = result.comics.map((c) => c.idiomId);
    const publishersIds = result.comics.map((c) => c.publisherId);

    const idiomsMap = await this.repository.getIdiomsByIds(idiomsIds);
    const publishersMap = await this.repository.getPublishersByIds(
      publishersIds
    );

    return {
      comics: ComicsMapper.toComics(result.comics, idiomsMap, publishersMap),
      total: result.total,
      hasMore: result.hasMore,
    };
  }

  async getComicById(id: number): Promise<ComicDetail> {
    const comic = await this.repository.findById(id);

    const idiomsMap = await this.repository.getIdiomsByIds([comic.idiomId]);
    const publishersMap = await this.repository.getPublishersByIds([
      comic.publisherId,
    ]);

    const idiom = idiomsMap.get(comic.idiomId);
    const publisher = publishersMap.get(comic.publisherId);

    return ComicsMapper.toComicDetail(comic, idiom, publisher, []);
  }

  async searchComics(
    filters: ComicFilters,
    options?: PaginationOptions
  ): Promise<{
    comics: Comic[];
    total: number;
    hasMore: boolean;
  }> {
    const result = await this.repository.findWithFilters(filters, options);

    const idiomsIds = result.comics.map((c) => c.idiomId);
    const publishersIds = result.comics.map((c) => c.publisherId);

    const idiomsMap = await this.repository.getIdiomsByIds(idiomsIds);
    const publishersMap = await this.repository.getPublishersByIds(
      publishersIds
    );

    return {
      comics: ComicsMapper.toComics(result.comics, idiomsMap, publishersMap),
      total: result.total,
      hasMore: result.hasMore,
    };
  }
}
