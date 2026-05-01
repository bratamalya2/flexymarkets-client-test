import { Stack, InputLabel, TextField, Box, Button } from "@mui/material";
import { verificationStepOneFormData } from "./verificationStepOneFormData";

function VerificationStepOneForm({ setShowForm }) {

  const data = [
    {
      title: "Enter your email",
      description: "It is used to verify your account and future operations",
      fieldName: "Phone number",
      info: "We'll send a verification code to this email",
      status: ""
    },
    {
      title: "Enter your phone number",
      description: "It is used to verify your account and future operations",
      fieldName: "Email",
      info: "We'll send a verification code to this email",
      status: ""
    },
    {
      fieldName: "",
      info: "",
      status: ""
    }
  ]


  return (
    <Stack>
      <InputLabel sx={{ mb: ".5rem" }}>Account Name *</InputLabel>
      <TextField size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
      <Box
        sx={{
          my: "2rem",
          display: "flex",
          gap: "1rem",
          alignSelf: "flex-end"
        }}
      >
        <Button
          variant="contained"
          onClick={() => setShowForm(false)}
          sx={{
            textTransform: "none",
            boxShadow: "none",
            bgcolor: "#f3f5f7",
            color: "black",
            alignSelf: "self-start",
            "&:hover": { boxShadow: "none", bgcolor: "#f3f5f7" }
          }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          sx={{
            textTransform: "none",
            boxShadow: "none",
            color: "white",
            alignSelf: "self-start",
            "&:hover": { boxShadow: "none" }
          }}
        >
          Confirm
        </Button>
      </Box>
    </Stack>
  )
}

export default VerificationStepOneForm;