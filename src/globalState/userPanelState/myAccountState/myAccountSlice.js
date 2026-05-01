import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    // myAccountType: localStorage.getItem("accountType") || "Real",
    myAccountLayout: localStorage.getItem("accountLayout") || "list",
    accountOpeningType: localStorage.getItem("accountOpeningType") || "Real",
};

const myAccountSlice = createSlice({
    name: "myAccount",
    initialState,
    reducers: {
        // setMyAccountType: (state, action) => {
        //     state.myAccountType = action.payload;
        //     localStorage.setItem("accountType", action.payload);
        // },
        setMyAccountLayout: (state, action) => {
            state.myAccountLayout = action.payload;
            localStorage.setItem("accountLayout", action.payload);
        },
        setAccountOpeningType: (state, action) => {
            state.accountOpeningType = action.payload;
            // localStorage.setItem("accountOpeningType", action.payload);
        }
    }
});

export const {
    // setMyAccountType, 
    setMyAccountLayout,
    setAccountOpeningType
} = myAccountSlice.actions;
export default myAccountSlice.reducer;