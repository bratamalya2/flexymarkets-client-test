import { Container } from '@mui/material';
import IBDashboardHeader from './components/IBDashboardHeader';
import IBStatsCards from './components/IBStatsCards';
import IBChartsSection from './components/IBChartsSection';
import IBStatusCards from './components/IBStatusCards';
import IBPerformanceSection from './components/IBPerformanceSection';

function IBDashboard() {
  return (
    <Container maxWidth="xl" sx={{ pb: 5, pt: 2 }}>
      <IBDashboardHeader />
      <IBStatsCards />
      <IBChartsSection />
      <IBStatusCards />
      <IBPerformanceSection />
    </Container>
  )
}

export default IBDashboard;