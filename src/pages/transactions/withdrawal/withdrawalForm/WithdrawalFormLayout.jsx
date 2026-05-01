import { Container, Stack, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Grid from "@mui/material/Grid2"
import WithdrawalForm from "./WithdrawalForm";
import SelectedWithdrawalMethodDetails from "./SelectedWithdrawalMethodDetails"

function WithdrawalFormLayout() {

    const { selectedTheme } = useSelector(state => state.themeMode);

    const location = useLocation()

    return (
        <Container>
            {/* <Stack>
                <Typography variant='h5' fontWeight={"700"} fontSize={"1.8rem"}>Withdrawal</Typography>
                <Typography
                    component={Link}
                    to={"/client/transactions/withdrawal"}
                    sx={{
                        textDecoration: "none",
                        color: "primary.main",
                        width: "fit-content"
                    }}
                >See all the payment methods</Typography>
            </Stack> */}
            <WithdrawalForm />
            {/* <Grid container size={12} spacing={3} mt={3}>
                <Grid size={{ xs: 12, md: 7 }}><WithdrawalForm /></Grid>
                <Grid
                    size={{ xs: 12, md: 5 }}
                    sx={{
                        borderLeft: { xs: "none", md: "1px solid #bdbdbd" },
                        pl: { xs: 0, md: 3 },
                        height: "100%"
                    }}
                >
                    {isVerified && <SelectedWithdrawalMethodDetails />}
                </Grid>
            </Grid> */}
        </Container >
    );
}

export default WithdrawalFormLayout;