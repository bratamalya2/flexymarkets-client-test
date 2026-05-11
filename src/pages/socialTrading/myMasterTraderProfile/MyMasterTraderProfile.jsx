import {
    Box, Container, Typography, Card, CardContent, Stack, Button,
    TextField, InputLabel, Grid, Switch, FormControlLabel,
    CircularProgress, Alert, Chip, Select, MenuItem, OutlinedInput,
    Checkbox, ListItemText, FormControl, Avatar, Divider
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../../globalState/notificationState/notificationStateSlice';
import {
    useGetMyMasterTraderProfileQuery,
    useUpdateMyMasterTraderProfileMutation,
} from '../../../globalState/socialTradingState/socialTradingApis';

const schema = z.object({
    displayName: z.string().min(1, 'Display name is required'),
    description: z.string().optional(),
    riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH']),
    tradingStyle: z.enum(['SCALPING', 'SWING', 'DAY', 'POSITION']).optional().nullable(),
    instruments: z.array(z.enum(['FOREX', 'INDICES', 'COMMODITIES', 'CRYPTO', 'STOCKS'])).optional().default([]),
    avgTradeDuration: z.enum(['MINUTES', 'HOURS', 'DAYS', 'WEEKS']).optional().nullable(),
    minimumCopyBalance: z.coerce.number().min(0, 'Must be 0 or greater'),
    maxCopiers: z.coerce.number().int().min(1, 'Must be at least 1'),
});

const AVATAR_GRADIENTS = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
];
const traderGradient = (id) => AVATAR_GRADIENTS[(Number(id) || 0) % AVATAR_GRADIENTS.length];

const riskColor = (level) => {
    if (level === 'LOW') return 'success';
    if (level === 'HIGH') return 'error';
    return 'warning';
};

const RISK_OPTIONS = [
    { value: 'LOW', label: 'Low' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'HIGH', label: 'High' },
];
const STYLE_OPTIONS = [
    { value: '', label: 'Not specified' },
    { value: 'SCALPING', label: 'Scalping' },
    { value: 'SWING', label: 'Swing' },
    { value: 'DAY', label: 'Day Trading' },
    { value: 'POSITION', label: 'Position' },
];
const DURATION_OPTIONS = [
    { value: '', label: 'Not specified' },
    { value: 'MINUTES', label: 'Minutes' },
    { value: 'HOURS', label: 'Hours' },
    { value: 'DAYS', label: 'Days' },
    { value: 'WEEKS', label: 'Weeks' },
];
const INSTRUMENT_OPTIONS = ['FOREX', 'INDICES', 'COMMODITIES', 'CRYPTO', 'STOCKS'];

export default function MyMasterTraderProfile() {
    const dispatch = useDispatch();
    const { data, isLoading, isError } = useGetMyMasterTraderProfileQuery();
    const [updateProfile, { isLoading: isSaving }] = useUpdateMyMasterTraderProfileMutation();

    const trader = data?.data;
    const grad = traderGradient(trader?.id);

    const { register, handleSubmit, reset, watch, setValue, control, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            displayName: '', description: '', riskLevel: 'MEDIUM',
            tradingStyle: null, instruments: [], avgTradeDuration: null,
            minimumCopyBalance: 0, maxCopiers: 500,
        },
    });

    useEffect(() => {
        if (trader) {
            reset({
                displayName: trader.displayName || '',
                description: trader.description || '',
                riskLevel: trader.riskLevel || 'MEDIUM',
                tradingStyle: trader.tradingStyle || null,
                instruments: trader.instruments || [],
                avgTradeDuration: trader.avgTradeDuration || null,
                minimumCopyBalance: parseFloat(trader.minimumCopyBalance) || 0,
                maxCopiers: trader.maxCopiers || 500,
            });
        }
    }, [trader, reset]);

    const onSubmit = async (formData) => {
        try {
            const res = await updateProfile({
                displayName: formData.displayName,
                description: formData.description || '',
                riskLevel: formData.riskLevel,
                tradingStyle: formData.tradingStyle || null,
                instruments: formData.instruments || [],
                avgTradeDuration: formData.avgTradeDuration || null,
                minimumCopyBalance: Number(formData.minimumCopyBalance),
                maxCopiers: Number(formData.maxCopiers),
            }).unwrap();
            dispatch(setNotification({ open: true, message: res?.message || 'Profile updated!', severity: 'success' }));
        } catch (err) {
            dispatch(setNotification({ open: true, message: err?.data?.message || 'Failed to update profile.', severity: 'error' }));
        }
    };

    const instruments = watch('instruments') || [];

    return (
        <Box>
            {/* ── Hero ── */}
            <Box sx={{
                background: `linear-gradient(rgba(7,12,42,0.88), rgba(10,22,74,0.78)), url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1920&q=80') center/cover no-repeat`,
                py: { xs: 5, md: 7 },
                textAlign: 'center',
                color: 'white',
            }}>
                <TrendingUpIcon sx={{ fontSize: 38, mb: 1, opacity: 0.9 }} />
                <Typography variant="h4" fontWeight={800} mb={1}>My Trader Profile</Typography>
                <Typography variant="body1" sx={{ opacity: 0.75 }}>
                    Manage your public profile to attract more copiers.
                </Typography>
            </Box>

            <Container maxWidth="md" sx={{ py: 4 }}>
                {isLoading && <Box display="flex" justifyContent="center" py={8}><CircularProgress /></Box>}
                {isError && <Alert severity="error">Failed to load your master trader profile.</Alert>}

                {!isLoading && !isError && !trader && (
                    <Alert severity="info" sx={{ borderRadius: 3 }}>
                        You do not have a master trader profile. Please contact support or your account manager to get set up as a master trader.
                    </Alert>
                )}

                {!isLoading && !isError && trader && (
                    <>
                        {/* ── Profile summary card ── */}
                        <Card variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden', mb: 3 }}>
                            <Box sx={{ background: grad, height: 90, position: 'relative', overflow: 'hidden' }}>
                                <Box sx={{ position: 'absolute', top: -20, right: -20, width: 130, height: 130, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.1)' }} />
                                <Box sx={{ position: 'absolute', bottom: -30, left: -10, width: 100, height: 100, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.07)' }} />
                            </Box>
                            <CardContent sx={{ pt: 0 }}>
                                <Box sx={{ mt: -4, mb: 1.5 }}>
                                    <Avatar sx={{ width: 68, height: 68, fontSize: 26, fontWeight: 800, background: grad, border: '3px solid white', boxShadow: 2 }}>
                                        {(trader.displayName || 'T')[0].toUpperCase()}
                                    </Avatar>
                                </Box>
                                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'flex-start' }} spacing={2}>
                                    <Box>
                                        <Stack direction="row" alignItems="center" spacing={1} mb={0.25}>
                                            <Typography variant="h6" fontWeight={800}>{trader.displayName}</Typography>
                                            <Chip label={trader.riskLevel} color={riskColor(trader.riskLevel)} size="small" variant="outlined" />
                                            <Chip label={trader.status} color={trader.status === 'ACTIVE' ? 'success' : 'default'} size="small" />
                                        </Stack>
                                        <Typography variant="caption" color="text.secondary">MT5 Login: {trader.mt5Login}</Typography>
                                    </Box>
                                    <Stack direction="row" spacing={3}>
                                        {[
                                            { icon: <PeopleOutlineIcon fontSize="small" />, label: 'Copiers', value: trader.activeCopiers ?? 0 },
                                            { icon: <AccountBalanceWalletOutlinedIcon fontSize="small" />, label: 'Min Balance', value: `$${trader.minimumCopyBalance}` },
                                            { icon: <ShowChartIcon fontSize="small" />, label: 'Max Copiers', value: trader.maxCopiers },
                                        ].map((s) => (
                                            <Box key={s.label} textAlign="center">
                                                <Box sx={{ color: 'text.secondary', display: 'flex', justifyContent: 'center' }}>{s.icon}</Box>
                                                <Typography variant="body2" fontWeight={700}>{s.value}</Typography>
                                                <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                                            </Box>
                                        ))}
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </Card>

                        {/* ── Edit form ── */}
                        <Card variant="outlined" sx={{ borderRadius: 3 }}>
                            <CardContent>
                                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                                    <EditOutlinedIcon fontSize="small" color="primary" />
                                    <Typography variant="subtitle1" fontWeight={700}>Edit Profile</Typography>
                                </Stack>
                                <Divider sx={{ mb: 3 }} />

                                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <InputLabel sx={{ mb: '.4rem', fontWeight: 600, fontSize: '0.85rem' }}>Display Name *</InputLabel>
                                            <TextField {...register('displayName')} size="small" fullWidth placeholder="Enter display name" />
                                            {errors.displayName && <Typography color="error" fontSize="13px" mt={0.5}>{errors.displayName.message}</Typography>}
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <InputLabel sx={{ mb: '.4rem', fontWeight: 600, fontSize: '0.85rem' }}>Risk Level *</InputLabel>
                                            <Controller name="riskLevel" control={control} render={({ field }) => (
                                                <Select {...field} size="small" fullWidth>
                                                    {RISK_OPTIONS.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
                                                </Select>
                                            )} />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <InputLabel sx={{ mb: '.4rem', fontWeight: 600, fontSize: '0.85rem' }}>Trading Style</InputLabel>
                                            <Controller name="tradingStyle" control={control} render={({ field }) => (
                                                <Select {...field} value={field.value || ''} onChange={(e) => field.onChange(e.target.value || null)} size="small" fullWidth>
                                                    {STYLE_OPTIONS.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
                                                </Select>
                                            )} />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <InputLabel sx={{ mb: '.4rem', fontWeight: 600, fontSize: '0.85rem' }}>Avg Trade Duration</InputLabel>
                                            <Controller name="avgTradeDuration" control={control} render={({ field }) => (
                                                <Select {...field} value={field.value || ''} onChange={(e) => field.onChange(e.target.value || null)} size="small" fullWidth>
                                                    {DURATION_OPTIONS.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
                                                </Select>
                                            )} />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <InputLabel sx={{ mb: '.4rem', fontWeight: 600, fontSize: '0.85rem' }}>Instruments Traded</InputLabel>
                                            <FormControl fullWidth size="small">
                                                <Select
                                                    multiple
                                                    value={instruments}
                                                    onChange={(e) => setValue('instruments', e.target.value, { shouldValidate: true })}
                                                    input={<OutlinedInput />}
                                                    renderValue={(sel) => sel.length ? sel.join(', ') : 'None'}
                                                >
                                                    {INSTRUMENT_OPTIONS.map((inst) => (
                                                        <MenuItem key={inst} value={inst}>
                                                            <Checkbox checked={instruments.includes(inst)} />
                                                            <ListItemText primary={inst.charAt(0) + inst.slice(1).toLowerCase()} />
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <InputLabel sx={{ mb: '.4rem', fontWeight: 600, fontSize: '0.85rem' }}>Minimum Copy Balance *</InputLabel>
                                            <TextField type="number" {...register('minimumCopyBalance', { valueAsNumber: true })} size="small" fullWidth placeholder="0" />
                                            {errors.minimumCopyBalance && <Typography color="error" fontSize="13px" mt={0.5}>{errors.minimumCopyBalance.message}</Typography>}
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <InputLabel sx={{ mb: '.4rem', fontWeight: 600, fontSize: '0.85rem' }}>Max Copiers *</InputLabel>
                                            <TextField type="number" {...register('maxCopiers', { valueAsNumber: true })} size="small" fullWidth placeholder="500" />
                                            {errors.maxCopiers && <Typography color="error" fontSize="13px" mt={0.5}>{errors.maxCopiers.message}</Typography>}
                                        </Grid>

                                        <Grid item xs={12}>
                                            <InputLabel sx={{ mb: '.4rem', fontWeight: 600, fontSize: '0.85rem' }}>Description</InputLabel>
                                            <TextField {...register('description')} size="small" fullWidth multiline rows={3} placeholder="Describe your trading approach to attract copiers..." />
                                        </Grid>
                                    </Grid>

                                    <Button type="submit" variant="contained" disabled={isSaving}
                                        sx={{ mt: 3, textTransform: 'none', fontWeight: 700, boxShadow: 'none', borderRadius: 2, px: 4, '&:hover': { boxShadow: 'none' } }}>
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </>
                )}
            </Container>
        </Box>
    );
}
