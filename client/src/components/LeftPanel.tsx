import { Box, Card, Typography, Avatar, Divider } from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";

export default function LeftPanel() {
    const token = localStorage.getItem("github_token");

    const [user, setUserData] = useState({
        name: "",
        regNo: "",
        careerGoal: "",
        profilePic: "",
        techStack: [] as { name: string; value: number }[], 
    });

    const fetchUserCardData = async() => {
        try {
            // fetch data from mongodb collection Users

            const response = await axios.get("https://api.github.com/user", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const username = response.data.login;
            console.log(username);

            const userResponse = await axios.get("http://localhost:8087/api/users/get-user-data", {
                params : { username: username, }
            });

            if (!userResponse.data) {
                console.error("User profile not found in database");
                return;
            }

            const { name, regNo, profilePic, careerGoal, techStack } = userResponse.data;


            setUserData({
                name,
                regNo,
                careerGoal,
                profilePic,
                techStack: techStack, 
            });
            
        } catch (error) {
            console.error(`Error fetching details for repo:`, error.message);
        }
    }

    // Fetch data on component mount
    useEffect(() => {
        fetchUserCardData();
    }, []);
    
    const profile = {
        name: "Akshada Kashyap",
        bio: "Passionate about AI & Software Development",
        age: 20,
        regNo: "RA2211003011777",
        profilePic: "https://via.placeholder.com/100",
        careerGoal: "Full Stack Developer"
    };

    const techStack = {
        Frontend: ["Next.js", "React", "Material-UI"],
        Backend: ["Node.js", "Express.js", "FastAPI", "Python"],
        Database: ["MongoDB", "SQL", "MySQL"],
    };

    useEffect(() => {
        console.log(user.techStack);
    }, [user.techStack]);

    return (
        <Box
            sx={{
                width: "30vw",
                position: "fixed",
                height: "100vh",
                top: 80,
                left: 30,
                overflowY: "auto",
                bgcolor: "transparent",
                textAlign: "left",
                pt: 4
            }}
        >
                {/* Profile Avatar */}
                <Avatar
                    imgProps={{ onError: (e) => (e.currentTarget.src = "https://www.google.com/imgres?q=placeholder%20image&imgurl=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F3%2F3f%2FPlaceholder_view_vector.svg%2F800px-Placeholder_view_vector.svg.png&imgrefurl=https%3A%2F%2Fcommons.wikimedia.org%2Fwiki%2FFile%3APlaceholder_view_vector.svg&docid=rZF7WVKcxnVDIM&tbnid=3Pj2b0TueRAWaM&vet=12ahUKEwj094Lk54GMAxVq3jgGHWsDPQAQM3oECFcQAA..i&w=800&h=621&hcb=2&ved=2ahUKEwj094Lk54GMAxVq3jgGHWsDPQAQM3oECFcQAA") }} // Fallback on error
                    sx={{
                        width: 200,
                        height: 200,
                        mx: "auto",
                        mb: 2,
                        borderRadius: "0px", // Make it a square
                    }}
                />


                {/* Profile Info */}
                <Typography variant="h6" fontWeight={600} sx={{  textShadow: "0px 0px 8px rgba(255, 255, 255, 0.6)"}}>
                    {user.name}
                </Typography>
                <Typography variant="body2" sx={(theme) => ({ mb: 1, color: 'primary.main',
                    ...theme.applyStyles('dark', {
                    color: 'primary.light',
                    }),})}>
                    {user.careerGoal} Aspirant
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {user.regNo}
                </Typography>

                {/* Divider */}
                <Divider sx={{ my: 2 }} />

                {/* Tech Stack Section */}  
                <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                    Tech Stack
                </Typography>

                <Typography variant="body2" color="text.secondary">
                {Object.keys(user.techStack).length > 0 ? (
                    Object.entries(user.techStack).map(([tech, count], index, array) => (
                        <span key={tech}>
                            {tech} {index !== array.length - 1 ? " | " : ""}
                        </span>
                    ))
                ) : (
                    "No skills listed"
                )}
            </Typography>
        </Box>
    );
}
