import { useSelector } from 'react-redux'
import { Container, Divider, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useSearchParams } from 'react-router-dom'
import CryptoDepositForm from './CryptoDepositForm'
import CryptoDepositQR from './CryptoDepositQR'
import CryptoDepositDetails from './CryptoDepositDetails'


function CryptoDeposit() {

    const { depositQRData } = useSelector(state => state.payment)
    const [searchParams] = useSearchParams();
    const typeParam = searchParams.get('typeParam');

    return (
        <Container>
            <Typography sx={{ fontSize: "2rem", fontWeight: "700", mb: "2rem" }}>Crypto deposit</Typography>
            <Grid container size={12} spacing={3} mt={"2rem"}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <CryptoDepositForm typeParam={typeParam} />
                    {/* <CryptoDepositDetails /> */}
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    {depositQRData && <CryptoDepositQR />}
                </Grid>
            </Grid>
        </Container >
    )
}

export default CryptoDeposit;