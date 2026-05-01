import { Stack, Button, Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import LostDeviceModal from "./LostDeviceModalContent";
import ModalComponent from "../../../../../components/ModalComponent"
import LostDeviceModalContent from "./LostDeviceModalContent";

const data = {
    "Make sure that": [
        "You have a strong network connection",
        "Your phone has available memory",
        "You do not have active SMS restrictions"
    ],
    Consider: [
        "Restarting your phone",
        "Requesting a new code"
    ]
};

function OtpNotReceived({ onClose }) {
    return (
        <Stack width={"100%"}>
            <Typography fontWeight={500} fontSize="1rem" mb={"1.5rem"}>
                New phone number
            </Typography>
            <Typography fontWeight={500} fontSize="1rem" mb={"1.5rem"}>
                If you did not receive an SMS
            </Typography>
            <Box>
                {Object.entries(data).map(([key, value]) => (
                    <Box key={key} mb={2}>
                        <Typography fontWeight={500}>{key}</Typography>
                        <ul style={{ marginTop: "0.5rem", paddingLeft: "1.5rem" }}>
                            {value.map((item, index) => (
                                <Typography key={index} component="li" fontSize="14px" color="textSecondary">
                                    {item}
                                </Typography>
                            ))}
                        </ul>
                    </Box>
                ))}
            </Box>
            <ModalComponent Content={LostDeviceModalContent} color={"#1172cc"} btnName={"I can't access my device"} type={"text"} />
            <Box
                sx={{
                    mt: "2rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                }}
            >
                <Button
                    variant="contained"
                    sx={{
                        textTransform: "none",
                        boxShadow: "none",
                        bgcolor: "#f3f5f7",
                        color: "black",
                        alignSelf: "flex-end",
                        "&:hover": { boxShadow: "none", bgcolor: "#f3f5f7" },
                    }}
                >
                    Back
                </Button>
                <Button
                    variant="contained"
                    sx={{
                        textTransform: "none",
                        boxShadow: "none",
                        bgcolor: "#f3f5f7",
                        color: "black",
                        "&:hover": { boxShadow: "none", bgcolor: "#f3f5f7", },
                    }}
                    onClick={onClose}
                >
                    Cancel
                </Button>
            </Box>
        </Stack>
    );
}

export default OtpNotReceived;