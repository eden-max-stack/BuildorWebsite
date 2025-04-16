import { useRef, useState, useEffect } from "react";
import { Box, Grid, Paper } from "@mui/material";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "./constants";
import Output from "./Output";
import useProctoring from "./useProctoring";
import useTabRestriction from "./useTabRestriction";
import useFullscreenProctoring from "./useFullScreenProctoring";
import axios from "axios"; // Import Axios

const CodeEditor = ({ problemId }: { problemId: string }) => {
  // useProctoring();
  // useTabRestriction();
  // useFullscreenProctoring();

  console.log("Received problemId in CodeEditor:", problemId);

  const editorRef = useRef(null);
  const [value, setValue] = useState(""); // Initially empty
  const [language, setLanguage] = useState("javascript");
  const [optimalSolution, setOptimalSolution] = useState(""); // Store the optimal solution

  // Fetch problem-specific starter code and optimal solution
  useEffect(() => {
    if (!problemId) {
      console.error("No problemId provided to CodeEditor!");
      return;
    }
  
    const fetchProblemData = async () => {
      try {
        console.log(`Fetching data for problem ${problemId}...`);
        const response = await axios.get(`http://localhost:8087/api/problems/${encodeURIComponent(problemId)}`);
  
        if (response.data) {
          setValue(response.data.starterCode || CODE_SNIPPETS[language]); // Set starter code
          setOptimalSolution(response.data.problem.optimalSol || ""); // Store optimal solution
        }
      } catch (error) {
        console.error("Error fetching problem data:", error);
        setValue(CODE_SNIPPETS[language]); // Fallback to default
      }
    };
  
    fetchProblemData();
  }, [problemId, language]); 

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (newLanguage) => {
    setLanguage(newLanguage);
    setValue(CODE_SNIPPETS[newLanguage]); // Reset to default when language changes
  };

  // useEffect(() => {
  //   const handleKeyDown = (e: KeyboardEvent) => {
  //     if ((e.ctrlKey || e.metaKey) && ["c", "v", "x"].includes(e.key.toLowerCase())) {
  //       e.preventDefault();
  //     }
  //   };
  
  //   document.addEventListener("keydown", handleKeyDown);
  //   return () => document.removeEventListener("keydown", handleKeyDown);
  // }, []);
  

  return (
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", px: 2, bgcolor: "background.default" }}>
        
        {/* Code Editor Section */}
        <Paper 
          elevation={3} 
          sx={{
            flex: 1,
            p: 2,
            bgcolor: "#1e1e1e", 
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            position: "relative", // Allows absolute positioning for LanguageSelector
          }}
        >
          {/* Compact Language Selector at Top-Right */}
          <Box sx={{ position: "absolute", top: 8, right: 8, display: "flex", alignItems: "center" }}>
            {/* <CodeIcon sx={{ color: "white", mr: 1 }} /> */}
            <LanguageSelector language={language} onSelect={(newLang) => setLanguage(newLang)} />
          </Box>
          
          <Box sx={{ flex: 1, overflow: "auto", mt: 5, bgcolor: "#2d2d2d", p: 1 }}>
            <Editor
              options={{ minimap: { enabled: false }, fontSize: 14, automaticLayout: true }}
              height="100%"
              theme="vs-dark"
              language={language}
              value={value}
              onMount={(editor) => {
                editorRef.current = editor;
                editor.focus();
              }}
              // onCopy={(e) => e.preventDefault()} // Disable copying
              // onCut={(e) => e.preventDefault()} // Disable cutting
              // onPaste={(e) => e.preventDefault()} // Disable pasting
              onChange={(newValue) => setValue(newValue)}
            />
          </Box>
        </Paper>
  
        {/* Output Section */}
        <Paper 
          elevation={3} 
          sx={{
            flex: 1,
            overflow: "auto",
            mt: 2,
            bgcolor: "#1e1e1e", 
            p: 2,
          }}
        >
          <Output editorRef={editorRef} language={language} optimalSolution={optimalSolution} />
        </Paper>
  
      </Box>
  );
};

export default CodeEditor;