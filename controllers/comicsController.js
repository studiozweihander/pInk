const { supabase } = require('../config/database');

class ComicsController {
  
  async getAllComics(req, res) {
    try {
      const { data, error } = await supabase
        .from('Comic')
        .select('*')
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
  }

  async getComicById(req, res) {
    try {
      const { id } = req.params;
      
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
  }

  async getComicIssues(req, res) {
    try {
      const { id } = req.params;
      
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
      
      const { data, error } = await supabase
        .from('Issue')
        .select('*')
        .eq('comicId', id)
        .order('issueNumber', { ascending: true });
      
      if (error) {
        throw error;
      }

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
  }
}

module.exports = new ComicsController();