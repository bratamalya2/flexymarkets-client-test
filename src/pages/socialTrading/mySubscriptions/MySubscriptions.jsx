import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Typography, Box, Card, CardContent, Button, Stack,
    Chip, CircularProgress, Alert, Tabs, Tab, Avatar, Divider,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import PauseOutlinedIcon from '@mui/icons-material/PauseOutlined';
import StopOutlinedIcon from '@mui/icons-material/StopOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
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

const statusChipColor = (status) => {
    if (status === 'ACTIVE') return 'success';
    if (status === 'PAUSED') return 'warning';
    if (status === 'INACTIVE') return 'default';
    return 'default';
};

function PauseReasonDialog({ open, onClose, onConfirm, loading }) {
    const [reason, setReason] = useState('');
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Pause Subscription</DialogTitle>
            <DialogContent>
                <TextField
                    label="Reason (optional)"
                    fullWidth
                    size="small"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    sx={{ mt: 1 }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>Cancel</Button>
                <Button
                    variant="contained"
                    color="warning"
                    onClick={() => onConfirm(reason)}
                    disabled={loading}
                    sx={{ textTransform: 'none', boxShadow: 'none' }}
                >
                    {loading ? <CircularProgress size={18} /> : 'Pause'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

function SubscriptionCard({ sub, onPause, onResume, onStop, onView }) {
    const trader = sub.masterTrader;
    const [pauseOpen, setPauseOpen] = useState(false);

    return (
        <Card variant="outlined">
            <CardContent>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 44, height: 44, fontSize: 18 }}>
                        {(trader?.displayName || 'T')[0].toUpperCase()}
                    </Avatar>
                    <Box flex={1}>
                        <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                            <Typography variant="subtitle2" fontWeight={600}>
                                {trader?.displayName || 'Unknown Trader'}
                            </Typography>
                            <Chip label={sub.status} color={statusChipColor(sub.status)} size="small" />
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                            MT5 Account: {sub.login}
                            {sub.subscribedAt && ` • Since ${new Date(sub.subscribedAt).toLocaleDateString()}`}
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={1} flexShrink={0} flexWrap="wrap" justifyContent="flex-end">
                        <Button
                            size="small"
                            variant="outlined"
                            startIcon={<OpenInNewIcon fontSize="small" />}
                            onClick={() => onView(trader?.id)}
                            sx={{ textTransform: 'none' }}
                        >
                            View
                        </Button>

                        {sub.status === 'ACTIVE' && (
                            <Button
                                size="small"
                                variant="outlined"
                                color="warning"
                                startIcon={<PauseOutlinedIcon fontSize="small" />}
                                onClick={() => setPauseOpen(true)}
                                sx={{ textTransform: 'none' }}
                            >
                                Pause
                            </Button>
                        )}

                        {sub.status === 'PAUSED' && (
                            <Button
                                size="small"
                                variant="outlined"
                                color="success"
                                startIcon={<PlayArrowOutlinedIcon fontSize="small" />}
                                onClick={() => onResume(sub.id)}
                                sx={{ textTransform: 'none' }}
                            >
                                Resume
                            </Button>
                        )}

                        {(sub.status === 'ACTIVE' || sub.status === 'PAUSED') && (
                            <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                startIcon={<StopOutlinedIcon fontSize="small" />}
                                onClick={() => onStop(sub.id)}
                                sx={{ textTransform: 'none' }}
                            >
                                Stop
                            </Button>
                        )}
                    </Stack>
                </Stack>

                <PauseReasonDialog
                    open={pauseOpen}
                    onClose={() => setPauseOpen(false)}
                    onConfirm={(reason) => { onPause(sub.id, reason); setPauseOpen(false); }}
                    loading={false}
                />
            </CardContent>
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
        page: pagination.page,
        sizePerPage: pagination.sizePerPage,
        status,
    });

    const [pause, { isLoading: pausing }] = usePauseSubscriptionMutation();
    const [resume, { isLoading: resuming }] = useResumeSubscriptionMutation();
    const [stop, { isLoading: stopping }] = useUnsubscribeMasterTraderMutation();

    const subscriptions = data?.data?.subscriptions || [];
    const totalRecords = data?.data?.totalRecords || 0;

    const notify = (message, severity = 'success') =>
        dispatch(setNotification({ open: true, message, severity }));

    const handlePause = async (subscriptionId, reason) => {
        try {
            await pause({ subscriptionId, reason }).unwrap();
            notify('Subscription paused.');
            refetch();
        } catch (e) {
            notify(e?.data?.message || 'Failed to pause.', 'error');
        }
    };

    const handleResume = async (subscriptionId) => {
        try {
            await resume({ subscriptionId }).unwrap();
            notify('Subscription resumed.');
            refetch();
        } catch (e) {
            notify(e?.data?.message || 'Failed to resume.', 'error');
        }
    };

    const handleStop = async (subscriptionId) => {
        try {
            await stop({ subscriptionId }).unwrap();
            notify('Copy trading stopped.');
            refetch();
        } catch (e) {
            notify(e?.data?.message || 'Failed to stop.', 'error');
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <TrendingUpIcon color="primary" />
                    <Typography variant="h5" fontWeight={600}>My Subscriptions</Typography>
                </Stack>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate('/client/socialTrading/discover')}
                    sx={{ textTransform: 'none' }}
                >
                    Discover Traders
                </Button>
            </Stack>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabIndex} onChange={(_, v) => setTabIndex(v)}>
                    {STATUS_TABS.map((t) => (
                        <Tab key={t.value} label={t.label} />
                    ))}
                </Tabs>
            </Box>

            {isLoading && (
                <Box display="flex" justifyContent="center" py={6}>
                    <CircularProgress />
                </Box>
            )}

            {isError && (
                <Alert severity="error">
                    {error?.data?.message || 'Failed to load subscriptions.'}
                </Alert>
            )}

            {!isLoading && !isError && subscriptions.length === 0 && (
                <Box textAlign="center" py={6}>
                    <Alert severity="info" sx={{ mb: 2 }}>
                        {status === 'ACTIVE'
                            ? "You don't have any active copy trading subscriptions."
                            : status === 'PAUSED'
                                ? "You don't have any paused subscriptions."
                                : "You have no subscriptions yet."}
                    </Alert>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/client/socialTrading/discover')}
                        sx={{ textTransform: 'none', boxShadow: 'none' }}
                    >
                        Discover Master Traders
                    </Button>
                </Box>
            )}

            {!isLoading && subscriptions.length > 0 && (
                <>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                        {totalRecords} subscription{totalRecords !== 1 ? 's' : ''}
                    </Typography>
                    <Stack spacing={2}>
                        {subscriptions.map((sub) => (
                            <SubscriptionCard
                                key={sub.id}
                                sub={sub}
                                onPause={handlePause}
                                onResume={handleResume}
                                onStop={handleStop}
                                onView={(traderId) => navigate(`/client/socialTrading/masterTrader/${traderId}`)}
                            />
                        ))}
                    </Stack>
                </>
            )}
        </Container>
    );
}
