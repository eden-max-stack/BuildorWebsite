const express = require('express');
const router = express.Router();
const githubAPIController = require('../../controllers/githubAPIController');

router.get('/repos', githubAPIController.getUserRepos); // getting all repos belonging to user
router.get("/repos/:owner/:repo/languages", githubAPIController.getRepoLanguages); // getting user languages / tech stack
router.get("/repos/:owner/:repo/commits", githubAPIController.getCommitHistory); // getting commit history
router.get("/:user/starred", githubAPIController.getStarredRepos); // getting starred repos
router.get("/user", githubAPIController.getUserId); // getting user details

module.exports = router;