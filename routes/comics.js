const express = require('express');
const router = express.Router();
const comicsController = require('../controllers/comicsController');

// GET /api/comics - Lista todos os quadrinhos
router.get('/', comicsController.getAllComics);

// GET /api/comics/:id - Detalhes de um quadrinho específico
router.get('/:id', comicsController.getComicById);

// GET /api/comics/:id/issues - Lista edições de um quadrinho
router.get('/:id/issues', comicsController.getComicIssues);

module.exports = router;
