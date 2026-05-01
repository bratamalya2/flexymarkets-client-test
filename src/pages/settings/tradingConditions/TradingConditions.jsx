import { Box, Stack, Typography } from "@mui/material"
import Grid from "@mui/material/Grid2"
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import ModalComponent from "../../../components/ModalComponent"
import NegativeBalanceProtectionModalContent from "./NegativeBalanceProtectionModalContent"
import SwapFreeModalContent from "./SwapFreeModalContent"
import { useSelector } from "react-redux"


const data = [
  {
    heading: "Negative Balance Protection",
    content: "You can never lose more money than you put into your account. If a stop out causes all your positions to close in a negative balance, we will restore it to 0.",
    icon: KeyboardArrowRightIcon,
    modal: NegativeBalanceProtectionModalContent
  },
  {
    heading: "Swap-Free",
    content: "No more overnight charges on selected instruments. Trade popular instruments without paying swaps. Qualification for swap-free status depends on your trading activity.",
    specification: "Qualified",
    icon: KeyboardArrowRightIcon,
    modal: SwapFreeModalContent
  }
]

function TradingConditions() {

  const { selectedTheme } = useSelector((state) => state.themeMode);

  return (
    <Stack mt={"2rem"}>
      <Typography fontWeight={700} fontSize={"1.8rem"}>Trading Conditions</Typography>
      <Typography color="textSecondary">Here's a list of the better-than-market trading conditions you can currently enjoy on your accounts.</Typography>
      <Grid
        container
        size={12}
        spacing={4}
        sx={{ mt: "2rem" }}
      >
        {
          data.map((item, i) => (
            <Grid
              variant={"section"}
              key={i}
              size={{ xs: 12, sm: 6 }}
              sx={{
                border: "1px solid #e2e4e4",
                borderRadius: "10px",
                p: "20px"
              }}
            >
              <Stack sx={{ mb: "1.2rem", flexDirection: "row", alignItems: "center", gap: "1rem", justifyContent: "space-between" }}>
                <Typography fontWeight={700} fontSize={"1.4rem"}>{item.heading}</Typography>
                {item.specification &&
                  <Typography
                    sx={{
                      fontSize: "14px",
                      color: "#29834e",
                      p: "2px 10px",
                      borderRadius: "5rem",
                      bgcolor: "#d9ede2"
                    }}
                  >{item.specification}</Typography>}
              </Stack>
              <Typography>{item.content}</Typography>
              <Box sx={{ float: "right", mt: "1.5rem" }}>
                <ModalComponent modalWidth={{ xs: "90%", sm: 600 }} btnName={item.icon} type="icon" Content={item.modal} />
              </Box>
            </Grid>
          ))
        }
      </Grid>
    </Stack>
  )
}

export default TradingConditions;