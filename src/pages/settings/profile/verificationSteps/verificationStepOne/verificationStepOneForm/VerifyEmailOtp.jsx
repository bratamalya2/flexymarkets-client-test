import { Box, Stack, Typography } from "@mui/material";
import OTPInput from "../../../../../../components/OTPInput";
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useVerifyEmailAndMobileOtpMutation } from "../../../../../../globalState/auth/authApis";
import { setNotification } from "../../../../../../globalState/notificationState/notificationStateSlice";
import { useRef } from "react";
import { setProfileVerificationStep } from "../../../../../../globalState/profileState/ProfileStateSlices";

function VerifyEmailOtp() {

    const dispatch = useDispatch()

    const { userData } = useSelector(state => state.auth)
    const hasSubmitted = useRef(false)

    const defaultValues = {
        email: userData?.email,
        otp: ""
    };

    const { handleSubmit, setValue, watch } = useForm({
        defaultValues: defaultValues
    });

    const [verifyEmailAndMobileOtp] = useVerifyEmailAndMobileOtpMutation();

    const onSubmit = async (data) => {

        try {

            const response = await verifyEmailAndMobileOtp(data).unwrap();

            if (response?.status) {
                dispatch(setProfileVerificationStep("mobile"))
                dispatch(setNotification({ open: true, message: response?.message, severity: "success" }));
            }

        } catch (error) {
            if (!error?.data?.status) {
                dispatch(setNotification({ open: true, message: error?.data?.message || "Failed to submit. Please try again later.", severity: "error" }));
            }
        } finally {
            hasSubmitted.current = false;
        }

    };

    return (
        <Stack
            sx={{
                gap: "1.2rem"
            }}
            component={"form"}
            onSubmit={handleSubmit(onSubmit)}
        >
            <Typography
                sx={{
                    fontWeight: 600,
                    lineHeight: "32px",
                    fontSize: "28px"
                }}
            >Confirm email</Typography>
            <Stack
                sx={{
                    flexDirection: "row",
                    gap: "1rem",
                }}
            >
                <CommentOutlinedIcon />
                <Box>
                    <Typography>Enter the code we sent to: {userData?.email}</Typography>
                </Box>
            </Stack>
            <OTPInput
                value={watch("otp")}
                onComplete={(value) => {
                    setValue("otp", value);
                    if (!hasSubmitted.current) {
                        hasSubmitted.current = true;
                        handleSubmit(onSubmit)();
                    }
                }}
            />
            {/* <Typography fontSize={"14px"} color="textSecondary">Get a new code in 00:52</Typography> */}
            <Typography component={Link} fontSize={"14px"} color="blue">I didn't receive a code</Typography>
        </Stack>
    )
}

export default VerifyEmailOtp;