import { ThemeProvider, Box } from "@mui/material"
import { getCustomTheme } from "../../theme";
import { useSelector } from "react-redux";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { Outlet } from "react-router-dom";
import AppGlobalStyles from "../../AppGlobalStyles";
import { useMemo } from "react";

function AuthLayout() {

    const { selectedTheme } = useSelector((state) => state.themeMode);
    const theme = useMemo(() => getCustomTheme(selectedTheme), [selectedTheme]);

    return (
        <ThemeProvider theme={theme}>
            <AppGlobalStyles />
            <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
                <Header />
                <Box sx={{ flex: 1 }}>
                    <Outlet />
                </Box>
                <Footer />
            </Box>
        </ThemeProvider>
    )
}

export default AuthLayout;