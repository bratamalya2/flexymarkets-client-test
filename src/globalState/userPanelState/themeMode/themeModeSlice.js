import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedTheme: localStorage.getItem("theme") || "light"
};

const themeModeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        setThemeMode: (state, action) => {
            state.selectedTheme = action.payload;
            localStorage.setItem("theme", action.payload);
        }
    }
});

export const { setThemeMode } = themeModeSlice.actions;
export default themeModeSlice.reducer;