const express = require('express');
const router = express.Router();
const { ComicsController, utils } = require('../controllers/comicsController');

router.get('/', ComicsController.getAllComics);

router.get('/:id', ComicsController.getComicById);

router.get('/:id/issues', ComicsController.getComicIssues);

router.post('/utils/slugify', (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({
      success: false,
      message: 'Title is required'
    });
  }

  const slug = utils.createSlug(title);
  res.json({
    success: true,
    slug: slug
  });
});

module.exports = router;
