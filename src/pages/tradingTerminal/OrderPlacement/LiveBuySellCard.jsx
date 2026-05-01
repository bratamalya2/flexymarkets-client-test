// import { Typography } from "@mui/material";
// import Grid from "@mui/material/Grid2";
// import { useSelector } from "react-redux";
// import { useRef, useState, useEffect, useCallback } from "react";
// import { initiateQuotesSocketConnection } from "../../../socketENV/quotesSocketENV";

// function LiveBuySellCard({ value, onChange, handleOpenPrice, activeTradeType }) {

//     const { selectedSymbol } = useSelector((state) => state.terminal);
//     const { token } = useSelector((state) => state.auth);
//     const socketRef = useRef(null);

//     const [activeSymbolData, setActiveSymbolData] = useState(null);

//     const handleQuoteData = useCallback((data) => {
//         if (!selectedSymbol?.name) return;
//         const selectedSymbolData = data.find(ele => ele?.Symbol === selectedSymbol?.name);
//         setActiveSymbolData(selectedSymbolData);
//     }, [selectedSymbol?.name]);


//     useEffect(() => {
//         if (!token) return;

//         if (socketRef.current) {
//             socketRef.current.disconnect();
//             setActiveSymbolData(null);
//         }

//         socketRef.current = initiateQuotesSocketConnection({
//             token,
//             handleQuoteData,
//         });

//         return () => {
//             if (socketRef.current) {
//                 socketRef.current.disconnect();
//             }
//         };
//     }, [token, handleQuoteData]);

//     const sellPrice = activeSymbolData?.Bid;
//     const buyPrice = activeSymbolData?.Ask;

//     const formatPrice = (price) => {
//         if (price === undefined || price === null) return ["--", "--"];
//         const fixed = Number(price).toFixed(2);
//         const [int, decimal] = fixed.split(".");
//         return [int, decimal];
//     };

//     const [sellInt, sellDec] = formatPrice(sellPrice);
//     const [buyInt, buyDec] = formatPrice(buyPrice);

//     const handleSelectBuyOrSell = (value) => {
//         if ((value == "BUY" && activeTradeType == "Market")) {
//             onChange("0")
//         } else if ((value == "BUY" && activeTradeType == "Pending")) {
//             onChange("2")
//         } else if ((value == "SELL" && activeTradeType == "Market")) {
//             onChange("1")
//         } else if ((value == "SELL" && activeTradeType == "Pending")) {
//             onChange("3")
//         }
//         if (activeTradeType == "Pending") {
//             handleOpenPrice((value === "SELL") ? sellPrice : buyPrice)
//         }
//     }

//     // useEffect(() => {
//     //     if (value === "BUY") {
//     //         if (buyPrice) handleOpenPrice(buyPrice);
//     //     } else if (value === "SELL") {
//     //         if (sellPrice) handleOpenPrice(sellPrice);
//     //     }
//     // }, [buyPrice, sellPrice, value]);

//     return (
//         <Grid container xs={12} my={"5px"} spacing={"5px"}>
//             <Grid
//                 size={{ xs: 6 }}
//                 sx={{
//                     border: "1px solid red",
//                     height: "70px",
//                     borderRadius: "5px",
//                     p: "12px",
//                     cursor: "pointer",
//                     bgcolor: (value === "1" || value === 1 || value === "3" || value === 3) && "red"
//                 }}
//                 onClick={() => handleSelectBuyOrSell("SELL")}
//             >
//                 <Typography fontSize={"13px"} color={(value === "1" || value === 1 || value === "3" || value === 3) ? "white" : "red"}>
//                     Sell
//                 </Typography>
//                 <Typography fontSize={"13px"} color={(value === "1" || value === 1 || value === "3" || value === 3) ? "white" : "red"}>
//                     {sellInt}.
//                     <Typography component="span" fontSize="20px" color={(value === "1" || value === 1 || value === "3" || value === 3) ? "white" : "red"}>
//                         {sellDec}
//                     </Typography>
//                 </Typography>
//             </Grid>

//             <Grid
//                 size={{ xs: 6 }}
//                 sx={{
//                     border: "1px solid green",
//                     height: "70px",
//                     borderRadius: "5px",
//                     p: "12px",
//                     textAlign: "right",
//                     cursor: "pointer",
//                     bgcolor: ((value === "0" || value === 0 || value === "2" || value === 2)) && "green"
//                 }}
//                 onClick={() => handleSelectBuyOrSell("BUY")}
//             >
//                 <Typography fontSize={"13px"} color={((value === "0" || value === 0 || value === "2" || value === 2)) ? "white" : "green"}>
//                     Buy
//                 </Typography>
//                 <Typography fontSize={"13px"} color={(value === "0" || value === 0 || value === "2" || value === 2) ? "white" : "green"}>
//                     {buyInt}.
//                     <Typography component="span" fontSize="20px" color={(value === "0" || value === 0 || value === "2" || value === 2) ? "white" : "green"}>
//                         {buyDec}
//                     </Typography>
//                 </Typography>
//             </Grid>
//         </Grid>
//     );
// }

// export default LiveBuySellCard;



















import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useSelector } from "react-redux";
import { useState, useCallback } from "react";
import { useQuotesSocket } from "../../../socketENV/quotesSocketENV";

function LiveBuySellCard({ value, onChange, handleOpenPrice, activeTradeType }) {
    const { selectedSymbol } = useSelector((state) => state.terminal);
    const [activeSymbolData, setActiveSymbolData] = useState(null);

    // ✅ Handle incoming quote updates
    const handleQuoteData = useCallback(
        (data) => {
            if (!selectedSymbol?.name || !Array.isArray(data)) return;
            const selectedSymbolData = data.find(
                (ele) => ele?.Symbol === selectedSymbol?.name
            );
            setActiveSymbolData(selectedSymbolData);
        },
        [selectedSymbol?.name]
    );

    // ✅ Initialize global shared quote socket (no manual connect/disconnect)
    useQuotesSocket(handleQuoteData);

    const sellPrice = activeSymbolData?.Bid;
    const buyPrice = activeSymbolData?.Ask;

    const formatPrice = (price) => {
        if (price === undefined || price === null) return ["--", "--"];
        const fixed = Number(price).toFixed(2);
        const [int, decimal] = fixed.split(".");
        return [int, decimal];
    };

    const [sellInt, sellDec] = formatPrice(sellPrice);
    const [buyInt, buyDec] = formatPrice(buyPrice);

    const handleSelectBuyOrSell = (type) => {
        if (type === "BUY") {
            onChange(activeTradeType === "Market" ? "0" : "2");
            if (activeTradeType === "Pending") handleOpenPrice(buyPrice);
        } else {
            onChange(activeTradeType === "Market" ? "1" : "3");
            if (activeTradeType === "Pending") handleOpenPrice(sellPrice);
        }
    };

    return (
        <Grid container xs={12} my={"5px"} spacing={"5px"}>
            {/* SELL Button */}
            <Grid
                size={{ xs: 6 }}
                sx={{
                    border: "1px solid red",
                    height: "70px",
                    borderRadius: "5px",
                    p: "12px",
                    cursor: "pointer",
                    bgcolor:
                        (value === "1" || value === 1 || value === "3" || value === 3) &&
                        "red",
                }}
                onClick={() => handleSelectBuyOrSell("SELL")}
            >
                <Typography
                    fontSize={"13px"}
                    color={
                        value === "1" || value === 1 || value === "3" || value === 3
                            ? "white"
                            : "red"
                    }
                >
                    Sell
                </Typography>
                <Typography
                    fontSize={"13px"}
                    color={
                        value === "1" || value === 1 || value === "3" || value === 3
                            ? "white"
                            : "red"
                    }
                >
                    {sellInt}.
                    <Typography
                        component="span"
                        fontSize="20px"
                        color={
                            value === "1" || value === 1 || value === "3" || value === 3
                                ? "white"
                                : "red"
                        }
                    >
                        {sellDec}
                    </Typography>
                </Typography>
            </Grid>

            {/* BUY Button */}
            <Grid
                size={{ xs: 6 }}
                sx={{
                    border: "1px solid green",
                    height: "70px",
                    borderRadius: "5px",
                    p: "12px",
                    textAlign: "right",
                    cursor: "pointer",
                    bgcolor:
                        value === "0" || value === 0 || value === "2" || value === 2
                            ? "green"
                            : undefined,
                }}
                onClick={() => handleSelectBuyOrSell("BUY")}
            >
                <Typography
                    fontSize={"13px"}
                    color={
                        value === "0" || value === 0 || value === "2" || value === 2
                            ? "white"
                            : "green"
                    }
                >
                    Buy
                </Typography>
                <Typography
                    fontSize={"13px"}
                    color={
                        value === "0" || value === 0 || value === "2" || value === 2
                            ? "white"
                            : "green"
                    }
                >
                    {buyInt}.
                    <Typography
                        component="span"
                        fontSize="20px"
                        color={
                            value === "0" || value === 0 || value === "2" || value === 2
                                ? "white"
                                : "green"
                        }
                    >
                        {buyDec}
                    </Typography>
                </Typography>
            </Grid>
        </Grid>
    );
}

export default LiveBuySellCard;
