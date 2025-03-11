const axios = require("axios");
const { getJson } = require("serpapi");
const Trends = require("../models/TrendsAnalysis");
const SOFTags = require("../models/StackoverflowAnalysis");

// trending queries
const trending_queries = {
    "full_stack_development": [
        "JavaScript", "TypeScript", "React", "Vue.js", "Angular", "Svelte",
        "Node.js", "Express.js", "FastAPI", "Django", "Flask", "MongoDB",
        "MySQL", "PostgreSQL", "GraphQL", "TailwindCSS", "MaterialUI", "Next.js", "Vite"
    ],
    "ai_ml_engineer": [
        "Python", "TensorFlow", "PyTorch", "Scikit-Learn", "Machine Learning",
        "Deep Learning", "Data Science", "AI Coding Tools", "Computer Vision",
        "NLP", "Hugging Face", "Keras", "Google Colab"
    ],
    "app_developer": [
        "Swift", "Kotlin", "Flutter", "React Native", "Android Development",
        "iOS Development", "Jetpack Compose", "SwiftUI", "Xamarin"
    ],
    "backend_developer": [
        "Go", "Rust", "Java", "Spring Boot", "Kubernetes", "Docker",
        "Microservices", "RabbitMQ", "Kafka", "Redis", "PostgreSQL", "SQL", "NoSQL"
    ],
    "cybersecurity": [
        "Penetration Testing", "Ethical Hacking", "Cybersecurity",
        "Network Security", "Metasploit", "Burp Suite", "SOC Analyst"
    ],
    "misc": [
        "Cloud Computing", "Blockchain Development", "Web3", "DevOps",
        "Software Engineering", "Big Data", "Quantum Computing"
    ]
};

// 📌 Fetch Stack Overflow Trending Tags
async function fetchStackOverflowTrending() {
    try {
        const maxPages = 5; // Increase to fetch more data
        const pageSize = 50; // Fetch more tags per request
        const sortOptions = ["popular", "activity", "name"]; // Different sorting methods

        for (const sort of sortOptions) {
            for (let page = 1; page <= maxPages; page++) {
                const response = await axios.get(
                    `https://api.stackexchange.com/2.3/tags?order=desc&sort=${sort}&site=stackoverflow&page=${page}&pagesize=${pageSize}`
                );

                const tags = response.data.items;
                if (!tags || !Array.isArray(tags) || tags.length === 0) {
                    console.warn(`⚠ No Stack Overflow tags found for sort: ${sort}, page: ${page}`);
                    break;
                }

                for (const tag of tags) {
                    await SOFTags.updateOne(
                        { tag_name: tag.name }, // Find existing tag
                        {
                            $set: {
                                count: tag.count,
                                has_synonyms: tag.has_synonyms,
                                is_moderator_only: tag.is_moderator_only,
                                is_required: tag.is_required,
                                fetched_at: new Date(),
                            },
                        },
                        { upsert: true } // Insert if not found
                    );
                }
                console.log(`✅ Page ${page} of "${sort}" tags updated.`);
            }
        }

        console.log("🚀 Stack Overflow Tags fully updated in MongoDB!");
    } catch (error) {
        console.error("❌ Error fetching Stack Overflow data:", error);
    }
}

// 📌 Fetch Google Trends Data
// Fetch Google Trends for a single query
const fetchGoogleTrendsForQuery = async (query, category) => {
    return new Promise((resolve, reject) => {
        getJson(
            {
                engine: "google_trends",
                q: query,
                data_type: "RELATED_TOPICS",
                api_key: "5fed5a71004070f52c20935d7b2527402917a775bf4797bed8c5ed5cec364754", // Use environment variable
            },
            async (json) => {
                if (!json || json.error) {
                    console.error(`❌ Google Trends API Error for '${query}': ${json?.error || "Unknown error"}`);
                    return reject(json?.error || "API error");
                }

                const topicsArray = json.related_topics?.top || json.topics || json.data || [];

                if (!Array.isArray(topicsArray) || topicsArray.length === 0) {
                    console.warn(`⚠️ No Google Trends data found for '${query}'`);
                    return resolve([]); // Resolve with an empty array
                }

                console.log(`✅ Found ${topicsArray.length} topics for '${query}'`);

                // Store results in MongoDB
                const bulkOps = topicsArray.map((topicObj) => {
                    if (!topicObj.topic || typeof topicObj.topic !== "object") {
                        console.warn("⚠️ Skipping invalid topic:", topicObj);
                        return null;
                    }

                    return {
                        updateOne: {
                            filter: { "topic.id": topicObj.topic.value, query: query },
                            update: {
                                $set: {
                                    query: query,
                                    topic: {
                                        id: topicObj.topic.value || "unknown",
                                        title: topicObj.topic.title || "unknown",
                                        type: topicObj.topic.type || "unknown",
                                    },
                                    popularity_score: parseInt(topicObj.extracted_value) || 0,
                                    link: topicObj.link || "",
                                    fetched_at: new Date(),
                                },
                                $addToSet: { categories: category }
                            },
                            upsert: true,
                        },
                    };
                }).filter(Boolean); // Remove null values

                if (bulkOps.length > 0) {
                    await Trends.bulkWrite(bulkOps);
                    console.log(`✅ Google Trends data for '${query}' saved to MongoDB!`);
                }

                resolve(topicsArray);
            }
        );
    });
};

// Fetch Google Trends for all queries
const fetchGoogleTrends = async () => {
    console.log("🚀 Fetching Google Trends data...");
    
    for (const [category, queries] of Object.entries(trending_queries)) {
        console.log(`📌 Processing category: ${category}`);

        try {
            await Promise.all(queries.map((query) => fetchGoogleTrendsForQuery(query, category)));
            console.log(`✅ Completed fetching trends for category: ${category}`);
        } catch (error) {
            console.error(`❌ Error processing category '${category}':`, error);
        }
    }

    console.log("✅ All trending data fetched and stored in MongoDB!");
};


// 📌 Fetch All Trends
async function fetchAllTrends() {
    // console.log("🚀 Fetching Stack Overflow trends...");
    // await fetchStackOverflowTrending();
    
    console.log("🚀 Fetching Google Trends for all queries...");
    await fetchGoogleTrends();

    console.log("✅ All trending data fetched and stored in MongoDB!");
}

fetchAllTrends();

module.exports = { fetchGoogleTrends, fetchStackOverflowTrending };
