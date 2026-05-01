import { Container, Stack, Typography } from "@mui/material";
import WithdrawalMethods from "./withdrawalMethods/WithdrawalMethods";
// import TransferWithdrawalMethods from "./transferWithdrawalMethods/TransferWithdrawalMethods";
import VerificationRequiredWithdrawal from "./verificationRequiredWithdrawal/VerificationRequiredWithdrawal"

function WithDrawal() {

    return (
        <Container>
            <Typography variant='h5' fontWeight={"700"} fontSize={"1.8rem"} mb={"1rem"}>Withdrawal</Typography>
            <WithdrawalMethods />
            {/* <TransferWithdrawalMethods /> */}
            {/* <VerificationRequiredWithdrawal /> */}
        </Container>
    )
}

export default WithDrawal;