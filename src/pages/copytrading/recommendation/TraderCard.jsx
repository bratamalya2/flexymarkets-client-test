import {
    Box,
    Grid,
    Typography,
    Card,
    CardContent,
    Button,
    Avatar,
    Chip,
    Stack,
    IconButton,
    Paper,
    useTheme,
    alpha,
    Snackbar,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormHelperText
} from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSubscribeMutation, useUnSubscribeMutation, useMySubscriptionListQuery } from '../../../globalState/socialTrading/socialTradingApis.js';

// --- Configuration ---
const themeColors = {
    orange: { main: '#FF9F43', light: '#fff0e0', gradient: 'linear-gradient(135deg, #ff9f43 0%, #ffc785 100%)', shadow: 'rgba(255, 159, 67, 0.4)' },
    green: { main: '#28C76F', light: '#e0f7ea', gradient: 'linear-gradient(135deg, #28c76f 0%, #81f7b5 100%)', shadow: 'rgba(40, 199, 111, 0.4)' },
    blue: { main: '#00CFE8', light: '#e0faff', gradient: 'linear-gradient(135deg, #00cfe8 0%, #83eaf7 100%)', shadow: 'rgba(0, 207, 232, 0.4)' },
};

// --- Helper Component: Custom SVG Sparkline ---
const SparklineSVG = ({ color }) => (
    <svg width="100%" height="50" viewBox="0 0 120 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 45L15 42C30 39 60 33 90 20C120 7 135 0 150 3V50H135C120 50 90 50 60 50C30 50 15 50 0 50V45Z" fill={color} fillOpacity="0.2" />
        <path d="M0 45L15 42C30 39 60 33 90 20C120 7 135 0 150 3" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
);

export const TraderCard = ({ data }) => {
    const muiTheme = useTheme();
    const navigate = useNavigate();
    const [subscribe, { isLoading: isSubscribing }] = useSubscribeMutation();
    const [unSubscribe, { isLoading: isUnsubscribing }] = useUnSubscribeMutation();
    
    // State for subscription dialog
    const [openDialog, setOpenDialog] = useState(false);
    const [openUnsubscribeDialog, setOpenUnsubscribeDialog] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState(null);
    const [selectedMt5Login, setSelectedMt5Login] = useState('200022');
    const [selectedRiskType, setSelectedRiskType] = useState('');
    const [fixedLotSize, setFixedLotSize] = useState('');
    const [multiplier, setMultiplier] = useState('');
    const [errors, setErrors] = useState({});
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscriptionId, setSubscriptionId] = useState(null);

    // Fetch user's subscriptions to check if this trader is already subscribed
    const { data: subscriptionsData } = useMySubscriptionListQuery({
        page: 1,
        sizePerPage: 100
    });

    useEffect(() => {
        if (subscriptionsData?.data?.subscriptions) {
            const foundSubscription = subscriptionsData.data.subscriptions.find(
                sub => sub.masterTraderId === data?.id
            );
            if (foundSubscription) {
                setIsSubscribed(true);
                setSubscriptionId(foundSubscription.id);
            } else {
                setIsSubscribed(false);
                setSubscriptionId(null);
            }
        }
    }, [subscriptionsData, data?.id]);

    const colors = themeColors.blue;

    // Risk type options
    const riskTypes = [
        { 
            value: 'FIXED_LOT', 
            label: 'Fixed Lot', 
            description: 'Trade with fixed lot size',
            requiresLotSize: true,
            requiresMultiplier: false
        },
        { 
            value: 'MULTIPLIER', 
            label: 'Multiplier', 
            description: 'Trade with multiplier effect',
            requiresLotSize: false,
            requiresMultiplier: true
        }
    ];

    const handleCopyClick = (e) => {
        e.stopPropagation();
        if (isSubscribed) {
            // Show unsubscribe confirmation
            setOpenUnsubscribeDialog(true);
        } else {
            // Show subscribe dialog
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
                masterTraderId: data?.id,
                mt5Login: selectedMt5Login,
                riskType: selectedRiskType
            };

            if (selectedRiskType === 'FIXED_LOT') {
                requestBody.fixedLotSize = parseFloat(fixedLotSize);
            } else if (selectedRiskType === 'MULTIPLIER') {
                requestBody.multiplier = parseFloat(multiplier);
            }

            await subscribe(requestBody).unwrap();
            
            setSnackbar({
                open: true,
                message: `Successfully subscribed to ${data?.user?.name || 'trader'}`,
                severity: 'success'
            });
            setOpenDialog(false);
            setSelectedRiskType('');
            setFixedLotSize('');
            setMultiplier('');
            setIsSubscribed(true);
        } catch (error) {
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
                message: `Successfully unsubscribed from ${data?.user?.name || 'trader'}`,
                severity: 'success'
            });
            setOpenUnsubscribeDialog(false);
            setIsSubscribed(false);
            setSubscriptionId(null);
        } catch (error) {
            setSnackbar({
                open: true,
                message: error?.data?.message || 'Failed to unsubscribe',
                severity: 'error'
            });
        }
    };

    const handleDetailsClick = (e) => {
        e.stopPropagation();
        navigate(`/client/copyTrading/master-trader-details/${data?.id}`);
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

    const handleRiskTypeChange = (e) => {
        setSelectedRiskType(e.target.value);
        setFixedLotSize('');
        setMultiplier('');
        setErrors({});
    };

    // Format Data
    const name = data?.user?.name || 'Unknown Trader';
    const copiers = data?.latestStats?.totalCopiers || 0;
    const returnVal = data?.latestStats?.totalPnLPercentage ? `${parseFloat(data?.latestStats?.totalPnLPercentage).toFixed(2)}%` : '0.00%';
    const winRate = data?.latestStats?.winRate ? `${parseFloat(data?.latestStats?.winRate).toFixed(2)}%` : '0.00%';
    const profitFactor = data?.latestStats?.profitFactor ? parseFloat(data?.latestStats?.profitFactor).toFixed(2) : 'N/A';
    const avatarImg = data?.profileImage;

    return (
        <>
            <Card
                sx={{
                    borderRadius: 4,
                    overflow: 'visible',
                    position: 'relative',
                    transition: 'all 0.3s ease-in-out',
                    bgcolor: 'background.paper',
                    boxShadow: muiTheme.shadows[2],
                    '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: `0 12px 30px ${colors.shadow}`,
                    }
                }}
                onClick={handleDetailsClick}
            >
                {/* Header Section with Color Gradient background */}
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
                                    alt={name}
                                    sx={{
                                        width: 64,
                                        height: 64,
                                        border: `3px solid white`,
                                        bgcolor: muiTheme.palette.grey[300]
                                    }}
                                >
                                    {!avatarImg && <PersonIcon />}
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
                            <Typography variant="h6" fontWeight="700" sx={{ mb: 1, fontSize: '1rem' }}>{name}</Typography>
                            <Stack direction="row" spacing={1}>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={handleCopyClick}
                                    disabled={isSubscribing || isUnsubscribing}
                                    sx={{
                                        bgcolor: isSubscribed 
                                            ? muiTheme.palette.error.main 
                                            : (muiTheme.palette.mode === 'dark' ? muiTheme.palette.primary.main : '#1a1a1a'),
                                        color: '#fff',
                                        fontWeight: 'bold',
                                        textTransform: 'none',
                                        borderRadius: 2,
                                        boxShadow: 'none',
                                        '&:hover': {
                                            bgcolor: isSubscribed 
                                                ? muiTheme.palette.error.dark 
                                                : (muiTheme.palette.mode === 'dark' ? muiTheme.palette.primary.dark : '#000')
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
                                    sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
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
                                <Typography variant="body2" color="text.secondary" gutterBottom>Return (1Year)</Typography>
                                <Typography variant="h5" fontWeight="800" sx={{ color: colors.main, fontSize: '1rem'}}>
                                    {returnVal}
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
                                        bgcolor: muiTheme.palette.mode === 'dark' ? alpha(colors.main, 0.2) : colors.light,
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
                <DialogTitle>Subscribe to {name}</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 2 }}>
                        <FormControl fullWidth required error={!!errors.riskType}>
                            <InputLabel>Risk Type</InputLabel>
                            <Select
                                value={selectedRiskType}
                                label="Risk Type"
                                onChange={handleRiskTypeChange}
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
                        
                        <input type="hidden" value={selectedMt5Login} />
                        
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
                        disabled={isSubscribing}
                    >
                        {isSubscribing ? 'Subscribing...' : 'Confirm Subscription'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Unsubscribe Confirmation Dialog */}
            <Dialog open={openUnsubscribeDialog} onClose={handleCloseUnsubscribeDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Unsubscribe from {name}</DialogTitle>
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