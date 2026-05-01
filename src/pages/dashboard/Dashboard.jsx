import MonthlyDepositAndWithdrawal from './monthlyDepositAndWithdrawal/MonthlyDepositAndWithdrawal'
import AccountSummaryCards from './accountSummaryCards/AccountSummaryCards.jsx'
import LiveAccountListing from "./liveAccountListing/LiveAccountListing"
import OpenPositionsTable from "./openPositionsTable/OpenPositionsTable"
import { Container, useMediaQuery, Typography } from '@mui/material'
import Grid from "@mui/material/Grid2"


function Dashboard() {

    const matches = useMediaQuery('(min-width:800px)');

    return (
        <Container>
            <Typography sx={{ fontSize: "2rem", fontWeight: "700", mb: "2rem" }}>Dashboard</Typography>
            <AccountSummaryCards />
            <Grid container size={12} spacing={2} mt={"2rem"}>
                <Grid size={matches ? 6 : 12}><MonthlyDepositAndWithdrawal /></Grid>
                <Grid size={matches ? 6 : 12}><LiveAccountListing /></Grid>
            </Grid>
            <OpenPositionsTable />
        </Container>
    )
}

export default Dashboard;