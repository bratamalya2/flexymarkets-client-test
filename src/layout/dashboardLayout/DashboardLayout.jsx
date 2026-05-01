import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Box, CssBaseline, Typography, useMediaQuery } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { Outlet, useLocation, matchPath, useOutletContext } from "react-router-dom";
import Footer from '../footer/Footer';
import { useSelector, useDispatch } from "react-redux";
import { setThemeMode } from "../../globalState/userPanelState/themeMode/themeModeSlice";
import Header from "../header/Header";
import CompleteProfile from "../../components/CompleteProfile";
import Loader from "../../components/Loader"
import { getCustomTheme } from "../../theme";
import AppGlobalStyles from "../../AppGlobalStyles";
import SideBar from "../sideBar/SideBar";
import LatestNewsCarosul from "../../components/latest/LatestNewsCarosul";
import MarqueeComponent from "../../components/MarqueeComponent";
import { useGetNotificationQuery } from "../../globalState/otherContentState/otherContentStateApis";

const hideSideBarOnRoutes = ["/client/kyc"];

const drawerWidth = 280;

function DashboardLayout() {

    const { data: notificationData, isLoading: notificationLoading } = useGetNotificationQuery()

    const notificationStatus = !notificationLoading && notificationData?.status

    const { data, isLoading } = useOutletContext()

    const isIb = data?.data?.userData?.isIb
    const isSubIb = data?.data?.userData?.isSubIb

    const isIbOrSubIb = (isIb || isSubIb)

    const isKycVerified = data?.data?.userData?.isKycVerified || false

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const sidebarRef = useRef(null);
    const mainContentRef = useRef(null);

    const location = useLocation();
    const shouldHideSideBar = hideSideBarOnRoutes.some(path =>
        matchPath(path, location.pathname)
    );

    const dispatch = useDispatch();
    const { selectedTheme } = useSelector((state) => state.themeMode);

    const toggleSidebar = useCallback(() => {
        setSidebarOpen(prev => !prev);
    }, []);

    const toggleTheme = useCallback(() => {
        dispatch(setThemeMode(selectedTheme === "dark" ? "light" : "dark"));
    }, [dispatch, selectedTheme]);

    const theme = useMemo(() => getCustomTheme(selectedTheme), [selectedTheme]);

    const isLgDown = useMediaQuery(theme.breakpoints.down("lg"));
    const isMdDown = useMediaQuery(theme.breakpoints.down("md"));
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        if (isMobile) setSidebarOpen(false);
    }, [isMobile]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppGlobalStyles />
            <Box sx={{ display: "flex", overflow: "hidden" }}>
                <Header
                    sidebarOpen={sidebarOpen}
                    toggleSidebar={toggleSidebar}
                    toggleTheme={toggleTheme}
                />
                {!shouldHideSideBar
                    &&
                    <SideBar
                        sidebarRef={sidebarRef}
                        sidebarOpen={sidebarOpen}
                        isLgDown={isLgDown}
                        setSidebarOpen={setSidebarOpen}
                        drawerWidth={drawerWidth}
                        isMdDown={isMdDown}
                        selectedTheme={selectedTheme}
                        isMobile={isMobile}
                        isIbOrSubIb={isIbOrSubIb}
                    />
                }
                <Box
                    id="main-content"
                    ref={mainContentRef}
                    component="main"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        flexGrow: 1,
                        pt: { xs: "56px", sm: "64px" },
                        minHeight: "100vh",
                        overflow: "auto",
                        ...(isMobile && {
                            scrollbarWidth: "none",
                            "&::-webkit-scrollbar": {
                                display: "none",
                            },
                        }),
                        bgcolor: selectedTheme === "dark" ? "#17181e" : "#ffffff",
                        color: theme.palette.text.primary,
                        transition: "width 0.5s ease",
                    }}
                    onClick={() => {
                        if (isLgDown && sidebarOpen) {
                            setSidebarOpen(false);
                        }
                    }}
                >
                    {notificationStatus && <MarqueeComponent message={notificationData?.data?.message} />}
                    {(!shouldHideSideBar && !isLoading && !isKycVerified) && <CompleteProfile userData={data} userDataLoading={isLoading} />}
                    {location.pathname == "/client/myAccount" && <LatestNewsCarosul isKycVerified={isKycVerified} />}
                    <Box sx={{ flex: 1, pt: (isKycVerified && location.pathname !== "/client/IBProgramme/IBRequest") ? "30px" : 0 }}>
                        {(isLoading && !data) ? <Loader /> : <Outlet context={{ isLoading, data }} />}
                    </Box>
                    <Footer />
                </Box>
            </Box>
        </ThemeProvider>

    );
}

export default DashboardLayout;