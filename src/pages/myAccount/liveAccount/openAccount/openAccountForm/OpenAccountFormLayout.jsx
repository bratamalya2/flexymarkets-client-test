import { Box, Container, Stack, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import OpenAccountForm from "./OpenAccountForm";
import SelectedPlanTypeAndDetails from "./SelectedPlanTypeAndDetails";
import Grid from "@mui/material/Grid2"

function OpenAccountFormLayout() {

    const { selectedTheme } = useSelector(state => state.themeMode);

    return (
        <Container>
            <Stack sx={{ flexDirection: "row", gap: "1.2rem", alignItems: "center" }}>
                <Link to={"/client/newAccount"} style={{ color: selectedTheme === "dark" ? "white" : "black", lineHeight: "0", fontSize: "1.5rem" }}>
                    <ArrowBackIcon />
                </Link>
                <Typography sx={{ fontSize: "2rem", fontWeight: "700" }}>Open New Account</Typography>
            </Stack>
            <Grid container size={12} spacing={3} mt={"2rem"} direction={{ xs: "column-reverse", md: "row" }}>
                <Grid size={{ xs: 12, md: 7 }}><OpenAccountForm /></Grid>
                <Grid
                    size={{ xs: 12, md: 5 }}
                    sx={{
                        borderLeft: { xs: "none", md: "1px solid #bdbdbd" },
                        pl: { xs: 0, md: 3 },
                        height: "100%"
                    }}
                >
                    <SelectedPlanTypeAndDetails />
                </Grid>
            </Grid>
            <Box
                sx={{
                    display: "flex",
                    p: 2.5,
                    gap: ".5rem",
                    mt: "2rem",
                    bgcolor: "#e8f3fe",
                    border: "1px solid #bedefd",
                    borderRadius: "10px"
                }}
            >
                <InfoOutlinedIcon sx={{ color: "primary.main" }} />
                <Typography color="black">Detailed information on our instruments and trading conditions can be found on the <Typography sx={{ color: "primary.main" }} component={Link}>Contract Specifications</Typography> page.</Typography>
            </Box>
        </Container >
    );
}

export default OpenAccountFormLayout;