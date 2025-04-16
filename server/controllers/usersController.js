const Users = require("../models/Users");
const GithubProfile = require("../models/ProfileAnalysis");

// Mapping programming languages to their category
const TECH_STACK_CATEGORIES = {
    frontend: ["JavaScript", "TypeScript", "HTML", "CSS", "React", "Vue", "Angular", "Svelte"],
    backend: ["Node.js", "Express.js", "Django", "Flask", "Spring Boot", "Ruby on Rails", "Go", "PHP"],
    database: ["MongoDB", "MySQL", "PostgreSQL", "SQLite", "Redis", "Cassandra", "DynamoDB"]
};

const inviteUsers = async (req, res) => {
    try {
        const { invitedUserId } = req.body; // Extract invited user ID from request body

        console.log(invitedUserId);
        if (!invitedUserId) {
        return res.status(400).json({ error: "Invited user ID is required" });
        }

        console.log(req);
        const invitingUserId = req.user?.uid;

        // Find the inviting user
        const invitingUser = await Users.findById(invitingUserId);
        if (!invitingUser) {
        return res.status(404).json({ error: "Inviting user not found" });
        }

        // Find the invited user
        const invitedUser = await User.findById(invitedUserId);
        if (!invitedUser) {
        return res.status(404).json({ error: "Invited user not found" });
        }

        // Update "workedWith" field for both users (bidirectional relation)
        invitingUser.workedWith.push(invitedUser._id);
        invitedUser.workedWith.push(invitingUser._id);

        // Save updates
        await invitingUser.save();
        await invitedUser.save();

        res.status(200).json({ message: "User invited successfully!" });
    } catch (error) {
        console.error("Error inviting user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}   

const saveUserData = async (req, res) => {
    try {
        const { userData } = req.body;
        console.log(userData);

        if (!userData || !userData.username) {
            return res.status(400).json({ error: "Invalid data format" });
        }

        const { username, name, nickName, regNo, email, careerGoal, department, achievements, profilePic, workedWith } = userData;

        // Fetch the GitHub profile
        const githubProfile = await GithubProfile.findOne({ username });

        const techStackMap = new Map();
        // Debugging repo_details
        if (Array.isArray(githubProfile.repo_details)) {
        
            githubProfile.repo_details.forEach(repo => {
                if (repo.languages instanceof Map) {
                    for (const [lang, count] of repo.languages.entries()) { 
                        techStackMap.set(lang, (techStackMap.get(lang) || 0 + count));
                     }
                } else {
                    console.log("Languages is not a Map:", repo.languages);
                }
                
            });
        
            console.log(techStackMap);
        } else {
            console.log("Warning: repo_details is not an array or is undefined.");
        }

        // get githubRepos
        const repos = Array.isArray(githubProfile.repo_details) 
            ? githubProfile.repo_details.map(repo => {
                console.log(repo.repo_name); // Debugging
                return repo.repo_name;
            }) 
            : [];


        console.log(repos);

        // Validate workedWith field (Ensure all IDs are valid MongoDB ObjectIds)
        const validWorkedWith = Array.isArray(workedWith) ? workedWith.filter(id => id.match(/^[0-9a-fA-F]{24}$/)) : [];

        // Update user data
        const updatedUser = await Users.findOneAndUpdate(
            { uid: username }, // Using uid as the identifier
            {
                $set: {
                    name,
                    nickName,
                    regNo,
                    email,
                    careerGoal,
                    department,
                    achievements,
                    profilePic,
                    techStack: techStackMap,
                    githubRepos: repos,
                    workedWith: validWorkedWith
                }
            },
            { upsert: true, new: true } // Create if not exists
        );

        res.status(201).json({ message: "User data saved successfully", updatedUser });

    } catch (error) {
        console.error("Error saving user data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await Users.find({}, "uid name profilePic");
        console.log(users);
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error; 
    }
};

const getUserTechStack = async (req, res) => {
    try {
        const users = await Users.find({}, "uid techStack");
        console.log(users);
        res.json(users);
    } catch (error) {
        console.error("Error fetching users: ", error);
        throw error;
    }
};

const getCareerGoal = async (req, res) => {
    try {
        console.log("Received query params:", req.query); // Debugging

        const { uid } = req.query;

        if (!uid) {
            return res.status(400).json({ error: "Missing UID in request" });
        }

        // Convert to string in case of type mismatch
        const user = await Users.findOne({ uid: String(uid) }, "careerGoal");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        console.log("Found user:", user);

        return res.json({
            uid: user.uid,
            careerGoal: user.careerGoal,
        });

    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getData = async (req, res) => {
    try {
        const { username } = req.query; // Fix username extraction
        if (!username) {
            return res.status(400).json({ error: "Username is required" });
        }

        console.log("Fetching data for:", username);
        const userProfile = await Users.findOne({ uid: username });

        if (!userProfile) {
            return res.status(404).json({ error: "User not found" });
        }

        const userData = {
            name: userProfile.name,
            regNo: userProfile.regNo,
            profilePic: userProfile.profilePic,
            careerGoal: userProfile.careerGoal,
            techStack: userProfile.techStack,
        };

        console.log("User Data:", userData);
        return res.status(200).json(userData); // Send response to frontend

    } catch (error) {
        console.error("Error fetching user data:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const getDashboardData = async(req, res) => {
    try {
        const { username } = req.query;
        if (!username) {
            return res.status(400).json({ error: "Username is required" });
        }

        console.log("Fetching data for:", username);
        const userProfile = await Users.findOne({ uid: username });

        if (!userProfile) {
            return res.status(404).json({ error: "User not found" });
        }

        const userData = {
            nickName: userProfile.nickName,
            achievements: userProfile.achievements,
            githubRepos: userProfile.githubRepos,
            workedWith: userProfile.workedWith
        };

        console.log(userData);
        return res.status(200).json(userData);
    } catch (error) {
        console.error("Error fetching user data:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}


module.exports = { inviteUsers, saveUserData, getData, getDashboardData, getAllUsers, getUserTechStack, getCareerGoal   };