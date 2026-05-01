// import io from 'socket.io-client';
// import { setCreatedTime, setDepositQRData, setExpireTime } from '../globalState/paymentState/paymentSlice';
// import { logoutThunk } from '../globalState/auth/authThunk';
// import { setNotification } from '../globalState/notificationState/notificationStateSlice';

// export function initiateSocketConnection({ token, network, amount, dispatch, currentUserId, login, accountData }) {

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
//         } else if (login) {
//             socket.emit("checkMargin", { login })
//         }
//     });

//     socket.on('paymentReady', (data) => {
//         dispatch(setDepositQRData(data?.data?.payment_info[0]));
//         dispatch(setCreatedTime(data?.data?.created_time));
//         dispatch(setExpireTime(data?.data?.expire_time));
//         // console.log('📩 paymentReady:', data);
//     });

//     socket.on('paymentStatus', (data) => {
//         // console.log('📩 paymentStatus:', data);
//         if (data) {
//             socket.disconnect();
//         }
//     });

//     socket.on("checkMargin", (data) => {
//         if (data) {
//             accountData(data)
//         }
//     })

//     socket.on("logOut", (data) => {
//         // console.log('🚨 logOut event received:', data);
//         if (data?.userId === currentUserId) {
//             dispatch(logoutThunk())
//             socket.disconnect()
//             dispatch(setNotification({ open: true, message: "You were logged out because you logged in from another device.", severity: "info" }));
//         }
//     });

//     return socket;
// }