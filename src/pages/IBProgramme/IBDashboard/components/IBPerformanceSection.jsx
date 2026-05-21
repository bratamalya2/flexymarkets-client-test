import { Box } from "@mui/material";
import IBActiveCounters from "./IBActiveCounters";
import IBPerformanceLists from "./IBPerformanceLists";
import IBTopEarnings from "./IBTopEarnings";

function IBPerformanceSection() {
    return (
        <Box>
            <IBActiveCounters />
            <IBPerformanceLists />
            <IBTopEarnings />
        </Box>
    );
}

export default IBPerformanceSection;
