import { Box, Stack, Typography, Button } from "@mui/material";
import { pushNotificationsData } from "./pushNotificationsData";

const SHORT_BRAND_NAME = import.meta.env.VITE_SHORT_BRAND_NAME;

function PushNotifications() {
    return (
        <Stack width={"100%"}>
            <Typography fontWeight={500} fontSize="1rem" mb={"1.5rem"}>Push notifications</Typography>
            <Typography fontWeight={500} fontSize="1rem" mb={"1.5rem"}>Secure your funds</Typography>
            <Typography fontSize="14px">Enhance the security of your funds by using the latest version of the {SHORT_BRAND_NAME} Trade app. Enable push notifications to receive withdrawal confirmations on your mobile device.</Typography>
            <Stack
                sx={{
                    mt: "2rem",
                    flexDirection: "row"
                }}
            >
                {
                    pushNotificationsData.map((item, i) => (
                        <Box key={i} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <Typography fontSize={"1.2rem"} fontWeight={700}>{item.setpNo}</Typography>
                            <Typography textAlign={"center"}>{item.instruction}</Typography>
                            <Box component={"img"} src={item.qr} alt="error" height={"151px"} width={"151px"} />
                        </Box>
                    ))
                }
            </Stack>
            <Typography fontSize={"12px"} color="textSecondary">Use the QR codes above with your mobile device.</Typography>
            <Button
                size="small"
                variant="contained"
                sx={{
                    textTransform: "none",
                    boxShadow: "none",
                    fontWeight: "400",
                    fontSize: "16px",
                    px: "2rem",
                    mt: "2rem",
                    bgcolor: "#f3f5f7",
                    color: "black",
                    "&:hover": { boxShadow: "none", bgcolor: "#f3f5f7" }
                }}
                onClick={() => onClickCancelBtn(false)}
            >
                Cancel
            </Button>
        </Stack>
    )
}

export default PushNotifications;