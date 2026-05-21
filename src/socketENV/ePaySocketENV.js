import io from 'socket.io-client';

export function initiateEPaySocketConnection({ token, payload, dispatch, refetch, handleRedirectUrl }) {

    const socket = io(import.meta.env.VITE_BASE_URL, {
        autoConnect: false,
        extraHeaders: {
            authorization: token
        }
    });

    socket.connect();

    socket.on('connect', () => {
        if (payload) {
            socket.emit('cardPayment', { ...payload });
        }
    }
    );

    socket.on('cardPaymentReady', (data) => {
        if (data && data?.result?.status == 'success') {
            handleRedirectUrl(data?.result?.redirectUrl)
        }
    });

    return socket;
}