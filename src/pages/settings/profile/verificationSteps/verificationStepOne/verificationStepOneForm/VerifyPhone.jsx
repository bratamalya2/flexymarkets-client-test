import { Stack, InputLabel, TextField, Box, Button, Typography } from "@mui/material";
import { verificationStepOneFormData } from "./verificationStepOneFormData";
import { useDispatch } from "react-redux";
import { setProfileVerificationStep } from "../../../../../../globalState/profileState/ProfileStateSlices";

function VerifyPhone() {

    const dispatch = useDispatch()

    return (
        <Stack>
            <Typography
                sx={{
                    fontWeight: 600,
                    lineHeight: "32px",
                    fontSize: "28px",
                    mb: ".2rem"
                }}
            >Enter your phone number</Typography>
            <Typography mb={"1rem"}>It is used to verify your account and future operations</Typography>
            <InputLabel sx={{ fontSize: "14px", mb: "1px" }}>Phone number *</InputLabel>
            <TextField size='small' fullWidth variant="outlined" />
            <Typography sx={{ fontSize: "12px", mb: "1px" }} color="textSecondary">We'll send a verification code to this number</Typography>
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
                    onClick={() => dispatch(setProfileVerificationStep("stepListing"))}
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
                    Continue
                </Button>
            </Box>
        </Stack>
    )
}

export default VerifyPhone;