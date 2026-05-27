import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    TableSortLabel,
    Tooltip,
    Skeleton,
    TextField,
    CircularProgress
} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { useQuotes } from "../../context/QuotesContext";
import useDynamicQuery from "../../hooks/useDynamicQuery";
import { useDispatch, useSelector } from "react-redux";
import { useCloseOrderMutation, useCloseLimitOrderMutation, useUpdatePositionProtectionMutation } from "../../globalState/trade/tradeApis";
import { setNotification } from "../../globalState/notificationState/notificationStateSlice";
import { setActiveMT5AccountPositionsDetails } from "../../globalState/mt5State/mt5StateSlice";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TechnicalAnalysisPanel from "./TechnicalAnalysisPanel";


function OrdersTable() {

    const [activeTab, setActiveTab] = useState("market");
    const [hoveredRow, setHoveredRow] = useState(null);
    const [currentTime, setCurrentTime] = useState('');
    const [timeAnimation, setTimeAnimation] = useState('none');
    const [historySort, setHistorySort] = useState({ key: null, direction: "asc" });
    const [editingProtection, setEditingProtection] = useState(null);

    const { quoteData } = useQuotes();

    const dispatch = useDispatch()

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        const tabs = document.querySelectorAll('.orders-tab');
        tabs.forEach(t => t.style.transform = 'scale(1)');
        setTimeout(() => {
            const activeTabEl = document.querySelector(`.orders-tab.${tab}`);
            if (activeTabEl) {
                activeTabEl.style.transform = 'scale(1.05)';
            }
        }, 10);
    };

    const { token } = useSelector((state) => state.auth);
    const { activeMT5AccountLogin: login, activeMT5AccountPositionsDetails } = useSelector(state => state.mt5)

    const { data } = useDynamicQuery(activeTab, activeMT5AccountPositionsDetails, token, login);

    const listData = data?.data

    const [closeOrder, { isLoading: closeOrderLoading }] = useCloseOrderMutation()
    const [closeLimitOrder, { isLoading: closeLimitOrderLoading }] = useCloseLimitOrderMutation()
    const [updatePositionProtection, { isLoading: updatePositionProtectionLoading }] = useUpdatePositionProtectionMutation()

    const historyHeaderCellSx = {
        color: "#4CAF50",
        fontWeight: 800,
        fontSize: "11px",
        borderBottom: "none",
        padding: "12px 8px"
    };

    const protectionInputSx = {
        width: "118px",
        "& .MuiInputBase-root": {
            height: "34px",
            color: "white",
            background: "rgba(5, 10, 18, 0.7)",
            borderRadius: "8px",
            border: "1px solid rgba(76, 175, 80, 0.25)"
        },
        "& input": {
            color: "white",
            fontSize: "12px",
            fontWeight: 700,
            padding: "7px 8px"
        },
        "& fieldset": {
            border: "none"
        }
    };

    const getSortableNumber = (value) => {
        const parsed = Number(String(value ?? "").replace(/[^0-9.-]/g, ""));
        return Number.isFinite(parsed) ? parsed : 0;
    };

    const formatOptionalPrice = (value) => {
        const parsed = Number(String(value ?? "").replace(/,/g, ""));
        return Number.isFinite(parsed) && parsed > 0 ? value : "Not set";
    };

    const getPositionTicket = (position) => (
        position?.Position ?? position?.PositionID ?? position?.Ticket
    );

    const getRawSymbolName = (symbol) => {
        const rawSymbol = symbol?.groupedSym ?? symbol?.Symbol ?? symbol?.name ?? symbol;
        return rawSymbol ? String(rawSymbol).trim() : "";
    };

    const getBaseSymbolName = (symbol) => {
        const rawSymbol = getRawSymbolName(symbol);
        return rawSymbol ? rawSymbol.split(".")[0].toUpperCase() : "";
    };

    const parseFiniteNumber = (value) => {
        const parsed = Number(String(value ?? "").replace(/,/g, ""));
        return Number.isFinite(parsed) ? parsed : null;
    };

    const getIsSellPosition = (position) => {
        const positionAction = position?.Action ?? position?.Type;
        return positionAction == 1 || positionAction == "1";
    };

    const getEditablePriceValue = (value) => {
        const parsed = parseFiniteNumber(value);
        return Number.isFinite(parsed) && parsed > 0 ? String(value) : "";
    };

    const getLiveQuoteForPosition = (position) => {
        const positionSymbol = getBaseSymbolName(position?.Symbol);
        if (!positionSymbol || !Array.isArray(quoteData)) return null;

        return quoteData.find((quote) => getBaseSymbolName(quote) === positionSymbol) || null;
    };

    const getPositionCurrentPrice = (position) => {
        const positionCurrent = parseFiniteNumber(position?.PriceCurrent);
        if (positionCurrent && positionCurrent > 0) return positionCurrent;

        const liveQuote = getLiveQuoteForPosition(position);
        const bid = parseFiniteNumber(liveQuote?.Bid);
        const ask = parseFiniteNumber(liveQuote?.Ask);

        if (getIsSellPosition(position)) return ask || bid || null;
        return bid || ask || null;
    };

    const formatCurrentPriceForInput = (position) => {
        const currentPrice = getPositionCurrentPrice(position);
        if (!currentPrice || currentPrice <= 0) return "";

        const digits = Number.parseInt(position?.Digits, 10);
        if (!Number.isFinite(digits) || digits < 0) return String(currentPrice);

        return currentPrice.toFixed(Math.min(digits, 8));
    };

    const getProtectionEditValue = (position, field) => {
        const existingValue = getEditablePriceValue(position?.[field]);

        if (existingValue) {
            return {
                value: existingValue,
                autoFromCurrent: false
            };
        }

        return {
            value: formatCurrentPriceForInput(position),
            autoFromCurrent: true
        };
    };

    const getProtectionAutoKey = (field) => (
        field === "priceTp" ? "priceTpAutoFromCurrent" : "priceSlAutoFromCurrent"
    );

    const getProtectionInputValue = (position, field) => {
        if (!editingProtection) return "";

        if (editingProtection?.[getProtectionAutoKey(field)]) {
            return formatCurrentPriceForInput(position);
        }

        return editingProtection?.[field] ?? "";
    };

    const getPositionPriceStep = (position) => {
        const digits = Number.parseInt(position?.Digits, 10);
        if (!Number.isFinite(digits) || digits <= 0) return 0.01;
        return Number(`0.${"0".repeat(Math.max(digits - 1, 0))}1`);
    };

    const parseProtectionPrice = (value, label) => {
        if (value === "" || value === null || value === undefined) return 0;

        const parsed = Number(String(value).replace(/,/g, ""));
        if (!Number.isFinite(parsed) || parsed < 0) {
            throw new Error(`${label} must be a valid non-negative number.`);
        }

        return parsed;
    };

    const buildNumericPayloadValue = (value) => {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : value;
    };

    const handleEditProtection = (position) => {
        const takeProfit = getProtectionEditValue(position, "PriceTP");
        const stopLoss = getProtectionEditValue(position, "PriceSL");

        setEditingProtection({
            position: String(getPositionTicket(position)),
            priceTp: takeProfit.value,
            priceSl: stopLoss.value,
            priceTpAutoFromCurrent: takeProfit.autoFromCurrent,
            priceSlAutoFromCurrent: stopLoss.autoFromCurrent
        });
    };

    const handleProtectionInputChange = (field, value) => {
        setEditingProtection((current) => ({
            ...(current || {}),
            [field]: value,
            [getProtectionAutoKey(field)]: false
        }));
    };

    const updateLocalPositionProtection = (positionTicket, priceTp, priceSl) => {
        if (!Array.isArray(activeMT5AccountPositionsDetails)) return;

        const nextPositions = activeMT5AccountPositionsDetails.map((position) => {
            if (String(getPositionTicket(position)) !== String(positionTicket)) return position;

            return {
                ...position,
                PriceTP: String(priceTp),
                PriceSL: String(priceSl)
            };
        });

        dispatch(setActiveMT5AccountPositionsDetails(nextPositions));
    };

    const handleSaveProtection = async (position) => {
        const positionTicket = getPositionTicket(position);

        try {
            const priceTp = parseProtectionPrice(getProtectionInputValue(position, "priceTp"), "TP");
            const priceSl = parseProtectionPrice(getProtectionInputValue(position, "priceSl"), "SL");

            const payload = {
                login: buildNumericPayloadValue(position?.Login ?? login),
                position: buildNumericPayloadValue(positionTicket),
                priceTp,
                priceSl
            };

            const response = await updatePositionProtection(payload).unwrap();
            if (response?.status) {
                updateLocalPositionProtection(positionTicket, priceTp, priceSl);
                setEditingProtection(null);
                dispatch(setNotification({ open: true, message: response?.message || "Position TP/SL updated.", severity: "success" }));
            }
        } catch (error) {
            const message = error?.data?.message || error?.message || "Failed to update TP/SL. Please try again later.";
            dispatch(setNotification({ open: true, message, severity: "error" }));
        }
    };

    const getHistorySortValue = (trade, key) => {
        if (key === "volume") {
            return getSortableNumber(trade?.Volume ?? trade?.VolumeInitial);
        }

        if (key === "profit") {
            return getSortableNumber(trade?.Profit);
        }

        if (key === "time") {
            return getSortableNumber(trade?.Time);
        }

        return 0;
    };

    const handleHistorySort = (key) => {
        setHistorySort((currentSort) => ({
            key,
            direction: currentSort.key === key && currentSort.direction === "asc" ? "desc" : "asc"
        }));
    };

    const getSortedHistoryData = () => {
        if (!Array.isArray(listData)) return [];
        if (!historySort.key) return [...listData];

        return [...listData].sort((firstTrade, secondTrade) => {
            const firstValue = getHistorySortValue(firstTrade, historySort.key);
            const secondValue = getHistorySortValue(secondTrade, historySort.key);
            const sortMultiplier = historySort.direction === "asc" ? 1 : -1;

            return (firstValue - secondValue) * sortMultiplier;
        });
    };

    const renderHistorySortLabel = (label, key) => (
        <TableSortLabel
            active={historySort.key === key}
            direction={historySort.key === key ? historySort.direction : "asc"}
            onClick={() => handleHistorySort(key)}
            sx={{
                color: "#4CAF50 !important",
                fontWeight: 800,
                fontSize: "11px",
                letterSpacing: "0.4px",
                "& .MuiTableSortLabel-icon": {
                    color: "#4CAF50 !important",
                    opacity: historySort.key === key ? 1 : 0.45
                }
            }}
        >
            {label}
        </TableSortLabel>
    );


    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const timeStr = now.toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                weekday: 'short'
            }) + ' | ' + now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            }) + ' GMT+2';

            setCurrentTime(timeStr);

            if (now.getSeconds() === 0) {
                setTimeAnimation('timeUpdate 0.5s ease');
                setTimeout(() => setTimeAnimation('none'), 500);
            }
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);


    const renderMarketTable = () => (
        <Table size="small" sx={{
            borderCollapse: 'separate',
            borderSpacing: '0 4px'
        }}>
            <TableHead>
                <TableRow sx={{
                    background: "linear-gradient(135deg, rgba(26, 31, 46, 0.9), rgba(14, 18, 28, 0.9))",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(76, 175, 80, 0.2)",
                    borderRadius: "8px"
                }}>
                    <TableCell sx={{
                        color: "#4CAF50",
                        fontWeight: 800,
                        fontSize: "11px",
                        borderBottom: "none",
                        padding: "12px 8px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                    }}>Instrument</TableCell>
                    <TableCell sx={{
                        color: "#f44336",
                        fontWeight: 800,
                        fontSize: "11px",
                        borderBottom: "none",
                        padding: "12px 8px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                    }}>Sell</TableCell>
                    <TableCell sx={{
                        color: "#4CAF50",
                        fontWeight: 800,
                        fontSize: "11px",
                        borderBottom: "none",
                        padding: "12px 8px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                    }}>Buy</TableCell>
                    <TableCell sx={{
                        color: "#9ca3af",
                        fontWeight: 800,
                        fontSize: "11px",
                        borderBottom: "none",
                        padding: "12px 8px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                    }}>Volume</TableCell>
                    <TableCell sx={{
                        color: "#9ca3af",
                        fontWeight: 800,
                        fontSize: "11px",
                        borderBottom: "none",
                        padding: "12px 8px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                    }}>Spread</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {quoteData.map((row, index) => {

                    const isHovered = hoveredRow === row.Symbol;

                    return (
                        <TableRow
                            key={row.symbol}
                            onMouseEnter={() => setHoveredRow(row.Symbol)}
                            onMouseLeave={() => setHoveredRow(null)}
                            sx={{
                                background: isHovered
                                    ? "linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(46, 125, 50, 0.05))"
                                    : "rgba(14, 18, 28, 0.7)",
                                backdropFilter: "blur(5px)",
                                border: "1px solid rgba(76, 175, 80, 0.1)",
                                borderRadius: "8px",
                                marginBottom: "8px",
                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                transform: isHovered ? "translateY(-2px)" : "translateY(0)",
                                boxShadow: isHovered
                                    ? "0 8px 25px rgba(0,0,0,0.3)"
                                    : "0 2px 8px rgba(0,0,0,0.2)",
                                cursor: "pointer",
                                animation: `fadeInUp 0.5s ease ${index * 0.05}s both`,
                                "&:hover": {
                                    borderColor: "#4CAF50",
                                    boxShadow: "0 12px 30px rgba(76, 175, 80, 0.2)"
                                }
                            }}
                        >
                            <TableCell sx={{
                                color: "white",
                                fontSize: "13px",
                                fontWeight: 700,
                                borderBottom: "none",
                                padding: "12px 8px",
                                borderTopLeftRadius: "8px",
                                borderBottomLeftRadius: "8px"
                            }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <Box sx={{
                                        width: "6px",
                                        height: "6px",
                                        borderRadius: "50%",
                                        background: row.volatility === "high"
                                            ? "#FF9800"
                                            : row.volatility === "medium"
                                                ? "#4CAF50"
                                                : "#2196F3",
                                        animation: row.volatility === "high" ? "blink 1s infinite" : "none"
                                    }} />
                                    {row?.Symbol || <Skeleton />}
                                </Box>
                            </TableCell>
                            <TableCell sx={{
                                color: "#f44336",
                                fontSize: "13px",
                                fontWeight: 700,
                                borderBottom: "none",
                                padding: "12px 8px",
                                // animation: priceAnimation?.direction === "down" ? "priceDown 0.5s ease" : "none"
                            }}>
                                {row?.Bid || <Skeleton />}
                            </TableCell>
                            <TableCell sx={{
                                color: "#4CAF50",
                                fontSize: "13px",
                                fontWeight: 700,
                                borderBottom: "none",
                                padding: "12px 8px",
                                // animation: priceAnimation?.direction === "up" ? "priceUp 0.5s ease" : "none"
                            }}>
                                {row?.Ask || <Skeleton />}
                            </TableCell>
                            <TableCell sx={{
                                color: "#9ca3af",
                                fontSize: "12px",
                                borderBottom: "none",
                                padding: "12px 8px"
                            }}>
                                {row?.Volume || <Skeleton />}
                            </TableCell>
                            <TableCell sx={{
                                color: "#FF9800",
                                fontSize: "12px",
                                fontWeight: 700,
                                borderBottom: "none",
                                padding: "12px 8px",
                                borderTopRightRadius: "8px",
                                borderBottomRightRadius: "8px"
                            }}>
                                {row?.Ask - row?.Bid} pips
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );

    const renderPositionsTable = () => (
        <Table size="small" sx={{
            borderCollapse: 'separate',
            borderSpacing: '0 4px'
        }}>
            <TableHead>
                <TableRow sx={{
                    background: "linear-gradient(135deg, rgba(26, 31, 46, 0.9), rgba(14, 18, 28, 0.9))",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(76, 175, 80, 0.2)",
                    borderRadius: "8px"
                }}>
                    <TableCell sx={{ color: "#4CAF50", fontWeight: 800, fontSize: "11px", borderBottom: "none", padding: "12px 8px" }}>Symbol</TableCell>
                    <TableCell sx={{ color: "#4CAF50", fontWeight: 800, fontSize: "11px", borderBottom: "none", padding: "12px 8px" }}>Type</TableCell>
                    <TableCell sx={{ color: "#4CAF50", fontWeight: 800, fontSize: "11px", borderBottom: "none", padding: "12px 8px" }}>TP</TableCell>
                    <TableCell sx={{ color: "#4CAF50", fontWeight: 800, fontSize: "11px", borderBottom: "none", padding: "12px 8px" }}>SL</TableCell>
                    <TableCell sx={{ color: "#4CAF50", fontWeight: 800, fontSize: "11px", borderBottom: "none", padding: "12px 8px" }}>Entry</TableCell>
                    <TableCell sx={{ color: "#4CAF50", fontWeight: 800, fontSize: "11px", borderBottom: "none", padding: "12px 8px" }}>Current</TableCell>
                    <TableCell sx={{ color: "#4CAF50", fontWeight: 800, fontSize: "11px", borderBottom: "none", padding: "12px 8px" }}>P/L</TableCell>
                    <TableCell sx={{ color: "#4CAF50", fontWeight: 800, fontSize: "11px", borderBottom: "none", padding: "12px 8px" }}>Action</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {(!activeMT5AccountPositionsDetails || activeMT5AccountPositionsDetails?.length == 0 || (activeMT5AccountPositionsDetails?.positionList == false)) ? (
                    <TableRow>
                        <TableCell colSpan={8} sx={{
                            textAlign: "center",
                            padding: "40px",
                            color: "#9ca3af",
                            fontSize: "14px",
                            fontStyle: "italic",
                            animation: "fadeInUp 0.5s ease"
                        }}>
                            <Box sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "12px"
                            }}>
                                <AccountBalanceWalletIcon sx={{
                                    fontSize: "48px",
                                    color: "rgba(76, 175, 80, 0.3)"
                                }} />
                                No open positions
                                <Typography sx={{
                                    fontSize: "12px",
                                    color: "#6b7280"
                                }}>
                                    Open a trade from the right panel
                                </Typography>
                            </Box>
                        </TableCell>
                    </TableRow>
                ) : (
                    activeMT5AccountPositionsDetails?.map((pos, index) => {

                        const positionTicket = getPositionTicket(pos);
                        const isHovered = hoveredRow === positionTicket;

                        const handleCloseOrder = async (data) => {
                            const positionAction = data?.Action ?? data?.Type;

                            const closeData = {
                                symbol: data?.Symbol,
                                volume: data?.Volume || data?.VolumeInitial,
                                typeFill: "1",
                                type: (positionAction === 1 || positionAction === "1") ? "0" : "1",
                                login: data?.Login,
                                position: getPositionTicket(data),
                                priceOrder: data?.PriceCurrent,
                                digits: data?.Digits || 2
                            }


                            try {
                                const response = await closeOrder(closeData).unwrap();
                                if (response?.status) {
                                    dispatch(setNotification({ open: true, message: response?.message, severity: "success" }));
                                }
                            } catch (error) {
                                if (!error?.data?.status) {
                                    dispatch(setNotification({ open: true, message: error?.data?.message || "Failed to submit. Please try again later.", severity: "error" }));
                                }
                            }

                        }

                        const isSell = getIsSellPosition(pos);
                        const isEditingProtection = editingProtection?.position === String(positionTicket);
                        const positionPriceStep = getPositionPriceStep(pos);

                        return (
                            <TableRow
                                key={positionTicket}
                                onMouseEnter={() => setHoveredRow(positionTicket)}
                                onMouseLeave={() => setHoveredRow(null)}
                                sx={{
                                    background: isHovered
                                        ? "linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(46, 125, 50, 0.05))"
                                        : "rgba(14, 18, 28, 0.7)",
                                    backdropFilter: "blur(5px)",
                                    border: "1px solid rgba(76, 175, 80, 0.1)",
                                    borderRadius: "8px",
                                    marginBottom: "8px",
                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                    transform: isHovered ? "translateY(-2px)" : "translateY(0)",
                                    boxShadow: isHovered
                                        ? "0 8px 25px rgba(0,0,0,0.3)"
                                        : "0 2px 8px rgba(0,0,0,0.2)",
                                    cursor: "pointer",
                                    animation: `fadeInUp 0.5s ease ${index * 0.05}s both`
                                }}
                            >
                                <TableCell sx={{
                                    color: "white",
                                    fontSize: "13px",
                                    borderBottom: "none",
                                    padding: "12px 8px"
                                }}>
                                    {pos.Symbol}
                                </TableCell>
                                <TableCell sx={{
                                    color: isSell ? "#f44336" : "#4CAF50",
                                    fontSize: "12px",
                                    fontWeight: 700,
                                    borderBottom: "none",
                                    padding: "12px 8px"
                                }}>
                                    <Box sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                        padding: "4px 8px",
                                        borderRadius: "4px",
                                        background: !isSell
                                            ? "rgba(76, 175, 80, 0.1)"
                                            : "rgba(244, 67, 54, 0.1)",
                                        border: `1px solid ${isSell ? 'rgba(244, 67, 54, 0.2)' : 'rgba(76, 175, 80, 0.2)'}`
                                    }}>
                                        {isSell ? "↓" : "↑"}
                                        {isSell ? "Sell" : "Buy"}
                                    </Box>
                                </TableCell>
                                <TableCell sx={{
                                    color: "#4CAF50",
                                    fontSize: "12px",
                                    fontWeight: 800,
                                    borderBottom: "none",
                                    padding: "12px 8px"
                                }}>
                                    {isEditingProtection ? (
                                        <TextField
                                            type="number"
                                            size="small"
                                            value={getProtectionInputValue(pos, "priceTp")}
                                            onChange={(event) => handleProtectionInputChange("priceTp", event.target.value)}
                                            placeholder="Not set"
                                            inputProps={{ step: positionPriceStep, min: 0 }}
                                            sx={protectionInputSx}
                                        />
                                    ) : (
                                        formatOptionalPrice(pos.PriceTP)
                                    )}
                                </TableCell>
                                <TableCell sx={{
                                    color: "#f44336",
                                    fontSize: "12px",
                                    fontWeight: 800,
                                    borderBottom: "none",
                                    padding: "12px 8px"
                                }}>
                                    {isEditingProtection ? (
                                        <TextField
                                            type="number"
                                            size="small"
                                            value={getProtectionInputValue(pos, "priceSl")}
                                            onChange={(event) => handleProtectionInputChange("priceSl", event.target.value)}
                                            placeholder="Not set"
                                            inputProps={{ step: positionPriceStep, min: 0 }}
                                            sx={protectionInputSx}
                                        />
                                    ) : (
                                        formatOptionalPrice(pos.PriceSL)
                                    )}
                                </TableCell>
                                <TableCell sx={{
                                    fontSize: "13px",
                                    fontWeight: 800,
                                    borderBottom: "none",
                                    padding: "12px 8px"
                                }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                        {pos.PriceOpen}
                                    </Box>
                                </TableCell>
                                <TableCell sx={{
                                    fontSize: "13px",
                                    fontWeight: 800,
                                    borderBottom: "none",
                                    padding: "12px 8px"
                                }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                        {pos.PriceCurrent}
                                    </Box>
                                </TableCell>
                                <TableCell sx={{
                                    fontSize: "13px",
                                    fontWeight: 800,
                                    borderBottom: "none",
                                    padding: "12px 8px",
                                    color: (pos?.Profit)?.includes("-") ? "red" : "green"
                                }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                        {pos.Profit}
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ borderBottom: "none", padding: "12px 8px" }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                                        {isEditingProtection ? (
                                            <>
                                                <Button
                                                    onClick={() => handleSaveProtection(pos)}
                                                    disabled={updatePositionProtectionLoading}
                                                    startIcon={updatePositionProtectionLoading ? <CircularProgress size={12} color="inherit" /> : <SaveIcon sx={{ fontSize: 14 }} />}
                                                    sx={{
                                                        background: "linear-gradient(135deg, #16a085, #0f7a64)",
                                                        color: "white",
                                                        padding: "6px 10px",
                                                        fontSize: "10px",
                                                        fontWeight: 800,
                                                        borderRadius: "6px",
                                                        textTransform: "uppercase",
                                                        minWidth: "72px",
                                                        "&:hover": {
                                                            background: "linear-gradient(135deg, #0f7a64, #16a085)",
                                                            boxShadow: "0 4px 15px rgba(22, 160, 133, 0.35)"
                                                        }
                                                    }}
                                                >
                                                    Save
                                                </Button>
                                                <Button
                                                    onClick={() => setEditingProtection(null)}
                                                    disabled={updatePositionProtectionLoading}
                                                    startIcon={<CloseIcon sx={{ fontSize: 14 }} />}
                                                    sx={{
                                                        background: "rgba(156, 163, 175, 0.12)",
                                                        color: "#d1d5db",
                                                        border: "1px solid rgba(156, 163, 175, 0.25)",
                                                        padding: "6px 10px",
                                                        fontSize: "10px",
                                                        fontWeight: 800,
                                                        borderRadius: "6px",
                                                        textTransform: "uppercase",
                                                        minWidth: "78px",
                                                        "&:hover": {
                                                            background: "rgba(156, 163, 175, 0.2)"
                                                        }
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                            </>
                                        ) : (
                                            <Button
                                                onClick={() => handleEditProtection(pos)}
                                                startIcon={<EditIcon sx={{ fontSize: 14 }} />}
                                                sx={{
                                                    background: "linear-gradient(135deg, rgba(31, 122, 224, 0.95), rgba(25, 92, 168, 0.95))",
                                                    color: "white",
                                                    padding: "6px 10px",
                                                    fontSize: "10px",
                                                    fontWeight: 800,
                                                    borderRadius: "6px",
                                                    textTransform: "uppercase",
                                                    minWidth: "92px",
                                                    "&:hover": {
                                                        background: "linear-gradient(135deg, rgba(25, 92, 168, 0.95), rgba(31, 122, 224, 0.95))",
                                                        boxShadow: "0 4px 15px rgba(31, 122, 224, 0.35)"
                                                    }
                                                }}
                                            >
                                                Set TP/SL
                                            </Button>
                                        )}
                                        <Button
                                            onClick={() => handleCloseOrder(pos)}
                                            disabled={closeOrderLoading || updatePositionProtectionLoading}
                                            sx={{
                                                background: "linear-gradient(135deg, #f44336, #c62828)",
                                                color: "white",
                                                padding: "6px 12px",
                                                fontSize: "11px",
                                                fontWeight: 700,
                                                borderRadius: "6px",
                                                textTransform: "uppercase",
                                                letterSpacing: "0.5px",
                                                transition: "all 0.3s",
                                                animation: "pulseRed 2s infinite",
                                                "&:hover": {
                                                    background: "linear-gradient(135deg, #c62828, #f44336)",
                                                    transform: "scale(1.05)",
                                                    boxShadow: "0 4px 15px rgba(244, 67, 54, 0.4)"
                                                }
                                            }}
                                        >
                                            Close
                                        </Button>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        );
                    })
                )}
            </TableBody>
        </Table>
    );

    const renderHistoryTable = () => {
        const sortedHistoryData = getSortedHistoryData();

        return (
            <Table size="small" sx={{
                borderCollapse: 'separate',
                borderSpacing: '0 4px'
            }}>
                <TableHead>
                    <TableRow sx={{
                        background: "linear-gradient(135deg, rgba(26, 31, 46, 0.9), rgba(14, 18, 28, 0.9))",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(76, 175, 80, 0.2)",
                        borderRadius: "8px"
                    }}>
                        <TableCell sx={historyHeaderCellSx}>Trade</TableCell>
                        <TableCell sx={historyHeaderCellSx}>Type</TableCell>
                        <TableCell sx={historyHeaderCellSx}>{renderHistorySortLabel("Volume", "volume")}</TableCell>
                        {/* <TableCell sx={{ color: "#4CAF50", fontWeight: 800, fontSize: "11px", borderBottom: "none", padding: "12px 8px" }}>Entry/Exit</TableCell> */}
                        <TableCell sx={historyHeaderCellSx}>{renderHistorySortLabel("P/L", "profit")}</TableCell>
                        <TableCell sx={historyHeaderCellSx}>{renderHistorySortLabel("Time", "time")}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(!listData || listData.length === 0) ? (
                        <TableRow>
                            <TableCell colSpan={6} sx={{
                                textAlign: "center",
                                padding: "40px",
                                color: "#9ca3af",
                                fontSize: "14px",
                                fontStyle: "italic",
                                animation: "fadeInUp 0.5s ease"
                            }}>
                                <Box sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: "12px"
                                }}>
                                    <HistoryIcon sx={{
                                        fontSize: "48px",
                                        color: "rgba(76, 175, 80, 0.3)"
                                    }} />
                                    No trade history
                                    <Typography sx={{
                                        fontSize: "12px",
                                        color: "#6b7280"
                                    }}>
                                        Start trading to see your history
                                    </Typography>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ) : (
                        sortedHistoryData.map((trade, index) => {

                            return (
                                <TableRow
                                    key={trade.id}
                                    sx={{
                                        background: "rgba(14, 18, 28, 0.7)",
                                        backdropFilter: "blur(5px)",
                                        border: "1px solid rgba(76, 175, 80, 0.1)",
                                        borderRadius: "8px",
                                        marginBottom: "8px",
                                        animation: `fadeInUp 0.5s ease ${index * 0.05}s both`,
                                        opacity: 0.8,
                                        "&:hover": {
                                            opacity: 1,
                                            background: "rgba(14, 18, 28, 0.9)"
                                        }
                                    }}
                                >
                                    <TableCell sx={{
                                        color: "white",
                                        fontSize: "13px",
                                        fontWeight: 700,
                                        borderBottom: "none",
                                        padding: "12px 8px"
                                    }}>
                                        {trade.Symbol}
                                    </TableCell>
                                    <TableCell sx={{
                                        color: trade.Action == 1 ? "#4CAF50" : "#f44336",
                                        fontSize: "12px",
                                        fontWeight: 700,
                                        borderBottom: "none",
                                        padding: "12px 8px"
                                    }}>
                                        {trade?.Action == 1 ? "Buy" : "Sell"}
                                    </TableCell>
                                    <TableCell sx={{
                                        color: "white",
                                        fontSize: "13px",
                                        borderBottom: "none",
                                        padding: "12px 8px"
                                    }}>
                                        {trade.Volume}
                                    </TableCell>
                                    {/* <TableCell sx={{
                                        fontSize: "13px",
                                        fontWeight: 800,
                                        borderBottom: "none",
                                        padding: "12px 8px",
                                        color: (trade?.Profit)?.includes("-") ? "red" : "green"
                                    }}>
                                        {trade.Profit}
                                    </TableCell> */}
                                    <TableCell sx={{
                                        fontSize: "13px",
                                        fontWeight: 800,
                                        borderBottom: "none",
                                        padding: "12px 8px",
                                        color: (trade?.Profit)?.includes("-") ? "red" : "green"
                                    }}>
                                        {trade.Profit}
                                    </TableCell>
                                    <TableCell sx={{
                                        color: "#9ca3af",
                                        fontSize: "12px",
                                        borderBottom: "none",
                                        padding: "12px 8px"
                                    }}>
                                        {/* {trade.time} */}
                                        {
                                            new Date(trade?.Time * 1000).toLocaleString('en-CA', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit',
                                                hour12: false,
                                            }).replace(',', '')
                                        }
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        );
    };

    const renderPendingTable = () => (
        <Table size="small" sx={{ borderCollapse: 'separate', borderSpacing: '0 4px' }}>
            <TableHead>
                <TableRow sx={{
                    background: "linear-gradient(135deg, rgba(26, 31, 46, 0.9), rgba(14, 18, 28, 0.9))",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(76, 175, 80, 0.2)",
                    borderRadius: "8px"
                }}>
                    {["Order", "Symbol", "Type", "Volume", "Price", "SL", "TP", "Action"].map(col => (
                        <TableCell key={col} sx={{ color: "#4CAF50", fontWeight: 800, fontSize: "11px", borderBottom: "none", padding: "12px 8px" }}>{col}</TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {(!listData || listData.length === 0) ? (
                    <TableRow>
                        <TableCell colSpan={8} sx={{ textAlign: "center", padding: "40px", color: "#9ca3af", fontSize: "14px", fontStyle: "italic" }}>
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                                <AccessTimeIcon sx={{ fontSize: "48px", color: "rgba(76, 175, 80, 0.3)" }} />
                                No pending orders
                                <Typography sx={{ fontSize: "12px", color: "#6b7280" }}>
                                    Place a limit order from the right panel
                                </Typography>
                            </Box>
                        </TableCell>
                    </TableRow>
                ) : (
                    listData.map((order, index) => {
                        const typeLabel = order.Action == 2 ? "Buy Limit"
                            : order.Action == 3 ? "Sell Limit"
                            : order.Action == 4 ? "Buy Stop"
                            : order.Action == 5 ? "Sell Stop"
                            : `Type ${order.Action}`;
                        const typeColor = [2, 4].includes(Number(order.Action)) ? "#4CAF50" : "#f44336";

                        const handleCancelOrder = async () => {
                            try {
                                const response = await closeLimitOrder({
                                    login,
                                    order: order.Order,
                                    symbol: order.Symbol,
                                    type: String(order.Action)
                                }).unwrap();
                                if (response?.status) {
                                    dispatch(setNotification({ open: true, message: response?.message, severity: "success" }));
                                }
                            } catch (err) {
                                dispatch(setNotification({ open: true, message: err?.data?.message || "Failed to cancel order.", severity: "error" }));
                            }
                        };

                        return (
                            <TableRow
                                key={order.Order ?? index}
                                sx={{
                                    background: "rgba(14, 18, 28, 0.7)",
                                    backdropFilter: "blur(5px)",
                                    border: "1px solid rgba(76, 175, 80, 0.1)",
                                    borderRadius: "8px",
                                    animation: `fadeInUp 0.5s ease ${index * 0.05}s both`,
                                    "&:hover": { background: "rgba(26, 31, 46, 0.9)" }
                                }}
                            >
                                <TableCell sx={{ color: "#9ca3af", fontSize: "12px", borderBottom: "none", padding: "12px 8px" }}>{order.Order}</TableCell>
                                <TableCell sx={{ color: "white", fontSize: "13px", fontWeight: 700, borderBottom: "none", padding: "12px 8px" }}>{order.Symbol}</TableCell>
                                <TableCell sx={{ color: typeColor, fontSize: "12px", fontWeight: 700, borderBottom: "none", padding: "12px 8px" }}>{typeLabel}</TableCell>
                                <TableCell sx={{ color: "white", fontSize: "13px", borderBottom: "none", padding: "12px 8px" }}>{order.VolumeInitial ? order.VolumeInitial / 10000 : order.Volume}</TableCell>
                                <TableCell sx={{ color: "#FF9800", fontSize: "13px", fontWeight: 700, borderBottom: "none", padding: "12px 8px" }}>{order.PriceOrder}</TableCell>
                                <TableCell sx={{ color: "#f44336", fontSize: "12px", borderBottom: "none", padding: "12px 8px" }}>{order.PriceSL || "—"}</TableCell>
                                <TableCell sx={{ color: "#4CAF50", fontSize: "12px", borderBottom: "none", padding: "12px 8px" }}>{order.PriceTP || "—"}</TableCell>
                                <TableCell sx={{ borderBottom: "none", padding: "12px 8px" }}>
                                    <Button
                                        onClick={handleCancelOrder}
                                        disabled={closeLimitOrderLoading}
                                        sx={{
                                            background: "linear-gradient(135deg, #FF9800, #e65100)",
                                            color: "white",
                                            padding: "6px 12px",
                                            fontSize: "11px",
                                            fontWeight: 700,
                                            borderRadius: "6px",
                                            textTransform: "uppercase",
                                            "&:hover": { background: "linear-gradient(135deg, #e65100, #FF9800)", transform: "scale(1.05)" }
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })
                )}
            </TableBody>
        </Table>
    );

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            background: "linear-gradient(180deg, #0a0e17 0%, #0f131e 100%)",
            position: "relative"
        }}>
            {/* Animated background */}
            <Box sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "radial-gradient(circle at 50% 20%, rgba(76, 175, 80, 0.05) 0%, transparent 50%)",
                pointerEvents: "none",
                animation: "particlesFloat 20s infinite linear"
            }} />

            {/* Header */}
            <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "15px 15px 0 15px",
                flexShrink: 0
            }}>
                <Box sx={{ width: "100%", display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center", justifyContent: "space-between" }}>
                    <Box sx={{
                        background: "linear-gradient(135deg, #4CAF50, #2E7D32)",
                        color: "white",
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontSize: "10px",
                        fontWeight: "bold",
                        letterSpacing: "0.5px",
                        textTransform: "uppercase",
                        boxShadow: "0 2px 8px rgba(76, 175, 80, 0.3)",
                        animation: "badgePulse 2s infinite",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                    }}>
                        <ShowChartIcon sx={{ fontSize: "12px" }} />
                        Trading Data
                    </Box>
                    {/* <Typography sx={{
                        fontSize: "14px",
                        color: "#9ca3af",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                    }}>
                        <Box sx={{
                            width: "6px",
                            height: "6px",
                            background: "#4CAF50",
                            borderRadius: "50%",
                            animation: "pulseDot 1s infinite"
                        }} />
                        Updated: {new Date(lastUpdate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography> */}
                    <Box sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        animation: "fadeInRight 0.5s ease"
                    }}>
                        <Tooltip title="Server Time (GMT+2)" arrow>
                            <Box sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "8px 15px",
                                background: "rgba(14, 18, 28, 0.7)",
                                borderRadius: "20px",
                                border: "1px solid rgba(76, 175, 80, 0.2)",
                                backdropFilter: "blur(5px)",
                                animation: timeAnimation
                            }}>
                                <AccessTimeIcon sx={{
                                    fontSize: "16px",
                                    color: "#4CAF50",
                                    animation: "iconFloat 3s infinite ease-in-out"
                                }} />
                                <Typography sx={{
                                    fontSize: "12px",
                                    fontWeight: "700",
                                    color: "white",
                                    letterSpacing: "0.5px",
                                    fontFamily: "'Roboto Mono', monospace"
                                }}>
                                    {currentTime}
                                </Typography>
                            </Box>
                        </Tooltip>
                    </Box>
                </Box>

                {/* <Box sx={{ display: "flex", gap: "8px" }}>
                    <Tooltip title="Refresh">
                        <IconButton
                            className="refresh-btn"
                            onClick={handleRefresh}
                            sx={{
                                background: "rgba(76, 175, 80, 0.1)",
                                color: "#4CAF50",
                                padding: "6px",
                                "&:hover": {
                                    background: "#4CAF50",
                                    color: "white"
                                }
                            }}
                        >
                            <RefreshIcon sx={{ fontSize: "16px" }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Export Data">
                        <IconButton sx={{
                            background: "rgba(33, 150, 243, 0.1)",
                            color: "#2196F3",
                            padding: "6px",
                            "&:hover": {
                                background: "#2196F3",
                                color: "white"
                            }
                        }}>
                            <DownloadIcon sx={{ fontSize: "16px" }} />
                        </IconButton>
                    </Tooltip>
                </Box> */}
            </Box>

            {/* Tabs */}
            <Box sx={{
                display: "flex",
                background: "rgba(26, 31, 46, 0.8)",
                borderBottom: "1px solid rgba(76, 175, 80, 0.2)",
                flexShrink: 0,
                marginTop: "10px",
                backdropFilter: "blur(5px)"
            }}>
                {[
                    { id: "market", label: "Market Data", icon: ShowChartIcon },
                    { id: "analysis", label: "Analysis", icon: AutoGraphIcon },
                    { id: "positions", label: "Positions", icon: AccountBalanceWalletIcon },
                    { id: "pending", label: "Pending", icon: AccessTimeIcon },
                    { id: "history", label: "History", icon: HistoryIcon }
                ].map((tab) => (
                    <Box
                        key={tab.id}
                        className={`orders-tab ${tab.id}`}
                        sx={{
                            flex: 1,
                            padding: "12px",
                            textAlign: "center",
                            cursor: "pointer",
                            fontSize: "13px",
                            fontWeight: "600",
                            color: activeTab === tab.id ? "white" : "#9ca3af",
                            background: activeTab === tab.id
                                ? "linear-gradient(135deg, #4CAF50, #2E7D32)"
                                : "transparent",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            position: "relative",
                            overflow: "hidden",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            "&:hover": {
                                color: "white",
                                background: activeTab === tab.id
                                    ? "linear-gradient(135deg, #4CAF50, #2E7D32)"
                                    : "rgba(76, 175, 80, 0.1)",
                            },
                            "&::after": {
                                content: '""',
                                position: "absolute",
                                bottom: 0,
                                left: "50%",
                                transform: "translateX(-50%)",
                                width: activeTab === tab.id ? "60%" : "0%",
                                height: "2px",
                                background: "#4CAF50",
                                transition: "width 0.3s ease",
                                borderRadius: "1px"
                            }
                        }}
                        onClick={() => handleTabChange(tab.id)}
                    >
                        <tab.icon sx={{ fontSize: "14px" }} />
                        {tab.label}
                    </Box>
                ))}
            </Box>

            {/* Table Container */}
            <Box sx={{
                flex: 1,
                overflowY: "auto",
                padding: "15px",
                position: "relative",
                "&::-webkit-scrollbar": {
                    width: "4px",
                },
                "&::-webkit-scrollbar-track": {
                    background: "transparent",
                    borderRadius: "2px",
                },
                "&::-webkit-scrollbar-thumb": {
                    background: "linear-gradient(180deg, #4CAF50, #2E7D32)",
                    borderRadius: "2px",
                    "&:hover": {
                        background: "#2E7D32",
                    }
                }
            }}>
                <TableContainer sx={{
                    background: "transparent",
                    boxShadow: "none"
                }}>
                    {activeTab === "market" && renderMarketTable()}
                    {activeTab === "analysis" && <TechnicalAnalysisPanel />}
                    {activeTab === "positions" && renderPositionsTable()}
                    {activeTab === "pending" && renderPendingTable()}
                    {activeTab === "history" && renderHistoryTable()}
                </TableContainer>
            </Box>


            {/* CSS Animations */}
            <style>
                {`
                    @keyframes fadeInUp {
                        from { 
                            transform: translateY(20px); 
                            opacity: 0; 
                        }
                        to { 
                            transform: translateY(0); 
                            opacity: 1; 
                        }
                    }
                    
                    @keyframes badgePulse {
                        0% { box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3); }
                        50% { box-shadow: 0 2px 12px rgba(76, 175, 80, 0.6); }
                        100% { box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3); }
                    }
                    
                    @keyframes badgeFloat {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-3px); }
                    }
                    
                    @keyframes badgeBounce {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.2); }
                    }
                    
                    @keyframes blink {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.5; }
                    }
                    
                    @keyframes priceUp {
                        0% { 
                            color: #4CAF50;
                            transform: scale(1); 
                        }
                        50% { 
                            color: #4CAF50;
                            transform: scale(1.1); 
                            text-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
                        }
                        100% { 
                            color: #4CAF50;
                            transform: scale(1); 
                        }
                    }
                    
                    @keyframes priceDown {
                        0% { 
                            color: #f44336;
                            transform: scale(1); 
                        }
                        50% { 
                            color: #f44336;
                            transform: scale(1.1); 
                            text-shadow: 0 0 10px rgba(244, 67, 54, 0.5);
                        }
                        100% { 
                            color: #f44336;
                            transform: scale(1); 
                        }
                    }
                    
                    @keyframes glowGreen {
                        from { text-shadow: 0 0 5px rgba(76, 175, 80, 0.5); }
                        to { text-shadow: 0 0 15px rgba(76, 175, 80, 0.8); }
                    }
                    
                    @keyframes glowRed {
                        from { text-shadow: 0 0 5px rgba(244, 67, 54, 0.5); }
                        to { text-shadow: 0 0 15px rgba(244, 67, 54, 0.8); }
                    }
                    
                    @keyframes pulseRed {
                        0%, 100% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.4); }
                        50% { box-shadow: 0 0 0 5px rgba(244, 67, 54, 0); }
                    }
                    
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    
                    @keyframes pulseDot {
                        0%, 100% { 
                            opacity: 1;
                            box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
                        }
                        50% { 
                            opacity: 0.7;
                            box-shadow: 0 0 0 5px rgba(76, 175, 80, 0);
                        }
                    }
                    
                    @keyframes particlesFloat {
                        0% { transform: translateY(0) translateX(0); }
                        25% { transform: translateY(-10px) translateX(10px); }
                        50% { transform: translateY(-20px) translateX(0); }
                        75% { transform: translateY(-10px) translateX(-10px); }
                        100% { transform: translateY(0) translateX(0); }
                    }
                `}
            </style>
        </Box>
    );
}

export default OrdersTable;
