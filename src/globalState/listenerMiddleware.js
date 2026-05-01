import { createListenerMiddleware } from '@reduxjs/toolkit';
import { logout } from './auth/authSlice';
import { allApiSlices } from './apiRegistry';

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
    actionCreator: logout,
    effect: (_action, listenerApi) => {
        for (const apiSlice of allApiSlices) {
            listenerApi.dispatch(apiSlice.util.resetApiState())
        }
    }
});

export default listenerMiddleware;