// import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// const baseQuery = fetchBaseQuery({
//     baseUrl: `${import.meta.env.VITE_BASE_URL}`,
//     credentials: 'include',
// });

// const baseQueryWithReauth = async (args, api, extraOptions) => {
//     let result = await baseQuery(args, api, extraOptions);

//     if (result?.error?.status === 401) {

//         const refreshResult = await baseQuery('/auth/refresh-token', api, extraOptions);

//         if (refreshResult?.error) {
//             api.dispatch(logout());
//             return refreshResult;
//         } else {
//             result = await baseQuery(args, api, extraOptions);
//         }
//     }

//     return result;
// };

// export default baseQueryWithReauth;



import { logout, setMFAData, setResendOtpCreatedTime, setResendOtpExpiryTime, setTokenExpTime } from './authSlice';
import {
    removeDepositQRData,
    removeCreatedTime,
    removeExpireTime,
    setHasStarted
} from '../paymentState/paymentSlice';
import { setBanner } from '../otherContentState/otherContentStateSlice';
import { setHideBalance } from '../profileState/profileStateSlices';
import { setRequestStatus } from '../ibState/ibStateSlice';
import { setActiveMT5AccountDetails, setActiveMT5AccountLogin, setActiveMT5AccountType, setActiveMT5AccountPositionsDetails } from "../mt5State/mt5StateSlice"
import { disconnectAuthSocket } from '../../socketENV/authSocketENV';
import { setSelectedSymbol } from "../terminalState/terminalSlice"

export const logoutThunk = () => (dispatch) => {
    disconnectAuthSocket()
    dispatch(logout());

    dispatch(removeDepositQRData());
    dispatch(removeCreatedTime());
    dispatch(removeExpireTime());
    dispatch(setTokenExpTime(null))
    dispatch(setBanner(false))
    dispatch(setMFAData(null))
    dispatch(setResendOtpCreatedTime(null))
    dispatch(setResendOtpExpiryTime(null))
    dispatch(setHideBalance(false))
    dispatch(setRequestStatus(false))
    dispatch(setActiveMT5AccountLogin(""))
    dispatch(setActiveMT5AccountDetails(null))
    dispatch(setActiveMT5AccountPositionsDetails(null))
    dispatch(setActiveMT5AccountType(""))
    dispatch(setSelectedSymbol(null))
    dispatch(setHasStarted(false))

    localStorage.removeItem("mt5-active-account")

};