import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Container, Typography, TextField, InputAdornment, Button,
    Grid, Card, CardContent, Stack, Chip, Avatar, CircularProgress,
    Alert, Pagination, Divider, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { useGetMasterTraderListQuery } from '../../../globalState/socialTradingState/socialTradingApis';

const SORT_OPTIONS = [
    { value: 'copiers', label: 'Most Copied' },
    { value: 'roi', label: 'Best ROI' },
    { value: 'winRate', label: 'Win Rate' },
    { value: 'trending', label: 'Trending' },
    { value: 'drawdown', label: 'Low Drawdown' },
    { value: 'newest', label: 'Newest' },
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

const riskBadgeStyle = (level) => {
    if (level === 'LOW') return { bgcolor: 'rgba(76,175,80,0.15)', color: '#2e7d32' };
    if (level === 'HIGH') return { bgcolor: 'rgba(244,67,54,0.15)', color: '#c62828' };
    return { bgcolor: 'rgba(255,152,0,0.15)', color: '#e65100' };
};

function MiniChart({ data }) {
    if (!data || data.length < 2) return <Box height={44} />;
    const last = data[data.length - 1]?.totalPnL ?? 0;
    const color = last >= 0 ? '#4caf50' : '#f44336';
    return (
        <ResponsiveContainer width="100%" height={44}>
            <LineChart data={data}>
                <Line type="monotone" dataKey="totalPnL" stroke={color} dot={false} strokeWidth={2} />
                <Tooltip
                    formatter={(v) => [`$${Number(v).toFixed(2)}`, 'PnL']}
                    labelFormatter={() => ''}
                    contentStyle={{ fontSize: 11, borderRadius: 6 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}

function TraderCard({ trader, onView }) {
    const stats = trader.latestStats;
    const roi = stats?.totalPnLPercentage ?? null;
    const winRate = stats?.winRate ?? null;
    const drawdown = stats?.maxDrawdownPercent ?? null;
    const copiers = stats?.activeCopiers ?? 0;
    const grad = traderGradient(trader.id);

    return (
        <Card sx={{
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 12px 40px rgba(0,0,0,0.12)' },
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* Gradient header */}
            <Box sx={{ background: grad, pt: 3, pb: 2.5, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.1)' }} />
                <Box sx={{ position: 'absolute', bottom: -30, left: -15, width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.07)' }} />
                <Avatar sx={{ width: 54, height: 54, fontSize: 21, fontWeight: 800, bgcolor: 'rgba(255,255,255,0.22)', color: 'white', border: '2px solid rgba(255,255,255,0.5)', zIndex: 1 }}>
                    {(trader.displayName || 'T')[0].toUpperCase()}
                </Avatar>
                <Typography variant="subtitle2" fontWeight={700} color="white" mt={1} textAlign="center" px={1} noWrap sx={{ maxWidth: '100%', zIndex: 1 }}>
                    {trader.displayName}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', zIndex: 1 }}>
                    {trader.user?.name || trader.user?.userName || ''}
                </Typography>
                <Stack direction="row" spacing={0.5} mt={0.75} flexWrap="wrap" justifyContent="center" sx={{ zIndex: 1 }}>
                    <Chip
                        label={trader.riskLevel}
                        size="small"
                        sx={{ bgcolor: 'rgba(255,255,255,0.22)', color: 'white', fontWeight: 600, fontSize: '0.68rem', height: 20 }}
                    />
                    {trader.tradingStyle && (
                        <Chip
                            label={trader.tradingStyle.charAt(0) + trader.tradingStyle.slice(1).toLowerCase()}
                            size="small"
                            sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '0.68rem', height: 20 }}
                        />
                    )}
                </Stack>
            </Box>

            <CardContent sx={{ flexGrow: 1, px: 2, py: 1.5 }}>
                <MiniChart data={trader.pnlPerformanceChart} />

                {/* ROI highlight */}
                <Box textAlign="center" mt={0.5} mb={1.5}>
                    <Typography
                        variant="h5"
                        fontWeight={800}
                        color={roi !== null ? (roi >= 0 ? 'success.main' : 'error.main') : 'text.primary'}
                    >
                        {roi !== null ? `${roi >= 0 ? '+' : ''}${parseFloat(roi).toFixed(2)}%` : '—'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Total ROI</Typography>
                </Box>

                <Divider sx={{ mb: 1.5 }} />

                <Grid container>
                    {[
                        { label: 'Win Rate', value: winRate !== null ? `${parseFloat(winRate).toFixed(1)}%` : '—', color: 'text.primary' },
                        { label: 'Max DD', value: drawdown !== null ? `${parseFloat(drawdown).toFixed(1)}%` : '—', color: 'error.main' },
                        { label: 'Copiers', value: copiers, color: 'text.primary' },
                    ].map((m) => (
                        <Grid item xs={4} key={m.label} sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary" display="block">{m.label}</Typography>
                            <Typography variant="body2" fontWeight={700} color={m.color}>{m.value}</Typography>
                        </Grid>
                    ))}
                </Grid>

                <Divider sx={{ my: 1.5 }} />

                <Stack direction="row" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <PeopleOutlineIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">{copiers} copying</Typography>
                    </Stack>
                    {trader.reviewsCount > 0 && (
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                            <StarOutlineIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                                {parseFloat(trader.reviewsRating).toFixed(1)} ({trader.reviewsCount})
                            </Typography>
                        </Stack>
                    )}
                    <Typography variant="caption" color="text.secondary">Min ${trader.minimumCopyBalance}</Typography>
                </Stack>
            </CardContent>

            <Box px={2} pb={2}>
                <Button
                    fullWidth
                    variant="contained"
                    size="small"
                    onClick={() => onView(trader.id)}
                    sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 700,
                        boxShadow: 'none',
                        background: grad,
                        '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.2)', opacity: 0.92 },
                    }}
                >
                    View Profile
                </Button>
            </Box>
        </Card>
    );
}

export default function MasterTraderDiscovery() {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState('copiers');
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');

    const { data, isLoading, isError, error } = useGetMasterTraderListQuery({ page, sizePerPage: 12, sortBy, search });

    const traders = data?.data?.masterTraders || [];
    const totalPages = data?.data?.totalPages || 1;
    const totalRecords = data?.data?.totalRecords || 0;

    const handleSearch = (e) => { e.preventDefault(); setSearch(searchInput); setPage(1); };
    const handleSortChange = (_, val) => { if (val) { setSortBy(val); setPage(1); } };

    return (
        <Box>
            {/* ── Hero ── */}
            <Box sx={{
                background: `linear-gradient(rgba(7,12,42,0.86), rgba(10,22,74,0.78)), url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1920&q=80') center/cover no-repeat`,
                py: { xs: 6, md: 9 },
                textAlign: 'center',
                color: 'white',
            }}>
                <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} mb={1.5}>
                    <AutoGraphIcon sx={{ fontSize: 32 }} />
                    <Typography variant="overline" sx={{ letterSpacing: 3, opacity: 0.8, fontSize: '0.75rem' }}>Social Trading</Typography>
                </Stack>
                <Typography variant="h3" fontWeight={800} mb={1.5} sx={{ fontSize: { xs: '1.8rem', md: '2.6rem' } }}>
                    Discover & Copy Expert Traders
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.75, fontWeight: 400, mb: 4, fontSize: { xs: '0.95rem', md: '1.1rem' } }}>
                    Follow proven strategies. Grow your portfolio automatically.
                </Typography>

                {/* Search */}
                <Box component="form" onSubmit={handleSearch} sx={{ maxWidth: 540, mx: 'auto', px: 2 }}>
                    <Stack direction="row" spacing={1}>
                        <TextField
                            fullWidth size="small"
                            placeholder="Search traders by name..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
                            sx={{ bgcolor: 'white', borderRadius: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                        <Button type="submit" variant="contained" sx={{ px: 3, borderRadius: 2, boxShadow: 'none', whiteSpace: 'nowrap', textTransform: 'none', bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}>
                            Search
                        </Button>
                    </Stack>
                </Box>

                {/* Platform stats */}
                <Stack direction="row" justifyContent="center" spacing={{ xs: 3, md: 6 }} mt={4} flexWrap="wrap">
                    {[
                        { icon: <PeopleOutlineIcon />, value: '1,200+', label: 'Active Traders' },
                        { icon: <TrendingUpIcon />, value: '+32%', label: 'Avg Annual ROI' },
                        { icon: <ShowChartIcon />, value: '50K+', label: 'Total Copiers' },
                    ].map((s) => (
                        <Stack key={s.label} direction="row" alignItems="center" spacing={1}>
                            <Box sx={{ color: 'rgba(255,255,255,0.7)' }}>{s.icon}</Box>
                            <Box>
                                <Typography variant="h6" fontWeight={800} lineHeight={1}>{s.value}</Typography>
                                <Typography variant="caption" sx={{ opacity: 0.7 }}>{s.label}</Typography>
                            </Box>
                        </Stack>
                    ))}
                </Stack>
            </Box>

            {/* ── Content ── */}
            <Container maxWidth="xl" sx={{ py: 4 }}>
                {/* Sort bar */}
                <Box mb={3} sx={{ overflowX: 'auto', pb: 0.5 }}>
                    <ToggleButtonGroup value={sortBy} exclusive onChange={handleSortChange} size="small" color="primary">
                        {SORT_OPTIONS.map((opt) => (
                            <ToggleButton key={opt.value} value={opt.value} sx={{ textTransform: 'none', px: 2.5, borderRadius: '20px !important', border: '1px solid', mr: 0.5 }}>
                                {opt.label}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </Box>

                {isLoading && <Box display="flex" justifyContent="center" py={8}><CircularProgress /></Box>}
                {isError && <Alert severity="error" sx={{ mb: 2 }}>{error?.data?.message || 'Failed to load traders.'}</Alert>}
                {!isLoading && !isError && traders.length === 0 && (
                    <Box textAlign="center" py={8}>
                        <ShowChartIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">No traders found</Typography>
                        <Typography variant="body2" color="text.disabled">Try adjusting your search or filters</Typography>
                    </Box>
                )}

                {!isLoading && traders.length > 0 && (
                    <>
                        <Typography variant="body2" color="text.secondary" mb={2.5}>
                            {totalRecords} trader{totalRecords !== 1 ? 's' : ''} found
                        </Typography>
                        <Grid container spacing={2.5}>
                            {traders.map((trader) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={trader.id}>
                                    <TraderCard trader={trader} onView={(id) => navigate(`/client/socialTrading/masterTrader/${id}`)} />
                                </Grid>
                            ))}
                        </Grid>

                        {totalPages > 1 && (
                            <Box display="flex" justifyContent="center" mt={5}>
                                <Pagination count={totalPages} page={page} onChange={(_, p) => setPage(p)} color="primary" shape="rounded" />
                            </Box>
                        )}
                    </>
                )}
            </Container>
        </Box>
    );
}
