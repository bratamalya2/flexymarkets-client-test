import { useState, useEffect } from "react";
import { Box, Typography, Button, IconButton, Tooltip, Chip } from "@mui/material";
import { useSelector } from "react-redux";
import TradingViewWidget from "./TerminalGraph";
import OrdersTable from "./OrdersTable";
import ChartOverlayLines from "./ChartOverlayLines";
// import { useQuotesSocket } from "../../socketENV/quotesSocketENV";
import { useQuotes } from "../../context/QuotesContext";
import { formatPrice, formatPercentage } from "./formatters";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import RefreshIcon from "@mui/icons-material/Refresh";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import SettingsIcon from "@mui/icons-material/Settings";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

function CenterPanel() {
  const [activeTimeframe, setActiveTimeframe] = useState("5");
  const [chartData, setChartData] = useState({ price: 0, changePercent: 0 });
  const [priceAnimation, setPriceAnimation] = useState("none");
  const [timeframeAnimations, setTimeframeAnimations] = useState({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { selectedSymbol } = useSelector(state => state.terminal);

  const timeframes = [
    { value: "1", label: "M1", description: "1 Minute" },
    { value: "5", label: "M5", description: "5 Minutes" },
    { value: "15", label: "M15", description: "15 Minutes" },
    { value: "60", label: "H1", description: "1 Hour" },
    { value: "240", label: "H4", description: "4 Hours" },
    { value: "1D", label: "D1", description: "1 Day" },
    { value: "1W", label: "W1", description: "1 Week" }
  ];

  const handleQuoteData = (data) => {
    if (!data || !Array.isArray(data) || !selectedSymbol) return;

    const symbolData = data.find(item => item.Symbol == selectedSymbol);
    if (symbolData) {
      const currentPrice = symbolData.Ask || symbolData.Bid || 0;
      const priceNum = Number(currentPrice) || 0;

      setChartData(prev => {
        const prevPriceNum = Number(prev.price) || priceNum;
        const change = priceNum - prevPriceNum;
        const changePercent = prevPriceNum !== 0 ? (change / prevPriceNum) * 100 : 0;

        // Trigger price animation
        if (prev.price !== 0 && prev.price !== priceNum) {
          setPriceAnimation(change >= 0 ? "priceUp 0.5s ease" : "priceDown 0.5s ease");
          setTimeout(() => setPriceAnimation("none"), 500);
        }

        return {
          price: priceNum,
          changePercent: changePercent
        };
      });

      // Dispatch price update for overlay lines
      const event = new CustomEvent('priceUpdate', {
        detail: {
          type: 'PRICE_UPDATE',
          currentPrice: priceNum,
          symbol: selectedSymbol,
          bid: symbolData.Bid || 0,
          ask: symbolData.Ask || 0
        }
      });
      window.dispatchEvent(event);
    }
  };

  // useQuotesSocket(handleQuoteData);

  const { quoteData } = useQuotes();

  useEffect(() => {
    handleQuoteData(quoteData)
  }, [quoteData])

  // Initialize trade lines when symbol changes
  useEffect(() => {
    if (selectedSymbol && chartData.price > 0) {
      const event = new CustomEvent('tradeLinesUpdate', {
        detail: {
          type: 'TRADE_LINES_UPDATE',
          currentPrice: chartData.price,
          stopLoss: 0,
          takeProfit: 0,
          pendingOrder: 0,
          isBuyOrder: true
        }
      });
      window.dispatchEvent(event);
    }
  }, [selectedSymbol, chartData.price]);

  // Handle timeframe change with animation
  const handleTimeframeChange = (value) => {
    setActiveTimeframe(value);

    // Trigger timeframe animation
    setTimeframeAnimations(prev => ({
      ...prev,
      [value]: "timeframeSelect 0.3s ease"
    }));

    setTimeout(() => {
      setTimeframeAnimations(prev => ({
        ...prev,
        [value]: undefined
      }));
    }, 300);
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);

    if (!isFullscreen) {
      const element = document.querySelector('.center-panel');
      if (element.requestFullscreen) {
        element.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Refresh chart
  const handleRefreshChart = () => {
    const event = new CustomEvent('refreshChart', {
      detail: { timestamp: Date.now() }
    });
    window.dispatchEvent(event);

    // Button animation
    const refreshBtn = document.querySelector('.refresh-chart-btn');
    if (refreshBtn) {
      refreshBtn.style.animation = 'spin 0.5s ease';
      setTimeout(() => {
        refreshBtn.style.animation = '';
      }, 500);
    }
  };

  return (
    <Box
      className="center-panel"
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg, #0a0e17 0%, #0f131e 100%)",
        position: "relative",
        overflow: "hidden",
        animation: "centerPanelSlideIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)"
      }}
    >
      {/* Animated background particles */}
      <Box sx={{
        // position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 50% 30%, rgba(76, 175, 80, 0.03) 0%, transparent 70%),
          radial-gradient(circle at 70% 70%, rgba(33, 150, 243, 0.02) 0%, transparent 50%),
          radial-gradient(circle at 30% 70%, rgba(255, 152, 0, 0.02) 0%, transparent 50%)
        `,
        pointerEvents: "none",
        animation: "centerParticlesFloat 25s infinite linear"
      }} />

      <Box sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        // position: "relative"
      }}>
        {/* Chart Header */}
        <Box sx={{
          background: "rgba(26, 31, 46, 0.8)",
          padding: "12px 20px",
          borderBottom: "1px solid rgba(76, 175, 80, 0.2)",
          display: "flex",
          gap: "10px",
          justifyContent: "space-between",
          alignItems: "center",
          // height: "60px",
          backdropFilter: "blur(10px)",
          // position: "relative",
          zIndex: 10,
          flexWrap: "wrap"
        }}>
          {/* Left side: Symbol info */}
          <Box sx={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            animation: "fadeInLeft 0.5s ease"
          }}>

            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Typography sx={{
                fontWeight: "800",
                color: "white",
                fontSize: "18px",
                letterSpacing: "0.5px",
                lineHeight: 1.2
              }}>
                {selectedSymbol || "Select Symbol"}
                <Chip
                  label="LIVE"
                  size="small"
                  sx={{
                    height: "16px",
                    fontSize: "9px",
                    fontWeight: "bold",
                    background: "rgba(76, 175, 80, 0.2)",
                    color: "#4CAF50",
                    border: "1px solid rgba(76, 175, 80, 0.3)",
                    marginLeft: "8px",
                    animation: "blink 1.5s infinite"
                  }}
                />
              </Typography>

              {/* <Box sx={{ display: "flex", alignItems: "center", gap: "12px", mt: "2px" }}>
                <Typography sx={{
                  fontSize: "22px",
                  fontWeight: "900",
                  background: chartData.changePercent >= 0
                    ? "linear-gradient(135deg, #4CAF50, #8BC34A)"
                    : "linear-gradient(135deg, #f44336, #E53935)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  animation: priceAnimation,
                  letterSpacing: "0.5px"
                }}>
                  {formatPrice(chartData.price, selectedSymbol)}
                </Typography>

                <Box sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "3px 10px",
                  borderRadius: "12px",
                  background: chartData.changePercent >= 0
                    ? "rgba(76, 175, 80, 0.1)"
                    : "rgba(244, 67, 54, 0.1)",
                  border: `1px solid ${chartData.changePercent >= 0
                    ? 'rgba(76, 175, 80, 0.2)'
                    : 'rgba(244, 67, 54, 0.2)'}`,
                  animation: chartData.changePercent !== 0 ? "fadeInUp 0.3s ease" : "none"
                }}>
                  {chartData.changePercent >= 0 ? (
                    <TrendingUpIcon sx={{
                      fontSize: "14px",
                      color: "#4CAF50",
                      animation: "bounceUp 2s infinite"
                    }} />
                  ) : (
                    <TrendingDownIcon sx={{
                      fontSize: "14px",
                      color: "#f44336",
                      animation: "bounceDown 2s infinite"
                    }} />
                  )}
                  <Typography sx={{
                    fontSize: "13px",
                    fontWeight: "700",
                    color: chartData.changePercent >= 0 ? "#4CAF50" : "#f44336"
                  }}>
                    {formatPercentage(chartData.changePercent)}
                  </Typography>
                </Box>
              </Box> */}
            </Box>
            <Box sx={{
              display: "flex",
              gap: "6px",
              marginRight: "15px",
              padding: "6px",
              background: "rgba(14, 18, 28, 0.7)",
              borderRadius: "8px",
              border: "1px solid rgba(76, 175, 80, 0.1)"
            }}>
              <Tooltip title="Zoom In">
                <IconButton sx={{
                  padding: "4px",
                  color: "#9ca3af",
                  "&:hover": {
                    color: "#4CAF50",
                    background: "rgba(76, 175, 80, 0.1)"
                  }
                }}>
                  <ZoomInIcon sx={{ fontSize: "16px" }} />
                </IconButton>
              </Tooltip>

              <Tooltip title="Zoom Out">
                <IconButton sx={{
                  padding: "4px",
                  color: "#9ca3af",
                  "&:hover": {
                    color: "#4CAF50",
                    background: "rgba(76, 175, 80, 0.1)"
                  }
                }}>
                  <ZoomOutIcon sx={{ fontSize: "16px" }} />
                </IconButton>
              </Tooltip>

              <Tooltip title="Refresh Chart">
                <IconButton
                  className="refresh-chart-btn"
                  onClick={handleRefreshChart}
                  sx={{
                    padding: "4px",
                    color: "#2196F3",
                    "&:hover": {
                      color: "#2196F3",
                      background: "rgba(33, 150, 243, 0.1)"
                    }
                  }}
                >
                  <RefreshIcon sx={{ fontSize: "16px" }} />
                </IconButton>
              </Tooltip>

              <Tooltip title="Fullscreen">
                <IconButton
                  onClick={toggleFullscreen}
                  sx={{
                    padding: "4px",
                    color: isFullscreen ? "#4CAF50" : "#9ca3af",
                    "&:hover": {
                      color: "#4CAF50",
                      background: "rgba(76, 175, 80, 0.1)"
                    }
                  }}
                >
                  <FullscreenIcon sx={{ fontSize: "16px" }} />
                </IconButton>
              </Tooltip>

              <Tooltip title="Chart Settings">
                <IconButton sx={{
                  padding: "4px",
                  color: "#9ca3af",
                  "&:hover": {
                    color: "#FF9800",
                    background: "rgba(255, 152, 0, 0.1)"
                  }
                }}>
                  <SettingsIcon sx={{ fontSize: "16px" }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Right side: Timeframes and controls */}
          <Box sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            animation: "fadeInRight 0.5s ease"
          }}>
            {/* Chart controls */}

            {/* Timeframe buttons */}
            <Box sx={{
              display: "flex",
              gap: "6px",
              padding: "6px",
              background: "rgba(14, 18, 28, 0.7)",
              borderRadius: "8px",
              border: "1px solid rgba(76, 175, 80, 0.1)"
            }}>
              {timeframes.map(timeframe => {
                const isActive = activeTimeframe === timeframe.value;
                const animation = timeframeAnimations[timeframe.value];

                return (
                  <Tooltip key={timeframe.value} title={timeframe.description}>
                    <Button
                      onClick={() => handleTimeframeChange(timeframe.value)}
                      sx={{
                        minWidth: "42px",
                        padding: "6px 8px",
                        fontSize: "11px",
                        fontWeight: "700",
                        background: isActive
                          ? "linear-gradient(135deg, #4CAF50, #2E7D32)"
                          : "transparent",
                        color: isActive ? "white" : "#9ca3af",
                        border: "1px solid",
                        borderColor: isActive
                          ? "rgba(76, 175, 80, 0.5)"
                          : "rgba(76, 175, 80, 0.1)",
                        borderRadius: "6px",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        position: "relative",
                        overflow: "hidden",
                        animation: animation,
                        "&:hover": {
                          color: "white",
                          background: isActive
                            ? "linear-gradient(135deg, #4CAF50, #2E7D32)"
                            : "rgba(76, 175, 80, 0.1)",
                          transform: "translateY(-2px)",
                          boxShadow: isActive
                            ? "0 4px 12px rgba(76, 175, 80, 0.3)"
                            : "0 2px 8px rgba(76, 175, 80, 0.2)"
                        },
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          bottom: 0,
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: isActive ? "80%" : "0%",
                          height: "2px",
                          background: "#4CAF50",
                          transition: "width 0.3s ease",
                          borderRadius: "1px"
                        }
                      }}
                    >
                      {timeframe.label}
                    </Button>
                  </Tooltip>
                );
              })}
            </Box>
          </Box>
        </Box>

        {/* Chart Container */}
        <Box sx={{
          flex: 1,
          background: "#0a0e17",
          position: "relative",
          overflow: "hidden"
        }}>
          <Box sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(45deg, rgba(10, 14, 23, 0.8), rgba(15, 19, 30, 0.9))",
            zIndex: 1
          }} />

          <Box sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 2
          }}>
            <TradingViewWidget activeTimeframe={activeTimeframe} />
          </Box>

          <Box sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 3,
            pointerEvents: "none"
          }}>
            <ChartOverlayLines />
          </Box>

          {/* Chart corners decoration */}
          <Box sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "20px",
            height: "20px",
            borderTop: "2px solid #4CAF50",
            borderLeft: "2px solid #4CAF50",
            borderTopLeftRadius: "6px",
            zIndex: 4
          }} />
          <Box sx={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "20px",
            height: "20px",
            borderTop: "2px solid #4CAF50",
            borderRight: "2px solid #4CAF50",
            borderTopRightRadius: "6px",
            zIndex: 4
          }} />
          <Box sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "20px",
            height: "20px",
            borderBottom: "2px solid #4CAF50",
            borderLeft: "2px solid #4CAF50",
            borderBottomLeftRadius: "6px",
            zIndex: 4
          }} />
          <Box sx={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: "20px",
            height: "20px",
            borderBottom: "2px solid #4CAF50",
            borderRight: "2px solid #4CAF50",
            borderBottomRightRadius: "6px",
            zIndex: 4
          }} />
        </Box>
      </Box>

      {/* Orders Table */}
      <Box sx={{
        height: "280px",
        background: "rgba(26, 31, 46, 0.8)",
        borderTop: "1px solid rgba(76, 175, 80, 0.2)",
        display: "flex",
        flexDirection: "column",
        backdropFilter: "blur(5px)",
        position: "relative",
        zIndex: 10,
        boxShadow: "0 -5px 20px rgba(0,0,0,0.2)"
      }}>
        <OrdersTable />
      </Box>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes centerPanelSlideIn {
            from { 
              transform: translateY(50px); 
              opacity: 0; 
            }
            to { 
              transform: translateY(0); 
              opacity: 1; 
            }
          }
          
          @keyframes centerParticlesFloat {
            0% { 
              transform: translateY(0) translateX(0) rotate(0deg); 
            }
            25% { 
              transform: translateY(-15px) translateX(15px) rotate(90deg); 
            }
            50% { 
              transform: translateY(-30px) translateX(0) rotate(180deg); 
            }
            75% { 
              transform: translateY(-15px) translateX(-15px) rotate(270deg); 
            }
            100% { 
              transform: translateY(0) translateX(0) rotate(360deg); 
            }
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
              transform: translateY(10px); 
              opacity: 0; 
            }
            to { 
              transform: translateY(0); 
              opacity: 1; 
            }
          }
          
          @keyframes badgePulse {
            0% { 
              box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3); 
              transform: scale(1); 
            }
            50% { 
              box-shadow: 0 4px 20px rgba(76, 175, 80, 0.6); 
              transform: scale(1.02); 
            }
            100% { 
              box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3); 
              transform: scale(1); 
            }
          }
          
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          
          @keyframes priceUp {
            0% { 
              transform: scale(1); 
              text-shadow: 0 0 0 rgba(76, 175, 80, 0); 
            }
            50% { 
              transform: scale(1.05); 
              text-shadow: 0 0 15px rgba(76, 175, 80, 0.5); 
            }
            100% { 
              transform: scale(1); 
              text-shadow: 0 0 0 rgba(76, 175, 80, 0); 
            }
          }
          
          @keyframes priceDown {
            0% { 
              transform: scale(1); 
              text-shadow: 0 0 0 rgba(244, 67, 54, 0); 
            }
            50% { 
              transform: scale(1.05); 
              text-shadow: 0 0 15px rgba(244, 67, 54, 0.5); 
            }
            100% { 
              transform: scale(1); 
              text-shadow: 0 0 0 rgba(244, 67, 54, 0); 
            }
          }
          
          @keyframes timeframeSelect {
            0% { transform: scale(1); }
            50% { transform: scale(0.95); }
            100% { transform: scale(1); }
          }
          
          @keyframes iconFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
          }
          
          @keyframes bounceUp {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
          }
          
          @keyframes bounceDown {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(3px); }
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          /* Fullscreen styles */
          :fullscreen .center-panel {
            background: #0a0e17;
          }
          
          :fullscreen .chart-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
          }
          
          :fullscreen .orders-table {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 1000;
          }
        `}
      </style>
    </Box>
  );
}

export default CenterPanel;