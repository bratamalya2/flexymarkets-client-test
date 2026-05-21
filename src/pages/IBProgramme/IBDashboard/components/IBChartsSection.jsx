import Grid from "@mui/material/Grid2";
import IBMonthlyCommissionChart from "./IBMonthlyCommissionChart";
import IBClientTransactionChart from "./IBClientTransactionChart";

function IBChartsSection() {
    return (
        <Grid container spacing={3} sx={{ mt: 3 }}>
            <Grid size={{ xs: 12, md: 6 }}>
                <IBMonthlyCommissionChart />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <IBClientTransactionChart />
            </Grid>
        </Grid>
    );
}

export default IBChartsSection;
