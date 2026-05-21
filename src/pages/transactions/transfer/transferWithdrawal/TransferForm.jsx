import {
    Button,
    Stack,
    Typography,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
    Box,
    Skeleton,
    Paper,
    useTheme,
    alpha,
    CircularProgress,
    Alert,
    Divider,
    Chip,
    IconButton,
    Tooltip,
    Popover,
    useMediaQuery,
    Card
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useDispatch, useSelector } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Selector from '../../../../components/Selector';
import { transferFormSchema } from './transferFormSchema';
import { useGetUserDataQuery, useMetaDepositMutation, useMetaWithdrawMutation } from '../../../../globalState/userState/userStateApis';
import { setNotification } from '../../../../globalState/notificationState/notificationStateSlice';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoIcon from '@mui/icons-material/Info';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import { useState } from 'react';

function TransferForm() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const isMobile = useMediaQuery('(max-width:600px)');

    const [anchorEl, setAnchorEl] = useState(null);
    const [popoverContent, setPopoverContent] = useState('');

    const defaultValues = { mt5Login: '', to: '', type: "2", amount: '' };

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isValid }
    } = useForm({
        resolver: zodResolver(transferFormSchema),
        defaultValues,
        mode: 'onChange'
    });

    const fromAccountValue = watch("mt5Login");
    const amount = watch("amount");
    const formattedAmount = amount ? parseFloat(amount).toFixed(2) : "0.00";

    const { token } = useSelector((state) => state.auth);
    const { data, isLoading: userDataLoading, refetch } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    });

    const walletBalance = Number(data?.data?.assetData?.mainBalance || 0).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });

    const MT5IDs = userDataLoading ? [] : (data?.data?.mt5AccountList)?.filter(item => item?.accountType == "REAL")?.map(item => item?.Login);

    const [metaDeposit, { isLoading: metaDepositLoading, isError: depositError, error: depositErrorData }] = useMetaDepositMutation();
    const [metaWithdraw, { isLoading: metaWithdrawLoading, isError: withdrawError, error: withdrawErrorData }] = useMetaWithdrawMutation();

    const isLoading = metaDepositLoading || metaWithdrawLoading;
    const isError = depositError || withdrawError;
    const errorData = depositErrorData || withdrawErrorData;

    const handleInfoClick = (event, content) => {
        setAnchorEl(event.currentTarget);
        setPopoverContent(content);
    };
    const handlePopoverClose = () => setAnchorEl(null);
    const open = Boolean(anchorEl);

    const borderColor = theme.palette.mode === 'dark'
        ? alpha(theme.palette.divider, 0.08)
        : alpha(theme.palette.divider, 0.2);

    const cardBgColor = theme.palette.mode === 'dark'
        ? alpha(theme.palette.background.paper, 0.98)
        : theme.palette.background.paper;

    const infoCardBg = theme.palette.mode === 'dark'
        ? alpha(theme.palette.info.dark, 0.15)
        : alpha(theme.palette.info.light, 0.08);

    const infoCardBorder = theme.palette.mode === 'dark'
        ? alpha(theme.palette.info.main, 0.2)
        : alpha(theme.palette.info.main, 0.15);

    const chipBgColor = theme.palette.mode === 'dark'
        ? alpha(theme.palette.success.main, 0.12)
        : alpha(theme.palette.success.main, 0.08);

    const chipBorderColor = theme.palette.mode === 'dark'
        ? alpha(theme.palette.success.main, 0.3)
        : alpha(theme.palette.success.main, 0.2);

    const onSubmit = async (data) => {
        const mt5LoginID = (data?.mt5Login).includes("Wallet");
        const finalData = {
            mt5Login: mt5LoginID ? data?.to : data?.mt5Login,
            type: data?.type,
            amount: data?.amount
        };
        try {
            const response = fromAccountValue.includes("Wallet")
                ? await metaDeposit(finalData).unwrap()
                : await metaWithdraw(finalData).unwrap();
            if (response?.status) {
                dispatch(setNotification({ open: true, message: "Transfer completed successfully!", severity: "success" }));
                reset(defaultValues);
                refetch();
            }
        } catch (error) {
            if (!error?.data?.status) {
                dispatch(setNotification({ open: true, message: error?.data?.message || "Failed to complete transfer. Please try again.", severity: "error" }));
            }
        }
    };

    const fromAccountOptions = userDataLoading
        ? []
        : [...MT5IDs, `Wallet (${walletBalance})`];

    const toAccountOptions = userDataLoading ? [] : [...MT5IDs, `Wallet (${walletBalance})`];

    return (
        <>
            {/* Info Popover */}
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                PaperProps={{
                    sx: {
                        p: 2, maxWidth: 300, borderRadius: 2,
                        border: `1px solid ${borderColor}`,
                        bgcolor: theme.palette.background.paper,
                    }
                }}
            >
                <Stack spacing={1}>
                    <Typography variant="subtitle2" fontWeight={600} color="text.primary">Information</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line', fontSize: '0.8rem' }}>
                        {popoverContent}
                    </Typography>
                </Stack>
            </Popover>

            {/* Main 2-panel layout */}
            <Box sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: 2,
            }}>
                {/* Left Panel - Form */}
                <Paper
                    elevation={0}
                    sx={{
                        flex: 2,
                        p: isMobile ? 1.5 : 2.5,
                        borderRadius: 2,
                        border: `1px solid ${borderColor}`,
                        backgroundColor: cardBgColor,
                    }}
                >
                    {/* Form Header with chips */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 2.5,
                        pb: 1.5,
                        borderBottom: `1px solid ${borderColor}`,
                    }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Box sx={{
                                width: 36, height: 36, borderRadius: 1.5,
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <SwapHorizIcon sx={{ color: theme.palette.primary.main, fontSize: '1.4rem' }} />
                            </Box>
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Typography variant="h6" fontWeight={600} color="text.primary">
                                        Transfer Details
                                    </Typography>
                                    <Tooltip title="Internal Transfer Information">
                                        <IconButton size="small"
                                            onClick={(e) => handleInfoClick(e, "• Internal transfers are processed instantly\n• No fees for transfers between your accounts\n• Available 24/7 for your convenience\n• All transfers are secured with encryption")}
                                            sx={{ color: 'primary.main', p: 0.3, '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08) } }}>
                                            <InfoIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                                <Typography variant="caption" color="text.secondary">
                                    Transfer funds between your accounts instantly
                                </Typography>
                            </Box>
                        </Stack>
                        <Stack direction="row" spacing={0.5}>
                            <Chip label="Instant" size="small" variant="outlined" color="success"
                                icon={<AccessTimeIcon fontSize="small" />}
                                sx={{ fontSize: '0.65rem', height: 22, borderColor: chipBorderColor, backgroundColor: chipBgColor, color: theme.palette.mode === 'dark' ? 'success.light' : 'success.dark' }} />
                            <Chip label="No fees" size="small" variant="outlined" color="success"
                                icon={<MoneyOffIcon fontSize="small" />}
                                sx={{ fontSize: '0.65rem', height: 22, borderColor: chipBorderColor, backgroundColor: chipBgColor, color: theme.palette.mode === 'dark' ? 'success.light' : 'success.dark' }} />
                        </Stack>
                    </Box>

                    {/* Error Alert */}
                    {isError && errorData?.data?.message && (
                        <Alert severity="error" sx={{ mb: 2, borderRadius: 1.5 }} icon={<ErrorOutlineIcon fontSize="small" />}>
                            {errorData.data.message}
                        </Alert>
                    )}

                    <Stack component={"form"} onSubmit={handleSubmit(onSubmit)} spacing={2.5}>
                        {/* From Account */}
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.8 }}>
                                <InputLabel sx={{ fontWeight: 500, color: 'text.primary', fontSize: '0.85rem', m: 0 }}>
                                    From Account *
                                </InputLabel>
                                <Tooltip title="From account information">
                                    <IconButton size="small"
                                        onClick={(e) => handleInfoClick(e, "• Select the account you want to transfer FROM\n• Choose from your MT5 trading accounts or Wallet\n• Make sure you have sufficient balance")}
                                        sx={{ color: 'info.main', p: 0.3, '&:hover': { bgcolor: alpha(theme.palette.info.main, 0.08) } }}>
                                        <InfoIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            {userDataLoading
                                ? <Skeleton variant="rectangular" height={42} sx={{ borderRadius: 1.5 }} />
                                : <Selector
                                    items={fromAccountOptions}
                                    value={watch("mt5Login")}
                                    onChange={(e) => setValue("mt5Login", e.target.value, { shouldValidate: true })}
                                    shouldBeFullWidth={true}
                                    disableItem={watch("to")}
                                />
                            }
                            {errors.mt5Login && <Typography color="error" variant="caption" sx={{ mt: 0.3, display: 'block' }}>{errors.mt5Login.message}</Typography>}
                        </Box>

                        {/* To Account */}
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.8 }}>
                                <InputLabel sx={{ fontWeight: 500, color: 'text.primary', fontSize: '0.85rem', m: 0 }}>
                                    To Account *
                                </InputLabel>
                                <Tooltip title="To account information">
                                    <IconButton size="small"
                                        onClick={(e) => handleInfoClick(e, "• Select the account you want to transfer TO\n• Choose from your MT5 trading accounts or Wallet\n• Cannot transfer to the same account")}
                                        sx={{ color: 'info.main', p: 0.3, '&:hover': { bgcolor: alpha(theme.palette.info.main, 0.08) } }}>
                                        <InfoIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            {userDataLoading
                                ? <Skeleton variant="rectangular" height={42} sx={{ borderRadius: 1.5 }} />
                                : <Selector
                                    items={toAccountOptions}
                                    value={watch("to")}
                                    onChange={(e) => setValue("to", e.target.value, { shouldValidate: true })}
                                    shouldBeFullWidth={true}
                                    disableItem={watch("mt5Login")}
                                />
                            }
                            {errors.to && <Typography color="error" variant="caption" sx={{ mt: 0.3, display: 'block' }}>{errors.to.message}</Typography>}
                        </Box>

                        {/* Hidden type */}
                        <Box sx={{ display: "none" }}>
                            <TextField {...register("type")} size='small' fullWidth variant="outlined" />
                        </Box>

                        {/* Amount */}
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.8 }}>
                                <InputLabel sx={{ fontWeight: 500, color: 'text.primary', fontSize: '0.85rem', m: 0 }}>
                                    Amount (USD) *
                                </InputLabel>
                                <Tooltip title="Amount information">
                                    <IconButton size="small"
                                        onClick={(e) => handleInfoClick(e, "• Enter the amount you want to transfer\n• Minimum transfer amount: $10\n• Amount should be in USD")}
                                        sx={{ color: 'info.main', p: 0.3, '&:hover': { bgcolor: alpha(theme.palette.info.main, 0.08) } }}>
                                        <InfoIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <OutlinedInput
                                {...register("amount")}
                                endAdornment={<InputAdornment position="end">USD</InputAdornment>}
                                fullWidth
                                placeholder="0.00"
                                type="number"
                                inputProps={{ min: 0, step: "0.01" }}
                                sx={{ fontWeight: "bold", fontSize: "20px" }}
                                error={!!errors.amount}
                            />
                            {errors.amount && <Typography color="error" fontSize={"14px"}>{errors.amount.message}</Typography>}
                        </Box>

                        {/* Submit */}
                        <Button
                            type='submit'
                            variant='contained'
                            disabled={isLoading || !isValid}
                            fullWidth
                            size="large"
                            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
                            sx={{
                                textTransform: 'none',
                                borderRadius: 1.5,
                                py: 1.2,
                                fontWeight: 600,
                                boxShadow: 'none',
                                '&:hover': { boxShadow: 'none' },
                                '&:disabled': { opacity: 0.6 }
                            }}
                        >
                            {isLoading ? 'Processing...' : 'Complete Transfer'}
                        </Button>
                    </Stack>
                </Paper>

                {/* Right Panel - Summary */}
                <Paper
                    elevation={0}
                    sx={{
                        flex: 1,
                        p: isMobile ? 1.5 : 2.5,
                        borderRadius: 2,
                        border: `1px solid ${borderColor}`,
                        backgroundColor: cardBgColor,
                        alignSelf: 'flex-start',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, pb: 1.5, borderBottom: `1px solid ${borderColor}` }}>
                        <Typography variant="h6" fontWeight={600} color="text.primary">Transfer Summary</Typography>
                        <Tooltip title="Summary information">
                            <IconButton size="small"
                                onClick={(e) => handleInfoClick(e, `• Transfer amount: ${formattedAmount} USD\n• Processing time: Instant\n• Fees: $0.00\n• Security: Encrypted transfer`)}
                                sx={{ color: 'primary.main', p: 0.3, '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08) } }}>
                                <InfoIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    {/* Live amount display */}
                    <Box sx={{
                        mb: 2,
                        p: 2,
                        borderRadius: 1.5,
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                        textAlign: 'center'
                    }}>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                            Transfer Amount
                        </Typography>
                        <Typography variant="h3" fontWeight={700} color="primary.main">
                            ${formattedAmount}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {amount ? "USD" : "Enter amount"}
                        </Typography>
                    </Box>

                    {/* Transfer Details */}
                    <Stack spacing={1.5} sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" fontWeight={600} color="text.secondary">Details</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary">From:</Typography>
                            <Typography variant="body2" fontWeight={500} color="text.primary" sx={{ textAlign: 'right', maxWidth: '60%', wordBreak: 'break-word' }}>
                                {fromAccountValue || 'Not selected'}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary">To:</Typography>
                            <Typography variant="body2" fontWeight={500} color="text.primary" sx={{ textAlign: 'right', maxWidth: '60%', wordBreak: 'break-word' }}>
                                {watch("to") || 'Not selected'}
                            </Typography>
                        </Box>
                        <Divider sx={{ borderColor: borderColor }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary">Processing:</Typography>
                            <Chip label="Instant" size="small" color="success" sx={{ fontSize: '0.65rem', height: 22, backgroundColor: chipBgColor, border: `1px solid ${chipBorderColor}`, color: theme.palette.mode === 'dark' ? 'success.light' : 'success.dark' }} />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary">Fees:</Typography>
                            <Chip label="No fees" size="small" color="success" sx={{ fontSize: '0.65rem', height: 22, backgroundColor: chipBgColor, border: `1px solid ${chipBorderColor}`, color: theme.palette.mode === 'dark' ? 'success.light' : 'success.dark' }} />
                        </Box>
                    </Stack>

                    {/* Info card */}
                    <Card sx={{ p: 1.5, borderRadius: 1.5, backgroundColor: infoCardBg, border: `1px solid ${infoCardBorder}` }}>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                            <InfoIcon sx={{ fontSize: '1rem', color: 'info.main', flexShrink: 0, mt: '2px' }} />
                            <Box>
                                <Typography variant="caption" fontWeight={500} color="text.primary" sx={{ mb: 0.2, display: 'block' }}>
                                    Important
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', lineHeight: 1.3 }}>
                                    Transfers are processed instantly with no fees. Minimum transfer amount is $10.
                                </Typography>
                            </Box>
                        </Box>
                    </Card>
                </Paper>
            </Box>
        </>
    );
}

export default TransferForm;
