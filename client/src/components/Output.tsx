import { useState } from "react";
import { 
  Box, Button, Typography, Snackbar, Alert, CircularProgress, Paper
} from "@mui/material";
import { executeCode } from "./api";
import { generateFeedback } from "../../src/parser/code-parser";

const Output = ({ editorRef, language, optimalSolution = "" }) => {
  const [output, setOutput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [hint, setHint] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  console.log("Optimal Solution:", optimalSolution);

  const getHint = () => {
    if (!editorRef.current) return;
    const userCode = editorRef.current.getValue();
    if (!userCode) return;

    const feedback = generateFeedback(userCode, optimalSolution);
    setHint(feedback.length ? feedback.join("\n") : "Your logic looks good!");
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
        <Alert severity="info" sx={{ mb: 2 }}>
          {hint}
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
