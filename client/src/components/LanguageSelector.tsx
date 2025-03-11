import { useState } from "react";
import { Menu, MenuItem, MenuList, Button, Typography, Box } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { LANGUAGE_VERSIONS } from "./constants";

const languages = Object.entries(LANGUAGE_VERSIONS);
const ACTIVE_COLOR = "#1976D2"; // Material UI Primary Blue

const LanguageSelector = ({ language, onSelect }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <Box display="flex">
      {/* Styled Dropdown Button */}
      <Button
        variant="contained"
        onClick={handleOpen}
        endIcon={<ArrowDropDownIcon />}
        sx={{
          bgcolor: "primary.main",
          color: "white",
          textTransform: "none",
          "&:hover": { bgcolor: "primary.dark" },
        }}
      >
        {language}
      </Button>

      {/* Dropdown Menu */}
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuList sx={{ bgcolor: "#1e1e1e", color: "white", minWidth: "150px" }}>
          {languages.map(([lang, version]) => (
            <MenuItem
              key={lang}
              selected={lang === language}
              onClick={() => {
                onSelect(lang);
                handleClose();
              }}
              sx={{
                color: lang === language ? ACTIVE_COLOR : "white",
                bgcolor: lang === language ? "rgba(25, 118, 210, 0.2)" : "transparent",
                "&:hover": { bgcolor: "rgba(25, 118, 210, 0.3)" },
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography>{lang}</Typography>
              <Typography component="span" sx={{ fontSize: "0.8rem", color: "gray" }}>
                ({version})
              </Typography>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Box>
  );
};

export default LanguageSelector;
