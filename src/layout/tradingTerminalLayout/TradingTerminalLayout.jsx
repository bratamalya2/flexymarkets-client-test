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
import { useQuotes } from "../../context/QuotesContext";
import { allSymbol } from "../../utils/allSymbol";

const PRIORITY_SYMBOLS = ["XAUUSD", "XAGUSD"];

function getSymbolName(symbol) {
    const rawSymbol = symbol?.Symbol ?? symbol?.name ?? symbol;
    return rawSymbol ? String(rawSymbol).split(".")[0].toUpperCase() : "";
}

function getPriorityRank(symbol) {
    const index = PRIORITY_SYMBOLS.indexOf(getSymbolName(symbol));
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

function getFirstTerminalSymbol(quoteData) {
    const symbols = quoteData?.length ? quoteData : allSymbol;

    return [...symbols]
        .sort((a, b) => {
            const rankDiff = getPriorityRank(a) - getPriorityRank(b);
            return rankDiff || 0;
        })
        .map(getSymbolName)
        .find(Boolean) || "XAUUSD";
}

function TradingTerminalLayout() {
    const dispatch = useDispatch();
    const channel = useBroadcast();

    const { token } = useSelector(state => state.auth);
    const { activeMT5AccountLogin } = useSelector(state => state.mt5);
    const { quoteData } = useQuotes();

    const socketRef = useRef(null);
    const startupSymbolSourceRef = useRef(null);
    const theme = useMemo(() => getCustomTheme("dark"), []);
    const defaultSymbol = useMemo(() => getFirstTerminalSymbol(quoteData), [quoteData]);
    const hasLiveQuotes = Boolean(quoteData?.length);

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

    // Set the first visible terminal symbol as the initial chart symbol.
    useEffect(() => {
        if (!defaultSymbol || startupSymbolSourceRef.current === "live") return;

        const nextSource = hasLiveQuotes ? "live" : "fallback";
        if (startupSymbolSourceRef.current === nextSource) return;

        startupSymbolSourceRef.current = nextSource;
        dispatch(setSelectedSymbol(defaultSymbol));
    }, [defaultSymbol, dispatch, hasLiveQuotes]);

    // Set default MT5 account when account data loads for the first time.
    const { data: userData } = useGetUserDataQuery();
    const mt5AccountList = userData?.data?.mt5AccountList;

    useEffect(() => {
        if (!mt5AccountList?.length) return;

        // Use the active account, or fall back to the first available account
        const login = activeMT5AccountLogin || String(mt5AccountList[0].Login);
        const account = mt5AccountList.find(acc => acc.Login == login) ?? mt5AccountList[0];

        // Persist the account selection so sockets pick it up
        if (!activeMT5AccountLogin) {
            localStorage.setItem("mt5-active-account", String(account.Login));
            dispatch(setActiveMT5AccountLogin(String(account.Login)));
        }
    }, [activeMT5AccountLogin, mt5AccountList, dispatch]);

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
