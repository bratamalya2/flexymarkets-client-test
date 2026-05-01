import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    token: localStorage.getItem('token') || null,
    tempToken: localStorage.getItem('tempToken') || null,
    tokenExpTime: JSON.parse(localStorage.getItem("tokenExpTime")) || null,
    // userData: JSON.parse(localStorage.getItem("userData")) || null,
    emailOnOTPSent: "",
    selectedContactForOtp: "",
    mfaData: JSON.parse(localStorage.getItem("mfaData")) || null,
    resendOtpCreatedTime: JSON.parse(localStorage.getItem("resendOtpCreatedTime")) || null,
    resendOtpExpiryTime: JSON.parse(localStorage.getItem("resendOtpExpiryTime")) || null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.token = action.payload;
            localStorage.setItem('token', action.payload);
        },
        logout: (state) => {
            state.token = null;
            localStorage.removeItem("token");
        },
        setTempToken: (state, action) => {
            if (action.payload) {
                state.tempToken = action.payload
                localStorage.setItem('tempToken', action.payload);
            } else {
                state.tempToken = action.payload
                localStorage.removeItem('tempToken');
            }
        },
        // setUserData: (state, action) => {
        //     state.userData = action.payload;
        //     localStorage.setItem("userData", JSON.stringify(action.payload));
        // },
        initializeAuth: (state) => {
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                state.token = storedToken;
            }
        },
        setEmailOnOTPSent: (state, action) => {
            state.emailOnOTPSent = action.payload
        },
        setMFAData: (state, action) => {
            if (action.payload) {
                localStorage.setItem("mfaData", JSON.stringify(action.payload));
                state.mfaData = action.payload
            } else {
                localStorage.removeItem("mfaData");
            }
        },
        setTokenExpTime: (state, action) => {
            if (action.payload) {
                localStorage.setItem("tokenExpTime", JSON.stringify(action.payload))
                state.tokenExpTime = action.payload
            } else {
                localStorage.removeItem("tokenExpTime")
            }
        },
        setResendOtpCreatedTime: (state, action) => {
            if (action.payload) {
                localStorage.setItem("resendOtpCreatedTime", JSON.stringify(action.payload))
                state.resendOtpCreatedTime = action.payload
            } else {
                localStorage.removeItem("resendOtpCreatedTime")
                state.resendOtpCreatedTime = action.payload
            }
        },
        setResendOtpExpiryTime: (state, action) => {
            if (action.payload) {
                localStorage.setItem("resendOtpExpiryTime", JSON.stringify(action.payload))
                state.resendOtpExpiryTime = action.payload
            } else {
                localStorage.removeItem("resendOtpExpiryTime")
                state.resendOtpExpiryTime = action.payload
            }
        }
    },
});

export const {
    login,
    logout,
    setUserData,
    initializeAuth,
    setSelectedContactForOtp,
    setTempToken,
    setEmailOnOTPSent,
    setMFAData,
    setTokenExpTime,
    setResendOtpCreatedTime,
    setResendOtpExpiryTime
} = authSlice.actions;
export default authSlice.reducer;