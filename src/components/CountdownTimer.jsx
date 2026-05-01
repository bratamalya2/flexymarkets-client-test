// import { Box, Typography } from '@mui/material';
// import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//     setHasTimedOut,
//     removeDepositQRData,
//     removeCreatedTime,
//     removeExpireTime
// } from '../globalState/paymentState/paymentSlice';

// function CountdownTimer() {
//     const dispatch = useDispatch();
//     const hasTimedOut = useSelector(state => state.payment.hasTimedOut);
//     const createdTime = useSelector(state => state.payment.createdTime);
//     const expireTime = useSelector(state => state.payment.expireTime);

//     const [timeLeft, setTimeLeft] = useState(0);

//     useEffect(() => {
//         if (!createdTime || !expireTime) return;

//         const updateTimer = () => {
//             const now = Date.now();
//             const remaining = Math.floor((expireTime - now) / 1000);
//             setTimeLeft(Math.max(0, remaining));

//             if (remaining <= 0) {
//                 dispatch(setHasTimedOut(true));
//                 dispatch(removeDepositQRData());
//                 dispatch(removeCreatedTime())
//                 dispatch(removeExpireTime())
//                 clearInterval(timer);
//             }
//         };

//         updateTimer();
//         const timer = setInterval(updateTimer, 1000);
//         return () => clearInterval(timer);
//     }, [dispatch, createdTime, expireTime]);

//     const formatTime = (seconds) => {
//         const m = String(Math.floor(seconds / 60)).padStart(2, '0');
//         const s = String(seconds % 60).padStart(2, '0');
//         return `${m}:${s}`;
//     };

//     if (!createdTime || !expireTime) return null;

//     return (
//         <Box sx={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
//             <Typography>Time Left:</Typography>
//             <Typography fontSize={"1.2rem"} fontWeight={600} color={hasTimedOut ? 'error' : 'text.primary'}>
//                 {hasTimedOut ? 'Time Out' : formatTime(timeLeft)}
//             </Typography>
//         </Box>
//     );
// }

// export default CountdownTimer;