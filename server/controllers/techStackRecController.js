const axios = require("axios");
const TrendAnalysis = require("../models/TrendsAnalysis");
const Users = require("../models/Users");

const careerKeywords = {
    fullstackdevelopment: ["JavaScript", "TypeScript", "React", "Vue", "Angular", "Node", "Express", "MongoDB", "PostgreSQL"],
    aimlengineer: ["Python", "TensorFlow", "PyTorch", "Scikit", "AI", "Machine Learning", "Deep Learning", "Data Science"],
    appdeveloper: ["Swift", "Kotlin", "Flutter", "React Native", "iOS", "Android", "Xamarin"],
};

// Fetch Trending Tech
const getTrendingTech = async () => {
    return await TrendAnalysis.find().lean();
};

const getUserTechStack = async (username) => {
    const user = await Users.findOne({ username }).lean();
    if (!user) return new Set();

    const userTechStack = new Set();
    user.repo_details?.forEach((repo) => {
        if (repo.languages) {
            Object.keys(repo.languages).forEach((lang) => userTechStack.add(lang));
        }
    });

    return userTechStack;
};

const classifyTechByCareer = (trendingTech, userTechStack) => {
    let careerTrends = {};
    Object.keys(careerKeywords).forEach((goal) => (careerTrends[goal] = []));

    trendingTech.forEach(({ query: techName, popularity_score }) => {
        Object.entries(careerKeywords).forEach(([careerGoal, keywords]) => {
            if (keywords.some((keyword) => techName.toLowerCase().includes(keyword.toLowerCase())) && !userTechStack.has(techName)) {
                careerTrends[careerGoal].push({ techName, popularity_score });
            }
        });
    });

    // Sort by popularity and return top 5
    Object.keys(careerTrends).forEach((goal) => {
        careerTrends[goal] = careerTrends[goal]
            .sort((a, b) => b.popularity_score - a.popularity_score)
            .slice(0, 5)
            .map((item) => item.techName);
    });

    return careerTrends;
};

const techStackRecModel = async (req, res) => {
    try {
        const { careerGoal, username } = req.params;
        if (!careerGoal || !username) {
            return res.status(400).json({ error: "Career goal or username is missing" });
        }

        console.log("Career Goal:", careerGoal);
        console.log("Username:", username);

        const trendingTech = await getTrendingTech();
        const userTechStack = await getUserTechStack(username);
        const careerTrends = classifyTechByCareer(trendingTech, userTechStack);

        res.json({ recommended_technologies: careerTrends[careerGoal] || [] });
    } catch (error) {
        console.error("Error in /recommend API:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


module.exports = { techStackRecModel };