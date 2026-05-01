// import io from 'socket.io-client';
// import { removeCreatedTime, removeDepositQRData, removeExpireTime, setCreatedTime, setDepositQRData, setExpireTime } from '../globalState/paymentState/paymentSlice';
// import { setNotification } from '../globalState/notificationState/notificationStateSlice';

// export function initiatePaymentSocketConnection({ token, network, amount, dispatch, refetch }) {

//     const socket = io(import.meta.env.VITE_BASE_URL, {
//         autoConnect: false,
//         extraHeaders: {
//             authorization: token
//         }
//     });

//     socket.connect();

//     socket.on('connect', () => {
//         if (network && amount) {
//             socket.emit('startPayment', { network, amount });
//         }
//     });

//     socket.on('paymentReady', (data) => {
//         if (data) {
//             dispatch(setNotification({ open: true, message: "Payment is ready!", severity: "info" }))
//             dispatch(setDepositQRData(data?.data?.payment_info[0]));
//             dispatch(setCreatedTime(data?.data?.created_time));
//             dispatch(setExpireTime(data?.data?.expire_time));
//         }
//     });

//     socket.on('paymentStatus', (data) => {
//         if (data) {
//             socket.disconnect();
//             refetch()
//             dispatch(setNotification({ open: true, message: "Payment processed successfully!", severity: "info" }))
//             dispatch(removeDepositQRData(null));
//             dispatch(removeCreatedTime(null));
//             dispatch(removeExpireTime(null));

//         }
//     });

//     return socket;
// }

// // 
















import io from "socket.io-client";
import {
    removeCreatedTime,
    removeDepositQRData,
    removeExpireTime,
    setCreatedTime,
    setDepositQRData,
    setExpireTime,
    setHasStarted
} from "../globalState/paymentState/paymentSlice";
import { setNotification } from "../globalState/notificationState/notificationStateSlice";

export function initiatePaymentSocketConnection({
    token,
    network,
    amount,
    dispatch,
    refetch,
    navigate,
    depositQRData,
    hasStarted
}) {
    if (!token) return;

    // let hasStarted = false;

    const socket = io(import.meta.env.VITE_BASE_URL, {
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
        timeout: 10000,
        extraHeaders: {
            authorization: token,
        },
    });

    socket.connect();

    socket.on("connect", () => {

        if (!hasStarted && network && amount && !depositQRData) {
            dispatch(setHasStarted(true))
            socket.emit("startPayment", { network, amount });
        }
    });

    socket.on("connect_error", (err) => {
        console.warn("⚠️ Socket connection error:", err.message);
        dispatch(
            setNotification({
                open: true,
                message:
                    "Unable to connect to payment server. Please check your internet connection.",
                severity: "error",
            })
        );
    });

    socket.on("disconnect", (reason) => {

        if (reason !== "io client disconnect") {
            dispatch(
                setNotification({
                    open: true,
                    message: "Connection lost. Attempting to reconnect...",
                    severity: "warning",
                })
            );
        }

    });

    socket.on("paymentReady", (data) => {
        if (!data || depositQRData) return;

        dispatch(
            setNotification({
                open: true,
                message: "Payment is ready!",
                severity: "info",
            })
        );

        dispatch(setDepositQRData(data?.data?.payment_info[0]));
        dispatch(setCreatedTime(data?.data?.created_time));
        dispatch(setExpireTime(data?.data?.expire_time));
    });


    socket.on("paymentStatus", (data) => {

        if (!data) return;

        socket.removeAllListeners();
        socket.disconnect();

        refetch();
        dispatch(
            setNotification({
                open: true,
                message: "Payment processed successfully!",
                severity: "success",
            })
        );
        dispatch(removeDepositQRData(null));
        dispatch(removeCreatedTime(null));
        dispatch(removeExpireTime(null));
        dispatch(setHasStarted(false))

        navigate("/client/myAccount");
    });


    const cleanup = () => {
        socket.removeAllListeners();
        socket.disconnect();
    };

    return { socket, cleanup };
}