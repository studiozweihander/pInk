import { supabase, handleSupabaseError } from '@config/database';
import type { Author } from '@pink/shared';

export class AuthorsRepository {
  async getAuthorsByComicId(comicId: number): Promise<Author[]> {
    try {
      const { data, error } = await supabase
        .from('ComicAuthor')
        .select('authorId')
        .eq('comicId', comicId);

      if (error) {
        handleSupabaseError(error, 'getAuthorsByComicId');
      }

      if (!data || data.length === 0) {
        return [];
      }

      const authorIds = data.map((ca) => ca.authorId);

      const { data: authors, error: authorsError } = await supabase
        .from('Author')
        .select('*')
        .in('id', authorIds) as { data: Author[] | null; error: any };

      if (authorsError) {
        handleSupabaseError(authorsError, 'getAuthorsByComicId - authors');
      }

      return authors || [];
    } catch (error) {
      console.error('❌ Error in AuthorsRepository.getAuthorsByComicId:', error);
      return [];
    }
  }

  async getAuthorsByIds(ids: number[]): Promise<Map<number, Author[]>> {
    try {
      const validIds = [...new Set(ids.filter((id) => id > 0))];

      if (validIds.length === 0) {
        return new Map();
      }

      const { data, error } = await supabase
        .from('ComicAuthor')
        .select('comicId, authorId')
        .in('comicId', validIds);

      if (error) {
        handleSupabaseError(error, 'getAuthorsByIds - comicAuthor');
      }

      if (!data || data.length === 0) {
        return new Map();
      }

      const authorIds = [...new Set(data.map((ca) => ca.authorId))];

      const { data: authors, error: authorsError } = await supabase
        .from('Author')
        .select('*')
        .in('id', authorIds) as { data: Author[] | null; error: any };

      if (authorsError) {
        handleSupabaseError(authorsError, 'getAuthorsByIds - authors');
      }

      const authorsMap = new Map<number, Author>();
      (authors || []).forEach((author) => {
        authorsMap.set(author.id, author);
      });

      const comicAuthorsMap = new Map<number, Author[]>();

      data.forEach((ca) => {
        const author = authorsMap.get(ca.authorId);
        if (author) {
          const existing = comicAuthorsMap.get(ca.comicId) || [];
          comicAuthorsMap.set(ca.comicId, [...existing, author]);
        }
      });

      return comicAuthorsMap;
    } catch (error) {
      console.error('❌ Error in AuthorsRepository.getAuthorsByIds:', error);
      return new Map();
    }
  }
}