import { configureStore } from '@reduxjs/toolkit';
import themeModeSlice from "./userPanelState/themeMode/themeModeSlice";
import myClientsSlice from "./userPanelState/myClientsState/myClientsSlice";
import myAccountSlice from "./userPanelState/myAccountState/myAccountSlice";
import notificationStateSlice from "./notificationState/notificationStateSlice";
import kycStateSlice from "./kycState/kycStateSlice";
import authSlice from "./auth/authSlice"
import ibStateSlice from './ibState/ibStateSlice';
import profileStateSlices from "./profileState/profileStateSlices"
import twoStepVerificationStateSlice from "./twoStepVerificationState/twoStepVerificationStateSlice"
import paymentSlice from "./paymentState/paymentSlice"
import mt5StateSlice from "./mt5State/mt5StateSlice"
import otherContentStateSlice from "./otherContentState/otherContentStateSlice"
import terminalSlice from "./terminalState/terminalSlice"
import { allApiSlices } from './apiRegistry';
import listenerMiddleware from './listenerMiddleware';


const apiReducers = allApiSlices.reduce((acc, api) => {
    acc[api.reducerPath] = api.reducer;
    return acc;
}, {});


const store = configureStore({
    reducer: {
        themeMode: themeModeSlice,
        myClientLevel: myClientsSlice,
        myAccount: myAccountSlice,
        notification: notificationStateSlice,
        auth: authSlice,
        ib: ibStateSlice,
        kyc: kycStateSlice,
        profile: profileStateSlices,
        payment: paymentSlice,
        mt5: mt5StateSlice,
        twoStepVerification: twoStepVerificationStateSlice,
        otherContent: otherContentStateSlice,
        terminal: terminalSlice,
        ...apiReducers,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().prepend(listenerMiddleware.middleware).concat(
            ...allApiSlices.map(api => api.middleware)
        );
    }
});

export default store;