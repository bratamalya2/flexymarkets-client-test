import { useEffect, useRef, useState, memo } from 'react';
import { useSelector } from 'react-redux';
import { createChart, CandlestickSeries } from 'lightweight-charts';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useQuotes } from '../../context/QuotesContext';

// MT5 Web API period enums → label, period value, seconds per candle, history range
const TIMEFRAMES = [
    { label: '1M',  period: 1,     candleSec: 60,      range: 3  * 60 * 60 },
    { label: '5M',  period: 5,     candleSec: 300,     range: 12 * 60 * 60 },
    { label: '15M', period: 15,    candleSec: 900,     range: 2  * 24 * 60 * 60 },
    { label: '30M', period: 30,    candleSec: 1800,    range: 4  * 24 * 60 * 60 },
    { label: '1H',  period: 16385, candleSec: 3600,    range: 7  * 24 * 60 * 60 },
    { label: '4H',  period: 16388, candleSec: 14400,   range: 30 * 24 * 60 * 60 },
    { label: '1D',  period: 16408, candleSec: 86400,   range: 365 * 24 * 60 * 60 },
];

function normalizeCandles(raw) {
    if (!Array.isArray(raw) || raw.length === 0) return [];
    const first = raw[0];
    if (Array.isArray(first)) {
        return raw
            .map(c => ({ time: Number(c[0]), open: Number(c[1]), high: Number(c[2]), low: Number(c[3]), close: Number(c[4]) }))
            .filter(c => c.time > 0 && c.open > 0);
    }
    return raw
        .map(c => ({
            time: Number(c.time ?? c.date ?? c.timestamp ?? 0),
            open: Number(c.open),
            high: Number(c.high),
            low: Number(c.low),
            close: Number(c.close),
        }))
        .filter(c => c.time > 0 && !isNaN(c.open));
}

function TerminalGraph() {
    const { selectedSymbol } = useSelector(state => state.terminal);
    const { token } = useSelector(state => state.auth);
    const { quoteData } = useQuotes();

    const containerRef = useRef(null);
    const chartRef = useRef(null);
    const seriesRef = useRef(null);
    const currentCandleRef = useRef(null);
    const abortRef = useRef(null);

    const [activeTimeframe, setActiveTimeframe] = useState(TIMEFRAMES[1]); // 5M default
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Create chart once on mount
    useEffect(() => {
        if (!containerRef.current) return;

        const chart = createChart(containerRef.current, {
            autoSize: true,
            layout: {
                background: { color: '#0F0F0F' },
                textColor: '#9ca3af',
            },
            grid: {
                vertLines: { color: 'rgba(255,255,255,0.04)' },
                horzLines: { color: 'rgba(255,255,255,0.04)' },
            },
            crosshair: { mode: 1 },
            rightPriceScale: { borderColor: 'rgba(76,175,80,0.2)' },
            timeScale: {
                borderColor: 'rgba(76,175,80,0.2)',
                timeVisible: true,
                secondsVisible: false,
            },
        });

        const series = chart.addSeries(CandlestickSeries, {
            upColor: '#4CAF50',
            downColor: '#f44336',
            borderUpColor: '#4CAF50',
            borderDownColor: '#f44336',
            wickUpColor: '#4CAF50',
            wickDownColor: '#f44336',
        });

        chartRef.current = chart;
        seriesRef.current = series;

        return () => {
            chart.remove();
            chartRef.current = null;
            seriesRef.current = null;
        };
    }, []);

    // Fetch OHLC history whenever symbol or timeframe changes
    useEffect(() => {
        if (!selectedSymbol || !token) return;

        // Cancel any in-flight request
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        setLoading(true);
        setError(null);
        currentCandleRef.current = null;

        const to = Math.floor(Date.now() / 1000);
        const from = to - activeTimeframe.range;
        const url = `${import.meta.env.VITE_BASE_URL}/user/analytics/chart`
            + `?symbol=${selectedSymbol}&from=${from}&to=${to}&period=${activeTimeframe.period}`;

        fetch(url, {
            headers: { Authorization: token },
            signal: controller.signal,
        })
            .then(r => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.json();
            })
            .then(res => {
                if (!res.status) throw new Error(res.message || 'Chart data unavailable');
                console.log('[Chart] raw sample:', Array.isArray(res.data) ? res.data.slice(0, 2) : res.data);
                const candles = normalizeCandles(res.data);
                console.log('[Chart] candles:', candles.length, candles[0]);
                if (seriesRef.current) {
                    seriesRef.current.setData(candles);
                    if (candles.length > 0) chartRef.current?.timeScale().fitContent();
                }
                currentCandleRef.current = candles.length > 0 ? candles[candles.length - 1] : null;
                setLoading(false);
                if (candles.length === 0) setError('No chart data for this period');
            })
            .catch(err => {
                if (err.name !== 'AbortError') {
                    setError(err.message || 'Failed to load chart data');
                    setLoading(false);
                }
            });

        return () => controller.abort();
    }, [selectedSymbol, activeTimeframe, token]);

    // Real-time last-candle updates from the quotes socket
    useEffect(() => {
        if (!quoteData?.length || !seriesRef.current || !selectedSymbol || !currentCandleRef.current) return;

        const tick = quoteData.find(q => q.Symbol === selectedSymbol);
        if (!tick) return;

        const price = (parseFloat(tick.Bid) + parseFloat(tick.Ask)) / 2;
        if (isNaN(price)) return;

        const now = Math.floor(Date.now() / 1000);
        const candleTime = Math.floor(now / activeTimeframe.candleSec) * activeTimeframe.candleSec;
        const prev = currentCandleRef.current;

        if (candleTime === prev.time) {
            const updated = {
                time: prev.time,
                open: prev.open,
                high: Math.max(prev.high, price),
                low: Math.min(prev.low, price),
                close: price,
            };
            currentCandleRef.current = updated;
            seriesRef.current.update(updated);
        } else if (candleTime > prev.time) {
            const newCandle = { time: candleTime, open: prev.close, high: price, low: price, close: price };
            currentCandleRef.current = newCandle;
            seriesRef.current.update(newCandle);
        }
    }, [quoteData, selectedSymbol, activeTimeframe.candleSec]);

    if (!selectedSymbol) {
        return (
            <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F0F0F' }}>
                <Typography sx={{ color: '#9ca3af', fontSize: '14px' }}>Select a symbol to view the chart</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0F0F0F' }}>
            {/* Toolbar */}
            <Box sx={{
                display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap',
                padding: '6px 10px', borderBottom: '1px solid rgba(76,175,80,0.15)',
                flexShrink: 0, background: 'rgba(10,14,23,0.95)',
            }}>
                <Typography sx={{ color: '#4CAF50', fontWeight: 700, fontSize: '14px', mr: 1 }}>
                    {selectedSymbol}
                </Typography>
                {TIMEFRAMES.map(tf => (
                    <Box
                        key={tf.label}
                        onClick={() => setActiveTimeframe(tf)}
                        sx={{
                            padding: '3px 9px', borderRadius: '4px', cursor: 'pointer',
                            fontSize: '11px', fontWeight: 600, userSelect: 'none',
                            color: activeTimeframe.label === tf.label ? '#fff' : '#9ca3af',
                            background: activeTimeframe.label === tf.label
                                ? 'linear-gradient(135deg, #4CAF50, #2E7D32)'
                                : 'transparent',
                            border: `1px solid ${activeTimeframe.label === tf.label ? '#4CAF50' : 'rgba(255,255,255,0.08)'}`,
                            transition: 'all 0.15s',
                            '&:hover': { color: '#fff', borderColor: '#4CAF50' },
                        }}
                    >
                        {tf.label}
                    </Box>
                ))}
            </Box>

            {/* Chart area */}
            <Box sx={{ flex: 1, position: 'relative', minHeight: 0 }}>
                <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />

                {loading && (
                    <Box sx={{
                        position: 'absolute', inset: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(10,14,23,0.55)', pointerEvents: 'none',
                    }}>
                        <CircularProgress size={28} sx={{ color: '#4CAF50' }} />
                    </Box>
                )}

                {error && !loading && (
                    <Box sx={{
                        position: 'absolute', inset: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Typography sx={{ color: '#f44336', fontSize: '13px' }}>{error}</Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default memo(TerminalGraph);
