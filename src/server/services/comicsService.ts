import { slugify } from "../../utils/slugify";
import { ApiNotFoundError } from "./errors";

async function resolveComicId(paramId: string, supabase: any): Promise<number> {
  const numeric = Number(paramId);
  if (!Number.isNaN(numeric)) return numeric;

  const yearMatch = paramId.match(/^(.*)-(\d{4})$/);
  const idMatch = paramId.match(/^(.*)-(\d+)$/);

  const { data: allComics, error } = await supabase
    .from("Comic")
    .select("id, title, year");

  if (error) throw error;

  let match: any;

  if (yearMatch) {
    const titleSlug = yearMatch[1];
    const year = Number(yearMatch[2]);
    match = allComics.find(
      (comic: any) => slugify(comic.title) === titleSlug && comic.year === year,
    );
  }

  if (!match && idMatch) {
    const id = Number(idMatch[2]);
    match = allComics.find((comic: any) => comic.id === id);
  }

  if (!match) {
    match = allComics.find((comic: any) => slugify(comic.title) === paramId);
  }

  if (!match) {
    throw new ApiNotFoundError("Comic not found");
  }

  return match.id;
}

export async function getAllComics(supabase: any) {
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

  const comics = (data as any[]).map((comic) => ({
    id: comic.id,
    title: comic.title,
    total_issues: comic.issues,
    year: comic.year,
    cover: comic.cover,
    language: comic.Idiom?.name || null,
    publisher: comic.Publisher?.name || null,
  }));

  return {
    success: true,
    count: comics.length,
    data: comics,
  };
}

export async function getComicById(paramId: string, supabase: any) {
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

  const authors = (authorsData as any[])?.map((ca) => ca.Author) || [];

  return {
    success: true,
    data: {
      id: data.id,
      title: data.title,
      total_issues: data.issues,
      year: data.year,
      cover: data.cover,
      language: data.Idiom?.name || null,
      publisher: data.Publisher?.name || null,
      authors,
    },
  };
}

export async function getComicIssues(paramId: string, supabase: any) {
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

  const issues = (issuesData.data as any[]).map((issue) => ({
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
    language: issue.Idiom?.name || null,
  }));

  return {
    success: true,
    comic_id: comicId,
    count: issues.length,
    data: issues,
  };
}
