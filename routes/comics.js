const express = require('express');
const router = express.Router();
const comicsController = require('../controllers/comicsController');

router.get('/', comicsController.getAllComics);

router.get('/:id', comicsController.getComicById);

router.get('/:id/issues', comicsController.getComicIssues);

module.exports = router;
