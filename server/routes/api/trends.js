const express = require("express");
const router = express.Router();
const { getTrendsData } = require("../../controllers/trendsController");

router.get("/", getTrendsData);

module.exports = router;
