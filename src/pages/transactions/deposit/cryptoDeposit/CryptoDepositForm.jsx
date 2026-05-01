import {
  Button,
  Stack,
  Typography,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useDispatch, useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Selector from "../../../../components/Selector";
import { cryptoDepositSchema } from "./cryptoDepositSchema";
import { useGetUserDataQuery } from "../../../../globalState/userState/userStateApis";
import { setNotification } from "../../../../globalState/notificationState/notificationStateSlice";
import { initiatePaymentSocketConnection } from "../../../../socketENV/paymentSocketENV";

const networks = [
  { icon: "token-branded:binance", name: "Binance" },
  { image: "/transactionIcons/USDT_TRC20.svg", name: "Tron" },
];

function CryptoDepositForm({ typeParam }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socketRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const { depositQRData, depositState, hasStarted } = useSelector((state) => state.payment);
  const { token } = useSelector((state) => state.auth);

  const { refetch } = useGetUserDataQuery(undefined, {
    skip: !token,
    refetchOnMountOrArgChange: true,
  });

  const defaultValues = {
    network: "",
    amount: "",
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(cryptoDepositSchema),
    defaultValues,
  });

  useEffect(() => {
    reset({ ...defaultValues, network: typeParam });
  }, [typeParam]);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.cleanup?.();
        socketRef.current = null;
      }
    };
  }, []);

  const onSubmit = async (data) => {
    if (!token) {
      dispatch(
        setNotification({
          open: true,
          message: "Please log in to start a payment.",
          severity: "warning",
        })
      );
      return;
    }

    try {
      if (socketRef.current) {
        dispatch(
          setNotification({
            open: true,
            message: "Payment process already initiated. Please wait...",
            severity: "info",
          })
        );
        return;
      }

      setLoading(true);

      // 

      const result = initiatePaymentSocketConnection({
        token,
        network: data.network.toUpperCase(),
        amount: parseFloat(data.amount),
        dispatch,
        refetch,
        navigate,
        depositQRData,
        hasStarted
      });

      socketRef.current = result;
      setLoading(false);

      reset({ ...defaultValues, network: watch("network") });
    } catch (err) {
      setError(err.message || "An error occurred during payment processing");
      setLoading(false);
    }
  };

  const networkToSelect = networks.filter(
    (item) => item.name === typeParam
  );

  return (
    <Stack component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2} size={12}>
        <Grid size={12}>
          <InputLabel sx={{ mb: "5px", fontSize: "13px" }}>
            Select Network *
          </InputLabel>
          <Selector
            items={typeParam ? networkToSelect : networks}
            value={typeParam ? networkToSelect[0].name : watch("network")}
            onChange={(e) =>
              setValue("network", e.target.value, { shouldValidate: true })
            }
            shouldBeFullWidth
            shouldBeDisabled={!!typeParam}
          />
          {errors.network && (
            <Typography color="error" fontSize="14px">
              {errors.network.message}
            </Typography>
          )}
        </Grid>

        <Grid size={12}>
          <InputLabel sx={{ mb: "5px", fontSize: "13px" }}>Amount *</InputLabel>
          <OutlinedInput
            endAdornment={<InputAdornment position="end">USD</InputAdornment>}
            fullWidth
            placeholder="0.00"
            variant="outlined"
            sx={{ fontWeight: "bold", fontSize: "20px" }}
            {...register("amount")}
          />
          {errors.amount && (
            <Typography color="error" fontSize="14px">
              {errors.amount.message}
            </Typography>
          )}
        </Grid>
      </Grid>

      <Stack
        sx={{
          p: "1rem",
          my: "2rem",
          bgcolor: "#f8f9f9",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography color="black">To be deposited</Typography>
        <Typography fontWeight="bold" fontSize="2rem" color="black">
          {watch("amount") || "0"}
          <Typography
            fontWeight="bold"
            component="span"
            fontSize="1.2rem"
          >
            .00 USD
          </Typography>
        </Typography>
      </Stack>

      <Button
        type="submit"
        variant="contained"
        disabled={loading || depositQRData || hasStarted}
        sx={{
          textTransform: "capitalize",
          boxShadow: "none",
          color: "white",
          fontSize: "16px",
          alignSelf: "flex-start",
          "&:hover": { boxShadow: "none" },
        }}
      >
        {loading
          ? "Connecting..."
          : depositState === "details"
            ? "Continue"
            : "Confirm"}
      </Button>
    </Stack>
  );
}

export default CryptoDepositForm;