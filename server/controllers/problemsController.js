const Problems = require("../models/Problems");
const mongoose = require("mongoose");

const getProblems = async (req, res) => {
    try {
        const problems = await Problems.find({}, "name desc"); // ✅ Fetch name & desc
        console.log("Fetched Problems:", problems);
        
        res.status(200).json(problems); // ✅ Send response to frontend

    } catch (error) {
        console.error("Error fetching problems:", error);
        res.status(500).json({ error: "Internal Server Error" }); // ✅ Send error response
    }
};

const getProblem = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Received request for problem ID:", id);

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            console.error("Invalid ID:", id);
            return res.status(400).json({ error: "Invalid problem ID" });
        }

        const problem = await Problems.findById(id);
        if (!problem) {
            console.error("Problem not found for ID:", id);
            return res.status(404).json({ error: "Problem not found" });
        }

        console.log("Fetched problem:", problem);
        return res.status(200).json({problem});
    } catch (error) {
        console.error("Unexpected error in getProblem:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

module.exports = { getProblem };



const postQuestion = async (req, res) => {
    try {
        const data = req.body; // Use req.body instead of res.body
        console.log(data);

        // Validate request body
        if (!data || !data.name || !data.desc) {
            return res.status(400).json({ error: "Invalid data format. 'name' and 'desc' are required." });
        }

        const { name, desc, optcode, categories } = data;

        // Create new problem instance
        const newProblem = new Problems({
            name,
            desc,
            optimalCode: optcode || "", // Optional: Default to empty string if not provided
            categories: categories || [], // Optional: Default to an empty array
        });

        // Save the problem to the database
        await newProblem.save();

        // Respond with success message
        return res.status(201).json({ message: "Problem added successfully", problem: newProblem });

    } catch (error) {
        console.error("Error adding problem:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


module.exports = { getProblems, postQuestion, getProblem };