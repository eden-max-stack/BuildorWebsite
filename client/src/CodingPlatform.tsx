import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import AppTheme from './theme/AppTheme';
import DashboardNavBar from './components/DashboardNavBar';
import { Box, Typography } from '@mui/material';
import CodeEditor from './components/CodeEditor';
export default function CodingPlatform(props: { disableCustomTheme?: boolean }) {
    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />

            <DashboardNavBar />
            <Box Box sx={{ display: "flex", height: "auto", overflow: "hidden", mt: 8, pt: 2, backgroundColor: 'transparent', backgroundImage: 'none' }}>
                <CodeEditor />
            </Box>
        </AppTheme>
    );
}