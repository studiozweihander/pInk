import { supabase, handleSupabaseError } from "@/config/database";
import type { IssueDB } from "./issues.types";

export class IssuesRepository {
  async findById(id: number): Promise<IssueDB | null> {
    const { data, error } = await supabase
      .from("Issue")
      .select("*")
      .eq("id", id)
      .single();

    if (error) handleSupabaseError(error, "issues.findById");
    return data ?? null;
  }

  async findByComic(comicId: number): Promise<IssueDB[]> {
    const { data, error } = await supabase
      .from("Issue")
      .select("*")
      .eq("comicId", comicId)
      .order("issueNumber", { ascending: true });

    if (error) handleSupabaseError(error, "issues.findByComic");
    return data ?? [];
  }

  async create(payload: Partial<IssueDB>): Promise<IssueDB> {
    const { data, error } = await supabase
      .from("Issue")
      .select()
      .single();

    if (error) handleSupabaseError(error, "issues.create");
    if (!data) throw new Error("Failed to insert issue");
    return data;
  }
}