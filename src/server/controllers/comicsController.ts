import { supabase } from "../config/database";
import type { Comic, Issue } from "../types";

export const comicsController = {
  async getAllComics() {
    try {
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
        `
        )
        .order("title", { ascending: true });

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
    } catch (error: any) {
      console.error("Error fetching comics:", error);
      throw new Error(error.message || "Error fetching comics");
    }
  },

  async getComicById({ params }: { params: Record<string, string> }) {
    const { id } = params;
    try {
      const { data, error } = await supabase
        .from("Comic")
        .select(
          `
          *,
          Idiom(name),
          Publisher(name)
        `
        )
        .eq("id", id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          throw new Error("Comic not found");
        }
        throw error;
      }

      const { data: authorsData } = await supabase
        .from("ComicAuthor")
        .select("Author(*)")
        .eq("comicId", id);

      const authors = (authorsData as any[])?.map((ca) => ca.Author) || [];

      const comic = {
        id: data.id,
        title: data.title,
        total_issues: data.issues,
        year: data.year,
        cover: data.cover,
        language: data.Idiom?.name || null,
        publisher: data.Publisher?.name || null,
        authors: authors,
      };

      return {
        success: true,
        data: comic,
      };
    } catch (error: any) {
      console.error("Error fetching comic by ID:", error);
      throw new Error(error.message || "Error fetching comic details");
    }
  },

  async getComicIssues({ params }: { params: Record<string, string> }) {
    const { id } = params;
    try {
      const [comicCheck, issuesData] = await Promise.all([
        supabase.from("Comic").select("id").eq("id", id).single(),
        supabase
          .from("Issue")
          .select("*, Idiom(name)")
          .eq("comicId", id)
          .order("issueNumber", { ascending: true }),
      ]);

      if (comicCheck.error) {
        if (comicCheck.error.code === "PGRST116") {
          throw new Error("Comic not found");
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
        comic_id: parseInt(id),
        count: issues.length,
        data: issues,
      };
    } catch (error: any) {
      console.error("Error fetching comic issues:", error);
      throw new Error(error.message || "Error fetching comic issues");
    }
  },
};
