import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  open: false,
  message: '',
  severity: 'success',
};

const notificationStateSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification: (state, action) => {
      return { ...state, ...action.payload };
    },
    clearNotification: (state) => {
      return { ...state, open: false };
    }
  }
});

export const { setNotification, clearNotification } = notificationStateSlice.actions;
export default notificationStateSlice.reducer;