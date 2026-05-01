import { Stack } from '@mui/material';
import Authorization from './authorization/Authorization';
import TwoStepVerification from './twoStepVerification/TwoStepVerification';
import SecurityAndTermination from './securityAndTermination/SecurityAndTermination';

function SecuritySettings() {
  return (
    <Stack mt={"2rem"} gap={"2rem"}>
      <Authorization />
      <TwoStepVerification />
      <SecurityAndTermination />
    </Stack>
  )
}

export default SecuritySettings;