const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const utils = {
  createSlug: function(title) {
    if (!title || typeof title !== 'string') {
      return '';
    }
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .replace(/^-|-$/g, '');
  }
};

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
    const url = new URL(req.url, `https://${req.headers.host}`);
    const pathParts = url.pathname.split('/').filter(part => part.length > 0);
    const { limit = 50, offset = 0, search } = Object.fromEntries(url.searchParams);

    if (pathParts.length === 1) {
      let query = supabase
        .from('Issue')
        .select('*', { count: 'exact' });
      
      if (search) {
        query = query.ilike('title', `%${search}%`);
      }
      
      const { data, error, count } = await query
        .order('issueNumber', { ascending: true })
        .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);
      
      if (error) {
        throw error;
      }

      const comicIds = [...new Set(data.map(i => i.comicId).filter(Boolean))];
      const idiomIds = [...new Set(data.map(i => i.idiomId).filter(Boolean))];
      
      let comicsMap = new Map();
      let idiomsMap = new Map();

      if (comicIds.length > 0) {
        const { data: comics } = await supabase.from('Comic').select('id, title').in('id', comicIds);
        comicsMap = new Map(comics.map(c => [c.id, c.title]));
      }

      if (idiomIds.length > 0) {
        const { data: idioms } = await supabase.from('Idiom').select('id, name').in('id', idiomIds);
        idiomsMap = new Map(idioms.map(i => [i.id, i.name]));
      }
      
      const issues = data.map(issue => {
        let genres = issue.genres;
        if (typeof genres === 'string') {
          try {
            genres = JSON.parse(genres);
          } catch (e) {
            genres = genres.split(',').map(g => g.trim());
          }
        }
        
        return {
          id: issue.id,
          title: issue.title,
          issueNumber: issue.issueNumber,
          year: issue.year,
          size: issue.size,
          series: issue.series,
          genres: genres,
          link: issue.link,
          cover: issue.cover,
          synopsis: issue.synopsis,
          comicId: issue.comicId,
          language: idiomsMap.get(issue.idiomId) || null,
          comic_title: comicsMap.get(issue.comicId) || null,
          credito: issue.credito || null,
          creditoLink: issue.creditoLink || null
        };
      });
      
      return res.json({
        success: true,
        count: issues.length,
        total: count,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          has_more: parseInt(offset) + issues.length < count
        },
        data: issues
      });
    }

    if (pathParts.length === 2) {
      const issueId = pathParts[1];
      
      const { data, error } = await supabase
        .from('Issue')
        .select('*')
        .eq('id', issueId)
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
      let comicTitle = null;
      let comicYear = null;
      let publisherName = null;
      let authors = [];

      if (data.idiomId) {
        const { data: idiom } = await supabase.from('Idiom').select('name').eq('id', data.idiomId).single();
        idiomName = idiom?.name;
      }

      if (data.comicId) {
        const { data: comicData } = await supabase.from('Comic').select('*').eq('id', data.comicId).single();
        
        if (comicData) {
          comicTitle = comicData.title;
          comicYear = comicData.year;
          
          if (comicData.publisherId) {
            const { data: publisher } = await supabase.from('Publisher').select('name').eq('id', comicData.publisherId).single();
            publisherName = publisher?.name;
          }

          const { data: comicAuthors } = await supabase
            .from('ComicAuthor')
            .select('authorId')
            .eq('comicId', data.comicId);
          
          if (comicAuthors && comicAuthors.length > 0) {
            const authorIds = comicAuthors.map(ca => ca.authorId);
            const { data: authorsData } = await supabase
              .from('Author')
              .select('*')
              .in('id', authorIds);
            authors = authorsData || [];
          }
        }
      }
      
      let genres = data.genres;
      if (typeof genres === 'string') {
        try {
          genres = JSON.parse(genres);
        } catch (e) {
          genres = genres.split(',').map(g => g.trim());
        }
      }
      
      const issue = {
        id: data.id,
        title: data.title,
        issueNumber: data.issueNumber,
        year: data.year,
        size: data.size,
        series: data.series,
        genres: genres,
        link: data.link,
        cover: data.cover,
        synopsis: data.synopsis,
        comicId: data.comicId,
        language: idiomName,
        comic_title: comicTitle,
        comic_year: comicYear,
        publisher: publisherName,
        authors: authors,
        credito: data.credito,
        creditoLink: data.creditoLink
      };
      
      return res.json({
        success: true,
        data: issue
      });
    }

    return res.status(404).json({
      success: false,
      message: `Endpoint not found: ${req.url}`,
      availableEndpoints: [
        'GET /api/issues',
        'GET /api/issues/:id',
        'GET /api/issues?search=&limit=&offset='
      ]
    });

  } catch (error) {
    console.error('Issues API error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching issues data',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};