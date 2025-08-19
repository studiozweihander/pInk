const express = require('express');
const router = express.Router();
const issuesController = require('../controllers/issuesController');

// GET /api/issues - Lista todas as edições (com paginação e busca)
router.get('/', issuesController.getAllIssues);

// GET /api/issues/:id - Detalhes completos de uma edição
router.get('/:id', issuesController.getIssueById);

module.exports = router;
