import { Drawer, Stack, Divider } from "@mui/material";
import AccountDetails from "../accountDetails/AccountDetails";
import WalletDetails from "../walletDetails/WalletDetails";
import RecursiveNavigation from "../dashboardLayout/RecursiveNavigation";
import { getNavigationConfig } from "../dashboardLayout/Navigation";


function SideBar({ sidebarRef, sidebarOpen, isLgDown, setSidebarOpen, drawerWidth, isMdDown, selectedTheme, isMobile, isIbOrSubIb }) {

    const NAVIGATION = getNavigationConfig(isIbOrSubIb);

    return (
        <Drawer
            ref={sidebarRef}
            variant={isLgDown && sidebarOpen ? "temporary" : "permanent"}
            open
            onClose={() => setSidebarOpen(false)}
            ModalProps={{
                keepMounted: true,
            }}
            sx={{
                width: sidebarOpen ? drawerWidth : isMdDown ? 0 : 60,
                transition: "width 0.5s ease",
                "& .MuiDrawer-paper": {
                    width: sidebarOpen ? drawerWidth : isMdDown ? 0 : 60,
                    overflowX: "hidden",
                    transition: "width 0.5s ease",
                    bgcolor: selectedTheme === "dark" ? "#121212" : "#ffffff",
                    color: theme => theme.palette.text.primary,
                    textAlign: "center",
                    position: "fixed",
                    top: { xs: "56px", sm: "64px" },
                    height: { xs: "calc(100vh - 56px)", sm: "calc(100vh - 64px)" },
                    scrollbarWidth: !sidebarOpen && "none",
                },
            }}
        >
            {
                isMobile &&
                <>
                    <Stack
                        sx={{
                            position: "sticky",
                            bottom: 0,
                            bgcolor: selectedTheme === "dark" ? "#272727" : "#ffffff",
                            width: "100%"
                        }}
                    >
                        <AccountDetails />
                    </Stack>
                    <Divider />
                    <WalletDetails
                        sidebarOpen={sidebarOpen}
                        toggleSidebarOpen={setSidebarOpen}
                    />
                    <Divider />
                </>
            }
            <Stack
                sx={{
                    py: "1rem",
                    flexGrow: "1"
                }}
            >
                <RecursiveNavigation
                    items={NAVIGATION}
                    sidebarOpen={sidebarOpen}
                    toggleSidebarOpen={setSidebarOpen}
                    darkMode={selectedTheme === "dark"}
                />
            </Stack>
        </Drawer>
    )
}

export default SideBar;