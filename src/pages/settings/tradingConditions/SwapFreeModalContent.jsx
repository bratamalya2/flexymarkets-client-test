import { Box, Divider, Stack, Typography, Button } from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';

function SwapFreeModalContent({ onClose }) {
  return (
    <Stack
      sx={{
        gap: "1.2rem"
      }}
    >
      <Typography fontSize={"1.8rem"} fontWeight={700}>Swap-Free</Typography>
      <Typography>No more overnight charges. Trade popular instruments without paying swaps. Your qualification for swap-free status depends on your trading activity.</Typography>
      <Box
        sx={{
          display: "flex"
        }}
      >
        <Typography>Swap-free status:</Typography>
        <Typography
          sx={{
            ml: "2rem",
            fontSize: "14px",
            color: "#29834e",
            p: "2px 10px",
            borderRadius: "5rem",
            bgcolor: "#d9ede2"
          }}
        >Qualified</Typography>
      </Box>
      <Divider sx={{ borderBottomWidth: ".5rem", borderRadius: "2rem", borderColor: "#46cd7c" }} />
      <Typography>To qualify for and maintain swap-free status, you need to trade primarily during the day and hold minimal overnight positions.</Typography>
      <Typography>Check the Help Center for a list of instruments available for swap-free trading.</Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          color: "#1172cc",
          cursor: "pointer"
        }}
      >
        <Typography fontSize={"14px"}>Read more in our Help Center</Typography>
        <LaunchIcon sx={{ fontSize: "1rem" }} />
      </Box>
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
          alignSelf: "flex-end",
          color: "white",
          "&:hover": { boxShadow: "none" }
        }}
      >
        OK
      </Button>
    </Stack>
  )
}

export default SwapFreeModalContent;