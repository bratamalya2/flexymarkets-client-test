import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getQuotesSocket } from "../socketENV/quotesSocketENV";

const QuotesContext = createContext(null);

export const QuotesProvider = ({ children }) => {
    const { token } = useSelector((state) => state.auth);
    const [quoteData, setQuoteData] = useState([]);
    const socketRef = useRef(null);

    useEffect(() => {
        if (!token) return;

        const socket = getQuotesSocket(token);
        socketRef.current = socket;

        if (!socket.connected) {
            socket.connect();
        }

        const handleQuotes = (data) => {
            if (data) {
                setQuoteData(data);
            }
        };

        socket.on("quotes", handleQuotes);

        return () => {
            socket.off("quotes", handleQuotes);
        };
    }, [token]);

    return (
        <QuotesContext.Provider value={{ quoteData }}>
            {children}
        </QuotesContext.Provider>
    );
};

export const useQuotes = () => {
    const context = useContext(QuotesContext);
    if (!context) {
        throw new Error("useQuotes must be used within a QuotesProvider");
    }
    return context;
};
