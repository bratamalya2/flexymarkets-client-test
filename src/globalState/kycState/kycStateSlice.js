import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    kycStep: "emailVerification",
    mobileOnOtpSent: localStorage.getItem("mobileOnOtpSent") || "",
    emailOnOtpSentKyc: localStorage.getItem("emailOnOtpSentKyc") || ""
};

const kycStateSlice = createSlice({
    name: 'kyc',
    initialState,
    reducers: {
        setKycStep: (state, action) => {
            state.kycStep = action.payload;
        },
        setMobileOnOtpSent: (state, action) => {
            state.mobileOnOtpSent = action.payload
            localStorage.setItem("mobileOnOtpSent", action.payload)
        },
        removeMobileOnOtpSent: (state, action) => {
            state.mobileOnOtpSent = action.payload;
            localStorage.removeItem("mobileOnOtpSent");
        },
        setEmailOnOtpSentKyc: (state, action) => {
            state.emailOnOtpSentKyc = action.payload
            localStorage.setItem("emailOnOtpSentKyc", action.payload)
        },
        removeEmailOnOtpSentKyc: (state, action) => {
            state.emailOnOtpSentKyc = action.payload;
            localStorage.removeItem("emailOnOtpSentKyc");
        }
    }
});

export const {
    setKycStep,
    setMobileOnOtpSent,
    removeMobileOnOtpSent,
    setEmailOnOtpSentKyc,
    removeEmailOnOtpSentKyc
} = kycStateSlice.actions;
export default kycStateSlice.reducer;