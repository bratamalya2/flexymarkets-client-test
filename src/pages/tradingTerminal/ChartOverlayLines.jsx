import { useEffect, useState, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";

function ChartOverlayLines() {
  const { selectedSymbol } = useSelector(state => state.terminal);
  const [tradeLines, setTradeLines] = useState({
    currentPrice: 0,
    stopLoss: 0,
    takeProfit: 0,
    pendingOrder: 0,
    isBuyOrder: true
  });

  const chartContainerRef = useRef(null);
  const [chartHeight, setChartHeight] = useState(0);
  const [chartWidth, setChartWidth] = useState(0);
  const [prices, setPrices] = useState([]);

  // Listen for trade line updates from RightPanel
  useEffect(() => {
    const handleTradeLinesUpdate = (event) => {
      if (event.detail?.type === 'TRADE_LINES_UPDATE') {
        const currentPrice = parseFloat(event.detail.currentPrice) || 0;
        const stopLoss = parseFloat(event.detail.stopLoss) || 0;
        const takeProfit = parseFloat(event.detail.takeProfit) || 0;
        const pendingOrder = parseFloat(event.detail.pendingOrder) || 0;
        const isBuyOrder = event.detail.isBuyOrder !== false;
        
        setTradeLines({
          currentPrice,
          stopLoss,
          takeProfit,
          pendingOrder,
          isBuyOrder
        });
      }
    };

    const handlePriceUpdate = (event) => {
      if (event.detail?.type === 'PRICE_UPDATE') {
        setTradeLines(prev => ({
          ...prev,
          currentPrice: parseFloat(event.detail.currentPrice) || prev.currentPrice
        }));
      }
    };

    window.addEventListener('tradeLinesUpdate', handleTradeLinesUpdate);
    window.addEventListener('priceUpdate', handlePriceUpdate);
    
    return () => {
      window.removeEventListener('tradeLinesUpdate', handleTradeLinesUpdate);
      window.removeEventListener('priceUpdate', handlePriceUpdate);
    };
  }, []);

  // Track chart container dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (chartContainerRef.current) {
        setChartHeight(chartContainerRef.current.clientHeight);
        setChartWidth(chartContainerRef.current.clientWidth);
      }
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (chartContainerRef.current) {
      resizeObserver.observe(chartContainerRef.current);
    }
    
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // Generate price levels for visualization
  useEffect(() => {
    if (tradeLines.currentPrice > 0) {
      const priceLevels = [];
      const range = 0.02; // 2% range around current price
      
      // Generate 10 price levels around current price
      for (let i = -5; i <= 5; i++) {
        const price = tradeLines.currentPrice * (1 + (i * range / 5));
        priceLevels.push(price);
      }
      
      setPrices(priceLevels);
    }
  }, [tradeLines.currentPrice]);

  // Calculate vertical position for a given price
  const calculateYPosition = (price) => {
    if (!prices.length || chartHeight === 0) return 0;
    
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    if (maxPrice === minPrice) return chartHeight / 2;
    
    // Price increases from bottom to top (like in trading charts)
    const normalized = (price - minPrice) / (maxPrice - minPrice);
    return chartHeight * (1 - normalized); // Invert so higher prices are at top
  };

  // Format price for display
  const formatPrice = (price) => {
    if (!selectedSymbol || price === 0) return price.toFixed(3);
    
    const digits = selectedSymbol.digits || 5;
    if (selectedSymbol == 'XAUUSD') {
      return price.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
    
    return price.toFixed(digits);
  };

  if (!selectedSymbol) return null;

  // Check which lines should be visible
  const showStopLoss = tradeLines.stopLoss > 0;
  const showTakeProfit = tradeLines.takeProfit > 0;
  const showPendingOrder = tradeLines.pendingOrder > 0;

  return (
    <Box 
      ref={chartContainerRef}
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 100,
        overflow: "hidden",
        animation: "fadeIn 0.5s ease-in"
      }}
    >
      {/* Current Price Line (White Dashed) */}
      {tradeLines.currentPrice > 0 && (
        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            top: calculateYPosition(tradeLines.currentPrice),
            borderTop: "2px dashed rgba(255, 255, 255, 0.6)",
            animation: "pulse 2s infinite"
          }}
        >
          <Box
            sx={{
              position: "absolute",
              right: "10px",
              top: "-12px",
              background: "rgba(255, 255, 255, 0.9)",
              color: "#000",
              padding: "2px 8px",
              borderRadius: "3px",
              fontSize: "11px",
              fontWeight: "bold",
              boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
              animation: "slideInRight 0.3s ease-out"
            }}
          >
            Current: {formatPrice(tradeLines.currentPrice)}
          </Box>
        </Box>
      )}

      {/* Stop Loss Line (Yellow) */}
      {showStopLoss && (
        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            top: calculateYPosition(tradeLines.stopLoss),
            borderTop: "3px solid #FF9800",
            boxShadow: "0 0 10px rgba(255, 152, 0, 0.5)",
            animation: "glow 1.5s infinite alternate"
          }}
        >
          <Box
            sx={{
              position: "absolute",
              left: "10px",
              top: "-14px",
              background: "linear-gradient(135deg, #FF9800, #F57C00)",
              color: "#000",
              padding: "3px 10px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              boxShadow: "0 3px 6px rgba(0,0,0,0.3)",
              animation: "slideInLeft 0.3s ease-out"
            }}
          >
            <Box sx={{ 
              width: "8px", 
              height: "8px", 
              background: "#FFF", 
              borderRadius: "50%",
              animation: "pulse 1s infinite"
            }} />
            Stop Loss: {formatPrice(tradeLines.stopLoss)}
          </Box>
        </Box>
      )}

      {/* Take Profit Line (Green) */}
      {showTakeProfit && (
        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            top: calculateYPosition(tradeLines.takeProfit),
            borderTop: "3px solid #4CAF50",
            boxShadow: "0 0 10px rgba(76, 175, 80, 0.5)",
            animation: "glowGreen 1.5s infinite alternate"
          }}
        >
          <Box
            sx={{
              position: "absolute",
              right: "10px",
              top: "-14px",
              background: "linear-gradient(135deg, #4CAF50, #2E7D32)",
              color: "#FFF",
              padding: "3px 10px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              boxShadow: "0 3px 6px rgba(0,0,0,0.3)",
              animation: "slideInRight 0.3s ease-out"
            }}
          >
            <Box sx={{ 
              width: "8px", 
              height: "8px", 
              background: "#FFF", 
              borderRadius: "50%",
              animation: "pulse 1s infinite"
            }} />
            Take Profit: {formatPrice(tradeLines.takeProfit)}
          </Box>
        </Box>
      )}

      {/* Pending Order Line (Blue) */}
      {showPendingOrder && (
        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            top: calculateYPosition(tradeLines.pendingOrder),
            borderTop: "3px solid #2196F3",
            boxShadow: "0 0 10px rgba(33, 150, 243, 0.5)",
            animation: "glowBlue 1.5s infinite alternate"
          }}
        >
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              top: "-14px",
              background: "linear-gradient(135deg, #2196F3, #0D47A1)",
              color: "#FFF",
              padding: "3px 12px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              boxShadow: "0 3px 6px rgba(0,0,0,0.3)",
              animation: "slideInUp 0.3s ease-out"
            }}
          >
            <Box sx={{ 
              width: "8px", 
              height: "8px", 
              background: "#FFF", 
              borderRadius: "50%",
              animation: "pulse 1s infinite"
            }} />
            Pending: {formatPrice(tradeLines.pendingOrder)}
          </Box>
        </Box>
      )}

      {/* CSS Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideInLeft {
            from { transform: translateX(-20px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          
          @keyframes slideInRight {
            from { transform: translateX(20px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          
          @keyframes slideInUp {
            from { transform: translate(-50%, 10px); opacity: 0; }
            to { transform: translate(-50%, 0); opacity: 1; }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          
          @keyframes glow {
            from { box-shadow: 0 0 5px rgba(255, 152, 0, 0.5); }
            to { box-shadow: 0 0 15px rgba(255, 152, 0, 0.8); }
          }
          
          @keyframes glowGreen {
            from { box-shadow: 0 0 5px rgba(76, 175, 80, 0.5); }
            to { box-shadow: 0 0 15px rgba(76, 175, 80, 0.8); }
          }
          
          @keyframes glowBlue {
            from { box-shadow: 0 0 5px rgba(33, 150, 243, 0.5); }
            to { box-shadow: 0 0 15px rgba(33, 150, 243, 0.8); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          
          .price-bubble {
            animation: float 3s infinite ease-in-out;
          }
        `}
      </style>
    </Box>
  );
}

export default ChartOverlayLines;