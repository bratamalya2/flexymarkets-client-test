import { Box, Stack, Typography } from "@mui/material";
import FreeVPS from "./FreeVPS";


function VirtualPrivateServer() {
  return (
    <Stack mt={"2rem"} gap={"2rem"}>
      <Box>
        <Typography fontWeight={700} fontSize={"1.8rem"}>Virtual Private Server</Typography>
        <Typography>Virtual Private Servers allow you to run automated trading strategies with fast and reliable execution. Read more</Typography>
      </Box>
      <FreeVPS />
    </Stack>
  )
}

export default VirtualPrivateServer;