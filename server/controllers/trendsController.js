const TrendAnalysis = require("../models/TrendsAnalysis");

const getTrendsData = async (req, res) => {
    try {
        const techCategories = {
            fullstackdevelopment: ["javascript", "react", "typescript", "express.js", "node.js", "mongoDB"],
            ai_ml_engineer: ["python", "tensorflow", "pytorch", "scikit-learn", "machine learning"],
            app_developer: ["swift", "kotlin", "flutter", "react native"],
        };

        let formattedData = {};

        for (const [category, techList] of Object.entries(techCategories)) {
            formattedData[category] = {};

            for (const tech of techList) {
                const trendData = await TrendAnalysis.findOne({ query: tech }).sort({ fetched_at: -1 });

                if (trendData) {
                    formattedData[category][tech] = trendData.popularity_score;
                } else {
                    formattedData[category][tech] = 0; // Default if no data is found
                }
            }
        }

        return res.status(200).json(formattedData);
    } catch (error) {
        console.error("Error fetching trend data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { getTrendsData };
