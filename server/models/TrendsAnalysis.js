const mongoose = require('mongoose');
const { ML_DB } = require('../config/db'); // Import ML_DB connection

const trendsSchema = new mongoose.Schema({
    query: { type: String, required: true }, // The search query
    topic: {
        id: { type: String, required: true },  // Google Trends topic ID
        title: { type: String, required: true }, // Topic name
        type: { type: String, required: true } // Topic category
    },
    categories: [{type: String, required: true}], // Categories query result belongs to
    popularity_score: { type: Number, required: true }, // Popularity score
    link: { type: String, required: true }, // Link to Google Trends
    fetched_at: { type: Date, default: Date.now } // Timestamp when fetched
});

const TrendAnalysis = ML_DB.model("trend_analysis", trendsSchema, "trend_analysis");

module.exports = TrendAnalysis;
