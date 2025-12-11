import { config } from 'dotenv';
import { resolve } from 'node:path';

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
const envPath = resolve(process.cwd(), envFile);

const result = config({ path: envPath });

if (result.error && process.env.NODE_ENV !== 'test') {
  console.warn(`⚠️ Could not load ${envFile}: ${result.error.message}`);
}

interface EnvConfig {
  supabase: {
    url: string;
    anonKey: string;
  };
  server: {
    port: number;
    nodeEnv: 'development' | 'production' | 'test';
  };
  cors: {
    origin: string;
  };
}

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;

  if (!value) {
    const message = `Missing required environment variable: ${key}`;
    console.error(`❌ ${message}`);
    
    if (process.env.NODE_ENV === 'production') {
      throw new Error(message);
    }
    
    if (defaultValue) {
      console.warn(`⚠️ Using default value for ${key}`);
      return defaultValue;
    }
    
    throw new Error(message);
  }

  return value;
};

const validateNodeEnv = (env: string): 'development' | 'production' | 'test' => {
  const validEnvs = ['development', 'production', 'test'];

  if (!validEnvs.includes(env)) {
    console.warn(`⚠️ Invalid NODE_ENV: ${env}. Defaulting to 'development'`);
    return 'development';
  }

  return env as 'development' | 'production' | 'test';
};

const nodeEnv = validateNodeEnv(process.env.NODE_ENV || 'development');

export const env = {
  supabase: {
    url: getEnv('SUPABASE_URL'),
    anonKey: getEnv('SUPABASE_ANON_KEY'),
  },
  server: {
    port: parseInt(getEnv('PORT', '3000'), 10),
    nodeEnv,
  },
  cors: {
    origin: getEnv('FRONTEND_URL', 'http://localhost:5173'),
  },
} as const;

if (nodeEnv === 'production') {
  const requiredKeys = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
  const missing = requiredKeys.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`❌ Missing required environment variables in production: ${missing.join(', ')}`);
  }
}

export type Env = typeof env;
