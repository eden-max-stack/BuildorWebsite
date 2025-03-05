import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";  // Import initialized Firebase
import axios from 'axios';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();

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

    const fetchRepos = async () => {
        const token = localStorage.getItem("github_token"); // Retrieve token
        // console.log("GitHub Token from LocalStorage:", token); // Debugging

        if (!token) {
            console.error("GitHub token not found");
            return;
        }

        try {
            const response = await axios.get("http://localhost:8087/api/github/repos", {
                headers: {
                    Authorization: `Bearer ${token}`, // Use Bearer format
                },
            });

            console.log("User Repositories:", response.data);
        } catch (error) {
            console.error("Error fetching repos:", error.response?.data || error.message);
        }
    };
    const fetchCommitHistory = async () => {
        const token = localStorage.getItem("github_token"); // Retrieve token
        // console.log("GitHub Token from LocalStorage:", token); // Debugging

        if (!token) {
            console.error("GitHub token not found");
            return;
        }

        const owner = "eden-max-stack";
        const repo = "Migrainez";

        try {
            const response = await axios.get(`http://localhost:8087/api/github/repos/${owner}/${repo}/commits`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Use Bearer format
                },
            });

            console.log("User Repositories:", response.data);
        } catch (error) {
            console.error("Error fetching repos:", error.response?.data || error.message);
        }
    };
    const fetchRepoLanguages = async () => {
        const token = localStorage.getItem("github_token"); // Retrieve token
        // console.log("GitHub Token from LocalStorage:", token); // Debugging

        if (!token) {
            console.error("GitHub token not found");
            return;
        }

        const owner = "eden-max-stack";
        const repo = "Migrainez";

        try {
            const response = await axios.get(`http://localhost:8087/api/github/repos/${owner}/${repo}/languages`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Use Bearer format
                },
            });

            console.log("User Repositories:", response.data);
        } catch (error) {
            console.error("Error fetching repos:", error.response?.data || error.message);
        }
    };
    const fetchStarredRepos = async () => {
        const token = localStorage.getItem("github_token"); // Retrieve token
        // console.log("GitHub Token from LocalStorage:", token); // Debugging

        if (!token) {
            console.error("GitHub token not found");
            return;
        }
        try {
            const response = await axios.get(`http://localhost:8087/api/github/user/starred`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Use Bearer format
                },
            });

            console.log("User Repositories:", response.data);
        } catch (error) {
            console.error("Error fetching repos:", error.response?.data || error.message);
        }
    };


    return (
        <div>
            <h2>Dashboard</h2>
            <button onClick={handleSignOut}>Sign Out</button>
            <button onClick={fetchRepos}>Fetch Repositories</button>
            <button onClick={fetchRepoLanguages}>Fetch Languages</button>
            <button onClick={fetchCommitHistory}>Fetch Commit History</button>
            <button onClick={fetchStarredRepos}>Fetch Starred Repositories</button>
        </div>
    )
}
export default Dashboard