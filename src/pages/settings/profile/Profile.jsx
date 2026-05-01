import { Stack } from '@mui/material';
import Account from './account/Account';
import VerificationSteps from './verificationSteps/VerificationSteps';

function Profile() {
  return (
    <Stack mt={"2rem"} gap={"2rem"}>
      <Account />
      <VerificationSteps />
    </Stack>
  )
}

export default Profile;