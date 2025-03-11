const mongoose = require('mongoose');
const { ML_DB } = require('../config/db'); // Import ML_DB connection

const stackOverflowSchema = new mongoose.Schema({
    tag_name: { type: String, required: true }, // Tag name (e.g., "python")
    count: { type: Number, required: true }, // Number of times used
    has_synonyms: { type: Boolean, required: true }, 
    is_moderator_only: { type: Boolean, required: true }, 
    is_required: { type: Boolean, required: true }, 
    fetched_at: { type: Date, default: Date.now } // Timestamp when fetched
});

const StackOverflowAnalysis = ML_DB.model('stackoverflow_analysis', stackOverflowSchema, "stackoverflow_analysis");

module.exports = StackOverflowAnalysis;
