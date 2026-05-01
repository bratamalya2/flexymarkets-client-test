// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
// import { Box, Typography } from '@mui/material';
// import { useEffect, useRef, useState, useCallback } from 'react';
// import { useSelector } from 'react-redux';
// import { initiateQuotesSocketConnection } from '../../socketENV/quotesSocketENV';
// import Loader from "../../components/Loader"

// const symbol = ["AUDJPY", "AUDNZD", "AUDUSD", "AUS200", "CADCHF",
//     "CADJPY", "CHFJPY", "EURAUD", "EURCAD", "EURCHF",
//     "EURGBP", "EURJPY", "EURNZD", "EURUSD", "GBPAUD",
//     "GBPCAD", "GBPCHF", "GBPJPY", "GBPNZD", "GBPUSD",
//     "NZDCAD", "NZDCHF", "NZDJPY", "NZDUSD", "US30",
//     "USDCAD", "USDCHF", "USDJPY", "USDNOK", "XAGUSD",
//     "XAUUSD"]

// const allSymbol = [
//     { name: "AUDJPY", img1: "/symbol_logo/AUD.svg", img2: "/symbol_logo/JYP.svg" },
//     { name: "AUDNZD", img1: "/symbol_logo/AUD.svg", img2: "/symbol_logo/NZD.svg" },
//     { name: "AUDUSD", img1: "/symbol_logo/AUD.svg", img2: "/symbol_logo/USD.svg" },
//     { name: "AUS200", img1: "/symbol_logo/AUS200.svg" },
//     { name: "CADCHF", img1: "/symbol_logo/CAD.svg", img2: "/symbol_logo/CHF.svg" },
//     { name: "CADJPY", img1: "/symbol_logo/CAD.svg", img2: "/symbol_logo/JYP.svg" },
//     { name: "CHFJPY", img1: "/symbol_logo/CHF.svg", img2: "/symbol_logo/JYP.svg" },
//     { name: "EURAUD", img1: "/symbol_logo/EUR.svg", img2: "/symbol_logo/AUD.svg" },
//     { name: "EURCAD", img1: "/symbol_logo/EUR.svg", img2: "/symbol_logo/CAD.svg" },
//     { name: "EURCHF", img1: "/symbol_logo/EUR.svg", img2: "/symbol_logo/CHF.svg" },
//     { name: "EURGBP", img1: "/symbol_logo/EUR.svg", img2: "/symbol_logo/GBP.svg" },
//     { name: "EURJPY", img1: "/symbol_logo/EUR.svg", img2: "/symbol_logo/JYP.svg" },
//     { name: "EURNZD", img1: "/symbol_logo/EUR.svg", img2: "/symbol_logo/NZD.svg" },
//     { name: "EURUSD", img1: "/symbol_logo/EUR.svg", img2: "/symbol_logo/USD.svg" },
//     { name: "GBPAUD", img1: "/symbol_logo/GBP.svg", img2: "/symbol_logo/AUD.svg" },
//     { name: "GBPCAD", img1: "/symbol_logo/GBP.svg", img2: "/symbol_logo/CAD.svg" },
//     { name: "GBPCHF", img1: "/symbol_logo/GBP.svg", img2: "/symbol_logo/CHF.svg" },
//     { name: "GBPJPY", img1: "/symbol_logo/GBP.svg", img2: "/symbol_logo/JYP.svg" },
//     { name: "GBPNZD", img1: "/symbol_logo/GBP.svg", img2: "/symbol_logo/NZD.svg" },
//     { name: "GBPUSD", img1: "/symbol_logo/GBP.svg", img2: "/symbol_logo/USD.svg" },
//     { name: "NZDCAD", img1: "/symbol_logo/NZD.svg", img2: "/symbol_logo/CAD.svg" },
//     { name: "NZDCHF", img1: "/symbol_logo/NZD.svg", img2: "/symbol_logo/CHF.svg" },
//     { name: "NZDJPY", img1: "/symbol_logo/NZD.svg", img2: "/symbol_logo/JYP.svg" },
//     { name: "NZDUSD", img1: "/symbol_logo/NZD.svg", img2: "/symbol_logo/USD.svg" },
//     { name: "US30", img1: "/symbol_logo/US30.svg" },
//     { name: "USDCAD", img1: "/symbol_logo/USD.svg", img2: "/symbol_logo/CAD.svg" },
//     { name: "USDCHF", img1: "/symbol_logo/USD.svg", img2: "/symbol_logo/CHF.svg" },
//     { name: "USDJPY", img1: "/symbol_logo/USD.svg", img2: "/symbol_logo/JYP.svg" },
//     { name: "USDNOK", img1: "/symbol_logo/USD.svg", img2: "/symbol_logo/NOK.svg" },
//     { name: "XAGUSD", img1: "/symbol_logo/XAGUSD.svg", img2: "/symbol_logo/USD.svg" },
//     { name: "XAUUSD", img1: "/symbol_logo/XAUUSD.svg", img2: "/symbol_logo/USD.svg" }
// ]


// function createData(name, bid, ask) {
//     return { name, bid, ask };
// }

// function TerminalSideBarSymbol() {

//     const { token } = useSelector((state) => state.auth);
//     const socketRef = useRef(null);

//     const [quoteData, setQuoteData] = useState(null);

//     const handleQuoteData = useCallback((data) => {

//         if (!data) return;
//         setQuoteData(data)

//     }, []);

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

//     const rows = (Array.isArray(quoteData) && quoteData.length > 0)
//         ? quoteData.map(item => {
//             const symbolInfo = allSymbol.find(sym => sym.name === item.Symbol) || {};
//             return createData(
//                 {
//                     name: item.Symbol,
//                     img1: symbolInfo.img1,
//                     img2: symbolInfo.img2,
//                 },
//                 item.Bid,
//                 item.Ask
//             );
//         })
//         : [];


//     return (
//         <TableContainer
//             component={Paper}
//             sx={{
//                 // pt: {
//                 //     xs: "56px",
//                 //     sm: "64px"
//                 // },
//                 // pl: "60px",
//                 width: "350px",
//                 "&::-webkit-scrollbar": {
//                     height: "5px",
//                 },
//             }}
//         >
//             <Table aria-label="simple table">
//                 <TableHead>
//                     <TableRow>
//                         <TableCell>Symbol</TableCell>
//                         <TableCell>Bid</TableCell>
//                         <TableCell>Ask</TableCell>
//                     </TableRow>
//                 </TableHead>
//                 <TableBody sx={{ height: "10px" }}>
//                     {
//                         !rows
//                             ?
//                             <Loader />
//                             :
//                             rows.map((row) => (
//                                 <TableRow
//                                     key={row.name.name}
//                                     sx={{ width: "100%", height: "10px" }}
//                                 >
//                                     <TableCell
//                                         component="th"
//                                         scope="row"
//                                         sx={{
//                                             borderRight: "1px solid gray",
//                                             fontSize: "14px",
//                                             height: "10px",
//                                             py: 1.5
//                                         }}
//                                     >
//                                         <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
//                                             <Box sx={{ position: "relative", width: "20px", height: "20px" }}>
//                                                 {row.name.img2 && <img
//                                                     src={row.name.img2}
//                                                     alt="error"
//                                                     width="17px"
//                                                     height="17px"
//                                                     style={{
//                                                         borderRadius: "50%",
//                                                         position: "absolute",
//                                                         left: 0,
//                                                         top: 0
//                                                     }}
//                                                 />}
//                                                 <img
//                                                     src={row.name.img1}
//                                                     alt="error"
//                                                     width="17px"
//                                                     height="17px"
//                                                     style={{
//                                                         borderRadius: "50%",
//                                                         position: "absolute",
//                                                         right: row.name.img2 && "7px",
//                                                         top: row.name.img2 && "7px"
//                                                     }}
//                                                 />
//                                             </Box>
//                                             <Typography component="span">{row.name.name}</Typography>
//                                         </Box>
//                                     </TableCell>
//                                     <TableCell sx={{ fontSize: "12px", py: 1.5, color: "red" }}>{row.bid}</TableCell>
//                                     <TableCell sx={{ fontSize: "12px", py: 1.5, color: "green" }}>{row.ask}</TableCell>
//                                 </TableRow>
//                             ))}
//                 </TableBody>
//             </Table>
//         </TableContainer>
//     );
// }

// export default TerminalSideBarSymbol;






















import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Typography } from '@mui/material';
import { useState, useCallback } from 'react';
import { useQuotesSocket } from '../../socketENV/quotesSocketENV';
import Loader from "../../components/Loader";

const allSymbol = [
    { name: "AUDJPY", img1: "/symbol_logo/AUD.svg", img2: "/symbol_logo/JYP.svg" },
    { name: "AUDNZD", img1: "/symbol_logo/AUD.svg", img2: "/symbol_logo/NZD.svg" },
    { name: "AUDUSD", img1: "/symbol_logo/AUD.svg", img2: "/symbol_logo/USD.svg" },
    { name: "AUS200", img1: "/symbol_logo/AUS200.svg" },
    { name: "CADCHF", img1: "/symbol_logo/CAD.svg", img2: "/symbol_logo/CHF.svg" },
    { name: "CADJPY", img1: "/symbol_logo/CAD.svg", img2: "/symbol_logo/JYP.svg" },
    { name: "CHFJPY", img1: "/symbol_logo/CHF.svg", img2: "/symbol_logo/JYP.svg" },
    { name: "EURAUD", img1: "/symbol_logo/EUR.svg", img2: "/symbol_logo/AUD.svg" },
    { name: "EURCAD", img1: "/symbol_logo/EUR.svg", img2: "/symbol_logo/CAD.svg" },
    { name: "EURCHF", img1: "/symbol_logo/EUR.svg", img2: "/symbol_logo/CHF.svg" },
    { name: "EURGBP", img1: "/symbol_logo/EUR.svg", img2: "/symbol_logo/GBP.svg" },
    { name: "EURJPY", img1: "/symbol_logo/EUR.svg", img2: "/symbol_logo/JYP.svg" },
    { name: "EURNZD", img1: "/symbol_logo/EUR.svg", img2: "/symbol_logo/NZD.svg" },
    { name: "EURUSD", img1: "/symbol_logo/EUR.svg", img2: "/symbol_logo/USD.svg" },
    { name: "GBPAUD", img1: "/symbol_logo/GBP.svg", img2: "/symbol_logo/AUD.svg" },
    { name: "GBPCAD", img1: "/symbol_logo/GBP.svg", img2: "/symbol_logo/CAD.svg" },
    { name: "GBPCHF", img1: "/symbol_logo/GBP.svg", img2: "/symbol_logo/CHF.svg" },
    { name: "GBPJPY", img1: "/symbol_logo/GBP.svg", img2: "/symbol_logo/JYP.svg" },
    { name: "GBPNZD", img1: "/symbol_logo/GBP.svg", img2: "/symbol_logo/NZD.svg" },
    { name: "GBPUSD", img1: "/symbol_logo/GBP.svg", img2: "/symbol_logo/USD.svg" },
    { name: "NZDCAD", img1: "/symbol_logo/NZD.svg", img2: "/symbol_logo/CAD.svg" },
    { name: "NZDCHF", img1: "/symbol_logo/NZD.svg", img2: "/symbol_logo/CHF.svg" },
    { name: "NZDJPY", img1: "/symbol_logo/NZD.svg", img2: "/symbol_logo/JYP.svg" },
    { name: "NZDUSD", img1: "/symbol_logo/NZD.svg", img2: "/symbol_logo/USD.svg" },
    { name: "US30", img1: "/symbol_logo/US30.svg" },
    { name: "USDCAD", img1: "/symbol_logo/USD.svg", img2: "/symbol_logo/CAD.svg" },
    { name: "USDCHF", img1: "/symbol_logo/USD.svg", img2: "/symbol_logo/CHF.svg" },
    { name: "USDJPY", img1: "/symbol_logo/USD.svg", img2: "/symbol_logo/JYP.svg" },
    { name: "USDNOK", img1: "/symbol_logo/USD.svg", img2: "/symbol_logo/NOK.svg" },
    { name: "XAGUSD", img1: "/symbol_logo/XAGUSD.svg", img2: "/symbol_logo/USD.svg" },
    { name: "XAUUSD", img1: "/symbol_logo/XAUUSD.svg", img2: "/symbol_logo/USD.svg" }
];

function createData(name, bid, ask) {
    return { name, bid, ask };
}

function TerminalSideBarSymbol() {
    const [quoteData, setQuoteData] = useState(null);

    const handleQuoteData = useCallback((data) => {
        if (!data) return;
        setQuoteData(data);
    }, []);

    // 👇 Use the custom hook
    useQuotesSocket(handleQuoteData);

    const rows = (Array.isArray(quoteData) && quoteData.length > 0)
        ? quoteData.map(item => {
            const symbolInfo = allSymbol.find(sym => sym.name === item.Symbol) || {};
            return createData(
                { name: item.Symbol, img1: symbolInfo.img1, img2: symbolInfo.img2 },
                item.Bid,
                item.Ask
            );
        })
        : [];

    return (
        <TableContainer
            component={Paper}
            sx={{
                width: "350px",
                "&::-webkit-scrollbar": { height: "5px" },
            }}
        >
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Symbol</TableCell>
                        <TableCell>Bid</TableCell>
                        <TableCell>Ask</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {!rows.length ? (
                        <Loader />
                    ) : (
                        rows.map((row) => (
                            <TableRow key={row.name.name}>
                                <TableCell sx={{ fontSize: "14px", py: 1.5 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        <Box sx={{ position: "relative", width: "20px", height: "20px" }}>
                                            {row.name.img2 && (
                                                <img
                                                    src={row.name.img2}
                                                    alt="error"
                                                    width="17px"
                                                    height="17px"
                                                    style={{
                                                        borderRadius: "50%",
                                                        position: "absolute",
                                                        left: 0,
                                                        top: 0,
                                                    }}
                                                />
                                            )}
                                            <img
                                                src={row.name.img1}
                                                alt="error"
                                                width="17px"
                                                height="17px"
                                                style={{
                                                    borderRadius: "50%",
                                                    position: "absolute",
                                                    right: row.name.img2 && "7px",
                                                    top: row.name.img2 && "7px",
                                                }}
                                            />
                                        </Box>
                                        <Typography component="span">{row.name.name}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ fontSize: "12px", color: "red" }}>{row.bid}</TableCell>
                                <TableCell sx={{ fontSize: "12px", color: "green" }}>{row.ask}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default TerminalSideBarSymbol;