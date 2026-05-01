import { useClosedOrderListQuery } from "../globalState/trade/tradeApis";
import { initiatePositionSocketConnection } from "../socketENV/positionSocketENV";
import { useEffect, useRef } from "react";

const useDynamicQuery = (active, activeMT5AccountPositionsDetails, token, login) => {

    const socketRef = useRef()

    const queryArgs = {
        login
    };

    const closedOrderQuery = useClosedOrderListQuery(queryArgs);

    useEffect(() => {
        if (!login || !token) return;

        if (socketRef.current) {
            socketRef.current.disconnect();
        }

        socketRef.current = initiatePositionSocketConnection({
            login,
            token
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [active, login, token]);


    const queryResults = {
        "Open": activeMT5AccountPositionsDetails,
        "Closed": closedOrderQuery,
    };

    return queryResults[active] ?? { data: [], isLoading: false, isError: false, error: [] };
};

export default useDynamicQuery;