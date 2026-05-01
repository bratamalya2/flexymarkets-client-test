import { Box, Button, Stack, Typography } from "@mui/material";
import OTPInput from "../../components/OTPInput";
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForgotPasswordVerifyOTPMutation } from "../../globalState/auth/authApis";
import { useForm } from "react-hook-form";
import { setNotification } from "../../globalState/notificationState/notificationStateSlice";
import { useRef } from "react";
import { setEmailOnOTPSent, setTempToken } from "../../globalState/auth/authSlice";
import { useForgotPasswordSendOTPMutation } from "../../globalState/auth/authApis";
import useCountdownTimer from "../../hooks/useCountdownTimer";
import { setResendOtpCreatedTime, setResendOtpExpiryTime } from "../../globalState/auth/authSlice";
import LostDeviceModalContent from "../../pages/settings/securitySettings/twoStepVerification/newMobileNumber/LostDeviceModalContent";
import ModalComponent from "../../components/ModalComponent";

function VerifyOtp() {

    const [searchParams, setSearchParams] = useSearchParams()

    const dispatch = useDispatch()

    const { resendOtpCreatedTime: createdTime, resendOtpExpiryTime: expireTime } = useSelector(state => state.auth)

    const timeLeft = useCountdownTimer(createdTime, expireTime, () => {
        dispatch(setResendOtpCreatedTime(null));
        dispatch(setResendOtpExpiryTime(null));
    });

    const isTimedOut = timeLeft <= 0;

    const formatTime = (seconds) => {
        const m = String(Math.floor(seconds / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        return `${m}:${s}`;
    };

    const { emailOnOTPSent } = useSelector(state => state.auth)
    const hasSubmitted = useRef(false);

    const defaultValues = {
        email: emailOnOTPSent,
        otp: ""
    };

    const { handleSubmit, setValue, watch } = useForm({
        defaultValues: defaultValues
    });

    const [forgotPasswordVerifyOTP] = useForgotPasswordVerifyOTPMutation();

    const onSubmit = async (data) => {

        try {

            const response = await forgotPasswordVerifyOTP(data).unwrap();

            if (response?.status) {
                dispatch(setTempToken(response?.data))
                dispatch(setEmailOnOTPSent(""))
                dispatch(setResendOtpCreatedTime(null));
                dispatch(setResendOtpExpiryTime(null));
                setSearchParams({ forgotPasswordStep: "enterNewPassword" })
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

    const [forgotPasswordSendOTP] = useForgotPasswordSendOTPMutation();

    const handleResendOtp = async () => {

        try {
            const data = { email: emailOnOTPSent }
            const response = await forgotPasswordSendOTP(data).unwrap();

            if (response?.status) {
                const now = Date.now();
                const expire = now + 2 * 60 * 1000;

                dispatch(setResendOtpCreatedTime(now));
                dispatch(setResendOtpExpiryTime(expire));
                dispatch(setNotification({ open: true, message: response?.message, severity: "success" }));
            }

        } catch (data) {
            if (!data?.data?.status) {
                dispatch(setNotification({ open: true, message: data?.data?.message || "Failed to sign in. Please try again later.", severity: "error" }));
            }
        }

    };

    return (
        <Stack sx={{ gap: "1.2rem" }}>
            <Typography
                sx={{
                    fontWeight: 600,
                    lineHeight: "32px",
                    fontSize: "28px"
                }}
            >Verify your account</Typography>
            <Stack
                sx={{
                    flexDirection: "row",
                    gap: "1rem",
                }}
            >
                <CommentOutlinedIcon />
                <Box>
                    <Typography fontWeight={"bold"}>Confirm the operation</Typography>
                    <Typography>Enter the confirmation code sent to {emailOnOTPSent}</Typography>
                </Box>
            </Stack>
            <OTPInput
                value={watch("otp")}
                onComplete={(value) => {
                    setValue("otp", value);
                    // handleSubmit(onSubmit)();
                    if (!hasSubmitted.current) {
                        hasSubmitted.current = true;
                        handleSubmit(onSubmit)();
                    }
                }} />
            <Box>
                {
                    isTimedOut
                        ?
                        <Typography
                            onClick={handleResendOtp}
                            sx={{
                                cursor: "pointer",
                                textDecoration: "underline",
                                fontSize: "14px",
                                color: "blue"
                            }}>Resend code</Typography>
                        :
                        <Typography fontSize={"14px"} color="textSecondary">
                            {`Get a new code in: ${formatTime(timeLeft)}`}
                        </Typography>
                }
                <Typography component={Link} fontSize={"14px"} color="blue">I didn't receive a code</Typography>
                {/* <Button></Button><LostDeviceModalContent /> */}
                {/* <ModalComponent
                    type="text"
                    btnName={"I didn't receive a code"}
                    Content={LostDeviceModalContent}
                    btnSx={{
                        cursor: "pointer",
                        textDecoration: "underline",
                        fontSize: "14px",
                        color: "blue"
                    }}
                /> */}
            </Box>
        </Stack>
    )
}

export default VerifyOtp;