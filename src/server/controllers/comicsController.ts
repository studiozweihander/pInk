import { supabase } from "../config/database";
import type { Comic, Issue } from "../types";
import { slugify } from "../utils/slugify";

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
    const { id: paramId } = params;
    try {
      let numericId: number | null = parseInt(paramId);

      if (isNaN(numericId)) {
        const yearMatch = paramId.match(/^(.*)-(\d{4})$/);
        const idMatch = paramId.match(/^(.*)-(\d+)$/);

        const { data: allComics, error: allComicsError } = await supabase
          .from("Comic")
          .select("id, title, year");

        if (allComicsError) throw allComicsError;

        let matchingComic;

        if (yearMatch) {
          const titleSlug = yearMatch[1];
          const year = parseInt(yearMatch[2]);
          matchingComic = allComics.find(
            (c) => slugify(c.title) === titleSlug && c.year === year
          );
        }

        if (!matchingComic && idMatch) {
          const id = parseInt(idMatch[2]);
          matchingComic = allComics.find((c) => c.id === id);
        }

        if (!matchingComic) {
          matchingComic = allComics.find((c) => slugify(c.title) === paramId);
        }

        if (!matchingComic) throw new Error("NOT_FOUND: Comic not found");
        numericId = matchingComic.id;
      }

      const { data, error } = await supabase
        .from("Comic")
        .select(
          `
          *,
          Idiom(name),
          Publisher(name)
        `
        )
        .eq("id", numericId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          throw new Error("NOT_FOUND: Comic not found");
        }
        throw error;
      }

      const { data: authorsData } = await supabase
        .from("ComicAuthor")
        .select("Author(*)")
        .eq("comicId", numericId);

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
      console.error("Error fetching comic by ID/Slug:", error);
      throw error;
    }
  },

  async getComicIssues({ params }: { params: Record<string, string> }) {
    const { id: paramId } = params;
    try {
      let numericId: number | null = parseInt(paramId);

      if (isNaN(numericId)) {
        const yearMatch = paramId.match(/^(.*)-(\d{4})$/);
        const idMatch = paramId.match(/^(.*)-(\d+)$/);

        const { data: allComics, error: allComicsError } = await supabase
          .from("Comic")
          .select("id, title, year");

        if (allComicsError) throw allComicsError;

        let matchingComic;

        if (yearMatch) {
          const titleSlug = yearMatch[1];
          const year = parseInt(yearMatch[2]);
          matchingComic = allComics.find(
            (c) => slugify(c.title) === titleSlug && c.year === year
          );
        }

        if (!matchingComic && idMatch) {
          const id = parseInt(idMatch[2]);
          matchingComic = allComics.find((c) => c.id === id);
        }

        if (!matchingComic) {
          matchingComic = allComics.find((c) => slugify(c.title) === paramId);
        }

        if (!matchingComic) throw new Error("NOT_FOUND: Comic not found");
        numericId = matchingComic.id;
      }

      const [comicCheck, issuesData] = await Promise.all([
        supabase.from("Comic").select("id").eq("id", numericId).single(),
        supabase
          .from("Issue")
          .select("*, Idiom(name)")
          .eq("comicId", numericId)
          .order("issueNumber", { ascending: true }),
      ]);

      if (comicCheck.error) {
        if (comicCheck.error.code === "PGRST116") {
          throw new Error("NOT_FOUND: Comic not found");
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
        comic_id: numericId,
        count: issues.length,
        data: issues,
      };
    } catch (error: any) {
      console.error("Error fetching comic issues by ID/Slug:", error);
      throw error;
    }
  },
};
