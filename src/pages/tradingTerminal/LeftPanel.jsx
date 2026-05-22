import { useState, useEffect, useMemo } from "react";
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
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedSymbol } from "../../globalState/terminalState/terminalSlice";
import { useQuotes } from "../../context/QuotesContext";
import { useWatchListQuery, useAddSymbolToWatchListMutation } from "../../globalState/trade/tradeApis";
import { allSymbol } from "../../utils/allSymbol";


const PRIORITY_SYMBOLS = ['XAUUSD', 'XAGUSD'];

function LeftPanel() {

    const { data, isLoading } = useWatchListQuery()
    const [addSymbolToWatchList] = useAddSymbolToWatchListMutation()

    const allFavSymbols = !isLoading && data?.data?.symbols

    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState("forex");
    const [searchTerm, setSearchTerm] = useState("");
    const [symbolData, setSymbolData] = useState({});
    const [watchlist, setWatchlist] = useState(allFavSymbols || []);

    useEffect(() => {
        if (allFavSymbols) {
            setWatchlist(allFavSymbols);
        }
    }, [allFavSymbols]);

    const [hoveredSymbol, setHoveredSymbol] = useState(null);
    const [priceAnimations, setPriceAnimations] = useState({});

    const { selectedSymbol } = useSelector(state => state.terminal);

    const handleQuoteData = (data) => {
        if (!data || !Array.isArray(data)) return;

        const newSymbolData = { ...symbolData };
        const newPriceAnimations = { ...priceAnimations };

        data.forEach(item => {
            if (item.Symbol) {
                const symbol = item.Symbol;
                const currentPrice = item.Ask || item.Bid || 0;
                const previousData = symbolData[symbol] || {};

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

        setSymbolData(newSymbolData);
        setPriceAnimations(newPriceAnimations);
    };

    const { quoteData } = useQuotes();

    useEffect(() => {
        handleQuoteData(quoteData)
    }, [quoteData])

    const filteredSymbols = useMemo(() => {
        const hasLiveQuotes = quoteData?.length > 0;

        let symbols;
        if (activeTab === "watchlist") {
            symbols = hasLiveQuotes
                ? quoteData.filter(q => watchlist?.includes(q?.Symbol))
                : watchlist.map(name => ({ Symbol: name, Ask: null, Bid: null }));
        } else {
            // FOREX tab: live quotes when available, static list as fallback
            symbols = hasLiveQuotes
                ? quoteData
                : allSymbol.map(s => ({ Symbol: s.name, Ask: null, Bid: null }));
        }

        const filtered = symbols?.filter(symbol =>
            symbol?.Symbol?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return filtered?.sort((a, b) => {
            const aPriority = PRIORITY_SYMBOLS.includes(a.Symbol);
            const bPriority = PRIORITY_SYMBOLS.includes(b.Symbol);
            if (aPriority && !bPriority) return -1;
            if (!aPriority && bPriority) return 1;
            return 0;
        });
    }, [activeTab, searchTerm, watchlist, quoteData]);

    const formatPrice = (price) => {

        if (price === undefined || price === null || isNaN(price)) {
            return "0.00";
        }

        try {
            const numPrice = parseFloat(price);

            return numPrice;
        } catch (error) {
            return "0.00";
        }
    };

    const handleSymbolSelect = (symbol) => {

        dispatch(setSelectedSymbol(symbol));

        if (!watchlist.includes(symbol)) {
            setWatchlist(prev => [symbol, ...prev]);
        }

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
        const isInWatchlist = watchlist.includes(symbol);
        const action = isInWatchlist ? "REMOVE" : "ADD";

        // Optimistic update
        if (isInWatchlist) {
            setWatchlist(prev => prev.filter(s => s !== symbol));
        } else {
            setWatchlist(prev => [symbol, ...prev]);
        }

        try {
            await addSymbolToWatchList({ symbol, action }).unwrap();
        } catch {
            // Revert on failure
            if (isInWatchlist) {
                setWatchlist(prev => [symbol, ...prev]);
            } else {
                setWatchlist(prev => prev.filter(s => s !== symbol));
            }
        }
    };

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
                width: "280px",
                background: "linear-gradient(180deg, #0a0e17 0%, #0f131e 100%)",
                borderRight: "1px solid rgba(76, 175, 80, 0.1)",
                display: "flex",
                flexDirection: "column",
                color: "#d1d4dc",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                overflow: "hidden",
                boxShadow: "inset 0 0 30px rgba(0,0,0,0.4), 0 0 30px rgba(76, 175, 80, 0.1)",
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
                background: "radial-gradient(circle at 80% 50%, rgba(76, 175, 80, 0.05) 0%, transparent 50%)",
                pointerEvents: "none",
                animation: "particlesFloat 20s infinite linear reverse"
            }} />

            {/* Header with Search */}
            <Box sx={{
                p: "15px",
                borderBottom: "1px solid rgba(76, 175, 80, 0.2)",
                flexShrink: 0,
                position: "relative",
                background: "rgba(26, 31, 46, 0.7)",
                backdropFilter: "blur(5px)"
            }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: "10px", mb: "10px" }}>

                    <Typography sx={{
                        fontSize: "18px",
                        fontWeight: "800",
                        background: "linear-gradient(135deg, #4CAF50, #8BC34A)",
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
                                    color: "#4CAF50",
                                    fontSize: "16px",
                                    animation: "searchIconFloat 2s infinite ease-in-out"
                                }} />
                            </InputAdornment>
                        ),
                        sx: {
                            background: "rgba(14, 18, 28, 0.8)",
                            border: "1px solid rgba(76, 175, 80, 0.2)",
                            borderRadius: "8px",
                            color: "white",
                            fontSize: "13px",
                            "& fieldset": { border: "none" },
                            "&:hover": {
                                borderColor: "#4CAF50",
                                boxShadow: "0 0 15px rgba(76, 175, 80, 0.2)"
                            },
                            "&.Mui-focused": {
                                borderColor: "#4CAF50",
                                boxShadow: "0 0 20px rgba(76, 175, 80, 0.3)"
                            }
                        }
                    }}
                />
            </Box>

            {/* Tabs */}
            <Box sx={{
                display: "flex",
                background: "rgba(26, 31, 46, 0.8)",
                borderBottom: "1px solid rgba(76, 175, 80, 0.2)",
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
                        {tab.id === "watchlist" && (
                            <Badge
                                badgeContent={watchlist.length}
                                sx={{
                                    "& .MuiBadge-badge": {
                                        background: "#4CAF50",
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
                p: "15px",
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
                },
                scrollBehavior: "smooth"
            }}>
                <Typography sx={{
                    fontSize: "13px",
                    color: "#4CAF50",
                    mb: "15px",
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
                        background: "#4CAF50",
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
                            color: "rgba(76, 175, 80, 0.3)",
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
                            const data = symbolData[symbol] || {};
                            const isActive = selectedSymbol == symbol;
                            const isHovered = hoveredSymbol == symbol;

                            return (
                                <ListItem
                                    key={symbol}
                                    data-symbol={symbol}
                                    onMouseEnter={() => setHoveredSymbol(symbol)}
                                    onMouseLeave={() => setHoveredSymbol(null)}
                                    onClick={() => handleSymbolSelect(symbol)}
                                    sx={{
                                        padding: "12px",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                        background: isActive
                                            ? "linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(46, 125, 50, 0.1))"
                                            : isHovered
                                                ? "rgba(76, 175, 80, 0.1)"
                                                : "transparent",
                                        border: isActive
                                            ? "1px solid rgba(76, 175, 80, 0.4)"
                                            : "1px solid transparent",
                                        boxShadow: isActive
                                            ? "0 4px 20px rgba(76, 175, 80, 0.3)"
                                            : isHovered
                                                ? "0 2px 10px rgba(76, 175, 80, 0.2)"
                                                : "none",
                                        marginBottom: "8px",
                                        transform: isHovered ? "translateX(5px)" : "translateX(0)",
                                        animation: `${index % 2 === 0 ? "fadeInLeft" : "fadeInRight"} 0.5s ease ${index * 0.05}s both`,
                                        position: "relative",
                                        overflow: "hidden",
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
                                    {/* Star button for watchlist */}
                                    <IconButton
                                        onClick={(e) => toggleWatchlist(symbol, e)}
                                        sx={{
                                            position: "absolute",
                                            top: "8px",
                                            right: "8px",
                                            padding: "2px",
                                            color: watchlist.includes(symbol) ? "#FFD700" : "rgba(255, 255, 255, 0.3)",
                                            transition: "all 0.3s",
                                            zIndex: 2,
                                            "&:hover": {
                                                color: "#FFD700",
                                                transform: "scale(1.2) rotate(180deg)"
                                            }
                                        }}
                                    >
                                        {watchlist.includes(symbol) ? (
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
                                                fontSize: "15px",
                                                letterSpacing: "0.5px"
                                            }}>
                                                {symbol}
                                            </Typography>
                                        </Box>

                                        <Typography sx={{
                                            fontSize: "11px",
                                            color: "#9ca3af",
                                            mb: "8px",
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
                                                    fontSize: "14px"
                                                }}>
                                                    {formatPrice(symbolItem?.Ask)}
                                                    <TrendingUpIcon />
                                                </Typography>
                                                <Typography sx={{
                                                    fontWeight: "700",
                                                    color: "red",
                                                    fontSize: "14px"
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