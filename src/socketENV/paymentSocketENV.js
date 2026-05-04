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

const ADDRESS_FIELDS = [
    "payment_address",
    "to_address",
    "address",
    "wallet_address",
    "deposit_address",
    "pay_address",
    "paymentAddress",
    "toAddress",
    "walletAddress",
    "depositAddress",
    "payAddress",
];
const PAYMENT_URL_FIELDS = [
    "invoice_payment_url",
    "checkout_url",
    "payment_url",
    "pay_url",
    "redirect_url",
    "payment_link",
    "hosted_url",
    "url",
    "link",
    "checkoutUrl",
    "paymentUrl",
    "payUrl",
    "redirectUrl",
    "paymentLink",
    "hostedUrl",
];

function firstPopulatedValue(source, fields) {
    if (!source || typeof source !== "object") return null;

    for (const field of fields) {
        const value = source[field];
        if (value !== undefined && value !== null && String(value).trim() !== "") {
            return value;
        }
    }

    return null;
}

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
        timeout: 60000,
        auth: {
            token,
            authorization: token,
        },
        extraHeaders: {
            authorization: token,
        },
    });

    socket.on("connect", () => {

        if (!hasStarted && network && amount && !depositQRData) {
            dispatch(setHasStarted(true))
            dispatch(
                setNotification({
                    open: true,
                    message: "Creating payment invoice...",
                    severity: "info",
                })
            );
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
        dispatch(setHasStarted(false));
    });

    const handlePaymentError = (err, ack) => {
        dispatch(
            setNotification({
                open: true,
                message: err?.message || "Payment gateways could not create an invoice. Please try again.",
                severity: "error",
            })
        );
        dispatch(setHasStarted(false));
        if (typeof ack === "function") ack();
        socket.disconnect();
    };

    socket.on("paymentError", handlePaymentError);
    socket.on("error", handlePaymentError);

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

        const invoice = data?.data || {};
        const paymentInfo = invoice?.payment_info?.[0] || {};
        const paymentAddress = firstPopulatedValue(paymentInfo, ADDRESS_FIELDS)
            || firstPopulatedValue(invoice, ADDRESS_FIELDS);
        const invoicePaymentUrl = firstPopulatedValue(invoice, PAYMENT_URL_FIELDS)
            || firstPopulatedValue(paymentInfo, PAYMENT_URL_FIELDS);

        const normalizedDepositData = {
            ...paymentInfo,
            payment_address: paymentAddress,
            receive_amount: paymentInfo?.receive_amount || paymentInfo?.amount || invoice?.receive_amount || invoice?.order_amount || invoice?.amount_usd || invoice?.amount || null,
            token_symbol: paymentInfo?.token_symbol || paymentInfo?.coinname || invoice?.token_symbol || invoice?.coinname || "USDT",
            token_name: paymentInfo?.token_name || invoice?.token_name || invoice?.coinname || "USDT",
            blockchain: paymentInfo?.blockchain || invoice?.blockchain || invoice?.networkname || null,
            invoice_payment_url: invoicePaymentUrl,
            payment_gateway: invoice?.payment_gateway,
            order_no: invoice?.gateway_order_id || invoice?.cregis_id || invoice?.orderno || null,
        };

        if (!normalizedDepositData.payment_address && !normalizedDepositData.invoice_payment_url) {
            handlePaymentError({
                message: "Payment invoice was created, but no deposit address or checkout link was returned.",
            });
            return;
        }

        dispatch(
            setNotification({
                open: true,
                message: "Payment is ready!",
                severity: "info",
            })
        );

        dispatch(setDepositQRData(normalizedDepositData));
        dispatch(setCreatedTime(invoice?.created_time || Date.now()));
        dispatch(setExpireTime(invoice?.expire_time || Date.now() + 60 * 60 * 1000));
        dispatch(setHasStarted(false));

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

    socket.connect();

    return { socket, cleanup };
}
