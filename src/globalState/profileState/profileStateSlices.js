import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    profileVerificationStep: localStorage.getItem("profileVerificationStep") || "stepListing",
    mobileOnOtpSent: localStorage.getItem("mobileOnOtpSent") || "",
    hideBalance: localStorage.getItem("hideBalance") || false
};

const profileStateSlices = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setProfileVerificationStep: (state, action) => {
            state.kycStep = action.payload;
            localStorage.setItem("profileVerificationStep", action.payload);
        },
        setMobileOnOtpSent: (state, action) => {
            state.mobileOnOtpSent = action.payload
            localStorage.setItem("mobileOnOtpSent", action.payload)
        },
        removeMobileOnOtpSent: (state, action) => {
            state.mobileOnOtpSent = action.payload;
            localStorage.removeItem("mobileOnOtpSent");
        },
        setHideBalance: (state, action) => {
            if (action.payload) {
                state.hideBalance = action.payload
                localStorage.setItem("hideBalance", action.payload)
            } else {
                state.hideBalance = action.payload
                localStorage.removeItem("hideBalance")
            }
        }
    }
});

export const {
    setProfileVerificationStep,
    setMobileOnOtpSent,
    removeMobileOnOtpSent,
    setHideBalance
} = profileStateSlices.actions;
export default profileStateSlices.reducer;