// import { Stack, useMediaQuery } from "@mui/material";
// import { useSelector } from "react-redux";
// import { useRef, useState, useEffect, useCallback } from "react";
// import { initiateQuotesSocketConnection } from "../../socketENV/quotesSocketENV";
// import ModalComponent from "../../components/ModalComponent";
// import OrderPlacementForm from "../../pages/tradingTerminal/OrderPlacement/OrderPlacementForm"


// function TerminalBuySell({ value, onChange, handleOpenPrice, activeTradeType }) {

//     const { selectedSymbol } = useSelector((state) => state.terminal);
//     const { token } = useSelector((state) => state.auth);
//     const socketRef = useRef(null);

//     const [activeSymbolData, setActiveSymbolData] = useState(null);

//     const handleQuoteData = useCallback((data) => {
//         const selectedSymbolData = data.find(ele => ele?.Symbol == selectedSymbol?.name)
//         setActiveSymbolData(selectedSymbolData);
//     }, []);

//     useEffect(() => {
//         if (!token) return;

//         if (socketRef.current) {
//             socketRef.current.disconnect();
//             setActiveSymbolData(null);
//         }

//         socketRef.current = initiateQuotesSocketConnection({
//             token,
//             handleQuoteData,
//             // symbol: [selectedSymbol?.name],
//         });

//         return () => {
//             if (socketRef.current) {
//                 socketRef.current.disconnect();
//             }
//         };
//     }, [token, selectedSymbol, handleQuoteData]);

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

//     // const handleSelectBuyOrSell = (value) => {
//     //     if ((value == "BUY" && activeTradeType == "Market")) {
//     //         onChange("0")
//     //     } else if ((value == "BUY" && activeTradeType == "Pending")) {
//     //         onChange("2")
//     //     } else if ((value == "SELL" && activeTradeType == "Market")) {
//     //         onChange("1")
//     //     } else if ((value == "SELL" && activeTradeType == "Pending")) {
//     //         onChange("3")
//     //     }
//     //     if (activeTradeType == "Pending") {
//     //         handleOpenPrice((value === "SELL") ? sellPrice : buyPrice)
//     //     }
//     // }

//     // useEffect(() => {
//     //     if (value === "BUY") {
//     //         if (buyPrice) handleOpenPrice(buyPrice);
//     //     } else if (value === "SELL") {
//     //         if (sellPrice) handleOpenPrice(sellPrice);
//     //     }
//     // }, [buyPrice, sellPrice, value]);

//     const modalWidth = useMediaQuery('(max-width:600px)');

//     return (
//         <Stack sx={{ flexDirection: "row", width: "240px", gap: "5px" }}>
//             {/* <Stack
//                 sx={{
//                     border: "1px solid red",
//                     gap: "5px",
//                     borderRadius: "5px",
//                     cursor: "pointer",
//                     bgcolor: "red",
//                     width: "100px",
//                     flexDirection: "row",
//                     p: "10px"
//                 }}
//                 onClick={() => handleSelectBuyOrSell("SELL")}
//             > */}
//             <ModalComponent
//                 btnName={`Sell ${sellInt}.${sellDec}`}
//                 Content={OrderPlacementForm}
//                 // contentData={"SELL"}
//                 contentData={{ orderType: "SELL" }}
//                 btnSx={{
//                     bgcolor: "red",
//                     width: "120px",
//                     "&:hover": {
//                         bgcolor: "red",
//                     }
//                 }}
//                 modalWidth={modalWidth ? "95%" : 500}
//             />
//             {/* <Typography fontSize={"13px"} color={"white"}>
//                     Sell
//                 </Typography>
//                 <Typography fontSize={"13px"} color={"white"}>
//                     {sellInt}.
//                     <Typography component="span" fontSize={"13px"} color={"white"}>
//                         {sellDec}
//                     </Typography>
//                 </Typography> */}
//             {/* </Stack> */}

//             {/* <Stack
//                 sx={{
//                     border: "1px solid green",
//                     gap: "5px",
//                     borderRadius: "5px",
//                     textAlign: "right",
//                     cursor: "pointer",
//                     bgcolor: "green",
//                     width: "100px",
//                     flexDirection: "row",
//                     p: "10px"
//                 }}
//                 onClick={() => handleSelectBuyOrSell("BUY")}
//             > */}
//             <ModalComponent
//                 btnName={`Buy ${buyInt}.${buyDec}`}
//                 Content={OrderPlacementForm}
//                 // contentData={"BUY"}
//                 contentData={{ orderType: "BUY" }}
//                 btnSx={{
//                     bgcolor: "green",
//                     width: "120px",
//                     "&:hover": {
//                         bgcolor: "green",
//                     }
//                 }}
//                 modalWidth={modalWidth ? "95%" : 500}
//             />
//             {/* <Typography fontSize={"13px"} color={"white"}>
//                     Buy
//                 </Typography>
//                 <Typography fontSize={"13px"} color={"white"}>
//                     {buyInt}.
//                     <Typography component="span" fontSize={"13px"} color={"white"}>
//                         {buyDec}
//                     </Typography>
//                 </Typography> */}
//             {/* </Stack> */}
//         </Stack>
//     );
// }

// export default TerminalBuySell;






import { Stack, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import { useState, useCallback } from "react";
import { useQuotesSocket } from "../../socketENV/quotesSocketENV";
import ModalComponent from "../../components/ModalComponent";
import OrderPlacementForm from "../../pages/tradingTerminal/OrderPlacement/OrderPlacementForm";

function TerminalBuySell({ value, onChange, handleOpenPrice, activeTradeType }) {
  const { selectedSymbol } = useSelector((state) => state.terminal);
  const [activeSymbolData, setActiveSymbolData] = useState(null);

  // ✅ Handle incoming quote updates
  const handleQuoteData = useCallback(
    (data) => {
      if (!selectedSymbol?.name || !data?.length) return;
      const selectedSymbolData = data.find(
        (ele) => ele?.Symbol === selectedSymbol?.name
      );
      setActiveSymbolData(selectedSymbolData);
    },
    [selectedSymbol?.name]
  );

  // ✅ Initialize the global shared socket
  useQuotesSocket(handleQuoteData);

  // --- Extract prices ---
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

  const modalWidth = useMediaQuery("(max-width:600px)");

  return (
    <Stack sx={{ flexDirection: "row", width: "240px", gap: "5px" }}>
      <ModalComponent
        btnName={`Sell ${sellInt}.${sellDec}`}
        Content={OrderPlacementForm}
        contentData={{ orderType: "SELL" }}
        btnSx={{
          bgcolor: "red",
          width: "120px",
          "&:hover": { bgcolor: "red" },
        }}
        modalWidth={modalWidth ? "95%" : 500}
      />

      <ModalComponent
        btnName={`Buy ${buyInt}.${buyDec}`}
        Content={OrderPlacementForm}
        contentData={{ orderType: "BUY" }}
        btnSx={{
          bgcolor: "green",
          width: "120px",
          "&:hover": { bgcolor: "green" },
        }}
        modalWidth={modalWidth ? "95%" : 500}
      />
    </Stack>
  );
}

export default TerminalBuySell;