// import io from 'socket.io-client';

// export function initiateQuotesSocketConnection({ token, handleQuoteData, symbol }) {

//     const socket = io(import.meta.env.VITE_BASE_URL, {
//         autoConnect: false,
//         extraHeaders: {
//             authorization: token
//         }
//     });

//     socket.connect();

//     const quotesData = {};

//     // symbol.forEach(sym => {
//     // socket.on(`quote:${sym}`, (data) => {
//     //     quotesData[sym] = data;
//     //     handleQuoteData(Object.values(quotesData));
//     //     console.log(quotesData)
//     // });
//     socket.on("quotes", (data) => {
//         if (data) {
//             handleQuoteData(data);
//         }
//     });
//     // });

//     return socket;
// }



















// src/hooks/useQuotesSocket.js
import { useEffect, useRef } from "react";
import io from "socket.io-client";
import { useSelector } from "react-redux";

let socketInstance = null; // ✅ Shared across components
let listenerCount = 0;

export function useQuotesSocket(handleQuoteData) {
    const { token } = useSelector((state) => state.auth);
    const handleQuoteDataRef = useRef(handleQuoteData);

    // Keep the latest callback
    useEffect(() => {
        handleQuoteDataRef.current = handleQuoteData;
    }, [handleQuoteData]);

    useEffect(() => {
        if (!token) return;
        listenerCount++;

        if (!socketInstance) {
            // console.log("🟢 Creating new quote socket");
            socketInstance = io(`${import.meta.env.VITE_QUOTE_SERVICE_URL}`, {
                extraHeaders: {
                    authorization: token
                }
            });

            socketInstance.on("quotes", (data) => {
                handleQuoteDataRef.current?.(data);
            });
        } else {
            // console.log("✅ Using existing quote socket");
            socketInstance.on("quotes", (data) => {
                handleQuoteDataRef.current?.(data);
            });
        }

        return () => {
            listenerCount--;
            if (listenerCount <= 0 && socketInstance) {
                // console.log("🔴 Disconnecting quote socket");
                socketInstance.disconnect();
                socketInstance = null;
            }
        };
    }, [token]);
}