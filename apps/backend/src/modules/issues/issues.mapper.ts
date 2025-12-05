import type { IssueDB, Issue } from "./issues.types";

export class IssuesMapper {
  static toDomain(db: IssueDB): Issue {
    return {
      id: db.id,
      comicId: db.comic_id,
      number: db.number,
      title: db.title,
      description: db.description ?? null,
      publishedAt: db.published_at ?? null,
      cover: db.cover ?? null,
    };
  }

  static toDB(issue: Partial<Issue>): Partial<IssueDB> {
    const db: Partial<IssueDB> = {};
    if (issue.id) db.id = issue.id;
    if (issue.comicId) db.comic_id = issue.comicId;
    if (issue.number !== undefined) db.number = issue.number;
    if (issue.title !== undefined) db.title = issue.title;
    if (issue.description !== undefined) db.description = issue.description;
    if (issue.publishedAt !== undefined) db.published_at = issue.publishedAt;
    if (issue.cover !== undefined) db.cover = issue.cover;
    return db;
  }
}
