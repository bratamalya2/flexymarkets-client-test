import io from "socket.io-client";

export const TERMINAL_TRADE_SOCKET_EVENTS = {
    PLACE_MARKET: "terminal:trade:placeMarket",
    PLACE_LIMIT: "terminal:trade:placeLimit",
    CLOSE_POSITION: "terminal:trade:closePosition",
    CANCEL_PENDING: "terminal:trade:cancelPending",
    UPDATE_POSITION_PROTECTION: "terminal:trade:updateProtection",
};

const DEFAULT_TIMEOUT_MS = 25000;

let socketInstance = null;
let currentAuthToken = null;

export const getTerminalTradeSocket = (token) => {
    if (!socketInstance) {
        socketInstance = io(import.meta.env.VITE_BASE_URL, {
            autoConnect: false,
            auth: { authorization: token }
        });
        currentAuthToken = token ?? null;
        return socketInstance;
    }

    if (token && token !== currentAuthToken) {
        currentAuthToken = token;
        socketInstance.auth = { authorization: token };

        if (socketInstance.connected) {
            socketInstance.disconnect();
        }
    }

    return socketInstance;
};

export const executeTerminalTradeSocketAction = ({
    token,
    event,
    payload,
    timeoutMs = DEFAULT_TIMEOUT_MS
}) => new Promise((resolve, reject) => {
    if (!token) {
        reject({
            status: 401,
            message: "Authentication token is missing.",
            data: {
                status: false,
                message: "Authentication token is missing.",
                data: null,
            }
        });
        return;
    }

    const socket = getTerminalTradeSocket(token);
    let settled = false;
    let timeoutId = null;

    const cleanup = () => {
        clearTimeout(timeoutId);
        socket.off("connect", handleConnect);
        socket.off("connect_error", handleConnectError);
    };

    const finishWithError = (error) => {
        if (settled) return;
        settled = true;
        cleanup();
        reject(error);
    };

    const finishWithSuccess = (response) => {
        if (settled) return;
        settled = true;
        cleanup();
        resolve(response);
    };

    const handleAcknowledgement = (response) => {
        if (response?.status) {
            finishWithSuccess(response);
            return;
        }

        finishWithError({
            status: response?.httpStatus ?? 400,
            message: response?.message || "Trade request failed.",
            data: response || {
                status: false,
                message: "Trade request failed.",
                data: null,
            }
        });
    };

    const emitRequest = () => {
        try {
            socket.emit(event, payload, handleAcknowledgement);
        } catch (error) {
            finishWithError({
                status: 500,
                message: error?.message || "Failed to send trade request.",
                data: {
                    status: false,
                    message: error?.message || "Failed to send trade request.",
                    data: null,
                }
            });
        }
    };

    const handleConnect = () => {
        emitRequest();
    };

    const handleConnectError = (error) => {
        finishWithError({
            status: 0,
            message: error?.message || "Socket connection failed.",
            data: {
                status: false,
                message: error?.message || "Socket connection failed.",
                data: null,
            }
        });
    };

    timeoutId = setTimeout(() => {
        finishWithError({
            status: 408,
            message: "Trade request timed out.",
            data: {
                status: false,
                message: "Trade request timed out.",
                data: null,
            }
        });
    }, timeoutMs);

    if (socket.connected) {
        emitRequest();
        return;
    }

    socket.once("connect", handleConnect);
    socket.once("connect_error", handleConnectError);
    socket.connect();
});
