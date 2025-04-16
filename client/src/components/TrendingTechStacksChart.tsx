import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, Typography, Box } from "@mui/material";

const techTrends = [
    { name: "Jan", NextJS: 40, Rust: 25, Django: 35 },
    { name: "Feb", NextJS: 50, Rust: 30, Django: 40 },
    { name: "Mar", NextJS: 60, Rust: 40, Django: 45 },
    { name: "Apr", NextJS: 70, Rust: 50, Django: 50 },
    { name: "May", NextJS: 80, Rust: 55, Django: 55 },
];

export default function TrendingTechStackChart() {
    return (
        <Card sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 3, backgroundColor: "#f5f5f5" }}>
            <Typography variant="h4" fontWeight={600} mb={2} color="black">
                📈 Trending Tech Stacks
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={techTrends}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="NextJS" stroke="#007bff" strokeWidth={2} />
                    <Line type="monotone" dataKey="Rust" stroke="#FF5733" strokeWidth={2} />
                    <Line type="monotone" dataKey="Django" stroke="#28a745" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </Card>
    );
}


// import { useState, useEffect } from "react";
// import axios from "axios";
// import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
// import { Card, Typography, Box, CircularProgress } from "@mui/material";

// const categoryMap = {
//     fullstackdevelopment: ["javascript", "react", "typescript", "express.js", "node.js", "mongoDB"],
//     ai_ml_engineer: ["python", "tensorflow", "pytorch", "scikit-learn", "machine learning"],
//     app_developer: ["swift", "kotlin", "flutter", "react native"]
// };

// export default function TrendingTechStackChart() {
//     const [trendData, setTrendData] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchTrendData = async () => {
//             try {
//                 const response = await axios.get("http://localhost:8087/api/trends");
//                 const trends = response.data;
                
//                 // Process data into chart format
//                 const formattedData = trends.reduce((acc, item) => {
//                     const { title, popularity_score, fetched_at } = item;
//                     const date = new Date(fetched_at).toLocaleString('default', { month: 'short' });
                    
//                     if (!acc[date]) acc[date] = { name: date };
//                     acc[date][title] = popularity_score;
//                     return acc;
//                 }, {});
                
//                 setTrendData(Object.values(formattedData));
//                 setLoading(false);
//             } catch (error) {
//                 console.error("Error fetching trend data:", error);
//                 setLoading(false);
//             }
//         };

//         fetchTrendData();
//     }, []);

//     return (
//         <Card sx={{ p: 3, mb: 3 }}>
//             <Typography variant="h2" fontWeight={600} mb={2}>
//                 📈 Trending Tech Stacks
//             </Typography>
//             {loading ? (
//                 <Box display="flex" justifyContent="center" alignItems="center" height={300}>
//                     <CircularProgress />
//                 </Box>
//             ) : (
//                 <ResponsiveContainer width="100%" height={300}>
//                     <LineChart data={trendData}>
//                         <XAxis dataKey="name" />
//                         <YAxis />
//                         <Tooltip />
//                         <Legend />
//                         {Object.values(categoryMap).flat().map((tech, index) => (
//                             <Line key={tech} type="monotone" dataKey={tech} stroke={"#" + ((1 << 24) * Math.random() | 0).toString(16)} strokeWidth={2} />
//                         ))}
//                     </LineChart>
//                 </ResponsiveContainer>
//             )}
//         </Card>
//     );
// }
