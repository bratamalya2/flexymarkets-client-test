import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container, Typography, Box, Grid, Card, CardContent, Button, Stack,
    Chip, CircularProgress, Alert, Avatar, Divider, Tab, Tabs,
    Dialog, DialogTitle, DialogContent, DialogActions, FormControl,
    InputLabel, Select, MenuItem, Rating, TextField, IconButton, Tooltip, Paper
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import BarChartIcon from '@mui/icons-material/BarChart';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartTooltip,
    ResponsiveContainer, Legend, Area, AreaChart
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

function StatCard({ icon, label, value, color, subtext }) {
    return (
        <Card variant="outlined" sx={{ borderRadius: 3, textAlign: 'center', py: 2, px: 1.5, height: '100%' }}>
            <Box sx={{ color: color || 'primary.main', mb: 0.5 }}>{icon}</Box>
            <Typography variant="h6" fontWeight={800} color={color || 'text.primary'} lineHeight={1.1}>{value ?? '—'}</Typography>
            <Typography variant="caption" color="text.secondary" display="block" mt={0.25}>{label}</Typography>
            {subtext && <Typography variant="caption" color={color || 'text.secondary'} display="block">{subtext}</Typography>}
        </Card>
    );
}

function SubscribeDialog({ open, onClose, onConfirm, mt5Accounts, loading }) {
    const [selectedMt5, setSelectedMt5] = useState('');
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
            <DialogTitle sx={{ fontWeight: 700 }}>Start Copy Trading</DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="text.secondary" mb={2}>
                    Select the MT5 account you want to use for copy trading.
                </Typography>
                <FormControl fullWidth size="small">
                    <InputLabel>MT5 Account</InputLabel>
                    <Select value={selectedMt5} label="MT5 Account" onChange={(e) => setSelectedMt5(e.target.value)}>
                        {mt5Accounts.map((acc) => (
                            <MenuItem key={acc.Login} value={acc.Login}>
                                {acc.Login} — Balance: {acc.Balance ?? 'N/A'}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2.5 }}>
                <Button onClick={onClose} disabled={loading} sx={{ textTransform: 'none' }}>Cancel</Button>
                <Button
                    variant="contained" onClick={() => selectedMt5 && onConfirm(selectedMt5)}
                    disabled={!selectedMt5 || loading}
                    sx={{ textTransform: 'none', boxShadow: 'none', borderRadius: 2 }}
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
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
            <DialogTitle sx={{ fontWeight: 700 }}>Write a Review</DialogTitle>
            <DialogContent>
                <Stack spacing={2} mt={1}>
                    <Box>
                        <Typography variant="body2" mb={0.5}>Your Rating</Typography>
                        <Rating value={rating} onChange={(_, v) => setRating(v)} precision={1} size="large" />
                    </Box>
                    <TextField label="Comment (optional)" multiline rows={3} value={comment} onChange={(e) => setComment(e.target.value)} size="small" fullWidth />
                </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2.5 }}>
                <Button onClick={onClose} disabled={loading} sx={{ textTransform: 'none' }}>Cancel</Button>
                <Button variant="contained" onClick={() => onSubmit({ rating, comment })} disabled={loading}
                    sx={{ textTransform: 'none', boxShadow: 'none', borderRadius: 2 }}>
                    {loading ? <CircularProgress size={18} /> : 'Submit'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

function TradesTab({ masterTraderId }) {
    const [page] = useState(1);
    const { data, isLoading, isError } = useGetMasterTraderTradeListQuery({ masterTraderId, page, sizePerPage: 20 });
    const trades = data?.data?.trades || [];

    if (isLoading) return <Box py={4} textAlign="center"><CircularProgress /></Box>;
    if (isError) return <Alert severity="error">Failed to load trades.</Alert>;
    if (trades.length === 0) return (
        <Box textAlign="center" py={5}>
            <SwapVertIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography color="text.secondary">No recent trades.</Typography>
        </Box>
    );

    return (
        <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                    <tr style={{ background: '#f8f9fa' }}>
                        {['Ticket', 'Symbol', 'Type', 'Volume', 'Price', 'Profit', 'Time'].map((h) => (
                            <th key={h} style={{ textAlign: 'left', padding: '10px 14px', color: '#666', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {trades.map((t, i) => (
                        <tr key={t.ticket || i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                            <td style={{ padding: '9px 14px', color: '#888' }}>{t.ticket}</td>
                            <td style={{ padding: '9px 14px', fontWeight: 600 }}>{t.symbol}</td>
                            <td style={{ padding: '9px 14px' }}>
                                <Chip label={t.type === 0 ? 'Buy' : 'Sell'} size="small"
                                    sx={{ bgcolor: t.type === 0 ? 'rgba(76,175,80,0.12)' : 'rgba(244,67,54,0.12)', color: t.type === 0 ? '#2e7d32' : '#c62828', fontWeight: 600, fontSize: '0.72rem' }} />
                            </td>
                            <td style={{ padding: '9px 14px' }}>{t.volume}</td>
                            <td style={{ padding: '9px 14px' }}>{t.price}</td>
                            <td style={{ padding: '9px 14px', color: parseFloat(t.profit) >= 0 ? '#4caf50' : '#f44336', fontWeight: 700 }}>
                                {parseFloat(t.profit || 0) >= 0 ? '+' : ''}{parseFloat(t.profit || 0).toFixed(2)}
                            </td>
                            <td style={{ padding: '9px 14px', color: '#aaa', fontSize: 12 }}>
                                {t.time ? new Date(t.time * 1000).toLocaleDateString() : '—'}
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
    if (reviews.length === 0) return (
        <Box textAlign="center" py={5}>
            <Rating value={0} readOnly size="large" sx={{ color: 'text.disabled', mb: 1 }} />
            <Typography color="text.secondary">No reviews yet. Be the first!</Typography>
        </Box>
    );

    return (
        <Stack spacing={2}>
            {reviews.map((r) => (
                <Paper key={r.id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar sx={{ width: 32, height: 32, fontSize: 14, bgcolor: 'primary.main' }}>
                                {(r.user?.name || r.user?.userName || 'U')[0].toUpperCase()}
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle2" fontWeight={600}>{r.user?.name || r.user?.userName}</Typography>
                                <Rating value={parseFloat(r.rating)} readOnly size="small" precision={0.5} />
                            </Box>
                        </Stack>
                        <Typography variant="caption" color="text.disabled">{new Date(r.createdAt).toLocaleDateString()}</Typography>
                    </Stack>
                    {r.comment && <Typography variant="body2" color="text.secondary" mt={1}>{r.comment}</Typography>}
                </Paper>
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
        { masterTraderId, chartTimeframe }, { skip: !masterTraderId }
    );
    const { data: mt5Data } = useMt5AccountListQuery({ page: 1, sizePerPage: 50 });
    const mt5Accounts = mt5Data?.data?.mt5AccountList || [];

    const [subscribe, { isLoading: subscribing }] = useSubscribeMasterTraderMutation();
    const [unsubscribe, { isLoading: unsubscribing }] = useUnsubscribeMasterTraderMutation();
    const [pauseSub, { isLoading: pausing }] = usePauseSubscriptionMutation();
    const [resumeSub, { isLoading: resuming }] = useResumeSubscriptionMutation();
    const [watch, { isLoading: watching }] = useWatchMasterTraderMutation();
    const [unwatch, { isLoading: unwatching }] = useUnwatchMasterTraderMutation();
    const [submitReview, { isLoading: reviewLoading }] = useSubmitReviewMutation();

    const detail = data?.data;
    const trader = detail?.masterTrader;
    const stats = detail?.latestStats;
    const pnlChart = detail?.pnlPerformanceChart || [];
    const isWatching = detail?.isWatching;
    const userSub = detail?.userSubscription;

    const notify = (message, severity = 'success') => dispatch(setNotification({ open: true, message, severity }));

    const handleSubscribe = async (mt5Login) => {
        try { await subscribe({ masterTraderId, mt5Login }).unwrap(); notify('Successfully subscribed! Copy trading is now active.'); setSubscribeOpen(false); refetch(); }
        catch (e) { notify(e?.data?.message || 'Failed to subscribe.', 'error'); }
    };
    const handleUnsubscribe = async () => {
        if (!userSub?.id) return;
        try { await unsubscribe({ subscriptionId: userSub.id }).unwrap(); notify('Unsubscribed successfully.'); refetch(); }
        catch (e) { notify(e?.data?.message || 'Failed to unsubscribe.', 'error'); }
    };
    const handlePause = async () => {
        if (!userSub?.id) return;
        try { await pauseSub({ subscriptionId: userSub.id }).unwrap(); notify('Subscription paused.'); refetch(); }
        catch (e) { notify(e?.data?.message || 'Failed to pause.', 'error'); }
    };
    const handleResume = async () => {
        if (!userSub?.id) return;
        try { await resumeSub({ subscriptionId: userSub.id }).unwrap(); notify('Subscription resumed.'); refetch(); }
        catch (e) { notify(e?.data?.message || 'Failed to resume.', 'error'); }
    };
    const handleWatch = async () => {
        try { await watch({ masterTraderId }).unwrap(); notify('Added to watchlist.'); refetch(); }
        catch (e) { notify(e?.data?.message || 'Failed to add.', 'error'); }
    };
    const handleUnwatch = async () => {
        try { await unwatch({ masterTraderId }).unwrap(); notify('Removed from watchlist.'); refetch(); }
        catch (e) { notify(e?.data?.message || 'Failed to remove.', 'error'); }
    };
    const handleReviewSubmit = async ({ rating, comment }) => {
        try { await submitReview({ masterTraderId, rating, comment }).unwrap(); notify('Review submitted!'); setReviewOpen(false); refetch(); }
        catch (e) { notify(e?.data?.message || 'Failed to submit.', 'error'); }
    };

    if (isLoading) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress />
        </Box>
    );

    if (isError || !trader) return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            <Alert severity="error">{error?.data?.message || 'Master Trader not found.'}</Alert>
        </Container>
    );

    const roi = stats?.totalPnLPercentage;
    const winRate = stats?.winRate;
    const drawdown = stats?.maxDrawdownPercent;
    const copiers = stats?.activeCopiers;
    const totalTrades = stats?.totalTrades;
    const monthlyPnL = stats?.monthlyPnL;
    const grad = traderGradient(trader.id);

    return (
        <Box>
            {/* ── Cover Hero ── */}
            <Box sx={{ background: grad, height: { xs: 130, sm: 170 }, position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', top: -30, right: -30, width: 220, height: 220, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.1)' }} />
                <Box sx={{ position: 'absolute', bottom: -50, left: -20, width: 180, height: 180, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.07)' }} />
                <Box sx={{ position: 'absolute', top: 12, left: 16 }}>
                    <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/client/socialTrading/discover')}
                        sx={{ color: 'white', textTransform: 'none', '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' } }}>
                        Back
                    </Button>
                </Box>
            </Box>

            <Container maxWidth="lg">
                {/* ── Profile card ── */}
                <Card variant="outlined" sx={{ borderRadius: 3, mb: 3, mt: '-1px', overflow: 'visible' }}>
                    <CardContent sx={{ pt: 0 }}>
                        {/* Avatar overlapping cover */}
                        <Box sx={{ mt: -5, mb: 1.5, display: 'flex', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                            <Avatar sx={{ width: 80, height: 80, fontSize: 30, fontWeight: 800, background: grad, border: '3px solid white', boxShadow: 3 }}>
                                {(trader.displayName || 'T')[0].toUpperCase()}
                            </Avatar>
                        </Box>

                        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'flex-start' }} justifyContent="space-between" spacing={2}>
                            <Box>
                                <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" mb={0.5}>
                                    <Typography variant="h5" fontWeight={800}>{trader.displayName}</Typography>
                                    <Chip label={trader.riskLevel} color={riskColor(trader.riskLevel)} size="small" variant="outlined" />
                                    <Chip label={trader.status} color={trader.status === 'ACTIVE' ? 'success' : 'default'} size="small" />
                                </Stack>
                                <Typography variant="body2" color="text.secondary">
                                    {trader.user?.name || trader.user?.userName}
                                    {trader.user?.country ? ` · ${trader.user.country}` : ''}
                                </Typography>
                                {trader.description && (
                                    <Typography variant="body2" mt={0.5} color="text.secondary" sx={{ maxWidth: 480 }}>
                                        {trader.description}
                                    </Typography>
                                )}
                                {(trader.tradingStyle || trader.avgTradeDuration || (trader.instruments || []).length > 0) && (
                                    <Stack direction="row" spacing={0.5} mt={1} flexWrap="wrap" useFlexGap>
                                        {trader.tradingStyle && <Chip label={`📈 ${trader.tradingStyle.charAt(0) + trader.tradingStyle.slice(1).toLowerCase()}`} size="small" color="primary" variant="outlined" />}
                                        {trader.avgTradeDuration && <Chip label={`⏱ ${trader.avgTradeDuration.charAt(0) + trader.avgTradeDuration.slice(1).toLowerCase()}`} size="small" variant="outlined" />}
                                        {(trader.instruments || []).map((inst) => (
                                            <Chip key={inst} label={inst.charAt(0) + inst.slice(1).toLowerCase()} size="small" variant="outlined" color="secondary" />
                                        ))}
                                    </Stack>
                                )}
                            </Box>

                            {/* Action buttons */}
                            <Stack direction="row" spacing={1} flexShrink={0} flexWrap="wrap" alignItems="center">
                                <Tooltip title={isWatching ? 'Remove from watchlist' : 'Add to watchlist'}>
                                    <IconButton onClick={isWatching ? handleUnwatch : handleWatch} disabled={watching || unwatching}
                                        sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                                        {isWatching ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
                                    </IconButton>
                                </Tooltip>

                                {!userSub && (
                                    <Button variant="contained" onClick={() => setSubscribeOpen(true)}
                                        sx={{ textTransform: 'none', boxShadow: 'none', borderRadius: 2, background: grad, '&:hover': { boxShadow: 'none', opacity: 0.9 } }}>
                                        Copy Trade
                                    </Button>
                                )}
                                {userSub?.status === 'ACTIVE' && (
                                    <>
                                        <Button variant="outlined" color="warning" onClick={handlePause} disabled={pausing} sx={{ textTransform: 'none', borderRadius: 2 }}>
                                            {pausing ? <CircularProgress size={16} /> : 'Pause'}
                                        </Button>
                                        <Button variant="outlined" color="error" onClick={handleUnsubscribe} disabled={unsubscribing} sx={{ textTransform: 'none', borderRadius: 2 }}>
                                            {unsubscribing ? <CircularProgress size={16} /> : 'Stop Copying'}
                                        </Button>
                                    </>
                                )}
                                {userSub?.status === 'PAUSED' && (
                                    <>
                                        <Button variant="contained" color="success" onClick={handleResume} disabled={resuming}
                                            sx={{ textTransform: 'none', boxShadow: 'none', borderRadius: 2 }}>
                                            {resuming ? <CircularProgress size={16} /> : 'Resume'}
                                        </Button>
                                        <Button variant="outlined" color="error" onClick={handleUnsubscribe} disabled={unsubscribing} sx={{ textTransform: 'none', borderRadius: 2 }}>
                                            Stop
                                        </Button>
                                    </>
                                )}
                            </Stack>
                        </Stack>

                        {userSub && (
                            <Alert severity={userSub.status === 'ACTIVE' ? 'success' : userSub.status === 'PAUSED' ? 'warning' : 'info'} sx={{ mt: 2, borderRadius: 2 }}>
                                Copy trading is <strong>{userSub.status.toLowerCase()}</strong> on account {userSub.login}.
                            </Alert>
                        )}
                    </CardContent>
                </Card>

                {/* ── Stats ── */}
                <Grid container spacing={2} mb={3}>
                    {[
                        { icon: <TrendingUpIcon />, label: 'Total ROI', value: roi !== null && roi !== undefined ? `${roi >= 0 ? '+' : ''}${parseFloat(roi).toFixed(2)}%` : '—', color: roi !== undefined && roi !== null ? (roi >= 0 ? 'success.main' : 'error.main') : undefined },
                        { icon: <ShowChartIcon />, label: 'Win Rate', value: winRate !== null && winRate !== undefined ? `${parseFloat(winRate).toFixed(1)}%` : '—' },
                        { icon: <BarChartIcon />, label: 'Max Drawdown', value: drawdown !== null && drawdown !== undefined ? `${parseFloat(drawdown).toFixed(1)}%` : '—', color: 'error.main' },
                        { icon: <PeopleOutlineIcon />, label: 'Copiers', value: copiers ?? '—' },
                        { icon: <SwapVertIcon />, label: 'Total Trades', value: totalTrades ?? '—' },
                        { icon: <AccountBalanceWalletOutlinedIcon />, label: 'Monthly PnL', value: monthlyPnL !== null && monthlyPnL !== undefined ? `$${parseFloat(monthlyPnL).toFixed(2)}` : '—', color: monthlyPnL >= 0 ? 'success.main' : 'error.main' },
                    ].map((s) => (
                        <Grid item xs={6} sm={4} md={2} key={s.label}>
                            <StatCard {...s} />
                        </Grid>
                    ))}
                </Grid>

                {/* ── PnL Chart ── */}
                {pnlChart.length > 0 && (
                    <Card variant="outlined" sx={{ borderRadius: 3, mb: 3 }}>
                        <CardContent>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="subtitle1" fontWeight={700}>PnL Performance</Typography>
                                <Stack direction="row" spacing={0.5}>
                                    {['7D', '30D', '90D'].map((tf) => (
                                        <Button key={tf} size="small" variant={chartTimeframe === tf ? 'contained' : 'outlined'}
                                            onClick={() => setChartTimeframe(tf)}
                                            sx={{ textTransform: 'none', boxShadow: 'none', minWidth: 46, px: 1, borderRadius: 2, ...(chartTimeframe === tf ? { background: grad } : {}) }}>
                                            {tf}
                                        </Button>
                                    ))}
                                </Stack>
                            </Stack>
                            <ResponsiveContainer width="100%" height={220}>
                                <AreaChart data={pnlChart}>
                                    <defs>
                                        <linearGradient id="pnlGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#1976d2" stopOpacity={0.18} />
                                            <stop offset="95%" stopColor="#1976d2" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="date" tickFormatter={(d) => d ? new Date(d).toLocaleDateString('en', { month: 'short', day: 'numeric' }) : ''} tick={{ fontSize: 11 }} />
                                    <YAxis tick={{ fontSize: 11 }} />
                                    <RechartTooltip formatter={(v) => [`$${parseFloat(v).toFixed(2)}`]} contentStyle={{ borderRadius: 8 }} />
                                    <Legend wrapperStyle={{ fontSize: 12 }} />
                                    <Area type="monotone" dataKey="totalPnL" stroke="#1976d2" fill="url(#pnlGrad)" strokeWidth={2} dot={false} name="Total PnL" />
                                    <Line type="monotone" dataKey="weeklyPnL" stroke="#4caf50" strokeWidth={1.5} dot={false} name="Weekly PnL" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                )}

                {/* ── Tabs ── */}
                <Card variant="outlined" sx={{ borderRadius: 3, mb: 4 }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
                            <Tab label="Trade History" sx={{ textTransform: 'none', fontWeight: 600 }} />
                            <Tab label={`Reviews (${detail?.reviewsCount || 0})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
                        </Tabs>
                    </Box>
                    <CardContent>
                        {tab === 0 && <TradesTab masterTraderId={masterTraderId} />}
                        {tab === 1 && (
                            <>
                                <Box mb={2} display="flex" justifyContent="flex-end">
                                    <Button variant="outlined" size="small" onClick={() => setReviewOpen(true)} sx={{ textTransform: 'none', borderRadius: 2 }}>
                                        Write a Review
                                    </Button>
                                </Box>
                                <ReviewsTab masterTraderId={masterTraderId} />
                            </>
                        )}
                    </CardContent>
                </Card>
            </Container>

            <SubscribeDialog open={subscribeOpen} onClose={() => setSubscribeOpen(false)} onConfirm={handleSubscribe} mt5Accounts={mt5Accounts} loading={subscribing} />
            <ReviewDialog open={reviewOpen} onClose={() => setReviewOpen(false)} onSubmit={handleReviewSubmit} loading={reviewLoading} />
        </Box>
    );
}
