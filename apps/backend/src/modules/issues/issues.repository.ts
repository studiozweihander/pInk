import { supabase, handleSupabaseError } from "@config/database";
import { NotFoundError } from "@shared/errors/AppError";
import type { IssueDB } from "@issues/issues.types";
import type { PaginationOptions } from "@comics/comics.types";

interface PaginatedIssues {
  issues: IssueDB[];
  total: number;
  hasMore: boolean;
}

export class IssuesRepository {
  async findById(id: number): Promise<IssueDB> {
    try {
      const { data, error } = await supabase
        .from("Issue")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          throw new NotFoundError("Issue");
        }
        handleSupabaseError(error, "findById issue");
      }

      return data!;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;

      console.error("❌ Error in IssuesRepository.findById:", error);
      throw error;
    }
  }

  async findByComic(
    comicId: number,
    options?: PaginationOptions
  ): Promise<PaginatedIssues> {
    try {
      const limit = options?.limit || 100;
      const offset = options?.offset || 0;

      const query = supabase
        .from("Issue")
        .select("*", { count: "exact" })
        .eq("comicId", comicId)
        .order("issueNumber", { ascending: true });

      const { data, error, count } = await query.range(
        offset,
        offset + limit - 1
      );

      if (error) {
        handleSupabaseError(error, "findByComic issues");
      }

      return {
        issues: data || [],
        total: count || 0,
        hasMore: offset + (data?.length || 0) < (count || 0),
      };
    } catch (error) {
      console.error("❌ Error in IssuesRepository.findByComic:", error);
      throw error;
    }
  }

  async findAll(options?: PaginationOptions): Promise<PaginatedIssues> {
    try {
      const limit = options?.limit || 100;
      const offset = options?.offset || 0;

      const query = supabase
        .from("Issue")
        .select("*", { count: "exact" })
        .order("comicId", { ascending: true })
        .order("issueNumber", { ascending: true });

      const { data, error, count } = await query.range(
        offset,
        offset + limit - 1
      );

      if (error) {
        handleSupabaseError(error, "findAll issues");
      }

      return {
        issues: data || [],
        total: count || 0,
        hasMore: offset + (data?.length || 0) < (count || 0),
      };
    } catch (error) {
      console.error("❌ Error in IssuesRepository.findAll:", error);
      throw error;
    }
  }

  async exists(id: number): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from("Issue")
        .select("id")
        .eq("id", id)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        handleSupabaseError(error, "exists issue");
      }

      return data !== null;
    } catch (error) {
      console.error("❌ Error in IssuesRepository.exists:", error);
      return false;
    }
  }

  async count(): Promise<number> {
    try {
      const { count, error } = await supabase
        .from("Issue")
        .select("*", { count: "exact", head: true });

      if (error) {
        handleSupabaseError(error, "count issues");
      }

      return count || 0;
    } catch (error) {
      console.error("❌ Error in IssuesRepository.count:", error);
      return 0;
    }
  }
}
