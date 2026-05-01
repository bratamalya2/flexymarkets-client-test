import { Divider, Stack } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState } from "react";
import AnalystViewsFilters from "./analystViewsFilters/AnalystViewsFilters";
import TradingSignalsFeed from "./tradingSignalsFeed/TradingSignalsFeed";
import TradingSignalDetails from "./tradingSignalDetails/TradingSignalDetails";
import AnalystViewsFooter from "./analystViewsFooter/AnalystViewsFooter";
import { useMediaQuery, useTheme } from "@mui/material";

function AnalystViewsContent({ active }) {
    const [selectedSignal, setSelectedSignal] = useState(<TradingSignalDetails />);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <Stack>
            <AnalystViewsFilters active={active} />

            <Grid container spacing={4}>
                {isMobile && selectedSignal ? (
                    <Grid item size={12}>
                        <TradingSignalDetails signal={selectedSignal} onBack={() => setSelectedSignal(null)} />
                    </Grid>
                ) : (
                    <>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TradingSignalsFeed onSelectSignal={setSelectedSignal} />
                        </Grid>
                        {!isMobile && selectedSignal && (
                            <Grid item size={6}>
                                <TradingSignalDetails signal={selectedSignal} />
                            </Grid>
                        )}
                    </>
                )}
            </Grid>

            <Divider sx={{ my: "1.5rem" }} />
            <AnalystViewsFooter />
        </Stack>
    );
}

export default AnalystViewsContent;