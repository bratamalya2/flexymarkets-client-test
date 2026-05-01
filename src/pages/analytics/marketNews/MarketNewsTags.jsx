import { Box, Stack, Typography } from '@mui/material'

const tags = ["EURUSD", "GBPUSD", "USDJPY", "AUDUSD", "USDCAD", "DollarIndex"]

function MarketNewsTags() {
    return (
        <Stack sx={{ flexDirection: "row", gap: ".5rem", mt: '2rem', alignItems: "center", flexWrap: "wrap" }}>
            <Typography fontSize={"14px"}>Tags :</Typography>
            <Box sx={{ display: 'flex', gap: "1.2rem", flexWrap: "wrap" }}>
                {
                    tags.map((tag, i) => (
                        <Typography
                            border={"1px solid gray"}
                            key={i}
                            fontSize={"13px"}
                            fontWeight={"bold"}
                            display={"flex"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            px={"1rem"}
                            py={".2rem"}
                            borderRadius={"5rem"}
                        >{tag}</Typography>
                    ))
                }
            </Box>
        </Stack>
    )
}

export default MarketNewsTags