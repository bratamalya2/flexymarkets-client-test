import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container, Typography, Box, Card, CardContent, Button, Stack,
    Chip, CircularProgress, Alert, Avatar, Tab, Tabs,
    Dialog, DialogTitle, DialogContent, DialogActions, FormControl,
    InputLabel, Select, MenuItem, Rating, TextField, IconButton, Tooltip, Paper
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip as RechartTooltip, ResponsiveContainer
} from 'recharts';
import { TrendingUp, Users, Shield, Activity } from 'lucide-react';
import { Card as BCard, CardContent as BCardContent } from '../../../components/ui/card';
import { cn } from '../../../lib/utils';
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

/* ─── Bento sub-components ─── */

function WinRateCircle({ winRate }) {
    const wr = winRate ? Math.min(100, Math.max(0, parseFloat(winRate))) : 0;
    const circumference = 2 * Math.PI * 40;
    const filled = (wr / 100) * circumference;
    const color = wr >= 60 ? '#10b981' : wr >= 40 ? '#f59e0b' : '#ef4444';
    return (
        <div className="relative mx-auto flex size-32 items-center justify-center">
            <svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                <circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
                    style={{ strokeDasharray: `${filled} ${circumference}`, transition: 'stroke-dasharray 0.6s ease' }} />
            </svg>
            <span className="relative z-10 text-2xl font-black">
                {winRate !== null ? `${parseFloat(winRate).toFixed(0)}%` : '—'}
            </span>
        </div>
    );
}

function LargeSparkline({ data }) {
    if (!data || data.length < 2) {
        /* Decorative static chart when no data */
        return (
            <svg className="w-full text-gray-100" viewBox="0 0 386 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd"
                    d="M3 80C3 80 14 58 35 54C56 50 66 49 66 49C66 49 80 49 92 49C103 49 100 38 109 38C117 38 117 56 125 56C133 56 142 48 154 49C165 51 186 56 193 56C200 56 205 38 213 38C221 38 238 57 244 56C250 55 258 36 266 36C272 36 284 53 287 54C295 54 300 44 305 44C312 44 322 40 334 38C346 37 347 50 363 49C379 48 383 65 383 65V80H3Z"
                    fill="currentColor" />
                <path className="text-indigo-500"
                    d="M3 74C15 68 36 53 66 49C92 49 100 38 109 38C117 38 117 56 125 56C133 56 142 48 154 49C165 51 186 56 193 56C200 56 205 38 213 38C221 38 238 57 244 56C250 55 258 36 266 36C272 36 284 53 287 54C295 54 300 44 305 44C312 44 322 40 334 38C346 37 347 50 363 49C376 48 383 63 383 63"
                    stroke="currentColor" strokeWidth="2" />
            </svg>
        );
    }
    const values = data.map((d) => parseFloat(d.totalPnL || 0));
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const w = 386;
    const h = 80;
    const slice = values.slice(-24);
    const pts = slice.map((v, i) =>
        `${(i / (slice.length - 1)) * w},${h - ((v - min) / range) * (h - 6)}`
    );
    const linePath = `M ${pts.join(' L ')}`;
    const areaPath = `M 0,${h} L ${pts.join(' L ')} L ${w},${h} Z`;
    const positive = values[values.length - 1] >= values[0];
    const color = positive ? '#10b981' : '#ef4444';
    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full" fill="none">
            <path d={areaPath} fill={color} fillOpacity="0.12" />
            <path d={linePath} stroke={color} strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
    );
}

function TraderBentoStats({ stats, pnlChart, chartTimeframe, setChartTimeframe, trader }) {
    const roi          = stats?.totalPnLPercentage  ?? null;
    const winRate      = stats?.winRate             ?? null;
    const drawdown     = stats?.maxDrawdownPercent  ?? null;
    const copiers      = stats?.activeCopiers       ?? 0;
    const totalTrades  = stats?.totalTrades         ?? 0;
    const monthlyPnL   = stats?.monthlyPnL          ?? null;

    return (
        <div className="relative mb-4">
            <div className="relative z-10 grid grid-cols-6 gap-3">

                {/* ── Card 1: Total ROI ── */}
                <BCard className="relative col-span-full flex overflow-hidden lg:col-span-2">
                    <BCardContent className="relative m-auto size-fit pt-6 text-center w-full px-4">
                        <div className="relative flex h-24 items-center justify-center">
                            {/* Decorative oval wave */}
                            <svg className="text-gray-100 absolute inset-0 size-full" viewBox="0 0 254 104" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M112.891 97.7022C140.366 97.0802 171.004 94.6715 201.087 87.5116C210.43 85.2881 219.615 82.6412 228.284 78.2473C232.198 76.3179 235.905 73.9942 239.348 71.3124C241.85 69.2557 243.954 66.7571 245.555 63.9408C249.34 57.3235 248.281 50.5341 242.498 45.6109C239.033 42.7237 235.228 40.2703 231.169 38.3054C219.443 32.7209 207.141 28.4382 194.482 25.534C184.013 23.1927 173.358 21.7755 162.64 21.2989C161.376 21.3512 160.113 21.181 158.908 20.796C158.034 20.399 156.857 19.1682 156.962 18.4535C157.115 17.8927 157.381 17.3689 157.743 16.9139C158.104 16.4588 158.555 16.0821 159.067 15.8066C160.14 15.4683 161.274 15.3733 162.389 15.5286C179.805 15.3566 196.626 18.8373 212.998 24.462C220.978 27.2494 228.798 30.4747 236.423 34.1232C240.476 36.1159 244.202 38.7131 247.474 41.8258C254.342 48.2578 255.745 56.9397 251.841 65.4892C249.793 69.8582 246.736 73.6777 242.921 76.6327C236.224 82.0192 228.522 85.4602 220.502 88.2924C205.017 93.7847 188.964 96.9081 172.738 99.2109C153.442 101.949 133.993 103.478 114.506 103.79C91.1468 104.161 67.9334 102.97 45.1169 97.5831C36.0094 95.5616 27.2626 92.1655 19.1771 87.5116C13.839 84.5746 9.1557 80.5802 5.41318 75.7725C-0.54238 67.7259 -1.13794 59.1763 3.25594 50.2827C5.82447 45.3918 9.29572 41.0315 13.4863 37.4319C24.2989 27.5721 37.0438 20.9681 50.5431 15.7272C68.1451 8.8849 86.4883 5.1395 105.175 2.83669C129.045 0.0992292 153.151 0.134761 177.013 2.94256C197.672 5.23215 218.04 9.01724 237.588 16.3889C240.089 17.3418 242.498 18.5197 244.933 19.6446C246.627 20.4387 247.725 21.6695 246.997 23.615C246.455 25.1105 244.814 25.5605 242.63 24.5811C230.322 18.9961 217.233 16.1904 204.117 13.4376C188.761 10.3438 173.2 8.36665 157.558 7.52174C129.914 5.70776 102.154 8.06792 75.2124 14.5228C60.6177 17.8788 46.5758 23.2977 33.5102 30.6161C26.6595 34.3329 20.4123 39.0673 14.9818 44.658C12.9433 46.8071 11.1336 49.1622 9.58207 51.6855C4.87056 59.5336 5.61172 67.2494 11.9246 73.7608C15.2064 77.0494 18.8775 79.925 22.8564 82.3236C31.6176 87.7101 41.3848 90.5291 51.3902 92.5804C70.6068 96.5773 90.0219 97.7419 112.891 97.7022Z"
                                    fill="currentColor" />
                            </svg>
                            <span className={cn("relative z-10 block w-fit text-5xl font-black",
                                roi === null ? "text-gray-400" : roi >= 0 ? "text-emerald-500" : "text-red-500")}>
                                {roi !== null ? `${roi >= 0 ? '+' : ''}${parseFloat(roi).toFixed(1)}%` : '—'}
                            </span>
                        </div>
                        <h2 className="mt-6 text-center text-2xl font-semibold">Total ROI</h2>
                        {monthlyPnL !== null && (
                            <p className={cn("text-sm mt-1 font-medium", parseFloat(monthlyPnL) >= 0 ? "text-emerald-500" : "text-red-500")}>
                                {parseFloat(monthlyPnL) >= 0 ? '+' : ''}${parseFloat(monthlyPnL).toFixed(2)} this month
                            </p>
                        )}
                    </BCardContent>
                </BCard>

                {/* ── Card 2: Win Rate ── */}
                <BCard className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2">
                    <BCardContent className="pt-6">
                        <WinRateCircle winRate={winRate} />
                        <div className="relative z-10 mt-6 space-y-2 text-center">
                            <h2 className="text-lg font-medium">Win Rate</h2>
                            <p className="text-sm text-muted-foreground">
                                {totalTrades > 0 ? `${totalTrades} trades completed` : 'Success ratio across trades'}
                            </p>
                        </div>
                    </BCardContent>
                </BCard>

                {/* ── Card 3: Drawdown / Sparkline ── */}
                <BCard className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2">
                    <BCardContent className="pt-6">
                        <div className="px-2">
                            <LargeSparkline data={pnlChart} />
                        </div>
                        <div className="relative z-10 mt-8 space-y-1 text-center">
                            <h2 className="text-lg font-medium transition">
                                <span className="text-red-500 font-black">
                                    {drawdown !== null ? `${parseFloat(drawdown).toFixed(1)}%` : '—'}
                                </span>
                                {' '}Max Drawdown
                            </h2>
                            <p className="text-sm text-muted-foreground">Worst peak-to-trough decline</p>
                        </div>
                    </BCardContent>
                </BCard>

                {/* ── Card 4: PnL Chart ── */}
                <BCard className="relative col-span-full overflow-hidden lg:col-span-3">
                    <BCardContent className="grid pt-6 sm:grid-cols-[190px_1fr]">
                        <div className="relative z-10 flex flex-col justify-between space-y-10 lg:space-y-6">
                            <div className="relative flex aspect-square size-12 rounded-full border border-gray-200 items-center justify-center">
                                <TrendingUp className="size-5" strokeWidth={1} />
                            </div>
                            <div className="space-y-3">
                                <h2 className="text-lg font-medium">PnL Performance</h2>
                                <p className="text-sm text-muted-foreground">
                                    Monthly:{' '}
                                    <span className={cn("font-bold", monthlyPnL !== null && parseFloat(monthlyPnL) >= 0 ? "text-emerald-600" : "text-red-500")}>
                                        {monthlyPnL !== null ? `$${parseFloat(monthlyPnL).toFixed(2)}` : '—'}
                                    </span>
                                </p>
                                <div className="flex gap-1.5">
                                    {['7D', '30D', '90D'].map((tf) => (
                                        <button
                                            key={tf}
                                            onClick={() => setChartTimeframe(tf)}
                                            className={cn(
                                                "px-2.5 py-1 rounded-md text-xs font-semibold border transition-colors",
                                                chartTimeframe === tf
                                                    ? "bg-indigo-600 text-white border-indigo-600"
                                                    : "bg-transparent text-gray-500 border-gray-200 hover:border-gray-400"
                                            )}
                                        >
                                            {tf}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="relative -mb-6 -mr-6 mt-6 h-[200px] overflow-hidden border-l border-t p-3 sm:ml-6" style={{ borderRadius: '8px 0 0 0' }}>
                            {pnlChart.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={pnlChart} margin={{ top: 4, right: 2, bottom: 0, left: -22 }}>
                                        <defs>
                                            <linearGradient id="bentoAreaGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="date" tick={{ fontSize: 9 }}
                                            tickFormatter={(d) => d ? new Date(d).toLocaleDateString('en', { month: 'short', day: 'numeric' }) : ''} />
                                        <YAxis tick={{ fontSize: 9 }} />
                                        <RechartTooltip
                                            formatter={(v) => [`$${parseFloat(v).toFixed(2)}`]}
                                            contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                                        <Area type="monotone" dataKey="totalPnL" stroke="#6366f1" fill="url(#bentoAreaGrad)"
                                            strokeWidth={2} dot={false} name="PnL" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex h-full items-center justify-center text-sm text-gray-400">
                                    No performance data yet
                                </div>
                            )}
                        </div>
                    </BCardContent>
                </BCard>

                {/* ── Card 5: Copy Trading Snapshot ── */}
                <BCard className="relative col-span-full overflow-hidden lg:col-span-3">
                    <BCardContent className="grid h-full pt-6 sm:grid-cols-2">
                        <div className="relative z-10 flex flex-col justify-between space-y-10 lg:space-y-6">
                            <div className="relative flex aspect-square size-12 rounded-full border border-gray-200 items-center justify-center">
                                <Users className="size-5" strokeWidth={1} />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-lg font-medium">Copy Trading</h2>
                                <p className="text-sm text-muted-foreground">
                                    {copiers} active {copiers === 1 ? 'copier' : 'copiers'} following this strategy
                                </p>
                            </div>
                        </div>

                        <div className="relative mt-6 before:absolute before:inset-0 before:mx-auto before:w-px before:bg-gray-100 sm:-my-6 sm:-mr-6">
                            <div className="relative flex h-full flex-col justify-center space-y-6 py-6">
                                <div className="relative flex w-[calc(50%+0.875rem)] items-center justify-end gap-2">
                                    <span className="block h-fit rounded border bg-white px-2 py-1 text-xs shadow-sm">
                                        {copiers} copying
                                    </span>
                                    <div className="ring-4 ring-white size-7 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                        <PeopleOutlineIcon sx={{ fontSize: 14, color: '#6366f1' }} />
                                    </div>
                                </div>
                                <div className="relative ml-[calc(50%-1rem)] flex items-center gap-2">
                                    <div className="ring-4 ring-white size-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                        <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 14, color: '#10b981' }} />
                                    </div>
                                    <span className="block h-fit rounded border bg-white px-2 py-1 text-xs shadow-sm">
                                        Min ${trader.minimumCopyBalance}
                                    </span>
                                </div>
                                <div className="relative flex w-[calc(50%+0.875rem)] items-center justify-end gap-2">
                                    <span className={cn(
                                        "block h-fit rounded border bg-white px-2 py-1 text-xs shadow-sm font-semibold",
                                        monthlyPnL !== null && parseFloat(monthlyPnL) >= 0 ? "text-emerald-600" : "text-red-500"
                                    )}>
                                        {monthlyPnL !== null
                                            ? `${parseFloat(monthlyPnL) >= 0 ? '+' : ''}$${parseFloat(monthlyPnL).toFixed(2)}/mo`
                                            : '— /mo'}
                                    </span>
                                    <div className="ring-4 ring-white size-7 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                                        <Activity className="size-3 text-violet-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </BCardContent>
                </BCard>
            </div>
        </div>
    );
}

/* ─── Dialogs ─── */

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
                    <TextField label="Comment (optional)" multiline rows={3} value={comment}
                        onChange={(e) => setComment(e.target.value)} size="small" fullWidth />
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

/* ─── Tabs ─── */

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

/* ─── Main page ─── */

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

    const detail  = data?.data;
    const trader  = detail?.masterTrader;
    const stats   = detail?.latestStats;
    const pnlChart = detail?.pnlPerformanceChart || [];
    const isWatching = detail?.isWatching;
    const userSub    = detail?.userSubscription;

    const notify = (message, severity = 'success') =>
        dispatch(setNotification({ open: true, message, severity }));

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

                {/* ── Bento Detail Section ── */}
                <TraderBentoStats
                    stats={stats}
                    pnlChart={pnlChart}
                    chartTimeframe={chartTimeframe}
                    setChartTimeframe={setChartTimeframe}
                    trader={trader}
                />

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
                                    <Button variant="outlined" size="small" onClick={() => setReviewOpen(true)}
                                        sx={{ textTransform: 'none', borderRadius: 2 }}>
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
