import { Button, Typography, Divider, Stack } from "@mui/material";

function TradingSignalDetails({ signal, onBack }) {

    if (!signal) return null;

    return (
        <Stack sx={{ mt: { xs: "0", md: "6rem" }, gap: ".7rem" }}>

            {onBack && (
                <Button
                    onClick={onBack}
                    variant="contained"
                    sx={{
                        textTransform: "capitalize",
                        width: "fit-content",
                        boxShadow: "none",
                        color: "white",
                        mt: '2rem',
                        "&:hover": {
                            boxShadow: "none"
                        }
                    }}
                >⬅ Back</Button>
            )}

            <Stack sx={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Typography fontSize={"1rem"} fontWeight={700}>{signal.pair}</Typography>
                <Typography fontSize={"14px"} color="textSecondary">{signal.time}</Typography>
            </Stack>

            <Stack sx={{ objectFit: "contain" }}>
                <img src="https://charts.tradingcentral.com/charts/gbpchfchf250313095255.gif" alt="Trading Chart" />
            </Stack>

            <Button
                variant='contained'
                sx={{
                    textTransform: "capitalize",
                    boxShadow: "none",
                    color: "white",
                    mt: '1.5rem',
                    "&:hover": {
                        boxShadow: "none"
                    }
                }}
            >Submit</Button>

            <Divider sx={{ mb: 2 }} />

            <Typography variant="body2" fontWeight={600}>Pivot</Typography>
            <Typography variant="body2">1.4410</Typography>

            <Typography variant="body2" fontWeight={600}>Our preference</Typography>
            <Typography variant="body2">
                Short positions below 1.4410 with targets at 1.4350 & 1.4330 in extension.
            </Typography>

            <Typography variant="body2" fontWeight={600}>Alternative scenario</Typography>
            <Typography variant="body2">
                Above 1.4410 look for further upside with 1.4435 & 1.4460 as targets.
            </Typography>

            <Typography variant="body2" fontWeight={600}>Supports and resistances</Typography>
            <Typography variant="body2">
                1.4460<br />
                1.4435<br />
                1.4410<br />
                1.4395 Last<br />
                1.4350<br />
                1.4330<br />
                1.4300
            </Typography>
        </Stack>
    );
}

export default TradingSignalDetails;