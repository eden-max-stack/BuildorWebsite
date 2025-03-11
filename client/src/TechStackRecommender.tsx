import * as React from "react";
import { useState, useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import AppTheme from "./theme/AppTheme";
import DashboardNavBar from "./components/DashboardNavBar";
import LeftPanel from "./components/LeftPanel";
import { Box, Card, Typography, Button, Grid } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";
import TechStackPanel from "./components/TechStackPanel";
import axios from "axios";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF"];

export default function TechStackRecommender(props: { disableCustomTheme?: boolean }) {
    // Mock data (Replace with API data later)
    const [techStack, setTechStack] = useState<{ uid: string; techStack: string[] }[]>([]);
    const [recommendedTech, setRecommendedTech] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [careerGoal, setCareerGoal] = useState("");
    const [username, setUsername] = useState("");

    const token = localStorage.getItem("github_token");

    useEffect(() => {
        const fetchCareerGoalAndUsername = async () => {
            try {
                const response = await axios.get("https://api.github.com/user", {
                    headers: { Authorization: `Bearer ${token}` },
                });
    
                const username = response.data.login;
                setUsername(username);
                console.log("GitHub username is:", username);
    
                const userResponse = await axios.get("http://localhost:8087/api/users/get-career-goal", {
                    params: { uid: username }
                });
    
                console.log(userResponse);
    
                const careerGoal = Array.isArray(userResponse.data) ? userResponse.data[0]?.careerGoal : userResponse.data.careerGoal;
                setCareerGoal(careerGoal);

            } catch (error) {
                console.error("Error fetching career goal and username:", error);
            }
        };
    
        fetchCareerGoalAndUsername();
    }, []); // Run once on mount

    useEffect(() => {
        console.log("careerGoal:", careerGoal); // Debugging
        console.log("username:", username); // Debugging
    
        const fetchRecommendations = async () => {
            if (!careerGoal || !username) {
                console.warn("Skipping API call, careerGoal or username is missing.");
                return; // Don't call the API if either is missing
            }
    
            try {
                const response = await axios.get(`http://localhost:8087/api/recommendations/${encodeURIComponent(careerGoal)}/${encodeURIComponent(username)}`);
                setRecommendedTech(response.data.recommended_technologies || []);
                console.log("Recommended technologies:", response.data.recommended_technologies);
            } catch (error) {
                console.error("Error fetching recommendations:", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchRecommendations();
    }, [careerGoal, username]);
    
    
    const userTechStack = [
        { name: "React", value: 40 },
        { name: "Node.js", value: 30 },
        { name: "MongoDB", value: 15 },
        { name: "TypeScript", value: 10 },
        { name: "Docker", value: 5 },
    ];

    const getUserTechStack = async () => {
        try {
            const response = await axios.get("http://localhost:8087/api/users/get-user-techstack");
            console.log("Raw API Response:", response.data);
    
            if (Array.isArray(response.data) && response.data.length > 0) {
                const userTechData = response.data[0]; // Extract first element
    
                if (userTechData.techStack && typeof userTechData.techStack === "object") {
                    const formattedTechStack = Object.entries(userTechData.techStack).map(([name, value]) => ({
                        name,
                        value
                    }));
    
                    setTechStack(formattedTechStack);
                } else {
                    console.error("Tech stack is missing or invalid.");
                    setTechStack([]);
                }
            } else {
                console.error("Unexpected API response format.");
                setTechStack([]);
            }
        } catch (error) {
            console.error("Error fetching user tech stack:", error);
        }
    };
    

    useEffect(() => {
        getUserTechStack();
    }, []);
    
    const techTrends = [
        { name: "Rust", popularity: 80 },
        { name: "Go", popularity: 70 },
        { name: "Next.js", popularity: 60 },
        { name: "TypeScript", popularity: 50 },
        { name: "GraphQL", popularity: 40 },
    ];

    const learningResources = [
        { name: "Fullstack Open (React & Node)", url: "https://fullstackopen.com/en/" },
        { name: "Rust by Example", url: "https://doc.rust-lang.org/stable/rust-by-example/" },
        { name: "Go Tour", url: "https://tour.golang.org/" },
    ];

    const user = {
        name: "akshada kashyap",
        regNo: 'RA2211003011777',
        careerGoal: "Full stack dev",
        profilePic: "helloworld"
    }

    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <DashboardNavBar />
            
            {/* Layout Container */}
            <Box sx={{ display: "flex", mt: 8, pt: 2, backgroundColor: 'transparent' }}>
                {/* Left Section (Stacked Left Panel & Tech Stack Panel) */}
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <LeftPanel />
                </Box>

                {/* Main Content */}
                <Box sx={{ flexGrow: 1, ml: "340px", pr: 2, maxWidth: "1000px", textAlign: "left" }}>
                    {/* Your Tech Stack */}
                    <Card sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h2" fontWeight={600} mb={2}>Your Tech Stack</Typography>
                        <ResponsiveContainer width="100%" height={250}>
                            {techStack.length > 0 ? (
                                <PieChart>
                                    <Pie data={techStack} dataKey="value" outerRadius={80} label>
                                        {techStack.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            ) : (
                                <Typography>No Tech Stack Data Available</Typography>
                            )}
                        </ResponsiveContainer>

                    </Card>

                    {/* Tech Stack Recommendations */}
                    <Card sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h2" fontWeight={600} mb={2}>🔥 Recommended Technologies</Typography>
                        <Grid container spacing={2}>
                            {recommendedTech.map((tech, index) => (
                                <Grid item xs={6} md={3} key={index}>
                                    <Card sx={{ p: 2, textAlign: "center", bgcolor: "#f5f5f5" }}>
                                        <Typography fontWeight={600}>{tech}</Typography>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Card>

                    {/* Tech Trends Chart */}
                    <Card sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h2" fontWeight={600} mb={2}>📊 Tech Trends</Typography>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={techTrends}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="popularity" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* Learning Resources */}
                    <Card sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h2" fontWeight={600} mb={2}>🎓 Learning Resources</Typography>
                        {learningResources.map((resource, index) => (
                            <Typography key={index}>
                                <a href={resource.url} target="_blank" rel="noopener noreferrer" style={{ color: "#007bff", textDecoration: "none" }}>
                                    {resource.name}
                                </a>
                            </Typography>
                        ))}
                    </Card>
                </Box>
            </Box>

        </AppTheme>
    );
}
