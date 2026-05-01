import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    activeMT5AccountLogin: localStorage.getItem("activeMT5Login") || "",
    activeMT5AccountType: localStorage.getItem("activeMT5AccountType") || "Real",
    activeMT5AccountDetails: null,
    activeMT5AccountPositionsDetails: null
};

const mt5StateSlice = createSlice({
    name: 'mt5Slice',
    initialState,
    reducers: {
        setActiveMT5AccountLogin: (state, action) => {
            if (action.payload) {
                localStorage.setItem("activeMT5Login", action.payload)
                state.activeMT5AccountLogin = action.payload;
            } else {
                localStorage.removeItem("activeMT5Login")
                state.activeMT5AccountLogin = action.payload;
            }
        },
        setActiveMT5AccountType: (state, action) => {
            if (action.payload) {
                localStorage.setItem("activeMT5AccountType", action.payload)
                state.activeMT5AccountType = action.payload;
            } else {
                localStorage.removeItem("activeMT5AccountType")
                state.activeMT5AccountType = action.payload;
            }
        },
        setActiveMT5AccountDetails: (state, action) => {
            // if (action.payload) {
            //     localStorage.setItem("activeMT5AccountDetails", JSON.stringify(action.payload))
            state.activeMT5AccountDetails = action.payload
            // } else {
            //     localStorage.removeItem("activeMT5AccountDetails")
            //     state.activeMT5AccountDetails = action.payload
            // }
        },
        setActiveMT5AccountPositionsDetails: (state, action) => {
            // if (action.payload) {
            //     localStorage.setItem("activeMT5AccountDetails", JSON.stringify(action.payload))
            state.activeMT5AccountPositionsDetails = action.payload
            // } else {
            //     localStorage.removeItem("activeMT5AccountDetails")
            //     state.activeMT5AccountDetails = action.payload
            // }
        }
    }
});

export const {
    setActiveMT5AccountLogin,
    setActiveMT5AccountType,
    setActiveMT5AccountDetails,
    setActiveMT5AccountPositionsDetails
} = mt5StateSlice.actions;
export default mt5StateSlice.reducer;