import { useMemo } from "react";
import PropTypes from "prop-types";
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    Link,
    Skeleton,
    Stack,
    Typography
} from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ArticleIcon from "@mui/icons-material/Article";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PublicIcon from "@mui/icons-material/Public";
import RefreshIcon from "@mui/icons-material/Refresh";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useSelector } from "react-redux";
import { useFundamentalAnalysisQuery } from "../../globalState/analytics/analyticsApis";

const getRawSymbolName = (symbol) => {
    const rawSymbol = symbol?.groupedSym ?? symbol?.Symbol ?? symbol?.name ?? symbol;
    return rawSymbol ? String(rawSymbol).trim() : "";
};

const getBaseSymbolName = (symbol) => {
    const rawSymbol = getRawSymbolName(symbol);
    return rawSymbol ? rawSymbol.split(".")[0].toUpperCase() : "";
};

const getTonePalette = (tone) => {
    if (tone === "bullish" || tone === "positive" || tone === "ok") {
        return {
            color: "#22c55e",
            background: "rgba(34, 197, 94, 0.13)",
            border: "rgba(34, 197, 94, 0.32)",
            gradient: "linear-gradient(135deg, rgba(34,197,94,0.22), rgba(31,122,224,0.14))",
        };
    }

    if (tone === "bearish" || tone === "negative" || tone === "error") {
        return {
            color: "#ef4444",
            background: "rgba(239, 68, 68, 0.13)",
            border: "rgba(239, 68, 68, 0.32)",
            gradient: "linear-gradient(135deg, rgba(239,68,68,0.2), rgba(245,158,11,0.12))",
        };
    }

    return {
        color: "#f59e0b",
        background: "rgba(245, 158, 11, 0.13)",
        border: "rgba(245, 158, 11, 0.32)",
        gradient: "linear-gradient(135deg, rgba(245,158,11,0.18), rgba(31,122,224,0.12))",
    };
};

function ToneChip({ label, tone }) {
    const palette = getTonePalette(tone);

    return (
        <Chip
            label={label}
            size="small"
            sx={{
                height: "23px",
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

ToneChip.propTypes = {
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    tone: PropTypes.string,
};

ToneChip.defaultProps = {
    tone: "neutral",
};

const formatDateTime = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
};

const formatValue = (value, unit) => {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) return "-";

    const formatted = numericValue.toLocaleString(undefined, {
        maximumFractionDigits: Math.abs(numericValue) < 10 ? 3 : 2,
    });

    return unit ? `${formatted} ${unit}` : formatted;
};

function DriverCard({ driver }) {
    const palette = getTonePalette(driver.impact);

    return (
        <Box
            sx={{
                p: "13px",
                borderRadius: "16px",
                background: "rgba(15, 19, 30, 0.78)",
                border: `1px solid ${palette.border}`,
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                minHeight: "122px"
            }}
        >
            <Box sx={{ display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "flex-start" }}>
                <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ color: "white", fontSize: "13px", fontWeight: 900 }}>
                        {driver.label}
                    </Typography>
                    <Typography sx={{ color: "#8fa0ba", fontSize: "10px", fontWeight: 800, textTransform: "uppercase", mt: "2px" }}>
                        {driver.source}
                    </Typography>
                </Box>
                <ToneChip label={driver.signal || "Neutral"} tone={driver.impact} />
            </Box>
            <Typography sx={{ color: "#b7c4d8", fontSize: "12px", lineHeight: 1.45 }}>
                {driver.reason}
            </Typography>
            <Typography sx={{ color: palette.color, fontSize: "11px", fontWeight: 900, mt: "auto" }}>
                Score {Number.isFinite(Number(driver.score)) ? driver.score : "0"}
            </Typography>
        </Box>
    );
}

DriverCard.propTypes = {
    driver: PropTypes.shape({
        impact: PropTypes.string,
        label: PropTypes.string.isRequired,
        reason: PropTypes.string,
        score: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        signal: PropTypes.string,
        source: PropTypes.string,
    }).isRequired,
};

function MacroCard({ indicator }) {
    const palette = getTonePalette(indicator.impact || indicator.status);

    return (
        <Box
            sx={{
                p: "12px",
                borderRadius: "15px",
                background: "rgba(15, 19, 30, 0.72)",
                border: `1px solid ${palette.border}`,
                minHeight: "128px"
            }}
        >
            <Box sx={{ display: "flex", justifyContent: "space-between", gap: "8px", mb: "8px" }}>
                <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ color: "white", fontSize: "13px", fontWeight: 900 }}>
                        {indicator.label}
                    </Typography>
                    <Typography sx={{ color: "#718096", fontSize: "10px", fontWeight: 800, textTransform: "uppercase" }}>
                        {indicator.id}
                    </Typography>
                </Box>
                <ToneChip label={indicator.status === "ok" ? indicator.signal : "Error"} tone={indicator.impact || indicator.status} />
            </Box>

            {indicator.status === "ok" ? (
                <>
                    <Typography sx={{ color: "#dbe7f7", fontSize: "17px", fontWeight: 950, fontFamily: "'Roboto Mono', monospace" }}>
                        {formatValue(indicator.latest?.value, indicator.unit)}
                    </Typography>
                    <Typography sx={{ color: "#8fa0ba", fontSize: "11px", mt: "4px" }}>
                        Previous {formatValue(indicator.previous?.value, indicator.unit)} | Change {formatValue(indicator.change, indicator.unit)}
                    </Typography>
                    <Typography sx={{ color: "#718096", fontSize: "10px", mt: "8px" }}>
                        Latest: {indicator.latest?.date || "-"}
                    </Typography>
                </>
            ) : (
                <Typography sx={{ color: "#fca5a5", fontSize: "12px", lineHeight: 1.45 }}>
                    {indicator.error || "Unable to load this FRED series."}
                </Typography>
            )}
        </Box>
    );
}

MacroCard.propTypes = {
    indicator: PropTypes.shape({
        change: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        error: PropTypes.string,
        id: PropTypes.string.isRequired,
        impact: PropTypes.string,
        label: PropTypes.string.isRequired,
        latest: PropTypes.shape({
            date: PropTypes.string,
            value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        }),
        previous: PropTypes.shape({
            value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        }),
        signal: PropTypes.string,
        status: PropTypes.string,
        unit: PropTypes.string,
    }).isRequired,
};

function NewsArticle({ article }) {
    const sentimentTone = article.sentiment === "positive"
        ? "bullish"
        : article.sentiment === "negative"
            ? "bearish"
            : "neutral";

    return (
        <Box
            sx={{
                p: "13px",
                borderRadius: "16px",
                background: "rgba(15, 19, 30, 0.76)",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                flexDirection: "column",
                gap: "8px"
            }}
        >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ color: "white", fontSize: "13px", fontWeight: 900, lineHeight: 1.35 }}>
                        {article.title}
                    </Typography>
                    <Typography sx={{ color: "#718096", fontSize: "10px", fontWeight: 800, mt: "4px" }}>
                        {article.source} | {formatDateTime(article.publishedAt)}
                    </Typography>
                </Box>
                <ToneChip label={article.sentiment || "unknown"} tone={sentimentTone} />
            </Box>

            {article.description && (
                <Typography sx={{ color: "#b7c4d8", fontSize: "12px", lineHeight: 1.45 }}>
                    {article.description}
                </Typography>
            )}

            {article.url && (
                <Link
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                    sx={{
                        color: "#60a5fa",
                        fontSize: "11px",
                        fontWeight: 900,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        textDecoration: "none",
                        width: "fit-content",
                        "&:hover": { color: "#93c5fd" }
                    }}
                >
                    Read source <OpenInNewIcon sx={{ fontSize: "13px" }} />
                </Link>
            )}
        </Box>
    );
}

NewsArticle.propTypes = {
    article: PropTypes.shape({
        description: PropTypes.string,
        publishedAt: PropTypes.string,
        sentiment: PropTypes.string,
        source: PropTypes.string,
        title: PropTypes.string.isRequired,
        url: PropTypes.string,
    }).isRequired,
};

function LoadingState() {
    return (
        <Stack gap="12px">
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px", color: "#9ca3af" }}>
                <CircularProgress size={18} sx={{ color: "#4CAF50" }} />
                <Typography sx={{ fontSize: "13px" }}>Fetching Marketaux news and FRED macro data...</Typography>
            </Box>
            {[...Array(4)].map((_, index) => (
                <Skeleton key={index} variant="rounded" height={82} sx={{ bgcolor: "rgba(255,255,255,0.08)", borderRadius: "14px" }} />
            ))}
        </Stack>
    );
}

function FundamentalAnalysisPanel() {
    const { selectedSymbol } = useSelector((state) => state.terminal);
    const selectedBaseSymbol = useMemo(() => getBaseSymbolName(selectedSymbol), [selectedSymbol]);

    const {
        data: analysis,
        error,
        isError,
        isFetching,
        isLoading,
        refetch,
    } = useFundamentalAnalysisQuery(
        { symbol: selectedBaseSymbol },
        {
            skip: !selectedBaseSymbol,
            refetchOnMountOrArgChange: true,
        }
    );

    const overallPalette = getTonePalette(analysis?.overall?.tone);
    const articles = analysis?.news?.articles || [];
    const indicators = analysis?.macro?.indicators || [];
    const drivers = analysis?.drivers || [];
    const errorMessage = error?.data?.message || error?.error || "Failed to load fundamental analysis.";

    if (!selectedBaseSymbol) {
        return (
            <Box sx={{ p: "34px", textAlign: "center", color: "#9ca3af" }}>
                <PublicIcon sx={{ fontSize: "52px", color: "rgba(96, 165, 250, 0.28)", mb: "10px" }} />
                <Typography sx={{ fontSize: "15px", fontWeight: 800, color: "white" }}>
                    Select a symbol to view Fundamental Analysis
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
                    background: overallPalette.gradient,
                    border: `1px solid ${overallPalette.border}`,
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
                            background: "linear-gradient(135deg, #f59e0b, #1f7ae0)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 10px 24px rgba(245, 158, 11, 0.22)"
                        }}
                    >
                        <PublicIcon sx={{ fontSize: "24px", color: "white" }} />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontSize: "18px", fontWeight: 950, color: "white" }}>
                            Fundamental Analysis
                        </Typography>
                        <Typography sx={{ color: "#b7c4d8", fontSize: "12px", mt: "2px" }}>
                            {selectedBaseSymbol}
                            {analysis?.instrument?.baseName ? ` | ${analysis.instrument.baseName}` : ""}
                            {analysis?.instrument?.quoteName ? ` vs ${analysis.instrument.quoteName}` : ""}
                            {analysis?.updatedAt ? ` | Updated ${formatDateTime(analysis.updatedAt)}` : ""}
                            {analysis?.cached ? " | cached" : ""}
                        </Typography>
                    </Box>
                </Box>

                <Button
                    size="small"
                    onClick={() => refetch()}
                    disabled={isFetching}
                    startIcon={<RefreshIcon />}
                    sx={{
                        height: "32px",
                        px: "12px",
                        borderRadius: "999px",
                        color: "#dbe7f7",
                        fontSize: "11px",
                        fontWeight: 900,
                        border: "1px solid rgba(255,255,255,0.16)",
                        background: "rgba(255,255,255,0.06)",
                        "&:hover": { background: "rgba(255,255,255,0.1)" }
                    }}
                >
                    Refresh
                </Button>
            </Box>

            {(isLoading || (!analysis && isFetching)) && <LoadingState />}

            {!isLoading && isError && (
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
                    <Typography sx={{ fontSize: "13px", fontWeight: 700 }}>{errorMessage}</Typography>
                </Box>
            )}

            {!isLoading && !isError && analysis && (
                <>
                    <Grid container spacing={1.5}>
                        <Grid item xs={12} md={4}>
                            <Box
                                sx={{
                                    height: "100%",
                                    p: "16px",
                                    borderRadius: "18px",
                                    background: overallPalette.gradient,
                                    border: `1px solid ${overallPalette.border}`
                                }}
                            >
                                <Typography sx={{ color: "#9fb0c8", fontSize: "11px", fontWeight: 900, letterSpacing: "0.8px", textTransform: "uppercase" }}>
                                    Overall Bias
                                </Typography>
                                <Box sx={{ display: "flex", alignItems: "center", gap: "10px", mt: "10px", flexWrap: "wrap" }}>
                                    <Typography sx={{ color: "white", fontSize: "28px", fontWeight: 950, lineHeight: 1 }}>
                                        {analysis.overall?.signal || "Neutral"}
                                    </Typography>
                                    <ToneChip label={`${analysis.overall?.confidence || 0}%`} tone={analysis.overall?.tone} />
                                </Box>
                                <Typography sx={{ color: "#b7c4d8", fontSize: "12px", mt: "10px" }}>
                                    {analysis.overall?.summary}
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Box sx={{ height: "100%", p: "16px", borderRadius: "18px", background: "rgba(15, 19, 30, 0.86)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                <Typography sx={{ color: "#9fb0c8", fontSize: "11px", fontWeight: 900, letterSpacing: "0.8px", textTransform: "uppercase" }}>
                                    News Feed
                                </Typography>
                                <Typography sx={{ color: "white", fontSize: "22px", fontWeight: 950, mt: "8px" }}>
                                    {articles.length} Articles
                                </Typography>
                                <Typography sx={{ color: "#9fb0c8", fontSize: "12px", mt: "8px" }}>
                                    Marketaux status: {analysis.news?.status || "-"}
                                </Typography>
                                <Typography sx={{ color: "#718096", fontSize: "11px", mt: "8px" }}>
                                    Query: {analysis.news?.query || "-"}
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Box sx={{ height: "100%", p: "16px", borderRadius: "18px", background: "rgba(15, 19, 30, 0.86)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                <Typography sx={{ color: "#9fb0c8", fontSize: "11px", fontWeight: 900, letterSpacing: "0.8px", textTransform: "uppercase" }}>
                                    Macro Data
                                </Typography>
                                <Typography sx={{ color: "white", fontSize: "22px", fontWeight: 950, mt: "8px" }}>
                                    {indicators.filter((indicator) => indicator.status === "ok").length} Signals
                                </Typography>
                                <Typography sx={{ color: "#9fb0c8", fontSize: "12px", mt: "8px" }}>
                                    FRED status: {analysis.macro?.status || "-"}
                                </Typography>
                                <Typography sx={{ color: "#718096", fontSize: "11px", mt: "8px" }}>
                                    Macro data is delayed by each source release schedule.
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    <Box
                        sx={{
                            p: "14px",
                            borderRadius: "18px",
                            background: "rgba(15, 19, 30, 0.78)",
                            border: "1px solid rgba(255,255,255,0.08)"
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: "8px", mb: "10px" }}>
                            <AutoAwesomeIcon sx={{ color: "#f59e0b", fontSize: "18px" }} />
                            <Typography sx={{ color: "white", fontSize: "14px", fontWeight: 950 }}>
                                Key Fundamental Drivers
                            </Typography>
                        </Box>
                        <Grid container spacing={1.2}>
                            {drivers.map((driver) => (
                                <Grid item xs={12} md={6} xl={4} key={driver.id}>
                                    <DriverCard driver={driver} />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    <Grid container spacing={1.5}>
                        <Grid item xs={12} lg={6}>
                            <Box
                                sx={{
                                    p: "14px",
                                    borderRadius: "18px",
                                    background: "linear-gradient(180deg, rgba(18, 24, 38, 0.94), rgba(10, 14, 23, 0.94))",
                                    border: "1px solid rgba(96, 165, 250, 0.18)",
                                    boxShadow: "0 14px 34px rgba(0, 0, 0, 0.22)"
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: "8px", mb: "12px" }}>
                                    <ArticleIcon sx={{ color: "#60a5fa", fontSize: "18px" }} />
                                    <Typography sx={{ color: "white", fontSize: "14px", fontWeight: 950 }}>
                                        Latest Relevant News
                                    </Typography>
                                </Box>
                                <Stack gap="10px">
                                    {articles.length ? articles.map((article) => (
                                        <NewsArticle key={article.id || article.url || article.title} article={article} />
                                    )) : (
                                        <Typography sx={{ color: "#9fb0c8", fontSize: "12px" }}>
                                            No recent Marketaux articles were returned for this symbol.
                                        </Typography>
                                    )}
                                </Stack>
                            </Box>
                        </Grid>

                        <Grid item xs={12} lg={6}>
                            <Box
                                sx={{
                                    p: "14px",
                                    borderRadius: "18px",
                                    background: "linear-gradient(180deg, rgba(18, 24, 38, 0.94), rgba(10, 14, 23, 0.94))",
                                    border: "1px solid rgba(245, 158, 11, 0.18)",
                                    boxShadow: "0 14px 34px rgba(0, 0, 0, 0.22)"
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: "8px", mb: "12px" }}>
                                    <AccountBalanceIcon sx={{ color: "#f59e0b", fontSize: "18px" }} />
                                    <Typography sx={{ color: "white", fontSize: "14px", fontWeight: 950 }}>
                                        FRED Macro Snapshot
                                    </Typography>
                                </Box>
                                <Grid container spacing={1.2}>
                                    {indicators.map((indicator) => (
                                        <Grid item xs={12} md={6} key={indicator.id}>
                                            <MacroCard indicator={indicator} />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>

                    <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
                    <Typography sx={{ color: "#718096", fontSize: "11px", lineHeight: 1.5 }}>
                        Fundamental analysis is generated from provider metadata and macro series. It is context for decision-making, not a guaranteed trading signal.
                    </Typography>
                </>
            )}
        </Box>
    );
}

export default FundamentalAnalysisPanel;
