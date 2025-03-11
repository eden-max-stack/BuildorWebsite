import React, { useState } from 'react'
import AppTheme from './theme/AppTheme';
import { CssBaseline } from '@mui/material';
import DashboardNavBar from './components/DashboardNavBar';
import { 
    Box, TextField, InputLabel, Select, MenuItem, Button, Typography, FormControl
  } from "@mui/material";
import axios from 'axios';

function AddQuestion(props: { disableCustomTheme?: boolean }) {

    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [optcode, setOptCode] = useState("");
    const [optsol, setOptSol] = useState("");
    const [categories, setCategories] = useState<string[]>([]);

    const handleCategoryChange = (event) => {
        setCategories(event.target.value); // Since `multiple` is true, value is an array
      };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
    
        try {
          await axios.post("http://localhost:8087/api/problems/save-question", {
            name, desc, optcode, categories, optsol
          });      
            
          console.log("Question saved successfully!");
        } catch (error) {
          console.error("Error saving question:", error);
        }
      };

    return (
        <AppTheme {...props}>
          <CssBaseline enableColorScheme />
          <DashboardNavBar />
          
          <Box sx={{ display: "flex", height: "auto", overflow: "hidden", mt: 8, pt: 2, height: "100vh" }}>
            <Box sx={{ flexGrow: 1, ml: "340px", pr: 2, textAlign: "left" }}>
              
              <Box sx={{ textAlign: "left", mb: 3 }}>
                <Typography variant="h1" fontWeight={1000} fontSize={50}>Add a question</Typography>
              </Box>
    
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  p: 3,
                  borderRadius: 2,
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  bgcolor: "background.paper",
                  maxWidth: "500px"
                }}
              >
                <TextField required id="name" label="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <TextField required id="desc" label="Description" value={desc} onChange={(e) => setDesc(e.target.value)} />
                <TextField required id="optcode" label="Optimal Code" value={optcode} onChange={(e) => setOptCode(e.target.value)} />
                <TextField required id="optsol" label="Optimal Solution" value={optsol} onChange={(e) => setOptSol(e.target.value)} />
                
                <FormControl fullWidth>
                <InputLabel id="category-label">Categories</InputLabel>
                <Select
                    labelId="category-label"
                    id="category"
                    multiple
                    value={categories}
                    onChange={handleCategoryChange}
                    renderValue={(selected) => selected.join(", ")} // Display selected options
                >
                    <MenuItem value="aStr">Arrays/Strings</MenuItem>
                    <MenuItem value="trees">Trees</MenuItem>
                    <MenuItem value="graphs">Graphs</MenuItem>
                    <MenuItem value="pqueues">Priority Queues</MenuItem>
                </Select>
                </FormControl>
                
    
    
                <Button type="submit" variant="contained" color="primary">
                  Save Question
                </Button>
              </Box>
            </Box>
          </Box>
        </AppTheme>
      );
}

export default AddQuestion;