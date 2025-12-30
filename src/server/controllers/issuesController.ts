import { supabase } from "../config/database";

export const issuesController = {
  async getIssueById({ params }: { params: Record<string, string> }) {
    const { id } = params;
    try {
      const { data, error } = await supabase
        .from("Issue")
        .select("*, Idiom(name), Comic(*, Publisher(name))")
        .eq("id", id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          throw new Error("Issue not found");
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
        } catch (e) {
          genres = genres.split(",").map((g: string) => g.trim());
        }
      }

      const issue = {
        id: data.id,
        title: data.title,
        issueNumber: data.issueNumber,
        year: data.year,
        size: data.size,
        series: data.series,
        genres: genres,
        link: data.link,
        cover: data.cover,
        synopsis: data.synopsis,
        comicId: data.comicId,
        language: data.Idiom?.name || null,
        comic_title: data.Comic?.title || null,
        comic_year: data.Comic?.year || null,
        publisher: data.Comic?.Publisher?.name || null,
        authors: authors,
        credito: data.credito,
        creditoLink: data.creditoLink,
      };

      return {
        success: true,
        data: issue,
      };
    } catch (error: any) {
      console.error("Error fetching issue by ID:", error);
      throw new Error(error.message || "Error fetching issue details");
    }
  },

  async getAllIssues({
    query,
  }: {
    query: { limit?: string; offset?: string; search?: string };
  }) {
    try {
      const limit = parseInt(query.limit || "50");
      const offset = parseInt(query.offset || "0");
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
    } catch (error: any) {
      console.error("Error fetching all issues:", error);
      throw new Error(error.message || "Error fetching issues");
    }
  },
};
