const express = require("express");
const router = express.Router();
const saveDataController = require("../../controllers/saveDataController.js");

router.post("/", saveDataController.saveGithubProfile);
router.post("/save-user-data", saveDataController.saveUserData);

module.exports = router;
