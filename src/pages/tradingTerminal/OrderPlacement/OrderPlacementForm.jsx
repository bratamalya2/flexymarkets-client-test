import {
  Box,
  InputLabel,
  Stack,
  OutlinedInput,
  InputAdornment,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Selector from "../../../components/Selector";
import Toggle from "../../../components/Toggle";
import LiveBuySellCard from "./LiveBuySellCard";
import { useLimitTradeRequestMutation, usePlaceOrderMutation } from "../../../globalState/trade/tradeApis";
import { setNotification } from "../../../globalState/notificationState/notificationStateSlice";
import { orderPlacementFormSchema } from "./orderPlacementFormSchema";

const item = ["Regular form", "One-click form", "Risk calculator form"];
const toggleItem = [{ name: "Market" }, { name: "Pending" }];

const decimalRegex = /^\d{0,5}(\.\d{0,2})?$/;

function OrderPlacementForm({ data }) {
  const { orderType } = data || {};

  const dispatch = useDispatch();
  const { selectedSymbol } = useSelector((state) => state.terminal);

  const { activeMT5AccountLogin } = useSelector((state) => state.mt5);

  const [formType, setFormType] = useState(item[0]);
  const [active, setActive] = useState(toggleItem[0]?.name);
  const [openPrice, setOpenPrice] = useState("");

  const defaultValues = {
    symbol: selectedSymbol?.groupedSym,
    volume: "0.01",
    typeFill: "1",
    type: "",
    priceOrder: "",
    login: activeMT5AccountLogin,
    takeProfit: "",
    stopLoss: "",
  };

  const {
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(orderPlacementFormSchema),
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    if (selectedSymbol && activeMT5AccountLogin) {
      reset({
        ...defaultValues,
        symbol: selectedSymbol?.groupedSym,
        login: activeMT5AccountLogin,
      });
    }
  }, [selectedSymbol, activeMT5AccountLogin, reset]);

  const [placeOrder, { isLoading: placeOrderLoading }] = usePlaceOrderMutation();
  const [limitTradeRequest, { isLoading: limitTradeRequestLoading }] = useLimitTradeRequestMutation();

  const currentType = String(watch("type"));
  const isBuy = currentType === "0" || currentType === "2";
  const isSell = currentType === "1" || currentType === "3";

  const handleStep = (field, type, step) => {
    const currentValue = parseFloat(watch(field) || 0);
    let newValue = type === "inc" ? currentValue + step : currentValue - step;
    if (field === "volume") newValue = Math.max(0.01, newValue);
    setValue(field, newValue.toFixed(2), { shouldValidate: true });
  };

  const handleClose = () => {
    if (active === "Pending") setActive("Market");
    setValue("type", "", { shouldValidate: true });
  };

  const handleOpenPrice = (price) => {
    if (!price) return;
    const formatted = Number(price).toFixed(2);
    if (formatted !== watch("priceOrder")) {
      setOpenPrice(formatted);
      setValue("priceOrder", formatted, { shouldValidate: true });
    }
  };

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      volume: String(data.volume * 10000),
    };

    if (active === "Pending") delete payload.typeFill;

    try {
      const response =
        active === "Market"
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
        reset({
          ...defaultValues,
          symbol: selectedSymbol?.groupedSym,
          login: activeMT5AccountLogin,
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

  useEffect(() => {
    if (orderType === "BUY") {
      setValue("type", "0", { shouldValidate: true });
    } else if (orderType === "SELL") {
      setValue("type", "1", { shouldValidate: true });
    } else {
      setValue("type", "", { shouldValidate: true });
    }
  }, [orderType, setValue]);

  useEffect(() => {
    if (active === "Market") setValue("priceOrder", "");
  }, [active, setValue]);

  return (
    selectedSymbol
      ?
      <Stack sx={{ m: "5px" }}>
        <Stack sx={{ flexDirection: "row", alignItems: "center", gap: "5px", py: "10px" }}>
          <Box sx={{ position: "relative", width: "20px", height: "20px", ml: "5px" }}>
            {selectedSymbol?.img2 && (
              <img
                src={selectedSymbol?.img2}
                alt="error"
                width="17px"
                height="17px"
                style={{ borderRadius: "50%", position: "absolute", left: 0, top: 0 }}
              />
            )}
            <img
              src={selectedSymbol?.img1}
              alt="error"
              width="17px"
              height="17px"
              style={{
                borderRadius: "50%",
                position: "absolute",
                right: selectedSymbol?.img2 && "7px",
                top: selectedSymbol?.img2 && "7px",
              }}
            />
          </Box>
          <Typography>{selectedSymbol?.name}</Typography>
        </Stack>

        <LiveBuySellCard
          value={watch("type")}
          onChange={(value) => setValue("type", value, { shouldValidate: true })}
          handleOpenPrice={handleOpenPrice}
          activeTradeType={active}
        />

        <Toggle
          items={toggleItem}
          stackSx={{ mt: "1rem" }}
          toggleButtonSx={{ fontSize: "14px", width: "100%" }}
          toggleButtonGroupSx={{ height: "40px" }}
          active={active}
          onChange={setActive}
        />

        <Stack gap={"5px"} my={"10px"} component={"form"} onSubmit={handleSubmit(onSubmit)}>
          {active === "Pending" && (
            <Controller
              name="priceOrder"
              control={control}
              render={({ field }) => (
                <Box>
                  <InputLabel sx={{ fontSize: "13px", mb: "2px" }}>Open price</InputLabel>
                  <OutlinedInput
                    {...field}
                    fullWidth
                    size="small"
                    onChange={(e) => {
                      if (e.target.value === "" || decimalRegex.test(e.target.value)) {
                        field.onChange(e);
                      }
                    }}
                    endAdornment={
                      <InputAdornment position="end" sx={{ gap: "15px" }}>
                        <Typography fontSize={"13px"}>{isBuy ? "Limit" : "Stop"}</Typography>
                        <RemoveIcon
                          sx={{ width: "1rem", cursor: "pointer" }}
                          onClick={() => handleStep("priceOrder", "dec", 0.01)}
                        />
                        <AddIcon
                          sx={{ width: "1rem", cursor: "pointer" }}
                          onClick={() => handleStep("priceOrder", "inc", 0.01)}
                        />
                      </InputAdornment>
                    }
                  />
                  {errors.priceOrder && (
                    <Typography color="error" fontSize="12px">
                      {errors.priceOrder.message}
                    </Typography>
                  )}
                </Box>
              )}
            />
          )}

          <Controller
            name="volume"
            control={control}
            render={({ field }) => (
              <Box>
                <InputLabel sx={{ fontSize: "13px", mb: "2px" }}>Volume</InputLabel>
                <OutlinedInput
                  {...field}
                  fullWidth
                  size="small"
                  onChange={(e) => {
                    if (e.target.value === "" || decimalRegex.test(e.target.value)) {
                      field.onChange(e);
                    }
                  }}
                  endAdornment={
                    <InputAdornment position="end" sx={{ gap: "15px" }}>
                      <Typography fontSize={"13px"}>Lot</Typography>
                      <RemoveIcon
                        sx={{ width: "1rem", cursor: "pointer" }}
                        onClick={() => handleStep("volume", "dec", 0.01)}
                      />
                      <AddIcon
                        sx={{ width: "1rem", cursor: "pointer" }}
                        onClick={() => handleStep("volume", "inc", 0.01)}
                      />
                    </InputAdornment>
                  }
                />
                {errors.volume && (
                  <Typography color="error" fontSize="12px">
                    {errors.volume.message}
                  </Typography>
                )}
              </Box>
            )}
          />

          <Controller
            name="takeProfit"
            control={control}
            render={({ field }) => (
              <Box>
                <InputLabel sx={{ fontSize: "13px", mb: "2px" }}>Take Profit</InputLabel>
                <OutlinedInput
                  {...field}
                  placeholder="Not set"
                  fullWidth
                  size="small"
                  endAdornment={
                    <InputAdornment position="end" sx={{ gap: "15px" }}>
                      <RemoveIcon sx={{ width: "1rem", cursor: "pointer" }} />
                      <AddIcon sx={{ width: "1rem", cursor: "pointer" }} />
                    </InputAdornment>
                  }
                />
              </Box>
            )}
          />

          <Controller
            name="stopLoss"
            control={control}
            render={({ field }) => (
              <Box>
                <InputLabel sx={{ fontSize: "13px", mb: "2px" }}>Stop Loss</InputLabel>
                <OutlinedInput
                  {...field}
                  placeholder="Not set"
                  fullWidth
                  size="small"
                  endAdornment={
                    <InputAdornment position="end" sx={{ gap: "15px" }}>
                      <RemoveIcon sx={{ width: "1rem", cursor: "pointer" }} />
                      <AddIcon sx={{ width: "1rem", cursor: "pointer" }} />
                    </InputAdornment>
                  }
                />
              </Box>
            )}
          />

          {(isBuy || isSell) && (
            <>
              <Button
                type="submit"
                disabled={!isValid || placeOrderLoading || limitTradeRequestLoading}
                variant="contained"
                sx={{
                  mt: "5px",
                  bgcolor: isBuy ? "green" : "red",
                  "&:hover": { bgcolor: isBuy ? "green" : "red" },
                }}
              >
                {placeOrderLoading || limitTradeRequestLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  `Confirm ${isBuy ? "Buy" : "Sell"} ${watch("volume")} lots`
                )}
              </Button>

              <Button
                onClick={handleClose}
                variant="outlined"
                sx={{
                  mt: "5px",
                  borderColor: isBuy ? "green" : "red",
                  color: "white",
                  "&:hover": {
                    bgcolor: isBuy ? "#83dd8324" : "#ee9f9f94",
                  },
                }}
              >
                Cancel
              </Button>
            </>
          )}
        </Stack>
      </Stack>
      :
      <Typography sx={{ p: "15px" }}>Symbol is not selected</Typography>
  );
}

export default OrderPlacementForm;