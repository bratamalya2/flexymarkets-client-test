// import { Skeleton, Stack } from "@mui/material";
// import Selector from "../../../components/Selector";
// import { useState, useEffect, useRef, useCallback } from "react";
// import { useSelector } from "react-redux";
// import { initiateQuotesSocketConnection } from "../../../socketENV/quotesSocketENV";
// import QuotesTable from "./QuotesTable";


// const symbol = ["AUDJPY", "AUDNZD", "AUDUSD", "AUS200", "CADCHF",
//     "CADJPY", "CHFJPY", "EURAUD", "EURCAD", "EURCHF",
//     "EURGBP", "EURJPY", "EURNZD", "EURUSD", "GBPAUD",
//     "GBPCAD", "GBPCHF", "GBPJPY", "GBPNZD", "GBPUSD",
//     "NZDCAD", "NZDCHF", "NZDJPY", "NZDUSD", "US30",
//     "USDCAD", "USDCHF", "USDJPY", "USDNOK", "XAGUSD",
//     "XAUUSD"]

// function Quotes() {

//     const { token } = useSelector((state) => state.auth);

//     // const [quoteType, setQuoteType] = useState([]);
//     // const [selectedQuoteType, setSelectedQuoteType] = useState("All Quotes");
//     const [quoteData, setQuoteData] = useState(null);

//     const socketRef = useRef(null);

//     // useEffect(() => {
//     //     if (quoteType.length > 0) {
//     //         setSelectedQuoteType(quoteType[0]);
//     //     }
//     // }, []);

//     const handleQuoteData = useCallback((data) => {
//         if (!data) return;

//         // const allType = Object.keys(data);

//         // let filteredData = [];
//         // if (selectedQuoteType === "All Quotes") {
//         //     filteredData = allType.flatMap(type => data[type]?.answer || []);
//         // } else {
//         //     filteredData = data[selectedQuoteType]?.answer || [];
//         // }

//         // setQuoteData(filteredData);
//         // setQuoteType(["All Quotes", ...allType]);
//         setQuoteData(data)
//     }, []);


//     // const handleChangeQuote = (event) => {
//     //     setSelectedQuoteType(event.target.value);
//     // };


//     useEffect(() => {

//         if (!token) return;

//         if (socketRef.current) {
//             socketRef.current.disconnect();
//             setQuoteData(null);
//         }

//         socketRef.current = initiateQuotesSocketConnection({
//             token,
//             handleQuoteData,
//             // symbol
//         });

//         return () => {
//             if (socketRef.current) {
//                 socketRef.current.disconnect();
//             }
//         };
//     }, [token, handleQuoteData]);

//     return (
//         <Stack>
//             {/* {quoteType.length === 0 ? (
//                 <Skeleton height={50} width={200} />
//             ) : (
//                 <Selector
//                     onChange={handleChangeQuote}
//                     showDefaultOption={false}
//                     items={quoteType}
//                     value={selectedQuoteType}
//                     width={{ xs: "100%", sm: "400px" }}
//                 />
//             )} */}
//             <QuotesTable data={quoteData} />
//         </Stack>
//     );
// }

// export default Quotes;























import { Skeleton, Stack } from "@mui/material";
import Selector from "../../../components/Selector";
import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import QuotesTable from "./QuotesTable";
import { useQuotesSocket } from "../../../socketENV/quotesSocketENV";


const symbol = [
  "AUDJPY", "AUDNZD", "AUDUSD", "AUS200", "CADCHF",
  "CADJPY", "CHFJPY", "EURAUD", "EURCAD", "EURCHF",
  "EURGBP", "EURJPY", "EURNZD", "EURUSD", "GBPAUD",
  "GBPCAD", "GBPCHF", "GBPJPY", "GBPNZD", "GBPUSD",
  "NZDCAD", "NZDCHF", "NZDJPY", "NZDUSD", "US30",
  "USDCAD", "USDCHF", "USDJPY", "USDNOK", "XAGUSD",
  "XAUUSD"
];

function Quotes() {
  const { token } = useSelector((state) => state.auth);
  const [quoteData, setQuoteData] = useState(null);

  // ✅ Handle incoming data from socket
  const handleQuoteData = useCallback((data) => {
    if (!data) return;
    setQuoteData(data);
  }, []);

  // ✅ Just call your hook here
  useQuotesSocket(handleQuoteData, token, symbol);

  return (
    <Stack>
      {/* You can re-enable the selector logic later if needed */}
      <QuotesTable data={quoteData} />
    </Stack>
  );
}

export default Quotes;