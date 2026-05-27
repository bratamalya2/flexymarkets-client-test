import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    Skeleton,
    Stack,
    Typography
} from "@mui/material";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import CandlestickChartIcon from "@mui/icons-material/CandlestickChart";
import TimelineIcon from "@mui/icons-material/Timeline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useSelector } from "react-redux";
import { useQuotes } from "../../context/QuotesContext";
import {
    ANALYSIS_TIMEFRAMES,
    computeTechnicalAnalysis,
    normalizeAnalysisCandles
} from "./technicalAnalysisUtils";

const getRawSymbolName = (symbol) => {
    const rawSymbol = symbol?.groupedSym ?? symbol?.Symbol ?? symbol?.name ?? symbol;
    return rawSymbol ? String(rawSymbol).trim() : "";
};

const getBaseSymbolName = (symbol) => {
    const rawSymbol = getRawSymbolName(symbol);
    return rawSymbol ? rawSymbol.split(".")[0].toUpperCase() : "";
};

const getToneColor = (tone) => {
    if (tone === "bullish") {
        return {
            color: "#22c55e",
            background: "rgba(34, 197, 94, 0.12)",
            border: "rgba(34, 197, 94, 0.28)"
        };
    }

    if (tone === "bearish") {
        return {
            color: "#ef4444",
            background: "rgba(239, 68, 68, 0.12)",
            border: "rgba(239, 68, 68, 0.28)"
        };
    }

    return {
        color: "#f59e0b",
        background: "rgba(245, 158, 11, 0.12)",
        border: "rgba(245, 158, 11, 0.28)"
    };
};

const getPatternTone = (signal) => {
    if (signal === "Bullish") return "bullish";
    if (signal === "Bearish") return "bearish";
    return "neutral";
};

const formatDateTime = (timestamp) => {
    if (!timestamp) return "-";
    return new Date(timestamp * 1000).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });
};

function SignalChip({ label, tone }) {
    const palette = getToneColor(tone);

    return (
        <Chip
            label={label}
            size="small"
            sx={{
                height: "22px",
                color: palette.color,
                background: palette.background,
                border: `1px solid ${palette.border}`,
                fontSize: "10px",
                fontWeight: 900,
                letterSpacing: "0.35px",
                textTransform: "uppercase",
                borderRadius: "999px"
            }}
        />
    );
}

SignalChip.propTypes = {
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    tone: PropTypes.oneOf(["bullish", "bearish", "neutral"]).isRequired,
};

function IndicatorRow({ item }) {
    const palette = getToneColor(item.tone);

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr auto" },
                gap: "10px",
                alignItems: "center",
                p: "10px 12px",
                borderRadius: "12px",
                background: "rgba(15, 19, 30, 0.72)",
                border: `1px solid ${palette.border}`,
                transition: "all 0.2s ease",
                "&:hover": {
                    transform: "translateY(-1px)",
                    background: "rgba(15, 19, 30, 0.92)"
                }
            }}
        >
            <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ color: "white", fontSize: "13px", fontWeight: 800 }}>
                    {item.name}
                </Typography>
                <Typography sx={{ color: "#8f9bb2", fontSize: "11px", mt: "2px" }}>
                    {item.description}
                </Typography>
            </Box>
            <Typography
                sx={{
                    color: "#dbe7f7",
                    fontSize: "12px",
                    fontWeight: 800,
                    fontFamily: "'Roboto Mono', monospace",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                }}
            >
                {item.value}
            </Typography>
            <SignalChip label={item.signal} tone={item.tone} />
        </Box>
    );
}

IndicatorRow.propTypes = {
    item: PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        signal: PropTypes.string.isRequired,
        tone: PropTypes.oneOf(["bullish", "bearish", "neutral"]).isRequired,
    }).isRequired,
};

function AnalysisGroup({ group }) {
    if (!group.items.length) return null;

    return (
        <Box
            sx={{
                p: "14px",
                borderRadius: "18px",
                background: "linear-gradient(180deg, rgba(18, 24, 38, 0.94), rgba(10, 14, 23, 0.94))",
                border: "1px solid rgba(76, 175, 80, 0.15)",
                boxShadow: "0 14px 34px rgba(0, 0, 0, 0.22)"
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: "12px", gap: "10px" }}>
                <Typography sx={{ color: "#e6f2ff", fontSize: "15px", fontWeight: 900 }}>
                    {group.name}
                </Typography>
                <Chip
                    label={`${group.items.length} indicators`}
                    size="small"
                    sx={{
                        height: "22px",
                        color: "#4CAF50",
                        background: "rgba(76, 175, 80, 0.12)",
                        fontSize: "10px",
                        fontWeight: 800,
                        border: "1px solid rgba(76, 175, 80, 0.24)"
                    }}
                />
            </Box>
            <Stack gap="8px">
                {group.items.map((item) => (
                    <IndicatorRow key={`${group.name}-${item.name}`} item={item} />
                ))}
            </Stack>
        </Box>
    );
}

AnalysisGroup.propTypes = {
    group: PropTypes.shape({
        name: PropTypes.string.isRequired,
        items: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            signal: PropTypes.string.isRequired,
            tone: PropTypes.oneOf(["bullish", "bearish", "neutral"]).isRequired,
        })).isRequired,
    }).isRequired,
};

function TechnicalAnalysisPanel() {
    const [activeTimeframe, setActiveTimeframe] = useState(ANALYSIS_TIMEFRAMES[1]);
    const [candles, setCandles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [lastFetchedAt, setLastFetchedAt] = useState(null);

    const { selectedSymbol } = useSelector((state) => state.terminal);
    const { token } = useSelector((state) => state.auth);
    const { quoteData } = useQuotes();

    const selectedBaseSymbol = getBaseSymbolName(selectedSymbol);
    const chartRequestSymbol = useMemo(() => {
        const selectedRawSymbol = getRawSymbolName(selectedSymbol);
        const liveQuoteSymbol = quoteData?.find((item) => getBaseSymbolName(item) === selectedBaseSymbol);
        return getRawSymbolName(liveQuoteSymbol) || selectedRawSymbol || selectedBaseSymbol;
    }, [quoteData, selectedBaseSymbol, selectedSymbol]);

    const analysis = useMemo(() => computeTechnicalAnalysis(candles), [candles]);

    useEffect(() => {
        if (!selectedBaseSymbol || !chartRequestSymbol || !token) {
            setCandles([]);
            return;
        }

        const controller = new AbortController();
        const to = Math.floor(Date.now() / 1000);
        const from = to - activeTimeframe.range;
        const url = `${import.meta.env.VITE_BASE_URL}/user/analytics/chart`
            + `?symbol=${encodeURIComponent(chartRequestSymbol)}&from=${from}&to=${to}&period=${activeTimeframe.period}`;

        setIsLoading(true);
        setError("");

        fetch(url, {
            headers: { Authorization: token },
            signal: controller.signal,
        })
            .then((response) => {
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return response.json();
            })
            .then((response) => {
                if (!response.status) throw new Error(response.message || "Chart data unavailable");
                const normalized = normalizeAnalysisCandles(response.data)
                    .sort((first, second) => first.time - second.time)
                    .filter((item, index, array) => index === 0 || item.time !== array[index - 1].time);
                setCandles(normalized);
                setLastFetchedAt(Date.now());
                if (!normalized.length) setError(`No candle data available for ${selectedBaseSymbol}.`);
            })
            .catch((requestError) => {
                if (requestError.name !== "AbortError") {
                    setError(requestError.message || "Failed to load technical analysis.");
                    setCandles([]);
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) setIsLoading(false);
            });

        return () => controller.abort();
    }, [activeTimeframe, chartRequestSymbol, selectedBaseSymbol, token]);

    if (!selectedBaseSymbol) {
        return (
            <Box sx={{ p: "34px", textAlign: "center", color: "#9ca3af" }}>
                <AutoGraphIcon sx={{ fontSize: "52px", color: "rgba(76, 175, 80, 0.28)", mb: "10px" }} />
                <Typography sx={{ fontSize: "15px", fontWeight: 800, color: "white" }}>
                    Select a symbol to view Technical Analysis
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: "16px", color: "white" }}>
            <Box
                sx={{
                    p: "16px",
                    borderRadius: "20px",
                    background: "linear-gradient(135deg, rgba(31, 122, 224, 0.22), rgba(76, 175, 80, 0.16))",
                    border: "1px solid rgba(76, 175, 80, 0.24)",
                    boxShadow: "0 16px 38px rgba(0, 0, 0, 0.24)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "14px",
                    flexWrap: "wrap"
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                    <Box
                        sx={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "14px",
                            background: "linear-gradient(135deg, #4CAF50, #1f7ae0)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 10px 24px rgba(76, 175, 80, 0.28)"
                        }}
                    >
                        <AutoGraphIcon sx={{ fontSize: "24px", color: "white" }} />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontSize: "18px", fontWeight: 950, color: "white" }}>
                            Technical Analysis
                        </Typography>
                        <Typography sx={{ color: "#9fb0c8", fontSize: "12px", mt: "2px" }}>
                            {selectedBaseSymbol} via {chartRequestSymbol} | {candles.length} OHLC candles
                            {lastFetchedAt ? ` | Updated ${new Date(lastFetchedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : ""}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {ANALYSIS_TIMEFRAMES.map((timeframe) => (
                        <Button
                            key={timeframe.label}
                            size="small"
                            onClick={() => setActiveTimeframe(timeframe)}
                            sx={{
                                minWidth: "42px",
                                height: "30px",
                                px: "9px",
                                color: activeTimeframe.label === timeframe.label ? "white" : "#b7c4d8",
                                fontSize: "11px",
                                fontWeight: 900,
                                borderRadius: "10px",
                                background: activeTimeframe.label === timeframe.label
                                    ? "linear-gradient(135deg, #4CAF50, #2E7D32)"
                                    : "rgba(255, 255, 255, 0.06)",
                                border: `1px solid ${activeTimeframe.label === timeframe.label ? "rgba(76, 175, 80, 0.6)" : "rgba(255, 255, 255, 0.1)"}`,
                                "&:hover": {
                                    background: activeTimeframe.label === timeframe.label
                                        ? "linear-gradient(135deg, #45a049, #256b29)"
                                        : "rgba(76, 175, 80, 0.12)"
                                }
                            }}
                        >
                            {timeframe.label}
                        </Button>
                    ))}
                </Box>
            </Box>

            {isLoading && (
                <Stack gap="12px">
                    <Box sx={{ display: "flex", alignItems: "center", gap: "10px", color: "#9ca3af" }}>
                        <CircularProgress size={18} sx={{ color: "#4CAF50" }} />
                        <Typography sx={{ fontSize: "13px" }}>Calculating indicators...</Typography>
                    </Box>
                    {[...Array(4)].map((_, index) => (
                        <Skeleton key={index} variant="rounded" height={76} sx={{ bgcolor: "rgba(255,255,255,0.08)", borderRadius: "14px" }} />
                    ))}
                </Stack>
            )}

            {!isLoading && error && (
                <Box
                    sx={{
                        p: "18px",
                        borderRadius: "16px",
                        color: "#fca5a5",
                        background: "rgba(239, 68, 68, 0.12)",
                        border: "1px solid rgba(239, 68, 68, 0.28)",
                        display: "flex",
                        gap: "10px",
                        alignItems: "center"
                    }}
                >
                    <WarningAmberIcon sx={{ fontSize: "22px" }} />
                    <Typography sx={{ fontSize: "13px", fontWeight: 700 }}>{error}</Typography>
                </Box>
            )}

            {!isLoading && !error && !analysis.ready && (
                <Box sx={{ p: "20px", borderRadius: "16px", background: "rgba(15, 19, 30, 0.86)", border: "1px solid rgba(245, 158, 11, 0.26)" }}>
                    <Typography sx={{ color: "#fbbf24", fontSize: "14px", fontWeight: 800 }}>
                        {analysis.message}
                    </Typography>
                </Box>
            )}

            {!isLoading && !error && analysis.ready && (
                <>
                    <Grid container spacing={1.5}>
                        <Grid item xs={12} md={4}>
                            <Box
                                sx={{
                                    height: "100%",
                                    p: "16px",
                                    borderRadius: "18px",
                                    background: "linear-gradient(160deg, rgba(76, 175, 80, 0.18), rgba(31, 122, 224, 0.14))",
                                    border: "1px solid rgba(76, 175, 80, 0.25)"
                                }}
                            >
                                <Typography sx={{ color: "#9fb0c8", fontSize: "11px", fontWeight: 900, letterSpacing: "0.8px", textTransform: "uppercase" }}>
                                    Overall Signal
                                </Typography>
                                <Box sx={{ display: "flex", alignItems: "center", gap: "10px", mt: "10px", flexWrap: "wrap" }}>
                                    <Typography sx={{ color: "white", fontSize: "28px", fontWeight: 950, lineHeight: 1 }}>
                                        {analysis.summary.label}
                                    </Typography>
                                    <SignalChip label={`${analysis.summary.confidence}%`} tone={analysis.summary.tone} />
                                </Box>
                                <Typography sx={{ color: "#9fb0c8", fontSize: "12px", mt: "10px" }}>
                                    Score {analysis.summary.score} from {analysis.summary.bullish} bullish, {analysis.summary.bearish} bearish, {analysis.summary.neutral} neutral signals.
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ height: "100%", p: "16px", borderRadius: "18px", background: "rgba(15, 19, 30, 0.86)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                <Typography sx={{ color: "#9fb0c8", fontSize: "11px", fontWeight: 900, letterSpacing: "0.8px", textTransform: "uppercase" }}>
                                    Latest Candle
                                </Typography>
                                <Typography sx={{ color: "white", fontSize: "20px", fontWeight: 900, mt: "8px", fontFamily: "'Roboto Mono', monospace" }}>
                                    {analysis.latest.close}
                                </Typography>
                                <Typography sx={{ color: "#9fb0c8", fontSize: "12px", mt: "8px" }}>
                                    O {analysis.latest.open} | H {analysis.latest.high} | L {analysis.latest.low}
                                </Typography>
                                <Typography sx={{ color: "#718096", fontSize: "11px", mt: "8px" }}>
                                    {formatDateTime(analysis.latest.time)}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ height: "100%", p: "16px", borderRadius: "18px", background: "rgba(15, 19, 30, 0.86)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                <Typography sx={{ color: "#9fb0c8", fontSize: "11px", fontWeight: 900, letterSpacing: "0.8px", textTransform: "uppercase" }}>
                                    Candle Patterns
                                </Typography>
                                <Stack gap="7px" mt="10px">
                                    {analysis.patterns.length ? analysis.patterns.slice(0, 4).map((pattern) => (
                                        <Box key={pattern.name} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                                            <Typography sx={{ color: "white", fontSize: "12px", fontWeight: 800 }}>{pattern.name}</Typography>
                                            <SignalChip label={pattern.signal} tone={getPatternTone(pattern.signal)} />
                                        </Box>
                                    )) : (
                                        <Typography sx={{ color: "#9fb0c8", fontSize: "12px" }}>No major pattern detected on the latest candle.</Typography>
                                    )}
                                </Stack>
                            </Box>
                        </Grid>
                    </Grid>

                    <Grid container spacing={1.5}>
                        {analysis.groups.map((group) => (
                            <Grid item xs={12} lg={6} key={group.name}>
                                <AnalysisGroup group={group} />
                            </Grid>
                        ))}
                    </Grid>

                    {analysis.unavailable.length > 0 && (
                        <Box
                            sx={{
                                p: "14px",
                                borderRadius: "18px",
                                background: "rgba(15, 19, 30, 0.78)",
                                border: "1px dashed rgba(245, 158, 11, 0.35)"
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: "8px", mb: "8px" }}>
                                <CandlestickChartIcon sx={{ color: "#f59e0b", fontSize: "18px" }} />
                                <Typography sx={{ color: "#fbbf24", fontSize: "13px", fontWeight: 900 }}>
                                    Volume-based indicators unavailable
                                </Typography>
                            </Box>
                            <Typography sx={{ color: "#9fb0c8", fontSize: "12px", mb: "10px" }}>
                                Current chart API response does not include volume, so these indicators are disabled for now.
                            </Typography>
                            <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", mb: "10px" }} />
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                {analysis.unavailable.map((name) => (
                                    <Chip
                                        key={name}
                                        icon={<TimelineIcon sx={{ color: "#f59e0b !important", fontSize: "14px" }} />}
                                        label={name}
                                        size="small"
                                        sx={{
                                            color: "#fcd58d",
                                            background: "rgba(245, 158, 11, 0.1)",
                                            border: "1px solid rgba(245, 158, 11, 0.22)",
                                            fontSize: "10px",
                                            fontWeight: 800
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
}

export default TechnicalAnalysisPanel;
