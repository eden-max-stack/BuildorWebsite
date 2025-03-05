const axios = require("axios");

const getUserRepos = async (req, res) => {
    try {
        const { authorization } = req.headers;
        // console.log("Received Authorization Header:", authorization); // Debugging

        if (!authorization) {
            return res.status(401).json({ error: "Unauthorized - No token provided" });
        }

        const githubResponse = await axios.get("https://api.github.com/user/repos", {
            headers: {
                Authorization: authorization, // Ensure correct format
                Accept: "application/vnd.github.v3+json",
            },
        });

        res.json(githubResponse.data);
    } catch (error) {
        console.error("Error fetching GitHub repositories:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch repositories" });
    }
};

const getRepoLanguages = async (req, res) => {
    try {
        const { authorization } = req.headers;
        console.log("Received Authorization Header:", authorization); // Debugging

        if (!authorization) {
            return res.status(401).json({ error: "Unauthorized - No token provided" });
        }

        const owner = "eden-max-stack";
        const repo = "Migrainez";

        const githubResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/languages`, {
            headers: {
                Authorization: authorization, // Ensure correct format
                Accept: "application/vnd.github.v3+json",
            },
        });

        res.json(githubResponse.data);
    } catch (error) {
        console.error("Error fetching GitHub repositories:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch repositories" });
    }
};

const getCommitHistory = async (req, res) => {
    try {
        const { authorization } = req.headers;
        console.log("Received Authorization Header:", authorization); // Debugging

        if (!authorization) {
            return res.status(401).json({ error: "Unauthorized - No token provided" });
        }

        const owner = "eden-max-stack";
        const repo = "Migrainez";

        const githubResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits`, {
            headers: {
                Authorization: authorization, // Ensure correct format
                Accept: "application/vnd.github.v3+json",
            },
        });

        res.json(githubResponse.data);
    } catch (error) {
        console.error("Error fetching GitHub repositories:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch repositories" });
    }
};

const getStarredRepos = async (req, res) => {
    try {
        const { authorization } = req.headers; 
        console.log("Received Authorization Header:", authorization);

        if (!authorization) {
            return res.status(401).json({ error: "Unauthorized - No token provided" });
        }

        const user = "eden-max-stack";

        const githubResponse = await axios.get(`https://api.github.com/user/starred`, {
            headers: {
                Authorization: authorization, // Ensure correct format
                Accept: "application/vnd.github.v3+json",
            },
        });

        res.json(githubResponse.data);
    } catch (error) {
        console.error("Error fetching GitHub repositories:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch repositories" });
    }
};

module.exports = { getUserRepos,
                   getStarredRepos,
                   getCommitHistory,
                   getRepoLanguages
                };
