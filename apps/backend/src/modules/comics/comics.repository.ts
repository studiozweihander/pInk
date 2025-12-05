import { supabase, handleSupabaseError } from "@/config/database";
import { NotFoundError } from "@/shared/errors/AppError";
import type { Idiom, Publisher, Author } from '@pink/shared';
import type { ComicDB, ComicFilters, PaginationOptions, PaginatedComics } from '@comics.types';
import { off } from "node:process";

export class ComicsRepository {
  async findAll(options?: PaginationOptions): Promise<PaginatedComics> {
    try {
      const limit = options?.limit || 100;
      const offset = options?.offset || 0;

      const query = supabase
        .from("Comic")
        .select("*", { count: "exact" })
        .order("title", { ascending: true });

      const { data, error, count } = await query.range(offset, offset + limit - 1);

      if (error) {
        handleSupabaseError(error, "findAll comics");
      }

      return {
        comics: data || [],
        total: count || 0,
        hasMore: (offset + (data?.length || 0)) < (count || 0),
      };
    } catch (error) {
      console.error('❌ Error in ComicsRepository.findAll:', error);
      throw error;
    }
  };

  async findById(id: number): Promise<ComicDB> {
    try {
      const { data, error } = await supabase
        .from("Comic")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          throw new NotFoundError("Comic");
        }
        handleSupabaseError(error, "findById comic");
      }

      return data!;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;

      console.error('❌ Error in ComicsRepository.findById:', error);
      throw error;
    }
  };

  async findWithFilters(filters: ComicFilters, options?: PaginationOptions): Promise<PaginatedComics> {
    try {
      const limit = options?.limit || 100;
      const offset = options?.offset || 0;

      let query = supabase
        .from("Comic")
        .select("*", { count: "exact" })
        .order("title", { ascending: true });

      if (filters.publisherId) { query = query.eq("publisherId", filters.publisherId) };
      if (filters.idiomId) { query = query.eq("idiomId", filters.idiomId) };
      if (filters.year) { query = query.eq("year", filters.year) };
      if (filters.search) { query = query.eq("title", `%${filters.search}%`) };

      const { data, error, count } = await query.range(offset, offset + limit - 1);

      if (error) {
        handleSupabaseError(error, "findWithFilters comics");
      }

      return {
        comics: data || [],
        total: count || 0,
        hasMore: (offset + (data?.length || 0)) < (count || 0),
      };
    } catch (error) {
      console.error('❌ Error in ComicsRepository.findWithFilters:', error);
      throw error;
    }
  };

   async getIdiomsByIds(ids: (number | null)[]): Promise<Map<number, Idiom>> {
    try {
      const validIds = [...new Set(ids.filter((id): id is number => id !== null))];

      if (validIds.length === 0) {
        return new Map();
      }

      const { data, error } = await supabase
        .from('Idiom')
        .select('*')
        .in('id', validIds);

      if (error) {
        handleSupabaseError(error, 'getIdiomsByIds');
      }

      return new Map((data || []).map(idiom => [idiom.id, idiom]));
    } catch (error) {
      console.error('❌ Error in ComicsRepository.getIdiomsByIds:', error);
      return new Map();
    }
  };

  async getPublishersByIds(ids: (number | null)[]): Promise<Map<number, Publisher>> {
    try {
      const validIds = [...new Set(ids.filter((id): id is number => id !== null))];

      if (validIds.length === 0) {
        return new Map();
      }

      const { data, error } = await supabase
        .from('Publisher')
        .select('*')
        .in('id', validIds);

      if (error) {
        handleSupabaseError(error, 'getPublishersByIds');
      }

      return new Map((data || []).map(publisher => [publisher.id, publisher]));
    } catch (error) {
      console.error('❌ Error in ComicsRepository.getPublishersByIds:', error);
      return new Map();
    }
  };

  async exists(id: number): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('Comic')
        .select('id')
        .eq('id', id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        handleSupabaseError(error, 'exists comic');
      }

      return data !== null;
    } catch (error) {
      console.error('❌ Error in ComicsRepository.exists:', error);
      return false;
    }
  };

  async count(): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('Comic')
        .select('*', { count: 'exact', head: true });

      if (error) {
        handleSupabaseError(error, 'count comics');
      }

      return count || 0;
    } catch (error) {
      console.error('❌ Error in ComicsRepository.count:', error);
      return 0;
    }
  };
};
