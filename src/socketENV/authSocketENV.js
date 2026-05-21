import io from 'socket.io-client';
import { logoutThunk } from '../globalState/auth/authThunk';
import { setNotification } from '../globalState/notificationState/notificationStateSlice';

let existingSocket = null;

export function initiateAuthSocketConnection({ token, dispatch, currentUserId }) {

    disconnectAuthSocket();

    const socket = io(import.meta.env.VITE_BASE_URL, {
        autoConnect: false,
        extraHeaders: {
            authorization: token
        }
    });

    existingSocket = socket;
    socket.connect();

    const handleLogout = (data) => {

        if (data?.userId === currentUserId) {
            socket.off("logOut", handleLogout);
            disconnectAuthSocket();
            dispatch(logoutThunk());
            dispatch(setNotification({
                open: true,
                message: "You were logged out because you logged in from another device.",
                severity: "info"
            }));
        }
    };

    socket.on("logOut", handleLogout);

    return socket;
}

export function disconnectAuthSocket() {
    if (existingSocket) {
        existingSocket.disconnect();
        existingSocket = null;
    }
}