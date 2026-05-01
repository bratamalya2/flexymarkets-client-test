import Grid from "@mui/material/Grid2";
import IBTeamPerformance from "./IBTeamPerformance";
import PerformanceAnalytics from "./PerformanceAnalytics ";

function IBPerformaneAndPerformanceAnalytics() {
    return (
        <Grid
            container
            size={12}
            spacing={2}
            mt={"2rem"}
        >
            <Grid size={{ xs: 12, lg: 6 }}><PerformanceAnalytics /></Grid>
            <Grid size={{ xs: 12, lg: 6 }}><IBTeamPerformance /></Grid>
        </Grid>
    )
}

export default IBPerformaneAndPerformanceAnalytics;