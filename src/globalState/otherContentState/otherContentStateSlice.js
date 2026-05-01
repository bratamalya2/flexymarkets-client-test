import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    banner: localStorage.getItem("banner") || false
};

const otherContentStateSlice = createSlice({
    name: 'otherContent',
    initialState,
    reducers: {
        setBanner: (state, action) => {
            if (action.payload) {
                state.banner = action.payload
                localStorage.setItem("banner", action.payload)
            } else {
                state.banner = null
                localStorage.removeItem("banner")
            }
        }
    }
});

export const { setRole, setBanner } = otherContentStateSlice.actions;
export default otherContentStateSlice.reducer;