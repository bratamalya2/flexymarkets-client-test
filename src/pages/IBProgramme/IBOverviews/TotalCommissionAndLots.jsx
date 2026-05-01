import { Box, Stack, Typography } from "@mui/material";

const data = {
    Commission: "USD 0.00",
    "No. Of Lots": "0.00"
}

function TotalCommissionAndLots() {
    return (
        <Stack sx={{ flexDirection: "row", borderRadius: "5px", gap: "20px", border: theme => `1px solid ${theme.palette.primary.main}`, p: "1rem", mb: "20px" }}>
            {
                Object.entries(data).map(([keys, values]) => (
                    <Box sx={{ display: "flex", gap: "10px" }}>
                        <Typography>{keys}:</Typography>
                        <Typography>{values}</Typography>
                    </Box>
                ))
            }
        </Stack>
    )
}

export default TotalCommissionAndLots;