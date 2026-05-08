import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Typography, Box, Grid, Card, CardContent, CardActionArea,
    Button, TextField, Select, MenuItem, FormControl, InputLabel,
    Chip, CircularProgress, Alert, Avatar, Stack, Divider, Pagination,
    InputAdornment, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useGetMasterTraderListQuery } from '../../../globalState/socialTradingState/socialTradingApis';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

const SORT_OPTIONS = [
    { value: 'copiers', label: 'Most Copied' },
    { value: 'roi', label: 'Best ROI' },
    { value: 'winRate', label: 'Win Rate' },
    { value: 'trending', label: 'Trending' },
    { value: 'drawdown', label: 'Low Drawdown' },
    { value: 'newest', label: 'Newest' },
];

const riskColor = (level) => {
    if (level === 'LOW') return 'success';
    if (level === 'HIGH') return 'error';
    return 'warning';
};

function MiniChart({ data }) {
    if (!data || data.length < 2) return null;
    const color = data[data.length - 1]?.totalPnL >= 0 ? '#4caf50' : '#f44336';
    return (
        <ResponsiveContainer width="100%" height={50}>
            <LineChart data={data}>
                <Line type="monotone" dataKey="totalPnL" stroke={color} dot={false} strokeWidth={2} />
                <Tooltip
                    formatter={(v) => [`$${v.toFixed(2)}`, 'PnL']}
                    labelFormatter={() => ''}
                    contentStyle={{ fontSize: 11 }}
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
    const copiers = stats?.activeCopiers ?? trader.maxCopiers - 1;

    return (
        <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardActionArea onClick={() => onView(trader.id)} sx={{ flexGrow: 1 }}>
                <CardContent>
                    <Stack direction="row" alignItems="center" spacing={1.5} mb={1}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40, fontSize: 16 }}>
                            {(trader.displayName || 'T')[0].toUpperCase()}
                        </Avatar>
                        <Box flex={1} minWidth={0}>
                            <Typography variant="subtitle2" noWrap fontWeight={600}>
                                {trader.displayName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" noWrap>
                                {trader.user?.name || trader.user?.userName || ''}
                            </Typography>
                        </Box>
                        <Chip
                            label={trader.riskLevel}
                            color={riskColor(trader.riskLevel)}
                            size="small"
                            variant="outlined"
                        />
                    </Stack>

                    <MiniChart data={trader.pnlPerformanceChart} />

                    <Grid container spacing={1} mt={0.5}>
                        <Grid item xs={4}>
                            <Typography variant="caption" color="text.secondary">ROI</Typography>
                            <Typography
                                variant="body2"
                                fontWeight={600}
                                color={roi !== null ? (roi >= 0 ? 'success.main' : 'error.main') : 'text.primary'}
                            >
                                {roi !== null ? `${roi >= 0 ? '+' : ''}${parseFloat(roi).toFixed(2)}%` : '-'}
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="caption" color="text.secondary">Win Rate</Typography>
                            <Typography variant="body2" fontWeight={600}>
                                {winRate !== null ? `${parseFloat(winRate).toFixed(1)}%` : '-'}
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="caption" color="text.secondary">Drawdown</Typography>
                            <Typography variant="body2" fontWeight={600} color="error.main">
                                {drawdown !== null ? `${parseFloat(drawdown).toFixed(1)}%` : '-'}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 1 }} />

                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            <PeopleOutlineIcon fontSize="small" color="action" />
                            <Typography variant="caption" color="text.secondary">
                                {copiers} copiers
                            </Typography>
                        </Stack>
                        {trader.reviewsCount > 0 && (
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <StarOutlineIcon fontSize="small" color="action" />
                                <Typography variant="caption" color="text.secondary">
                                    {parseFloat(trader.reviewsRating).toFixed(1)} ({trader.reviewsCount})
                                </Typography>
                            </Stack>
                        )}
                        <Typography variant="caption" color="text.secondary">
                            Min ${trader.minimumCopyBalance}
                        </Typography>
                    </Stack>
                </CardContent>
            </CardActionArea>
            <Box px={2} pb={1.5}>
                <Button
                    fullWidth
                    variant="contained"
                    size="small"
                    startIcon={<VisibilityOutlinedIcon />}
                    onClick={() => onView(trader.id)}
                    sx={{ textTransform: 'none', boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
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

    const { data, isLoading, isError, error } = useGetMasterTraderListQuery({
        page,
        sizePerPage: 12,
        sortBy,
        search,
    });

    const traders = data?.data?.masterTraders || [];
    const totalPages = data?.data?.totalPages || 1;
    const totalRecords = data?.data?.totalRecords || 0;

    const handleSearch = (e) => {
        e.preventDefault();
        setSearch(searchInput);
        setPage(1);
    };

    const handleSortChange = (_, val) => {
        if (val) {
            setSortBy(val);
            setPage(1);
        }
    };

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                <TrendingUpIcon color="primary" />
                <Typography variant="h5" fontWeight={600}>Discover Master Traders</Typography>
            </Stack>

            {/* Filters */}
            <Box component="form" onSubmit={handleSearch} mb={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start" flexWrap="wrap">
                    <TextField
                        size="small"
                        placeholder="Search traders..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ minWidth: 220 }}
                    />
                    <Button type="submit" variant="outlined" size="small" sx={{ textTransform: 'none', alignSelf: 'center' }}>
                        Search
                    </Button>
                </Stack>
            </Box>

            <Box mb={2} sx={{ overflowX: 'auto' }}>
                <ToggleButtonGroup
                    value={sortBy}
                    exclusive
                    onChange={handleSortChange}
                    size="small"
                    color="primary"
                >
                    {SORT_OPTIONS.map((opt) => (
                        <ToggleButton key={opt.value} value={opt.value} sx={{ textTransform: 'none', px: 2 }}>
                            {opt.label}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
            </Box>

            {isLoading && (
                <Box display="flex" justifyContent="center" py={6}>
                    <CircularProgress />
                </Box>
            )}

            {isError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error?.data?.message || 'Failed to load master traders.'}
                </Alert>
            )}

            {!isLoading && !isError && traders.length === 0 && (
                <Alert severity="info">No master traders found.</Alert>
            )}

            {!isLoading && traders.length > 0 && (
                <>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                        {totalRecords} trader{totalRecords !== 1 ? 's' : ''} found
                    </Typography>
                    <Grid container spacing={2}>
                        {traders.map((trader) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={trader.id}>
                                <TraderCard
                                    trader={trader}
                                    onView={(id) => navigate(`/client/socialTrading/masterTrader/${id}`)}
                                />
                            </Grid>
                        ))}
                    </Grid>

                    {totalPages > 1 && (
                        <Box display="flex" justifyContent="center" mt={4}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={(_, p) => setPage(p)}
                                color="primary"
                                shape="rounded"
                            />
                        </Box>
                    )}
                </>
            )}
        </Container>
    );
}
