import io from "socket.io-client";

let socketInstance = null;

export const getQuotesSocket = (token) => {
    if (!socketInstance) {
        socketInstance = io(`${import.meta.env.VITE_BASE_URL}`, {
            autoConnect: false,
            auth: { authorization: token }
        });
    } else if (token && socketInstance.auth?.authorization !== token) {
        socketInstance.auth = { authorization: token };
    }

    return socketInstance;
};