import io from 'socket.io-client';
import { setActiveMT5AccountDetails } from '../globalState/mt5State/mt5StateSlice';
import store from "../globalState/store"

export function initiateMT5AccountDetailsSocketConnection({ token, login, accountData, dispatch }) {

    const socket = io(import.meta.env.VITE_BASE_URL, {
        autoConnect: false,
        extraHeaders: {
            authorization: token
        }
    });

    socket.connect();

    socket.on('connect', () => {
        if (login) {
            socket.emit("checkMargin", { login })
        }
    });

    socket.on("checkMargin", (data) => {
        if (data) {
            const finalData = data?.marginDetails ? data?.marginDetails : data
            store.dispatch(setActiveMT5AccountDetails(finalData))
            accountData(data)
        }
    })

    return socket;
}