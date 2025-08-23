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
      .select('*')
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

    let idiomName = null;
    let publisherName = null;
    let authors = [];

    if (data.idiomId) {
      const { data: idiom } = await supabase.from('Idiom').select('name').eq('id', data.idiomId).single();
      idiomName = idiom?.name;
    }

    if (data.publisherId) {
      const { data: publisher } = await supabase.from('Publisher').select('name').eq('id', data.publisherId).single();
      publisherName = publisher?.name;
    }

    const { data: comicAuthors } = await supabase
      .from('ComicAuthor')
      .select('authorId')
      .eq('comicId', id);
    
    if (comicAuthors && comicAuthors.length > 0) {
      const authorIds = comicAuthors.map(ca => ca.authorId);
      const { data: authorsData } = await supabase
        .from('Author')
        .select('*')
        .in('id', authorIds);
      authors = authorsData || [];
    }
    
    const comic = {
      id: data.id,
      title: data.title,
      total_issues: data.issues,
      year: data.year,
      cover: data.cover,
      language: idiomName,
      publisher: publisherName,
      authors: authors
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