import { Container, Stack, Typography } from "@mui/material";
import TransactionsHistoryTable from "./TransactionsHistoryTable";
import TransactionsHistoryTableFilter from "./TransactionsHistoryTableFilter";


function TransactionsHistory() {

    return (
        <Container>
            <Typography variant='h5' fontWeight={"700"} fontSize={"1.8rem"} mb={"1rem"}>Transaction history</Typography>
            <Stack sx={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap-reverse", gap: "1.5rem" }}>
                <TransactionsHistoryTableFilter />
                <Stack>
                    <Typography color={"primary.main"}>Get support</Typography>
                </Stack>
            </Stack>
            <TransactionsHistoryTable />
        </Container>
    )
}

export default TransactionsHistory;