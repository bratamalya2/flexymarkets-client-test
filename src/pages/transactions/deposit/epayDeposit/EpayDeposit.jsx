import { useSelector } from 'react-redux'
import { Container, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
// import CryptoDepositQR from './CryptoDepositQR'
import EpayDepositForm from './EpayDepositForm'


function EpayDeposit() {

    // const { depositQRData } = useSelector(state => state.payment)

    return (
        <Container>
            <Typography sx={{ fontSize: "2rem", fontWeight: "700", mb: "2rem" }}>E - Pay deposit</Typography>
            <Grid container size={12} spacing={3} mt={"2rem"}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <EpayDepositForm />
                    {/* <CryptoDepositDetails /> */}
                </Grid>
            </Grid>
        </Container >
    )
}

export default EpayDeposit;