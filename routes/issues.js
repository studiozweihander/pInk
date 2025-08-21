const express = require('express');
const router = express.Router();
const issuesController = require('../controllers/issuesController');

router.get('/', issuesController.getAllIssues);

router.get('/:id', issuesController.getIssueById);

module.exports = router;
