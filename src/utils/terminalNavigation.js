import { setActiveMT5AccountLogin } from "../globalState/mt5State/mt5StateSlice";
import { setSelectedSymbol } from "../globalState/terminalState/terminalSlice";
import { getBroadcastChannel } from "../hooks/useBroadcast";

/**
 * Opens the trading terminal in a single-tab mode and synchronizes state.
 * 
 * @param {Object} params
 * @param {string} params.accountId - The MT5 account login ID.
 * @param {Object} params.symbol - The selected symbol object.
 */
export const openTerminal = ({ accountId, symbol, dispatch }) => {

    const channel = getBroadcastChannel("mt5-account");

    // 1. Update LocalStorage (Persist state for reload/new load)
    if (accountId) {
        localStorage.setItem("mt5-active-account", accountId);
        localStorage.setItem("activeMT5Login", accountId);
        if (dispatch) dispatch(setActiveMT5AccountLogin(accountId));
    }
    if (symbol) {
        localStorage.setItem("selectedSymbol", JSON.stringify(symbol));
        if (dispatch) dispatch(setSelectedSymbol(symbol));
    }

    // 2. Broadcast State (Update existing open terminal immediately)
    if (channel) {
        if (accountId) {
            channel.postMessage({
                type: "ACCOUNT_CHANGED",
                accountId: accountId
            });
        }
        if (symbol) {
            channel.postMessage({
                type: "SYMBOL_CHANGED",
                symbol: symbol
            });
        }
    }

    // 3. Open/Focus Terminal Window
    // Using a specific window name ("FlexyMarketsTerminal") ensures we reuse the same window/tab.
    window.open("/terminal", "FlexyMarketsTerminal");
};