import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isRequestSent: localStorage.getItem("isRequestSent") || false,
    selectedReferralCode: localStorage.getItem("selectedReferralCode") || null,
};

const ibStateSlice = createSlice({
    name: 'ib',
    initialState,
    reducers: {
        setRequestStatus: (state, action) => {
            if (action.payload) {
                state.isRequestSent = action.payload;
                localStorage.setItem("isRequestSent", action.payload);
            } else {
                state.isRequestSent = action.payload;
                localStorage.removeItem("isRequestSent");
            }
        },
        setSelectedReferralCode: (state, action) => {
            localStorage.setItem("selectedReferralCode", action.payload)
            state.selectedReferralCode = action.payload
        },
    }
});

export const { setRequestStatus, setSelectedReferralCode } = ibStateSlice.actions;
export default ibStateSlice.reducer;