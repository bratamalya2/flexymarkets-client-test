import { Container, Typography } from "@mui/material";
import DepositMethods from "./depositMethods/DepositMethods"

function Deposit() {
    return (
        <Container>
            <Typography variant='h5' fontWeight={"700"} fontSize={"1.8rem"} mb={"1rem"}>Deposit</Typography>
            <DepositMethods />
        </Container>
    )
}

export default Deposit;