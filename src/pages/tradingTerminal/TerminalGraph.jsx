import { useCallback, useEffect, useMemo, useRef, useState, memo } from 'react';
import { useSelector } from 'react-redux';
import { createChart, BarSeries, CandlestickSeries, LineSeries, LineStyle, LineType } from 'lightweight-charts';
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

const HISTORY_LEFT_LOAD_THRESHOLD_BARS = 35;
const HISTORY_FETCH_THROTTLE_MS = 750;
const HISTORY_MAX_CHUNK_RANGE = 365 * 24 * 60 * 60;
const INITIAL_FAST_LOAD_BARS = 240;
const HISTORY_CACHE_TTL_MS = 5 * 60 * 1000;
const HISTORY_CACHE_MAX_ENTRIES = 48;
const GRAPH_TYPE_STORAGE_KEY = 'terminalGraphType';
const DEFAULT_GRAPH_TYPE = 'candles';

const GRAPH_TYPES = [
    { id: 'bars', label: 'Bars' },
    { id: 'candles', label: 'Candles' },
    { id: 'hollow-candles', label: 'Hollow Candles' },
    { id: 'line', label: 'Line' },
    { id: 'line-markers', label: 'Line with Markers' },
    { id: 'step-line', label: 'Step Line' },
];

const terminalHistoryCache = new Map();
const graphTypeOptionsById = new Map(GRAPH_TYPES.map((option) => [option.id, option]));

function readStoredGraphType() {
    if (typeof window === 'undefined') return DEFAULT_GRAPH_TYPE;

    const storedGraphType = window.localStorage.getItem(GRAPH_TYPE_STORAGE_KEY);
    const graphTypeOption = graphTypeOptionsById.get(storedGraphType);
    if (!graphTypeOption || graphTypeOption.disabled) return DEFAULT_GRAPH_TYPE;
    return graphTypeOption.id;
}

function getSeriesPalette(settings) {
    return {
        upColor: settings?.upColor || '#16a085',
        downColor: settings?.downColor || '#ef334e',
    };
}

function getSeriesDefinitionForGraphType(graphType) {
    switch (graphType) {
        case 'bars':
            return BarSeries;
        case 'line':
        case 'line-markers':
        case 'step-line':
            return LineSeries;
        case 'hollow-candles':
        case 'candles':
        default:
            return CandlestickSeries;
    }
}

function getSeriesOptionsForGraphType(graphType, settings) {
    const { upColor, downColor } = getSeriesPalette(settings);

    switch (graphType) {
        case 'bars':
            return {
                upColor,
                downColor,
                openVisible: true,
                thinBars: false,
            };
        case 'hollow-candles':
            return {
                upColor: 'rgba(0, 0, 0, 0)',
                downColor,
                borderVisible: true,
                borderUpColor: upColor,
                borderDownColor: downColor,
                wickUpColor: upColor,
                wickDownColor: downColor,
            };
        case 'line':
            return {
                color: upColor,
                lineWidth: 2,
                lineType: LineType.Simple,
                pointMarkersVisible: false,
                crosshairMarkerVisible: true,
            };
        case 'line-markers':
            return {
                color: upColor,
                lineWidth: 2,
                lineType: LineType.Simple,
                pointMarkersVisible: true,
                pointMarkersRadius: 3,
                crosshairMarkerVisible: true,
            };
        case 'step-line':
            return {
                color: upColor,
                lineWidth: 2,
                lineType: LineType.WithSteps,
                pointMarkersVisible: false,
                crosshairMarkerVisible: true,
            };
        case 'candles':
        default:
            return {
                upColor,
                downColor,
                borderUpColor: upColor,
                borderDownColor: downColor,
                wickUpColor: upColor,
                wickDownColor: downColor,
            };
    }
}

function toSeriesDataPoint(candle, graphType) {
    const normalizedCandle = toChartCandle(candle);
    if (!normalizedCandle) return null;

    switch (graphType) {
        case 'line':
        case 'line-markers':
        case 'step-line':
            return {
                time: normalizedCandle.time,
                value: normalizedCandle.close,
            };
        case 'bars':
        case 'hollow-candles':
        case 'candles':
        default:
            return normalizedCandle;
    }
}

function toSeriesData(candles, graphType) {
    return candles
        .map((candle) => toSeriesDataPoint(candle, graphType))
        .filter(Boolean);
}

function buildHistoryCacheKey(symbol, timeframe) {
    if (!symbol || !timeframe) return "";
    return [
        symbol,
        timeframe.label,
        timeframe.period,
        timeframe.candleSec,
        timeframe.range,
    ].join("|");
}

function readHistoryCache(cacheKey) {
    if (!cacheKey) return null;

    const cachedEntry = terminalHistoryCache.get(cacheKey);
    if (!cachedEntry) return null;

    if ((Date.now() - cachedEntry.updatedAt) > HISTORY_CACHE_TTL_MS) {
        terminalHistoryCache.delete(cacheKey);
        return null;
    }

    return cachedEntry;
}

function writeHistoryCache(cacheKey, candles) {
    if (!cacheKey || !Array.isArray(candles) || candles.length === 0) return;

    terminalHistoryCache.set(cacheKey, {
        candles,
        updatedAt: Date.now(),
    });

    if (terminalHistoryCache.size <= HISTORY_CACHE_MAX_ENTRIES) return;

    const oldestKey = terminalHistoryCache.keys().next().value;
    if (oldestKey) {
        terminalHistoryCache.delete(oldestKey);
    }
}

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

function toChartCandle(candle) {
    const time = Number(candle?.time);
    const open = Number(candle?.open);
    const high = Number(candle?.high);
    const low = Number(candle?.low);
    const close = Number(candle?.close);

    if (![time, open, high, low, close].every(Number.isFinite)) return null;
    if (time <= 0 || open <= 0 || high <= 0 || low <= 0 || close <= 0) return null;

    return {
        time,
        open,
        high: Math.max(high, open, close),
        low: Math.min(low, open, close),
        close,
    };
}

function mergeCandles(...groups) {
    const candlesByTime = new Map();

    groups.flat().forEach((candle) => {
        const normalized = toChartCandle(candle);
        if (normalized) {
            candlesByTime.set(normalized.time, normalized);
        }
    });

    return Array.from(candlesByTime.values()).sort((a, b) => a.time - b.time);
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
    const chartCandlesRef = useRef([]);
    const seriesGraphTypeRef = useRef(DEFAULT_GRAPH_TYPE);
    const abortRef = useRef(null);
    const historyAbortRef = useRef(null);
    const requestIdRef = useRef(0);
    const historyRequestIdRef = useRef(0);
    const historyCursorRef = useRef(null);
    const lastHistoryFetchAtRef = useRef(0);
    const noMoreHistoryRef = useRef(false);
    const suppressHistoryLoadUntilRef = useRef(0);
    const loadedDrawingKeyRef = useRef(null);
    const skipNextDrawingPersistRef = useRef(false);
    const chartSettingsRef = useRef(visualChartSettings);
    chartSettingsRef.current = visualChartSettings;

    const [activeTimeframe, setActiveTimeframe] = useState(TIMEFRAMES[1]); // 5M default
    const [activeGraphType, setActiveGraphType] = useState(readStoredGraphType);
    const [loading, setLoading] = useState(false);
    const [loadingOlder, setLoadingOlder] = useState(false);
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
    const chartHistoryCacheKey = useMemo(
        () => buildHistoryCacheKey(chartRequestSymbol, activeTimeframe),
        [activeTimeframe, chartRequestSymbol]
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

    const createMainSeries = useCallback((chart, graphType) => (
        chart.addSeries(
            getSeriesDefinitionForGraphType(graphType),
            getSeriesOptionsForGraphType(graphType, chartSettingsRef.current)
        )
    ), []);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        window.localStorage.setItem(GRAPH_TYPE_STORAGE_KEY, activeGraphType);
    }, [activeGraphType]);

    const fetchChartCandles = useCallback(async ({ symbol, from, to, period, signal }) => {
        const url = `${import.meta.env.VITE_BASE_URL}/user/analytics/chart`
            + `?symbol=${encodeURIComponent(symbol)}&from=${from}&to=${to}&period=${period}`;

        const response = await fetch(url, {
            headers: { Authorization: token },
            signal,
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const result = await response.json();
        if (!result.status) throw new Error(result.message || 'Chart data unavailable');

        return mergeCandles(normalizeCandles(result.data));
    }, [token]);

    const applyChartCandles = useCallback((candles, {
        historyCursor = null,
        fitContent = false,
        preserveVisibleRange = false,
    } = {}) => {
        const chart = chartRef.current;
        const series = seriesRef.current;
        if (!series) return [];

        const nextCandles = mergeCandles(candles);
        const visibleTimeRange = preserveVisibleRange
            ? chart?.timeScale().getVisibleRange?.()
            : null;

        chartCandlesRef.current = nextCandles;
        currentCandleRef.current = nextCandles[nextCandles.length - 1] || null;
        historyCursorRef.current = historyCursor ?? nextCandles[0]?.time ?? null;

        series.setData(toSeriesData(nextCandles, seriesGraphTypeRef.current || activeGraphType));
        setDrawingRenderVersion((value) => value + 1);

        if (
            visibleTimeRange?.from !== undefined
            && visibleTimeRange?.to !== undefined
        ) {
            suppressHistoryLoadUntilRef.current = Date.now() + 250;
            requestAnimationFrame(() => {
                chartRef.current?.timeScale().setVisibleRange(visibleTimeRange);
            });
        } else if (fitContent && nextCandles.length > 0) {
            requestAnimationFrame(() => {
                suppressHistoryLoadUntilRef.current = Date.now() + 800;
                chartRef.current?.timeScale().fitContent();
            });
        }

        return nextCandles;
    }, [activeGraphType]);

    const loadOlderHistory = useCallback(async () => {
        if (
            !chartSymbol ||
            !chartRequestSymbol ||
            !token ||
            !chartReady ||
            loading ||
            historyAbortRef.current ||
            noMoreHistoryRef.current ||
            Date.now() < suppressHistoryLoadUntilRef.current
        ) {
            return;
        }

        const series = seriesRef.current;
        const chart = chartRef.current;
        const loadedCandles = chartCandlesRef.current;
        if (!series || !chart || loadedCandles.length === 0) return;

        const now = Date.now();
        if (now - lastHistoryFetchAtRef.current < HISTORY_FETCH_THROTTLE_MS) return;
        lastHistoryFetchAtRef.current = now;

        const cursor = historyCursorRef.current ?? loadedCandles[0].time;
        const chunkRange = Math.min(activeTimeframe.range, HISTORY_MAX_CHUNK_RANGE);
        const from = Math.max(0, cursor - chunkRange);
        const to = cursor - activeTimeframe.candleSec;

        if (to <= 0 || from >= to) {
            noMoreHistoryRef.current = true;
            return;
        }

        const controller = new AbortController();
        const requestId = historyRequestIdRef.current + 1;
        const visibleTimeRange = chart.timeScale().getVisibleRange?.();
        historyRequestIdRef.current = requestId;
        historyAbortRef.current = controller;
        setLoadingOlder(true);

        try {
            const olderCandles = await fetchChartCandles({
                symbol: chartRequestSymbol,
                from,
                to,
                period: activeTimeframe.period,
                signal: controller.signal,
            });

            if (requestId !== historyRequestIdRef.current || controller.signal.aborted) return;

            historyCursorRef.current = from;
            const existingCandles = chartCandlesRef.current;
            const mergedCandles = mergeCandles(olderCandles, existingCandles);
            const addedOlderCandles = mergedCandles.length > existingCandles.length;

            if (addedOlderCandles) {
                applyChartCandles(mergedCandles, {
                    historyCursor: from,
                    preserveVisibleRange: Boolean(
                        visibleTimeRange?.from !== undefined
                        && visibleTimeRange?.to !== undefined
                    ),
                });
                writeHistoryCache(chartHistoryCacheKey, mergedCandles);
            } else if (from === 0) {
                noMoreHistoryRef.current = true;
            }
        } catch (err) {
            if (err?.name !== 'AbortError') {
                historyCursorRef.current = from;
                if (from === 0) noMoreHistoryRef.current = true;
            }
        } finally {
            if (requestId === historyRequestIdRef.current) {
                setLoadingOlder(false);
                if (historyAbortRef.current === controller) {
                    historyAbortRef.current = null;
                }
            }
        }
    }, [
        activeTimeframe.candleSec,
        activeTimeframe.period,
        activeTimeframe.range,
        chartReady,
        chartRequestSymbol,
        chartSymbol,
        fetchChartCandles,
        loading,
        token,
        applyChartCandles,
        chartHistoryCacheKey,
    ]);

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

                const series = createMainSeries(chart, activeGraphType);

                chartRef.current = chart;
                seriesRef.current = series;
                seriesGraphTypeRef.current = activeGraphType;

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
    }, [createMainSeries, hasChartSymbol, removeEntryPriceLines]);

    useEffect(() => {
        if (!chartReady || !chartRef.current || !seriesRef.current) return;
        if (seriesGraphTypeRef.current === activeGraphType) return;

        const chart = chartRef.current;
        const previousSeries = seriesRef.current;
        const visibleTimeRange = chart.timeScale().getVisibleRange?.();

        removeEntryPriceLines(previousSeries);

        try {
            chart.removeSeries(previousSeries);
        } catch {
            // Ignore stale series removal during rapid symbol switches.
        }

        const nextSeries = createMainSeries(chart, activeGraphType);
        seriesRef.current = nextSeries;
        seriesGraphTypeRef.current = activeGraphType;

        const loadedCandles = chartCandlesRef.current;
        if (loadedCandles.length > 0) {
            nextSeries.setData(toSeriesData(loadedCandles, activeGraphType));
        }

        if (
            visibleTimeRange?.from !== undefined
            && visibleTimeRange?.to !== undefined
        ) {
            requestAnimationFrame(() => {
                chartRef.current?.timeScale().setVisibleRange(visibleTimeRange);
            });
        }

        setDrawingRenderVersion((value) => value + 1);
    }, [activeGraphType, chartReady, createMainSeries, removeEntryPriceLines]);

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
    }, [activeGraphType, activeMT5AccountPositionsDetails, chartReady, chartSymbol, removeEntryPriceLines]);

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
        const handleLogicalRangeChange = (logicalRange) => {
            redraw();

            if (!logicalRange) return;
            const barsInfo = seriesRef.current?.barsInLogicalRange?.(logicalRange);
            const barsBefore = Number.isFinite(Number(barsInfo?.barsBefore))
                ? Number(barsInfo.barsBefore)
                : Number(logicalRange.from);

            if (Number.isFinite(barsBefore) && barsBefore < HISTORY_LEFT_LOAD_THRESHOLD_BARS) {
                loadOlderHistory();
            }
        };

        timeScale.subscribeVisibleTimeRangeChange?.(redraw);
        timeScale.subscribeVisibleLogicalRangeChange?.(handleLogicalRangeChange);

        return () => {
            timeScale.unsubscribeVisibleTimeRangeChange?.(redraw);
            timeScale.unsubscribeVisibleLogicalRangeChange?.(handleLogicalRangeChange);
        };
    }, [chartReady, loadOlderHistory]);

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

        series.applyOptions(getSeriesOptionsForGraphType(activeGraphType, visualChartSettings));
    }, [activeGraphType, visualChartSettings]);

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
                suppressHistoryLoadUntilRef.current = Date.now() + 800;
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

        abortRef.current?.abort();
        historyAbortRef.current?.abort();
        historyAbortRef.current = null;

        const controller = new AbortController();
        abortRef.current = controller;
        const requestId = requestIdRef.current + 1;
        requestIdRef.current = requestId;
        historyRequestIdRef.current += 1;
        const chart = chartRef.current;
        const cachedHistory = readHistoryCache(chartHistoryCacheKey);
        const hasCachedHistory = Array.isArray(cachedHistory?.candles) && cachedHistory.candles.length > 0;

        setLoading(!hasCachedHistory);
        setLoadingOlder(false);
        setError(null);
        currentCandleRef.current = null;
        historyCursorRef.current = null;
        noMoreHistoryRef.current = false;
        suppressHistoryLoadUntilRef.current = Date.now() + 800;
        lastHistoryFetchAtRef.current = 0;

        if (hasCachedHistory) {
            applyChartCandles(cachedHistory.candles, {
                historyCursor: cachedHistory.candles[0]?.time ?? null,
                fitContent: true,
            });
        } else {
            chartCandlesRef.current = [];
            seriesRef.current.setData([]);
        }

        const to = Math.floor(Date.now() / 1000);
        const fullFrom = to - activeTimeframe.range;
        const initialLoadRange = Math.min(
            activeTimeframe.range,
            activeTimeframe.candleSec * INITIAL_FAST_LOAD_BARS
        );
        const initialFrom = Math.max(fullFrom, to - initialLoadRange);

        const loadSymbolHistory = async () => {
            try {
                const initialCandles = await fetchChartCandles({
                    symbol: chartRequestSymbol,
                    from: initialFrom,
                    to,
                    period: activeTimeframe.period,
                    signal: controller.signal,
                });

                if (requestId !== requestIdRef.current || controller.signal.aborted) return;

                const visibleTimeRange = hasCachedHistory
                    ? chart?.timeScale().getVisibleRange?.()
                    : null;
                const seededCandles = hasCachedHistory
                    ? mergeCandles(cachedHistory.candles, initialCandles)
                    : initialCandles;

                applyChartCandles(seededCandles, {
                    historyCursor: seededCandles[0]?.time ?? initialFrom,
                    fitContent: !hasCachedHistory,
                    preserveVisibleRange: Boolean(
                        hasCachedHistory
                        && visibleTimeRange?.from !== undefined
                        && visibleTimeRange?.to !== undefined
                    ),
                });
                writeHistoryCache(chartHistoryCacheKey, seededCandles);
                setLoading(false);

                if (!seededCandles.length) {
                    setError(`No chart data for ${chartSymbol} in this period`);
                    return;
                }

                if (initialFrom <= fullFrom) {
                    historyCursorRef.current = seededCandles[0]?.time ?? fullFrom;
                    return;
                }

                const backfillRequestId = historyRequestIdRef.current + 1;
                historyRequestIdRef.current = backfillRequestId;
                historyAbortRef.current = controller;
                setLoadingOlder(true);

                const olderCandles = await fetchChartCandles({
                    symbol: chartRequestSymbol,
                    from: fullFrom,
                    to: initialFrom - activeTimeframe.candleSec,
                    period: activeTimeframe.period,
                    signal: controller.signal,
                });

                if (
                    requestId !== requestIdRef.current
                    || backfillRequestId !== historyRequestIdRef.current
                    || controller.signal.aborted
                ) {
                    return;
                }

                const mergedCandles = mergeCandles(olderCandles, seededCandles);
                applyChartCandles(mergedCandles, {
                    historyCursor: fullFrom,
                    preserveVisibleRange: true,
                });
                writeHistoryCache(chartHistoryCacheKey, mergedCandles);
            } catch (err) {
                if (err?.name !== 'AbortError' && requestId === requestIdRef.current) {
                    setError(err?.message || 'Failed to load chart data');
                    setLoading(false);
                }
            } finally {
                if (historyAbortRef.current === controller) {
                    historyAbortRef.current = null;
                }
                if (requestId === requestIdRef.current && !controller.signal.aborted) {
                    setLoadingOlder(false);
                }
            }
        };

        loadSymbolHistory();

        return () => {
            controller.abort();
            historyRequestIdRef.current += 1;
            historyAbortRef.current?.abort();
            historyAbortRef.current = null;
            if (abortRef.current === controller) {
                abortRef.current = null;
            }
        };
    }, [
        chartSymbol,
        chartRequestSymbol,
        activeTimeframe,
        token,
        refreshKey,
        chartReady,
        fetchChartCandles,
        applyChartCandles,
        chartHistoryCacheKey,
    ]);

    // Real-time last-candle updates from the quotes socket
    useEffect(() => {
        if (!quoteData?.length || !seriesRef.current || !chartSymbol || !currentCandleRef.current) return;

        const selectedNorm = getBaseSymbolName(chartSymbol);
        const tick = quoteData.find(q => getBaseSymbolName(q) === selectedNorm);
        if (!tick) return;

        // Match the live candle to the same quote basis the platform exposes.
        // MT5-style charts are typically bid-based, while the sidebar shows both.
        const bidPrice = parseFiniteNumber(tick?.Bid);
        const askPrice = parseFiniteNumber(tick?.Ask);
        const price = bidPrice ?? askPrice;
        if (price === null) return;

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
            chartCandlesRef.current = mergeCandles(chartCandlesRef.current, [updated]);
            const seriesPoint = toSeriesDataPoint(updated, seriesGraphTypeRef.current || activeGraphType);
            if (seriesPoint) {
                seriesRef.current.update(seriesPoint);
            }
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
            chartCandlesRef.current = mergeCandles(chartCandlesRef.current, [newCandle]);
            const seriesPoint = toSeriesDataPoint(newCandle, seriesGraphTypeRef.current || activeGraphType);
            if (seriesPoint) {
                seriesRef.current.update(seriesPoint);
            }
        }
    }, [quoteData, chartSymbol, activeGraphType, activeTimeframe.candleSec]);

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
                display: 'flex', alignItems: 'center', columnGap: '4px', rowGap: '6px', flexWrap: 'wrap',
                padding: { xs: '8px 10px', sm: '7px 12px' }, borderBottom: '1px solid #e6edf5',
                flexShrink: 0, background: '#ffffff',
            }}>
                <Typography sx={{ color: '#172033', fontWeight: 800, fontSize: { xs: '13px', sm: '14px' }, mr: { xs: 0, sm: 1 }, width: { xs: '100%', sm: 'auto' } }}>
                    {chartSymbol}
                </Typography>
                {TIMEFRAMES.map(tf => (
                    <Box
                        key={tf.label}
                        onClick={() => setActiveTimeframe(tf)}
                        sx={{
                            padding: { xs: '3px 8px', sm: '3px 9px' }, borderRadius: '4px', cursor: 'pointer',
                            fontSize: { xs: '10px', sm: '11px' }, fontWeight: 600, userSelect: 'none',
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
                <Tooltip title="Switch chart style.">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'space-between', sm: 'flex-start' }, gap: '6px', ml: { xs: 0, sm: '4px' }, width: { xs: '100%', sm: 'auto' } }}>
                        <Typography sx={{ color: '#667085', fontSize: '11px', fontWeight: 700, letterSpacing: '0.04em' }}>
                            Style
                        </Typography>
                        <Box
                            component="select"
                            aria-label="Select chart style"
                            value={activeGraphType}
                            onChange={(event) => setActiveGraphType(event.target.value)}
                            sx={{
                                minWidth: { xs: '0', sm: '154px' },
                                width: { xs: '100%', sm: 'auto' },
                                height: '28px',
                                px: '10px',
                                borderRadius: '999px',
                                border: '1px solid #dfe7f1',
                                background: '#f8fbff',
                                color: '#172033',
                                fontSize: '11px',
                                fontWeight: 700,
                                outline: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.15s',
                                '&:hover': {
                                    borderColor: '#1f7ae0',
                                    background: 'rgba(31,122,224,0.04)',
                                },
                                '&:focus': {
                                    borderColor: '#1f7ae0',
                                    boxShadow: '0 0 0 3px rgba(31,122,224,0.12)',
                                },
                            }}
                        >
                            {GRAPH_TYPES.map((graphTypeOption) => (
                                <option
                                    key={graphTypeOption.id}
                                    value={graphTypeOption.id}
                                    disabled={graphTypeOption.disabled}
                                >
                                    {graphTypeOption.label}
                                </option>
                            ))}
                        </Box>
                    </Box>
                </Tooltip>
                <Box sx={{
                    width: "1px",
                    height: "20px",
                    background: "#dfe7f1",
                    mx: "6px",
                    display: { xs: "none", sm: "block" },
                }} />
                {DRAWING_TOOLS.map((tool) => (
                    <Tooltip key={tool.id} title={tool.id === "select" ? "Use chart normally" : `Draw ${tool.label}`}>
                        <Box
                            onClick={() => {
                                setDraftDrawing(null);
                                setActiveDrawingTool(tool.id);
                            }}
                            sx={{
                                padding: { xs: "3px 8px", sm: "3px 9px" },
                                borderRadius: "999px",
                                cursor: "pointer",
                                fontSize: { xs: "10px", sm: "11px" },
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
                            padding: { xs: "3px 8px", sm: "3px 9px" },
                            borderRadius: "999px",
                            cursor: drawings.length ? "pointer" : "not-allowed",
                            fontSize: { xs: "10px", sm: "11px" },
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
                            padding: { xs: "3px 8px", sm: "3px 9px" },
                            borderRadius: "999px",
                            cursor: drawings.length ? "pointer" : "not-allowed",
                            fontSize: { xs: "10px", sm: "11px" },
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

                {loadingOlder && !loading && (
                    <Box sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        zIndex: 4,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        px: '10px',
                        py: '6px',
                        borderRadius: '999px',
                        background: 'rgba(255,255,255,0.92)',
                        border: '1px solid #dfe7f1',
                        boxShadow: '0 10px 24px rgba(15,23,42,0.12)',
                        pointerEvents: 'none',
                    }}>
                        <CircularProgress size={14} sx={{ color: '#1f7ae0' }} />
                        <Typography sx={{ color: '#344054', fontSize: '11px', fontWeight: 800 }}>
                            Loading older candles
                        </Typography>
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
