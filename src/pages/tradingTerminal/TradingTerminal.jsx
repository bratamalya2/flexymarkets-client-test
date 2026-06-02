import { useEffect, useRef, useState } from "react";
import { Box, useMediaQuery, BottomNavigation, BottomNavigationAction } from "@mui/material";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import TopHeader from "./TopHeader";
import LeftPanel from "./LeftPanel";
import CenterPanel from "./CenterPanel";
import RightPanel from "./RightPanel";

const LEFT_PANEL_WIDTH_STORAGE_KEY = "terminalLeftPanelWidth";
const DEFAULT_LEFT_PANEL_WIDTH = 270;
const MIN_LEFT_PANEL_WIDTH = 220;
const MAX_LEFT_PANEL_WIDTH = 460;
const MIN_CENTER_PANEL_WIDTH = 420;
const LAYOUT_GAP_PX = 14;

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function readStoredNumber(storageKey, fallback) {
    if (typeof window === "undefined") return fallback;

    const rawValue = window.localStorage.getItem(storageKey);
    const parsedValue = Number(rawValue);
    return Number.isFinite(parsedValue) ? parsedValue : fallback;
}

function TradingTerminal() {
    const showLeftPanel = useMediaQuery("(min-width:1024px)");
    const showRightPanel = useMediaQuery("(min-width:768px)");
    const useWideRightPanel = useMediaQuery("(min-width:1536px)");
    const isMobile = useMediaQuery("(max-width:767px)");
    const rightPanelWidth = useWideRightPanel ? 380 : showLeftPanel ? 320 : 300;

    const [activeMobileView, setActiveMobileView] = useState("chart");
    const [leftPanelWidth, setLeftPanelWidth] = useState(() => (
        readStoredNumber(LEFT_PANEL_WIDTH_STORAGE_KEY, DEFAULT_LEFT_PANEL_WIDTH)
    ));
    const [isResizingLeftPanel, setIsResizingLeftPanel] = useState(false);

    const contentRef = useRef(null);
    const leftPanelResizeRef = useRef({
        startX: 0,
        startWidth: DEFAULT_LEFT_PANEL_WIDTH,
    });

    const getRightPanelWidth = () => (showRightPanel ? rightPanelWidth : 0);
    const getLeftPanelMaxWidth = () => {
        const containerWidth = contentRef.current?.getBoundingClientRect().width;
        if (!containerWidth || !showLeftPanel) return MAX_LEFT_PANEL_WIDTH;

        const rightPanelWidth = getRightPanelWidth();
        const gapCount = showRightPanel ? 2 : 1;
        const availableWidth = containerWidth - rightPanelWidth - (gapCount * LAYOUT_GAP_PX) - MIN_CENTER_PANEL_WIDTH;

        return Math.max(
            MIN_LEFT_PANEL_WIDTH,
            Math.min(MAX_LEFT_PANEL_WIDTH, Math.floor(availableWidth))
        );
    };

    useEffect(() => {
        if (typeof window === "undefined") return;
        window.localStorage.setItem(LEFT_PANEL_WIDTH_STORAGE_KEY, String(leftPanelWidth));
    }, [leftPanelWidth]);

    useEffect(() => {
        if (!showLeftPanel) return;

        const clampLeftPanelWidth = () => {
            setLeftPanelWidth((currentWidth) => (
                clamp(currentWidth, MIN_LEFT_PANEL_WIDTH, getLeftPanelMaxWidth())
            ));
        };

        clampLeftPanelWidth();
        window.addEventListener("resize", clampLeftPanelWidth);

        return () => {
            window.removeEventListener("resize", clampLeftPanelWidth);
        };
    }, [rightPanelWidth, showLeftPanel, showRightPanel]);

    useEffect(() => {
        if (!isResizingLeftPanel) return undefined;

        const previousCursor = document.body.style.cursor;
        const previousUserSelect = document.body.style.userSelect;

        const handlePointerMove = (event) => {
            const deltaX = event.clientX - leftPanelResizeRef.current.startX;
            const nextWidth = leftPanelResizeRef.current.startWidth + deltaX;
            setLeftPanelWidth(clamp(nextWidth, MIN_LEFT_PANEL_WIDTH, getLeftPanelMaxWidth()));
        };

        const stopResizing = () => {
            setIsResizingLeftPanel(false);
        };

        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";

        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", stopResizing);
        window.addEventListener("pointercancel", stopResizing);

        return () => {
            document.body.style.cursor = previousCursor;
            document.body.style.userSelect = previousUserSelect;
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", stopResizing);
            window.removeEventListener("pointercancel", stopResizing);
        };
    }, [isResizingLeftPanel, rightPanelWidth, showLeftPanel, showRightPanel]);

    const handleLeftPanelResizeStart = (event) => {
        if (event.button !== 0 || !showLeftPanel) return;

        event.preventDefault();
        leftPanelResizeRef.current = {
            startX: event.clientX,
            startWidth: leftPanelWidth,
        };
        setIsResizingLeftPanel(true);
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", height: "100dvh", overflow: "hidden", background: "#eef3f8" }}>
            <TopHeader />
            <Box
                ref={contentRef}
                sx={{
                flex: 1,
                display: "flex",
                overflow: "hidden",
                minHeight: 0,
                gap: { xs: 0, sm: "10px", lg: `${LAYOUT_GAP_PX}px` },
                p: { xs: 0, sm: "10px", lg: "14px" },
                background: "linear-gradient(135deg, #eef3f8 0%, #f8fbff 100%)"
            }}>
                {isMobile ? (
                    <>
                        {activeMobileView === "markets" && <LeftPanel />}
                        {activeMobileView === "chart" && <CenterPanel />}
                        {activeMobileView === "trade" && (
                            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden" }}>
                                <RightPanel />
                            </Box>
                        )}
                    </>
                ) : (
                    <>
                        {showLeftPanel && (
                            <Box
                                sx={{
                                    width: `${leftPanelWidth}px`,
                                    flexShrink: 0,
                                    minWidth: 0,
                                    position: "relative",
                                    display: "flex",
                                }}
                            >
                                <LeftPanel width="100%" />
                                <Box
                                    role="separator"
                                    aria-orientation="vertical"
                                    aria-label="Resize markets panel"
                                    onPointerDown={handleLeftPanelResizeStart}
                                    sx={{
                                        position: "absolute",
                                        top: "20px",
                                        bottom: "20px",
                                        right: `-${LAYOUT_GAP_PX}px`,
                                        width: `${LAYOUT_GAP_PX}px`,
                                        zIndex: 30,
                                        cursor: "col-resize",
                                        touchAction: "none",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        "&::before": {
                                            content: '""',
                                            width: "4px",
                                            height: "84px",
                                            borderRadius: "999px",
                                            background: isResizingLeftPanel
                                                ? "linear-gradient(180deg, #1f7ae0, #16a085)"
                                                : "linear-gradient(180deg, rgba(31, 122, 224, 0.32), rgba(22, 160, 133, 0.32))",
                                            boxShadow: isResizingLeftPanel
                                                ? "0 0 0 4px rgba(31, 122, 224, 0.14)"
                                                : "0 0 0 1px rgba(255,255,255,0.55)",
                                            transition: "all 0.2s ease",
                                        },
                                        "&:hover::before": {
                                            background: "linear-gradient(180deg, #1f7ae0, #16a085)",
                                            boxShadow: "0 0 0 4px rgba(31, 122, 224, 0.14)",
                                        },
                                    }}
                                />
                            </Box>
                        )}
                        <CenterPanel />
                        {showRightPanel && (
                            <Box sx={{ width: `${rightPanelWidth}px`, flexShrink: 0, minWidth: 0 }}>
                                <RightPanel />
                            </Box>
                        )}
                    </>
                )}
            </Box>

            {isMobile && (
                <BottomNavigation
                    value={activeMobileView}
                    onChange={(_, newValue) => setActiveMobileView(newValue)}
                    sx={{
                        flexShrink: 0,
                        borderTop: "1px solid #dfe7f1",
                        background: "#ffffff",
                        height: "calc(56px + env(safe-area-inset-bottom))",
                        pb: "env(safe-area-inset-bottom)",
                        boxShadow: "0 -10px 24px rgba(18, 32, 54, 0.08)",
                        "& .MuiBottomNavigationAction-root": {
                            color: "#667085",
                            minWidth: 0,
                            pt: 0.75,
                            pb: 0.5,
                            "& .MuiBottomNavigationAction-label": {
                                fontSize: "11px",
                            },
                            "&.Mui-selected": { color: "#1f7ae0" }
                        }
                    }}
                >
                    <BottomNavigationAction label="Chart" value="chart" icon={<ShowChartIcon />} />
                    <BottomNavigationAction label="Markets" value="markets" icon={<FormatListBulletedIcon />} />
                    <BottomNavigationAction label="Trade" value="trade" icon={<AddCircleOutlineIcon />} />
                </BottomNavigation>
            )}
        </Box>
    );
}

export default TradingTerminal;
