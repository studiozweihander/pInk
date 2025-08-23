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
    const { data, error } = await supabase
      .from('Comic')
      .select('id, title, year, cover, idiomId, publisherId, issues')
      .order('title', { ascending: true });
    
    if (error) {
      throw error;
    }

    const idiomIds = [...new Set(data.map(c => c.idiomId).filter(Boolean))];
    const publisherIds = [...new Set(data.map(c => c.publisherId).filter(Boolean))];

    let idiomsMap = new Map();
    let publishersMap = new Map();

    if (idiomIds.length > 0) {
      const { data: idioms } = await supabase.from('Idiom').select('*').in('id', idiomIds);
      idiomsMap = new Map(idioms.map(i => [i.id, i.name]));
    }

    if (publisherIds.length > 0) {
      const { data: publishers } = await supabase.from('Publisher').select('*').in('id', publisherIds);
      publishersMap = new Map(publishers.map(p => [p.id, p.name]));
    }
    
    const comics = data.map(comic => ({
      id: comic.id,
      title: comic.title,
      total_issues: comic.issues,
      year: comic.year,
      cover: comic.cover,
      language: idiomsMap.get(comic.idiomId) || null,
      publisher: publishersMap.get(comic.publisherId) || null
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