
import {
  Box, Typography, IconButton, Card, Avatar, Button,
  Chip, Container, Stack, useTheme, useMediaQuery,
  Paper,
  alpha
} from '@mui/material';
import Grid from '@mui/material/Grid2';

import PersonIcon from '@mui/icons-material/Person';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useNavigate } from 'react-router-dom';

// --- Mock Data ---
const TOP_THREE = [
  { id: 2, rank: 2, name: "Golden Instant Cash", return: "263.42%", rating: 103, risk: 3, copiers: 8424, color: "#4caf50", medal: "🥈" },
  { id: 1, rank: 1, name: "Stable Farm GPT", return: "58.61%", rating: 103, risk: 3, copiers: 7692, color: "#ff9800", medal: "🥇" },
  { id: 3, rank: 3, name: "SATORI FUND SAFETY", return: "56.61%", rating: 103, risk: 2, copiers: 34574, color: "#2196f3", medal: "🥉" },
];

const STRATEGY_LIST = [
  { rank: 4, name: "DP Trader", copiers: 1268, return: "1012.20%", rating: 104, risk: 5 },
  { rank: 5, name: "Sammy Whaa Gwaan", copiers: 455, return: "61.39%", rating: 101, risk: 5 },
];

// --- Sub-Component: Top Trader Card ---
const PodiumCard = ({ trader }) => {
  const theme = useTheme();
  return (
    <Card sx={{
      borderRadius: 6,
      pt: 8, pb: 3, px: 2,
      textAlign: 'center',
      position: 'relative',
      overflow: 'visible',
      boxShadow: theme.shadows[2],
      border: '1px solid',
      borderColor: theme.palette.divider,
      bgcolor: 'background.paper',
      height: '100%'
    }}>
      {/* Floating Avatar & Medal */}
      <Box sx={{
        position: 'absolute',
        top: -50,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2
      }}>
        <Box sx={{ position: 'relative' }}>
          <Typography sx={{ position: 'absolute', top: -15, left: '50%', transform: 'translateX(-50%)', fontSize: '2rem', zIndex: 3 }}>
            {trader.medal}
          </Typography>
          <Avatar
            sx={{ width: 100, height: 100, border: `4px solid ${theme.palette.background.paper}`, boxShadow: theme.shadows[4], bgcolor: trader.color }}
          >
            <Typography variant="h4" fontWeight="bold" color="white">{trader.name[0]}</Typography>
          </Avatar>
          <Chip
            icon={<PersonIcon sx={{ fontSize: '14px !important', color: 'white !important' }} />}
            label={trader.copiers}
            sx={{ position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)', bgcolor: '#1a1a1a', color: 'white', fontWeight: 'bold' }}
          />
        </Box>
      </Box>

      <Typography variant="h6" fontWeight="800" sx={{ mt: 2, mb: 0.5 }} color="text.primary">{trader.name}</Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>{trader.copiers} copiers</Typography>

      <Grid container spacing={1} sx={{ mb: 3 }}>
        <Grid size={4}>
          <Typography variant="caption" color="text.secondary">Return(90D)</Typography>
          <Typography variant="body2" fontWeight="800" color="success.main">{trader.return}</Typography>
        </Grid>
        <Grid size={4}>
          <Typography variant="caption" color="text.secondary">Rating</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.5 }}>
            <Chip label={trader.rating} size="small" sx={{ height: 20, bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.main', fontWeight: 'bold' }} />
          </Box>
        </Grid>
        <Grid size={4}>
          <Typography variant="caption" color="text.secondary">Risk</Typography>
          <Typography variant="body2" fontWeight="800" color="success.main">{trader.risk}</Typography>
        </Grid>
      </Grid>

      <Button fullWidth variant="contained" sx={{ bgcolor: theme.palette.mode === 'dark' ? theme.palette.primary.main : '#1a1a1a', color: 'white', borderRadius: 10, textTransform: 'none', py: 1, '&:hover': { bgcolor: theme.palette.mode === 'dark' ? theme.palette.primary.dark : '#333' } }}>
        Copy
      </Button>
    </Card>
  );
};

// --- Main Dashboard ---
const RatingDashboard = () => {
  const isMobile = useMediaQuery('(max-width:900px)');
  const navigate = useNavigate(); // 2. Initialize the navigate function
  const theme = useTheme();

  const handleCardClick = () => {
    // 3. Define the redirection path
    navigate('/client/tradedetails');
  };

  return (
    <Box sx={{ bgcolor: theme.palette.mode === 'dark' ? 'background.default' : '#fbfbfb', minHeight: '100vh', py: 10 }}>
      <Container maxWidth="lg">

        {/* Top 3 Section */}
        <Grid container spacing={8} sx={{ mb: 10 }}>
          {TOP_THREE.map((trader) => (
            <Grid
              item
              size={{ xs: 12, md: 4 }}
              key={trader.id}
              onClick={handleCardClick} // 4. Add the click handler
              sx={{ cursor: 'pointer' }} // 5. Add a pointer cursor for UX
            >
              <PodiumCard trader={trader} />
            </Grid>
          ))}
        </Grid>

        {/* List Section Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h5" fontWeight="900" color="text.primary">Strategy List</Typography>
            <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>view more</Typography>
          </Stack>
        </Stack>

        {/* Strategy Table-like List */}
        <Paper elevation={0} sx={{ border: '1px solid', borderColor: theme.palette.divider, borderRadius: 4, overflow: 'hidden', bgcolor: 'background.paper' }}>
          {/* Header Row */}
          <Box sx={{ px: 3, py: 2, bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.action.hover, 0.1) : '#fafafa', display: { xs: 'none', md: 'block' } }}>
            <Grid container>
              <Grid size={4}><Typography variant="caption" fontWeight="bold" color="text.secondary">Name</Typography></Grid>
              <Grid size={2}><Typography variant="caption" fontWeight="bold" color="text.secondary">Return(90D)</Typography></Grid>
              <Grid size={2}><Typography variant="caption" fontWeight="bold" color="text.secondary">Rating</Typography></Grid>
              <Grid size={2}><Typography variant="caption" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }} color="text.secondary">Risk <InfoOutlinedIcon sx={{ fontSize: 12 }} /></Typography></Grid>
              <Grid size={2} sx={{ textAlign: 'right' }}><Typography variant="caption" fontWeight="bold" color="text.secondary">Action</Typography></Grid>
            </Grid>
          </Box>

          {STRATEGY_LIST.map((item, idx) => (
            <Box key={idx} sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: theme.palette.divider, '&:hover': { bgcolor: theme.palette.action.hover } }}>
              <Grid container alignItems="center">
                <Grid size={{ xs: 8, md: 4 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="body2" fontWeight="bold" color="text.secondary">{item.rank}</Typography>
                    <Avatar variant="rounded" sx={{ bgcolor: item.rank === 4 ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.warning.main, 0.1), color: theme.palette.text.primary }} />
                    <Box>
                      <Typography variant="body2" fontWeight="bold" color="text.primary">{item.name}</Typography>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <PersonIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">{item.copiers}</Typography>
                      </Stack>
                    </Box>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 4, md: 2 }}>
                  <Typography variant="body2" fontWeight="bold" color="success.main">{item.return}</Typography>
                </Grid>
                <Grid size={{ xs: 0, md: 2 }} sx={{ display: { xs: 'none', md: 'block' } }}>
                  <Typography variant="body2" color="text.primary">{item.rating}</Typography>
                </Grid>
                <Grid size={{ xs: 0, md: 2 }} sx={{ display: { xs: 'none', md: 'block' } }}>
                  <Typography variant="body2" color="warning.main" fontWeight="bold">{item.risk}</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 2 }} sx={{ textAlign: 'right', mt: { xs: 2, md: 0 } }}>
                  <Stack direction="row" justifyContent="flex-end" spacing={1} alignItems="center">
                    <IconButton size="small"><QueryStatsIcon fontSize="small" /></IconButton>
                    <Button size="small" variant="contained" sx={{ bgcolor: theme.palette.mode === 'dark' ? theme.palette.primary.main : '#1a1a1a', color: 'white', borderRadius: 2, textTransform: 'none', '&:hover': { bgcolor: theme.palette.mode === 'dark' ? theme.palette.primary.dark : '#333' } }}>Copy</Button>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          ))}
        </Paper>

      </Container>
    </Box>
  );
};

export default RatingDashboard;
