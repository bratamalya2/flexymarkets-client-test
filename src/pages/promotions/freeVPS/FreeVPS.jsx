import { Container, Stack, Box, Typography, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Link } from "react-router-dom";
import FreeVPSTable from "./freeVPSTable/FreeVPSTable";
// import FullDepositBonusTable from "./FullDepositBonusTable/FullDepositBonusTable";


const SHORT_BRAND_NAME = import.meta.env.VITE_SHORT_BRAND_NAME;

function FreeVPS() {
    return (
        <Container>
            <Stack sx={{ flexDirection: "row", alignItems: "center", gap: "15px" }}>
                <Box component={Link} to={"/client/promotions"}><KeyboardBackspaceIcon /></Box>
                <Typography sx={{ fontSize: "1.5rem", fontWeight: "700" }}>
                    Free VPS
                </Typography>
            </Stack>
            <Grid container size={12} spacing={4} mt={"2rem"}>
                <Grid size={6}>
                    <Box
                        component={"img"}
                        src={"/freeVPSBanner.jpg"}
                        height={"120px"}
                        width={"100%"}
                        borderRadius={".7rem"}
                        mb={"10px"}
                    />
                    <Typography mb={"10px"} sx={{ fontWeight: 700, fontSize: "1.1rem" }}>How it works :-</Typography>
                    <Typography>
                        Experience uninterrupted trading with free VPS hosting when you trade with {SHORT_BRAND_NAME}.

                        Deposit a minimum of USD$1,000 and trade with {SHORT_BRAND_NAME} to claim your VPS fees. Earn up to USD$25 refund when you make USD$0.5 million closed trades or USD$50 refund when you make USD$1 million closed trades monthly.
                    </Typography>
                </Grid>
                <Grid
                    variant={"section"}
                    size={6}
                    sx={{ p: "25px", borderRadius: ".7rem", display: "flex", flexDirection: "column", gap: "10px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.15)" }}
                >
                    <Typography>Trade requirements must be met within the VPS period indicated in the invoice submitted. Refunds will be processed within 10 days at the beginning of each calendar month after the end of the VPS billing cycle.</Typography>
                    <Typography>Terms and Conditions</Typography>
                    <Typography>Submit your monthly VPS invoice here.</Typography>
                    <Button variant="contained" sx={{ alignSelf: "end" }}>Submit New Application</Button>
                </Grid>
            </Grid>
            <FreeVPSTable />
        </Container>
    )
}

export default FreeVPS;