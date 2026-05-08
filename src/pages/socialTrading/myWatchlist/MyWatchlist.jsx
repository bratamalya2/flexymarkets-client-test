import { useNavigate } from 'react-router-dom';
import {
    Container, Typography, Box, Card, CardContent, Button, Stack,
    Chip, CircularProgress, Alert, Avatar, IconButton, Tooltip, Switch,
    FormControlLabel
} from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsOffOutlinedIcon from '@mui/icons-material/NotificationsOffOutlined';
import {
    useGetMyWatchlistQuery,
    useUnwatchMasterTraderMutation,
    useToggleWatchlistNotificationsMutation,
    useSubscribeMasterTraderMutation,
} from '../../../globalState/socialTradingState/socialTradingApis';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../../globalState/notificationState/notificationStateSlice';

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
                                {trader?.displayName || 'Unknown'}
                            </Typography>
                            {trader?.riskLevel && (
                                <Chip label={trader.riskLevel} color={riskColor(trader.riskLevel)} size="small" variant="outlined" />
                            )}
                        </Stack>
                        <Stack direction="row" spacing={2} mt={0.5} flexWrap="wrap">
                            <Typography variant="caption" color="text.secondary">
                                ROI: <strong style={{ color: roi !== null && roi !== undefined ? (roi >= 0 ? '#4caf50' : '#f44336') : 'inherit' }}>
                                    {roi !== null && roi !== undefined ? `${roi >= 0 ? '+' : ''}${parseFloat(roi).toFixed(2)}%` : '-'}
                                </strong>
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Win Rate: <strong>{winRate !== null && winRate !== undefined ? `${parseFloat(winRate).toFixed(1)}%` : '-'}</strong>
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Copiers: <strong>{copiers ?? '-'}</strong>
                            </Typography>
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                            Watching since {new Date(entry.createdAt).toLocaleDateString()}
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={1} alignItems="center" flexShrink={0}>
                        <Tooltip title={entry.notificationsEnabled ? 'Disable notifications' : 'Enable notifications'}>
                            <IconButton
                                size="small"
                                color={entry.notificationsEnabled ? 'primary' : 'default'}
                                onClick={() => onToggleNotifications(trader?.id, !entry.notificationsEnabled)}
                            >
                                {entry.notificationsEnabled
                                    ? <NotificationsActiveIcon fontSize="small" />
                                    : <NotificationsOffOutlinedIcon fontSize="small" />}
                            </IconButton>
                        </Tooltip>

                        <Button
                            size="small"
                            variant="outlined"
                            startIcon={<OpenInNewIcon fontSize="small" />}
                            onClick={() => onView(trader?.id)}
                            sx={{ textTransform: 'none' }}
                        >
                            View
                        </Button>

                        <Tooltip title="Remove from watchlist">
                            <IconButton
                                size="small"
                                color="error"
                                onClick={() => onRemove(trader?.id)}
                            >
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

    const notify = (message, severity = 'success') =>
        dispatch(setNotification({ open: true, message, severity }));

    const handleRemove = async (masterTraderId) => {
        try {
            await unwatch({ masterTraderId }).unwrap();
            notify('Removed from watchlist.');
            refetch();
        } catch (e) {
            notify(e?.data?.message || 'Failed to remove.', 'error');
        }
    };

    const handleToggleNotifications = async (masterTraderId, notificationsEnabled) => {
        try {
            await toggleNotifications({ masterTraderId, notificationsEnabled }).unwrap();
            notify(`Notifications ${notificationsEnabled ? 'enabled' : 'disabled'}.`);
            refetch();
        } catch (e) {
            notify(e?.data?.message || 'Failed to update notifications.', 'error');
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <BookmarkIcon color="primary" />
                    <Typography variant="h5" fontWeight={600}>My Watchlist</Typography>
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

            {isLoading && (
                <Box display="flex" justifyContent="center" py={6}>
                    <CircularProgress />
                </Box>
            )}

            {isError && (
                <Alert severity="error">
                    {error?.data?.message || 'Failed to load watchlist.'}
                </Alert>
            )}

            {!isLoading && !isError && watchlist.length === 0 && (
                <Box textAlign="center" py={6}>
                    <Alert severity="info" sx={{ mb: 2 }}>
                        Your watchlist is empty. Start watching master traders to track their performance.
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

            {!isLoading && watchlist.length > 0 && (
                <>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                        {totalRecords} trader{totalRecords !== 1 ? 's' : ''} in watchlist
                    </Typography>
                    <Stack spacing={2}>
                        {watchlist.map((entry) => (
                            <WatchlistCard
                                key={entry.id}
                                entry={entry}
                                onRemove={handleRemove}
                                onToggleNotifications={handleToggleNotifications}
                                onView={(id) => navigate(`/client/socialTrading/masterTrader/${id}`)}
                            />
                        ))}
                    </Stack>
                </>
            )}
        </Container>
    );
}
