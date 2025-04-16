import { useState } from "react";
import { 
  Box, Button, Typography, Snackbar, Alert, CircularProgress, Paper
} from "@mui/material";
import { executeCode } from "./api";
import axios from "axios";
import { generateFeedback } from "../../src/parser/code-parser";
import { useParams } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const Output = ({ editorRef, language, optimalSolution = "" }) => {
  const [output, setOutput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [hint, setHint] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const {problemId} = useParams();

  console.log("Optimal Solution:", optimalSolution);
  const getOptimalCode = async() => {

    try {
      console.log(`Fetching problem ${problemId} from API...`);
      const response = await axios.get(`http://localhost:8087/api/problems/${encodeURIComponent(problemId)}`);  
      return response.data.problem.optimalCode;
    } catch (error) {
      console.error(error);
    }
  }
  const getHint = async () => {
    if (!editorRef.current) return;
    const userCode = editorRef.current.getValue();
    if (!userCode) return;
    try {
      const optimalCode = await getOptimalCode();
      const feedback = await axios.post("http://localhost:8000/compare-code", {
        student_code: userCode,
        optimal_code: optimalCode
      })

      console.log(feedback.data);

      if (Object.keys(feedback.data).length > 0) {
        const combinedHints = Object.values(feedback.data).join("\n");
        setHint(combinedHints);
      } else {
        setHint("Your logic looks good!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const runCode = async () => {
    if (!editorRef.current) {
      console.error("Editor reference is null");
      return;
    }

    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;

    try {
      setIsLoading(true);
      setIsCorrect(null);

      const response = await executeCode(language, sourceCode);
      console.log("Code Execution Result:", response);

      const userOutput = response?.trim() || "";
      const error = response.stderr?.trim() || "";

      setOutput(userOutput.split("\n"));
      setIsError(!!error);
      setErrorMessage(error);

      console.log("User Output:", userOutput);
      console.log

      if (optimalSolution && userOutput === optimalSolution.trim()) {
        setIsCorrect(true);
      } else {
        setIsCorrect(false);
      }
    } catch (error) {
      setIsError(true);
      setErrorMessage(error.message || "Unable to run code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2, width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>

      {/* Buttons */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={runCode} 
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : "Run Code"}
        </Button>

        <Button variant="outlined" color="secondary" onClick={getHint}>
          Get Hint 💡
        </Button>
      </Box>

      {/* Correctness Feedback */}
      {isCorrect !== null && (
        <Alert severity={isCorrect ? "success" : "error"} sx={{ mb: 2 }}>
          {isCorrect ? "Correct Solution ✅" : "Incorrect Solution ❌"}
        </Alert>
      )}

      {/* Hint Display */}
      {hint && (
        <Alert 
          severity={hint === "Your logic looks good!" ? "success" : "info"} 
          icon={hint === "Your logic looks good!" ? (
            <CheckCircleIcon sx={{ color: hint === "Your logic looks good!" ? "#155724" : "#ffffff" }} />
          ) : (
            <ErrorIcon sx={{ color: "#ffffff" }} />
          )}
      
          sx={{
            mb: 2, 
            backgroundColor: hint === "Your logic looks good!" ? "#d4edda" : "#ff2c2c", // light green color
            color: hint === "Your logic looks good!" ? "#155724" : "#ffffff", // darker green text color
          }}
        >
          <ul style={{ margin: 0, paddingLeft: "1.2rem", listStyleType: "decimal" }}>
            {hint.split("\n").map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ul>
        </Alert>
      )}



      {/* Output Box */}
      <Paper
        sx={{
          flex: 1,
          p: 2,
          overflowY: "auto",
          bgcolor: isError ? "error.light" : "black",
          color: isError ? "error.dark" : "white",
          border: "1px solid",
          borderColor: isError ? "error.main" : "grey.700",
          borderRadius: 2,
        }}
      >
        {output
          ? output.map((line, i) => (
              <Typography key={i} sx={{ whiteSpace: "pre-wrap" }}>
                {line}
              </Typography>
            ))
          : 'Click "Run Code" to see the output here'}
      </Paper>

      {/* Error Snackbar */}
      <Snackbar open={isError} autoHideDuration={6000} onClose={() => setIsError(false)}>
        <Alert severity="error" onClose={() => setIsError(false)}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Output;
