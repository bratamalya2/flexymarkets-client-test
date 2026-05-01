import TeamStatusCard from './teamStatusCard/TeamStatusCard'
import { Container, Stack, Typography } from '@mui/material'
import RefferalClientsOfIB from './refferalClientsOfIB/RefferalClientsOfIB'

function MyClients() {
  return (
    <Stack>
      <Container><Typography variant='h5' fontWeight={"700"} fontSize={"1.8rem"} mb={"2rem"}>My Clients</Typography></Container>
      {/* <TeamStatusCard /> */}
      <RefferalClientsOfIB />
    </Stack>
  )
}

export default MyClients;