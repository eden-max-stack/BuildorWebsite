import { CssBaseline, Box, List, ListItem, ListItemText, Typography, Button, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppTheme from "./theme/AppTheme";
import DashboardNavBar from "./components/DashboardNavBar";
import LeftPanel from "./components/LeftPanel";
import React from "react";
import CodeEditor from "./components/CodeEditor";
import axios from "axios";

function CodingPractice(props: { disableCustomTheme?: boolean }) {
  const navigate = useNavigate();
  const { problemId } = useParams();
  
  const [problems, setProblems] = useState<{ id: string; name: string; desc: string }[]>([]);
  const [currentProblem, setCurrentProblem] = useState<{ id: string; name: string; desc: string } | null>(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        console.log("Fetching problems...");
        const response = await axios.get("http://localhost:8087/api/problems");
        const formattedProblems = response.data.map((p: { _id: string; name: string; desc: string }) => ({
          id: p._id,
          name: p.name,
          desc: p.desc,
        }));

        console.log("Fetched Problems:", formattedProblems);
        setProblems(formattedProblems);
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };

    fetchProblems();
  }, []);

  useEffect(() => {
    if (!problemId) {
      setCurrentProblem(null);
      return;
    }

    const fetchProblemById = async () => {
      try {
        console.log(`Fetching problem ${problemId} from API...`);
        const response = await axios.get(`http://localhost:8087/api/problems/${encodeURIComponent(problemId)}`);
        console.log("Fetched problem data:", response.data);
        
        const reqData = {
          id: response.data.problem._id,
          name: response.data.problem.name,
          desc: response.data.problem.desc
        };

        setCurrentProblem(reqData);
      } catch (error) {
        console.error("Error fetching problem details:", error);
      }
    };

    fetchProblemById();
  }, [problemId]);

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <DashboardNavBar />
      <Box sx={{ display: "flex", height: "100vh", overflow: "hidden", mt: 8, pt: 2 }}>
      {/* Left Panel (Fixed Width) */}
      {!problemId && (
        <Box sx={{ width: "280px", flexShrink: 0 }}>
          <LeftPanel />
        </Box>
      )}

        {!problemId ? (
            <Box>
              {/* 🚀 Heading + Add Question Button */}
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h4" fontWeight={600}>
                  🚀 Coding Problems
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate("/coding-practice/add-question")}
                  sx={(theme) => ({
                    bgcolor: theme.palette.mode === "dark" ? theme.palette.primary.light : "hsl(210, 100%, 35%)",
                    color: "white",
                    "&:hover": {
                      bgcolor: theme.palette.mode === "dark" ? theme.palette.primary.main : "hsl(210, 100%, 30%)",
                    },
                  })}
                >
                  ➕ Add Question
                </Button>

              </Box>

              {/* Questions List */}
              <List>
                {problems.map((p) => (
                  <ListItem key={p.id} button onClick={() => navigate(`/coding-practice/${p.id}`)}>
                    <ListItemText primary={p.name} secondary={p.desc} />
                  </ListItem>
                ))}
              </List>

            </Box>
          ) : (
          <Box sx={{ display: "flex", width: "100%", height: "100%" }}>
            
            {/* Left Half - Problem Description */}
            <Box sx={{ width: "50%", height: "100%", p: 2, overflowY: "auto", bgColor: 'transparent' }}>
            <Button onClick={() => {
              navigate("/coding-practice");
              setCurrentProblem(null); // Ensure the editor is hidden
            }} sx={{ mb: 2 }}>
              🔙 Back to Problems
            </Button>
              <Paper sx={{ p: 2, bgcolor: "transparent", textAlign: "left" }}>
                <Typography color="primary.dark" variant="h5" fontWeight={600}>
                  {currentProblem ? currentProblem.name : "Loading..."}
                </Typography>
                <Typography color="gray" variant="body1">
                  {currentProblem ? currentProblem.desc : "Loading description..."}
                </Typography>
              </Paper>
            </Box>

            {/* Right Half - Code Editor & Output */}
            <Box sx={{ width: "50%", display: "flex", flexDirection: "column", height: "100%" }}>
              {/* Code Editor */}
              <Box sx={{ flexGrow: 1 }}>
                {currentProblem ? <CodeEditor problemId={currentProblem.id} /> : <Typography>Loading problem...</Typography>}
              </Box>

              {/* Output Panel */}
              <Box sx={{ height: "100%", bgcolor: "#ffffff", color: "white", p: 2, overflowY: "auto", borderTop: "2px solid #333" }}>
                <Typography variant="h6">🔍 Output</Typography>
                <Typography variant="body2">Your program output will be displayed here...</Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </AppTheme>
  );
}

export default CodingPractice;
