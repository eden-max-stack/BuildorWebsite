const mongoose = require('mongoose');
const { ML_DB } = require('../config/db'); // Import ML_DB connection

const problemsSchema = new mongoose.Schema({
    name: { type: String, required: true }, // problem name
    desc: { type: String, required: true }, // problem desc
    optimalCode: { type: String, required: true }, // optimal code
    categories: [{type: String, required: true}], // Categories query result belongs to
});

const Problems = ML_DB.model("problems", problemsSchema, "problems");
module.exports = Problems;