const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configuração do cliente Supabase
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env');
}

// Criar cliente Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false, // Backend não precisa persistir sessão
    autoRefreshToken: false,
  },
  db: {
    schema: 'public'
  }
});

// Função para testar conexão na inicialização
async function testConnection() {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    console.log(`🔗 Connecting to: ${SUPABASE_URL}`);
    
    // Testa conexão fazendo uma query simples na tabela Idiom
    const { data, error, count } = await supabase
      .from('Idiom')
      .select('*', { count: 'exact' })
      .limit(5);
      
    if (error) {
      throw new Error(`Supabase query failed: ${error.message} (Code: ${error.code})`);
    }
    
    // Sucesso na conexão
    console.log('✅ Supabase connection SUCCESSFUL!');
    console.log(`📊 Database test: Found ${count} languages in Idiom table`);
    console.log(`🎯 Sample data: ${data.map(d => d.name).join(', ')}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('🚀 Database ready for API requests!');
    
    return { success: true, count, sampleData: data };
    
  } catch (error) {
    // Falha na conexão
    console.error('❌ Supabase connection FAILED!');
    console.error(`💥 Error: ${error.message}`);
    
    if (error.message.includes('Missing environment variables')) {
      console.error('🔧 Solution: Check your .env file and ensure SUPABASE_URL and SUPABASE_ANON_KEY are set');
    } else if (error.message.includes('Invalid API key')) {
      console.error('🔐 Solution: Verify your SUPABASE_ANON_KEY is correct');
    } else if (error.message.includes('relation') && error.message.includes('does not exist')) {
      console.error('📋 Solution: Check if your database tables exist (Idiom, Comic, Issue, etc.)');
    } else {
      console.error('🌐 Solution: Verify your SUPABASE_URL and network connection');
    }
    
    console.error('⚠️  Server will continue but API endpoints will not work');
    throw error;
  }
}

module.exports = {
  supabase,
  testConnection
};
