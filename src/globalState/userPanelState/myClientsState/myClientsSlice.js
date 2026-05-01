import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    level: "Client Level 1"
};

const myClientsSlice = createSlice({
    name: "Clients",
    initialState,
    reducers: {
        setClientLevel: (state, action) => {
            state.level = action.payload;
            localStorage.setItem("theme", action.payload);
        }
    }
});

export const { setClientLevel } = myClientsSlice.actions;
export default myClientsSlice.reducer;