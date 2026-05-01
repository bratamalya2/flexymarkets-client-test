import IBAccountSummaryCards from './IBAccountSummaryCards/IBAccountSummaryCards';
import { Container, useMediaQuery, Typography, Button, Stack } from '@mui/material'
import Grid from "@mui/material/Grid2"
import MonthlyCommission from "./monthlyCommission/MonthlyCommission"
import MyClientTransaction from './myClientTransaction/MyClientTransaction';
import StatusOverviewSection from './statusOverviewSection/StatusOverviewSection';
import ReferralLinkCard from './referralLinkCard/ReferralLinkCard';
import TopFiveEarningsOfSubIBs from './topFiveEarningsOfSubIBs/TopFiveEarningsOfSubIBs';
import IBPerformaneAndPerformanceAnalytics from './IBPerformaneAndPerformanceAnalytics/IBPerformaneAndPerformanceAnalytics';
import ActiveTradersAndIBs from './ActiveTradersAndIBs/ActiveTradersAndIBs';
import { Link } from 'react-router-dom';


function IBDashboard() {

  const matches = useMediaQuery('(min-width:800px)');

  return (
    <Container>
      <Typography variant='h5' fontWeight={"700"} fontSize={"1.8rem"} mb={"2rem"}>IB Dashboard</Typography>
      <Stack sx={{ flexDirection: "row", flexWrap: "wrap", gap: "15px", justifyContent: "space-between", alignItems: "center" }}>
        <ReferralLinkCard />
        {/* <Button variant="contained" component={Link} to={"/client/IBProgramme/IBCommission"}>Set IB Commission</Button> */}
      </Stack>
      <IBAccountSummaryCards />
      <Grid container size={12} spacing={2} mt={"2rem"}>
        <Grid size={matches ? 6 : 12}><MonthlyCommission /></Grid>
        <Grid size={matches ? 6 : 12}><MyClientTransaction /></Grid>
      </Grid>
      <StatusOverviewSection />
      <ActiveTradersAndIBs />
      <IBPerformaneAndPerformanceAnalytics />
      <TopFiveEarningsOfSubIBs />
    </Container>
  )
}

export default IBDashboard;