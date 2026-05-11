import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Typography, Box, Card, CardContent, Button, Stack,
    Chip, CircularProgress, Alert, Tabs, Tab, Avatar, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField, Paper
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import PauseOutlinedIcon from '@mui/icons-material/PauseOutlined';
import StopOutlinedIcon from '@mui/icons-material/StopOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {
    useGetMySubscriptionsQuery,
    usePauseSubscriptionMutation,
    useResumeSubscriptionMutation,
    useUnsubscribeMasterTraderMutation,
} from '../../../globalState/socialTradingState/socialTradingApis';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../../globalState/notificationState/notificationStateSlice';

const STATUS_TABS = [
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Paused', value: 'PAUSED' },
    { label: 'All', value: '' },
];

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

const statusChipColor = (status) => {
    if (status === 'ACTIVE') return 'success';
    if (status === 'PAUSED') return 'warning';
    return 'default';
};

function PauseReasonDialog({ open, onClose, onConfirm, loading }) {
    const [reason, setReason] = useState('');
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
            <DialogTitle sx={{ fontWeight: 700 }}>Pause Subscription</DialogTitle>
            <DialogContent>
                <TextField label="Reason (optional)" fullWidth size="small" value={reason}
                    onChange={(e) => setReason(e.target.value)} sx={{ mt: 1 }} />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2.5 }}>
                <Button onClick={onClose} disabled={loading} sx={{ textTransform: 'none' }}>Cancel</Button>
                <Button variant="contained" color="warning" onClick={() => onConfirm(reason)} disabled={loading}
                    sx={{ textTransform: 'none', boxShadow: 'none', borderRadius: 2 }}>
                    {loading ? <CircularProgress size={18} /> : 'Pause'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

function SubscriptionCard({ sub, onPause, onResume, onStop, onView }) {
    const trader = sub.masterTrader;
    const [pauseOpen, setPauseOpen] = useState(false);
    const grad = traderGradient(trader?.id);

    return (
        <Card variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 3 } }}>
            {/* Color accent strip */}
            <Box sx={{ height: 4, background: grad }} />
            <CardContent>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
                    <Avatar sx={{ width: 48, height: 48, fontSize: 18, fontWeight: 800, background: grad, flexShrink: 0 }}>
                        {(trader?.displayName || 'T')[0].toUpperCase()}
                    </Avatar>

                    <Box flex={1} minWidth={0}>
                        <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                            <Typography variant="subtitle1" fontWeight={700} noWrap>
                                {trader?.displayName || 'Unknown Trader'}
                            </Typography>
                            <Chip label={sub.status} color={statusChipColor(sub.status)} size="small" />
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                            MT5 Account: <strong>{sub.login}</strong>
                            {sub.subscribedAt && ` · Since ${new Date(sub.subscribedAt).toLocaleDateString()}`}
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={1} flexShrink={0} flexWrap="wrap" justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}>
                        <Button size="small" variant="outlined" startIcon={<OpenInNewIcon fontSize="small" />}
                            onClick={() => onView(trader?.id)} sx={{ textTransform: 'none', borderRadius: 2 }}>
                            View
                        </Button>

                        {sub.status === 'ACTIVE' && (
                            <Button size="small" variant="outlined" color="warning" startIcon={<PauseOutlinedIcon fontSize="small" />}
                                onClick={() => setPauseOpen(true)} sx={{ textTransform: 'none', borderRadius: 2 }}>
                                Pause
                            </Button>
                        )}
                        {sub.status === 'PAUSED' && (
                            <Button size="small" variant="outlined" color="success" startIcon={<PlayArrowOutlinedIcon fontSize="small" />}
                                onClick={() => onResume(sub.id)} sx={{ textTransform: 'none', borderRadius: 2 }}>
                                Resume
                            </Button>
                        )}
                        {(sub.status === 'ACTIVE' || sub.status === 'PAUSED') && (
                            <Button size="small" variant="outlined" color="error" startIcon={<StopOutlinedIcon fontSize="small" />}
                                onClick={() => onStop(sub.id)} sx={{ textTransform: 'none', borderRadius: 2 }}>
                                Stop
                            </Button>
                        )}
                    </Stack>
                </Stack>
            </CardContent>

            <PauseReasonDialog
                open={pauseOpen}
                onClose={() => setPauseOpen(false)}
                onConfirm={(reason) => { onPause(sub.id, reason); setPauseOpen(false); }}
                loading={false}
            />
        </Card>
    );
}

export default function MySubscriptions() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [tabIndex, setTabIndex] = useState(0);
    const status = STATUS_TABS[tabIndex].value;
    const [pagination] = useState({ page: 1, sizePerPage: 20 });

    const { data, isLoading, isError, error, refetch } = useGetMySubscriptionsQuery({
        page: pagination.page, sizePerPage: pagination.sizePerPage, status,
    });

    const [pause] = usePauseSubscriptionMutation();
    const [resume] = useResumeSubscriptionMutation();
    const [stop] = useUnsubscribeMasterTraderMutation();

    const subscriptions = data?.data?.subscriptions || [];
    const totalRecords = data?.data?.totalRecords || 0;

    const notify = (message, severity = 'success') => dispatch(setNotification({ open: true, message, severity }));

    const handlePause = async (subscriptionId, reason) => {
        try { await pause({ subscriptionId, reason }).unwrap(); notify('Subscription paused.'); refetch(); }
        catch (e) { notify(e?.data?.message || 'Failed to pause.', 'error'); }
    };
    const handleResume = async (subscriptionId) => {
        try { await resume({ subscriptionId }).unwrap(); notify('Subscription resumed.'); refetch(); }
        catch (e) { notify(e?.data?.message || 'Failed to resume.', 'error'); }
    };
    const handleStop = async (subscriptionId) => {
        try { await stop({ subscriptionId }).unwrap(); notify('Copy trading stopped.'); refetch(); }
        catch (e) { notify(e?.data?.message || 'Failed to stop.', 'error'); }
    };

    return (
        <Box>
            {/* ── Hero ── */}
            <Box sx={{
                background: `linear-gradient(rgba(7,12,42,0.88), rgba(10,22,74,0.78)), url('https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1920&q=80') center/cover no-repeat`,
                py: { xs: 5, md: 7 },
                textAlign: 'center',
                color: 'white',
            }}>
                <ContentCopyIcon sx={{ fontSize: 38, mb: 1, opacity: 0.9 }} />
                <Typography variant="h4" fontWeight={800} mb={1}>My Copy Trading</Typography>
                <Typography variant="body1" sx={{ opacity: 0.75 }}>
                    Manage your active and paused copy trading subscriptions.
                </Typography>
                <Button
                    variant="outlined"
                    onClick={() => navigate('/client/socialTrading/discover')}
                    sx={{ mt: 2.5, textTransform: 'none', borderColor: 'rgba(255,255,255,0.5)', color: 'white', borderRadius: 2, '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
                >
                    Discover More Traders
                </Button>
            </Box>

            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs value={tabIndex} onChange={(_, v) => setTabIndex(v)}>
                        {STATUS_TABS.map((t) => (
                            <Tab key={t.value} label={t.label} sx={{ textTransform: 'none', fontWeight: 600 }} />
                        ))}
                    </Tabs>
                </Box>

                {isLoading && <Box display="flex" justifyContent="center" py={8}><CircularProgress /></Box>}
                {isError && <Alert severity="error">{error?.data?.message || 'Failed to load subscriptions.'}</Alert>}

                {!isLoading && !isError && subscriptions.length === 0 && (
                    <Box textAlign="center" py={8}>
                        <ContentCopyIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" mb={1}>No subscriptions yet</Typography>
                        <Typography variant="body2" color="text.disabled" mb={3}>
                            {status === 'ACTIVE' ? "You don't have any active copy trading subscriptions."
                                : status === 'PAUSED' ? "You don't have any paused subscriptions."
                                    : "Start copying expert traders to grow your portfolio."}
                        </Typography>
                        <Button variant="contained" onClick={() => navigate('/client/socialTrading/discover')}
                            sx={{ textTransform: 'none', boxShadow: 'none', borderRadius: 2 }}>
                            Discover Master Traders
                        </Button>
                    </Box>
                )}

                {!isLoading && subscriptions.length > 0 && (
                    <>
                        <Typography variant="body2" color="text.secondary" mb={2.5}>
                            {totalRecords} subscription{totalRecords !== 1 ? 's' : ''}
                        </Typography>
                        <Stack spacing={2}>
                            {subscriptions.map((sub) => (
                                <SubscriptionCard
                                    key={sub.id} sub={sub}
                                    onPause={handlePause} onResume={handleResume} onStop={handleStop}
                                    onView={(traderId) => navigate(`/client/socialTrading/masterTrader/${traderId}`)}
                                />
                            ))}
                        </Stack>
                    </>
                )}
            </Container>
        </Box>
    );
}
