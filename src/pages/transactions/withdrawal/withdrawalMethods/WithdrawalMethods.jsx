import {
    Stack,
    Typography,
    Box,
    Chip,
    Alert,
    Paper,
    Button,
    alpha,
    IconButton,
    Tooltip,
    Popover,
    Card
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { withdrawalMethodsData } from './withdrawalMethodsData'
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SecurityIcon from '@mui/icons-material/Security';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useGetUserDataQuery } from '../../../../globalState/userState/userStateApis';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';

function WithdrawalMethods() {
    const theme = useTheme();
    const { token } = useSelector((state) => state.auth);
    const { data, isLoading } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    });

    const isKycVerified = !isLoading && data?.data?.userData?.isKycVerified;
    const isBankVerified = !isLoading && data?.data?.userData?.isBankVerified;

    const [anchorEl, setAnchorEl] = useState(null);
    const [popoverContent, setPopoverContent] = useState('');

    const availableMethods = withdrawalMethodsData.filter(m => m.specification !== "Unavailable" && m.to);
    const unavailableMethods = withdrawalMethodsData.filter(m => m.specification === "Unavailable" || !m.to);

    const verificationProgress = () => {
        let completed = 0;
        if (isKycVerified) completed++;
        if (isBankVerified) completed++;
        return { completed, total: 2, percentage: (completed / 2) * 100 };
    };
    const progress = verificationProgress();

    const handleInfoClick = (event, content) => {
        setAnchorEl(event.currentTarget);
        setPopoverContent(content);
    };
    const handlePopoverClose = () => setAnchorEl(null);
    const open = Boolean(anchorEl);

    const borderColor = theme.palette.mode === 'dark'
        ? alpha(theme.palette.divider, 0.1)
        : theme.palette.divider;

    const cardBgColor = theme.palette.mode === 'dark'
        ? alpha(theme.palette.background.paper, 0.8)
        : theme.palette.background.paper;

    const unavailableBg = theme.palette.mode === 'dark'
        ? alpha(theme.palette.grey[900], 0.3)
        : alpha('#000', 0.02);

    return (
        <Stack spacing={3} mb={"2rem"}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant='h4' fontWeight={700} color="text.primary">
                            Withdraw Funds
                        </Typography>
                        <Tooltip title="More information about withdrawals">
                            <IconButton
                                size="small"
                                onClick={(e) => handleInfoClick(e, "• All withdrawal methods are secure and encrypted\n• Withdrawals are processed within 1-5 business days\n• Contact support if you experience any delays\n• Some methods may have processing fees")}
                                sx={{ color: 'primary.main', '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) } }}
                            >
                                <InfoIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Typography variant='body1' color="text.secondary">
                        Choose your preferred withdrawal method. Your funds will be processed securely.
                    </Typography>
                </Box>
            </Box>

            {/* Information Popover */}
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                PaperProps={{
                    sx: {
                        p: 2, maxWidth: 400, borderRadius: 2,
                        border: `1px solid ${borderColor}`,
                        bgcolor: theme.palette.background.paper,
                    }
                }}
            >
                <Stack spacing={1}>
                    <Typography variant="subtitle2" fontWeight={600} color="primary">Withdrawal Information</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                        {popoverContent}
                    </Typography>
                </Stack>
            </Popover>

            {/* Verification Banner */}
            {progress.percentage < 100 && (
                <Alert
                    severity="warning"
                    icon={<WarningIcon />}
                    sx={{
                        borderRadius: 2,
                        border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
                        '& .MuiAlert-message': { width: '100%' },
                        bgcolor: alpha(theme.palette.warning.main, 0.05),
                    }}
                >
                    <Stack spacing={1}>
                        <Typography variant="subtitle2" fontWeight={600} color={theme.palette.mode === 'dark' ? 'warning.light' : 'warning.dark'}>
                            Complete Verification to Access All Withdrawal Methods
                        </Typography>
                        <Box sx={{ width: '100%', mt: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="caption" color="text.secondary">Verification Progress</Typography>
                                <Typography variant="caption" fontWeight={600} color="warning.main">
                                    {progress.completed}/{progress.total} Complete
                                </Typography>
                            </Box>
                            <Box sx={{ width: '100%', height: 8, bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.200', borderRadius: 4, overflow: 'hidden' }}>
                                <Box sx={{ width: `${progress.percentage}%`, height: '100%', bgcolor: progress.percentage === 100 ? 'success.main' : 'warning.main', transition: 'width 0.5s ease' }} />
                            </Box>
                        </Box>
                        <Stack spacing={1} sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {isKycVerified ? <CheckCircleIcon color="success" fontSize="small" /> : <LockIcon color="warning" fontSize="small" />}
                                <Typography variant="body2" color="text.primary">
                                    KYC Verification: {isKycVerified ? 'Verified' : 'Pending'}
                                </Typography>
                                {!isKycVerified && (
                                    <Button size="small" variant="text" component={Link} to="/client/compliance/document/list"
                                        sx={{ ml: 'auto', fontSize: '0.75rem', color: 'warning.main', '&:hover': { bgcolor: alpha(theme.palette.warning.main, 0.1) } }}>
                                        Complete Now
                                    </Button>
                                )}
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {isBankVerified ? <CheckCircleIcon color="success" fontSize="small" /> : <LockIcon color="warning" fontSize="small" />}
                                <Typography variant="body2" color="text.primary">
                                    Bank Verification: {isBankVerified ? 'Verified' : 'Pending'}
                                </Typography>
                                {!isBankVerified && (
                                    <Button size="small" variant="text" component={Link} to="/client/compliance/bank/add"
                                        sx={{ ml: 'auto', fontSize: '0.75rem', color: 'warning.main', '&:hover': { bgcolor: alpha(theme.palette.warning.main, 0.1) } }}>
                                        Complete Now
                                    </Button>
                                )}
                            </Box>
                        </Stack>
                    </Stack>
                </Alert>
            )}

            {/* Important Info Chips */}
            <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight={600} color="text.secondary">Important Information</Typography>
                    <Tooltip title="Click chips for details">
                        <IconButton size="small" onClick={(e) => handleInfoClick(e, "• Minimum withdrawal amount varies by method\n• Processing time: 1-5 business days\n• Fees may apply depending on the method\n• Contact support for any issues")}
                            sx={{ color: 'info.main', p: 0.5, '&:hover': { bgcolor: alpha(theme.palette.info.main, 0.1) } }}>
                            <InfoIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                    <Chip icon={<AttachMoneyIcon fontSize="small" />} label="Min withdrawal varies" size="small" variant="outlined" color="info" sx={{ fontSize: '0.75rem' }}
                        onClick={(e) => handleInfoClick(e, "Minimum withdrawal amount varies by method. Check each method for specific limits.")} />
                    <Chip icon={<ScheduleIcon fontSize="small" />} label="1-5 business days" size="small" variant="outlined" color="warning" sx={{ fontSize: '0.75rem' }}
                        onClick={(e) => handleInfoClick(e, "Withdrawals are processed within 1-5 business days. Some methods may take longer.")} />
                    <Chip icon={<LockIcon fontSize="small" />} label="Verification needed" size="small" variant="outlined" color="warning" sx={{ fontSize: '0.75rem' }}
                        onClick={(e) => handleInfoClick(e, "Some methods require additional verification. Complete KYC for full access.")} />
                    <Chip icon={<MoneyOffIcon fontSize="small" />} label="Fees may apply" size="small" variant="outlined" color="info" sx={{ fontSize: '0.75rem' }}
                        onClick={(e) => handleInfoClick(e, "Some withdrawal methods may have processing fees. Check each method for details.")} />
                    <Chip icon={<SecurityIcon fontSize="small" />} label="Secure processing" size="small" variant="outlined" color="success" sx={{ fontSize: '0.75rem' }}
                        onClick={(e) => handleInfoClick(e, "All withdrawals are processed securely with multiple verification steps.")} />
                </Stack>
            </Box>

            {/* Available Methods */}
            <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Typography variant="h6" fontWeight={600} color="text.primary">
                        Available Withdrawal Methods ({availableMethods.length})
                    </Typography>
                </Box>
                <Grid container spacing={3}>
                    {availableMethods.map((item, i) => (
                        <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                            <Card
                                component={Link}
                                to={item.to}
                                sx={{
                                    p: 3,
                                    borderRadius: 2,
                                    border: `1px solid ${borderColor}`,
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                    transition: 'all 0.3s ease',
                                    backgroundColor: cardBgColor,
                                    boxShadow: theme.palette.mode === 'dark'
                                        ? '0 4px 20px rgba(0,0,0,0.2)'
                                        : '0 4px 20px rgba(0,0,0,0.05)',
                                    '&:hover': {
                                        boxShadow: theme.palette.mode === 'dark'
                                            ? '0 8px 32px rgba(0,0,0,0.3)'
                                            : '0 8px 32px rgba(0,0,0,0.1)',
                                        borderColor: 'primary.main',
                                        transform: 'translateY(-4px)',
                                        '& .arrow-icon': { transform: 'translateX(4px)' }
                                    }
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Box sx={{
                                            width: 48, height: 48,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            borderRadius: 2,
                                            bgcolor: alpha(theme.palette.primary.main, 0.1)
                                        }}>
                                            <img src={item.img} alt={item.methodName} style={{ width: 32, height: 32, objectFit: 'contain' }} />
                                        </Box>
                                        <Typography fontWeight={700} variant="h6" color="text.primary">
                                            {item.methodName}
                                        </Typography>
                                    </Stack>
                                    <ArrowForwardIcon className="arrow-icon" color="primary"
                                        sx={{ transition: 'transform 0.3s ease', opacity: 0.7 }} />
                                </Box>

                                <Stack spacing={1.5} sx={{ flexGrow: 1 }}>
                                    {Object.entries(item?.details).map(([key, value], idx) => (
                                        <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
                                            <Typography variant="body2" color="text.secondary">{key}</Typography>
                                            <Typography variant="body2" fontWeight={600} color="primary.main">{value}</Typography>
                                        </Box>
                                    ))}
                                </Stack>

                                <Button
                                    fullWidth
                                    variant="contained"
                                    endIcon={<ArrowForwardIcon />}
                                    sx={{ mt: 2, borderRadius: 1, boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
                                >
                                    Withdraw via {item.methodName}
                                </Button>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Unavailable Methods */}
            {unavailableMethods.length > 0 && (
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Typography variant="h6" fontWeight={600} color="text.secondary">
                            Unavailable Methods ({unavailableMethods.length})
                        </Typography>
                    </Box>
                    <Alert severity="info" sx={{ borderRadius: 2, mb: 2 }}>
                        Complete verification to unlock these withdrawal methods
                    </Alert>
                    <Grid container spacing={2}>
                        {unavailableMethods.map((item, i) => (
                            <Grid key={i} size={{ xs: 12, sm: 6 }}>
                                <Paper sx={{
                                    p: 2, borderRadius: 2,
                                    border: `1px solid ${borderColor}`,
                                    bgcolor: unavailableBg,
                                    opacity: 0.7,
                                    display: 'flex', alignItems: 'center', gap: 2,
                                    transition: 'all 0.2s ease',
                                    '&:hover': { opacity: 0.9 }
                                }}>
                                    <Box sx={{
                                        width: 40, height: 40,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        borderRadius: 1,
                                        bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.grey[800], 0.5) : alpha('#000', 0.05)
                                    }}>
                                        <img src={item.img} alt={item.methodName} style={{ width: 24, height: 24, objectFit: 'contain' }} />
                                    </Box>
                                    <Box>
                                        <Typography fontWeight={600} color="text.secondary">{item.methodName}</Typography>
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                                            <LockIcon fontSize="small" color="action" />
                                            <Typography variant="caption" color="text.secondary">Unavailable</Typography>
                                        </Stack>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
        </Stack>
    );
}

export default WithdrawalMethods;
