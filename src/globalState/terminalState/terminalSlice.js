import { createSlice } from '@reduxjs/toolkit';

const defaultSettings = {
    upColor: '#4CAF50',
    downColor: '#f44336',
    showVertLines: true,
    showHorzLines: true,
    gridColor: 'rgba(255,255,255,0.04)',
    backgroundColor: '#0F0F0F',
    textColor: '#9ca3af'
};

const initialState = {
    selectedSymbol: JSON.parse(localStorage.getItem("selectedSymbol")) || null,
    chartSettings: JSON.parse(localStorage.getItem("chartSettings")) || defaultSettings
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
        },
        setChartSettings: (state, action) => {
            state.chartSettings = {
                ...state.chartSettings,
                ...action.payload
            };
            localStorage.setItem("chartSettings", JSON.stringify(state.chartSettings));
        },
        resetChartSettings: (state) => {
            state.chartSettings = defaultSettings;
            localStorage.setItem("chartSettings", JSON.stringify(defaultSettings));
        }
    }
});

export const {
    setSelectedSymbol,
    setChartSettings,
    resetChartSettings
} = terminalSlice.actions;
export default terminalSlice.reducer;