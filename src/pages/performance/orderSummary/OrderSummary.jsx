import { Stack } from "@mui/material";
import OrderSummaryFilter from "./OrderSummaryFilter";
import TradingSummary from "./tradingSummary/TradingSummary";
import OrderSummaryCharts from "./orderSummaryCharts/OrderSummaryCharts";

function OrderSummary() {
    return (
        <Stack mt={"2rem"}>
            <OrderSummaryFilter />
            <TradingSummary />
            <OrderSummaryCharts />
        </Stack>
    )
}

export default OrderSummary;