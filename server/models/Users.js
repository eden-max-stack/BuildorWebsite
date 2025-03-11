const mongoose = require('mongoose');
const { ML_DB } = require('../config/db'); // Import ML_DB connection

const usersSchema = new mongoose.Schema({
    uid: { type: String, required: true, unique: true }, // Firebase UID
    name: { type: String, required: true},
    nickName: { type: String, required: true},
    regNo: { type: String, required: true},
    careerGoal: { type: String, required: true},
    department: { type: String, required: true},
    profilePic: { type: String, required: true},
    techStack: { 
        type: Map, 
        of: Number, 
        default: {} // Ensures an empty object if not provided
    },
    githubRepos: [{ type: String, required: false }],
    createdAt: { type: Date, default: Date.now },
    email: { type: String, required: false},
    achievements: [{type: String, required: false}],
    workedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] // array of user references

})

const Users = ML_DB.model("users", usersSchema, "users");

module.exports = Users;