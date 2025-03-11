const mongoose = require("mongoose");
const { ML_DB } = require("../config/db"); // Import ML_DB connection

const GithubProfileSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    github_id: { type: String, required: true, unique: true },
    profile_url: String,
    bio: String,

    repo_details: [
        {
            repo_name: String,
            repo_url: String,
            id: Number, 
            languages: { type: Map, of: Number },
        }
    ],

    starred_repos: [
        {
            repo_name: String,
            id: Number,
            repo_owner: String,
            repo_url: String,
            languages: { type: Map, of: Number }
        }
    ],

    createdAt: { type: Date, default: Date.now },
});

// Ensure `github_id` is indexed for fast lookup
GithubProfileSchema.index({ github_id: 1 }, { unique: true });

const GithubProfile = ML_DB.model("github_profile", GithubProfileSchema, "github_profile");

module.exports = GithubProfile;
