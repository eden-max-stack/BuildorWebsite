const express = require("express");
const axios = require("axios");

const router = express.Router();

// Define Axios instance for Piston API
const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});

// Language versions mapping
const LANGUAGE_VERSIONS = {
  javascript: "18.15.0",
  python: "3.10.0",
  cpp: "10.2.0",
};

// Route for executing code
router.post("/", async (req, res) => {
  const { code, language, expectedOutput } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Execute code using Piston API
    const response = await API.post("/execute", {
      language,
      version: LANGUAGE_VERSIONS[language] || "latest",
      files: [{ content: code }],
    });

    console.log("Piston API Response:", response.data); // Debugging log

    // Check if response contains 'run' key
    if (!response.data.run) {
      return res.status(500).json({ error: "Invalid response from execution engine" });
    }

    const output = response.data.run.output?.trim() || "No output received";
    const isCorrect = expectedOutput ? output === expectedOutput.trim() : false;

    res.json({ output, correct: isCorrect });
  } catch (error) {
    console.error("Execution Error:", error);
    res.status(500).json({ error: "Error executing code." });
  }
});

// Export the router
module.exports = router;
