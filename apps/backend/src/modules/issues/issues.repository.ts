import { supabase, handleSupabaseError } from "@/config/database";
import type { IssueDB } from "./issues.types";
import type { Issue } from "./issues.types";

export class IssuesRepository {
  async findById(id: string): Promise<IssueDB | null> {
    const { data, error } = await supabase
      .from("Issue")
      .select("*")
      .eq("id", id)
      .single();

    if (error) handleSupabaseError(error, "issues.findById");
    return data ?? null;
  }

  async findByComic(comicId: string): Promise<IssueDB[]> {
    const { data, error } = await supabase
      .from("Issue")
      .select("*")
      .eq("comic_id", comicId)
      .order("number", { ascending: true });

    if (error) handleSupabaseError(error, "issues.findByComic");
    return data ?? [];
  }

  async create(payload: Partial<IssueDB>): Promise<IssueDB> {
    const { data, error } = await supabase
      .from("Issue")
      .insert([payload])
      .select()
      .single();

    if (error) handleSupabaseError(error, "issues.create");
    if (!data) throw new Error("Failed to insert issue");
    return data;
  }
}
