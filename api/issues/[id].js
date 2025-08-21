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
        comicId,
        language:Idiom(name),
        comic:Comic(
          id,
          title,
          publisher:Publisher(name)
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Issue not found'
        });
      }
      throw error;
    }
    
    // Transformar dados para formato esperado
    const issue = {
      id: data.id,
      title: data.title,
      issueNumber: data.issueNumber,
      year: data.year,
      size: data.size,
      series: data.series,
      genres: data.genres,
      link: data.link,
      cover: data.cover,
      synopsis: data.synopsis,
      comicId: data.comicId,
      language: data.language?.name || null,
      comic: data.comic ? {
        id: data.comic.id,
        title: data.comic.title,
        publisher: data.comic.publisher?.name || null
      } : null
    };
    
    res.json({
      success: true,
      data: issue
    });
    
  } catch (error) {
    console.error('Error fetching issue by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching issue details',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};
