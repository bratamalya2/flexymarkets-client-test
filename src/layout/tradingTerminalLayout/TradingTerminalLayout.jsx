import { useEffect, useRef, useMemo, useCallback } from "react";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setThemeMode } from "../../globalState/userPanelState/themeMode/themeModeSlice";
import { getCustomTheme } from "../../theme";
import AppGlobalStyles from "../../AppGlobalStyles";
import { initiateMT5AccountDetailsSocketConnection } from "../../socketENV/MT5AccountDetailsSocketENV";
import { setActiveMT5AccountLogin } from "../../globalState/mt5State/mt5StateSlice";
import { useBroadcast } from "../../hooks/useBroadcast";
import { setSelectedSymbol } from "../../globalState/terminalState/terminalSlice";
import { useGetUserDataQuery } from "../../globalState/userState/userStateApis";

function TradingTerminalLayout() {
    const dispatch = useDispatch();
    const channel = useBroadcast();

    const { selectedSymbol } = useSelector(state => state.terminal);
    const { token } = useSelector(state => state.auth);
    const { activeMT5AccountLogin } = useSelector(state => state.mt5);

    const socketRef = useRef(null);
    const theme = useMemo(() => getCustomTheme("dark"), []);

    useEffect(() => {
        dispatch(setThemeMode("dark"));
    }, [dispatch]);

    // Restore active MT5 account from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("mt5-active-account");
        if (saved && saved !== activeMT5AccountLogin) {
            dispatch(setActiveMT5AccountLogin(saved));
        }
    }, [dispatch, activeMT5AccountLogin]);

    // Sync account changes across tabs via BroadcastChannel
    const onMsg = useCallback((e) => {
        if (e?.data?.type === "ACCOUNT_CHANGED" && e.data.accountId) {
            const next = String(e.data.accountId);
            localStorage.setItem("mt5-active-account", next);
            if (next !== activeMT5AccountLogin) {
                dispatch(setActiveMT5AccountLogin(next));
            }
        }
    }, [activeMT5AccountLogin, dispatch]);

    useEffect(() => {
        channel.onmessage = onMsg;
        channel.addEventListener?.("message", onMsg);
        return () => {
            channel.onmessage = null;
            channel.removeEventListener?.("message", onMsg);
        };
    }, [channel, onMsg]);

    useEffect(() => {
        const onStorage = (e) => {
            if (e.key === "mt5-active-account" && e.newValue) {
                dispatch(setActiveMT5AccountLogin(String(e.newValue)));
            }
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, [dispatch]);

    // Set default symbol when account loads for the first time
    const { data: userData } = useGetUserDataQuery();
    const mt5AccountList = userData?.data?.mt5AccountList;

    useEffect(() => {
        if (!activeMT5AccountLogin || !mt5AccountList || selectedSymbol) return;
        const currentAccount = mt5AccountList.find(acc => acc.Login == activeMT5AccountLogin);
        if (!currentAccount) return;
        const sym = currentAccount.accountType === "DEMO" ? "BTCUSD" : "XAUUSD";
        dispatch(setSelectedSymbol(sym));
    }, [activeMT5AccountLogin, mt5AccountList, selectedSymbol, dispatch]);

    // Account details socket — keeps Balance/Equity/Margin in Redux via MT5AccountDetailsSocketENV
    useEffect(() => {
        if (!activeMT5AccountLogin || !token) return;
        socketRef.current?.disconnect();
        socketRef.current = initiateMT5AccountDetailsSocketConnection({
            login: activeMT5AccountLogin,
            token,
            accountData: () => {}
        });
        return () => socketRef.current?.disconnect();
    }, [activeMT5AccountLogin, token]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppGlobalStyles styleScrollBar={{ width: "5px" }} />
            <Outlet />
        </ThemeProvider>
    );
}

export default TradingTerminalLayout;
