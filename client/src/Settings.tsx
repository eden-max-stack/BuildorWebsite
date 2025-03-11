import { CssBaseline } from "@mui/material";
import AppTheme from "./theme/AppTheme";
import DashboardNavBar from "./components/DashboardNavBar";

export default function Settings(props: { disableCustomTheme?: boolean }) {
    return (
        <AppTheme {...props}>
        <CssBaseline enableColorScheme />

        <DashboardNavBar />
    </AppTheme>
    )
}