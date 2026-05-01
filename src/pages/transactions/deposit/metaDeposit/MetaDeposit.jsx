import { useSelector } from 'react-redux'
import { Container, Divider, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import MetaDepositForm from './MetaDepositForm'


function MetaDeposit() {

    // const { depositQRData } = useSelector(state => state.payment)

    return (
        <Container>
            <Typography sx={{ fontSize: "2rem", fontWeight: "700", mb: "2rem" }}>Meta Deposit</Typography>
            <Grid container size={12} spacing={3} mt={"2rem"}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <MetaDepositForm />
                    {/* <CryptoDepositDetails /> */}
                </Grid>
                {/* <Grid size={{ xs: 12, md: 6 }}>
                    {depositQRData && <CryptoDepositQR />}
                </Grid> */}
            </Grid>
        </Container >
    )
}

export default MetaDeposit;