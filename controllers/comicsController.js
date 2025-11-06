const { supabase } = require('../config/database');

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

async function findComicBySlugOrId(identifier) {
  const isNumericId = !isNaN(identifier) && !isNaN(parseFloat(identifier));

  if (isNumericId) {
    const { data, error } = await supabase
      .from('Comic')
      .select('*')
      .eq('id', parseInt(identifier))
      .single();

    if (error) return { data: null, error };
    return { data, foundBy: 'id' };
  }

  const slugClean = identifier.toLowerCase().replace(/-/g, ' ').trim();

  let { data, error } = await supabase
    .from('Comic')
    .select('*')
    .ilike('title', slugClean)
    .maybeSingle();

  if (data) return { data, foundBy: 'slug' };

  const keywords = slugClean.split(' ').filter(w => w.length > 2);

  for (const keyword of keywords) {
    const { data: keywordData } = await supabase
      .from('Comic')
      .select('*')
      .ilike('title', `%${keyword}%`)
      .limit(1)
      .maybeSingle();

    if (keywordData) return { data: keywordData, foundBy: 'slug' };
  }

  return { data: null, error: { code: 'PGRST116' } };
}

class ComicsController {

  async getAllComics(req, res) {
    try {
      const { data, error } = await supabase
        .from('Comic')
        .select('*')
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
  }

  async getComicById(req, res) {
    try {
      const { id } = req.params;

      const { data, error, foundBy } = await findComicBySlugOrId(id);

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
  }

  async getComicIssues(req, res) {
    try {
      const { id } = req.params;

      const { data: comicData, error: comicError } = await findComicBySlugOrId(id);

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

      res.json({
        success: true,
        comic_id: comicData.id,
        comic_title: comicData.title,
        comic_slug: utils.createSlug(comicData.title),
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
  }
}

module.exports = {
  ComicsController: new ComicsController(),
  utils: utils
};
