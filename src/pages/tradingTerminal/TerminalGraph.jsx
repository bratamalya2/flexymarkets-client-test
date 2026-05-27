import { useCallback, useEffect, useMemo, useRef, useState, memo } from 'react';
import { useSelector } from 'react-redux';
import { createChart, CandlestickSeries, LineStyle } from 'lightweight-charts';
import { Box, Typography, CircularProgress, Tooltip } from '@mui/material';
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

function getRawSymbolName(symbol) {
    const rawSymbol = symbol?.groupedSym ?? symbol?.Symbol ?? symbol?.name ?? symbol;
    return rawSymbol ? String(rawSymbol).trim() : "";
}

function getBaseSymbolName(symbol) {
    const rawSymbol = getRawSymbolName(symbol);
    return rawSymbol ? rawSymbol.split(".")[0].toUpperCase() : "";
}

function parseFiniteNumber(value) {
    const parsed = Number(String(value ?? "").replace(/,/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
}

function getPositionList(positions) {
    if (Array.isArray(positions)) return positions;
    if (Array.isArray(positions?.positionList)) return positions.positionList;
    return [];
}

function getPositionType(position) {
    const action = position?.Action ?? position?.Type;
    return action === 1 || action === "1" ? "Sell" : "Buy";
}

function getPositionEntryPrice(position) {
    return parseFiniteNumber(position?.PriceOpen ?? position?.PriceOrder ?? position?.PriceCurrent);
}

const DRAWING_STORAGE_PREFIX = "terminalChartDrawings";
const DRAWING_TOOLS = [
    { id: "select", label: "Move" },
    { id: "pencil", label: "Pencil" },
    { id: "trendline", label: "Line" },
    { id: "horizontal", label: "H-Line" },
    { id: "rectangle", label: "Box" },
    { id: "text", label: "Text" },
];

function createDrawingId() {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getPointDistance(start, end) {
    if (!start || !end) return 0;
    const dx = (end.x ?? 0) - (start.x ?? 0);
    const dy = (end.y ?? 0) - (start.y ?? 0);
    return Math.sqrt(dx * dx + dy * dy);
}

function getPolylineScreenDistance(points = []) {
    return points.reduce((total, point, index) => {
        if (index === 0) return total;
        return total + getPointDistance(points[index - 1], point);
    }, 0);
}

function colorWithAlpha(color, alpha) {
    const hex = String(color || "").replace("#", "");
    if (!/^[0-9a-f]{6}$/i.test(hex)) return `rgba(31, 122, 224, ${alpha})`;

    const red = parseInt(hex.slice(0, 2), 16);
    const green = parseInt(hex.slice(2, 4), 16);
    const blue = parseInt(hex.slice(4, 6), 16);
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function TerminalGraph() {
    const { selectedSymbol, chartSettings } = useSelector(state => state.terminal);
    const { activeMT5AccountPositionsDetails } = useSelector(state => state.mt5);
    const { token } = useSelector(state => state.auth);
    const { quoteData } = useQuotes();
    const chartSymbol = useMemo(() => getBaseSymbolName(selectedSymbol), [selectedSymbol]);
    const chartRequestSymbol = useMemo(() => {
        const selectedRawSymbol = getRawSymbolName(selectedSymbol);
        const liveQuoteSymbol = quoteData?.find(item => getBaseSymbolName(item) === chartSymbol);

        return getRawSymbolName(liveQuoteSymbol) || selectedRawSymbol || chartSymbol;
    }, [chartSymbol, quoteData, selectedSymbol]);
    const visualChartSettings = useMemo(() => {
        const settings = chartSettings || {};
        return {
            ...settings,
            backgroundColor: !settings.backgroundColor || settings.backgroundColor === '#0F0F0F' ? '#ffffff' : settings.backgroundColor,
            textColor: !settings.textColor || settings.textColor === '#9ca3af' ? '#344054' : settings.textColor,
            gridColor: !settings.gridColor || settings.gridColor === 'rgba(255,255,255,0.04)' ? 'rgba(15,23,42,0.08)' : settings.gridColor,
            upColor: !settings.upColor || settings.upColor === '#4CAF50' ? '#16a085' : settings.upColor,
            downColor: !settings.downColor || settings.downColor === '#f44336' ? '#ef334e' : settings.downColor,
        };
    }, [chartSettings]);
    const hasChartSymbol = Boolean(chartSymbol);

    const containerRef = useRef(null);
    const drawingOverlayRef = useRef(null);
    const chartRef = useRef(null);
    const seriesRef = useRef(null);
    const entryPriceLinesRef = useRef([]);
    const currentCandleRef = useRef(null);
    const abortRef = useRef(null);
    const requestIdRef = useRef(0);
    const loadedDrawingKeyRef = useRef(null);
    const skipNextDrawingPersistRef = useRef(false);
    const chartSettingsRef = useRef(visualChartSettings);
    chartSettingsRef.current = visualChartSettings;

    const [activeTimeframe, setActiveTimeframe] = useState(TIMEFRAMES[1]); // 5M default
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [chartReady, setChartReady] = useState(false);
    const [activeDrawingTool, setActiveDrawingTool] = useState("select");
    const [drawingColor, setDrawingColor] = useState("#1f7ae0");
    const [drawings, setDrawings] = useState([]);
    const [draftDrawing, setDraftDrawing] = useState(null);
    const [drawingRenderVersion, setDrawingRenderVersion] = useState(0);
    const drawingStorageKey = useMemo(
        () => chartSymbol ? `${DRAWING_STORAGE_PREFIX}:${chartSymbol}` : null,
        [chartSymbol]
    );

    const removeEntryPriceLines = useCallback((series = seriesRef.current) => {
        if (!series) {
            entryPriceLinesRef.current = [];
            return;
        }

        entryPriceLinesRef.current.forEach((priceLine) => {
            try {
                series.removePriceLine(priceLine);
            } catch {
                // The chart may already have been disposed during symbol/account switches.
            }
        });
        entryPriceLinesRef.current = [];
    }, []);

    const getChartPointFromPointer = useCallback((event) => {
        const overlay = drawingOverlayRef.current;
        const chart = chartRef.current;
        const series = seriesRef.current;
        if (!overlay || !chart || !series) return null;

        const rect = overlay.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const time = chart.timeScale().coordinateToTime(x);
        const price = series.coordinateToPrice(y);

        if (time === null || time === undefined || price === null || price === undefined || !Number.isFinite(Number(price))) {
            return null;
        }

        return { time, price: Number(price), x, y };
    }, []);

    const getDrawingPointCoordinates = useCallback((point) => {
        const chart = chartRef.current;
        const series = seriesRef.current;
        if (!point || !chart || !series) return null;

        const x = chart.timeScale().timeToCoordinate(point.time);
        const y = series.priceToCoordinate(point.price);
        if (x === null || x === undefined || y === null || y === undefined) return null;

        return { x, y };
    }, []);

    const handleUndoDrawing = useCallback(() => {
        setDraftDrawing(null);
        setDrawings((current) => current.slice(0, -1));
    }, []);

    const handleClearDrawings = useCallback(() => {
        setDraftDrawing(null);
        setDrawings([]);
    }, []);

    const handleDrawingPointerDown = useCallback((event) => {
        if (activeDrawingTool === "select" || !chartReady) return;

        const point = getChartPointFromPointer(event);
        if (!point) return;

        event.preventDefault();
        event.currentTarget.setPointerCapture?.(event.pointerId);

        if (activeDrawingTool === "horizontal") {
            setDrawings((current) => [
                ...current,
                {
                    id: createDrawingId(),
                    type: "horizontal",
                    price: point.price,
                    color: drawingColor,
                },
            ]);
            return;
        }

        if (activeDrawingTool === "text") {
            const text = window.prompt("Add chart note");
            const note = String(text || "").trim();
            if (!note) return;

            setDrawings((current) => [
                ...current,
                {
                    id: createDrawingId(),
                    type: "text",
                    point,
                    text: note,
                    color: drawingColor,
                },
            ]);
            return;
        }

        setDraftDrawing({
            id: createDrawingId(),
            type: activeDrawingTool,
            points: activeDrawingTool === "pencil" ? [point] : [point, point],
            color: drawingColor,
        });
    }, [activeDrawingTool, chartReady, drawingColor, getChartPointFromPointer]);

    const handleDrawingPointerMove = useCallback((event) => {
        if (!draftDrawing) return;
        const point = getChartPointFromPointer(event);
        if (!point) return;

        event.preventDefault();
        setDraftDrawing((current) => current
            ? {
                ...current,
                points: current.type === "pencil"
                    ? [...current.points, point]
                    : [current.points[0], point],
            }
            : current
        );
    }, [draftDrawing, getChartPointFromPointer]);

    const handleDrawingPointerUp = useCallback((event) => {
        if (!draftDrawing) return;
        const endPoint = getChartPointFromPointer(event);
        const nextDrawing = endPoint
            ? {
                ...draftDrawing,
                points: draftDrawing.type === "pencil"
                    ? [...draftDrawing.points, endPoint]
                    : [draftDrawing.points[0], endPoint],
            }
            : draftDrawing;

        event.preventDefault();
        event.currentTarget.releasePointerCapture?.(event.pointerId);

        const drawingDistance = nextDrawing.type === "pencil"
            ? getPolylineScreenDistance(nextDrawing.points)
            : getPointDistance(nextDrawing.points[0], nextDrawing.points[1]);

        if (drawingDistance > 8) {
            setDrawings((current) => [...current, nextDrawing]);
        }
        setDraftDrawing(null);
    }, [draftDrawing, getChartPointFromPointer]);

    // Create one stable chart instance once the real chart container is rendered.
    // Symbol changes only replace the series data; recreating the chart can race
    // against the next history request and leave the new pair with an empty plot.
    useEffect(() => {
        if (!hasChartSymbol || !containerRef.current || chartRef.current) return;
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
                        background: { color: initialSettings?.backgroundColor || '#ffffff' },
                        textColor: initialSettings?.textColor || '#344054',
                    },
                    grid: {
                        vertLines: {
                            visible: initialSettings?.showVertLines ?? true,
                            color: initialSettings?.showVertLines ? (initialSettings?.gridColor || 'rgba(15,23,42,0.08)') : 'transparent'
                        },
                        horzLines: {
                            visible: initialSettings?.showHorzLines ?? true,
                            color: initialSettings?.showHorzLines ? (initialSettings?.gridColor || 'rgba(15,23,42,0.08)') : 'transparent'
                        },
                    },
                    crosshair: { mode: 1 },
                    rightPriceScale: { borderColor: 'rgba(15,23,42,0.14)' },
                    timeScale: {
                        borderColor: 'rgba(15,23,42,0.14)',
                        timeVisible: true,
                        secondsVisible: false,
                    },
                });

                const resizeChart = (nextWidth, nextHeight) => {
                    if (nextWidth > 0 && nextHeight > 0) {
                        chart.resize(nextWidth, nextHeight);
                        setDrawingRenderVersion((value) => value + 1);
                    }
                };

                resizeChart(Math.floor(width), Math.floor(height));

                const series = chart.addSeries(CandlestickSeries, {
                    upColor: initialSettings?.upColor || '#16a085',
                    downColor: initialSettings?.downColor || '#ef334e',
                    borderUpColor: initialSettings?.upColor || '#16a085',
                    borderDownColor: initialSettings?.downColor || '#ef334e',
                    wickUpColor: initialSettings?.upColor || '#16a085',
                    wickDownColor: initialSettings?.downColor || '#ef334e',
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
            removeEntryPriceLines(seriesRef.current);
            chart?.remove();
            chartRef.current = null;
            seriesRef.current = null;
            setChartReady(false);
        };
    }, [hasChartSymbol, removeEntryPriceLines]);

    useEffect(() => {
        if (!seriesRef.current || !chartReady) return;

        const series = seriesRef.current;
        removeEntryPriceLines(series);

        const nextLines = getPositionList(activeMT5AccountPositionsDetails)
            .filter((position) => getBaseSymbolName(position?.Symbol) === chartSymbol)
            .map((position) => {
                const price = getPositionEntryPrice(position);
                if (!price) return null;

                const typeLabel = getPositionType(position);
                const isSell = typeLabel === "Sell";
                return series.createPriceLine({
                    price,
                    color: isSell ? '#ef334e' : '#16a085',
                    lineWidth: 2,
                    lineStyle: LineStyle.Dashed,
                    axisLabelVisible: true,
                    title: `${typeLabel} Entry ${price}`,
                });
            })
            .filter(Boolean);

        entryPriceLinesRef.current = nextLines;

        return () => {
            nextLines.forEach((priceLine) => {
                try {
                    series.removePriceLine(priceLine);
                } catch {
                    // Ignore stale line removal after chart disposal.
                }
            });
            entryPriceLinesRef.current = entryPriceLinesRef.current.filter((priceLine) => !nextLines.includes(priceLine));
        };
    }, [activeMT5AccountPositionsDetails, chartReady, chartSymbol, removeEntryPriceLines]);

    useEffect(() => {
        if (!drawingStorageKey) {
            loadedDrawingKeyRef.current = null;
            skipNextDrawingPersistRef.current = true;
            setDrawings([]);
            setDraftDrawing(null);
            return;
        }

        let parsedDrawings = [];
        try {
            parsedDrawings = JSON.parse(localStorage.getItem(drawingStorageKey) || "[]");
        } catch {
            parsedDrawings = [];
        }

        loadedDrawingKeyRef.current = drawingStorageKey;
        skipNextDrawingPersistRef.current = true;
        setDrawings(Array.isArray(parsedDrawings) ? parsedDrawings : []);
        setDraftDrawing(null);
    }, [drawingStorageKey]);

    useEffect(() => {
        if (!drawingStorageKey || loadedDrawingKeyRef.current !== drawingStorageKey) return;

        if (skipNextDrawingPersistRef.current) {
            skipNextDrawingPersistRef.current = false;
            return;
        }

        localStorage.setItem(drawingStorageKey, JSON.stringify(drawings));
    }, [drawingStorageKey, drawings]);

    useEffect(() => {
        if (!chartReady || !chartRef.current) return undefined;

        const chart = chartRef.current;
        const timeScale = chart.timeScale();
        const redraw = () => setDrawingRenderVersion((value) => value + 1);

        timeScale.subscribeVisibleTimeRangeChange?.(redraw);
        timeScale.subscribeVisibleLogicalRangeChange?.(redraw);

        return () => {
            timeScale.unsubscribeVisibleTimeRangeChange?.(redraw);
            timeScale.unsubscribeVisibleLogicalRangeChange?.(redraw);
        };
    }, [chartReady]);

    useEffect(() => {
        if (!hasChartSymbol || chartReady || error) return;

        const timeoutId = setTimeout(() => {
            if (!chartRef.current) {
                setError("Chart did not initialize. Please refresh the terminal.");
            }
        }, 8000);

        return () => clearTimeout(timeoutId);
    }, [chartReady, hasChartSymbol, error]);

    // Apply settings changes dynamically in real time
    useEffect(() => {
        if (!chartRef.current || !seriesRef.current || !visualChartSettings) return;

        const chart = chartRef.current;
        const series = seriesRef.current;

        chart.applyOptions({
            layout: {
                background: { color: visualChartSettings.backgroundColor || '#ffffff' },
                textColor: visualChartSettings.textColor || '#344054',
            },
            grid: {
                vertLines: {
                    visible: visualChartSettings.showVertLines ?? true,
                    color: visualChartSettings.showVertLines ? (visualChartSettings.gridColor || 'rgba(15,23,42,0.08)') : 'transparent'
                },
                horzLines: {
                    visible: visualChartSettings.showHorzLines ?? true,
                    color: visualChartSettings.showHorzLines ? (visualChartSettings.gridColor || 'rgba(15,23,42,0.08)') : 'transparent'
                },
            }
        });

        series.applyOptions({
            upColor: visualChartSettings.upColor || '#16a085',
            downColor: visualChartSettings.downColor || '#ef334e',
            borderUpColor: visualChartSettings.upColor || '#16a085',
            borderDownColor: visualChartSettings.downColor || '#ef334e',
            wickUpColor: visualChartSettings.upColor || '#16a085',
            wickDownColor: visualChartSettings.downColor || '#ef334e',
        });
    }, [visualChartSettings]);

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
        if (!chartSymbol || !chartRequestSymbol || !token || !chartReady || !seriesRef.current) return;

        // Cancel any in-flight request
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;
        const requestId = requestIdRef.current + 1;
        requestIdRef.current = requestId;

        setLoading(true);
        setError(null);
        currentCandleRef.current = null;
        seriesRef.current.setData([]);

        const to = Math.floor(Date.now() / 1000);
        const from = to - activeTimeframe.range;
        const url = `${import.meta.env.VITE_BASE_URL}/user/analytics/chart`
            + `?symbol=${encodeURIComponent(chartRequestSymbol)}&from=${from}&to=${to}&period=${activeTimeframe.period}`;

        fetch(url, {
            headers: { Authorization: token },
            signal: controller.signal,
        })
            .then(r => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.json();
            })
            .then(res => {
                if (requestId !== requestIdRef.current) return;
                if (!res.status) throw new Error(res.message || 'Chart data unavailable');
                
                // Normalize, sort ascending, and deduplicate by time to prevent lightweight-charts sorting errors
                let candles = normalizeCandles(res.data);
                candles.sort((a, b) => a.time - b.time);
                candles = candles.filter((item, idx, arr) => idx === 0 || item.time !== arr[idx - 1].time);
                
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
                if (err.name !== 'AbortError' && requestId === requestIdRef.current) {
                    setError(err.message || 'Failed to load chart data');
                    setLoading(false);
                }
            });

        return () => {
            controller.abort();
            if (abortRef.current === controller) {
                abortRef.current = null;
            }
        };
    }, [chartSymbol, chartRequestSymbol, activeTimeframe, token, refreshKey, chartReady]);

    // Real-time last-candle updates from the quotes socket
    useEffect(() => {
        if (!quoteData?.length || !seriesRef.current || !chartSymbol || !currentCandleRef.current) return;

        const selectedNorm = getBaseSymbolName(chartSymbol);
        const tick = quoteData.find(q => getBaseSymbolName(q) === selectedNorm);
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

    const renderedDrawings = useMemo(() => {
        if (!chartReady || drawingRenderVersion < 0) return [];

        const allDrawings = draftDrawing ? [...drawings, draftDrawing] : drawings;
        return allDrawings
            .map((drawing) => {
                const base = {
                    ...drawing,
                    isDraft: draftDrawing?.id === drawing.id,
                };

                if (drawing.type === "horizontal") {
                    const y = seriesRef.current?.priceToCoordinate(drawing.price);
                    if (y === null || y === undefined) return null;
                    return { ...base, y };
                }

                if (drawing.type === "text") {
                    const point = getDrawingPointCoordinates(drawing.point);
                    if (!point) return null;
                    return { ...base, point };
                }

                if (drawing.type === "trendline" || drawing.type === "rectangle") {
                    const start = getDrawingPointCoordinates(drawing.points?.[0]);
                    const end = getDrawingPointCoordinates(drawing.points?.[1]);
                    if (!start || !end) return null;
                    return { ...base, start, end };
                }

                if (drawing.type === "pencil") {
                    const points = (drawing.points || [])
                        .map((point) => getDrawingPointCoordinates(point))
                        .filter(Boolean);
                    if (points.length < 2) return null;
                    return { ...base, points };
                }

                return null;
            })
            .filter(Boolean);
    }, [chartReady, drawings, draftDrawing, drawingRenderVersion, getDrawingPointCoordinates]);

    if (!chartSymbol) {
        return (
            <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: visualChartSettings.backgroundColor || '#ffffff' }}>
                <Typography sx={{ color: '#667085', fontSize: '14px' }}>Select a symbol to view the chart</Typography>
            </Box>
        );
    }

    const isInitializing = !chartReady && !error;

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', background: visualChartSettings.backgroundColor || '#ffffff' }}>
            {/* Toolbar */}
            <Box sx={{
                display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap',
                padding: '7px 12px', borderBottom: '1px solid #e6edf5',
                flexShrink: 0, background: '#ffffff',
            }}>
                <Typography sx={{ color: '#172033', fontWeight: 800, fontSize: '14px', mr: 1 }}>
                    {chartSymbol}
                </Typography>
                {TIMEFRAMES.map(tf => (
                    <Box
                        key={tf.label}
                        onClick={() => setActiveTimeframe(tf)}
                        sx={{
                            padding: '3px 9px', borderRadius: '4px', cursor: 'pointer',
                            fontSize: '11px', fontWeight: 600, userSelect: 'none',
                            color: activeTimeframe.label === tf.label ? '#fff' : '#667085',
                            background: activeTimeframe.label === tf.label
                                ? 'linear-gradient(135deg, #1f7ae0, #2563eb)'
                                : 'transparent',
                            border: `1px solid ${activeTimeframe.label === tf.label ? '#1f7ae0' : '#dfe7f1'}`,
                            transition: 'all 0.15s',
                            '&:hover': {
                                color: activeTimeframe.label === tf.label ? '#fff' : '#1f7ae0',
                                borderColor: '#1f7ae0',
                                background: activeTimeframe.label === tf.label
                                    ? 'linear-gradient(135deg, #1f7ae0, #2563eb)'
                                    : 'rgba(31,122,224,0.06)'
                            },
                        }}
                    >
                        {tf.label}
                    </Box>
                ))}
                <Box sx={{
                    width: "1px",
                    height: "20px",
                    background: "#dfe7f1",
                    mx: "6px",
                }} />
                {DRAWING_TOOLS.map((tool) => (
                    <Tooltip key={tool.id} title={tool.id === "select" ? "Use chart normally" : `Draw ${tool.label}`}>
                        <Box
                            onClick={() => {
                                setDraftDrawing(null);
                                setActiveDrawingTool(tool.id);
                            }}
                            sx={{
                                padding: "3px 9px",
                                borderRadius: "999px",
                                cursor: "pointer",
                                fontSize: "11px",
                                fontWeight: 800,
                                userSelect: "none",
                                color: activeDrawingTool === tool.id ? "#fff" : "#44546a",
                                background: activeDrawingTool === tool.id
                                    ? "linear-gradient(135deg, #0f766e, #1f7ae0)"
                                    : "#f4f7fb",
                                border: `1px solid ${activeDrawingTool === tool.id ? "#0f766e" : "#dfe7f1"}`,
                                boxShadow: activeDrawingTool === tool.id ? "0 6px 14px rgba(31,122,224,0.18)" : "none",
                                transition: "all 0.15s",
                                "&:hover": {
                                    borderColor: "#1f7ae0",
                                    color: activeDrawingTool === tool.id ? "#fff" : "#1f7ae0",
                                },
                            }}
                        >
                            {tool.label}
                        </Box>
                    </Tooltip>
                ))}
                <Tooltip title="Drawing color">
                    <Box
                        component="input"
                        type="color"
                        value={drawingColor}
                        onChange={(event) => setDrawingColor(event.target.value)}
                        sx={{
                            width: "24px",
                            height: "24px",
                            border: "1px solid #dfe7f1",
                            borderRadius: "8px",
                            p: "2px",
                            cursor: "pointer",
                            background: "#fff",
                        }}
                    />
                </Tooltip>
                <Tooltip title="Undo last drawing">
                    <Box
                        onClick={handleUndoDrawing}
                        sx={{
                            padding: "3px 9px",
                            borderRadius: "999px",
                            cursor: drawings.length ? "pointer" : "not-allowed",
                            fontSize: "11px",
                            fontWeight: 800,
                            color: drawings.length ? "#667085" : "#a8b2c1",
                            background: "#f4f7fb",
                            border: "1px solid #dfe7f1",
                            opacity: drawings.length ? 1 : 0.55,
                            "&:hover": drawings.length ? { color: "#1f7ae0", borderColor: "#1f7ae0" } : {},
                        }}
                    >
                        Undo
                    </Box>
                </Tooltip>
                <Tooltip title="Clear all drawings for this symbol">
                    <Box
                        onClick={handleClearDrawings}
                        sx={{
                            padding: "3px 9px",
                            borderRadius: "999px",
                            cursor: drawings.length ? "pointer" : "not-allowed",
                            fontSize: "11px",
                            fontWeight: 800,
                            color: drawings.length ? "#ef334e" : "#a8b2c1",
                            background: drawings.length ? "rgba(239,51,78,0.06)" : "#f4f7fb",
                            border: `1px solid ${drawings.length ? "rgba(239,51,78,0.22)" : "#dfe7f1"}`,
                            opacity: drawings.length ? 1 : 0.55,
                            "&:hover": drawings.length ? { background: "rgba(239,51,78,0.1)" } : {},
                        }}
                    >
                        Clear
                    </Box>
                </Tooltip>
            </Box>

            {/* Chart area */}
            <Box sx={{ flex: 1, position: 'relative', minHeight: 0, width: '100%', height: '100%' }}>
                <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden' }} />
                <Box
                    ref={drawingOverlayRef}
                    onPointerDown={handleDrawingPointerDown}
                    onPointerMove={handleDrawingPointerMove}
                    onPointerUp={handleDrawingPointerUp}
                    onPointerCancel={() => setDraftDrawing(null)}
                    sx={{
                        position: "absolute",
                        inset: 0,
                        zIndex: 2,
                        cursor: activeDrawingTool === "select" ? "default" : "crosshair",
                        pointerEvents: activeDrawingTool === "select" ? "none" : "auto",
                        touchAction: activeDrawingTool === "select" ? "auto" : "none",
                    }}
                />
                <svg
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        zIndex: 3,
                        overflow: "hidden",
                        pointerEvents: "none",
                    }}
                >
                    {renderedDrawings.map((drawing) => {
                        const stroke = drawing.color || "#1f7ae0";
                        const dash = drawing.isDraft ? "7 5" : undefined;

                        if (drawing.type === "horizontal") {
                            return (
                                <g key={drawing.id}>
                                    <line
                                        x1="0"
                                        x2="100%"
                                        y1={drawing.y}
                                        y2={drawing.y}
                                        stroke={stroke}
                                        strokeWidth="2"
                                        strokeDasharray={dash}
                                    />
                                    <text
                                        x="10"
                                        y={drawing.y - 6}
                                        fill={stroke}
                                        fontSize="11"
                                        fontWeight="700"
                                    >
                                        {Number(drawing.price).toFixed(2)}
                                    </text>
                                </g>
                            );
                        }

                        if (drawing.type === "trendline") {
                            return (
                                <line
                                    key={drawing.id}
                                    x1={drawing.start.x}
                                    y1={drawing.start.y}
                                    x2={drawing.end.x}
                                    y2={drawing.end.y}
                                    stroke={stroke}
                                    strokeWidth="2.4"
                                    strokeLinecap="round"
                                    strokeDasharray={dash}
                                />
                            );
                        }

                        if (drawing.type === "pencil") {
                            return (
                                <polyline
                                    key={drawing.id}
                                    points={drawing.points.map((point) => `${point.x},${point.y}`).join(" ")}
                                    fill="none"
                                    stroke={stroke}
                                    strokeWidth="2.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeDasharray={dash}
                                />
                            );
                        }

                        if (drawing.type === "rectangle") {
                            const x = Math.min(drawing.start.x, drawing.end.x);
                            const y = Math.min(drawing.start.y, drawing.end.y);
                            const width = Math.abs(drawing.end.x - drawing.start.x);
                            const height = Math.abs(drawing.end.y - drawing.start.y);
                            return (
                                <rect
                                    key={drawing.id}
                                    x={x}
                                    y={y}
                                    width={width}
                                    height={height}
                                    rx="4"
                                    fill={colorWithAlpha(stroke, 0.12)}
                                    stroke={stroke}
                                    strokeWidth="2"
                                    strokeDasharray={dash}
                                />
                            );
                        }

                        if (drawing.type === "text") {
                            return (
                                <g key={drawing.id}>
                                    <rect
                                        x={drawing.point.x - 6}
                                        y={drawing.point.y - 18}
                                        width={Math.max(42, String(drawing.text).length * 7 + 14)}
                                        height="24"
                                        rx="7"
                                        fill={colorWithAlpha(stroke, 0.12)}
                                        stroke={colorWithAlpha(stroke, 0.28)}
                                    />
                                    <text
                                        x={drawing.point.x}
                                        y={drawing.point.y - 2}
                                        fill={stroke}
                                        fontSize="12"
                                        fontWeight="800"
                                    >
                                        {drawing.text}
                                    </text>
                                </g>
                            );
                        }

                        return null;
                    })}
                </svg>

                {(loading || isInitializing) && (
                    <Box sx={{
                        position: 'absolute', inset: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(248,251,255,0.72)', pointerEvents: 'none',
                    }}>
                        <CircularProgress size={28} sx={{ color: '#1f7ae0' }} />
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
