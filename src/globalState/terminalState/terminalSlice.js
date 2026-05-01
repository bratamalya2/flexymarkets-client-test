import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedSymbol: JSON.parse(localStorage.getItem("selectedSymbol")) ||
        { name: "XAUUSD", img1: "/symbol_logo/XAUUSD.svg", img2: "/symbol_logo/USD.svg", groupedSym: "XAUUSD" },
};

const terminalSlice = createSlice({
    name: 'terminalSlice',
    initialState,
    reducers: {
        setSelectedSymbol: (state, action) => {
            if (action.payload) {
                state.selectedSymbol = action.payload
                localStorage.setItem("selectedSymbol", JSON.stringify(action.payload))
            } else {
                state.selectedSymbol = action.payload
                localStorage.removeItem("selectedSymbol")
            }
        }
    }
});

export const {
    setSelectedSymbol
} = terminalSlice.actions;
export default terminalSlice.reducer;