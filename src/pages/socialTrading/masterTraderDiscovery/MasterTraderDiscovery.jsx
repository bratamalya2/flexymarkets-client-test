import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    Box, Container, Typography, TextField, InputAdornment, Button,
    CircularProgress, Alert, Pagination, Stack
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import { useGetMasterTraderListQuery } from '../../../globalState/socialTradingState/socialTradingApis';
import { GlassTraderCard } from '../../../components/ui/glass-trader-card';
import { cn } from '../../../lib/utils';

const SORT_OPTIONS = [
    { value: 'copiers',  label: 'Most Copied' },
    { value: 'roi',      label: 'Best ROI' },
    { value: 'winRate',  label: 'Win Rate' },
    { value: 'trending', label: 'Trending' },
    { value: 'drawdown', label: 'Low Drawdown' },
    { value: 'newest',   label: 'Newest' },
];

export default function MasterTraderDiscovery() {
    const navigate  = useNavigate();
    const { selectedTheme } = useSelector((state) => state.themeMode);
    const isDark = selectedTheme === 'dark';
    const [page, setPage]               = useState(1);
    const [sortBy, setSortBy]           = useState('copiers');
    const [search, setSearch]           = useState('');
    const [searchInput, setSearchInput] = useState('');

    const { data, isLoading, isError, error } = useGetMasterTraderListQuery({
        page, sizePerPage: 12, sortBy, search,
    });

    const traders      = data?.data?.masterTraders || [];
    const totalPages   = data?.data?.totalPages    || 1;
    const totalRecords = data?.data?.totalRecords  || 0;

    const handleSearch     = (e) => { e.preventDefault(); setSearch(searchInput); setPage(1); };
    const handleSortChange = (val) => { setSortBy(val); setPage(1); };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: isDark ? '#080d1f' : 'background.default' }}>

            {/* ── Hero ── */}
            <Box sx={{
                background: `linear-gradient(rgba(7,12,42,0.82), rgba(8,13,31,0.95)), url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1920&q=80') center/cover no-repeat`,
                pt: { xs: 7, md: 11 },
                pb: { xs: 6, md: 9 },
                textAlign: 'center',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Ambient glow circles */}
                <Box sx={{ position: 'absolute', top: '-10%', left: '15%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <Box sx={{ position: 'absolute', bottom: '-10%', right: '10%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(20,184,166,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

                <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} mb={2}>
                    <AutoGraphIcon sx={{ fontSize: 20, opacity: 0.6 }} />
                    <Typography variant="overline" sx={{ letterSpacing: '0.25em', opacity: 0.55, fontSize: '0.7rem' }}>SOCIAL TRADING</Typography>
                </Stack>

                <Typography variant="h2" fontWeight={900} sx={{ fontSize: { xs: '1.9rem', md: '3rem' }, mb: 1.5, background: 'linear-gradient(135deg, #fff 40%, rgba(255,255,255,0.55))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Discover & Copy<br />Expert Traders
                </Typography>

                <Typography sx={{ opacity: 0.55, mb: 5, fontSize: { xs: '0.9rem', md: '1rem' } }}>
                    Follow proven strategies. Grow your portfolio automatically.
                </Typography>

                {/* Search bar */}
                <Box component="form" onSubmit={handleSearch} sx={{ maxWidth: 520, mx: 'auto', px: 2 }}>
                    <Stack direction="row" spacing={1}>
                        <TextField
                            fullWidth size="small"
                            placeholder="Search traders by name…"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 18 }} /></InputAdornment> }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: 'rgba(255,255,255,0.07)',
                                    backdropFilter: 'blur(8px)',
                                    borderRadius: '12px',
                                    color: 'white',
                                    '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                                    '&.Mui-focused fieldset': { borderColor: 'rgba(255,255,255,0.45)' },
                                },
                                '& .MuiOutlinedInput-input::placeholder': { color: 'rgba(255,255,255,0.35)', opacity: 1 },
                            }}
                        />
                        <Button type="submit" variant="contained" sx={{
                            px: 3, borderRadius: '12px', textTransform: 'none', fontWeight: 600, whiteSpace: 'nowrap',
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            boxShadow: '0 4px 24px rgba(99,102,241,0.35)',
                            '&:hover': { boxShadow: '0 6px 28px rgba(99,102,241,0.5)' },
                        }}>
                            Search
                        </Button>
                    </Stack>
                </Box>

                {/* Platform stats */}
                <Stack direction="row" justifyContent="center" spacing={{ xs: 3, md: 7 }} mt={5} flexWrap="wrap">
                    {[
                        { icon: <PeopleOutlineIcon sx={{ fontSize: 18 }} />, value: '1,200+', label: 'Active Traders' },
                        { icon: <TrendingUpIcon sx={{ fontSize: 18 }} />,    value: '+32%',   label: 'Avg Annual ROI' },
                        { icon: <ShowChartIcon sx={{ fontSize: 18 }} />,     value: '50K+',   label: 'Total Copiers' },
                    ].map((s) => (
                        <Stack key={s.label} direction="row" alignItems="center" spacing={1}>
                            <Box sx={{ color: 'rgba(255,255,255,0.45)' }}>{s.icon}</Box>
                            <Box>
                                <Typography fontWeight={800} lineHeight={1.1} sx={{ fontSize: '1.1rem' }}>{s.value}</Typography>
                                <Typography sx={{ opacity: 0.45, fontSize: '0.72rem' }}>{s.label}</Typography>
                            </Box>
                        </Stack>
                    ))}
                </Stack>
            </Box>

            {/* ── Content area ── */}
            <Box sx={{ bgcolor: isDark ? '#080d1f' : 'background.default', pt: 4, pb: 8 }}>
                <Container maxWidth="xl">

                    {/* Sort pills */}
                    <Box mb={4} sx={{ overflowX: 'auto', pb: 0.5, display: 'flex', gap: 1 }}>
                        {SORT_OPTIONS.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => handleSortChange(opt.value)}
                                className={cn(
                                    "whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 border",
                                    sortBy === opt.value
                                        ? "bg-indigo-500 text-white border-indigo-500 shadow-lg shadow-indigo-500/30"
                                        : isDark
                                            ? "bg-white/[0.05] text-white/60 border-white/10 hover:bg-white/[0.09] hover:text-white/90"
                                            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </Box>

                    {isLoading && (
                        <Box display="flex" justifyContent="center" py={10}>
                            <CircularProgress sx={{ color: '#6366f1' }} />
                        </Box>
                    )}

                    {isError && (
                        <Alert severity="error" sx={{ borderRadius: 2, mb: 2 }}>
                            {error?.data?.message || 'Failed to load traders.'}
                        </Alert>
                    )}

                    {!isLoading && !isError && traders.length === 0 && (
                        <Box textAlign="center" py={10}>
                            <ShowChartIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 2 }} />
                            <Typography color="text.secondary" variant="h6">No traders found</Typography>
                            <Typography color="text.disabled" variant="body2">Try adjusting your search or filters</Typography>
                        </Box>
                    )}

                    {!isLoading && traders.length > 0 && (
                        <>
                            <Typography sx={{ color: 'text.disabled', fontSize: '0.8rem', mb: 3 }}>
                                {totalRecords} trader{totalRecords !== 1 ? 's' : ''} found
                            </Typography>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                                {traders.map((trader, idx) => (
                                    <GlassTraderCard
                                        key={trader.id}
                                        trader={trader}
                                        onView={(id) => navigate(`/client/socialTrading/masterTrader/${id}`)}
                                        style={{ animationDelay: `${idx * 40}ms` }}
                                    />
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <Box display="flex" justifyContent="center" mt={6}>
                                    <Pagination
                                        count={totalPages} page={page}
                                        onChange={(_, p) => setPage(p)}
                                        sx={{
                                            '& .MuiPaginationItem-root': { color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.12)' },
                                            '& .Mui-selected': { bgcolor: '#6366f1 !important', color: 'white', borderColor: '#6366f1' },
                                        }}
                                        variant="outlined" shape="rounded"
                                    />
                                </Box>
                            )}
                        </>
                    )}
                </Container>
            </Box>
        </Box>
    );
}
