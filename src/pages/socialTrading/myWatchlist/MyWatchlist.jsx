import { useNavigate } from 'react-router-dom';
import {
    Container, Typography, Box, Card, CardContent, Button, Stack,
    Chip, CircularProgress, Alert, Avatar, IconButton, Tooltip
} from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsOffOutlinedIcon from '@mui/icons-material/NotificationsOffOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
    useGetMyWatchlistQuery,
    useUnwatchMasterTraderMutation,
    useToggleWatchlistNotificationsMutation,
} from '../../../globalState/socialTradingState/socialTradingApis';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../../globalState/notificationState/notificationStateSlice';

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

function WatchlistCard({ entry, onRemove, onToggleNotifications, onView }) {
    const trader = entry.masterTrader;
    const stats = trader?.latestStats;
    const roi = stats?.totalPnLPercentage;
    const winRate = stats?.winRate;
    const copiers = stats?.activeCopiers;
    const grad = traderGradient(trader?.id);

    return (
        <Card variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 3 } }}>
            <Box sx={{ height: 4, background: grad }} />
            <CardContent>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
                    <Avatar sx={{ width: 48, height: 48, fontSize: 18, fontWeight: 800, background: grad, flexShrink: 0 }}>
                        {(trader?.displayName || 'T')[0].toUpperCase()}
                    </Avatar>

                    <Box flex={1} minWidth={0}>
                        <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" mb={0.25}>
                            <Typography variant="subtitle1" fontWeight={700} noWrap>
                                {trader?.displayName || 'Unknown'}
                            </Typography>
                            {trader?.riskLevel && (
                                <Chip label={trader.riskLevel} color={riskColor(trader.riskLevel)} size="small" variant="outlined" />
                            )}
                        </Stack>

                        <Stack direction="row" spacing={2.5} flexWrap="wrap">
                            <Typography variant="caption" color="text.secondary">
                                ROI:{' '}
                                <strong style={{ color: roi !== null && roi !== undefined ? (roi >= 0 ? '#2e7d32' : '#c62828') : 'inherit' }}>
                                    {roi !== null && roi !== undefined ? `${roi >= 0 ? '+' : ''}${parseFloat(roi).toFixed(2)}%` : '—'}
                                </strong>
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Win Rate: <strong>{winRate !== null && winRate !== undefined ? `${parseFloat(winRate).toFixed(1)}%` : '—'}</strong>
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Copiers: <strong>{copiers ?? '—'}</strong>
                            </Typography>
                        </Stack>

                        <Typography variant="caption" color="text.disabled">
                            Watching since {new Date(entry.createdAt).toLocaleDateString()}
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={0.5} alignItems="center" flexShrink={0}>
                        <Tooltip title={entry.notificationsEnabled ? 'Disable notifications' : 'Enable notifications'}>
                            <IconButton size="small" color={entry.notificationsEnabled ? 'primary' : 'default'}
                                onClick={() => onToggleNotifications(trader?.id, !entry.notificationsEnabled)}
                                sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
                                {entry.notificationsEnabled
                                    ? <NotificationsActiveIcon fontSize="small" />
                                    : <NotificationsOffOutlinedIcon fontSize="small" />}
                            </IconButton>
                        </Tooltip>

                        <Button size="small" variant="outlined" startIcon={<OpenInNewIcon fontSize="small" />}
                            onClick={() => onView(trader?.id)} sx={{ textTransform: 'none', borderRadius: 2 }}>
                            View
                        </Button>

                        <Tooltip title="Remove from watchlist">
                            <IconButton size="small" color="error" onClick={() => onRemove(trader?.id)}
                                sx={{ border: '1px solid', borderColor: 'error.light', borderRadius: 1.5 }}>
                                <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}

export default function MyWatchlist() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { data, isLoading, isError, error, refetch } = useGetMyWatchlistQuery({ page: 1, sizePerPage: 50 });
    const [unwatch] = useUnwatchMasterTraderMutation();
    const [toggleNotifications] = useToggleWatchlistNotificationsMutation();

    const watchlist = data?.data?.watchlist || [];
    const totalRecords = data?.data?.totalRecords || 0;

    const notify = (message, severity = 'success') => dispatch(setNotification({ open: true, message, severity }));

    const handleRemove = async (masterTraderId) => {
        try { await unwatch({ masterTraderId }).unwrap(); notify('Removed from watchlist.'); refetch(); }
        catch (e) { notify(e?.data?.message || 'Failed to remove.', 'error'); }
    };
    const handleToggleNotifications = async (masterTraderId, notificationsEnabled) => {
        try { await toggleNotifications({ masterTraderId, notificationsEnabled }).unwrap(); notify(`Notifications ${notificationsEnabled ? 'enabled' : 'disabled'}.`); refetch(); }
        catch (e) { notify(e?.data?.message || 'Failed to update.', 'error'); }
    };

    return (
        <Box>
            {/* ── Hero ── */}
            <Box sx={{
                background: `linear-gradient(rgba(7,12,42,0.88), rgba(10,22,74,0.78)), url('https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=1920&q=80') center/cover no-repeat`,
                py: { xs: 5, md: 7 },
                textAlign: 'center',
                color: 'white',
            }}>
                <BookmarkIcon sx={{ fontSize: 38, mb: 1, opacity: 0.9 }} />
                <Typography variant="h4" fontWeight={800} mb={1}>My Watchlist</Typography>
                <Typography variant="body1" sx={{ opacity: 0.75 }}>
                    Track the traders you're interested in without copying them.
                </Typography>
                <Button
                    variant="outlined"
                    onClick={() => navigate('/client/socialTrading/discover')}
                    sx={{ mt: 2.5, textTransform: 'none', borderColor: 'rgba(255,255,255,0.5)', color: 'white', borderRadius: 2, '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
                >
                    Discover Traders
                </Button>
            </Box>

            <Container maxWidth="lg" sx={{ py: 4 }}>
                {isLoading && <Box display="flex" justifyContent="center" py={8}><CircularProgress /></Box>}
                {isError && <Alert severity="error">{error?.data?.message || 'Failed to load watchlist.'}</Alert>}

                {!isLoading && !isError && watchlist.length === 0 && (
                    <Box textAlign="center" py={8}>
                        <BookmarkIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" mb={1}>Your watchlist is empty</Typography>
                        <Typography variant="body2" color="text.disabled" mb={3}>
                            Bookmark traders you want to follow and get performance updates.
                        </Typography>
                        <Button variant="contained" onClick={() => navigate('/client/socialTrading/discover')}
                            sx={{ textTransform: 'none', boxShadow: 'none', borderRadius: 2 }}>
                            Discover Master Traders
                        </Button>
                    </Box>
                )}

                {!isLoading && watchlist.length > 0 && (
                    <>
                        <Typography variant="body2" color="text.secondary" mb={2.5}>
                            {totalRecords} trader{totalRecords !== 1 ? 's' : ''} in watchlist
                        </Typography>
                        <Stack spacing={2}>
                            {watchlist.map((entry) => (
                                <WatchlistCard
                                    key={entry.id} entry={entry}
                                    onRemove={handleRemove}
                                    onToggleNotifications={handleToggleNotifications}
                                    onView={(id) => navigate(`/client/socialTrading/masterTrader/${id}`)}
                                />
                            ))}
                        </Stack>
                    </>
                )}
            </Container>
        </Box>
    );
}
