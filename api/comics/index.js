// api/comics/index-simple.js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }
  
  try {
    // Teste mais básico possível
    const { data, error } = await supabase
      .from('Comic')
      .select('id, title')
      .limit(10);
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({
        success: false,
        message: 'Database error',
        error: {
          message: error.message,
          code: error.code,
          details: error.details
        }
      });
    }
    
    // Retorno mínimo para testar
    const comics = data.map(comic => ({
      id: comic.id,
      title: comic.title,
      total_issues: 0,
      year: null,
      cover: null,
      language: null,
      publisher: null
    }));
    
    res.json({
      success: true,
      count: comics.length,
      data: comics,
      debug: {
        timestamp: new Date().toISOString(),
        query: 'SELECT id, title FROM Comic LIMIT 10'
      }
    });
    
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({
      success: false,
      message: 'Unexpected server error',
      error: {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    });
  }
};