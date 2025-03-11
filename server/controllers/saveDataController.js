const GithubProfile = require("../models/ProfileAnalysis");
const UserData = require("../models/Users");

const saveGithubProfile = async (req, res) => {
    try {
        const data = req.body;

        if (!data || !data.userDetails) {
            return res.status(400).json({ error: "Invalid data format" });
        }

        const { userDetails, repoDetails, starredRepoDetails } = data;

        // Construct the GitHub profile object
        const githubProfileData = {
            github_id: userDetails.github_id,
            profile_url: userDetails.profile_url,
            bio: userDetails.bio,
            repo_details: repoDetails.map(repo => ({
                repo_name: repo.repo_name,
                repo_url: repo.repo_url,
                id: repo.id,
                languages: repo.languages,
            })),
            starred_repos: starredRepoDetails.map(starredRepo => ({
                repo_name: starredRepo.repo_name,
                id: starredRepo.id,
                repo_owner: starredRepo.repo_owner,
                repo_url: starredRepo.repo_url,
                languages: starredRepo.languages,
            })),
        };

        // Use findOneAndUpdate to update or insert the profile
        const updatedProfile = await GithubProfile.findOneAndUpdate(
            { username: userDetails.username },  // Find by username
            { $set: githubProfileData },         // Update with new data
            { upsert: true, new: true }          // Create if not exists, return updated doc
        );

        res.status(201).json({ message: "GitHub profile saved successfully", updatedProfile });

    } catch (error) {
        console.error("Error saving GitHub profile:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


module.exports = { saveGithubProfile };
