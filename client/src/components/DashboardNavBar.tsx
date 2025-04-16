import * as React from "react";
import { styled, alpha, useTheme } from "@mui/material/styles";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Container,
  Drawer,
  MenuItem,
  Divider,
  Button,
  Menu,
  MenuList,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CodeIcon from "@mui/icons-material/Code";
import LayersIcon from "@mui/icons-material/Layers";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpIcon from "@mui/icons-material/Help";
import ColorModeIconDropdown from "../theme/ColorModeIconDropdown";
import Sitemark from "./SitemarkIcon";
import { useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: 0,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: "#374151", // Dark color for border
  backgroundColor: "#f5f5f5", // Light background color
  boxShadow: (theme.vars || theme).shadows[1],
  padding: "8px 12px",
}));

export default function DashboardNavBar() {
  const theme = useTheme(); // Get current theme mode
  const navigate = useNavigate();
  const location = useLocation();

  // Dynamic color variables
  const textColor = theme.palette.mode === "dark" ? "white" : "black";
  const iconColor = theme.palette.mode === "dark" ? "white" : "black";

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("github_token");
      console.log("User signed out successfully!");
      navigate("/login");
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [profileMenuOpen, setProfileMenuOpen] =
    React.useState<null | HTMLElement>(null);

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuOpen(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuOpen(null);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: "primary",
        top: 0,
        left: 0,
        right: 0,
        mt: 0,
      }}
    >
      <StyledToolbar variant="dense" disableGutters>
        {/* Left: Menu Button & Sitemark */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            aria-label="Menu button"
            onClick={toggleDrawer(true)}
            sx={{ color: iconColor }}
          >
            <MenuIcon />
          </IconButton>
          <Sitemark />
        </Box>

        {/* Right: Profile & Theme Toggle */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <MenuItem onClick={() => navigate("/dashboard")}>
            <ListItemText primary="Dashboard" sx={{ color: textColor }} />
          </MenuItem>
          <MenuItem onClick={() => navigate("/tech-stack-recommender")}>
            <ListItemText primary="Tech Stack Recommender" sx={{ color: textColor }} />
          </MenuItem>
          <MenuItem onClick={() => navigate("/coding-practice")}>
            <ListItemText primary="Coding Platform" sx={{ color: textColor }} />
          </MenuItem>
          <ColorModeIconDropdown />
          <IconButton onClick={handleProfileMenuOpen} sx={{ color: iconColor }}>
            <AccountCircleIcon />
          </IconButton>
          <Menu
            anchorEl={profileMenuOpen}
            open={Boolean(profileMenuOpen)}
            onClose={handleProfileMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={() => navigate("/profile-setup")}>
              <ListItemText primary="Profile Setup" sx={{ color: textColor }} />
            </MenuItem>
            <Divider />
            <MenuItem>
              <Button
                onClick={handleSignOut}
                color="primary"
                variant="outlined"
                fullWidth
                sx={{ color: "#ffffff", borderColor: "ffffff" }}
              >
                Sign Out
              </Button>
            </MenuItem>
          </Menu>
        </Box>
      </StyledToolbar>

      {/* Side Panel (Drawer) */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 280,
            p: 2,
            backgroundColor: theme.palette.background.paper,
            height: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* 🔹 Logo at the top */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Sitemark />
            <IconButton onClick={toggleDrawer(false)} sx={{ color: iconColor }}>
              <CloseRoundedIcon />
            </IconButton>
          </Box>

          {/* 🔹 Divider for separation */}
          <Divider sx={{ mb: 2 }} />

          {/* 🔹 Menu Items */}
          <MenuList>
            {[
              {
                label: "Profile Setup",
                icon: <DashboardIcon fontSize="small" />,
                path: "/profile-setup",
              }
            ].map(({ label, icon, path }) => (
              <MenuItem
                key={path}
                onClick={() => {
                  navigate(path);
                  setDrawerOpen(false);
                }}
              >
                <ListItemIcon sx={{ color: iconColor }}>{icon}</ListItemIcon>
                <ListItemText
                  primary={label}
                  sx={{
                    fontWeight: isActive(path) ? "bold" : "normal",
                    color: isActive(path) ? "primary.main" : textColor,
                  }}
                />
              </MenuItem>
            ))}
          </MenuList>

          {/* 🔹 Push these buttons to the bottom */}
          <Box sx={{ mt: "auto" }}>
            <Divider sx={{ my: 2 }} />

            <MenuItem onClick={() => navigate("/settings")}>
              <ListItemIcon sx={{ color: iconColor }}>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Settings" sx={{ color: textColor }} />
            </MenuItem>

            <MenuItem onClick={() => navigate("/help-page")}>
              <ListItemIcon sx={{ color: iconColor }}>
                <HelpIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Help" sx={{ color: textColor }} />
            </MenuItem>
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
}
