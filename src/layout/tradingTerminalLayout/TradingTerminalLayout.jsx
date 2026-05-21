// import { useState, useEffect, useRef, useMemo, useCallback } from "react";
// import { Box, CssBaseline, useMediaQuery } from "@mui/material";
// import { ThemeProvider } from "@mui/material/styles";
// import { Outlet, useLocation, useOutletContext } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { setThemeMode } from "../../globalState/userPanelState/themeMode/themeModeSlice";
// import Header from "../header/Header";
// import { getCustomTheme } from "../../theme";
// import AppGlobalStyles from "../../AppGlobalStyles";

// import TerminalSideBar from "../../pages/tradingTerminal/TerminalSideBar";
// import { useMt5AccountBalanceQuery } from "../../globalState/mt5State/mt5StateApis";
// import { initiateMT5AccountDetailsSocketConnection } from "../../socketENV/MT5AccountDetailsSocketENV";
// import TerminalSideBarDetails from "../../pages/tradingTerminal/TerminalSideBarDetails";
// import { setActiveMT5AccountLogin } from "../../globalState/mt5State/mt5StateSlice";
// import { useBroadcast } from "../../hooks/useBroadcast";
// import OrderPlacementForm from "../../pages/tradingTerminal/OrderPlacement/OrderPlacementForm";
// import { setSelectedSymbol } from "../../globalState/terminalState/terminalSlice";
// import { useGetUserDataQuery } from "../../globalState/userState/userStateApis";
// import { useMappedSymbols } from "../../hooks/useMappedSymbols";
// import Loader from "../../components/Loader";


// const drawerWidth = 280;

// function TradingTerminalLayout() {

//     const { selectedSymbol } = useSelector(state => state.terminal)

//     const channel = useBroadcast();

//     const [activeSidebarDetails, setActiveSideBarDetails] = useState(null)
//     const [activeAccountDetails, setActiveAccountDetails] = useState(null)
//     const socketRef = useRef()

//     const { data, isLoading } = useOutletContext()

//     const { token } = useSelector((state) => state.auth);

//     const isIb = data?.data?.userData?.isIb

//     const [sidebarOpen, setSidebarOpen] = useState(false);
//     const sidebarRef = useRef(null);
//     const mainContentRef = useRef(null);

//     const location = useLocation();

//     const dispatch = useDispatch();
//     const { selectedTheme } = useSelector((state) => state.themeMode);

//     const toggleSidebar = useCallback((key) => {
//         if (activeSidebarDetails === key) {
//             setActiveSideBarDetails(null);
//             setSidebarOpen(false);
//         } else {
//             setActiveSideBarDetails(key);
//             setSidebarOpen(true);
//         }
//     }, [activeSidebarDetails]);


//     const toggleTheme = useCallback(() => {
//         dispatch(setThemeMode(selectedTheme === "dark" ? "light" : "dark"));
//     }, [dispatch, selectedTheme]);

//     const theme = useMemo(() => getCustomTheme(selectedTheme), [selectedTheme]);

//     const isLgDown = useMediaQuery(theme.breakpoints.down("lg"));
//     const isMdDown = useMediaQuery(theme.breakpoints.down("md"));
//     const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//     const orderFromResponsive = useMediaQuery('(max-width:1024px)');

//     useEffect(() => {
//         dispatch(setThemeMode("dark"));
//     }, []);

//     const { activeMT5AccountLogin } = useSelector(state => state.mt5)

//     const { data: accountBalance, isLoading: accountBalanceLoading } = useMt5AccountBalanceQuery({ login: activeMT5AccountLogin, flag: 1 }, { skip: !activeMT5AccountLogin })

//     const activeAccountBalance = accountBalance?.data?.answer?.balance?.user

//     useEffect(() => {
//         const saved = localStorage.getItem("mt5-active-account");
//         if (saved && saved !== activeMT5AccountLogin) {
//             dispatch(setActiveMT5AccountLogin(saved));
//         }
//     }, [dispatch, activeMT5AccountLogin]);

//     useEffect(() => {
//         const onMsg = (e) => {
//             if (e && e.data && e.data.type === "ACCOUNT_CHANGED" && e.data.accountId) {
//                 const next = String(e.data.accountId);
//                 if (next !== localStorage.getItem("mt5-active-account")) {
//                     localStorage.setItem("mt5-active-account", next);
//                 }
//                 if (next !== activeMT5AccountLogin) {
//                     dispatch(setActiveMT5AccountLogin(next));
//                 }
//             }
//         };
//         channel.onmessage = onMsg;
//         channel.addEventListener && channel.addEventListener("message", onMsg);

//         return () => {
//             if (channel) {
//                 channel.onmessage = null;
//                 channel.removeEventListener && channel.removeEventListener("message", onMsg);
//             }
//         };
//     }, [channel, dispatch, activeMT5AccountLogin]);

//     useEffect(() => {
//         const onStorage = (e) => {
//             if (e.key === "mt5-active-account" && e.newValue) {
//                 const next = String(e.newValue);
//                 if (next !== activeMT5AccountLogin) {
//                     dispatch(setActiveMT5AccountLogin(next));
//                 }
//             }
//         };
//         window.addEventListener("storage", onStorage);
//         return () => window.removeEventListener("storage", onStorage);
//     }, [dispatch, activeMT5AccountLogin]);

//     const { data: userData } = useGetUserDataQuery()
//     const mt5AccountList = userData?.data?.mt5AccountList

//     const { mappedSymbols, defaultSymbol } = useMappedSymbols()

//     useEffect(() => {
//         if (activeMT5AccountLogin && mt5AccountList && !selectedSymbol) {
//             const currentAccount = mt5AccountList.find(acc => acc.Login == activeMT5AccountLogin)
//             const demoDefaultSymbol = mappedSymbols?.find(sym => sym.name === "BTCUSD");
//             const realDefaultSymbol = mappedSymbols?.find(sym => sym.name === "XAUUSD");
//             if (currentAccount) {
//                 if (currentAccount?.accountType === "DEMO") {
//                     dispatch(setSelectedSymbol(demoDefaultSymbol))
//                 } else {
//                     dispatch(setSelectedSymbol(realDefaultSymbol))
//                 }
//             }
//         }
//     }, [activeMT5AccountLogin, mt5AccountList, dispatch, mappedSymbols])

//     const accountData = (data) => {
//         if (data) {
//             setActiveAccountDetails(data?.marginDetails ? data?.marginDetails : data)
//         }
//     }

//     useEffect(() => {
//         if (!activeMT5AccountLogin || !token) return;

//         if (socketRef.current) {
//             socketRef.current.disconnect();
//             setActiveAccountDetails(null)
//         }

//         socketRef.current = initiateMT5AccountDetailsSocketConnection({
//             login: activeMT5AccountLogin,
//             token,
//             accountData
//         });

//         return () => {
//             if (socketRef.current) {
//                 socketRef.current.disconnect();
//             }
//         };
//     }, [activeMT5AccountLogin, token]);

//     if (!mappedSymbols || mappedSymbols.length === 0) {
//         return <Loader />;
//     }

//     return (
//         <ThemeProvider theme={theme}>
//             <CssBaseline />
//             <AppGlobalStyles styleScrollBar={{ width: "5px" }} />
//             <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
//                 <Header
//                     sidebarOpen={sidebarOpen}
//                 // toggleSidebar={toggleSidebar}
//                 // toggleTheme={toggleTheme}
//                 // activeAccountDetails={activeAccountDetails}
//                 />

//                 {/* {sidebarOpen && activeSidebarDetails && (
//                     <TerminalSideBarDetails Component={activeSidebarDetails} />
//                 )} */}

//                 {sidebarOpen && activeSidebarDetails && (
//                     <Box
//                         sx={{
//                             position: "fixed",
//                             top: { xs: "56px", sm: "64px" },
//                             right: 0,
//                             bottom: 0,
//                             left: `60px`,
//                             zIndex: (theme) => theme.zIndex.modal + 3,
//                             display: "flex",
//                             justifyContent: "flex-start",
//                             bgcolor: "rgba(0,0,0,0.4)",
//                             transition: "background 0.3s ease",
//                         }}
//                         onClick={() => setSidebarOpen(false)}
//                     >
//                         <Box
//                             onClick={(e) => e.stopPropagation()}
//                             sx={{
//                                 height: "100%",
//                                 bgcolor: selectedTheme === "dark" ? "#1e1f25" : "#fff",
//                                 boxShadow: 6,
//                                 transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
//                                 transition: "transform 0.3s ease-in-out",
//                                 overflowY: "auto",
//                             }}
//                         >
//                             <TerminalSideBarDetails Component={activeSidebarDetails} />
//                         </Box>
//                     </Box>
//                 )}


//                 {!isMobile && <TerminalSideBar
//                     sidebarRef={sidebarRef}
//                     sidebarOpen={sidebarOpen}
//                     isLgDown={isLgDown}
//                     setSidebarOpen={setSidebarOpen}
//                     drawerWidth={drawerWidth}
//                     isMdDown={isMdDown}
//                     selectedTheme={selectedTheme}
//                     isMobile={isMobile}
//                     isIb={isIb}
//                     toggleSidebar={toggleSidebar}
//                 />}
//                 <Box
//                     id="main-content"
//                     ref={mainContentRef}
//                     component="main"
//                     sx={{
//                         display: "flex",
//                         flexDirection: "column",
//                         flexGrow: 1,
//                         pt: { xs: "56px", sm: "64px" },
//                         height: "100vh",
//                         overflow: "hidden",
//                         bgcolor: selectedTheme === "dark" ? "#17181e" : "#ffffff",
//                         color: theme.palette.text.primary,
//                         transition: "width 0.5s ease",
//                     }}
//                     onClick={() => {
//                         if (isLgDown && sidebarOpen) {
//                             setSidebarOpen(false);
//                         }
//                     }}
//                 >
//                     <Box
//                         sx={{
//                             flex: 1,
//                             overflow: "hidden",
//                             display: "flex",
//                             flexDirection: "column",
//                         }}
//                     >
//                         <Outlet />
//                     </Box>

//                 </Box>
//                 <Box
//                     sx={{
//                         minWidth: "250px",
//                         pt: { xs: "56px", sm: "64px" },
//                         display: orderFromResponsive ? "none" : "inline"
//                     }}
//                 >
//                     <OrderPlacementForm />
//                 </Box>
//             </Box>
//         </ThemeProvider>

//     );
// }

// export default TradingTerminalLayout;























import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Box, CssBaseline, useMediaQuery } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { Outlet, useLocation, useOutletContext } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setThemeMode } from "../../globalState/userPanelState/themeMode/themeModeSlice";
import Header from "../header/Header";
import { getCustomTheme } from "../../theme";
import AppGlobalStyles from "../../AppGlobalStyles";

import TerminalSideBar from "../../pages/tradingTerminal/TerminalSideBar";
import { useMt5AccountBalanceQuery } from "../../globalState/mt5State/mt5StateApis";
import { initiateMT5AccountDetailsSocketConnection } from "../../socketENV/MT5AccountDetailsSocketENV";
import TerminalSideBarDetails from "../../pages/tradingTerminal/TerminalSideBarDetails";
import { setActiveMT5AccountLogin } from "../../globalState/mt5State/mt5StateSlice";
import { useBroadcast } from "../../hooks/useBroadcast";
import OrderPlacementForm from "../../pages/tradingTerminal/OrderPlacement/OrderPlacementForm";
import { setSelectedSymbol } from "../../globalState/terminalState/terminalSlice";
import { useGetUserDataQuery } from "../../globalState/userState/userStateApis";
import { useMappedSymbols } from "../../hooks/useMappedSymbols";
import Loader from "../../components/Loader";

const drawerWidth = 280;

function TradingTerminalLayout() {
    
    const dispatch = useDispatch();
    const location = useLocation();
    const channel = useBroadcast();

    const { selectedSymbol } = useSelector(state => state.terminal);
    const { selectedTheme } = useSelector(state => state.themeMode);
    const { token } = useSelector(state => state.auth);
    const { activeMT5AccountLogin } = useSelector(state => state.mt5);

    const { data } = useOutletContext();
    const isIb = data?.data?.userData?.isIb;

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeSidebarDetails, setActiveSideBarDetails] = useState(null);
    const [activeAccountDetails, setActiveAccountDetails] = useState(null);

    const socketRef = useRef(null);
    const sidebarRef = useRef(null);
    const mainContentRef = useRef(null);

    const theme = useMemo(() => getCustomTheme(selectedTheme), [selectedTheme]);

    const isLgDown = useMediaQuery(theme.breakpoints.down("lg"));
    const isMdDown = useMediaQuery(theme.breakpoints.down("md"));
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const orderFromResponsive = useMediaQuery("(max-width:1024px)");

    const toggleSidebar = useCallback((key) => {
        if (activeSidebarDetails === key) {
            setActiveSideBarDetails(null);
            setSidebarOpen(false);
        } else {
            setActiveSideBarDetails(key);
            setSidebarOpen(true);
        }
    }, [activeSidebarDetails]);

    useEffect(() => {
        dispatch(setThemeMode("dark"));
    }, [dispatch]);

    const { data: accountBalance } = useMt5AccountBalanceQuery(
        { login: activeMT5AccountLogin, flag: 1 },
        { skip: !activeMT5AccountLogin }
    );

    useEffect(() => {
        const saved = localStorage.getItem("mt5-active-account");
        if (saved && saved !== activeMT5AccountLogin) {
            dispatch(setActiveMT5AccountLogin(saved));
        }
    }, [dispatch, activeMT5AccountLogin]);

    useEffect(() => {
        const onMsg = (e) => {
            if (e?.data?.type === "ACCOUNT_CHANGED" && e.data.accountId) {
                const next = String(e.data.accountId);
                localStorage.setItem("mt5-active-account", next);
                if (next !== activeMT5AccountLogin) {
                    dispatch(setActiveMT5AccountLogin(next));
                }
            }
        };

        channel.onmessage = onMsg;
        channel.addEventListener?.("message", onMsg);

        return () => {
            channel.onmessage = null;
            channel.removeEventListener?.("message", onMsg);
        };
    }, [channel, dispatch, activeMT5AccountLogin]);

    useEffect(() => {
        const onStorage = (e) => {
            if (e.key === "mt5-active-account" && e.newValue) {
                dispatch(setActiveMT5AccountLogin(String(e.newValue)));
            }
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, [dispatch]);

    const { data: userData } = useGetUserDataQuery();
    const mt5AccountList = userData?.data?.mt5AccountList;

    const { mappedSymbols } = useMappedSymbols();

    useEffect(() => {
        if (
            !activeMT5AccountLogin ||
            !mt5AccountList ||
            selectedSymbol ||
            mappedSymbols.length === 0
        ) return;

        const currentAccount = mt5AccountList.find(
            acc => acc.Login == activeMT5AccountLogin
        );

        if (!currentAccount) return;

        const symbol =
            currentAccount.accountType === "DEMO"
                ? mappedSymbols.find(sym => sym.name === "BTCUSD")
                : mappedSymbols.find(sym => sym.name === "XAUUSD");

        if (symbol) {
            dispatch(setSelectedSymbol(symbol));
        }
    }, [
        activeMT5AccountLogin,
        mt5AccountList,
        mappedSymbols,
        selectedSymbol,
        dispatch
    ]);

    useEffect(() => {
        if (!activeMT5AccountLogin || !token) return;

        socketRef.current?.disconnect();

        socketRef.current = initiateMT5AccountDetailsSocketConnection({
            login: activeMT5AccountLogin,
            token,
            accountData: (data) =>
                setActiveAccountDetails(data?.marginDetails ?? data)
        });

        return () => socketRef.current?.disconnect();
    }, [activeMT5AccountLogin, token]);

    // if (selectedSymbol === null) {
    //     return <Loader />
    // }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppGlobalStyles styleScrollBar={{ width: "5px" }} />

            <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
                <Header sidebarOpen={sidebarOpen} />

                {/* Sidebar Overlay with Details */}{
                    sidebarOpen && activeSidebarDetails && (
                        <Box
                            sx={{
                                position: "fixed",
                                top: { xs: "56px", sm: "64px" },
                                right: 0,
                                bottom: 0,
                                left: `60px`, // Aligns with TerminalSideBar width
                                zIndex: (theme) => theme.zIndex.modal + 3,
                                display: "flex",
                                justifyContent: "flex-start",
                                bgcolor: "rgba(0,0,0,0.4)", // Overlay background
                                transition: "background 0.3s ease",
                            }}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <Box
                                onClick={(e) => e.stopPropagation()}
                                sx={{
                                    height: "100%",
                                    bgcolor: selectedTheme === "dark" ? "#1e1f25" : "#fff",
                                    boxShadow: 6,
                                    width: "350px", // Fixed width for panel
                                    transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
                                    transition: "transform 0.3s ease-in-out",
                                    overflowY: "auto",
                                }}
                            >
                                <TerminalSideBarDetails Component={activeSidebarDetails} />
                            </Box>
                        </Box>
                    )
                }

                {!isMobile && (
                    <TerminalSideBar
                        sidebarRef={sidebarRef}
                        sidebarOpen={sidebarOpen}
                        isLgDown={isLgDown}
                        isMdDown={isMdDown}
                        drawerWidth={drawerWidth}
                        selectedTheme={selectedTheme}
                        isMobile={isMobile}
                        isIb={isIb}
                        toggleSidebar={toggleSidebar}
                        setSidebarOpen={setSidebarOpen}
                    />
                )}

                <Box
                    ref={mainContentRef}
                    component="main"
                    sx={{
                        flexGrow: 1,
                        pt: { xs: "56px", sm: "64px" },
                        bgcolor: selectedTheme === "dark" ? "#17181e" : "#fff",
                        overflow: "hidden"
                    }}
                >
                    <Outlet />

                </Box>

                {!orderFromResponsive && (
                    <Box sx={{ minWidth: 250, pt: { xs: "56px", sm: "64px" } }}>
                        <OrderPlacementForm />
                    </Box>
                )}
            </Box>
        </ThemeProvider>
    );
}

export default TradingTerminalLayout;