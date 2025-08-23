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
      .from('Issue')
      .select('*')
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

    let idiomName = null;
    let comic = null;

    if (data.idiomId) {
      const { data: idiom } = await supabase.from('Idiom').select('name').eq('id', data.idiomId).single();
      idiomName = idiom?.name;
    }

    if (data.comicId) {
      const { data: comicData } = await supabase.from('Comic').select('*').eq('id', data.comicId).single();
      
      if (comicData) {
        let publisherName = null;
        if (comicData.publisherId) {
          const { data: publisher } = await supabase.from('Publisher').select('name').eq('id', comicData.publisherId).single();
          publisherName = publisher?.name;
        }
        
        comic = {
          id: comicData.id,
          title: comicData.title,
          publisher: publisherName
        };
      }
    }
    
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
      language: idiomName,
      comic: comic
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