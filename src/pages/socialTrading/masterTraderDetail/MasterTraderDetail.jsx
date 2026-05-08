import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container, Typography, Box, Grid, Card, CardContent, Button, Stack,
    Chip, CircularProgress, Alert, Avatar, Divider, Tab, Tabs,
    Dialog, DialogTitle, DialogContent, DialogActions, FormControl,
    InputLabel, Select, MenuItem, Rating, TextField, IconButton, Tooltip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartTooltip,
    ResponsiveContainer, Legend
} from 'recharts';
import {
    useGetMasterTraderDetailQuery,
    useGetMasterTraderTradeListQuery,
    useGetMasterTraderReviewsQuery,
    useSubscribeMasterTraderMutation,
    useUnsubscribeMasterTraderMutation,
    usePauseSubscriptionMutation,
    useResumeSubscriptionMutation,
    useWatchMasterTraderMutation,
    useUnwatchMasterTraderMutation,
    useToggleWatchlistNotificationsMutation,
    useSubmitReviewMutation,
} from '../../../globalState/socialTradingState/socialTradingApis';
import { useMt5AccountListQuery } from '../../../globalState/mt5State/mt5StateApis';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../../globalState/notificationState/notificationStateSlice';

const riskColor = (level) => {
    if (level === 'LOW') return 'success';
    if (level === 'HIGH') return 'error';
    return 'warning';
};

function StatCard({ label, value, color }) {
    return (
        <Card variant="outlined" sx={{ textAlign: 'center', py: 1.5, px: 2 }}>
            <Typography variant="caption" color="text.secondary">{label}</Typography>
            <Typography variant="h6" fontWeight={700} color={color || 'text.primary'} mt={0.5}>
                {value ?? '-'}
            </Typography>
        </Card>
    );
}

function SubscribeDialog({ open, onClose, onConfirm, mt5Accounts, loading }) {
    const [selectedMt5, setSelectedMt5] = useState('');

    const handleConfirm = () => {
        if (!selectedMt5) return;
        onConfirm(selectedMt5);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Start Copy Trading</DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="text.secondary" mb={2}>
                    Select the MT5 account you want to use for copy trading.
                </Typography>
                <FormControl fullWidth size="small">
                    <InputLabel>MT5 Account</InputLabel>
                    <Select
                        value={selectedMt5}
                        label="MT5 Account"
                        onChange={(e) => setSelectedMt5(e.target.value)}
                    >
                        {mt5Accounts.map((acc) => (
                            <MenuItem key={acc.Login} value={acc.Login}>
                                {acc.Login} — Balance: {acc.Balance ?? 'N/A'}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>Cancel</Button>
                <Button
                    variant="contained"
                    onClick={handleConfirm}
                    disabled={!selectedMt5 || loading}
                    sx={{ textTransform: 'none', boxShadow: 'none' }}
                >
                    {loading ? <CircularProgress size={18} /> : 'Subscribe'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

function ReviewDialog({ open, onClose, onSubmit, loading }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const handleSubmit = () => {
        onSubmit({ rating, comment });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogContent>
                <Stack spacing={2} mt={1}>
                    <Box>
                        <Typography variant="body2" mb={0.5}>Rating</Typography>
                        <Rating
                            value={rating}
                            onChange={(_, v) => setRating(v)}
                            precision={1}
                        />
                    </Box>
                    <TextField
                        label="Comment (optional)"
                        multiline
                        rows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        size="small"
                        fullWidth
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>Cancel</Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    sx={{ textTransform: 'none', boxShadow: 'none' }}
                >
                    {loading ? <CircularProgress size={18} /> : 'Submit'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

function TradesTab({ masterTraderId }) {
    const [page, setPage] = useState(1);
    const { data, isLoading, isError } = useGetMasterTraderTradeListQuery({ masterTraderId, page, sizePerPage: 20 });
    const trades = data?.data?.trades || [];

    if (isLoading) return <Box py={4} textAlign="center"><CircularProgress /></Box>;
    if (isError) return <Alert severity="error">Failed to load trades.</Alert>;
    if (trades.length === 0) return <Alert severity="info">No recent trades.</Alert>;

    return (
        <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                    <tr>
                        {['Ticket', 'Symbol', 'Type', 'Volume', 'Price', 'Profit', 'Time'].map((h) => (
                            <th key={h} style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid #eee', color: '#666', fontWeight: 600 }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {trades.map((t, i) => (
                        <tr key={t.ticket || i} style={{ borderBottom: '1px solid #f5f5f5' }}>
                            <td style={{ padding: '8px 12px' }}>{t.ticket}</td>
                            <td style={{ padding: '8px 12px' }}>{t.symbol}</td>
                            <td style={{ padding: '8px 12px' }}>{t.type === 0 ? 'Buy' : 'Sell'}</td>
                            <td style={{ padding: '8px 12px' }}>{t.volume}</td>
                            <td style={{ padding: '8px 12px' }}>{t.price}</td>
                            <td style={{ padding: '8px 12px', color: parseFloat(t.profit) >= 0 ? '#4caf50' : '#f44336', fontWeight: 600 }}>
                                {parseFloat(t.profit || 0).toFixed(2)}
                            </td>
                            <td style={{ padding: '8px 12px', color: '#888' }}>
                                {t.time ? new Date(t.time * 1000).toLocaleDateString() : '-'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Box>
    );
}

function ReviewsTab({ masterTraderId }) {
    const { data, isLoading } = useGetMasterTraderReviewsQuery({ masterTraderId });
    const reviews = data?.data?.reviews || [];

    if (isLoading) return <Box py={4} textAlign="center"><CircularProgress /></Box>;
    if (reviews.length === 0) return <Alert severity="info">No reviews yet.</Alert>;

    return (
        <Stack spacing={2}>
            {reviews.map((r) => (
                <Card variant="outlined" key={r.id}>
                    <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                            <Box>
                                <Typography variant="subtitle2">{r.user?.name || r.user?.userName}</Typography>
                                <Rating value={parseFloat(r.rating)} readOnly size="small" precision={0.5} />
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                                {new Date(r.createdAt).toLocaleDateString()}
                            </Typography>
                        </Stack>
                        {r.comment && (
                            <Typography variant="body2" color="text.secondary" mt={0.5}>
                                {r.comment}
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            ))}
        </Stack>
    );
}

export default function MasterTraderDetail() {
    const { masterTraderId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [tab, setTab] = useState(0);
    const [chartTimeframe, setChartTimeframe] = useState('30D');
    const [subscribeOpen, setSubscribeOpen] = useState(false);
    const [reviewOpen, setReviewOpen] = useState(false);

    const { data, isLoading, isError, error, refetch } = useGetMasterTraderDetailQuery(
        { masterTraderId, chartTimeframe },
        { skip: !masterTraderId }
    );

    const { data: mt5Data } = useMt5AccountListQuery({ page: 1, sizePerPage: 50 });
    const mt5Accounts = mt5Data?.data?.mt5AccountList || [];

    const [subscribe, { isLoading: subscribing }] = useSubscribeMasterTraderMutation();
    const [unsubscribe, { isLoading: unsubscribing }] = useUnsubscribeMasterTraderMutation();
    const [pauseSub, { isLoading: pausing }] = usePauseSubscriptionMutation();
    const [resumeSub, { isLoading: resuming }] = useResumeSubscriptionMutation();
    const [watch, { isLoading: watching }] = useWatchMasterTraderMutation();
    const [unwatch, { isLoading: unwatching }] = useUnwatchMasterTraderMutation();
    const [toggleNotifications] = useToggleWatchlistNotificationsMutation();
    const [submitReview, { isLoading: reviewLoading }] = useSubmitReviewMutation();

    const detail = data?.data;
    const trader = detail?.masterTrader;
    const stats = detail?.latestStats;
    const pnlChart = detail?.pnlPerformanceChart || [];
    const equityCurve = detail?.equityCurve || [];
    const isWatching = detail?.isWatching;
    const userSub = detail?.userSubscription;

    const notify = (message, severity = 'success') =>
        dispatch(setNotification({ open: true, message, severity }));

    const handleSubscribe = async (mt5Login) => {
        try {
            await subscribe({ masterTraderId, mt5Login }).unwrap();
            notify('Successfully subscribed! Copy trading is now active.');
            setSubscribeOpen(false);
            refetch();
        } catch (e) {
            notify(e?.data?.message || 'Failed to subscribe.', 'error');
        }
    };

    const handleUnsubscribe = async () => {
        if (!userSub?.id) return;
        try {
            await unsubscribe({ subscriptionId: userSub.id }).unwrap();
            notify('Unsubscribed successfully.');
            refetch();
        } catch (e) {
            notify(e?.data?.message || 'Failed to unsubscribe.', 'error');
        }
    };

    const handlePause = async () => {
        if (!userSub?.id) return;
        try {
            await pauseSub({ subscriptionId: userSub.id }).unwrap();
            notify('Subscription paused.');
            refetch();
        } catch (e) {
            notify(e?.data?.message || 'Failed to pause.', 'error');
        }
    };

    const handleResume = async () => {
        if (!userSub?.id) return;
        try {
            await resumeSub({ subscriptionId: userSub.id }).unwrap();
            notify('Subscription resumed.');
            refetch();
        } catch (e) {
            notify(e?.data?.message || 'Failed to resume.', 'error');
        }
    };

    const handleWatch = async () => {
        try {
            await watch({ masterTraderId }).unwrap();
            notify('Added to watchlist.');
            refetch();
        } catch (e) {
            notify(e?.data?.message || 'Failed to add to watchlist.', 'error');
        }
    };

    const handleUnwatch = async () => {
        try {
            await unwatch({ masterTraderId }).unwrap();
            notify('Removed from watchlist.');
            refetch();
        } catch (e) {
            notify(e?.data?.message || 'Failed to remove from watchlist.', 'error');
        }
    };

    const handleReviewSubmit = async ({ rating, comment }) => {
        try {
            await submitReview({ masterTraderId, rating, comment }).unwrap();
            notify('Review submitted successfully.');
            setReviewOpen(false);
            refetch();
        } catch (e) {
            notify(e?.data?.message || 'Failed to submit review.', 'error');
        }
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (isError || !trader) {
        return (
            <Container maxWidth="lg" sx={{ py: 3 }}>
                <Alert severity="error">{error?.data?.message || 'Master Trader not found.'}</Alert>
            </Container>
        );
    }

    const roi = stats?.totalPnLPercentage;
    const winRate = stats?.winRate;
    const drawdown = stats?.maxDrawdownPercent;
    const copiers = stats?.activeCopiers;
    const totalTrades = stats?.totalTrades;
    const monthlyPnL = stats?.monthlyPnL;

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            {/* Back button */}
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/client/socialTrading/discover')}
                sx={{ textTransform: 'none', mb: 2, color: 'text.secondary' }}
            >
                Back to Discovery
            </Button>

            {/* Header */}
            <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, fontSize: 22 }}>
                            {(trader.displayName || 'T')[0].toUpperCase()}
                        </Avatar>
                        <Box flex={1}>
                            <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                                <Typography variant="h6" fontWeight={700}>{trader.displayName}</Typography>
                                <Chip label={trader.riskLevel} color={riskColor(trader.riskLevel)} size="small" variant="outlined" />
                                <Chip label={trader.status} color={trader.status === 'ACTIVE' ? 'success' : 'default'} size="small" />
                            </Stack>
                            <Typography variant="body2" color="text.secondary">
                                by {trader.user?.name || trader.user?.userName}
                                {trader.user?.country ? ` • ${trader.user.country}` : ''}
                            </Typography>
                            {trader.description && (
                                <Typography variant="body2" mt={0.5}>{trader.description}</Typography>
                            )}
                        </Box>

                        {/* Action buttons */}
                        <Stack direction="row" spacing={1} flexShrink={0} flexWrap="wrap">
                            <Tooltip title={isWatching ? 'Remove from watchlist' : 'Add to watchlist'}>
                                <IconButton
                                    onClick={isWatching ? handleUnwatch : handleWatch}
                                    disabled={watching || unwatching}
                                    color={isWatching ? 'primary' : 'default'}
                                >
                                    {isWatching ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                                </IconButton>
                            </Tooltip>

                            {!userSub && (
                                <Button
                                    variant="contained"
                                    onClick={() => setSubscribeOpen(true)}
                                    sx={{ textTransform: 'none', boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
                                >
                                    Copy Trade
                                </Button>
                            )}

                            {userSub?.status === 'ACTIVE' && (
                                <>
                                    <Button
                                        variant="outlined"
                                        color="warning"
                                        onClick={handlePause}
                                        disabled={pausing}
                                        sx={{ textTransform: 'none' }}
                                    >
                                        {pausing ? <CircularProgress size={18} /> : 'Pause'}
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={handleUnsubscribe}
                                        disabled={unsubscribing}
                                        sx={{ textTransform: 'none' }}
                                    >
                                        {unsubscribing ? <CircularProgress size={18} /> : 'Stop Copying'}
                                    </Button>
                                </>
                            )}

                            {userSub?.status === 'PAUSED' && (
                                <>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={handleResume}
                                        disabled={resuming}
                                        sx={{ textTransform: 'none', boxShadow: 'none' }}
                                    >
                                        {resuming ? <CircularProgress size={18} /> : 'Resume'}
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={handleUnsubscribe}
                                        disabled={unsubscribing}
                                        sx={{ textTransform: 'none' }}
                                    >
                                        Stop
                                    </Button>
                                </>
                            )}
                        </Stack>
                    </Stack>

                    {userSub && (
                        <Alert
                            severity={userSub.status === 'ACTIVE' ? 'success' : userSub.status === 'PAUSED' ? 'warning' : 'info'}
                            sx={{ mt: 2 }}
                        >
                            Copy trading is <strong>{userSub.status.toLowerCase()}</strong> on account {userSub.login}.
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {/* Stats row */}
            <Grid container spacing={2} mb={3}>
                <Grid item xs={6} sm={4} md={2}>
                    <StatCard
                        label="ROI"
                        value={roi !== null && roi !== undefined ? `${roi >= 0 ? '+' : ''}${parseFloat(roi).toFixed(2)}%` : '-'}
                        color={roi !== undefined && roi !== null ? (roi >= 0 ? 'success.main' : 'error.main') : undefined}
                    />
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                    <StatCard label="Win Rate" value={winRate !== null && winRate !== undefined ? `${parseFloat(winRate).toFixed(1)}%` : '-'} />
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                    <StatCard
                        label="Max Drawdown"
                        value={drawdown !== null && drawdown !== undefined ? `${parseFloat(drawdown).toFixed(1)}%` : '-'}
                        color="error.main"
                    />
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                    <StatCard label="Copiers" value={copiers ?? '-'} />
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                    <StatCard label="Total Trades" value={totalTrades ?? '-'} />
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                    <StatCard
                        label="Monthly PnL"
                        value={monthlyPnL !== null && monthlyPnL !== undefined ? `$${parseFloat(monthlyPnL).toFixed(2)}` : '-'}
                        color={monthlyPnL >= 0 ? 'success.main' : 'error.main'}
                    />
                </Grid>
            </Grid>

            {/* PnL Chart */}
            {pnlChart.length > 0 && (
                <Card variant="outlined" sx={{ mb: 3 }}>
                    <CardContent>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="subtitle1" fontWeight={600}>PnL Performance</Typography>
                            <Stack direction="row" spacing={1}>
                                {['7D', '30D', '90D'].map((tf) => (
                                    <Button
                                        key={tf}
                                        size="small"
                                        variant={chartTimeframe === tf ? 'contained' : 'outlined'}
                                        onClick={() => setChartTimeframe(tf)}
                                        sx={{ textTransform: 'none', boxShadow: 'none', minWidth: 48, px: 1 }}
                                    >
                                        {tf}
                                    </Button>
                                ))}
                            </Stack>
                        </Stack>
                        <ResponsiveContainer width="100%" height={220}>
                            <LineChart data={pnlChart}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(d) => d ? new Date(d).toLocaleDateString('en', { month: 'short', day: 'numeric' }) : ''}
                                    tick={{ fontSize: 11 }}
                                />
                                <YAxis tick={{ fontSize: 11 }} />
                                <RechartTooltip formatter={(v) => [`$${parseFloat(v).toFixed(2)}`]} />
                                <Legend wrapperStyle={{ fontSize: 12 }} />
                                <Line type="monotone" dataKey="totalPnL" stroke="#1976d2" dot={false} name="Total PnL" strokeWidth={2} />
                                <Line type="monotone" dataKey="weeklyPnL" stroke="#4caf50" dot={false} name="Weekly PnL" strokeWidth={1.5} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            )}

            {/* Tabs: Trades / Reviews */}
            <Card variant="outlined">
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tab} onChange={(_, v) => setTab(v)}>
                        <Tab label="Trade History" />
                        <Tab label={`Reviews (${detail?.reviewsCount || 0})`} />
                    </Tabs>
                </Box>
                <CardContent>
                    {tab === 0 && <TradesTab masterTraderId={masterTraderId} />}
                    {tab === 1 && (
                        <>
                            <Box mb={2} display="flex" justifyContent="flex-end">
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => setReviewOpen(true)}
                                    sx={{ textTransform: 'none' }}
                                >
                                    Write a Review
                                </Button>
                            </Box>
                            <ReviewsTab masterTraderId={masterTraderId} />
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Subscribe dialog */}
            <SubscribeDialog
                open={subscribeOpen}
                onClose={() => setSubscribeOpen(false)}
                onConfirm={handleSubscribe}
                mt5Accounts={mt5Accounts}
                loading={subscribing}
            />

            {/* Review dialog */}
            <ReviewDialog
                open={reviewOpen}
                onClose={() => setReviewOpen(false)}
                onSubmit={handleReviewSubmit}
                loading={reviewLoading}
            />
        </Container>
    );
}
