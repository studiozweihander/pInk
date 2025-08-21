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
    const { data, error } = await supabase
      .from('Comic')
      .select(`
        id,
        title,
        issues,
        year,
        link,
        cover,
        language:Idiom(name),
        publisher:Publisher(name)
      `)
      .order('title', { ascending: true });
    
    if (error) {
      throw error;
    }
    
    // Transformar dados para formato esperado
    const comics = data.map(comic => ({
      id: comic.id,
      title: comic.title,
      total_issues: comic.issues,
      year: comic.year,
      link: comic.link,
      cover: comic.cover,
      language: comic.language?.name || null,
      publisher: comic.publisher?.name || null
    }));
    
    res.json({
      success: true,
      count: comics.length,
      data: comics
    });
    
  } catch (error) {
    console.error('Error fetching comics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching comics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};
