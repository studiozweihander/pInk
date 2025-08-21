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
    const { id } = req.query;
    
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
        publisher:Publisher(name),
        authors:ComicAuthor(
          Author(id, name)
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Comic not found'
        });
      }
      throw error;
    }
    
    const comic = {
      id: data.id,
      title: data.title,
      total_issues: data.issues,
      year: data.year,
      link: data.link,
      cover: data.cover,
      language: data.language?.name || null,
      publisher: data.publisher?.name || null,
      authors: data.authors?.map(ca => ca.Author) || []
    };
    
    res.json({
      success: true,
      data: comic
    });
    
  } catch (error) {
    console.error('Error fetching comic by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching comic details',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};
