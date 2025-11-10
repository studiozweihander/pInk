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

async function findComicByIdentifier(identifier) {
  const isNumericId = !isNaN(identifier) && !isNaN(parseFloat(identifier));

  if (isNumericId) {
    const { data, error } = await supabase
      .from('Comic')
      .select('*')
      .eq('id', parseInt(identifier))
      .single();

    if (error) return { data: null, error };
    return { data, foundBy: 'id' };
  } else {
    const expectedTitle = identifier.replace(/-/g, ' ');

    const { data: exactData, error: exactError } = await supabase
      .from('Comic')
      .select('*')
      .ilike('title', expectedTitle)
      .single();

    if (!exactError && exactData) {
      return { data: exactData, foundBy: 'slug' };
    }

    const words = expectedTitle.split(' ');
    let foundData = null;

    for (const word of words) {
      if (word.length > 2) {
        const { data, error } = await supabase
          .from('Comic')
          .select('*')
          .ilike('title', `%${word}%`)
          .single();

        if (!error && data) {
          foundData = data;
          break;
        }
      }
    }

    if (foundData) {
      return { data: foundData, foundBy: 'slug' };
    }

    const { data, error } = await supabase
      .from('Comic')
      .select('*')
      .ilike('title', `%${identifier}%`)
      .single();

    if (error) return { data: null, error };
    return { data, foundBy: 'slug' };
  }
}

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

    if (pathParts.length === 1) {
      const { data, error } = await supabase
        .from('Comic')
        .select('id, title, year, cover, idiomId, publisherId, issues')
        .order('title', { ascending: true });

      if (error) throw error;

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
        slug: utils.createSlug(comic.title),
        total_issues: comic.issues,
        year: comic.year,
        cover: comic.cover,
        language: idiomsMap.get(comic.idiomId) || null,
        publisher: publishersMap.get(comic.publisherId) || null
      }));

      return res.json({
        success: true,
        count: comics.length,
        data: comics
      });
    }

    if (pathParts.length === 2) {
      const identifier = pathParts[1];
      const { data, error, foundBy } = await findComicByIdentifier(identifier);

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({
            success: false,
            message: 'Comic not found'
          });
        }
        throw error;
      }

      if (!data) {
        return res.status(404).json({
          success: false,
          message: 'Comic not found'
        });
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
        .eq('comicId', data.id);

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
        authors: authors,
        slug: utils.createSlug(data.title)
      };

      return res.json({
        success: true,
        data: comic
      });
    }

    if (pathParts.length === 3 && pathParts[2] === 'issues') {
      const identifier = pathParts[1];
      const { data: comicData, error: comicError } = await findComicByIdentifier(identifier);

      if (comicError || !comicData) {
        if (comicError && comicError.code === 'PGRST116') {
          return res.status(404).json({
            success: false,
            message: 'Comic not found'
          });
        }
        throw comicError || new Error('Comic not found');
      }

      const { data, error } = await supabase
        .from('Issue')
        .select('*')
        .eq('comicId', comicData.id)
        .order('issueNumber', { ascending: true });

      if (error) throw error;

      const idiomIds = [...new Set(data.map(i => i.idiomId).filter(Boolean))];
      let idiomsMap = new Map();

      if (idiomIds.length > 0) {
        const { data: idioms } = await supabase.from('Idiom').select('*').in('id', idiomIds);
        idiomsMap = new Map(idioms.map(i => [i.id, i.name]));
      }

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
        language: idiomsMap.get(issue.idiomId) || null
      }));

      return res.json({
        success: true,
        comic_id: comicData.id,
        comic_title: comicData.title,
        comic_slug: utils.createSlug(comicData.title),
        count: issues.length,
        data: issues
      });
    }

    return res.status(404).json({
      success: false,
      message: `Endpoint not found: ${req.url}`,
      availableEndpoints: [
        'GET /api/comics',
        'GET /api/comics/:id',
        'GET /api/comics/:id/issues'
      ]
    });

  } catch (error) {
    console.error('Comics API error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};