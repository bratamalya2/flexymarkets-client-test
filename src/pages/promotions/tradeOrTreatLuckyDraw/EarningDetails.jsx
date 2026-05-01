import { Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

function EarningDetails() {
    return (
        <Grid container size={12} sx={{ mt: "3rem", border: "1px solid" }} spacing={4} variant="section">
            <Grid size={5} sx={{ borderRight: "1px solid", textAlign: "center" }}>
                <Typography>Earned Tickets</Typography>
                <Typography>0</Typography>
            </Grid>
            <Grid container size={7} sx={{ display: "flex", flexDirection: "column" }}>
                <Typography>Requirement</Typography>
                <Stack sx={{ flexDirection: "row", gap: "5rem" }}>
                    <Stack>
                        <Typography>Gross Deposit (USD)</Typography>
                        <Typography>0 / 500</Typography>
                    </Stack>
                    <Stack>
                        <Typography>Notional Volume (Closed Trades, USD)</Typography>
                        <Typography>0 / 100,000</Typography>
                    </Stack>
                </Stack>
            </Grid>
        </Grid>
    )
}

export default EarningDetails;