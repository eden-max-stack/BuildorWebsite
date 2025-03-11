const express = require('express');
const router = express.Router();
const techStackRecController = require('../../controllers/techStackRecController');

router.get('/:careerGoal/:username', techStackRecController.techStackRecModel);

module.exports = router;