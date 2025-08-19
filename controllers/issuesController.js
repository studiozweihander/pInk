const { supabase } = require('../config/database');

class IssuesController {
  
  // GET /api/issues/:id - Detalhes completos de uma edição
  async getIssueById(req, res) {
    try {
      const { id } = req.params;
      
      const { data, error } = await supabase
        .from('Issue')
        .select(`
          id,
          title,
          issueNumber,
          year,
          size,
          series,
          genres,
          link,
          cover,
          synopsis,
          comicId,
          language:Idiom(name),
          comic:Comic(
            title,
            year,
            publisher:Publisher(name),
            authors:ComicAuthor(
              Author(id, name)
            )
          )
        `)
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
      
      // Parse genres se for string JSON
      let genres = data.genres;
      if (typeof genres === 'string') {
        try {
          genres = JSON.parse(genres);
        } catch (e) {
          // Se não for JSON válido, converte em array
          genres = genres.split(',').map(g => g.trim());
        }
      }
      
      // Transformar dados para formato esperado
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
        language: data.language?.name || null,
        comic_title: data.comic?.title || null,
        comic_year: data.comic?.year || null,
        publisher: data.comic?.publisher?.name || null,
        authors: data.comic?.authors?.map(ca => ca.Author) || []
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

  // GET /api/issues - Lista todas as edições (opcional, para busca geral)
  async getAllIssues(req, res) {
    try {
      const { limit = 50, offset = 0, search } = req.query;
      
      let query = supabase
        .from('Issue')
        .select(`
          id,
          title,
          issueNumber,
          year,
          cover,
          comicId,
          comic:Comic(title),
          language:Idiom(name)
        `, { count: 'exact' });
      
      // Filtro de busca
      if (search) {
        query = query.or(`title.ilike.%${search}%,comic.title.ilike.%${search}%`);
      }
      
      // Ordenação e paginação
      const { data, error, count } = await query
        .order('comic.title', { ascending: true })
        .order('issueNumber', { ascending: true })
        .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);
      
      if (error) {
        throw error;
      }
      
      // Transformar dados para formato esperado
      const issues = data.map(issue => ({
        id: issue.id,
        title: issue.title,
        issueNumber: issue.issueNumber,
        year: issue.year,
        cover: issue.cover,
        comicId: issue.comicId,
        comic_title: issue.comic?.title || null,
        language: issue.language?.name || null
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
