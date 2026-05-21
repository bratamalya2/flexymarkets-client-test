import { AppBar, Toolbar, Stack, Tooltip, IconButton, useTheme, Typography, useMediaQuery, Button, Box } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import ModeNightIcon from '@mui/icons-material/ModeNight';
import LightModeIcon from '@mui/icons-material/LightMode';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, matchPath } from "react-router-dom";
import { setThemeMode } from "../../globalState/userPanelState/themeMode/themeModeSlice";
import { useEffect } from "react";
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
// import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import WalletMenu from "./WalletMenu";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ProfileMenu from "./ProfileMenu";
import { useGetUserDataQuery } from "../../globalState/userState/userStateApis";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import AppsIcon from '@mui/icons-material/Apps';
import MenuComponent from "../../components/MenuComponent";
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import TerminalAccountDetailsMenu from "./TerminalAccountDetailsMenu";
import TerminalSymbolMenu from "./TerminalSymbolMenu";
import ModalComponent from "../../components/ModalComponent";
import TerminalDepositModal from "../../pages/tradingTerminal/TerminalDepositModal";
import TerminalMobileDrawer from "../tradingTerminalLayout/TerminalMobileDrawer";
import TerminalBuySell from "./TerminalBuySell";
import MetaDeposit from "../../pages/myAccount/liveAccount/accountDetailsAccordian/MetaDeposit";


const hideHeaderElementsOnRoutes = ["/accounts", "/accounts/*", "/client/kyc", "/terminal"];

const SHORT_BRAND_NAME = import.meta.env.VITE_SHORT_BRAND_NAME;

function Header({ sidebarOpen, toggleSidebar, toggleTheme }) {

    const modalWidth = useMediaQuery('(max-width:600px)');

    const { selectedSymbol } = useSelector((state) => state.terminal);

    const { token } = useSelector((state) => state.auth);
    const { hideBalance } = useSelector(state => state.profile)
    const { activeMT5AccountType, activeMT5AccountLogin } = useSelector(state => state.mt5)

    const { data, isLoading, refetch } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })

    const mainBalance = !isLoading && data?.data?.assetData?.mainBalance

    const Icondata = [
        {
            menu: WalletMenu,
            amt: mainBalance || "0.00",
            tooltip: "Wallet",
            menuIcon: AccountBalanceWalletOutlinedIcon
        },
        {
            menu: ProfileMenu,
            tooltip: "Profile",
            menuIcon: AccountCircleOutlinedIcon
        },
        // LanguageOutlinedIcon, 
        { icon: HelpOutlineOutlinedIcon, tooltip: "Help", link: "/client/helpDesk/newTicket" },
        // { icon: NotificationsNoneOutlinedIcon, tooltip: "Notification" },
        // AppsIcon
    ]

    const dispatch = useDispatch()

    const { selectedTheme } = useSelector((state) => state.themeMode);
    const theme = useTheme()

    const location = useLocation();
    const shouldHideHeaderItems = hideHeaderElementsOnRoutes.some(path =>
        matchPath(path, location.pathname)
    );

    useEffect(() => {
        if (shouldHideHeaderItems) {
            dispatch(setThemeMode("light"));
        }
    }, [shouldHideHeaderItems, dispatch]);

    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isMobileTerminalHeader = useMediaQuery('(max-width:1024px)');

    return (
        <AppBar
            position="fixed"
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 3,
                bgcolor: selectedTheme === "dark" ? "#121212" : "#ffffff",
                color: theme.palette.text.primary,
                boxShadow: "none",
                borderBottom: `1px solid ${selectedTheme === "dark" ? "#333" : "#e0e0e0"}`,
            }}
        >
            <Toolbar sx={{ justifyContent: "space-between", height: { xs: "56px", sm: "64px" } }}>
                <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
                    {!shouldHideHeaderItems && (
                        <Tooltip title={sidebarOpen ? "Collapse menu" : "Expand menu"}>
                            <IconButton
                                color="inherit"
                                edge="start"
                                onClick={toggleSidebar}>
                                {sidebarOpen ? <MenuOpenIcon /> : <MenuIcon />}
                            </IconButton>
                        </Tooltip>
                    )}
                    <Link to={"/client"}>
                        <img src={selectedTheme === "dark" ? import.meta.env.VITE_BRAND_LOGO_LIGHT : import.meta.env.VITE_BRAND_LOGO_DARK}
                            alt="My Logo"
                            style={{ width: "8rem" }}
                        />
                    </Link>
                    {
                        (((location.pathname).includes("/terminal")) && selectedSymbol)
                        &&
                        <Box sx={{ mx: "10px", display: "flex", gap: "1rem" }}>
                            <Box sx={{ position: "relative", width: "20px", height: "20px", ml: "5px" }}>
                                {selectedSymbol?.img2 && <img
                                    src={selectedSymbol?.img2}
                                    alt="error"
                                    width="25px"
                                    height="25px"
                                    style={{
                                        borderRadius: "50%",
                                        position: "absolute",
                                        left: 0,
                                        top: 0
                                    }}
                                />}
                                <img
                                    src={selectedSymbol?.img1}
                                    alt="error"
                                    width="25px"
                                    height="25px"
                                    style={{
                                        borderRadius: "50%",
                                        position: "absolute",
                                        right: selectedSymbol?.img2 && "5px",
                                        top: selectedSymbol?.img2 && "5px"
                                    }}
                                />
                            </Box>
                            <Typography sx={{ fontSize: "1rem" }}>{selectedSymbol?.name}</Typography>
                        </Box>
                    }
                    {(location.pathname).includes("/terminal") && <TerminalSymbolMenu />}
                </Stack>
                <Stack
                    sx={{
                        flexDirection: "row",
                        alignItems: "center"
                    }}
                >
                    {(!shouldHideHeaderItems && !isMobile) && (
                        <Stack sx={{ flexDirection: "row" }}>
                            {
                                Icondata.filter(menu => menu.menu).map((Item, i) => (
                                    <Stack key={i} sx={{ flexDirection: "row", alignItems: "center" }}>
                                        <Item.menu Icon={Item.menuIcon} tooltip={Item.tooltip} />
                                        {Item.amt && <Typography fontWeight={"bold"}>
                                            {
                                                hideBalance
                                                    ?
                                                    <>
                                                        <FiberManualRecordIcon sx={{ fontSize: "10px" }} />
                                                        <FiberManualRecordIcon sx={{ fontSize: "10px" }} />
                                                        <FiberManualRecordIcon sx={{ fontSize: "10px" }} />
                                                        <FiberManualRecordIcon sx={{ fontSize: "10px" }} />
                                                        <FiberManualRecordIcon sx={{ fontSize: "10px" }} />
                                                    </>
                                                    :
                                                    Number(Item.amt || 0).toLocaleString(undefined, {
                                                        minimumFractionDigits: 0,
                                                        maximumFractionDigits: 2,
                                                    })
                                            }
                                            <Typography component={"span"} ml={"2px"}>USD</Typography></Typography>}
                                    </Stack>
                                ))
                            }
                        </Stack>
                    )}
                    {!shouldHideHeaderItems && (
                        <Stack sx={{ flexDirection: "row" }}>
                            {
                                Icondata.filter(icon => icon.icon).map((Item, i) => (
                                    <Tooltip title={Item.tooltip} key={i}>
                                        <Stack sx={{ flexDirection: "row", alignItems: "center" }}>
                                            <IconButton key={i} component={Item.link && Link} to={Item?.link}>
                                                <Item.icon />
                                            </IconButton>
                                        </Stack>
                                    </Tooltip>
                                ))
                            }
                        </Stack>
                    )}
                    {(location.pathname) != "/client/IBProgramme/IBRequest" && <Tooltip title={selectedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
                        {!shouldHideHeaderItems && (
                            <IconButton color="inherit" onClick={toggleTheme}>
                                {selectedTheme === "dark"
                                    ? <LightModeIcon sx={{ color: theme.palette.custom.brandLight }} />
                                    : <ModeNightIcon sx={{ color: theme.palette.custom.brandDark }} />}
                            </IconButton>
                        )}
                    </Tooltip>}
                    {(location.pathname).includes("/terminal")
                        &&
                        (
                            isMobileTerminalHeader
                                ?
                                <Stack sx={{ flexDirection: "row", gap: "20px", alignItems: "center" }}>
                                    {!isMobile && <TerminalBuySell />}
                                    <TerminalMobileDrawer />
                                </Stack>
                                :
                                <Stack sx={{ flexDirection: "row", gap: "20px", alignItems: "center" }}>
                                    <TerminalAccountDetailsMenu data={{ mainBalance, refetch, modalWidth }} />
                                    <MenuComponent
                                        btnContent={<AppsIcon />}
                                        btnSx={{
                                            bgcolor: "transparent",
                                            "&:hover": { bgcolor: "transparent", },
                                            boxShadow: "none !important",
                                            minWidth: "2.5rem",
                                            p: "6px"
                                        }}
                                        specialMenuData={
                                            [
                                                { name: "Personal Area", icon: DashboardOutlinedIcon, link: "/terminal" },
                                                { name: `${SHORT_BRAND_NAME} Website`, icon: DashboardOutlinedIcon, link: "/" }
                                            ]
                                        }
                                    />
                                    {
                                        Icondata.filter(item => item.tooltip == "Profile").map((Item, i) => (
                                            <Item.menu key={i} Icon={Item.menuIcon} tooltip={Item.tooltip} />
                                        ))
                                    }
                                    {
                                        activeMT5AccountType == "Real"
                                            ?
                                            <ModalComponent
                                                btnName={"Deposit"}
                                                Content={MetaDeposit}
                                                contentData={{
                                                    login: activeMT5AccountLogin,
                                                    refetch,
                                                    mainBalance: Number(mainBalance || 0).toLocaleString(undefined, {
                                                        minimumFractionDigits: 0,
                                                        maximumFractionDigits: 2,
                                                    })
                                                }}
                                                modalWidth={modalWidth ? "95%" : 500}
                                                btnSx={{
                                                    bgcolor: theme.palette.custom.activeNavigation,
                                                    color: "white",
                                                    px: "4rem",
                                                    py: ".5rem"
                                                }}
                                            />
                                            :
                                            <ModalComponent
                                                btnName={"Deposit"}
                                                Content={TerminalDepositModal}
                                                btnSx={{
                                                    bgcolor: theme.palette.custom.activeNavigation,
                                                    color: "white",
                                                    px: "4rem",
                                                    py: ".5rem",
                                                    boxShadow: "none,"
                                                }}
                                                modalWidth={modalWidth ? "95%" : 500}
                                            />
                                    }
                                </Stack>
                        )
                    }
                </Stack>
            </Toolbar>
        </AppBar>
    )
}

export default Header;