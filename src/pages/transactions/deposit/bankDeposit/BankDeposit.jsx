import { Container, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import BankDepositForm from './BankDepositForm'
import BankDepositDetails from './BankDepositDetails'


function BankDeposit() {

    return (
        <Container>
            <Typography sx={{ fontSize: "2rem", fontWeight: "700", mb: "2rem" }}>Bank deposit</Typography>
            <Grid container size={12} spacing={3} mt={"2rem"}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <BankDepositForm />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <BankDepositDetails />
                </Grid>
            </Grid>
        </Container >
    )
}

export default BankDeposit;