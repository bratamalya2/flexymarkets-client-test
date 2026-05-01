import { Box, Divider, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Fade } from '@mui/material';
import { data } from "./tradingSummaryData"
import CustomTooltip from '../../../../components/CustomTooltip';


function TradingSummary() {
    return (
        <Grid container size={12} mt={{ xs: "2rem", sm: 0, md: "3rem" }}>
            {
                data.map((item, i) => (
                    <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                flexDirection: { xs: "row", sm: "column" },
                                mt: { xs: 0, sm: "2rem", md: 0 }
                            }}
                        >
                            <Stack sx={{ flexDirection: "row", alignItems: "center", gap: ".2rem", }}>
                                <Typography color="textSecondary">{item.name}</Typography>
                                <CustomTooltip
                                    title={item.info}
                                    arrow
                                    placement='top'
                                    slots={{
                                        transition: Fade,
                                    }}
                                >
                                    <item.icon fontSize='14px' color="textSecondary" />
                                </CustomTooltip>
                            </Stack>
                            <Typography sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>{item.total} {item.amount && "USD"}</Typography>
                        </Box>
                        <Box mt={{ xs: "1rem", sm: "3rem" }} sx={{ display: "flex", flexDirection: "column", gap: ".3rem" }}>
                            {
                                Object.entries(item.contribution).map(([keys, values], i) => (
                                    <Stack
                                        key={i}
                                        sx={{
                                            flexDirection: "row",
                                            justifyContent: { xs: "space-between", sm: "flex-start" },
                                            gap: '.5rem'
                                        }}
                                    >
                                        <Typography color="textSecondary">{keys}</Typography>
                                        <Typography>{values}</Typography>
                                    </Stack>
                                ))
                            }
                        </Box>
                        {i !== data.length - 1 && <Divider sx={{ my: "1.2rem", display: { sm: "none" } }} />}
                    </Grid>
                ))
            }
        </Grid>
    )
}

export default TradingSummary;