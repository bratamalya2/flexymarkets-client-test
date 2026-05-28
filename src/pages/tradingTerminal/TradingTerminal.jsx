import { useState } from "react";
import { Box, useMediaQuery, BottomNavigation, BottomNavigationAction } from "@mui/material";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import TopHeader from "./TopHeader";
import LeftPanel from "./LeftPanel";
import CenterPanel from "./CenterPanel";
import RightPanel from "./RightPanel";

function TradingTerminal() {
    const showLeftPanel = useMediaQuery("(min-width:1024px)");
    const showRightPanel = useMediaQuery("(min-width:768px)");
    const isMobile = useMediaQuery("(max-width:767px)");

    const [activeMobileView, setActiveMobileView] = useState("chart");

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", background: "#eef3f8" }}>
            <TopHeader />
            <Box sx={{
                flex: 1,
                display: "flex",
                overflow: "hidden",
                minHeight: 0,
                gap: { xs: 0, md: "14px" },
                p: { xs: 0, md: "14px" },
                background: "linear-gradient(135deg, #eef3f8 0%, #f8fbff 100%)"
            }}>
                {isMobile ? (
                    <>
                        {activeMobileView === "markets" && <LeftPanel />}
                        {activeMobileView === "chart" && <CenterPanel />}
                        {activeMobileView === "trade" && (
                            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                                <RightPanel />
                            </Box>
                        )}
                    </>
                ) : (
                    <>
                        {showLeftPanel && <LeftPanel />}
                        <CenterPanel />
                        {showRightPanel && (
                            <Box sx={{ width: { md: "330px", xl: "380px" }, flexShrink: 0 }}>
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
                        "& .MuiBottomNavigationAction-root": {
                            color: "#667085",
                            minWidth: 0,
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
