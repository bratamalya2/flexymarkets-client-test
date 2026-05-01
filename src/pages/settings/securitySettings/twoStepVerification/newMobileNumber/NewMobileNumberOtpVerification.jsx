import { Stack, Button, Box, Typography } from "@mui/material";
import OTPInput from "../../../../../components/OTPInput";
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import { Link } from "react-router-dom";

const data = {
    logo: ChatOutlinedIcon,
    content: "Enter the code we sent to:",
    value: "+1234567898"
}

function NewMobileNumberOtpVerification({ onClose }) {
    return (
        <Stack width={"100%"}>
            <Typography fontWeight={500} fontSize="1rem" mb={"1.5rem"}>New phone number</Typography>
            <Typography fontWeight={500} fontSize="1rem" mb={"1.5rem"}>Confirm the new phone number</Typography>
            <Box
                sx={{
                    display: 'flex',
                    gap: "1rem",
                    mb: '2rem',
                    // alignItems:"center"
                }}
            >
                <data.logo />
                <Box>
                    <Typography>{data.content}</Typography>
                    <Typography fontWeight={500}>{data.value}</Typography>
                </Box>
            </Box>
            <OTPInput length={6} />
            <Box
                sx={{
                    mt: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: ".5rem"
                }}
            >
                <Typography component={Link} color="#1172cc">Get a new code</Typography>
                <Typography component={Link} color="#1172cc">I didn't receive a code</Typography>
            </Box>
            <Button
                variant="contained"
                sx={{
                    textTransform: "none",
                    mt: "2rem",
                    boxShadow: "none",
                    bgcolor: "#f3f5f7",
                    fontWeight: "400",
                    color: "black",
                    "&:hover": { boxShadow: "none", bgcolor: "#f3f5f7" }
                }}
                onClick={onClose}
            >
                Cancel
            </Button>
        </Stack>
    )
}

export default NewMobileNumberOtpVerification;