import { Stack, Typography, Box } from "@mui/material";
import { tradeOrTreatLuckyDrawCardsTopPrizeDetails, tradeOrTreatLuckyDrawCardsOtherPrizeDetails } from "./tradeOrTreatLuckyDrawCardsDetails";
import Grid from "@mui/material/Grid2";
import OtherPrizeCarosul from "../otherPrizeCarosul/OtherPrizeCarosul";

function TradeOrTreatLuckyDrawCards() {
  return (
    <Stack mt={"3rem"}>
      <Typography fontWeight={"700"} fontSize={"1.2rem"} mb={"1.2rem"}>Top Prizes</Typography>
      <Grid container size={12} spacing={4} mx={"5rem"}>
        {
          tradeOrTreatLuckyDrawCardsTopPrizeDetails?.map((item) => (
            <Grid
              variant="section"
              item={item?.prizeLevel}
              size={4}
              sx={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                p: 2,
                textAlign: "center",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                // backgroundColor: "#fff",
                boxShadow: "0 2px 6px rgba(0,0,0,0.07)",
                boxSizing: "border-box",
              }}
            >
              <Typography>{item?.prizeLevel}</Typography>
              <Box
                component={"img"}
                src={"/fxfavicon.ico"}
                width={"100%"}
                borderRadius={".7rem"}
                mb={"10px"}
              />
              <Typography>{item?.prizeType}</Typography>
            </Grid>
          ))
        }
      </Grid>
      <Typography fontWeight={"700"} fontSize={"1.2rem"} mt={"2rem"} mb={"1.2rem"}>Other Prizes</Typography>
      {/* <Grid container size={12} spacing={4}>
        {
          tradeOrTreatLuckyDrawCardsOtherPrizeDetails?.map((item) => (
            <Grid
              variant="section"
              item={item?.prizeLevel}
              size={3}
              sx={{
                border: "1px solid black",
                borderRadius: "12px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Typography>{item?.prizeLevel}</Typography>
              <Typography>{item?.prizeType}</Typography>
            </Grid>
          ))
        }
      </Grid> */}
      <OtherPrizeCarosul />
    </Stack>
  )
}

export default TradeOrTreatLuckyDrawCards;