import { Container, Stack, Box, Typography, FormControl, RadioGroup, FormControlLabel, Radio, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Link } from "react-router-dom";
import TradeOrTreatLuckyDrawCards from "./tradeOrTreatLuckyDrawCards/TradeOrTreatLuckyDrawCards";
import EarningDetails from "./EarningDetails"

const SHORT_BRAND_NAME = import.meta.env.VITE_SHORT_BRAND_NAME;

function TradeOrTreatLuckyDraw() {
    return (
        <Container>
            <Stack sx={{ flexDirection: "row", alignItems: "center", gap: "15px" }}>
                <Box component={Link} to={"/client/promotions"}><KeyboardBackspaceIcon /></Box>
                <Typography sx={{ fontSize: "1.5rem", fontWeight: "700" }}>
                    Trade Or Treat Lucky Draw
                </Typography>
            </Stack>
            <Grid container size={12} spacing={4} mt={"2rem"}>
                <Grid size={6}>
                    <Box
                        component={"img"}
                        src={"/nodeposit.jpg"}
                        height={"120px"}
                        width={"100%"}
                        borderRadius={".7rem"}
                        mb={"10px"}
                    />
                    <Typography mb={"10px"} sx={{ fontWeight: 700, fontSize: "1.1rem" }}>How it works :-</Typography>
                    <Typography>Win the latest Apple gadgets in {SHORT_BRAND_NAME} Trade or Treat Lucky Draw — deposit, trade, and collect tickets!</Typography>
                </Grid>
                <Grid
                    variant="section"
                    size={6}
                    sx={{ p: "25px", borderRadius: ".7rem", display: "flex", flexDirection: "column", gap: "8px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.15)" }}
                >
                    <Typography>Join the Trade or Treat Lucky Draw for your chance to win premium Apple gadgets and weekly cash prizes! Simply opt in, deposit, trade, and collect tickets to enter the draw.</Typography>
                    <FormControl>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue="female"
                            name="radio-buttons-group"
                        >
                            <FormControlLabel
                                value="agree"
                                control={<Radio />}
                                label="I have read and agreed to the Terms and Conditions"
                            />
                        </RadioGroup>
                    </FormControl>
                    <Button variant="contained" sx={{ alignSelf: "end" }}>Opt-in Now</Button>
                </Grid>
            </Grid>
            <EarningDetails />
            <TradeOrTreatLuckyDrawCards />
        </Container>
    )
}

export default TradeOrTreatLuckyDraw;