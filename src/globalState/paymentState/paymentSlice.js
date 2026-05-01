import { createSlice } from '@reduxjs/toolkit';

const safeParse = (key) => {
    try {
        const item = localStorage.getItem(key);
        if (!item || item === "undefined" || item === "null") return null;
        return JSON.parse(item);
    } catch {
        return null;
    }
};

const initialState = {
    depositQRData: safeParse("depositQRData"),
    depositState: localStorage.getItem("depositState") || null,
    selectedReferralCode: localStorage.getItem("selectedReferralCode") || null,
    createdTime: parseInt(localStorage.getItem("created_time")) || null,
    expireTime: parseInt(localStorage.getItem("expire_time")) || null,
    hasStarted: localStorage.getItem("hasStarted") || false
};

const paymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {
        setHasStarted: (state, action) => {
            if (action?.payload) {
                state.hasStarted = action.payload
                localStorage.setItem("hasStarted", action?.payload);
            } else {
                state.hasStarted = false
                localStorage.removeItem("hasStarted");
            }
        },
        setDepositQRData: (state, action) => {
            const value = action.payload ?? null;
            state.depositQRData = value;
            localStorage.setItem("depositQRData", JSON.stringify(value));
        },
        setDepositState: (state, action) => {
            state.depositState = action.payload;
            localStorage.setItem("depositState", action.payload);
        },
        setCreatedTime: (state, action) => {
            state.createdTime = action.payload;
            localStorage.setItem("created_time", action.payload);
        },
        setExpireTime: (state, action) => {
            state.expireTime = action.payload;
            localStorage.setItem("expire_time", action.payload);
        },
        removeDepositQRData: (state) => {
            state.depositQRData = null;
            localStorage.removeItem("depositQRData");
        },
        removeCreatedTime: (state, action) => {
            state.createdTime = null;
            localStorage.removeItem("created_time");
        },
        removeExpireTime: (state, action) => {
            state.expireTime = null;
            localStorage.removeItem("expire_time");
        },
        setSelectedReferralCode: (state, action) => {
            localStorage.setItem("selectedReferralCode", action.payload)
            state.selectedReferralCode = action.payload
        }
    }
});

export const {
    setDepositState,
    setDepositQRData,
    removeDepositQRData,
    removeCreatedTime,
    removeExpireTime,
    setSelectedReferralCode,
    setCreatedTime,
    setExpireTime,
    setHasStarted
} = paymentSlice.actions;
export default paymentSlice.reducer;