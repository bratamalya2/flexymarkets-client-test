import OrderPlacementForm from "./OrderPlacement/OrderPlacementForm";
import TerminalGraph from "./TerminalGraph";
import Grid from "@mui/material/Grid2";
import TradeHistoryTable from "./OrderPlacement/tradeHistory/TradeHistoryTable";
import Expander from "../../components/Expander";
import { Stack } from "@mui/material";

function TradingTerminal() {
    return (
        // <Grid container size={12}>
        //     <Grid size={10}>
        //         <Expander
        //             topContent={<TerminalGraph />}
        //             bottomContent={<TradeHistoryTable />}
        //         />
        //     </Grid>
        //     <Grid size={2}>
        //         <OrderPlacementForm />
        //     </Grid>
        // </Grid>
        // <Stack sx={{ flexDirection: "row", width: "100%" }}>
        // <Stack sx={{ width: "calc(100vw - 300px)" }}>
        <Expander
            topContent={<TerminalGraph />}
            bottomContent={<TradeHistoryTable />}
        />
        // </Stack>
        /* <Stack sx={{ width: "300px" }}>
            <OrderPlacementForm />
        </Stack> */
        // </Stack>
    )
}

export default TradingTerminal;