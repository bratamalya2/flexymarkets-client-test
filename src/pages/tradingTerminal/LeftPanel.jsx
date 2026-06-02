import { useCallback, useRef, useState, useEffect, useMemo } from "react";
import {
    Box,
    Typography,
    TextField,
    InputAdornment,
    List,
    ListItem,
    IconButton,
    Badge
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedSymbol } from "../../globalState/terminalState/terminalSlice";
import { useQuotes } from "../../context/QuotesContext";
import { useWatchListQuery, useAddSymbolToWatchListMutation } from "../../globalState/trade/tradeApis";
import { allSymbol } from "../../utils/allSymbol";


const PRIORITY_SYMBOLS = ['XAUUSD', 'XAGUSD'];
const SYMBOL_ORDER_STORAGE_KEY = "terminalSymbolOrder";

function getSymbolKey(symbol) {
    const rawSymbol = symbol?.Symbol ?? symbol?.name ?? symbol;
    return rawSymbol ? String(rawSymbol).trim().toUpperCase() : "";
}

function getSymbolName(symbol) {
    const rawSymbol = getSymbolKey(symbol);
    return rawSymbol ? String(rawSymbol).split(".")[0].toUpperCase() : "";
}

function getPriorityRank(symbol) {
    const index = PRIORITY_SYMBOLS.indexOf(getSymbolName(symbol));
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

function readStoredSymbolOrder() {
    try {
        const stored = JSON.parse(localStorage.getItem(SYMBOL_ORDER_STORAGE_KEY) || "{}");
        return {
            forex: Array.isArray(stored?.forex) ? stored.forex : [],
            watchlist: Array.isArray(stored?.watchlist) ? stored.watchlist : [],
        };
    } catch {
        return { forex: [], watchlist: [] };
    }
}

function orderSymbols(symbols = [], orderKeys = []) {
    const orderMap = new Map(orderKeys.map((symbol, index) => [symbol, index]));
    const hasCustomOrder = orderKeys.length > 0;

    return [...symbols].sort((a, b) => {
        const aKey = getSymbolKey(a);
        const bKey = getSymbolKey(b);
        const aOrder = orderMap.get(aKey);
        const bOrder = orderMap.get(bKey);

        if (aOrder !== undefined && bOrder !== undefined) return aOrder - bOrder;
        if (aOrder !== undefined) return -1;
        if (bOrder !== undefined) return 1;

        if (!hasCustomOrder) {
            const priorityDiff = getPriorityRank(a) - getPriorityRank(b);
            if (priorityDiff !== 0) return priorityDiff;
        }

        return 0;
    });
}

function reorderItem(list, sourceItem, targetItem) {
    if (!sourceItem || !targetItem || sourceItem === targetItem) return list;

    const nextList = [...list];
    const sourceIndex = nextList.indexOf(sourceItem);
    const targetIndex = nextList.indexOf(targetItem);
    if (sourceIndex === -1 || targetIndex === -1) return list;

    const [removed] = nextList.splice(sourceIndex, 1);
    nextList.splice(targetIndex, 0, removed);
    return nextList;
}

function LeftPanel({ width = { xs: "100%", md: "270px" } }) {

    const { data, isLoading } = useWatchListQuery()
    const [addSymbolToWatchList] = useAddSymbolToWatchListMutation()

    const allFavSymbols = !isLoading && data?.data?.symbols

    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState("forex");
    const [searchTerm, setSearchTerm] = useState("");
    const [symbolData, setSymbolData] = useState({});
    const symbolDataRef = useRef({});
    const [watchlist, setWatchlist] = useState(() => (allFavSymbols || []).map(s => s?.split('.')[0]?.toUpperCase()));
    const [symbolOrder, setSymbolOrder] = useState(readStoredSymbolOrder);
    const [draggedSymbol, setDraggedSymbol] = useState(null);
    const [dragOverSymbol, setDragOverSymbol] = useState(null);

    useEffect(() => {
        if (allFavSymbols) {
            setWatchlist(allFavSymbols.map(s => s?.split('.')[0]?.toUpperCase()));
        }
    }, [allFavSymbols]);

    const [hoveredSymbol, setHoveredSymbol] = useState(null);
    const [priceAnimations, setPriceAnimations] = useState({});

    const { selectedSymbol } = useSelector(state => state.terminal);

    const handleQuoteData = useCallback((data) => {
        if (!data || !Array.isArray(data)) return;

        const previousSymbolData = symbolDataRef.current;
        const newSymbolData = { ...previousSymbolData };
        const newPriceAnimations = {};

        data.forEach(item => {
            if (item.Symbol) {
                const symbol = item.Symbol;
                const currentPrice = item.Ask || item.Bid || 0;
                const previousData = previousSymbolData[symbol] || {};

                const previousPrice = previousData.price || currentPrice;
                const change = currentPrice - previousPrice;
                const changePercent = previousPrice !== 0 ? (change / previousPrice) * 100 : 0;


                newSymbolData[symbol] = {
                    price: currentPrice,
                    change: change,
                    changePercent: changePercent,
                    bid: item.Bid || 0,
                    ask: item.Ask || 0,
                    lastUpdate: Date.now()
                };

                // Trigger price animation
                if (previousData.price && previousData.price !== currentPrice) {
                    newPriceAnimations[symbol] = {
                        direction: change > 0 ? "up" : "down",
                        timestamp: Date.now()
                    };

                    // Clear animation after 500ms
                    setTimeout(() => {
                        setPriceAnimations(prev => ({
                            ...prev,
                            [symbol]: undefined
                        }));
                    }, 500);
                }
            }
        });

        symbolDataRef.current = newSymbolData;
        setSymbolData(newSymbolData);
        if (Object.keys(newPriceAnimations).length > 0) {
            setPriceAnimations(prev => ({
                ...prev,
                ...newPriceAnimations
            }));
        }
    }, []);

    const { quoteData } = useQuotes();

    useEffect(() => {
        handleQuoteData(quoteData)
    }, [handleQuoteData, quoteData])

    useEffect(() => {
        localStorage.setItem(SYMBOL_ORDER_STORAGE_KEY, JSON.stringify(symbolOrder));
    }, [symbolOrder]);

    const tabSymbols = useMemo(() => {
        const hasLiveQuotes = quoteData?.length > 0;

        if (activeTab === "watchlist") {
            return hasLiveQuotes
                ? quoteData.filter(q => watchlist?.includes(q?.Symbol?.split('.')[0]?.toUpperCase()))
                : watchlist.map(name => ({ Symbol: name, Ask: null, Bid: null }));
        }

        return hasLiveQuotes
            ? quoteData
            : allSymbol.map(s => ({ Symbol: s.name, Ask: null, Bid: null }));
    }, [activeTab, watchlist, quoteData]);

    const orderedSymbols = useMemo(() => (
        orderSymbols(tabSymbols, symbolOrder[activeTab] || [])
    ), [activeTab, symbolOrder, tabSymbols]);

    const filteredSymbols = useMemo(() => (
        orderedSymbols?.filter(symbol =>
            symbol?.Symbol?.toLowerCase().includes(searchTerm.toLowerCase())
        ) || []
    ), [orderedSymbols, searchTerm]);

    const formatPrice = (price) => {

        if (price === undefined || price === null || isNaN(price)) {
            return "0.00";
        }

        try {
            const numPrice = parseFloat(price);

            return numPrice;
        } catch {
            return "0.00";
        }
    };

    const handleSymbolSelect = (symbol) => {

        dispatch(setSelectedSymbol(symbol));

        const listItem = document.querySelector(`[data-symbol="${symbol}"]`);
        if (listItem) {
            listItem.style.animation = "symbolSelected 0.3s ease";
            setTimeout(() => {
                listItem.style.animation = "";
            }, 300);
        }
    };

    // Toggle watchlist
    const toggleWatchlist = async (symbol, e) => {
        e.stopPropagation();
        const normalizedSymbol = symbol?.split('.')[0]?.toUpperCase();
        const isInWatchlist = watchlist.includes(normalizedSymbol);
        const action = isInWatchlist ? "REMOVE" : "ADD";

        // Optimistic update
        if (isInWatchlist) {
            setWatchlist(prev => prev.filter(s => s !== normalizedSymbol));
        } else {
            setWatchlist(prev => [normalizedSymbol, ...prev]);
        }

        try {
            await addSymbolToWatchList({ symbol: normalizedSymbol, action }).unwrap();
        } catch {
            // Revert on failure
            if (isInWatchlist) {
                setWatchlist(prev => [normalizedSymbol, ...prev]);
            } else {
                setWatchlist(prev => prev.filter(s => s !== normalizedSymbol));
            }
        }
    };

    const handleSymbolDragStart = useCallback((symbol, event) => {
        const symbolKey = getSymbolKey(symbol);
        if (!symbolKey) return;

        setDraggedSymbol(symbolKey);
        setDragOverSymbol(null);
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", symbolKey);
    }, []);

    const handleSymbolDragOver = useCallback((symbol, event) => {
        const symbolKey = getSymbolKey(symbol);
        if (!symbolKey || !draggedSymbol || symbolKey === draggedSymbol) return;

        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        setDragOverSymbol(symbolKey);
    }, [draggedSymbol]);

    const handleSymbolDrop = useCallback((symbol, event) => {
        event.preventDefault();

        const sourceSymbol = draggedSymbol || event.dataTransfer.getData("text/plain");
        const targetSymbol = getSymbolKey(symbol);
        if (!sourceSymbol || !targetSymbol || sourceSymbol === targetSymbol) {
            setDraggedSymbol(null);
            setDragOverSymbol(null);
            return;
        }

        const currentTabSymbols = orderedSymbols.map(getSymbolKey).filter(Boolean);
        const nextTabOrder = reorderItem(currentTabSymbols, sourceSymbol, targetSymbol);

        setSymbolOrder((current) => ({
            ...current,
            [activeTab]: nextTabOrder,
        }));
        setDraggedSymbol(null);
        setDragOverSymbol(null);
    }, [activeTab, draggedSymbol, orderedSymbols]);

    const handleSymbolDragEnd = useCallback(() => {
        setDraggedSymbol(null);
        setDragOverSymbol(null);
    }, []);

    // Handle tab change with animation
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        // Tab animation
        const tabs = document.querySelectorAll('.left-tab');
        tabs.forEach(t => t.style.transform = 'scale(1)');
        setTimeout(() => {
            const activeTabEl = document.querySelector(`.left-tab.${tab}`);
            if (activeTabEl) {
                activeTabEl.style.transform = 'scale(1.05)';
            }
        }, 10);
    };

    return (
        <Box
            sx={{
                width,
                height: "100%",
                minWidth: 0,
                background: "linear-gradient(180deg, #111827 0%, #0d1422 100%)",
                border: { xs: "none", sm: "1px solid rgba(255, 255, 255, 0.06)" },
                borderRadius: { xs: 0, sm: "16px", md: "20px" },
                display: "flex",
                flexDirection: "column",
                color: "#eef4ff",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                overflow: "hidden",
                boxShadow: { xs: "none", sm: "0 18px 42px rgba(17, 24, 39, 0.22)" },
                position: "relative",
                animation: "panelSlideInLeft 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)"
            }}
        >
            {/* Animated background particles */}
            <Box sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "radial-gradient(circle at 80% 10%, rgba(37, 99, 235, 0.16) 0%, transparent 45%)",
                pointerEvents: "none",
                animation: "particlesFloat 20s infinite linear reverse"
            }} />

            {/* Header with Search */}
            <Box sx={{
                p: { xs: "12px", sm: "15px" },
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                flexShrink: 0,
                position: "relative",
                background: "rgba(15, 23, 42, 0.55)",
                backdropFilter: "blur(5px)"
            }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: "10px", mb: "10px" }}>

                    <Typography sx={{
                        fontSize: { xs: "16px", sm: "18px" },
                        fontWeight: "800",
                        background: "linear-gradient(135deg, #ffffff, #a9b8cf)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        letterSpacing: "0.5px"
                    }}>
                        Market
                    </Typography>
                </Box>

                <TextField
                    placeholder="Search instruments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    size="small"
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{
                                    color: "#60a5fa",
                                    fontSize: "16px",
                                    animation: "searchIconFloat 2s infinite ease-in-out"
                                }} />
                            </InputAdornment>
                        ),
                        sx: {
                            background: "rgba(255, 255, 255, 0.08)",
                            border: "1px solid rgba(255, 255, 255, 0.12)",
                            borderRadius: "12px",
                            color: "white",
                            fontSize: { xs: "12px", sm: "13px" },
                            "& fieldset": { border: "none" },
                            "&:hover": {
                                borderColor: "#60a5fa",
                                boxShadow: "0 0 0 3px rgba(96, 165, 250, 0.12)"
                            },
                            "&.Mui-focused": {
                                borderColor: "#60a5fa",
                                boxShadow: "0 0 0 3px rgba(96, 165, 250, 0.16)"
                            }
                        }
                    }}
                />
            </Box>

            {/* Tabs */}
            <Box sx={{
                display: "flex",
                background: "rgba(15, 23, 42, 0.8)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                flexShrink: 0,
                position: "relative",
                backdropFilter: "blur(5px)"
            }}>
                {[
                    { id: "forex", label: "Forex", icon: WhatshotIcon },
                    { id: "watchlist", label: "Watchlist", icon: StarIcon }
                ].map((tab) => (
                    <Box
                        key={tab.id}
                        className={`left-tab ${tab.id}`}
                        sx={{
                            flex: 1,
                            padding: { xs: "10px 8px", sm: "12px" },
                            textAlign: "center",
                            cursor: "pointer",
                            fontSize: { xs: "12px", sm: "13px" },
                            fontWeight: "600",
                            color: activeTab === tab.id ? "white" : "#9aa8bd",
                            background: activeTab === tab.id
                                ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
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
                                    : "rgba(37, 99, 235, 0.14)",
                            },
                            "&::after": {
                                content: '""',
                                position: "absolute",
                                bottom: 0,
                                left: "50%",
                                transform: "translateX(-50%)",
                                width: activeTab === tab.id ? "60%" : "0%",
                                height: "2px",
                                background: "#60a5fa",
                                transition: "width 0.3s ease",
                                borderRadius: "1px"
                            }
                        }}
                        onClick={() => handleTabChange(tab.id)}
                    >
                        <tab.icon sx={{ fontSize: "14px" }} />
                        {tab.label}
                        {tab.id === "watchlist" && (
                            <Badge
                                badgeContent={watchlist.length}
                                sx={{
                                    "& .MuiBadge-badge": {
                                        background: "#2563eb",
                                        color: "white",
                                        fontSize: "9px",
                                        fontWeight: "bold",
                                        animation: "badgeBounce 2s infinite"
                                    }
                                }}
                            />
                        )}
                    </Box>
                ))}
            </Box>

            {/* Symbol List */}
            <Box sx={{
                flex: 1,
                overflowY: "auto",
                p: { xs: "12px", sm: "15px" },
                position: "relative",
                WebkitOverflowScrolling: "touch",
                "&::-webkit-scrollbar": {
                    width: "4px",
                },
                "&::-webkit-scrollbar-track": {
                    background: "transparent",
                    borderRadius: "2px",
                },
                "&::-webkit-scrollbar-thumb": {
                    background: "linear-gradient(180deg, #60a5fa, #2563eb)",
                    borderRadius: "2px",
                    "&:hover": {
                        background: "#1d4ed8",
                    }
                },
                scrollBehavior: "smooth"
            }}>
                <Typography sx={{
                    fontSize: { xs: "12px", sm: "13px" },
                    color: "#8fb2e8",
                    mb: { xs: "12px", sm: "15px" },
                    textTransform: "uppercase",
                    fontWeight: "700",
                    letterSpacing: "0.5px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                }}>
                    <Box sx={{
                        width: "8px",
                        height: "8px",
                        background: "#60a5fa",
                        borderRadius: "50%",
                        animation: "blink 1s infinite"
                    }} />
                    {activeTab === "watchlist" ? "Favorite Instruments" : "All Forex Pairs"}
                </Typography>

                {filteredSymbols.length === 0 ? (
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        py: 4,
                        animation: "fadeInUp 0.5s ease"
                    }}>
                        <SearchIcon sx={{
                            fontSize: "48px",
                            color: "rgba(96, 165, 250, 0.32)",
                            mb: 2
                        }} />
                        <Typography sx={{
                            color: "#9ca3af",
                            textAlign: "center",
                            fontSize: "14px"
                        }}>
                            No instruments found
                        </Typography>
                    </Box>
                ) : (
                    <List sx={{ p: 0 }}>
                        {filteredSymbols.map((symbolItem, index) => {
                            const symbol = symbolItem?.Symbol;
                            const symbolKey = getSymbolKey(symbol);
                            const data = symbolData[symbol] || {};
                            const isActive = selectedSymbol == symbol;
                            const isHovered = hoveredSymbol == symbol;
                            const isDragging = draggedSymbol === symbolKey;
                            const isDropTarget = dragOverSymbol === symbolKey;
                            const priceAnimation = priceAnimations[symbol];

                            return (
                                <ListItem
                                    key={symbol}
                                    data-symbol={symbol}
                                    draggable
                                    onDragStart={(event) => handleSymbolDragStart(symbol, event)}
                                    onDragOver={(event) => handleSymbolDragOver(symbol, event)}
                                    onDragEnter={(event) => handleSymbolDragOver(symbol, event)}
                                    onDrop={(event) => handleSymbolDrop(symbol, event)}
                                    onDragEnd={handleSymbolDragEnd}
                                    onMouseEnter={() => setHoveredSymbol(symbol)}
                                    onMouseLeave={() => setHoveredSymbol(null)}
                                    onClick={() => handleSymbolSelect(symbol)}
                                    sx={{
                                        padding: { xs: "10px", sm: "12px" },
                                        borderRadius: "8px",
                                        cursor: isDragging ? "grabbing" : "grab",
                                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                        background: isActive
                                            ? "linear-gradient(135deg, rgba(37, 99, 235, 0.26), rgba(29, 78, 216, 0.12))"
                                            : isDropTarget
                                                ? "rgba(96, 165, 250, 0.2)"
                                                : isHovered
                                                ? "rgba(37, 99, 235, 0.14)"
                                                : "transparent",
                                        border: isDropTarget
                                            ? "1px dashed rgba(147, 197, 253, 0.85)"
                                            : isActive
                                            ? "1px solid rgba(96, 165, 250, 0.42)"
                                            : "1px solid transparent",
                                        boxShadow: isActive
                                            ? "0 10px 24px rgba(15, 23, 42, 0.28)"
                                            : isDropTarget
                                                ? "0 0 0 3px rgba(96, 165, 250, 0.14), 0 10px 24px rgba(15, 23, 42, 0.22)"
                                                : isHovered
                                                ? "0 8px 18px rgba(15, 23, 42, 0.2)"
                                                : "none",
                                        marginBottom: "8px",
                                        transform: isDragging
                                            ? "scale(0.98)"
                                            : isHovered
                                                ? "translateX(5px)"
                                                : "translateX(0)",
                                        animation: `${index % 2 === 0 ? "fadeInLeft" : "fadeInRight"} 0.5s ease ${index * 0.05}s both`,
                                        position: "relative",
                                        overflow: "hidden",
                                        opacity: isDragging ? 0.55 : 1,
                                        "&::before": {
                                            content: '""',
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            width: "3px",
                                            height: "100%",
                                            transform: "translateX(-100%)",
                                            transition: "transform 0.3s ease",
                                            opacity: 0.8
                                        },
                                        "&:hover::before": {
                                            transform: "translateX(0)"
                                        }
                                    }}
                                >
                                    <Box sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        mr: { xs: "6px", sm: "8px" },
                                        color: isDragging ? "#bfdbfe" : "rgba(255,255,255,0.28)",
                                        transition: "all 0.2s ease",
                                        "&:hover": {
                                            color: "#93c5fd",
                                        },
                                    }}>
                                        <DragIndicatorIcon sx={{ fontSize: { xs: "16px", sm: "18px" } }} />
                                    </Box>

                                    {/* Star button for watchlist */}
                                    <IconButton
                                        draggable={false}
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onClick={(e) => toggleWatchlist(symbol, e)}
                                        sx={{
                                            position: "absolute",
                                            top: "8px",
                                            right: "8px",
                                            padding: "2px",
                                            color: watchlist.includes(symbol?.split('.')[0]?.toUpperCase()) ? "#FFD700" : "rgba(255, 255, 255, 0.3)",
                                            transition: "all 0.3s",
                                            zIndex: 2,
                                            "&:hover": {
                                                color: "#FFD700",
                                                transform: "scale(1.2) rotate(180deg)"
                                            }
                                        }}
                                    >
                                        {watchlist.includes(symbol?.split('.')[0]?.toUpperCase()) ? (
                                            <StarIcon sx={{ fontSize: "14px" }} />
                                        ) : (
                                            <StarBorderIcon sx={{ fontSize: "14px" }} />
                                        )}
                                    </IconButton>

                                    <Box sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        flex: 1,
                                        overflow: "hidden"
                                    }}>
                                        {/* Symbol name and category */}
                                        <Box sx={{ display: "flex", alignItems: "center", gap: "8px", mb: "4px" }}>
                                            <Typography sx={{
                                                fontWeight: "800",
                                                color: "white",
                                                fontSize: { xs: "14px", sm: "15px" },
                                                letterSpacing: "0.5px"
                                            }}>
                                                {symbol}
                                            </Typography>
                                        </Box>

                                        <Typography sx={{
                                            fontSize: { xs: "10px", sm: "11px" },
                                            color: "#9ca3af",
                                            mb: { xs: "6px", sm: "8px" },
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis"
                                        }}>
                                            {symbolItem.Description || data.Symbol}
                                        </Typography>

                                        <Box sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between"
                                        }}>
                                            <Box sx={{
                                                display: "flex",
                                                flexDirection: "column"
                                            }}>
                                                <Typography sx={{
                                                    fontWeight: "700",
                                                    color: "green",
                                                    fontSize: { xs: "13px", sm: "14px" },
                                                    animation: priceAnimation?.direction === "up" ? "priceUp 0.5s ease" : "none",
                                                }}>
                                                    {formatPrice(symbolItem?.Ask)}
                                                    <TrendingUpIcon />
                                                </Typography>
                                                <Typography sx={{
                                                    fontWeight: "700",
                                                    color: "red",
                                                    fontSize: { xs: "13px", sm: "14px" },
                                                    animation: priceAnimation?.direction === "down" ? "priceDown 0.5s ease" : "none",
                                                }}>
                                                    {formatPrice(symbolItem?.Bid)}
                                                    <TrendingDownIcon />
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </ListItem>
                            );
                        })}
                    </List>
                )}
            </Box>



            {/* CSS Animations */}
            <style>
                {`
                    @keyframes panelSlideInLeft {
                        from { transform: translateX(-50px); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                    
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
                    
                    @keyframes fadeInLeft {
                        from { 
                            transform: translateX(-20px); 
                            opacity: 0; 
                        }
                        to { 
                            transform: translateX(0); 
                            opacity: 1; 
                        }
                    }
                    
                    @keyframes fadeInRight {
                        from { 
                            transform: translateX(20px); 
                            opacity: 0; 
                        }
                        to { 
                            transform: translateX(0); 
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
                    
                    @keyframes searchIconFloat {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-3px); }
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
                    
                    @keyframes symbolSelected {
                        0% { transform: scale(1); }
                        50% { transform: scale(0.98); }
                        100% { transform: scale(1); }
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
                        25% { transform: translateY(-10px) translateX(-10px); }
                        50% { transform: translateY(-20px) translateX(0); }
                        75% { transform: translateY(-10px) translateX(10px); }
                        100% { transform: translateY(0) translateX(0); }
                    }
                `}
            </style>
        </Box>
    );
}

export default LeftPanel;
