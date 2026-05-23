import { useState, useEffect } from "react";
import { Box, Typography, IconButton, Tooltip, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Button, Switch, Grid } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { setChartSettings, resetChartSettings } from "../../globalState/terminalState/terminalSlice";
import TradingViewWidget from "./TerminalGraph";
import OrdersTable from "./OrdersTable";
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
  const dispatch = useDispatch();
  const [chartData, setChartData] = useState({ price: 0, changePercent: 0 });
  const [priceAnimation, setPriceAnimation] = useState("none");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { selectedSymbol, chartSettings } = useSelector(state => state.terminal);
  const [settingsOpen, setSettingsOpen] = useState(false);

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
                <IconButton
                  onClick={() => window.dispatchEvent(new CustomEvent('chartZoomIn'))}
                  sx={{
                    padding: "4px",
                    color: "#9ca3af",
                    "&:hover": {
                      color: "#4CAF50",
                      background: "rgba(76, 175, 80, 0.1)"
                    }
                  }}
                >
                  <ZoomInIcon sx={{ fontSize: "16px" }} />
                </IconButton>
              </Tooltip>

              <Tooltip title="Zoom Out">
                <IconButton
                  onClick={() => window.dispatchEvent(new CustomEvent('chartZoomOut'))}
                  sx={{
                    padding: "4px",
                    color: "#9ca3af",
                    "&:hover": {
                      color: "#4CAF50",
                      background: "rgba(76, 175, 80, 0.1)"
                    }
                  }}
                >
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
                <IconButton
                  onClick={() => setSettingsOpen(true)}
                  sx={{
                    padding: "4px",
                    color: "#9ca3af",
                    "&:hover": {
                      color: "#FF9800",
                      background: "rgba(255, 152, 0, 0.1)"
                    }
                  }}
                >
                  <SettingsIcon sx={{ fontSize: "16px" }} />
                </IconButton>
              </Tooltip>
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
          <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
            <TradingViewWidget />
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

      {/* Chart Settings Dialog */}
      <Dialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        PaperProps={{
          sx: {
            background: "rgba(10, 14, 23, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(76, 175, 80, 0.25)",
            borderRadius: "16px",
            color: "white",
            maxWidth: "480px",
            width: "100%",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.5)",
            overflow: "hidden"
          }
        }}
      >
        <DialogTitle sx={{
          borderBottom: "1px solid rgba(76, 175, 80, 0.15)",
          background: "rgba(26, 31, 46, 0.4)",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <SettingsIcon sx={{ color: "#FF9800", fontSize: "20px" }} />
          <Typography sx={{ fontWeight: "700", fontSize: "16px", color: "white" }}>
            Chart Settings
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Candle Colors */}
          <Box>
            <Typography sx={{ fontSize: "11px", fontWeight: "700", color: "#9ca3af", mb: "12px", letterSpacing: "1px" }}>
              CANDLESTICK APPEARANCE
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography sx={{ fontSize: "12px", color: "#cbd5e1", mb: "6px" }}>Bullish (Up)</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <input
                    type="color"
                    value={chartSettings?.upColor || "#4CAF50"}
                    onChange={(e) => dispatch(setChartSettings({ upColor: e.target.value }))}
                    style={{
                      border: "none",
                      outline: "none",
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      cursor: "pointer",
                      background: "none",
                      padding: 0
                    }}
                  />
                  <Typography sx={{ fontSize: "12px", color: "#9ca3af", textTransform: "uppercase" }}>
                    {chartSettings?.upColor || "#4CAF50"}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ fontSize: "12px", color: "#cbd5e1", mb: "6px" }}>Bearish (Down)</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <input
                    type="color"
                    value={chartSettings?.downColor || "#f44336"}
                    onChange={(e) => dispatch(setChartSettings({ downColor: e.target.value }))}
                    style={{
                      border: "none",
                      outline: "none",
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      cursor: "pointer",
                      background: "none",
                      padding: 0
                    }}
                  />
                  <Typography sx={{ fontSize: "12px", color: "#9ca3af", textTransform: "uppercase" }}>
                    {chartSettings?.downColor || "#f44336"}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />

          {/* Grid Lines */}
          <Box>
            <Typography sx={{ fontSize: "11px", fontWeight: "700", color: "#9ca3af", mb: "12px", letterSpacing: "1px" }}>
              GRID CONFIGURATION
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ fontSize: "13px", color: "#cbd5e1" }}>Vertical Grid Lines</Typography>
                <Switch
                  checked={chartSettings?.showVertLines ?? true}
                  onChange={(e) => dispatch(setChartSettings({ showVertLines: e.target.checked }))}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": { color: "#4CAF50" },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#4CAF50" }
                  }}
                />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ fontSize: "13px", color: "#cbd5e1" }}>Horizontal Grid Lines</Typography>
                <Switch
                  checked={chartSettings?.showHorzLines ?? true}
                  onChange={(e) => dispatch(setChartSettings({ showHorzLines: e.target.checked }))}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": { color: "#4CAF50" },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#4CAF50" }
                  }}
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: "4px" }}>
                <Typography sx={{ fontSize: "13px", color: "#cbd5e1" }}>Grid Lines Color</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <input
                    type="color"
                    value={chartSettings?.gridColor?.startsWith("rgba") ? "#333333" : (chartSettings?.gridColor || "#333333")}
                    onChange={(e) => dispatch(setChartSettings({ gridColor: e.target.value }))}
                    style={{
                      border: "none",
                      outline: "none",
                      width: "28px",
                      height: "28px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      background: "none",
                      padding: 0
                    }}
                  />
                  <Typography sx={{ fontSize: "11px", color: "#9ca3af", textTransform: "uppercase" }}>
                    {chartSettings?.gridColor || "#333333"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box sx={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />

          {/* Background and Layout */}
          <Box>
            <Typography sx={{ fontSize: "11px", fontWeight: "700", color: "#9ca3af", mb: "12px", letterSpacing: "1px" }}>
              BACKGROUND THEME
            </Typography>
            <Box sx={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {[
                { name: "Dark Slate", color: "#0F0F0F" },
                { name: "Midnight Navy", color: "#0a0e17" },
                { name: "Deep Charcoal", color: "#1E1E1E" },
                { name: "Jet Black", color: "#000000" }
              ].map((theme) => (
                <Box
                  key={theme.color}
                  onClick={() => dispatch(setChartSettings({ backgroundColor: theme.color }))}
                  sx={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    background: theme.color === chartSettings?.backgroundColor ? "rgba(76, 175, 80, 0.15)" : "rgba(255, 255, 255, 0.03)",
                    border: `1px solid ${theme.color === chartSettings?.backgroundColor ? "#4CAF50" : "rgba(255, 255, 255, 0.08)"}`,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    "&:hover": {
                      background: "rgba(255, 255, 255, 0.06)",
                      borderColor: "rgba(255, 255, 255, 0.15)"
                    }
                  }}
                >
                  <Box sx={{ width: "12px", height: "12px", borderRadius: "50%", background: theme.color, border: "1px solid rgba(255,255,255,0.2)" }} />
                  <Typography sx={{ fontSize: "11px", fontWeight: "600", color: theme.color === chartSettings?.backgroundColor ? "#4CAF50" : "#cbd5e1" }}>
                    {theme.name}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{
          borderTop: "1px solid rgba(76, 175, 80, 0.15)",
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          background: "rgba(26, 31, 46, 0.4)"
        }}>
          <Button
            onClick={() => dispatch(resetChartSettings())}
            sx={{
              color: "#9ca3af",
              fontSize: "12px",
              fontWeight: "600",
              textTransform: "none",
              "&:hover": { color: "#f44336", background: "none" }
            }}
          >
            Reset Defaults
          </Button>
          <Button
            onClick={() => setSettingsOpen(false)}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #4CAF50, #2E7D32)",
              color: "white",
              fontSize: "12px",
              fontWeight: "700",
              textTransform: "none",
              borderRadius: "8px",
              padding: "6px 18px",
              boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #45a049, #256b29)",
                boxShadow: "0 6px 16px rgba(76, 175, 80, 0.4)"
              }
            }}
          >
            Apply & Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CenterPanel;