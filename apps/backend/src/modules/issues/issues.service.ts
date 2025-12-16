import { IssuesRepository } from "@issues/issues.repository";
import { IssuesMapper } from "@issues/issues.mapper";
import type { Issue } from "@pink/shared";
import type { PaginationOptions } from "@comics/comics.types";

export class IssuesService {
  private repository: IssuesRepository;

  constructor(repository: IssuesRepository = new IssuesRepository()) {
    this.repository = repository;
  }

  async getIssueById(id: number): Promise<Issue> {
    const issue = await this.repository.findById(id);
    return IssuesMapper.toDomain(issue);
  }

  async getIssuesByComic(
    comicId: number,
    options?: PaginationOptions
  ): Promise<{
    issues: Issue[];
    total: number;
    hasMore: boolean;
  }> {
    const result = await this.repository.findByComic(comicId, options);

    return {
      issues: result.issues.map(IssuesMapper.toDomain),
      total: result.total,
      hasMore: result.hasMore,
    };
  }

  async getAllIssues(options?: PaginationOptions): Promise<{
    issues: Issue[];
    total: number;
    hasMore: boolean;
  }> {
    const result = await this.repository.findAll(options);

    return {
      issues: result.issues.map(IssuesMapper.toDomain),
      total: result.total,
      hasMore: result.hasMore,
    };
  }
}
