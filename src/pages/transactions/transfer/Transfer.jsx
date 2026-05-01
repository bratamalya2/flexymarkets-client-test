import { Container, Stack, Typography } from "@mui/material";
import TransferWithdrawalMethods from "./TransferWithdrawalMethods"

function Transfer() {

    return (
        <Container>
            <Typography variant='h5' fontWeight={"700"} fontSize={"1.8rem"} mb={"1rem"}>Internal transfer</Typography>
            <TransferWithdrawalMethods />
            {/* <VerificationRequiredWithdrawal /> */}
        </Container>
    )
}

export default Transfer;