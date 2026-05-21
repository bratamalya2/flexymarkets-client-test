import { Container, Stack, Typography } from "@mui/material";
import TransferWithdrawalMethods from "./TransferWithdrawalMethods"
import TransferForm from "./transferWithdrawal/TransferForm";
import TransferWithdrawal from "./transferWithdrawal/TransferWithdrawal";

function Transfer() {

    return (
        // <Container>
        // {/* <Typography variant='h5' fontWeight={"700"} fontSize={"1.8rem"} mb={"1rem"}>Internal transfer</Typography> */}
        // {/* <TransferWithdrawalMethods /> */}
        // {/* <VerificationRequiredWithdrawal /> */}
        <TransferWithdrawal />
        // </Container>
    )
}

export default Transfer;