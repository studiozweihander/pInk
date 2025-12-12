import type { IssueDB } from "./issues.types";
import type { Issue as SharedIssue } from "@pink/shared";

export class IssuesMapper {
  static toDomain(db: IssueDB): SharedIssue {
    return {
      id: db.id,
      title: db.title,
      issueNumber: db.issueNumber,
      year: db.year,
      size: db.size,
      series: db.series,
      genres: db.genres ?? null,
      link: db.link,
      cover: db.cover,
      synopsis: db.synopsis ?? null,
      comicId: db.comicId,
      idiomId: db.idiomId,
      credito: db.credito ?? null,
      creditoLink: db.creditoLink ?? null,
    };
  }

  static toDB(issue: Partial<SharedIssue>): Partial<IssueDB> {
    const db: Partial<IssueDB> = {};
    
    if (issue.id !== undefined) db.id = issue.id;
    if (issue.title !== undefined) db.title = issue.title;
    if (issue.issueNumber !== undefined) db.issueNumber = issue.issueNumber;
    if (issue.year !== undefined) db.year = issue.year;
    if (issue.size !== undefined) db.size = issue.size;
    if (issue.series !== undefined) db.series = issue.series;
    if (issue.genres !== undefined) db.genres = issue.genres;
    if (issue.link !== undefined) db.link = issue.link;
    if (issue.cover !== undefined) db.cover = issue.cover;
    if (issue.synopsis !== undefined) db.synopsis = issue.synopsis;
    if (issue.comicId !== undefined) db.comicId = issue.comicId;
    if (issue.idiomId !== undefined) db.idiomId = issue.idiomId;
    if (issue.credito !== undefined) db.credito = issue.credito;
    if (issue.creditoLink !== undefined) db.creditoLink = issue.creditoLink;
    
    return db;
  }
}