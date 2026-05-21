// import { Skeleton, Stack, Typography } from "@mui/material";
// import { Fragment } from "react";
// import { useSelector } from "react-redux";

// // const data = {
// //     Equity: "600.60 USD",
// //     "Free Margin": "600.60 USD",
// //     Balance: "600.60 USD",
// //     Margin: "0.00 USD",
// //     "Margin level": "-"
// // }

// function TerminalFooter() {

//     const { activeMT5AccountDetails } = useSelector(state => state.mt5)

//     const data = {
//         Equity: activeMT5AccountDetails?.Equity || "0 USD",
//         "Free Margin": activeMT5AccountDetails?.MarginFree || "0 USD",
//         Balance: activeMT5AccountDetails?.Balance || "0 USD",
//         Margin: activeMT5AccountDetails?.Margin || "0 USD",
//         "Margin level": activeMT5AccountDetails?.MarginLevel || "-"
//     }

//     return (
//         <Stack
//             sx={{
//                 px: "20px",
//                 height: "50px",
//                 flexDirection: "row",
//                 alignItems: "center",
//                 gap: "15px",
//                 borderTop: theme => `3px solid ${theme.palette.custom.brandLight}`
//             }}
//         >
//             {
//                 Object.entries(data).map(([key, value]) => (
//                     <Fragment key={key}>
//                         <Typography fontSize="12px" color="gray">{key}:</Typography>
//                         {
//                             !activeMT5AccountDetails
//                                 ?
//                                 <Skeleton width={"25%"} />
//                                 :
//                                 <Typography fontSize="12px" >{value}</Typography>
//                         }
//                     </Fragment>
//                 ))
//             }
//         </Stack>
//     )
// }

// export default TerminalFooter;

import { Stack, Typography, Box, Tooltip, IconButton, Badge, Chip } from "@mui/material";
import { Fragment, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import SpeedIcon from "@mui/icons-material/Speed";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import ShieldIcon from "@mui/icons-material/Shield";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import RefreshIcon from "@mui/icons-material/Refresh";
import InfoIcon from "@mui/icons-material/Info";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

function Footer() {
    const { activeMT5AccountDetails } = useSelector(state => state.mt5);
    const [priceAnimations, setPriceAnimations] = useState({});
    const [previousValues, setPreviousValues] = useState({});
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [tradingStats, setTradingStats] = useState({
        tradesToday: 3,
        winRate: "67%",
        avgProfit: "+$15.20",
        totalVolume: "0.45 lots"
    });
    
    const data = {
        Equity: activeMT5AccountDetails?.Equity || 0,
        "Free Margin": activeMT5AccountDetails?.MarginFree || 0,
        Balance: activeMT5AccountDetails?.Balance || 0,
        Margin: activeMT5AccountDetails?.Margin || 0,
        "Margin Level": activeMT5AccountDetails?.MarginLevel || 0
    };
    
    // Format currency values
    const formatCurrency = (value) => {
        return `$${parseFloat(value).toLocaleString('en-US', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
        })}`;
    };
    
    // Format margin level with color
    const formatMarginLevel = (level) => {
        if (!level || level === "-") return "0.00%";
        const numLevel = parseFloat(level);
        return `${numLevel.toFixed(2)}%`;
    };
    
    const getMarginLevelColor = (level) => {
        if (!level || level === "-") return "#9ca3af";
        const numLevel = parseFloat(level);
        if (numLevel > 500) return "#4CAF50";
        if (numLevel > 200) return "#FF9800";
        return "#f44336";
    };
    
    const getMarginLevelStatus = (level) => {
        if (!level || level === "-") return "normal";
        const numLevel = parseFloat(level);
        if (numLevel > 500) return "safe";
        if (numLevel > 200) return "warning";
        return "danger";
    };
    
    // Detect value changes for animations
    useEffect(() => {
        Object.entries(data).forEach(([key, value]) => {
            if (previousValues[key] !== undefined && previousValues[key] !== value) {
                const change = parseFloat(value) - parseFloat(previousValues[key]);
                if (change !== 0) {
                    setPriceAnimations(prev => ({
                        ...prev,
                        [key]: change > 0 ? 'up' : 'down'
                    }));
                    
                    setTimeout(() => {
                        setPriceAnimations(prev => ({
                            ...prev,
                            [key]: undefined
                        }));
                    }, 500);
                }
            }
        });
        
        setPreviousValues(data);
    }, [activeMT5AccountDetails]);
    
    // Refresh handler
    const handleRefresh = () => {
        setIsRefreshing(true);
        // Simulate refresh delay
        setTimeout(() => {
            setIsRefreshing(false);
        }, 500);
    };
    
    // Get animation class based on value change
    const getAnimation = (key, change) => {
        if (!priceAnimations[key]) return '';
        return priceAnimations[key] === 'up' ? 'footerPriceUp 0.5s ease' : 'footerPriceDown 0.5s ease';
    };

    return (
        <Box
            sx={{
                height: "60px",
                background: "linear-gradient(135deg, #0a0e17 0%, #1a1f2e 100%)",
                borderTop: "1px solid rgba(76, 175, 80, 0.2)",
                color: "#d1d4dc",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 -5px 20px rgba(0,0,0,0.3)",
                animation: "footerSlideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)"
            }}
        >
            {/* Animated background scan line */}
            <Box sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "2px",
                background: "linear-gradient(90deg, transparent, #4CAF50, transparent)",
                animation: "footerScan 8s infinite linear",
                pointerEvents: "none"
            }} />
            
            {/* Status indicator dots */}
            <Box sx={{
                position: "absolute",
                top: "12px",
                left: "15px",
                display: "flex",
                gap: "4px"
            }}>
                <FiberManualRecordIcon sx={{ 
                    fontSize: "8px", 
                    color: "#4CAF50",
                    animation: "blink 2s infinite"
                }} />
                <FiberManualRecordIcon sx={{ 
                    fontSize: "8px", 
                    color: "#2196F3",
                    animation: "blink 2s infinite 0.3s"
                }} />
                <FiberManualRecordIcon sx={{ 
                    fontSize: "8px", 
                    color: "#FF9800",
                    animation: "blink 2s infinite 0.6s"
                }} />
            </Box>

            <Stack
                sx={{
                    px: "20px",
                    height: "100%",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "25px"
                }}
            >
                {/* Left: Account Stats */}
                <Box sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "25px",
                    animation: "fadeInLeft 0.5s ease"
                }}>
                    {Object.entries(data).map(([key, value]) => {
                        const isMarginLevel = key === "Margin Level";
                        const formattedValue = isMarginLevel 
                            ? formatMarginLevel(value) 
                            : formatCurrency(value);
                        const animation = getAnimation(key);
                        const marginStatus = isMarginLevel ? getMarginLevelStatus(value) : null;
                        const marginColor = isMarginLevel ? getMarginLevelColor(value) : null;
                        
                        return (
                            <Fragment key={key}>
                                <Box sx={{ 
                                    display: "flex", 
                                    alignItems: "center", 
                                    gap: "8px",
                                    padding: "6px 12px",
                                    background: "rgba(14, 18, 28, 0.7)",
                                    borderRadius: "8px",
                                    border: "1px solid rgba(76, 175, 80, 0.1)",
                                    backdropFilter: "blur(5px)",
                                    transition: "all 0.3s",
                                    minWidth: "160px",
                                    "&:hover": {
                                        background: "rgba(14, 18, 28, 0.9)",
                                        borderColor: "#4CAF50",
                                        transform: "translateY(-2px)",
                                        boxShadow: "0 4px 15px rgba(76, 175, 80, 0.2)"
                                    }
                                }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                        <Box sx={{
                                            width: "6px",
                                            height: "6px",
                                            borderRadius: "50%",
                                            background: key === "Equity" ? "#4CAF50" :
                                                      key === "Free Margin" ? "#2196F3" :
                                                      key === "Balance" ? "#FF9800" :
                                                      key === "Margin" ? "#f44336" : marginColor,
                                            animation: key === "Margin Level" ? "pulseDot 1s infinite" : "none"
                                        }} />
                                        <Typography fontSize="11px" fontWeight="700" color="#9ca3af" sx={{ 
                                            textTransform: "uppercase",
                                            letterSpacing: "0.5px"
                                        }}>
                                            {key}
                                        </Typography>
                                    </Box>
                                    <Typography 
                                        fontSize="13px" 
                                        fontWeight="900" 
                                        sx={{ 
                                            color: isMarginLevel ? marginColor : "white",
                                            animation: animation,
                                            ml: "auto",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "4px"
                                        }}
                                    >
                                        {priceAnimations[key] === 'up' && (
                                            <TrendingUpIcon sx={{ fontSize: "14px", color: "#4CAF50" }} />
                                        )}
                                        {priceAnimations[key] === 'down' && (
                                            <TrendingDownIcon sx={{ fontSize: "14px", color: "#f44336" }} />
                                        )}
                                        {formattedValue}
                                        {isMarginLevel && (
                                            <Chip 
                                                label={marginStatus === 'safe' ? 'SAFE' : marginStatus === 'warning' ? 'WARN' : 'DANGER'}
                                                size="small"
                                                sx={{
                                                    height: "16px",
                                                    fontSize: "8px",
                                                    fontWeight: "bold",
                                                    background: marginStatus === 'safe' ? "rgba(76, 175, 80, 0.1)" :
                                                              marginStatus === 'warning' ? "rgba(255, 152, 0, 0.1)" :
                                                              "rgba(244, 67, 54, 0.1)",
                                                    color: marginStatus === 'safe' ? "#4CAF50" :
                                                           marginStatus === 'warning' ? "#FF9800" :
                                                           "#f44336",
                                                    border: `1px solid ${marginStatus === 'safe' ? 'rgba(76, 175, 80, 0.2)' :
                                                            marginStatus === 'warning' ? 'rgba(255, 152, 0, 0.2)' :
                                                            'rgba(244, 67, 54, 0.2)'}`,
                                                    animation: marginStatus === 'danger' ? "pulseRed 1s infinite" : "none"
                                                }}
                                            />
                                        )}
                                    </Typography>
                                </Box>
                            </Fragment>
                        );
                    })}
                </Box>

                {/* Center: Trading Stats */}
                <Box sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "20px",
                    animation: "fadeInUp 0.5s ease 0.1s both"
                }}>
                    <Tooltip title="Trading Performance" arrow>
                        <Box sx={{ 
                            display: "flex", 
                            alignItems: "center", 
                            gap: "15px",
                            padding: "6px 15px",
                            background: "rgba(14, 18, 28, 0.7)",
                            borderRadius: "20px",
                            border: "1px solid rgba(76, 175, 80, 0.2)",
                            backdropFilter: "blur(5px)"
                        }}>
                            <EqualizerIcon sx={{ 
                                fontSize: "18px", 
                                color: "#4CAF50",
                                animation: "iconFloat 3s infinite ease-in-out"
                            }} />
                            
                            {Object.entries(tradingStats).map(([key, value]) => (
                                <Box key={key} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    <Typography fontSize="10px" color="#9ca3af" sx={{ 
                                        textTransform: "uppercase",
                                        letterSpacing: "0.5px"
                                    }}>
                                        {key}
                                    </Typography>
                                    <Typography fontSize="12px" fontWeight="800" color="white">
                                        {value}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Tooltip>
                </Box>

                {/* Right: Controls and Status */}
                <Box sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "12px",
                    animation: "fadeInRight 0.5s ease"
                }}>
                    {/* Refresh Button */}
                    <Tooltip title="Refresh Account Data" arrow>
                        <IconButton
                            onClick={handleRefresh}
                            sx={{
                                padding: "6px",
                                background: "rgba(33, 150, 243, 0.1)",
                                color: "#2196F3",
                                "&:hover": {
                                    background: "#2196F3",
                                    color: "white",
                                    transform: "scale(1.1)"
                                },
                                animation: isRefreshing ? "spin 0.5s linear infinite" : "none"
                            }}
                        >
                            <RefreshIcon sx={{ fontSize: "18px" }} />
                        </IconButton>
                    </Tooltip>

                    {/* Performance Indicator */}
                    <Tooltip title="Trading Performance" arrow>
                        <Box sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "6px 12px",
                            background: "rgba(76, 175, 80, 0.1)",
                            borderRadius: "20px",
                            border: "1px solid rgba(76, 175, 80, 0.2)"
                        }}>
                            <SpeedIcon sx={{ 
                                fontSize: "16px", 
                                color: "#4CAF50",
                                animation: "iconFloat 3s infinite ease-in-out"
                            }} />
                            <Typography fontSize="11px" fontWeight="700" color="#4CAF50">
                                PERFORMANCE
                            </Typography>
                            <Badge 
                                color="success"
                                badgeContent="▲"
                                sx={{
                                    "& .MuiBadge-badge": {
                                        fontSize: "10px",
                                        animation: "badgeFloat 2s infinite"
                                    }
                                }}
                            />
                        </Box>
                    </Tooltip>

                    {/* Security Badge */}
                    <Tooltip title="Secure Connection" arrow>
                        <Chip 
                            icon={<ShieldIcon sx={{ fontSize: "14px" }} />}
                            label="SECURE"
                            size="small"
                            sx={{
                                height: "24px",
                                fontSize: "10px",
                                fontWeight: "bold",
                                background: "rgba(76, 175, 80, 0.1)",
                                color: "#4CAF50",
                                border: "1px solid rgba(76, 175, 80, 0.2)",
                                animation: "badgePulse 3s infinite"
                            }}
                        />
                    </Tooltip>

                    {/* Info Button */}
                    <Tooltip title="Account Information" arrow>
                        <IconButton sx={{
                            padding: "6px",
                            color: "#9ca3af",
                            "&:hover": {
                                color: "#4CAF50",
                                background: "rgba(76, 175, 80, 0.1)",
                                transform: "scale(1.1)"
                            }
                        }}>
                            <InfoIcon sx={{ fontSize: "18px" }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Stack>

            {/* CSS Animations */}
            <style>
                {`
                    @keyframes footerSlideUp {
                        from { 
                            transform: translateY(100%); 
                            opacity: 0; 
                        }
                        to { 
                            transform: translateY(0); 
                            opacity: 1; 
                        }
                    }
                    
                    @keyframes footerScan {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                    }
                    
                    @keyframes fadeInLeft {
                        from { 
                            transform: translateX(-30px); 
                            opacity: 0; 
                        }
                        to { 
                            transform: translateX(0); 
                            opacity: 1; 
                        }
                    }
                    
                    @keyframes fadeInRight {
                        from { 
                            transform: translateX(30px); 
                            opacity: 0; 
                        }
                        to { 
                            transform: translateX(0); 
                            opacity: 1; 
                        }
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
                    
                    @keyframes footerPriceUp {
                        0% { 
                            transform: scale(1); 
                            color: #4CAF50;
                            text-shadow: 0 0 0 rgba(76, 175, 80, 0); 
                        }
                        50% { 
                            transform: scale(1.1); 
                            color: #4CAF50;
                            text-shadow: 0 0 8px rgba(76, 175, 80, 0.5); 
                        }
                        100% { 
                            transform: scale(1); 
                            color: #4CAF50;
                            text-shadow: 0 0 0 rgba(76, 175, 80, 0); 
                        }
                    }
                    
                    @keyframes footerPriceDown {
                        0% { 
                            transform: scale(1); 
                            color: #f44336;
                            text-shadow: 0 0 0 rgba(244, 67, 54, 0); 
                        }
                        50% { 
                            transform: scale(1.1); 
                            color: #f44336;
                            text-shadow: 0 0 8px rgba(244, 67, 54, 0.5); 
                        }
                        100% { 
                            transform: scale(1); 
                            color: #f44336;
                            text-shadow: 0 0 0 rgba(244, 67, 54, 0); 
                        }
                    }
                    
                    @keyframes blink {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.3; }
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
                    
                    @keyframes pulseRed {
                        0%, 100% { 
                            opacity: 1;
                            box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.7);
                        }
                        50% { 
                            opacity: 0.7;
                            boxShadow: 0 0 0 5px rgba(244, 67, 54, 0);
                        }
                    }
                    
                    @keyframes badgePulse {
                        0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); }
                        70% { box-shadow: 0 0 0 5px rgba(76, 175, 80, 0); }
                        100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
                    }
                    
                    @keyframes badgeFloat {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-3px); }
                    }
                    
                    @keyframes iconFloat {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-3px); }
                    }
                    
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
            </style>
        </Box>
    );
}

export default Footer;