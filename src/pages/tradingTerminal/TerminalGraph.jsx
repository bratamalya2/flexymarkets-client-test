import { useEffect, useMemo, useRef, useState, memo } from 'react';
import { useSelector } from 'react-redux';
import { createChart, CandlestickSeries } from 'lightweight-charts';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useQuotes } from '../../context/QuotesContext';

const TIMEFRAMES = [
    { label: '1M',  period: 1,     candleSec: 60,      range: 3 * 24 * 60 * 60 },          // 3 Days
    { label: '5M',  period: 5,     candleSec: 300,     range: 7 * 24 * 60 * 60 },          // 7 Days
    { label: '15M', period: 15,    candleSec: 900,     range: 15 * 24 * 60 * 60 },         // 15 Days
    { label: '30M', period: 30,    candleSec: 1800,    range: 30 * 24 * 60 * 60 },         // 30 Days
    { label: '1H',  period: 60,    candleSec: 3600,    range: 90 * 24 * 60 * 60 },         // 90 Days
    { label: '4H',  period: 240,   candleSec: 14400,   range: 365 * 24 * 60 * 60 },        // 1 Year
    { label: '1D',  period: 1440,  candleSec: 86400,   range: 10 * 365 * 24 * 60 * 60 },   // 10 Years
];

function normalizeCandles(raw) {
    const rows = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.answer)
            ? raw.answer
            : Array.isArray(raw?.data)
                ? raw.data
                : [];

    if (rows.length === 0) return [];

    const parseNumber = (value) => {
        const number = Number(String(value ?? "").replace(/,/g, ""));
        return Number.isFinite(number) ? number : NaN;
    };

    const parseTime = (value) => {
        if (value === undefined || value === null || value === "") return 0;

        const numericTime = Number(value);
        if (Number.isFinite(numericTime)) {
            return numericTime > 9999999999 ? Math.floor(numericTime / 1000) : numericTime;
        }

        const rawTime = String(value).trim();
        const mt5Date = rawTime.match(/^(\d{4})[./-](\d{1,2})[./-](\d{1,2})(?:[ T](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
        if (mt5Date) {
            const [, year, month, day, hour = "0", minute = "0", second = "0"] = mt5Date;
            return Math.floor(Date.UTC(
                Number(year),
                Number(month) - 1,
                Number(day),
                Number(hour),
                Number(minute),
                Number(second)
            ) / 1000);
        }

        const parsed = Date.parse(rawTime);
        return Number.isFinite(parsed) ? Math.floor(parsed / 1000) : 0;
    };

    const getValue = (row, keys) => {
        const key = keys.find(candidate => row?.[candidate] !== undefined);
        return key !== undefined ? row[key] : undefined;
    };

    const finalizeCandle = ({ time, open, high, low, close }) => ({
        time,
        open,
        high: Math.max(high, open, close),
        low: Math.min(low, open, close),
        close,
    });

    const first = rows[0];
    if (typeof first === "string" && first.includes(",")) {
        return rows
            .map(row => String(row).split(","))
            .map(c => finalizeCandle({
                time: parseTime(c[0]),
                open: parseNumber(c[1]),
                high: parseNumber(c[2]),
                low: parseNumber(c[3]),
                close: parseNumber(c[4]),
            }))
            .filter(c => c.time > 0 && c.open > 0 && c.high > 0 && c.low > 0 && c.close > 0);
    }

    if (!Array.isArray(first) && typeof first !== "object" && rows.length >= 5) {
        const chunkedRows = [];
        for (let index = 0; index <= rows.length - 5; index += 5) {
            chunkedRows.push(rows.slice(index, index + 5));
        }

        return chunkedRows
            .map(c => finalizeCandle({
                time: parseTime(c[0]),
                open: parseNumber(c[1]),
                high: parseNumber(c[2]),
                low: parseNumber(c[3]),
                close: parseNumber(c[4]),
            }))
            .filter(c => c.time > 0 && c.open > 0 && c.high > 0 && c.low > 0 && c.close > 0);
    }

    if (Array.isArray(first)) {
        return rows
            .map(c => {
                const time = parseTime(c[0]);
                const open = parseNumber(c[1]);
                const high = parseNumber(c[2]);
                const low = parseNumber(c[3]);
                const close = parseNumber(c[4]);

                if (high < low) {
                    return finalizeCandle({
                        time,
                        high: parseNumber(c[1]),
                        low: parseNumber(c[2]),
                        open: parseNumber(c[3]),
                        close,
                    });
                }

                return finalizeCandle({ time, open, high, low, close });
            })
            .filter(c => c.time > 0 && c.open > 0 && c.high > 0 && c.low > 0 && c.close > 0);
    }

    return rows
        .map(c => finalizeCandle({
            time: parseTime(getValue(c, ["time", "Time", "TIME", "date", "Date", "DATE", "datetime", "DateTime", "DATETIME", "timestamp", "Timestamp", "TIMESTAMP"])),
            open: parseNumber(getValue(c, ["open", "Open", "OPEN", "o", "O"])),
            high: parseNumber(getValue(c, ["high", "High", "HIGH", "h", "H"])),
            low: parseNumber(getValue(c, ["low", "Low", "LOW", "l", "L"])),
            close: parseNumber(getValue(c, ["close", "Close", "CLOSE", "c", "C"])),
        }))
        .filter(c => c.time > 0 && c.open > 0 && c.high > 0 && c.low > 0 && c.close > 0);
}

function getSymbolName(symbol) {
    const rawSymbol = symbol?.Symbol ?? symbol?.name ?? symbol;
    return rawSymbol ? String(rawSymbol).split(".")[0].toUpperCase() : "";
}

function TerminalGraph() {
    const { selectedSymbol, chartSettings } = useSelector(state => state.terminal);
    const { token } = useSelector(state => state.auth);
    const { quoteData } = useQuotes();
    const chartSymbol = useMemo(() => getSymbolName(selectedSymbol), [selectedSymbol]);

    const containerRef = useRef(null);
    const chartRef = useRef(null);
    const seriesRef = useRef(null);
    const currentCandleRef = useRef(null);
    const abortRef = useRef(null);
    const chartSettingsRef = useRef(chartSettings);
    chartSettingsRef.current = chartSettings;

    const [activeTimeframe, setActiveTimeframe] = useState(TIMEFRAMES[1]); // 5M default
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [chartReady, setChartReady] = useState(false);

    // Create the chart once the real chart container is rendered.
    // On first terminal load, selectedSymbol is often populated asynchronously;
    // the initial placeholder render has no container, so this must rerun then.
    useEffect(() => {
        if (!chartSymbol || !containerRef.current || chartRef.current) return;
        setChartReady(false);
        setError(null);
        const initialSettings = chartSettingsRef.current;
        let animationFrameId;
        let resizeObserver;
        let removeResizeListener = null;
        let chart;

        const createChartWhenSized = () => {
            const container = containerRef.current;
            if (!container || chartRef.current) return;

            const { width, height } = container.getBoundingClientRect();
            if (width < 10 || height < 10) {
                animationFrameId = requestAnimationFrame(createChartWhenSized);
                return;
            }

            try {
                chart = createChart(container, {
                    autoSize: true,
                    layout: {
                        background: { color: initialSettings?.backgroundColor || '#0F0F0F' },
                        textColor: initialSettings?.textColor || '#9ca3af',
                    },
                    grid: {
                        vertLines: {
                            visible: initialSettings?.showVertLines ?? true,
                            color: initialSettings?.showVertLines ? (initialSettings?.gridColor || 'rgba(255,255,255,0.04)') : 'transparent'
                        },
                        horzLines: {
                            visible: initialSettings?.showHorzLines ?? true,
                            color: initialSettings?.showHorzLines ? (initialSettings?.gridColor || 'rgba(255,255,255,0.04)') : 'transparent'
                        },
                    },
                    crosshair: { mode: 1 },
                    rightPriceScale: { borderColor: 'rgba(76,175,80,0.2)' },
                    timeScale: {
                        borderColor: 'rgba(76,175,80,0.2)',
                        timeVisible: true,
                        secondsVisible: false,
                    },
                });

                const resizeChart = (nextWidth, nextHeight) => {
                    if (nextWidth > 0 && nextHeight > 0) {
                        chart.resize(nextWidth, nextHeight);
                    }
                };

                resizeChart(Math.floor(width), Math.floor(height));

                const series = chart.addSeries(CandlestickSeries, {
                    upColor: initialSettings?.upColor || '#4CAF50',
                    downColor: initialSettings?.downColor || '#f44336',
                    borderUpColor: initialSettings?.upColor || '#4CAF50',
                    borderDownColor: initialSettings?.downColor || '#f44336',
                    wickUpColor: initialSettings?.upColor || '#4CAF50',
                    wickDownColor: initialSettings?.downColor || '#f44336',
                });

                chartRef.current = chart;
                seriesRef.current = series;

                if (typeof ResizeObserver !== "undefined") {
                    resizeObserver = new ResizeObserver(([entry]) => {
                        resizeChart(Math.floor(entry.contentRect.width), Math.floor(entry.contentRect.height));
                    });
                    resizeObserver.observe(container);
                } else {
                    const handleWindowResize = () => {
                        const nextRect = container.getBoundingClientRect();
                        resizeChart(Math.floor(nextRect.width), Math.floor(nextRect.height));
                    };
                    window.addEventListener("resize", handleWindowResize);
                    removeResizeListener = () => window.removeEventListener("resize", handleWindowResize);
                }

                setChartReady(true);
            } catch (err) {
                setError(err?.message || "Failed to initialize chart");
                setChartReady(false);
            }
        };

        animationFrameId = requestAnimationFrame(createChartWhenSized);

        return () => {
            cancelAnimationFrame(animationFrameId);
            resizeObserver?.disconnect();
            removeResizeListener?.();
            chart?.remove();
            chartRef.current = null;
            seriesRef.current = null;
            setChartReady(false);
        };
    }, [chartSymbol]);

    useEffect(() => {
        if (!chartSymbol || chartReady || error) return;

        const timeoutId = setTimeout(() => {
            if (!chartRef.current) {
                setError("Chart did not initialize. Please refresh the terminal.");
            }
        }, 8000);

        return () => clearTimeout(timeoutId);
    }, [chartReady, chartSymbol, error]);

    // Apply settings changes dynamically in real time
    useEffect(() => {
        if (!chartRef.current || !seriesRef.current || !chartSettings) return;

        const chart = chartRef.current;
        const series = seriesRef.current;

        chart.applyOptions({
            layout: {
                background: { color: chartSettings.backgroundColor || '#0F0F0F' },
                textColor: chartSettings.textColor || '#9ca3af',
            },
            grid: {
                vertLines: {
                    visible: chartSettings.showVertLines ?? true,
                    color: chartSettings.showVertLines ? (chartSettings.gridColor || 'rgba(255,255,255,0.04)') : 'transparent'
                },
                horzLines: {
                    visible: chartSettings.showHorzLines ?? true,
                    color: chartSettings.showHorzLines ? (chartSettings.gridColor || 'rgba(255,255,255,0.04)') : 'transparent'
                },
            }
        });

        series.applyOptions({
            upColor: chartSettings.upColor || '#4CAF50',
            downColor: chartSettings.downColor || '#f44336',
            borderUpColor: chartSettings.upColor || '#4CAF50',
            borderDownColor: chartSettings.downColor || '#f44336',
            wickUpColor: chartSettings.upColor || '#4CAF50',
            wickDownColor: chartSettings.downColor || '#f44336',
        });
    }, [chartSettings]);

    // Listen to zoom and refresh events from the toolbar
    useEffect(() => {
        const handleZoomIn = () => {
            if (chartRef.current) {
                const timeScale = chartRef.current.timeScale();
                const currentSpacing = (typeof timeScale.options === 'function' ? timeScale.options().barSpacing : timeScale.options?.barSpacing) || 6;
                timeScale.applyOptions({ barSpacing: Math.min(50, currentSpacing + 2) });
            }
        };

        const handleZoomOut = () => {
            if (chartRef.current) {
                const timeScale = chartRef.current.timeScale();
                const currentSpacing = (typeof timeScale.options === 'function' ? timeScale.options().barSpacing : timeScale.options?.barSpacing) || 6;
                timeScale.applyOptions({ barSpacing: Math.max(0.5, currentSpacing - 2) });
            }
        };

        const handleRefresh = () => {
            setRefreshKey(prev => prev + 1);
            if (chartRef.current) {
                chartRef.current.timeScale().fitContent();
            }
        };

        window.addEventListener('chartZoomIn', handleZoomIn);
        window.addEventListener('chartZoomOut', handleZoomOut);
        window.addEventListener('refreshChart', handleRefresh);

        return () => {
            window.removeEventListener('chartZoomIn', handleZoomIn);
            window.removeEventListener('chartZoomOut', handleZoomOut);
            window.removeEventListener('refreshChart', handleRefresh);
        };
    }, [setRefreshKey]);

    // Fetch OHLC history whenever symbol or timeframe changes
    useEffect(() => {
        if (!chartSymbol || !token || !chartReady || !seriesRef.current) return;

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
            + `?symbol=${encodeURIComponent(chartSymbol)}&from=${from}&to=${to}&period=${activeTimeframe.period}`;

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
                
                // Normalize, sort ascending, and deduplicate by time to prevent lightweight-charts sorting errors
                let candles = normalizeCandles(res.data);
                candles.sort((a, b) => a.time - b.time);
                candles = candles.filter((item, idx, arr) => idx === 0 || item.time !== arr[idx - 1].time);
                
                console.log('[Chart] candles after sorting/dedup:', candles.length);
                if (seriesRef.current) {
                    seriesRef.current.setData(candles);
                    if (candles.length > 0) {
                        requestAnimationFrame(() => chartRef.current?.timeScale().fitContent());
                    }
                }
                currentCandleRef.current = candles.length > 0 ? candles[candles.length - 1] : null;
                setLoading(false);
                if (candles.length === 0) setError(`No chart data for ${chartSymbol} in this period`);
            })
            .catch(err => {
                if (err.name !== 'AbortError') {
                    setError(err.message || 'Failed to load chart data');
                    setLoading(false);
                }
            });

        return () => controller.abort();
    }, [chartSymbol, activeTimeframe, token, refreshKey, chartReady]);

    // Real-time last-candle updates from the quotes socket
    useEffect(() => {
        if (!quoteData?.length || !seriesRef.current || !chartSymbol || !currentCandleRef.current) return;

        const normalize = (s) => s?.split('.')[0]?.toUpperCase() || "";
        const selectedNorm = normalize(chartSymbol);
        const tick = quoteData.find(q => normalize(q.Symbol) === selectedNorm);
        if (!tick) return;

        const price = (parseFloat(tick.Bid) + parseFloat(tick.Ask)) / 2;
        if (isNaN(price)) return;

        const now = Math.floor(Date.now() / 1000);
        const prev = currentCandleRef.current;

        // Dynamic timezone offset calculation:
        // We find the difference between the historical candle's time and what the client's current candle time would be.
        const clientCandleTime = Math.floor(now / activeTimeframe.candleSec) * activeTimeframe.candleSec;
        const timezoneOffset = prev._offset !== undefined
            ? prev._offset
            : prev.time - clientCandleTime;

        prev._offset = timezoneOffset;
        const candleTime = clientCandleTime + timezoneOffset;

        if (candleTime === prev.time) {
            const updated = {
                time: prev.time,
                open: prev.open,
                high: Math.max(prev.high, price),
                low: Math.min(prev.low, price),
                close: price,
                _offset: timezoneOffset,
            };
            currentCandleRef.current = updated;
            seriesRef.current.update(updated);
        } else if (candleTime > prev.time) {
            const newCandle = {
                time: candleTime,
                open: prev.close,
                high: price,
                low: price,
                close: price,
                _offset: timezoneOffset,
            };
            currentCandleRef.current = newCandle;
            seriesRef.current.update(newCandle);
        }
    }, [quoteData, chartSymbol, activeTimeframe.candleSec]);

    if (!chartSymbol) {
        return (
            <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: chartSettings?.backgroundColor || '#0F0F0F' }}>
                <Typography sx={{ color: '#9ca3af', fontSize: '14px' }}>Select a symbol to view the chart</Typography>
            </Box>
        );
    }

    const isInitializing = !chartReady && !error;

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', background: chartSettings?.backgroundColor || '#0F0F0F' }}>
            {/* Toolbar */}
            <Box sx={{
                display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap',
                padding: '6px 10px', borderBottom: '1px solid rgba(76,175,80,0.15)',
                flexShrink: 0, background: 'rgba(10,14,23,0.95)',
            }}>
                <Typography sx={{ color: '#4CAF50', fontWeight: 700, fontSize: '14px', mr: 1 }}>
                    {chartSymbol}
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
            <Box sx={{ flex: 1, position: 'relative', minHeight: 0, width: '100%', height: '100%' }}>
                <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden' }} />

                {(loading || isInitializing) && (
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
