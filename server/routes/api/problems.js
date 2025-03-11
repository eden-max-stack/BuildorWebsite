const express = require("express");
const router = express.Router();
const problemsController = require("../../controllers/problemsController");

router.get('/', problemsController.getProblems);
router.post('/save-question', problemsController.postQuestion);
router.get('/:id', problemsController.getProblem);

module.exports = router;