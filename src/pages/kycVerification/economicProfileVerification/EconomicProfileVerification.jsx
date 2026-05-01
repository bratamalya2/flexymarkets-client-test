import { Box, Stack, Typography, Button, LinearProgress } from '@mui/material'

function EconomicProfileVerification() {

  const verificationProgress = 20;

  const data = ["Investment", "Hedging", "Speculation"]

  return (
    <Stack
      sx={{
        gap: ".7rem"
      }}
    >
      <Box sx={{ my: 1.2 }}>
        <LinearProgress
          variant="determinate"
          value={verificationProgress}
          sx={{
            height: 10,
            borderRadius: 5,
            backgroundColor: '#f3f3f3',
            '& .MuiLinearProgress-bar': {
              borderRadius: 5,
              backgroundColor: '#FFD700',
            },
          }}
        />
        <Typography variant="caption" color="text.secondary">
          {verificationProgress}% verified
        </Typography>
      </Box>
      <Typography
        sx={{
          fontWeight: 600,
          lineHeight: "32px",
          fontSize: "28px"
        }}
      >What is the purpose of opening your account?</Typography>
      <Box sx={{ border: "1px solid #e2e4e4", borderRadius: ".5rem", mt: "1rem" }}>
        {
          data.map((item, i) => (
            <Box key={i} sx={{ p: "16px 20px", borderBottom: i !== (data.length - 1) && "1px solid #e2e4e4" }}>
              <Typography>{item}</Typography>
            </Box>
          ))
        }
      </Box>
      <Button
        variant='contained'
        disabled
        sx={{
          textTransform: "capitalize",
          boxShadow: "none",
          color: "white",
          mt: '1.5rem',
          alignSelf: "self-end",
          "&:hover": {
            boxShadow: "none"
          }
        }}
      >Back</Button>
    </Stack>
  )
}

export default EconomicProfileVerification;