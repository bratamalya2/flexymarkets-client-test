import { Box, Stack, Typography } from "@mui/material";

function SelectedWithdrawalMethodDetails() {
    return (
        <Stack gap={"2rem"}>
            <Box>
                <Typography mb={".5rem"} fontWeight={"bold"}>Term</Typography>
                <Typography color="#9b9b9b" fontSize={".9rem"} >Average payment time <Typography component={"span"} color="black" fontSize={".9rem"}>Instant</Typography></Typography>
                <Typography color="#9b9b9b" fontSize={".9rem"} >Fee <Typography component={"span"} color="black" fontSize={".9rem"}>0%</Typography></Typography>
            </Box>
            <Box>
                <Typography mb={".5rem"} fontWeight={"bold"}>FAQ</Typography>
                <Stack>
                    <Typography color="#9b9b9b" fontSize={".9rem"}>Getting started with Binance Pay</Typography>
                    <Typography color="#9b9b9b" fontSize={".9rem"}>How do I withdraw with Binance Pay?</Typography>
                </Stack>
            </Box>
        </Stack>
    )
}

export default SelectedWithdrawalMethodDetails