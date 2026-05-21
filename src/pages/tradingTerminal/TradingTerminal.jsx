import { Box, useMediaQuery } from "@mui/material";
import TopHeader from "./TopHeader";
import LeftPanel from "./LeftPanel";
import CenterPanel from "./CenterPanel";
import RightPanel from "./RightPanel";

function TradingTerminal() {
    const showLeftPanel = useMediaQuery("(min-width:1024px)");
    const showRightPanel = useMediaQuery("(min-width:768px)");

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", background: "#0a0e17" }}>
            <TopHeader />
            <Box sx={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>
                {showLeftPanel && <LeftPanel />}
                <CenterPanel />
                {showRightPanel && (
                    <Box sx={{ width: "300px", flexShrink: 0 }}>
                        <RightPanel />
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default TradingTerminal;
