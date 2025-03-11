import React, { useEffect, useState } from "react";
import { isRouteErrorResponse, useNavigate } from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";  
import DashboardNavBar from "./components/DashboardNavBar";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Container, Box, Card, CardContent, Typography, Avatar, Button, IconButton, List, ListItem, ListItemIcon, ListItemText, Link } from "@mui/material";
import axios from 'axios';
import AppTheme from "./theme/AppTheme";
import LeftPanel from "./components/LeftPanel";
import TrendingTechStackChart from "./components/TrendingTechStacksChart";
import { GitHubIcon } from "./components/CustomIcons";
import StarIcon from "@mui/icons-material/Star"; // Achievement icon

const Dashboard: React.FC = (props: { disableCustomTheme?: boolean }) => {
    const navigate = useNavigate();

    const token = localStorage.getItem("github_token");

    if (!token) {
        console.error("GitHub token not found");
        return;
    }
    const repos = [
    { name: "Buildor", url: "https://github.com/akshada/buildor" },
    { name: "AI-Helper", url: "https://github.com/akshada/ai-helper" },
    ];

    const workedWith = [
    { name: "John Doe", url: "#" },
    { name: "Prof. Smith", url: "#" },
    ];

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    const [showTrending, setShowTrending] = useState(false);
    const [user, setUserData] = useState({
        nickName: "",
        achievements: [],
        githubRepos: [],
        workedWith: []
    });

    const fetchDashboardData = async() => {
        try {
            // fetch data from mongodb collection Users

            const response = await axios.get("https://api.github.com/user", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const username = response.data.login;
            console.log(username);

            const userResponse = await axios.get("http://localhost:8087/api/users/get-user-dashboard", {
                params : { username: username, }
            });

            const { nickName, achievements, githubRepos, workedWith } = userResponse.data;

            setUserData({
                nickName,
                achievements,
                githubRepos,
                workedWith
            });


        } catch (error) {
            console.error(error);
        }
    }

    const fetchGithubData = async () => {
        try {

            // Fetch user details
            const userProfile = await axios.get("http://localhost:8087/api/github/user", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const userData = userProfile.data;

            const userDetails = {
                username: userData.login,
                github_id: userData.id,
                profile_url: userData.html_url, 
                bio: userData.bio,
            };

            // Fetch user repositories & languages for each repo
            const reposResponse = await axios.get("http://localhost:8087/api/github/repos", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const repos = reposResponse.data;
            const repoDetails = [];
            
            for (const repo of repos) {
                const repoName = repo.name;
                const repoId = repo.id;
                const repoURL = repo.html_url;
    
                try {
                    // Fetch commits & languages in parallel
                    const owner = repo.owner.login;
                    const languagesResponse = await axios.get(`http://localhost:8087/api/github/repos/${owner}/${repoName}/languages`, {
                            headers: { Authorization: `Bearer ${token}` },
                        });
    
                    // console.log(languagesResponse);

                    const repoData = {
                        repo_name: repoName,
                        repo_url: repoURL,
                        id: repoId,
                        languages: languagesResponse.data,
                    };

                    repoDetails.push(repoData);
                    // console.log(repoDetails);
    
                } catch (error) {
                    console.error(`Error fetching details for repo ${repoName}:`, error.message);
                }
            }

            // fetching starred repos and their languages
            const starredResponse = await axios.get("http://localhost:8087/api/github/user/starred", {
                headers: { Authorization: `Bearer ${token}`},
            });

            const starredRepoDetails = [];
            const starredData = starredResponse.data;
            
            for (const starredRepo of starredData) {
                const repoName = starredRepo.name;
                const repoId = starredRepo.id;
                const repoURL = starredRepo.html_url;
                const repoOwner = starredRepo.owner.login;

                try {
                    // fetching languages of each starred repo
                    const languagesResponse = await axios.get(starredRepo.languages_url);

                    // console.log(languagesResponse);

                    const starredRepository = {
                        repo_name: repoName,
                        repo_owner: repoOwner,
                        repo_url: repoURL,
                        id: repoId,
                        languages: languagesResponse.data,
                    };

                    starredRepoDetails.push(starredRepository);
                
                } catch (error) {
                    console.error(`Error fetching details for repo ${repoName}:`, error.message);
                }
            }
    
            return { userDetails, repoDetails, starredRepoDetails};
        } catch (error) {
            console.error("Error fetching GitHub data:", error.message);
            return { repoDetails: [], starredRepos: [] };
        }
    };
    
    // useEffect(() => {
    //     const fetchDataAndSave = async () => {
    //         const { userDetails, repoDetails, starredRepoDetails } = await fetchGithubData();

    //         await writeDataToDB({ userDetails, repoDetails, starredRepoDetails });
    //     };

    //     fetchDataAndSave();
    // }, []);

    // Fetch data on component mount
    useEffect(() => {
        fetchDashboardData();
    }, []);

    const writeDataToDB = async (data) => {
        try {
            const response = await axios.post("http://localhost:8087/api/save-data", data, {
                headers: { "Content-Type": "application/json" },
            });
            console.log("Data saved:", response.data);
        } catch (error) {
            console.error("Error saving data:", error.response?.data || error.message);
        }
    };


    return (
      <AppTheme {...props}>
        <CssBaseline enableColorScheme />
        <DashboardNavBar />  

        {/* Outer container (FLEX to handle layout) */}
        <Box sx={{ display: "flex", height: "auto", overflow: "hidden", mt: 8, pt: 2, backgroundColor: 'transparent', backgroundImage: 'none', gap: 10 }}>  
          
            {/* Left Section (Stacked Left Panel & Tech Stack Panel) */}
            <LeftPanel />

            {/* Right Content (Scrollable, starts below navbar) */}

            <Box 
                sx={{ 
                    flexGrow: 1,  
                    ml: "340px", // Ensures space for the fixed left panel
                    pr: 2,
                    pl: 3,
                    textAlign: "left",
                    backgroundColor: "transparent",
                    backgroundImage: "none"
                }}
                >

                <Box sx = {{ textAlign: "right"}}>
                  <Typography variant="h1" fontWeight={1000} fontSize={75}>welcome back,</Typography>
                  <Typography variant="h1" fontWeight={1000} fontSize={100} color="primary.dark" sx={(theme) => ({
                color: 'primary.main',
                ...theme.applyStyles('dark', {
                  color: 'primary.light',
                }),
              })}>{user.nickName}.</Typography>
                </Box>

                <TrendingTechStackChart />

                {/* Achievements Section */}
                <Card sx={{ p: 3, mb: 3 }}>
                <Typography variant="h2" fontWeight={600} mb={2}>
                    🥇 Achievements
                </Typography>
                {user.achievements && user.achievements.length > 0 ? (
                    <List>
                    {user.achievements.map((ach, index) => (
                        <ListItem key={index}>
                        <ListItemIcon>
                            <StarIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={ach} />
                        </ListItem>
                    ))}
                    </List>
                ) : (
                    <Typography color="text.secondary">No achievements found.</Typography>
                )}
                </Card>


                {/* GitHub Repositories */}
                <Card sx={{ p: 3, mb: 3 }}>
                <Typography variant="h2" fontWeight={600} mb={2}>
                    💻 GitHub Repositories
                </Typography>
                {user.githubRepos && user.githubRepos.length > 0 ? (
                    <List>
                    {user.githubRepos.map((repo, index) => (
                        <ListItem key={index}>
                        <ListItemIcon>
                            <GitHubIcon color="secondary" />
                        </ListItemIcon>
                        <ListItemText
                            primary={
                            <Link target="_blank" rel="noopener noreferrer" color="primary">
                                {repo}
                            </Link>
                            }
                        />
                        </ListItem>
                    ))}
                    </List>
                ) : (
                    <Typography color="text.secondary">No GitHub repositories found.</Typography>
                )}
                </Card>

                <Card sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h2" fontWeight={600} mb={2}>👥 Worked With</Typography>
                    {workedWith.map((person, index) => (
                        <Typography key={index}>
                            <a href={person.url} target="_blank" rel="noopener noreferrer" style={{ color: "#007bff", textDecoration: "none" }}>
                                {person.name}
                            </a>
                        </Typography>
                    ))}
                </Card>   
            </Box>
        </Box>
    </AppTheme>

  );
};

export default Dashboard;
