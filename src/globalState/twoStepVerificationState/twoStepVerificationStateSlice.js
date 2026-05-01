import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    twoStepVerificationStep: localStorage.getItem("twoStepVerificationStep") || "emailOtp",
    // mobileOnOtpSent: localStorage.getItem("mobileOnOtpSent") || "",
    // emailOnOtpSentKyc: localStorage.getItem("emailOnOtpSentKyc") || ""
};

const twoStepVerificationStateSlice = createSlice({
    name: 'twoStepVerification',
    initialState,
    reducers: {
        setTwoStepVerificationStep: (state, action) => {
            state.kycStep = action.payload;
            localStorage.setItem("kycStep", action.payload);
        },
        // setMobileOnOtpSent: (state, action) => {
        //     state.mobileOnOtpSent = action.payload
        //     localStorage.setItem("mobileOnOtpSent", action.payload)
        // },
        // removeMobileOnOtpSent: (state, action) => {
        //     state.mobileOnOtpSent = action.payload;
        //     localStorage.removeItem("mobileOnOtpSent");
        // },
        // setEmailOnOtpSentKyc: (state, action) => {
        //     state.emailOnOtpSentKyc = action.payload
        //     localStorage.setItem("emailOnOtpSentKyc", action.payload)
        // },
        // removeEmailOnOtpSentKyc: (state, action) => {
        //     state.emailOnOtpSentKyc = action.payload;
        //     localStorage.removeItem("emailOnOtpSentKyc");
        // }
    }
});

export const {
    setTwoStepVerification,
    // setMobileOnOtpSent,
    // removeMobileOnOtpSent,
    // setEmailOnOtpSentKyc,
    // removeEmailOnOtpSentKyc
} = twoStepVerificationStateSlice.actions;
export default twoStepVerificationStateSlice.reducer;