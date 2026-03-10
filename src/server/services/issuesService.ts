import { ApiNotFoundError } from "./errors";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { ApiSuccessResponse, PaginationMeta } from "../types";

interface NamedRelation {
  name: string;
}

interface IssueAuthorJoinRow {
  Author?: { id: number; name: string; bio?: string; avatar?: string } | Array<{ id: number; name: string; bio?: string; avatar?: string }> | null;
}

interface IssueWithRelations {
  id: number;
  title: string;
  issueNumber: number;
  year: number;
  size: string;
  series: string;
  genres: string | string[];
  link: string;
  cover: string;
  synopsis: string;
  comicId: number;
  Idiom?: NamedRelation | NamedRelation[] | null;
  Comic?: {
    title?: string;
    year?: number;
    Publisher?: NamedRelation | NamedRelation[] | null;
  } | null;
  credito?: string;
  creditoLink?: string;
}

interface IssueListRow {
  id: number;
  title: string;
  issueNumber: number;
  year: number;
  cover: string;
  comicId: number;
  Idiom?: NamedRelation | NamedRelation[] | null;
  Comic?: { title?: string } | null;
  credito?: string;
  creditoLink?: string;
}

function getRelationName(relation: NamedRelation | NamedRelation[] | null | undefined): string | null {
  if (!relation) {
    return null;
  }

  if (Array.isArray(relation)) {
    return relation[0]?.name ?? null;
  }

  return relation.name ?? null;
}

function getJoinedAuthor(author: IssueAuthorJoinRow["Author"]) {
  if (!author) {
    return null;
  }

  if (Array.isArray(author)) {
    return author[0] ?? null;
  }

  return author;
}

function normalizeGenres(genres: string | string[]): string | string[] {
  if (Array.isArray(genres)) {
    return genres;
  }

  try {
    const parsedGenres = JSON.parse(genres);
    if (Array.isArray(parsedGenres)) {
      return parsedGenres;
    }
  } catch {
    // Keep fallback behavior for comma-delimited strings.
  }

  return genres.split(",").map((genre) => genre.trim());
}

export async function getIssueById(id: string, supabase: SupabaseClient): Promise<ApiSuccessResponse<{
  id: number;
  title: string;
  issueNumber: number;
  year: number;
  size: string;
  series: string;
  genres: string | string[];
  link: string;
  cover: string;
  synopsis: string;
  comicId: number;
  language: string | null;
  comic_title: string | null;
  comic_year: number | null;
  publisher: string | null;
  authors: Array<{ id: number; name: string; bio?: string; avatar?: string }>;
  credito?: string;
  creditoLink?: string;
}>> {
  const { data, error } = await supabase
    .from("Issue")
    .select("*, Idiom(name), Comic(*, Publisher(name))")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      throw new ApiNotFoundError("Issue not found");
    }
    throw error;
  }

  const issueRow = data as IssueWithRelations;

  const { data: authorsData } = await supabase
    .from("ComicAuthor")
    .select("Author(*)")
    .eq("comicId", issueRow.comicId);

  const authorRows = (authorsData ?? []) as IssueAuthorJoinRow[];
  const authors = authorRows
    .map((authorRow) => getJoinedAuthor(authorRow.Author))
    .filter((author): author is NonNullable<typeof author> => Boolean(author));

  const genres = normalizeGenres(issueRow.genres);

  return {
    success: true,
    data: {
      id: issueRow.id,
      title: issueRow.title,
      issueNumber: issueRow.issueNumber,
      year: issueRow.year,
      size: issueRow.size,
      series: issueRow.series,
      genres,
      link: issueRow.link,
      cover: issueRow.cover,
      synopsis: issueRow.synopsis,
      comicId: issueRow.comicId,
      language: getRelationName(issueRow.Idiom),
      comic_title: issueRow.Comic?.title || null,
      comic_year: issueRow.Comic?.year || null,
      publisher: getRelationName(issueRow.Comic?.Publisher),
      authors,
      credito: issueRow.credito,
      creditoLink: issueRow.creditoLink,
    },
  };
}

export async function getAllIssues(
  query: { limit?: string; offset?: string; search?: string },
  supabase: SupabaseClient,
): Promise<ApiSuccessResponse<Array<{
  id: number;
  title: string;
  issueNumber: number;
  year: number;
  cover: string;
  comicId: number;
  comic_title: string | null;
  language: string | null;
  credito: string | null;
  creditoLink: string | null;
}>>> {
  const limit = Number.parseInt(query.limit || "50", 10);
  const offset = Number.parseInt(query.offset || "0", 10);
  const search = query.search;

  let supabaseQuery = supabase
    .from("Issue")
    .select("*, Idiom(name), Comic(title)", { count: "exact" });

  if (search) {
    supabaseQuery = supabaseQuery.ilike("title", `%${search}%`);
  }

  const { data, error, count } = await supabaseQuery
    .order("issueNumber", { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  const issueRows = (data ?? []) as IssueListRow[];
  const issues = issueRows.map((issue) => ({
    id: issue.id,
    title: issue.title,
    issueNumber: issue.issueNumber,
    year: issue.year,
    cover: issue.cover,
    comicId: issue.comicId,
    comic_title: issue.Comic?.title || null,
    language: getRelationName(issue.Idiom),
    credito: issue.credito || null,
    creditoLink: issue.creditoLink || null,
  }));

  const total = count ?? 0;
  const pagination: PaginationMeta = {
    limit,
    offset,
    has_more: offset + issues.length < total,
  };

  return {
    success: true,
    meta: {
      count: issues.length,
      total,
      pagination,
    },
    count: issues.length,
    total,
    pagination,
    data: issues,
  };
}
