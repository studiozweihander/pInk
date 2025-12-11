import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from './env';
import type { ComicBase, Idiom, Publisher, Author, Issue } from '@pink/shared';

export interface Database {
  public: {
    Tables: {
      Comic: {
        Row: ComicBase;
        Insert: Omit<ComicBase, 'id'>;
        Update: Partial<Omit<ComicBase, 'id'>>;
      };
      Issue: {
        Row: Issue;
        Insert: Omit<Issue, 'id'>;
        Update: Partial<Omit<Issue, 'id'>>;
      };
      Idiom: {
        Row: Idiom;
        Insert: Omit<Idiom, 'id'>;
        Update: Partial<Omit<Idiom, 'id'>>;
      };
      Publisher: {
        Row: Publisher;
        Insert: Omit<Publisher, 'id'>;
        Update: Partial<Omit<Publisher, 'id'>>;
      };
      Author: {
        Row: Author;
        Insert: Omit<Author, 'id'>;
        Update: Partial<Omit<Author, 'id'>>;
      };
      ComicAuthor: {
        Row: {
          comicId: number;
          authorId: number;
        };
        Insert: {
          comicId: number;
          authorId: number;
        };
        Update: Partial<{
          comicId: number;
          authorId: number;
        }>;
      };
    };
  };
}

export const supabase: SupabaseClient<Database> = createClient(
  env.supabase.url,
  env.supabase.anonKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    db: {
      schema: 'public',
    },
  }
);

export const testConnection = async (): Promise<boolean> => {
  try {
    console.log('🔍 Testing Supabase connection...');
    console.error('');
    
    const { data, error, count } = await supabase
      .from('Comic')
      .select('*', { count: 'exact' })
      .limit(1)
      .returns<ComicBase[]>();

    if (error) {
      throw new Error(`Supabase query failed: ${error.message} (Code: ${error.code})`);
    }

    console.log('✅ Supabase connection SUCCESSFUL!');
    console.log(`📊 Database test: Found ${count} comics in database`);

    const comics = data ?? [];
    const first = comics[0];

    if (first) {
      console.log(`🎯 Sample comic: "${first.title}"`);
    }

    console.log(`🌍 Environment: ${env.server.nodeEnv}`);

    return true;
  } catch (error) {
    console.error('❌ Supabase connection FAILED!');

    if (error instanceof Error) {
      console.error(`💥 Error: ${error.message}`);

      if (error.message.includes('Invalid API key')) {
        console.error('🔐 Solution: Verify your SUPABASE_ANON_KEY is correct');
      } else if (error.message.includes('relation') && error.message.includes('does not exist')) {
        console.error('📋 Solution: Check if your database tables exist (Comic, Issue, etc.)');
      } else if (error.message.includes('fetch')) {
        console.error('🌐 Solution: Verify your SUPABASE_URL and network connection');
      }
    }

    console.error('⚠️  Server will exit. Fix the database connection and try again.');
    return false;
  }
};

export const handleSupabaseError = (error: any, context: string) => {
  if (!error) return;

  console.error(`❌ Supabase error in ${context}:`, {
    message: error.message,
    code: error.code,
    details: error.details,
  });

  throw new Error(`Database error in ${context}: ${error.message}`);
};
