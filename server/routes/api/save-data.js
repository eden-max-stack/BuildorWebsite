const express = require("express");
const router = express.Router();
const saveDataController = require("../../controllers/saveDataController.js");

router.post("/", saveDataController.saveData);

module.exports = router;
