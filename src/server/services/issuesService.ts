import { ApiNotFoundError } from "./errors";

export async function getIssueById(id: string, supabase: any) {
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

  const { data: authorsData } = await supabase
    .from("ComicAuthor")
    .select("Author(*)")
    .eq("comicId", data.comicId);

  const authors = (authorsData as any[])?.map((ca) => ca.Author) || [];

  let genres = data.genres;
  if (typeof genres === "string") {
    try {
      genres = JSON.parse(genres);
    } catch {
      genres = genres.split(",").map((genre: string) => genre.trim());
    }
  }

  return {
    success: true,
    data: {
      id: data.id,
      title: data.title,
      issueNumber: data.issueNumber,
      year: data.year,
      size: data.size,
      series: data.series,
      genres,
      link: data.link,
      cover: data.cover,
      synopsis: data.synopsis,
      comicId: data.comicId,
      language: data.Idiom?.name || null,
      comic_title: data.Comic?.title || null,
      comic_year: data.Comic?.year || null,
      publisher: data.Comic?.Publisher?.name || null,
      authors,
      credito: data.credito,
      creditoLink: data.creditoLink,
    },
  };
}

export async function getAllIssues(
  query: { limit?: string; offset?: string; search?: string },
  supabase: any,
) {
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

  const issues = (data as any[]).map((issue) => ({
    id: issue.id,
    title: issue.title,
    issueNumber: issue.issueNumber,
    year: issue.year,
    cover: issue.cover,
    comicId: issue.comicId,
    comic_title: issue.Comic?.title || null,
    language: issue.Idiom?.name || null,
    credito: issue.credito || null,
    creditoLink: issue.creditoLink || null,
  }));

  return {
    success: true,
    count: issues.length,
    total: count,
    pagination: {
      limit,
      offset,
      has_more: offset + issues.length < (count || 0),
    },
    data: issues,
  };
}
