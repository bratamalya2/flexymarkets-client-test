import { Button, Stack, Typography } from '@mui/material';

function NegativeBalanceProtectionModalContent({ onClose }) {
  return (
    <Stack
      sx={{
        gap: "1rem"
      }}
    >
      <Typography fontSize={"1.8rem"} fontWeight={700}>Negative Balance Protection</Typography>
      <Typography fontSize={"14px"}>
        You can never lose more money than you put into your account. If a stop out causes all your positions to close in a negative balance, we will restore it to 0.
      </Typography>
      <Typography fontSize={"14px"}>
        For example, if a trading account with a balance of $100 has its positions closed with a loss of $150, the account will have a negative balance of -$50. With Negative Balance Protection, we will reset the balance to zero and you won’t need to cover the loss with your own money.
      </Typography>
      <Button
        size="small"
        variant="contained"
        onClick={onClose}
        sx={{
          textTransform: "none",
          boxShadow: "none",
          fontWeight: "400",
          fontSize: "16px",
          px: "2rem",
          color: "white",
          alignSelf: "flex-end",
          "&:hover": { boxShadow: "none" }
        }}
      >
        OK
      </Button>
    </Stack>
  )
}

export default NegativeBalanceProtectionModalContent;