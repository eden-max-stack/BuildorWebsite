import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Box, TextField, InputLabel, Select, MenuItem, Button, Typography, IconButton 
} from "@mui/material";
import AppTheme from "./theme/AppTheme";
import { CssBaseline } from "@mui/material";
import DashboardNavBar from "./components/DashboardNavBar";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

function ProfileSetup(props: { disableCustomTheme?: boolean }) {
  const [name, setName] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [nickName, setNickName] = useState("");
  const [regNo, setRegNo] = useState("");
  const [email, setEmail] = useState("");
  const [careerGoal, setCareerGoal] = useState("");
  const [department, setDepartment] = useState("");
  const [achievements, setAchievements] = useState<string[]>([]);
  const [newAchievement, setNewAchievement] = useState("");
  const [workedWith, setWorkedWith] = useState<string[]>([]); // Ensure it's always an array
  const [users, setUsers] = useState<{ uid: string; name: string; profilePic: string }[]>([]);

  const token = localStorage.getItem('github_token');

  const handleCareerChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCareerGoal(event.target.value as string);
  };

  const handleDepartmentChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setDepartment(event.target.value as string);
  };
  
  const handleInvite = (uid: string) => {
    // Send an invite request to the backend
    axios.post("http://localhost:8087/api/users/invite", { invitedUserId: uid })
      .then(() => setWorkedWith([...workedWith, uid]))
      .catch(error => console.error("Error sending invite:", error));
  };

  const handleAddAchievement = () => {
    if (newAchievement.trim()) {
      setAchievements([...achievements, newAchievement]);
      setNewAchievement(""); // Clear input after adding
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission
      handleAddAchievement();
    }
  };

  const handleRemoveAchievement = (index: number) => {
    setAchievements(achievements.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const username = "eden-max-stack";
    const profilePic = "dfgeg";
    try {
      await axios.post("http://localhost:8087/api/users/save-profile", {
        userData: { username, name, nickName, regNo, email, careerGoal, department, achievements, profilePic }
      });      


      console.log("Profile saved successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const getCurrentUserId = async () => {
    try {
      const response = await axios.get("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${token}` },
    });

    setCurrentUserId(response.data.login);
    console.log(currentUserId);
    } catch (error) {
      console.error(error);
    }
  }

  const getUsers = async () => {
    try {
      // console.log("hello"); // This prints, meaning the function is called
  
      const response = await axios.get("http://localhost:8087/api/users");
      // console.log("Raw API Response:", response.data); // Now this should print
  
      if (response.data && Array.isArray(response.data)) {
        const filteredUsers = response.data.map((user) => ({
          uid: user.uid,
          name: user.name,
          profilePic: user.profilePic,
        }));
  
        // console.log("Processed Users:", filteredUsers); // Debugging
        setUsers(filteredUsers);
      } else {
        console.error("Unexpected data format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getUsers();
    getCurrentUserId();
  }, []);

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <DashboardNavBar />
      
      <Box sx={{ display: "flex", height: "auto", overflow: "hidden", mt: 8, pt: 2 }}>
        <Box sx={{ flexGrow: 1, ml: "340px", pr: 2, textAlign: "left" }}>
          
          <Box sx={{ textAlign: "left", mb: 3 }}>
            <Typography variant="h1" fontWeight={1000} fontSize={50}>Profile Setup</Typography>
            <Typography variant="body1" color="text.secondary">Complete your profile to personalize your experience.</Typography>
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
            <TextField required id="nickName" label="NickName" value={nickName} onChange={(e) => setNickName(e.target.value)} />
            <TextField required id="regNo" label="Reg. No." value={regNo} onChange={(e) => setRegNo(e.target.value)} />
            <TextField required id="email" label="Email ID" value={email} onChange={(e) => setEmail(e.target.value)} />

            <InputLabel id="career-goal-label">Career Goal</InputLabel>
            <Select labelId="career-goal-label" id="career-goal" value={careerGoal} onChange={handleCareerChange}>
              <MenuItem value="fullstackdevelopment">Full Stack Development</MenuItem>
              <MenuItem value="appdeveloper">Mobile App Development</MenuItem>
              <MenuItem value="aimlengineer">AI/ML Engineer</MenuItem>
            </Select>

            {/* choose your department */}
            <InputLabel id="dept-label">Department</InputLabel>
            <Select labelId="dept-label" id="department" value={department} onChange={handleDepartmentChange}>
              <MenuItem value="Computing Technologies">Computing Technologies</MenuItem>
              <MenuItem value="NWC">NWC</MenuItem>
              <MenuItem value="CINTEL">CINTEL</MenuItem>
              <MenuItem value="DSBS">DSBS</MenuItem>
            </Select>

            {/* Achievements Section */}
            <Box>
              <InputLabel>Achievements</InputLabel>

              {/* Input Field for Achievements */}
              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  id="new-achievement"
                  label="Add Achievement"
                  value={newAchievement}
                  onChange={(e) => setNewAchievement(e.target.value)}
                  onKeyDown={handleKeyPress} // Allow Enter key to add
                  fullWidth
                />
                <IconButton onClick={handleAddAchievement} color="primary">
                  <AddIcon />
                </IconButton>
              </Box>

              {/* Display Added Achievements */}
              <Box sx={{ mt: 2 }}>
                {achievements.map((ach, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      bgcolor: "primary.main",
                      p: 1,
                      mb: 1,
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2">• {ach}</Typography>
                    <IconButton size="small" onClick={() => handleRemoveAchievement(index)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Worked With Section */}
            <Box>
              <InputLabel>Worked With</InputLabel>
              <Select
                label="Worked With"
                fullWidth
                multiple
                value={workedWith.length > 0 ? workedWith : []} // Ensure it's always an array
                onChange={(e) => setWorkedWith(e.target.value as string[])} // Cast to array
                renderValue={(selected) =>
                  selected.map((uid) => users.find((u) => u.uid === uid)?.name || "Unknown").join(", ")
                }
              >
                {users.filter((user) => user.uid !== currentUserId).map((user) => ( // Iterate over fetched users
                  <MenuItem key={user.uid} value={user.uid}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                      <Typography>{user.name}</Typography>
                      <Button
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent Select from closing
                          console.log(`Invited ${user.name}`);
                        }}
                        variant="outlined"
                      >
                        Invite
                      </Button>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </Box>


            <Button type="submit" variant="contained" color="primary">
              Save Profile
            </Button>
          </Box>
        </Box>
      </Box>
    </AppTheme>
  );
}

export default ProfileSetup;
