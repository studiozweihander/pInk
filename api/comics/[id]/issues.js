const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = async (req, res) => {
  // CORS headers
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
    const { id } = req.query;
    
    // Primeiro verifica se o comic existe
    const { data: comic, error: comicError } = await supabase
      .from('Comic')
      .select('id')
      .eq('id', id)
      .single();
      
    if (comicError) {
      if (comicError.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Comic not found'
        });
      }
      throw comicError;
    }
    
    // Busca as edições
    const { data, error } = await supabase
      .from('Issue')
      .select(`
        id,
        title,
        issueNumber,
        year,
        size,
        series,
        genres,
        link,
        cover,
        synopsis,
        language:Idiom(name)
      `)
      .eq('comicId', id)
      .order('issueNumber', { ascending: true });
    
    if (error) {
      throw error;
    }
    
    // Transformar dados para formato esperado
    const issues = data.map(issue => ({
      id: issue.id,
      title: issue.title,
      issueNumber: issue.issueNumber,
      year: issue.year,
      size: issue.size,
      series: issue.series,
      genres: issue.genres,
      link: issue.link,
      cover: issue.cover,
      synopsis: issue.synopsis,
      language: issue.language?.name || null
    }));
    
    res.json({
      success: true,
      comic_id: parseInt(id),
      count: issues.length,
      data: issues
    });
    
  } catch (error) {
    console.error('Error fetching comic issues:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching comic issues',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};
