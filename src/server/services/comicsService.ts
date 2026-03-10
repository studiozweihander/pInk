import { slugify } from "../../utils/slugify";
import { ApiNotFoundError } from "./errors";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { ApiSuccessResponse } from "../types";

interface ComicLookupRow {
  id: number;
  title: string;
  year: number;
}

interface NamedRelation {
  name: string;
}

interface ComicListRow {
  id: number;
  title: string;
  issues: number;
  year: number;
  cover: string;
  Idiom?: NamedRelation | NamedRelation[] | null;
  Publisher?: NamedRelation | NamedRelation[] | null;
}

interface ComicAuthorJoinRow {
  Author?: { id: number; name: string; bio?: string; avatar?: string } | Array<{ id: number; name: string; bio?: string; avatar?: string }> | null;
}

interface IssueRow {
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
  Idiom?: NamedRelation | NamedRelation[] | null;
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

function getJoinedAuthor(author: ComicAuthorJoinRow["Author"]) {
  if (!author) {
    return null;
  }

  if (Array.isArray(author)) {
    return author[0] ?? null;
  }

  return author;
}

async function resolveComicId(paramId: string, supabase: SupabaseClient): Promise<number> {
  const numeric = Number(paramId);
  if (!Number.isNaN(numeric)) return numeric;

  const yearMatch = paramId.match(/^(.*)-(\d{4})$/);
  const idMatch = paramId.match(/^(.*)-(\d+)$/);

  const { data: allComics, error } = await supabase
    .from("Comic")
    .select("id, title, year");

  if (error) throw error;

  const comicRows = (allComics ?? []) as ComicLookupRow[];
  let match: ComicLookupRow | undefined;

  if (yearMatch) {
    const titleSlug = yearMatch[1];
    const year = Number(yearMatch[2]);
    match = comicRows.find(
      (comicRow) => slugify(comicRow.title) === titleSlug && comicRow.year === year,
    );
  }

  if (!match && idMatch) {
    const id = Number(idMatch[2]);
    match = comicRows.find((comicRow) => comicRow.id === id);
  }

  if (!match) {
    match = comicRows.find((comicRow) => slugify(comicRow.title) === paramId);
  }

  if (!match) {
    throw new ApiNotFoundError("Comic not found");
  }

  return match.id;
}

export async function getAllComics(supabase: SupabaseClient): Promise<ApiSuccessResponse<Array<{
  id: number;
  title: string;
  total_issues: number;
  year: number;
  cover: string;
  language: string | null;
  publisher: string | null;
}>>> {
  const { data, error } = await supabase
    .from("Comic")
    .select(
      `
      id,
      title,
      issues,
      year,
      cover,
      idiomId,
      publisherId,
      Idiom(name),
      Publisher(name)
    `,
    )
    .order("title", { ascending: true })
    .order("year", { ascending: true });

  if (error) throw error;

  const comicRows = (data ?? []) as ComicListRow[];
  const comics = comicRows.map((comic) => ({
    id: comic.id,
    title: comic.title,
    total_issues: comic.issues,
    year: comic.year,
    cover: comic.cover,
    language: getRelationName(comic.Idiom),
    publisher: getRelationName(comic.Publisher),
  }));

  return {
    success: true,
    meta: {
      count: comics.length,
    },
    count: comics.length,
    data: comics,
  };
}

export async function getComicById(paramId: string, supabase: SupabaseClient): Promise<ApiSuccessResponse<{
  id: number;
  title: string;
  total_issues: number;
  year: number;
  cover: string;
  language: string | null;
  publisher: string | null;
  authors: Array<{ id: number; name: string; bio?: string; avatar?: string }>;
}>> {
  const comicId = await resolveComicId(paramId, supabase);

  const { data, error } = await supabase
    .from("Comic")
    .select(
      `
      *,
      Idiom(name),
      Publisher(name)
    `,
    )
    .eq("id", comicId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      throw new ApiNotFoundError("Comic not found");
    }
    throw error;
  }

  const { data: authorsData } = await supabase
    .from("ComicAuthor")
    .select("Author(*)")
    .eq("comicId", comicId);

  const authorRows = (authorsData ?? []) as ComicAuthorJoinRow[];
  const authors = authorRows
    .map((authorRow) => getJoinedAuthor(authorRow.Author))
    .filter((author): author is NonNullable<typeof author> => Boolean(author));

  return {
    success: true,
    data: {
      id: data.id,
      title: data.title,
      total_issues: data.issues,
      year: data.year,
      cover: data.cover,
      language: getRelationName(data.Idiom as NamedRelation | NamedRelation[] | null | undefined),
      publisher: getRelationName(data.Publisher as NamedRelation | NamedRelation[] | null | undefined),
      authors,
    },
  };
}

export async function getComicIssues(paramId: string, supabase: SupabaseClient): Promise<ApiSuccessResponse<Array<{
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
  language: string | null;
}>>> {
  const comicId = await resolveComicId(paramId, supabase);

  const [comicCheck, issuesData] = await Promise.all([
    supabase.from("Comic").select("id").eq("id", comicId).single(),
    supabase
      .from("Issue")
      .select("*, Idiom(name)")
      .eq("comicId", comicId)
      .order("issueNumber", { ascending: true }),
  ]);

  if (comicCheck.error) {
    if (comicCheck.error.code === "PGRST116") {
      throw new ApiNotFoundError("Comic not found");
    }
    throw comicCheck.error;
  }

  if (issuesData.error) throw issuesData.error;

  const issueRows = (issuesData.data ?? []) as IssueRow[];
  const issues = issueRows.map((issue) => ({
    id: issue.id,
    title: issue.title,
    issueNumber: issue.issueNumber,
    year: issue.year,
    size: issue.size,
    series: issue.series,
    genres: issue.genres,
    link: issue.link,
    cover: issue.cover,
    synopsis: issue.synopsis,
    language: getRelationName(issue.Idiom),
  }));

  return {
    success: true,
    meta: {
      comic_id: comicId,
      count: issues.length,
    },
    comic_id: comicId,
    count: issues.length,
    data: issues,
  };
}
