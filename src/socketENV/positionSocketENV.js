import io from 'socket.io-client';
import store from "../globalState/store"
import { setActiveMT5AccountPositionsDetails } from '../globalState/mt5State/mt5StateSlice';

export function initiatePositionSocketConnection({ token, login, handlePositionData }) {

    const socket = io(import.meta.env.VITE_BASE_URL, {
        autoConnect: false,
        extraHeaders: {
            authorization: token
        }
    });

    socket.connect();

    socket.on('connect', () => {
        if (login) {
            socket.emit("checkPositionUser", { login })
        }
    });

    socket.on("checkPositionUser", (data) => {
        if (data) {
            if (handlePositionData) {
                handlePositionData(data)
            }
            store.dispatch(setActiveMT5AccountPositionsDetails(data))
        }
    });

    return socket;
}