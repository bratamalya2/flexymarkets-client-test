import { Drawer, Stack, Tooltip, IconButton } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import TerminalSideBarSymbol from "./TerminalSideBarSymbol";


function TerminalSideBar({ sidebarRef, sidebarOpen, isLgDown, setSidebarOpen, drawerWidth, isMdDown, selectedTheme, isMobile, isIb, toggleSidebar }) {

    return (
        <Drawer
            ref={sidebarRef}
            variant={"permanent"}
            // variant={isLgDown && sidebarOpen ? "temporary" : "permanent"}
            open
            onClose={() => setSidebarOpen(false)}
            ModalProps={{
                keepMounted: true,
            }}
            sx={{
                // width: sidebarOpen ? drawerWidth : isMdDown ? 0 : 60,
                width: !sidebarOpen && 60,
                transition: "width 0.5s ease",
                "& .MuiDrawer-paper": {
                    // width: sidebarOpen ? drawerWidth : isMdDown ? 0 : 60,
                    width: 60,
                    overflowX: "hidden",
                    transition: "width 0.5s ease",
                    // bgcolor: "black",
                    bgcolor: selectedTheme === "dark" ? "#17181e" : "#ffffff",
                    borderRight: theme => `3px solid ${theme.palette.custom.brandLight}`,
                    // color: theme => theme.palette.text.primary,
                    textAlign: "center",
                    position: "fixed",
                    top: { xs: "56px", sm: "64px" },
                    height: { xs: "calc(100vh - 56px)", sm: "calc(100vh - 64px)" },
                    // scrollbarWidth: !sidebarOpen && "none",
                },
            }}
        >
            <Stack
                sx={{
                    py: "1rem",
                    // flexGrow: "1",
                    // alignItems: sidebarOpen && "start",
                }}
            >
                {/* <RecursiveNavigation
                    items={NAVIGATION}
                    sidebarOpen={sidebarOpen}
                    toggleSidebarOpen={setSidebarOpen}
                    darkMode={selectedTheme === "dark"}
                /> */}
                <Tooltip title={"Instruments"} placement="right">
                    <IconButton
                        color="inherit"
                        onClick={() => toggleSidebar("symbol")}
                        disableRipple
                    >
                        <MenuIcon sx={{ fontSize: "18px" }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title={"Economic calendar"} placement="right">
                    <IconButton
                        color="inherit"
                        onClick={() => toggleSidebar("calendar")}
                        disableRipple
                    >
                        <CalendarTodayOutlinedIcon sx={{ fontSize: "18px" }} />
                    </IconButton>
                </Tooltip>
            </Stack>
        </Drawer>
    )
}

export default TerminalSideBar;