import { Card, CardContent, Stack, Typography } from "@mui/material"
import { accountSummaryCardsData } from "./accountSummaryCardsData";
import Grid from "@mui/material/Grid2"
import { useSelector } from "react-redux";


function AccountSummaryCards() {

  const { selectedTheme } = useSelector((state) => state.themeMode)

  return (
    <Stack>
      <Grid container size={12} spacing={2}>
        {
          accountSummaryCardsData.map((data, i) => (
            <Grid size={{ xs: 6, sm: 3 }}>
              <Card sx={{ boxShadow: "none", borderRadius: "1.2rem", bgcolor: selectedTheme !== "dark" && "#f5f5f5" }} key={i}>
                <CardContent sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                  <Typography variant="body3">{data.type && "$"}{data.total}</Typography>
                  <Typography variant="body1" fontWeight={"bold"} color="textSecondary" textAlign={"center"}>{data.heading}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        }
      </Grid>
    </Stack>
  )
}

export default AccountSummaryCards;