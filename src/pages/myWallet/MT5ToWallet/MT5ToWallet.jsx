import { Button, Card, Divider, Stack, Typography, TextField, InputLabel, Container } from '@mui/material'
import Grid from "@mui/material/Grid2"
import SearchableDropdown from "../../../components/SearchableDropdown";


function MT5ToWallet() {

  return (
    <Stack mb={"10rem"}>
      <Container>
        <Typography variant='h5' fontWeight={"700"} fontSize={"1.8rem"} mb={"2rem"}>MT5 To Wallet</Typography>
        <Card
          sx={{
            boxShadow: "0 0px 0px 0 rgba(0, 0, 0, 0.19), 0 0px 8px 0 rgba(0, 0, 0, 0.19)",
            borderRadius: "1.2rem",
            padding: { xs: "1rem", md: "2rem" }
          }}
        >
          <Typography mx={{ xs: "1rem", md: "0" }}>Fill Details</Typography>
          <Divider sx={{ my: "1.2rem" }} />
          <Grid container size={12} spacing={3}>
            <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
              <InputLabel sx={{ mb: ".5rem" }}>Select Account *</InputLabel>
              <SearchableDropdown options={[]} placeholder="Please Choose..." />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
              <InputLabel sx={{ mb: ".5rem" }}>Amount IN USD *</InputLabel>
              <TextField size='small' fullWidth placeholder="Enter amount in USD" variant="outlined" />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
              <InputLabel sx={{ mb: ".5rem" }}>Note *</InputLabel>
              <TextField size='small' fullWidth placeholder="Enter Note" variant="outlined" />
            </Grid>
          </Grid>
          <Button
            variant='contained'
            sx={{
              textTransform: "capitalize",
              width: "5rem",
              boxShadow: "none",
              color: "white",
              mt: '1.5rem',
              "&:hover": {
                boxShadow: "none"
              }
            }}
          >Submit</Button>
        </Card>
      </Container>
    </Stack >
  )
}

export default MT5ToWallet;