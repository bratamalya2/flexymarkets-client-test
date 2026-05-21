import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  AvatarGroup,
  Grid,
  Container,
  Stack,
  useTheme,
  alpha,
  Chip,
  Divider
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import PeopleIcon from '@mui/icons-material/People';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const TradingHero = () => {

  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box sx={{
      position: 'relative',
      // bgcolor: isDark ? 'background.default' : '#f0f2f5',
      overflow: 'hidden',
      py: 5,
      minHeight: '600px',
      display: 'flex',
      alignItems: 'center'
    }}>
      {/* Background Decor Elements */}
      <Box sx={{
        position: 'absolute',
        top: '-20%',
        right: '-10%',
        width: '600px',
        height: '600px',
        background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.2)} 0%, transparent 70%)`,
        filter: 'blur(60px)',
        zIndex: 0,
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: '-10%',
        left: '-10%',
        width: '500px',
        height: '500px',
        background: `radial-gradient(circle, ${alpha(theme.palette.secondary?.main || theme.palette.primary.light, 0.15)} 0%, transparent 70%)`,
        filter: 'blur(60px)',
        zIndex: 0,
      }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={{ xs: 6, md: 4 }} alignItems="center">

          {/* Left Content */}
          <Grid item xs={12} md={7} lg={7}>
            <Chip
              label="New Feature"
              color="primary"
              size="small"
              sx={{
                mb: 3,
                fontWeight: 600,
                borderRadius: '8px',
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
              }}
            />

            <Typography
              component="h1"
              variant="h2"
              fontWeight="800"
              sx={{
                background: isDark
                  ? `linear-gradient(90deg, #fff 0%, ${theme.palette.primary.light} 100%)`
                  : `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: { xs: 'center', md: 'left' },
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                lineHeight: 1.1,
                mb: 3,
                letterSpacing: '-1px'
              }}
            >
              Copy Global Trading Elites & Master Your Trades
            </Typography>

            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                textAlign: { xs: 'center', md: 'left' },
                maxWidth: '600px',
                mb: 6,
                fontSize: { xs: '1rem', md: '1.25rem' },
                fontWeight: 400
              }}
            >
              Join the world's leading social trading network. Follow top strategies, copy their moves, and grow your portfolio automatically.
            </Typography>

            {/* Glassmorphism Stats Section */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{
                mt: 6,
                width: '100%',
                justifyContent: { xs: 'center', md: 'flex-start' }
              }}
            >
              {[
                { label: 'Total Copiers', val: '535K+', icon: PeopleIcon, color: '#3f51b5' },
                { label: 'Signal Providers', val: '93K+', icon: AutoGraphIcon, color: '#f50057' },
                { label: 'Total Profits', val: '$390M+', icon: MonetizationOnIcon, color: '#00a684' },
              ].map((stat, index) => (
                <Card
                  key={index}
                  sx={{
                    flex: 1,
                    maxWidth: { xs: '100%', sm: '200px' },
                    bgcolor: alpha(theme.palette.background.paper, isDark ? 0.4 : 0.7),
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    boxShadow: theme.shadows[1],
                    borderRadius: '16px',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: theme.shadows[4]
                    }
                  }}
                >
                  <CardContent sx={{ p: '24px !important', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <Box sx={{
                      p: 1.5,
                      borderRadius: '50%',
                      bgcolor: alpha(stat.color, 0.1),
                      color: stat.color,
                      mb: 2,
                      display: 'flex'
                    }}>
                      <stat.icon fontSize="small" />
                    </Box>
                    <Typography
                      variant="h5"
                      fontWeight="800"
                      sx={{ color: 'text.primary', mb: 0.5 }}
                    >
                      {stat.val}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight="500">
                      {stat.label}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Grid>

          {/* Right Content: Premium Floating Card */}
          <Grid item xs={12} md={5} lg={5}>
            <Box sx={{
              position: 'relative',
              perspective: '1000px',
              maxWidth: { xs: '380px', md: '420px' },
              margin: '0 auto',
            }}>
              {/* Decorative Glow */}
              <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                height: '100%',
                background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.3)} 0%, transparent 70%)`,
                filter: 'blur(40px)',
                zIndex: 0,
              }} />

              <Card sx={{
                position: 'relative',
                zIndex: 2,
                borderRadius: '24px',
                background: isDark
                  ? `linear-gradient(135deg, ${alpha('#1e1e1e', 0.9)} 0%, ${alpha('#121212', 0.95)} 100%)`
                  : `linear-gradient(135deg, ${alpha('#ffffff', 0.9)} 0%, ${alpha('#f8f9fa', 0.95)} 100%)`,
                backdropFilter: 'blur(20px)',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.2)}`,
                overflow: 'hidden',
                animation: 'float 6s ease-in-out infinite',
                '@keyframes float': {
                  '0%': { transform: 'translateY(0px)' },
                  '50%': { transform: 'translateY(-15px)' },
                  '100%': { transform: 'translateY(0px)' },
                }
              }}>
                {/* Card Header Gradient */}
                <Box sx={{
                  height: '8px',
                  width: '100%',
                  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary?.main || theme.palette.primary.light} 100%)`
                }} />

                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Box>
                      <Chip
                        label="Top Strategy"
                        size="small"
                        sx={{
                          mb: 1.5,
                          height: '24px',
                          fontSize: '0.7rem',
                          bgcolor: alpha(theme.palette.success.main, 0.1),
                          color: theme.palette.success.main,
                          fontWeight: 700
                        }}
                      />
                      <Typography variant="h5" fontWeight="800" sx={{ lineHeight: 1.3 }}>
                        Growth Shield Fund
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Low risk, consistent high returns
                      </Typography>
                    </Box>
                  </Box>

                  {/* Performance Metric */}
                  <Box sx={{
                    bgcolor: alpha(theme.palette.success.main, 0.05),
                    borderRadius: '16px',
                    p: 2.5,
                    border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
                    mb: 4
                  }}>
                    <Stack direction="row" flexWrap="wrap" justifyContent="space-between" alignItems="center" gap={{ xs: "5px", sm: 0 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight="600" textTransform="uppercase">
                          Total Return
                        </Typography>
                        <Typography variant="h3" fontWeight="800" color="success.main" sx={{ display: 'flex', alignItems: 'center', lineHeight: 1 }}>
                          +100%
                          <TrendingUpIcon sx={{ ml: 1, fontSize: 32 }} />
                        </Typography>
                      </Box>
                      <Divider orientation="vertical" flexItem />
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" color="text.secondary" fontWeight="600" textTransform="uppercase">
                          Risk Score
                        </Typography>
                        <Typography variant="h5" fontWeight="800" color="warning.main">
                          Low (2/10)
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>

                  {/* Social Proof */}
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
                    <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 36, height: 36, border: `2px solid ${theme.palette.background.paper}` } }}>
                      <Avatar src="https://i.pravatar.cc/150?u=1" />
                      <Avatar src="https://i.pravatar.cc/150?u=2" />
                      <Avatar src="https://i.pravatar.cc/150?u=3" />
                      <Avatar src="https://i.pravatar.cc/150?u=4" />
                    </AvatarGroup>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="700">
                        1,200+ Investors
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        joined in the last 24h
                      </Typography>
                    </Box>
                  </Stack>

                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{
                      bgcolor: '#f25c2d',
                      '&:hover': {
                        bgcolor: '#d44b1f',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 16px rgba(242, 92, 45, 0.3)'
                      },
                      transition: 'all 0.2s',
                      borderRadius: '12px',
                      textTransform: 'none',
                      py: 1.75,
                      fontSize: '1.1rem',
                      fontWeight: '800'
                    }}
                  >
                    Start Copying Now
                  </Button>
                </CardContent>
              </Card>
            </Box>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
};

export default TradingHero;
