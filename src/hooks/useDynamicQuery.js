import { useClosedOrderListQuery, useOpenOrderListQuery } from "../globalState/trade/tradeApis";
import { initiatePositionSocketConnection } from "../socketENV/positionSocketENV";
import { useEffect, useRef } from "react";

const useDynamicQuery = (active, activeMT5AccountPositionsDetails, token, login) => {

    const socketRef = useRef();

    const queryArgs = { login };

    const closedOrderQuery = useClosedOrderListQuery(queryArgs, { skip: !login || active !== "history" });
    const openOrderQuery = useOpenOrderListQuery(queryArgs, { skip: !login || active !== "pending" });

    useEffect(() => {
        if (!login || !token) return;
        socketRef.current?.disconnect();
        socketRef.current = initiatePositionSocketConnection({ login, token });
        return () => socketRef.current?.disconnect();
    }, [login, token]);

    const queryResults = {
        "market": { data: [], isLoading: false, isError: false },
        "positions": { data: activeMT5AccountPositionsDetails, isLoading: false, isError: false },
        "history": closedOrderQuery,
        "pending": openOrderQuery,
    };

    return queryResults[active] ?? { data: [], isLoading: false, isError: false };
};

export default useDynamicQuery;
