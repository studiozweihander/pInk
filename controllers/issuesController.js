const { supabase } = require('../config/database');

class IssuesController {
  
  async getIssueById(req, res) {
    try {
      const { id } = req.params;
      
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
  }

  async getAllIssues(req, res) {
    try {
      const { limit = 50, offset = 0, search } = req.query;
      
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
      
      const issues = data.map(issue => ({
        id: issue.id,
        title: issue.title,
        issueNumber: issue.issueNumber,
        year: issue.year,
        cover: issue.cover,
        comicId: issue.comicId,
        comic_title: comicsMap.get(issue.comicId) || null,
        language: idiomsMap.get(issue.idiomId) || null,
        credito: issue.credito || null,
        creditoLink: issue.creditoLink || null
      }));
      
      res.json({
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
      
    } catch (error) {
      console.error('Error fetching all issues:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching issues',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
}

module.exports = new IssuesController();