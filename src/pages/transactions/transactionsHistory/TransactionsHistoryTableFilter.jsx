import { Stack } from "@mui/material"
import Selector from "../../../components/Selector"

function TransactionsHistoryTableFilter() {
    return (
        <Stack sx={{ flexDirection: "row", gap: "1.2rem", justifyContent: "space-between", flexWrap: "wrap" }}>
            <Selector items={["All times", "Last 3 days", "Last 7 days", "Last 30 days", "Last 3 months"]} value={"All times"} showDefaultOption={false} />
            <Selector items={["All transaction types", "Deposit", "Withdrawal", "Transfer", "Refund", "Reward", "Rebate", "Investment", "Agent commission"]} value={"All transaction types"} showDefaultOption={false} />
            <Selector items={["All statuses", "Processing", "Done", "Rejected"]} value={"All statuses"} showDefaultOption={false} />
            <Selector items={["All accounts"]} value={"All accounts"} showDefaultOption={false} />
        </Stack>
    )
}

export default TransactionsHistoryTableFilter;