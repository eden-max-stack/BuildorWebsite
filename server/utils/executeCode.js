const axios = require("axios");
const { exec } = require("child_process");

const API = axios.create({
    baseURL: "https://emkc.org/api/v2/piston",
});

const LANGUAGE_VERSIONS = {
    javascript: "latest",
    python: "3.10.0",
    cpp: "10.2.0",
};

/**
 * Execute code using the Piston API (Recommended for most cases)
 */
const executeCode = async (language, sourceCode) => {
    try {
        const response = await API.post("/execute", {
            language: language,
            version: LANGUAGE_VERSIONS[language] || "latest",
            files: [{ content: sourceCode }],
        });
        return response.data;
    } catch (error) {
        return { error: "Error executing code via API." };
    }
};

/**
 * Execute code locally (Only for JavaScript & Python)
 */
const runCodeLocally = async (code, language, expectedOutput) => {
    return new Promise((resolve) => {
        let command;

        if (language === "javascript") {
            command = `node -e "${code.replace(/"/g, '\\"')}"`;
        } else if (language === "python") {
            command = `python -c "${code.replace(/"/g, '\\"')}"`;
        } else {
            return resolve({ correct: false, output: "Unsupported language" });
        }

        exec(command, (error, stdout, stderr) => {
            if (error || stderr) {
                return resolve({ correct: false, output: stderr || error.message });
            }
            const isCorrect = stdout.trim() === expectedOutput.trim();
            resolve({ correct: isCorrect, output: stdout.trim() });
        });
    });
};

module.exports = { executeCode, runCodeLocally, LANGUAGE_VERSIONS };
