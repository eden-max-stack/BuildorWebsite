import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";  
import axios from 'axios';
import fs from 'fs';  // Node.js file system module

const Dashboard: React.FC = () => {
    const navigate = useNavigate();

    const token = localStorage.getItem("github_token");

    if (!token) {
        console.error("GitHub token not found");
        return;
    }

    const handleSignOut = async () => {
        try {
            await signOut(auth);

            localStorage.removeItem("github_token");
            // localStorage.removeItem("user");
            console.log("User signed out successfully!");
            navigate('/login');
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    };

    // Function to fetch user repositories
    const fetchRepos = async () => {
        try {
            const response = await axios.get("http://localhost:8087/api/github/repos", {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data; 
        } catch (error) {
            console.error("Error fetching repos:", error.response?.data || error.message);
            return [];
        }
    };

    // Function to fetch commit history and languages for all repositories
    const fetchRepoLanguagesAndCommits = async (repos) => {
        const repoDetails = [];

        for (const repo of repos) {
            const owner = repo.owner.login;
            const repoName = repo.name;

            try {
                const [commitsResponse, languagesResponse] = await Promise.all([
                    axios.get(`http://localhost:8087/api/github/repos/${owner}/${repoName}/commits`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(`http://localhost:8087/api/github/repos/${owner}/${repoName}/languages`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                repoDetails.push({
                    repoName,
                    owner,
                    commits: commitsResponse.data,
                    languages: languagesResponse.data,
                });

            } catch (error) {
                console.error(`Error fetching details for repo ${repoName}:`, error.response?.data || error.message);
                repoDetails.push({
                    repoName,
                    owner,
                    commits: "Error fetching commits",
                    languages: "Error fetching languages",
                });
            }
        }

        return repoDetails;
    };

    // Function to fetch starred repositories
    const fetchStarredRepos = async () => {
        try {
            const response = await axios.get(`http://localhost:8087/api/github/user/starred`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching starred repos:", error.response?.data || error.message);
            return [];
        }
    };

    const writeDataToFile = async (data) => {
        try {
            const response = await axios.post("http://localhost:8087/api/save-data", data, {
                headers: { "Content-Type": "application/json" },
            });
            console.log("Data saved:", response.data);
        } catch (error) {
            console.error("Error saving data:", error.response?.data || error.message);
        }
    };
    

    // useEffect to trigger all functions on page load
    useEffect(() => {
        const fetchDataAndWriteToFile = async () => {
            const repos = await fetchRepos();
            const repoDetails = await fetchRepoLanguagesAndCommits(repos);
            const starredRepos = await fetchStarredRepos();

            const combinedData = {
                repositories: repos,
                repoDetails: repoDetails,
                starredRepos: starredRepos,
            };

            await writeDataToFile(combinedData);
        };

        fetchDataAndWriteToFile();
    }, []);

    return (
        <div>
            <h2>Dashboard</h2>
            <button onClick={handleSignOut}>Sign Out</button>
        </div>
    );
};

export default Dashboard;
