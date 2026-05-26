import { Box, useMediaQuery } from "@mui/material";
import TopHeader from "./TopHeader";
import LeftPanel from "./LeftPanel";
import CenterPanel from "./CenterPanel";
import RightPanel from "./RightPanel";

function TradingTerminal() {
    const showLeftPanel = useMediaQuery("(min-width:1024px)");
    const showRightPanel = useMediaQuery("(min-width:768px)");

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
                {showLeftPanel && <LeftPanel />}
                <CenterPanel />
                {showRightPanel && (
                    <Box sx={{ width: { md: "330px", xl: "380px" }, flexShrink: 0 }}>
                        <RightPanel />
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default TradingTerminal;
