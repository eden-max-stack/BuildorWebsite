import { useTheme } from "@mui/material/styles";
import buildorLogo from "../../src/assets/buildorLogo.svg"; // Light mode logo
import buildorLogoDark from "../../src/assets/buildorLogoDark.svg"; // Dark mode logo

export default function SitemarkIcon() {
  const theme = useTheme(); // Get current theme mode

  return (
    <a href="/" style={{ display: "inline-block" }}>
      <img
        src={theme.palette.mode === "dark" ? buildorLogoDark : buildorLogo}
        alt="Logo"
        width="100"
        height="21"
      />
    </a>
  );
}
