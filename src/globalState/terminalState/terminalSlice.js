import { createSlice } from '@reduxjs/toolkit';

const defaultSettings = {
    upColor: '#16a085',
    downColor: '#ef334e',
    showVertLines: true,
    showHorzLines: true,
    gridColor: 'rgba(15,23,42,0.08)',
    backgroundColor: '#ffffff',
    textColor: '#344054'
};

const safeJsonParse = (key, fallback) => {
    try {
        const item = localStorage.getItem(key);
        if (!item) return fallback;
        return JSON.parse(item);
    } catch {
        const item = localStorage.getItem(key);
        return item || fallback;
    }
};

const initialState = {
    selectedSymbol: safeJsonParse("selectedSymbol", null),
    chartSettings: safeJsonParse("chartSettings", defaultSettings)
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
