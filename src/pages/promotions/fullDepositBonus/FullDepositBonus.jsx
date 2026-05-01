import { useState } from "react";
import {
  Container,
  Stack,
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  Button
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { fullDepositBonusDetails } from "./fullDepositBonusDetails";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Link } from "react-router-dom";
import FullDepositBonusTable from "./FullDepositBonusTable/FullDepositBonusTable";
import { useDispatch } from "react-redux";
import {
  useAcceptPromotionMutation,
  useGetUserDataQuery
} from "../../../globalState/userState/userStateApis";
import { setNotification } from "../../../globalState/notificationState/notificationStateSlice";

function FullDepositBonus() {
  const dispatch = useDispatch();

  const { data, isLoading: userDataLoading } = useGetUserDataQuery();
  const isPromotionalAllowed =
    !userDataLoading && data?.data?.userData?.isPromotionalAllowed;

  const [acceptPromotion, { isLoading }] = useAcceptPromotionMutation();
  const [isAgreed, setIsAgreed] = useState(false);

  const handleAcceptance = async () => {
    try {
      const response = await acceptPromotion().unwrap();
      if (response?.status) {
        dispatch(
          setNotification({
            open: true,
            message: response?.message,
            severity: "success"
          })
        );
      }
    } catch (error) {
      if (!error?.data?.status) {
        dispatch(
          setNotification({
            open: true,
            message:
              error?.data?.message ||
              "Failed to submit. Please try again later.",
            severity: "error"
          })
        );
      }
    }
  };

  return (
    <Container>
      <Stack sx={{ flexDirection: "row", alignItems: "center", gap: "15px" }}>
        <Box component={Link} to={"/client/promotions"}>
          <KeyboardBackspaceIcon />
        </Box>
        <Typography sx={{ fontSize: "1.5rem", fontWeight: "700" }}>
          100% Deposit Bonus
        </Typography>
      </Stack>

      <Grid container size={12} spacing={4} mt={"2rem"}>
        <Grid size={6}>
          <Box
            component={"img"}
            src={"/fullDepositBonusBanner.jpg"}
            height={"120px"}
            width={"100%"}
            borderRadius={".7rem"}
            mb={"10px"}
          />
          <Typography mb={"10px"} sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
            How it works :-
          </Typography>
          <Stack
            component={"ol"}
            sx={{
              gap: "10px",
              listStyleType: "decimal",
              pl: 2
            }}
          >
            {fullDepositBonusDetails?.map((item, index) => (
              <Typography key={index} component={"li"}>
                {item}
              </Typography>
            ))}
          </Stack>
        </Grid>

        <Grid
          size={6}
          sx={{
            p: "25px",
            borderRadius: ".7rem",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.15)"
          }}
          variant={"section"}
        >
          <Typography>
            Join the Trade or Treat Lucky Draw for your chance to win premium
            Apple gadgets and weekly cash prizes! Simply opt in, deposit, trade,
            and collect tickets to enter the draw.
          </Typography>

          <FormControlLabel
            control={
              <Checkbox
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
              />
            }
            label="I have read and agreed to the Terms and Conditions"
          />

          <Button
            component={isPromotionalAllowed && isAgreed ? Link : "button"}
            to={isPromotionalAllowed ? "/client/transactions/deposit" : undefined}
            variant="contained"
            sx={{ alignSelf: "end" }}
            onClick={handleAcceptance}
            disabled={!isAgreed || isLoading}
          >
            {isPromotionalAllowed ? "Deposit" : "Opt-in Now"}
          </Button>
        </Grid>
      </Grid>

      <FullDepositBonusTable />
    </Container>
  );
}

export default FullDepositBonus;