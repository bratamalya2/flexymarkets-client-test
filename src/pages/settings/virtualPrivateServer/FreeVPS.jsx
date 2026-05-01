import { Box, Stack, Typography, Divider } from "@mui/material";
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';
import Grid from "@mui/material/Grid2"

function FreeVPS() {
    return (
        <Stack
            sx={{
                border: "1px solid #e2e4e4",
                borderRadius: "1rem",
                p: "1.5rem"
            }}>
            <Box
                sx={{
                    display: "flex",
                    gap: "10px",
                    mb: "10px"
                }}
            >
                <ErrorOutlinedIcon sx={{ color: "#ffd35d" }} />
                <Typography fontWeight={700}>You do not currently qualify for a free VPS</Typography>
            </Box>
            <Typography fontSize={"14px"}>To qualify for a free VPS, you need to meet one of the following criteria:</Typography>
            <Box
                sx={{
                    display: 'flex',
                    gap: "10px",
                    mt: "1rem"
                }}
            >
                <Typography
                    sx={{
                        height: "20px",
                        width: '20px',
                        border: '1px solid black',
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "100%",
                        fontSize: "12px",
                        flexShrink: 0
                    }}
                >1</Typography>
                <Typography>
                    Your balance across all your trading accounts needs to be at least 2,000 USD to immediately qualify for a free VPS. If your balance is between 500–1,999 USD, you can still get a free VPS if you meet the trading volume requirements below.
                </Typography>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    mt: "1rem",
                    gap: ".5rem",
                    alignItems: "center"
                }}
            >
                <Typography fontSize={"13px"}>Balance required:</Typography>
                <Typography fontWeight={700}>2,000 USD</Typography>
            </Box>
            <Divider sx={{ borderBottomWidth: ".5rem", borderRadius: "2rem", my: "1rem", borderColor: "#f6f6f6" }} />
            <Typography color="textSecondary" fontSize={"13px"}>0 USD</Typography>
            <Typography my={"1rem"}>OR</Typography>
            <Box
                sx={{
                    display: 'flex',
                    gap: "10px"
                }}
            >
                <Typography
                    sx={{
                        height: "20px",
                        width: '20px',
                        border: '1px solid black',
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "100%",
                        fontSize: "12px",
                        flexShrink: 0
                    }}
                >2</Typography>
                <Typography>
                    Your balance across all your trading accounts needs to be at least 2,000 USD to immediately qualify for a free VPS. If your balance is between 500–1,999 USD, you can still get a free VPS if you meet the trading volume requirements below.
                </Typography>
            </Box>
            <Grid
                container
                size={12}
                spacing={4}
                mt={"2rem"}
            >
                <Grid size={6}>
                    <Stack sx={{ flexDirection: 'row', gap: "5px", alignItems: 'center' }}>
                        <Typography fontSize={"12px"}>Balance required:</Typography>
                        <Typography fontWeight={"bold"}>500 USD</Typography>
                    </Stack>
                    <Divider sx={{ borderBottomWidth: ".5rem", borderRadius: "2rem", my: "1rem", borderColor: "#f6f6f6" }} />
                    <Grid container>
                        <Grid size={3} fontSize={"12px"} color="textSecondary">0 USD</Grid>
                        <Grid size={3} fontSize={"12px"} color="textSecondary">500 USD</Grid>
                        <Grid
                            size={6}
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                fontSize: "12px",
                                color: "textSecondary"
                            }}
                        >2,000 USD</Grid>
                    </Grid>
                </Grid>
                <Grid size={6}>
                    <Stack sx={{ flexDirection: 'row', gap: "5px", alignItems: 'center' }}>
                        <Typography fontSize={"12px"}>Trading Volume required:</Typography>
                        <Typography fontWeight={"bold"}>1,500,000 USD</Typography>
                    </Stack>
                    <Divider sx={{ borderBottomWidth: ".5rem", borderRadius: "2rem", my: "1rem", borderColor: "#f6f6f6" }} />
                    <Grid container>
                        <Grid size={6} fontSize={"12px"} color="textSecondary">0 USD</Grid>
                        <Grid
                            size={6}
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                fontSize: "12px",
                                color: "textSecondary"
                            }}
                        >1,500,000 USD</Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Typography
                sx={{
                    color: "#1172cc",
                    fontSize: "14px",
                    mt: "1rem",
                    cursor: "pointer"
                }}
            >More about VPS requirements</Typography>
        </Stack>
    )
}

export default FreeVPS;