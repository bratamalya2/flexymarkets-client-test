import { Stack, Typography, useMediaQuery, Button } from '@mui/material'
import Grid from "@mui/material/Grid2"
import { useState } from 'react'
import SetTradingTerminal from './SetTradingTerminal'
import SetDefaultTerminal from './SetDefaultTerminal'
import { Link } from 'react-router-dom'

const SHORT_BRAND_NAME = import.meta.env.VITE_SHORT_BRAND_NAME;

const data = [
  {
    type: "MT5 Accounts",
    value: `${SHORT_BRAND_NAME} Terminal`,
    component: SetTradingTerminal,
    button: true
  },
  {
    type: "MT5 Accounts",
    value: "MetaTrader 5 Terminal",
    component: SetDefaultTerminal,
    button: true
  }
]

function TradingTerminals() {

  const [activeIndex, setActiveIndex] = useState(null);
  const matches = useMediaQuery('(max-width:850px)');

  const navigateToMT5Download = () => {
    window.open("https://www.metatrader5.com/en/download", "_blank");
  }

  return (
    <Stack mt={"2rem"}>
      <Typography fontWeight={700} fontSize={"1.8rem"}>Your terminals</Typography>
      {/* <Typography color="textSecondary">Set the default trading terminal for all your MT5 accounts.</Typography> */}
      <Stack sx={{ border: "1px solid #e2e4e4", mt: "2rem" }}>
        {data.map((item, i) => (
          <Grid
            variant={"section"}
            container
            size={12}
            spacing={2}
            key={i}
            sx={{
              p: "32px 24px",
              border: "1px solid  #e2e4e4"
            }}
          >
            <Grid
              size={matches ? 12 : 4}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Typography color="textSecondary" fontWeight={"500"}>{item.type}</Typography>
            </Grid>
            <Grid
              size={matches ? 12 : activeIndex === i ? 5 : 4}
              sx={{ display: "flex", alignItems: "center" }}
            >
              {activeIndex === i && item.button ? (
                <item.component onClickCancelBtn={() => setActiveIndex(null)} />
              ) : (
                <Typography fontWeight={"500"}>{item.value}</Typography>
              )}
            </Grid>
            {/* {activeIndex !== i && (
              <Grid
                size={matches ? 12 : 4}
                sx={{ display: "flex", justifyContent: "flex-end" }}
              >
                {item.button && (
                  <Button
                    onClick={() => setActiveIndex(i)}
                    variant="contained"
                    fullWidth={matches}
                    sx={{
                      textTransform: "none",
                      boxShadow: "none",
                      fontWeight: "400",
                      fontSize: "16px",
                      px: "2rem",
                      bgcolor: "#f3f5f7",
                      color: "black",
                      alignSelf: "self-end",
                      "&:hover": { boxShadow: "none", bgcolor: "#f3f5f7" }
                    }}
                  >
                    Change
                  </Button>
                )}
              </Grid>
            )} */}
            <Grid
              size={matches ? 12 : 4}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              {item.button && (
                <Button
                  // onClick={() => setActiveIndex(i)}
                  variant="contained"
                  fullWidth={matches}
                  onClick={navigateToMT5Download}
                  sx={{
                    textTransform: "none",
                    boxShadow: "none",
                    fontWeight: "400",
                    fontSize: "16px",
                    px: "2rem",
                    bgcolor: "#f3f5f7",
                    color: "black",
                    alignSelf: "self-end",
                    "&:hover": { boxShadow: "none", bgcolor: "#f3f5f7" }
                  }}
                >
                  Trade
                </Button>
              )}
            </Grid>
          </Grid>
        ))}
      </Stack>
    </Stack>
  )
}

export default TradingTerminals;