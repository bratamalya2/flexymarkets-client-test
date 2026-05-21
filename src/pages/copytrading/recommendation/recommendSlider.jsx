import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Card,
  Avatar,
  Button,
  Grid,
  Chip,
  Container,
  Stack,
  useTheme,
  useMediaQuery,
  alpha,
  Skeleton,
  Alert,
  Paper,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormHelperText,
  Snackbar
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PersonIcon from '@mui/icons-material/Person';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useNavigate } from 'react-router-dom';
import { 
  useMasterTraderListQuery, 
  useSubscribeMutation,
  useUnSubscribeMutation,
  useMySubscriptionListQuery 
} from '../../../globalState/socialTrading/socialTradingApis.js';

// Theme colors matching reference card
const themeColors = {
  orange: { main: '#FF9F43', light: '#fff0e0', gradient: 'linear-gradient(135deg, #ff9f43 0%, #ffc785 100%)', shadow: 'rgba(255, 159, 67, 0.4)' },
  green: { main: '#28C76F', light: '#e0f7ea', gradient: 'linear-gradient(135deg, #28c76f 0%, #81f7b5 100%)', shadow: 'rgba(40, 199, 111, 0.4)' },
  blue: { main: '#00CFE8', light: '#e0faff', gradient: 'linear-gradient(135deg, #00cfe8 0%, #83eaf7 100%)', shadow: 'rgba(0, 207, 232, 0.4)' },
  red: { main: '#f5365c', light: '#ffe0e6', gradient: 'linear-gradient(135deg, #f5365c 0%, #ff8a9f 100%)', shadow: 'rgba(245, 54, 92, 0.4)' }
};

// --- Custom Sparkline SVG ---
const SparklineSVG = ({ color }) => (
  <svg width="100%" height="50" viewBox="0 0 120 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 45L15 42C30 39 60 33 90 20C120 7 135 0 150 3V50H135C120 50 90 50 60 50C30 50 15 50 0 50V45Z" fill={color} fillOpacity="0.2" />
    <path d="M0 45L15 42C30 39 60 33 90 20C120 7 135 0 150 3" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Risk type options
const riskTypes = [
  { 
    value: 'FIXED_LOT', 
    label: 'Fixed Lot', 
    description: 'Trade with fixed lot size',
  },
  { 
    value: 'MULTIPLIER', 
    label: 'Multiplier', 
    description: 'Trade with multiplier effect',
  }
];

// --- Trader Card Component with Subscribe/Unsubscribe API ---
const TraderCard = ({ trader, rank }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [subscribe, { isLoading: isSubscribing }] = useSubscribeMutation();
  const [unSubscribe, { isLoading: isUnsubscribing }] = useUnSubscribeMutation();
  
  // State for subscription dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [openUnsubscribeDialog, setOpenUnsubscribeDialog] = useState(false);
  const [selectedMt5Login, setSelectedMt5Login] = useState('200022');
  const [selectedRiskType, setSelectedRiskType] = useState('');
  const [fixedLotSize, setFixedLotSize] = useState('');
  const [multiplier, setMultiplier] = useState('');
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionId, setSubscriptionId] = useState(null);

  // Fetch user's subscriptions
  const { data: subscriptionsData } = useMySubscriptionListQuery({
    page: 1,
    sizePerPage: 100
  });

  // Check if this trader is already subscribed
  useEffect(() => {
    if (subscriptionsData?.data?.subscriptions) {
      const foundSubscription = subscriptionsData.data.subscriptions.find(
        sub => sub.masterTraderId === trader?.id
      );
      if (foundSubscription) {
        setIsSubscribed(true);
        setSubscriptionId(foundSubscription.id);
      } else {
        setIsSubscribed(false);
        setSubscriptionId(null);
      }
    }
  }, [subscriptionsData, trader?.id]);
  
  // Get color based on rank
  const getColorByRank = (rank) => {
    if (rank === 1) return themeColors.red;
    if (rank === 2) return themeColors.orange;
    if (rank === 3) return themeColors.green;
    return themeColors.blue;
  };
  
  const colors = getColorByRank(rank);
  
  // Get trader data
  const displayName = trader.displayName || trader.user?.name || 'Unknown Trader';
  const initial = displayName.charAt(0).toUpperCase();
  
  // Performance data
  const stats = trader.latestStats || {};
  const totalReturn = stats.totalPnLPercentage ? `${parseFloat(stats.totalPnLPercentage).toFixed(2)}%` : '0.00%';
  const winRate = stats.winRate ? `${parseFloat(stats.winRate).toFixed(2)}%` : '0.00%';
  const profitFactor = stats.profitFactor ? parseFloat(stats.profitFactor).toFixed(4) : '0.0000';
  const copiers = trader.activeCopiers || 0;
  const avatarImg = trader.profileImage;
  const traderId = trader.id || trader.userId;

  const handleCopyClick = (e) => {
    e.stopPropagation();
    if (isSubscribed) {
      setOpenUnsubscribeDialog(true);
    } else {
      setOpenDialog(true);
      // Reset form when opening
      setSelectedRiskType('');
      setFixedLotSize('');
      setMultiplier('');
      setErrors({});
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!selectedRiskType) {
      newErrors.riskType = 'Risk type is required';
      setErrors(newErrors);
      return false;
    }
    
    if (selectedRiskType === 'FIXED_LOT') {
      if (!fixedLotSize) {
        newErrors.fixedLotSize = 'Fixed lot size is required';
      } else if (parseFloat(fixedLotSize) <= 0) {
        newErrors.fixedLotSize = 'Lot size must be greater than 0';
      }
    }
    
    if (selectedRiskType === 'MULTIPLIER') {
      if (!multiplier) {
        newErrors.multiplier = 'Multiplier is required';
      } else if (parseFloat(multiplier) <= 0) {
        newErrors.multiplier = 'Multiplier must be greater than 0';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubscribe = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const requestBody = {
        masterTraderId: traderId,
        mt5Login: selectedMt5Login,
        riskType: selectedRiskType
      };

      if (selectedRiskType === 'FIXED_LOT') {
        requestBody.fixedLotSize = parseFloat(fixedLotSize);
      } else if (selectedRiskType === 'MULTIPLIER') {
        requestBody.multiplier = parseFloat(multiplier);
      }

      console.log('Subscribing with:', requestBody);

      const response = await subscribe(requestBody).unwrap();
      
      console.log('Subscribe response:', response);

      setSnackbar({
        open: true,
        message: `Successfully subscribed to ${displayName}`,
        severity: 'success'
      });
      
      setOpenDialog(false);
      setSelectedRiskType('');
      setFixedLotSize('');
      setMultiplier('');
      setIsSubscribed(true);
      
    } catch (error) {
      console.error('Subscribe error:', error);
      setSnackbar({
        open: true,
        message: error?.data?.message || 'Failed to subscribe',
        severity: 'error'
      });
    }
  };

  const handleUnsubscribe = async () => {
    try {
      await unSubscribe({ 
        subscriptionId: subscriptionId 
      }).unwrap();
      
      setSnackbar({
        open: true,
        message: `Successfully unsubscribed from ${displayName}`,
        severity: 'success'
      });
      
      setOpenUnsubscribeDialog(false);
      setIsSubscribed(false);
      setSubscriptionId(null);
      
    } catch (error) {
      console.error('Unsubscribe error:', error);
      setSnackbar({
        open: true,
        message: error?.data?.message || 'Failed to unsubscribe',
        severity: 'error'
      });
    }
  };

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    navigate(`/client/copyTrading/master-trader-details/${traderId}`);
  };

  const handleCardClick = () => {
    navigate(`/client/copyTrading/master-trader-details/${traderId}`);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRiskType('');
    setFixedLotSize('');
    setMultiplier('');
    setErrors({});
  };

  const handleCloseUnsubscribeDialog = () => {
    setOpenUnsubscribeDialog(false);
  };

  return (
    <>
      <Card
        sx={{
          borderRadius: 4,
          overflow: 'visible',
          position: 'relative',
          transition: 'all 0.3s ease-in-out',
          bgcolor: 'background.paper',
          boxShadow: theme.shadows[2],
          m: 1,
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: `0 12px 30px ${colors.shadow}`,
          }
        }}
        onClick={handleCardClick}
      >
        {/* Rank Badge */}
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            right: -8,
            background: colors.gradient,
            color: 'white',
            fontWeight: '900',
            py: 0.5,
            px: 2,
            zIndex: 10,
            boxShadow: '2px 2px 5px rgba(0,0,0,0.2)',
            '&:before': {
              content: '""',
              position: 'absolute',
              bottom: '-8px',
              right: 0,
              borderTop: `8px solid ${theme.palette.grey[800]}`,
              borderRight: '8px solid transparent',
              filter: 'brightness(0.8)'
            }
          }}
        >
          TOP {rank}
        </Box>

        {/* Header Section */}
        <Box sx={{
          background: colors.gradient,
          p: 3,
          pb: 8,
          color: 'white',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  src={avatarImg}
                  alt={displayName}
                  sx={{
                    width: 64,
                    height: 64,
                    border: `3px solid white`,
                    bgcolor: theme.palette.grey[300],
                    fontWeight: 'bold',
                    fontSize: '1.5rem'
                  }}
                >
                  {!avatarImg && initial}
                </Avatar>
                <Chip
                  icon={<PersonIcon sx={{ fontSize: '14px !important', color: 'white !important' }} />}
                  label={copiers}
                  size="small"
                  sx={{
                    position: 'absolute',
                    bottom: -8,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bgcolor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    fontWeight: 'bold',
                    height: 24,
                    '& .MuiChip-label': { px: 1, fontSize: '0.75rem' }
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs>
              <Typography variant="h6" fontWeight="700" sx={{ mb: 1 , fontSize: '1rem' }}>{displayName}</Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleCopyClick}
                  disabled={isSubscribing || isUnsubscribing}
                  sx={{
                    bgcolor: isSubscribed 
                      ? theme.palette.error.main 
                      : (theme.palette.mode === 'dark' ? theme.palette.primary.main : '#1a1a1a'),
                    color: '#fff',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    borderRadius: 2,
                    boxShadow: 'none',
                    '&:hover': {
                      bgcolor: isSubscribed 
                        ? theme.palette.error.dark 
                        : (theme.palette.mode === 'dark' ? theme.palette.primary.dark : '#000')
                    },
                    '&:disabled': {
                      opacity: 0.6
                    }
                  }}
                >
                  {isSubscribing ? 'Subscribing...' : 
                   isUnsubscribing ? 'Unsubscribing...' : 
                   isSubscribed ? 'Uncopy' : 'Copy'}
                </Button>
                <IconButton
                  size="small"
                  onClick={handleDetailsClick}
                  sx={{ 
                    color: 'white', 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } 
                  }}
                >
                  <BarChartIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        {/* Inner White Card for Stats */}
        <CardContent sx={{ pt: 0, px: 2, pb: 2, mt: -4 }}>
          <Paper elevation={2} sx={{ borderRadius: 3, p: 3, bgcolor: 'background.paper' }}>
            <Grid container alignItems="flex-end" sx={{ mb: 3 }}>
              <Grid item xs={7}>
                <Typography variant="body2" color="text.secondary" gutterBottom>Return (1 Year)</Typography>
                <Typography variant="h5" fontWeight="800" sx={{ color: colors.main , fontSize: '1rem'}}>
                  {totalReturn}
                </Typography>
              </Grid>
              <Grid item xs={5} sx={{ height: 50 }}>
                <SparklineSVG color={colors.main} />
              </Grid>
            </Grid>

            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <Typography variant="caption" display="block" color="text.secondary" fontWeight="500">Win Rate</Typography>
                <Typography variant="subtitle1" fontWeight="700">{winRate}</Typography>
              </Grid>
              <Grid item sx={{ textAlign: 'right' }}>
                <Typography variant="caption" display="block" color="text.secondary" fontWeight="500">Profit Factor</Typography>
                <Chip
                  label={profitFactor}
                  sx={{
                    fontWeight: 800,
                    bgcolor: theme.palette.mode === 'dark' ? alpha(colors.main, 0.2) : colors.light,
                    color: colors.main,
                    height: 24,
                    minWidth: 30,
                    '& .MuiChip-label': { px: 0.5 }
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </CardContent>
      </Card>

      {/* Subscribe Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Subscribe to {displayName}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <FormControl fullWidth required error={!!errors.riskType}>
              <InputLabel>Risk Type</InputLabel>
              <Select
                value={selectedRiskType}
                label="Risk Type"
                onChange={(e) => {
                  setSelectedRiskType(e.target.value);
                  setFixedLotSize('');
                  setMultiplier('');
                  setErrors({});
                }}
              >
                {riskTypes.map((risk) => (
                  <MenuItem key={risk.value} value={risk.value}>
                    <Box>
                      <Typography variant="body1">{risk.label}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {risk.description}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {errors.riskType && (
                <FormHelperText>{errors.riskType}</FormHelperText>
              )}
            </FormControl>

            {/* Fixed Lot Size Field */}
            {selectedRiskType === 'FIXED_LOT' && (
              <TextField
                fullWidth
                required
                label="Fixed Lot Size"
                type="number"
                value={fixedLotSize}
                onChange={(e) => setFixedLotSize(e.target.value)}
                error={!!errors.fixedLotSize}
                helperText={errors.fixedLotSize || 'Enter lot size (e.g., 0.01, 0.1, 1.0)'}
                inputProps={{
                  step: '0.01',
                  min: '0.01'
                }}
              />
            )}

            {/* Multiplier Field */}
            {selectedRiskType === 'MULTIPLIER' && (
              <TextField
                fullWidth
                required
                label="Multiplier"
                type="number"
                value={multiplier}
                onChange={(e) => setMultiplier(e.target.value)}
                error={!!errors.multiplier}
                helperText={errors.multiplier || 'Enter multiplier (e.g., 1, 2, 5, 10)'}
                inputProps={{
                  step: '0.1',
                  min: '0.1'
                }}
              />
            )}
            
            <Typography variant="caption" color="text.secondary">
              Using MT5 Account: {selectedMt5Login}
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubscribe} 
            variant="contained"
            disabled={isSubscribing || !selectedRiskType}
          >
            {isSubscribing ? 'Subscribing...' : 'Confirm Subscription'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Unsubscribe Confirmation Dialog */}
      <Dialog open={openUnsubscribeDialog} onClose={handleCloseUnsubscribeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Unsubscribe from {displayName}</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Are you sure you want to unsubscribe from this trader? You will stop copying their trades.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUnsubscribeDialog}>Cancel</Button>
          <Button 
            onClick={handleUnsubscribe} 
            variant="contained"
            color="error"
            disabled={isUnsubscribing}
          >
            {isUnsubscribing ? 'Unsubscribing...' : 'Confirm Unsubscribe'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

// --- Main Slider Component ---
const TraderSlider = ({ title, subtitle, filterFn = (traders) => traders }) => {
  const [index, setIndex] = useState(0);
  const [page, setPage] = useState(1);
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const cardsToShow = isMobile ? 1 : isTablet ? 2 : 3;

  const { data, isLoading, isError } = useMasterTraderListQuery({
    page: page,
    sizePerPage: 12,
    chartTimeframe: "30D"
  });

  const traders = data?.data?.masterTraders || [];
  const filteredTraders = filterFn(traders);
  const totalPages = data?.data?.totalPages || 1;

  const maxIndex = Math.max(0, filteredTraders.length - cardsToShow);

  const handleNext = () => {
    if (index < maxIndex) {
      setIndex(prev => prev + 1);
    } else if (page < totalPages) {
      setPage(prev => prev + 1);
      setIndex(0);
    }
  };

  const handleBack = () => {
    if (index > 0) {
      setIndex(prev => prev - 1);
    } else if (page > 1) {
      setPage(prev => prev - 1);
      setIndex(Math.max(0, 12 - cardsToShow));
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 4 }}>
          <Box>
            <Skeleton width={200} height={40} />
            <Skeleton width={300} height={24} />
          </Box>
          <Stack direction="row" spacing={1}>
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="circular" width={40} height={40} />
          </Stack>
        </Stack>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {[1, 2, 3].map(i => (
            <Skeleton key={i} variant="rectangular" width={320} height={400} sx={{ borderRadius: 4 }} />
          ))}
        </Box>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error">Failed to load traders</Alert>
      </Container>
    );
  }

  if (filteredTraders.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="info">No traders available</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h5" fontWeight="800" color="text.primary">{title}</Typography>
          <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <IconButton 
            onClick={handleBack} 
            disabled={(page === 1 && index === 0) || isLoading} 
            sx={{ border: '1px solid', borderColor: theme.palette.divider }}
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
          <IconButton 
            onClick={handleNext} 
            disabled={(page >= totalPages && index >= maxIndex) || isLoading} 
            sx={{ border: '1px solid', borderColor: theme.palette.divider }}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>

      <Box sx={{ overflow: 'hidden', mx: -1 }}>
        <Box sx={{
          display: 'flex',
          transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: `translateX(-${index * (100 / cardsToShow)}%)`
        }}>
          {filteredTraders.map((trader, i) => (
            <Box key={trader.id || i} sx={{
              minWidth: `${100 / cardsToShow}%`,
              boxSizing: 'border-box',
              padding: 1
            }}>
              <TraderCard trader={trader} rank={i + 1} />
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

// --- Specific Slider Components ---
const TraderSliders = () => {
  return (
    <TraderSlider 
      title="Highest Annual Return"
      subtitle="Top performing signal providers this year"
      filterFn={(traders) => 
        [...traders].sort((a, b) => {
          const aReturn = parseFloat(a.latestStats?.totalPnLPercentage || 0);
          const bReturn = parseFloat(b.latestStats?.totalPnLPercentage || 0);
          return bReturn - aReturn;
        })
      }
    />
  );
};

const SecondTraderSlider = () => {
  return (
    <TraderSlider 
      title="Low Risk And Stable Return"
      subtitle="Conservative traders with consistent performance"
      filterFn={(traders) => 
        [...traders]
          .filter(t => t.riskLevel === 'LOW' || t.riskLevel === 'MEDIUM')
          .sort((a, b) => {
            const aReturn = parseFloat(a.latestStats?.totalPnLPercentage || 0);
            const bReturn = parseFloat(b.latestStats?.totalPnLPercentage || 0);
            return bReturn - aReturn;
          })
      }
    />
  );
};

export { TraderSliders, SecondTraderSlider };