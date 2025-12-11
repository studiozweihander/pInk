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
    throw new Error(`❌ Missing required environment variable: ${key}`);
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

export const env: EnvConfig = {
  supabase: {
    url: getEnv('SUPABASE_URL'),
    anonKey: getEnv('SUPABASE_ANON_KEY'),
  },
  server: {
    port: parseInt(getEnv('PORT', '3000'), 10),
    nodeEnv: validateNodeEnv(getEnv('NODE_ENV', 'development')),
  },
  cors: {
    origin: getEnv('FRONTEND_URL', 'http://localhost:5173'),
  },
} as const;

if (env.server.nodeEnv === 'development') {
  console.log('🔧 Environment Configuration:');
  console.log(`   - Node Env: ${env.server.nodeEnv}`);
  console.log(`   - Port: ${env.server.port}`);
  console.log(`   - CORS Origin: ${env.cors.origin}`);
  console.error('');
}
