import { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, IconButton, CircularProgress, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useSelector, useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { setNotification } from "../../globalState/notificationState/notificationStateSlice";
import { useLimitTradeRequestMutation, usePlaceOrderMutation } from "../../globalState/trade/tradeApis";
import { tradeSchema } from "./tradeSchema";
import { useQuotes } from "../../context/QuotesContext";


function RightPanel() {

  const [activeTab, setActiveTab] = useState("Market");
  const [isBuyOrder, setIsBuyOrder] = useState(true);
  const [priceAnimation, setPriceAnimation] = useState("none");
  const [isPriceManuallySet, setIsPriceManuallySet] = useState(false);

  // Redux state
  const { selectedSymbol } = useSelector((state) => state.terminal);
  const { activeMT5AccountLogin } = useSelector((state) => state.mt5);
  const dispatch = useDispatch();

  // API Mutations
  const [placeOrder, { isLoading: placeOrderLoading }] = usePlaceOrderMutation();
  const [limitTradeRequest, { isLoading: limitTradeRequestLoading }] = useLimitTradeRequestMutation();

  const { quoteData } = useQuotes();

  const currentSymbolPrice = quoteData?.filter(quote => (quote?.Symbol)?.includes(selectedSymbol))[0]

  const defaultValues = {
    symbol: selectedSymbol,
    volume: "0.01",
    typeFill: "1",
    type: "",
    priceOrder: "",
    login: activeMT5AccountLogin,
    priceTp: "",
    priceSl: "",
  };

  const {
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(tradeSchema),
    defaultValues,
    mode: "onChange",
  });

  const currentPrice = selectedSymbol?.ask || 0; // Using ask as current price reference, or we could split bid/ask
  const currentSymbol = selectedSymbol || "Select Symbol";

  // Watch values for controlled inputs
  const volume = watch("volume");
  const pendingPrice = watch("priceOrder");
  const pendingTakeProfit = watch("priceTp");
  const pendingStopLoss = watch("priceSl");
  const currentType = String(watch("type"));

  useEffect(() => {
    if (selectedSymbol && activeMT5AccountLogin) {
      setIsPriceManuallySet(false);
      reset({
        ...defaultValues,
        symbol: selectedSymbol,
        login: activeMT5AccountLogin,
        priceOrder: activeTab === "Limit" ? (currentSymbolPrice?.Ask || "") : "",
      });
    }
  }, [selectedSymbol, activeMT5AccountLogin, reset]);

  // Sync price with live data if not manually set
  useEffect(() => {
    if (activeTab === "Limit" && !isPriceManuallySet && currentSymbolPrice?.Ask) {
      setValue("priceOrder", currentSymbolPrice.Ask, { shouldValidate: true });
    }
  }, [currentSymbolPrice?.Ask, activeTab, isPriceManuallySet, setValue]);

  // Animation for price changes (simple pulse on update)
  useEffect(() => {
    setPriceAnimation("pricePulse 0.5s ease");
    const timer = setTimeout(() => setPriceAnimation("none"), 500);
    return () => clearTimeout(timer);
  }, [selectedSymbol?.ask, selectedSymbol?.bid]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsPriceManuallySet(false);
    reset({
      ...defaultValues,
      symbol: selectedSymbol,
      login: activeMT5AccountLogin,
      priceOrder: tab === "Limit" ? (currentSymbolPrice?.Ask || "") : "",
    });
    // Tab change animation
    const tabs = document.querySelectorAll('.tab-button');
    tabs.forEach(t => t.style.transform = 'scale(1)');
    setTimeout(() => {
      const activeTabEl = document.querySelector(`.tab-button.${tab.toLowerCase()}`);
      if (activeTabEl) {
        activeTabEl.style.transform = 'scale(1.05)';
      }
    }, 10);
  };

  const handleTradeTypeSelect = (type) => {
    setIsBuyOrder(type === "buy");
  };

  // Helper to adjust form values
  const handleStep = (field, type, step) => {
    if (field === "priceOrder") {
      setIsPriceManuallySet(true);
    }
    const priceRef = field === "priceOrder" ? (currentSymbolPrice?.Ask || 0) : 0;
    const currentValue = parseFloat(watch(field) || priceRef);
    let newValue = type === "inc" ? currentValue + step : currentValue - step;
    if (field === "volume") newValue = Math.max(0.01, newValue);
    // For price fields, ensure positive
    if (field !== "volume") newValue = Math.max(0, newValue);

    const digits = field === "volume" ? 2 : (selectedSymbol?.digits || 5);
    setValue(field, newValue.toFixed(digits), { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      volume: String(data.volume * 10000),
    };

    if (activeTab === "Limit") delete payload.typeFill;

    try {
      const response =
        activeTab === "Market"
          ? await placeOrder(payload).unwrap()
          : await limitTradeRequest(payload).unwrap();

      if (response?.status) {
        dispatch(
          setNotification({
            open: true,
            message: response?.message,
            severity: "success",
          })
        );
        setIsPriceManuallySet(false);
        reset({
          ...defaultValues,
          symbol: selectedSymbol,
          login: activeMT5AccountLogin,
          priceOrder: activeTab === "Limit" ? (currentSymbolPrice?.Ask || "") : "",
        });
      }
    } catch (error) {
      dispatch(
        setNotification({
          open: true,
          message: error?.data?.message || "Failed to submit. Please try again later.",
          severity: "error",
        })
      );
    }
  };

  const handleMarketSubmit = (orderType) => {
    // 0 = Buy, 1 = Sell for Market
    const typeValue = orderType === "BUY" ? "0" : "1";
    setValue("type", typeValue, { shouldValidate: true, shouldDirty: true });
    handleSubmit((data) => onSubmit({ ...data, type: typeValue }))();
  };

  const handlePendingSubmit = (tradeType) => {
    // 2 = Buy Limit, 3 = Sell Limit
    const typeValue = tradeType === "BUY" ? "2" : "3";
    setValue("type", typeValue, { shouldValidate: true, shouldDirty: true });
    handleSubmit((data) => onSubmit({ ...data, type: typeValue }))();
  };

  const formatPrice = (price) => {
    if (!price) return "0.000";
    const digits = selectedSymbol?.digits || 5;
    return price.toLocaleString(undefined, {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
  };

  const calculateSpread = () => {
    if (!selectedSymbol) return "0";
    return "2.0";
  };

  // CSS for animations
  const styles = `
      @keyframes panelSlideIn {
        from { transform: translateX(50px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      
      @keyframes fadeInUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      
      @keyframes scanLine {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      
      @keyframes particlesFloat {
        0% { transform: translateY(0) translateX(0); }
        25% { transform: translateY(-10px) translateX(10px); }
        50% { transform: translateY(-20px) translateX(0); }
        75% { transform: translateY(-10px) translateX(-10px); }
        100% { transform: translateY(0) translateX(0); }
      }
      
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
      }
      
      @keyframes pricePulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      
      @keyframes glowGreen {
        from { box-shadow: 0 0 3px #4CAF50; }
        to { box-shadow: 0 0 6px #4CAF50, 0 0 9px #4CAF50; }
      }
      
      @keyframes glowOrange {
        from { box-shadow: 0 0 3px #FF9800; }
        to { box-shadow: 0 0 6px #FF9800, 0 0 9px #FF9800; }
      }
      
      @keyframes pulseButton {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
      }

      /* Floating particles */
      .particle {
        position: absolute;
        background: rgba(76, 175, 80, 0.1);
        border-radius: 50%;
        animation: particleFloat 15s infinite linear;
      }
  `;

  return (
    <Box
      sx={{
        // width: "300px",
        background: "linear-gradient(180deg, #0a0e17 0%, #0f131e 100%)",
        borderLeft: "1px solid rgba(76, 175, 80, 0.1)",
        display: "flex",
        flexDirection: "column",
        color: "#d1d4dc",
        overflow: "hidden",
        boxShadow: "inset 0 0 30px rgba(0,0,0,0.4), 0 0 30px rgba(76, 175, 80, 0.1)",
        position: "relative",
        animation: "panelSlideIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)"
      }}
    >
      <style>{styles}</style>
      <Box sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "radial-gradient(circle at 20% 50%, rgba(76, 175, 80, 0.05) 0%, transparent 50%)",
        pointerEvents: "none",
        animation: "particlesFloat 20s infinite linear"
      }} />

      <Box
        sx={{
          p: "15px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          position: "relative",
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            background: "linear-gradient(180deg, #4CAF50, #2E7D32)",
            borderRadius: "2px",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            background: "rgba(26, 31, 46, 0.8)",
            borderRadius: "6px",
            overflow: "hidden",
            border: "1px solid rgba(76, 175, 80, 0.2)",
            marginBottom: "15px",
            position: "relative",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            backdropFilter: "blur(10px)"
          }}
        >
          {["Market", "Limit"].map((tab) => (
            <Box
              key={tab}
              className={`tab-button ${tab.toLowerCase()}`}
              sx={{
                flex: 1,
                padding: "10px",
                textAlign: "center",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "600",
                color: activeTab === tab ? "white" : "#9ca3af",
                background: activeTab === tab
                  ? "linear-gradient(135deg, #4CAF50, #2E7D32)"
                  : "transparent",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
                overflow: "hidden",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                "&:hover": {
                  color: "white",
                  background: activeTab === tab
                    ? "linear-gradient(135deg, #4CAF50, #2E7D32)"
                    : "rgba(76, 175, 80, 0.1)",
                },
              }}
              onClick={() => handleTabChange(tab)}
            >
              {tab}
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            background: "rgba(26, 31, 46, 0.7)",
            borderRadius: "8px",
            p: "15px",
            flex: 1,
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            border: "1px solid rgba(76, 175, 80, 0.1)",
            position: "relative",
            overflow: "hidden",
            backdropFilter: "blur(5px)",
          }}
        >
          {/* Header Info */}
          <Box
            sx={{
              textAlign: "center",
              mb: "15px",
              pb: "10px",
              borderBottom: "1px solid rgba(76, 175, 80, 0.2)",
            }}
          >
            <Typography sx={{ fontSize: "18px", fontWeight: "700", color: "white", mb: "3px" }}>
              {currentSymbol}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <Stack sx={{ flexDirection: "row", alignItems: "center", gap: "10px" }}>
                <Typography>Buy</Typography>
                <Typography
                  sx={{
                    fontSize: "24px",
                    fontWeight: "800",
                    background: "linear-gradient(135deg, #4CAF50, #8BC34A)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    animation: priceAnimation
                  }}
                >
                  {currentSymbolPrice?.Ask || "0.00"}
                </Typography>
              </Stack>
              <Stack sx={{ flexDirection: "row", alignItems: "center", gap: "10px" }}>
                <Typography>Sell</Typography>
                <Typography
                  sx={{
                    fontSize: "24px",
                    fontWeight: "800",
                    background: "linear-gradient(135deg, #f44336, #E53935)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    animation: priceAnimation
                  }}
                >
                  {currentSymbolPrice?.Bid || "0.00"}
                </Typography>
              </Stack>
            </Box>
            {/* <Typography sx={{ fontSize: "11px", color: "#9ca3af", mt: "3px" }}>
              Spread: {calculateSpread()} pips
            </Typography> */}
          </Box>

          <Box
            component={"form"}
            sx={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {/* Open Price (Only for Pending) */}
            {activeTab === "Limit" && (
              <Box>
                <Typography sx={{ fontSize: "11px", color: "#9ca3af", mb: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Box sx={{ width: "4px", height: "4px", background: "#2196F3", borderRadius: "50%" }} />
                  Open Price
                </Typography>
                <Controller
                  name="priceOrder"
                  control={control}
                  render={({ field }) => (
                    <Box sx={{
                      display: "flex", alignItems: "center",
                      background: "rgba(14, 18, 28, 0.8)",
                      border: "1px solid rgba(33, 150, 243, 0.2)",
                      borderRadius: "6px", overflow: "hidden",
                      "&:hover": { borderColor: "#2196F3" }
                    }}>
                      <TextField
                        {...field}
                        onChange={(e) => {
                          setIsPriceManuallySet(true);
                          field.onChange(e);
                        }}
                        size="small"
                        type="number"
                        step="0.001"
                        placeholder={formatPrice(currentSymbolPrice?.Ask) || "0.000"}
                        // inputProps={{ style: { color: "white", padding: "8px 4px", fontSize: "13px", fontWeight: "600", height: "20px" } }}
                        sx={{ flex: 1, "& fieldset": { border: "none" } }}
                      />
                      <Box>
                        <IconButton onClick={() => handleStep("priceOrder", "inc", 0.01)} size="small" sx={{ color: "#2196F3", borderRadius: 0, p: 0.5 }}><AddIcon fontSize="small" /></IconButton>
                        <IconButton onClick={() => handleStep("priceOrder", "dec", 0.01)} size="small" sx={{ color: "#f44336", borderRadius: 0, p: 0.5 }}><RemoveIcon fontSize="small" /></IconButton>
                      </Box>
                    </Box>
                  )}
                />
                {errors.priceOrder && <Typography color="error" fontSize="10px">{errors.priceOrder.message}</Typography>}
              </Box>
            )}

            {/* Volume Input (Common) */}
            <Box>
              <Typography sx={{ fontSize: "11px", color: "#9ca3af", mb: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                <Box sx={{ width: "4px", height: "4px", background: "#2196F3", borderRadius: "50%" }} />
                Volume (Lots)
              </Typography>
              <Controller
                name="volume"
                control={control}
                render={({ field }) => (
                  <Box sx={{
                    display: "flex", alignItems: "center",
                    background: "rgba(14, 18, 28, 0.8)",
                    border: "1px solid rgba(33, 150, 243, 0.2)",
                    borderRadius: "6px", overflow: "hidden",
                    "&:hover": { borderColor: "#2196F3" }
                  }}>
                    <TextField
                      {...field}
                      size="small"
                      type="number"
                      step="0.01"
                      // inputProps={{ style: { color: "white", textAlign: "center", fontSize: "13px", fontWeight: "600", height: "20px" } }}
                      sx={{ flex: 1, "& fieldset": { border: "none" } }}
                    />
                    <Box>
                      <IconButton onClick={() => handleStep("volume", "inc", 0.01)} size="small" sx={{ color: "#2196F3", borderRadius: 0, p: 0.5 }}><AddIcon fontSize="small" /></IconButton>
                      <IconButton onClick={() => handleStep("volume", "dec", 0.01)} size="small" sx={{ color: "#f44336", borderRadius: 0, p: 0.5 }}><RemoveIcon fontSize="small" /></IconButton>
                    </Box>
                  </Box>
                )}
              />
              {errors.volume && <Typography color="error" fontSize="10px">{errors.volume.message}</Typography>}
            </Box>

            {/* Take Profit */}
            <Box>
              <Typography sx={{ fontSize: "11px", color: "#4CAF50", fontWeight: 600, mb: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                <Box sx={{ width: "4px", height: "4px", background: "#4CAF50", borderRadius: "50%", animation: "glowGreen 1s infinite alternate" }} />
                Take Profit
              </Typography>
              <Controller
                name="priceTp"
                control={control}
                render={({ field }) => (
                  <Box sx={{
                    display: "flex", alignItems: "center",
                    background: "rgba(14, 18, 28, 0.8)",
                    border: "1px solid rgba(76, 175, 80, 0.2)",
                    borderRadius: "6px", overflow: "hidden",
                    "&:hover": { borderColor: "#4CAF50" }
                  }}>
                    <TextField
                      {...field}
                      size="small"
                      type="number"
                      step="0.001"
                      placeholder="Not set"
                      // inputProps={{ style: { color: field.value ? "#4CAF50" : "#9ca3af", padding: "8px 4px", fontSize: "13px", fontWeight: "600", height: "20px" } }}
                      sx={{ flex: 1, "& fieldset": { border: "none" } }}
                    />
                    <Box>
                      <IconButton onClick={() => handleStep("priceTp", "inc", 0.01)} size="small" sx={{ color: "#4CAF50", borderRadius: 0, p: 0.5 }}><AddIcon fontSize="small" /></IconButton>
                      <IconButton onClick={() => handleStep("priceTp", "dec", 0.01)} size="small" sx={{ color: "#f44336", borderRadius: 0, p: 0.5 }}><RemoveIcon fontSize="small" /></IconButton>
                    </Box>
                  </Box>
                )}
              />
            </Box>

            {/* Stop Loss */}
            <Box>
              <Typography sx={{ fontSize: "11px", color: "#FF9800", fontWeight: 600, mb: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                <Box sx={{ width: "4px", height: "4px", background: "#FF9800", borderRadius: "50%", animation: "glowOrange 1s infinite alternate" }} />
                Stop Loss
              </Typography>
              <Controller
                name="priceSl"
                control={control}
                render={({ field }) => (
                  <Box sx={{
                    display: "flex", alignItems: "center",
                    background: "rgba(14, 18, 28, 0.8)",
                    border: "1px solid rgba(255, 152, 0, 0.2)",
                    borderRadius: "6px", overflow: "hidden",
                    "&:hover": { borderColor: "#FF9800" }
                  }}>
                    <TextField
                      {...field}
                      size="small"
                      type="number"
                      step="0.001"
                      placeholder="Not set"
                      // inputProps={{ style: { color: field.value ? "#FF9800" : "#9ca3af", padding: "8px 4px", fontSize: "13px", fontWeight: "600", height: "20px" } }}
                      sx={{ flex: 1, "& fieldset": { border: "none" } }}
                    />
                    <Box>
                      <IconButton onClick={() => handleStep("priceSl", "inc", 0.01)} size="small" sx={{ color: "#FF9800", borderRadius: 0, p: 0.5 }}><AddIcon fontSize="small" /></IconButton>
                      <IconButton onClick={() => handleStep("priceSl", "dec", 0.01)} size="small" sx={{ color: "#f44336", borderRadius: 0, p: 0.5 }}><RemoveIcon fontSize="small" /></IconButton>
                    </Box>
                  </Box>
                )}
              />
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", mt: "8px" }}>
              <Button
                onClick={() => activeTab === "Market" ? handleMarketSubmit("BUY") : handlePendingSubmit("BUY")}
                disabled={placeOrderLoading || limitTradeRequestLoading}
                sx={{
                  padding: "10px 8px",
                  borderRadius: "6px",
                  fontWeight: "700",
                  fontSize: "12px",
                  background: "linear-gradient(135deg, #4CAF50, #2E7D32)",
                  color: "white",
                  boxShadow: "0 2px 8px rgba(76, 175, 80, 0.3)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #2E7D32, #4CAF50)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(76, 175, 80, 0.4)"
                  }
                }}
              >
                {placeOrderLoading || limitTradeRequestLoading ? <CircularProgress size={20} color="inherit" /> : (activeTab === "Market" ? "BUY MARKET" : "BUY LIMIT")}
              </Button>
              <Button
                onClick={() => activeTab === "Market" ? handleMarketSubmit("SELL") : handlePendingSubmit("SELL")}
                disabled={placeOrderLoading || limitTradeRequestLoading}
                sx={{
                  padding: "10px 8px",
                  borderRadius: "6px",
                  fontWeight: "700",
                  fontSize: "12px",
                  background: "linear-gradient(135deg, #f44336, #c62828)",
                  color: "white",
                  boxShadow: "0 2px 8px rgba(244, 67, 54, 0.3)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #c62828, #f44336)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(244, 67, 54, 0.4)"
                  }
                }}
              >
                {placeOrderLoading || limitTradeRequestLoading ? <CircularProgress size={20} color="inherit" /> : (activeTab === "Market" ? "SELL MARKET" : "SELL LIMIT")}
              </Button>
            </Box>

            {/* Clear Form */}
            <Button
              onClick={() => reset({
                ...defaultValues,
                symbol: selectedSymbol,
                login: activeMT5AccountLogin,
                priceOrder: activeTab === "Limit" ? (currentSymbolPrice?.Ask || "") : "",
              })}
              fullWidth
              sx={{
                background: "rgba(55, 65, 81, 0.5)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.1)",
                padding: "8px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: "600",
                "&:hover": {
                  background: "rgba(76, 175, 80, 0.2)",
                }
              }}
            >
              Clear Form
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default RightPanel;