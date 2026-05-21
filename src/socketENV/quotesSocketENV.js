import io from "socket.io-client";

let socketInstance = null;

export const getQuotesSocket = (token) => {
    if (!socketInstance) {
        socketInstance = io(`${import.meta.env.VITE_BASE_URL}`, {
            autoConnect: false,
            extraHeaders: {
                authorization: token
            }
        });
    } else if (token && socketInstance.io.opts.extraHeaders.authorization !== token) {
        socketInstance.io.opts.extraHeaders.authorization = token;
    }

    return socketInstance;
};