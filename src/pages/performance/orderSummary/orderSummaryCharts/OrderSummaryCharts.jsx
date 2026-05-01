import { Stack, Typography, useMediaQuery } from "@mui/material";
import Toggle from "../../../../components/Toggle";
import SummaryCharts from "./SummaryCharts";
import Selector from "../../../../components/Selector";


function OrderSummaryCharts() {

    const matches = useMediaQuery('(min-width:600px)');

    return (
        <Stack mt={"2rem"}>
            <Typography sx={{ fontSize: "1.5rem", fontWeight: "700", mb: "2rem" }}>Charts</Typography>
            {
                matches
                    ?
                    <Toggle
                        items={["Net profit", "Closed orders", "Trading volume", "Equity"]}
                        toggleButtonGroupSx={{ height: "40px" }}
                        toggleButtonSx={{ fontSize: "14px" }}
                    />
                    :
                    <Selector items={["Net profit", "Closed orders", "Trading volume", "Equity"]} />
            }
            <SummaryCharts />
        </Stack>
    )
}

export default OrderSummaryCharts;