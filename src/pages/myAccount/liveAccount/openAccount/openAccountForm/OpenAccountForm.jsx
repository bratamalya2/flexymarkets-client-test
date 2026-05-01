import { TextField, Button, InputLabel, List, ListItem, IconButton, ListItemText, OutlinedInput, InputAdornment, Stack, Typography, RadioGroup, Radio, FormControlLabel } from "@mui/material";
import Selector from "../../../../../components/Selector"
import Grid from "@mui/material/Grid2";
import { useSelector, useDispatch } from "react-redux";
import { setAccountOpeningType } from "../../../../../globalState/userPanelState/myAccountState/myAccountSlice";
import TabComponent from "../../../../../components/TabComponent";
import { openAccountFormSchema } from "./openAccountFormSchema";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddMT5AccountMutation } from "../../../../../globalState/mt5State/mt5StateApis";
import { setNotification } from "../../../../../globalState/notificationState/notificationStateSlice";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useLocation, useNavigate } from "react-router-dom";
import { useGetUserDataQuery } from "../../../../../globalState/userState/userStateApis";


function OpenAccountForm() {

  const { token } = useSelector((state) => state.auth);
  const { refetch } = useGetUserDataQuery(undefined, {
    skip: !token,
    refetchOnMountOrArgChange: true,
  })

  const navigate = useNavigate()

  const { state } = useLocation()

  let maxLeverage = state?.leverage / 100 || 0

  let step = 100;

  let leverageOptions = Array.from({ length: maxLeverage }, (_, i) => step * (i + 1));

  // const { accountOpeningType } = useSelector((state) => state.myAccount);

  // const dispatch = useDispatch()

  // function handleAccountToggle(newAlignment) {
  //   if (newAlignment) {
  //     dispatch(setAccountOpeningType(newAlignment))
  //   }
  // }


  const dispatch = useDispatch()

  const [showInvestPassword, setShowInvestPassword] = useState(false);
  const [showMainPassword, setShowMainPassword] = useState(false);

  const handleClickShowInvestPassword = () => setShowInvestPassword((show) => !show);
  const handleClickShowMainPassword = () => setShowMainPassword((show) => !show);

  const defaultValues = {
    // group: "Standard",
    groupId: state?.id,
    Leverage: 0,
    PassMain: "",
    // PassInvestor: ""
  };

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(openAccountFormSchema),
    defaultValues
  });

  const mainPasswordValue = watch("PassMain");
  const investorPasswordValue = watch("PassInvestor")

  const mainPasswordIsLengthValid = mainPasswordValue?.length >= 8 && mainPasswordValue.length <= 15;
  const mainPasswordhasUpperLower = /[a-z]/.test(mainPasswordValue) && /[A-Z]/.test(mainPasswordValue);
  const mainPasswordhasNumber = /\d/.test(mainPasswordValue);
  const mainPasswordhasSpecialChar = /[^a-zA-Z0-9]/.test(mainPasswordValue);

  const investorPasswordIsLengthValid = investorPasswordValue?.length >= 8 && investorPasswordValue.length <= 15;
  const investorPasswordhasUpperLower = /[a-z]/.test(investorPasswordValue) && /[A-Z]/.test(investorPasswordValue);
  const investorPasswordhasNumber = /\d/.test(investorPasswordValue);
  const investorPasswordhasSpecialChar = /[^a-zA-Z0-9]/.test(investorPasswordValue);

  const [addMT5Account, { isLoading }] = useAddMT5AccountMutation()

  const onSubmit = async (data) => {

    try {
      const response = await addMT5Account(data).unwrap();

      if (response?.status) {
        refetch()
        navigate("/client")
        dispatch(setNotification({ open: true, message: response?.message, severity: "success" }));
        reset(defaultValues)
      }

    } catch (data) {
      if (!data?.data?.status) {
        dispatch(setNotification({ open: true, message: data?.data?.message || "Failed to submit. Please try again later.", severity: "error" }));
      }
    }

  }


  return (
    <Stack>
      {/* <Stack>
        <TabComponent
          items={["Demo", "Real"]}
          tabSx={{ fontSize: "1rem", width: "50%" }}
          onChange={(_, newAlignment) => handleAccountToggle(newAlignment)}
          active={accountOpeningType}
        />
      </Stack> */}
      {/* <Typography variant="body2" sx={{ mt: 1 }}>Risk-free account. Trade with virtual money.</Typography> */}
      <Grid
        component={"form"}
        container
        size={12}
        spacing={3}
        // mt={"2rem"}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Grid item size={{ xs: 12 }}>
          <InputLabel sx={{ mb: ".2rem", fontSize: "13px" }}>Max leverage *</InputLabel>
          <Selector
            items={leverageOptions}
            shouldBeFullWidth={true}
            value={watch("Leverage")}
            onChange={(e) => setValue("Leverage", e.target.value, { shouldValidate: true })}
          />
          {errors.Leverage && <Typography color="error" fontSize={"14px"}>{errors.Leverage.message}</Typography>}
        </Grid>
        {/* {accountOpeningType === "Demo" && <Grid item size={{ xs: 12 }}>
          <InputLabel sx={{ mb: ".5rem", fontSize: ".9rem" }}>Starting balance *</InputLabel>
          <TextField fullWidth name="balance" type="number" size="small" placeholder="500" />
        </Grid>} */}
        {/* <Grid item size={{ xs: 12 }}>
          <InputLabel sx={{ mb: ".2rem", fontSize: "13px" }}>Currency *</InputLabel>
          <Selector
            items={["USD - United States Dollar", "EUR - Euro", "GBP - British Pound"]}
            shouldBeFullWidth={true}
            value={watch("currency")}
            onChange={(e) => setValue("currency", e.target.value, { shouldValidate: true })}
          />
          {errors.currency && <Typography color="error" fontSize={"14px"}>{errors.currency.message}</Typography>}
        </Grid> */}
        {/* {<Grid item size={{ xs: 12 }}>
          <InputLabel sx={{ mb: ".5rem", fontSize: ".9rem" }}>Execution type</InputLabel>
          <RadioGroup row>
            <FormControlLabel value="female" control={<Radio />} label="Market" checked />
            <FormControlLabel value="male" control={<Radio />} label="Instant" />
          </RadioGroup>
        </Grid>} */}

        {/* <Grid item size={{ xs: 12 }}>
          <InputLabel sx={{ mb: ".5rem", fontSize: ".9rem" }}>Account nickname *</InputLabel>
          <TextField fullWidth placeholder="Standrad" size="small" />
        </Grid> */}
        <Grid item size={{ xs: 12 }}>
          <InputLabel sx={{ mb: ".2rem", fontSize: "13px" }}>Main password *</InputLabel>
          {/* <TextField {...register("PassMain", { required: true })} fullWidth type="password" size="small" /> */}
          <OutlinedInput
            size="small"
            fullWidth
            {...register("PassMain", { required: true })}
            type={showMainPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={`toggle visibility`}
                  onClick={handleClickShowMainPassword}
                  edge="end"
                >
                  {showMainPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
          <Stack sx={{ flexDirection: "row", justifyContent: "space-between" }}>
            <List sx={{ listStyleType: "disc", pl: 2, py: 0 }}>
              <ListItem sx={{ display: "list-item", p: 0 }}>
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: mainPasswordIsLengthValid ? "#4caf50" : "error.main",
                  }}
                >
                  Between 8–15 characters
                </Typography>
              </ListItem>
              <ListItem sx={{ display: "list-item", p: 0 }}>
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: mainPasswordhasUpperLower ? "#4caf50" : "error.main",
                  }}
                >
                  At least one upper and one lower case letter
                </Typography>
              </ListItem>
              <ListItem sx={{ display: "list-item", p: 0 }}>
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: mainPasswordhasNumber ? "#4caf50" : "error.main",
                  }}
                >
                  At least one number
                </Typography>
              </ListItem>
              <ListItem sx={{ display: "list-item", p: 0 }}>
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: mainPasswordhasSpecialChar ? "#4caf50" : "error.main",
                  }}
                >
                  At least one special character
                </Typography>
              </ListItem>
            </List>
            <Typography color="#aeaeae">
              {
                [mainPasswordIsLengthValid, mainPasswordhasUpperLower, mainPasswordhasNumber, mainPasswordhasSpecialChar].filter(Boolean)
                  .length
              }
            </Typography>
          </Stack>
        </Grid>
        {/* <Grid item size={{ xs: 12 }}>
          <InputLabel sx={{ mb: ".2rem", fontSize: "13px" }}>Pass investor *</InputLabel>
          <OutlinedInput
            size="small"
            fullWidth
            {...register("PassInvestor", { required: true })}
            type={showInvestPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={`toggle visibility`}
                  onClick={handleClickShowInvestPassword}
                  edge="end"
                >
                  {showInvestPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
          <Stack sx={{ flexDirection: "row", justifyContent: "space-between" }}>
            <List sx={{ listStyleType: "disc", pl: 2, py: 0 }}>
              <ListItem sx={{ display: "list-item", p: 0 }}>
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: investorPasswordIsLengthValid ? "#4caf50" : "error.main",
                  }}
                >
                  Between 8–15 characters
                </Typography>
              </ListItem>
              <ListItem sx={{ display: "list-item", p: 0 }}>
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: investorPasswordhasUpperLower ? "#4caf50" : "error.main",
                  }}
                >
                  At least one upper and one lower case letter
                </Typography>
              </ListItem>
              <ListItem sx={{ display: "list-item", p: 0 }}>
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: investorPasswordhasNumber ? "#4caf50" : "error.main",
                  }}
                >
                  At least one number
                </Typography>
              </ListItem>
              <ListItem sx={{ display: "list-item", p: 0 }}>
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: investorPasswordhasSpecialChar ? "#4caf50" : "error.main",
                  }}
                >
                  At least one special character
                </Typography>
              </ListItem>
            </List>
            <Typography color="#aeaeae">
              {
                [investorPasswordIsLengthValid, investorPasswordhasUpperLower, investorPasswordhasNumber, investorPasswordhasSpecialChar].filter(Boolean)
                  .length
              }
            </Typography>
          </Stack>
        </Grid> */}
        <Button
          fullWidth
          variant="contained"
          type="submit"
          disabled={isLoading}
          sx={{
            textTransform: "none",
            boxShadow: "none",
            color: "white",
            py: ".6rem",
            mt: "1.5rem",
            "&:hover": {
              boxShadow: "none"
            }
          }}
        >Create an Account</Button>
      </Grid>
    </Stack>
  );
}

export default OpenAccountForm;