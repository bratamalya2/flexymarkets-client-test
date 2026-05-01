import { Box, Stack, Typography, Button } from "@mui/material";
import OTPInput from "../../../components/OTPInput";
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { setKycStep } from "../../../globalState/kycState/kycStateSlice";
import { setNotification } from "../../../globalState/notificationState/notificationStateSlice";
import { useRef } from "react";
import { useGetUserDataQuery } from "../../../globalState/userState/userStateApis";
import { useVerifyEmailAndMobileOtpMutation } from "../../../globalState/auth/authApis";
import { useVerifyEmailAndMobileMutation } from "../../../globalState/auth/authApis";
import useCountdownTimer from "../../../hooks/useCountdownTimer";
import { setResendOtpCreatedTime, setResendOtpExpiryTime } from "../../../globalState/auth/authSlice";


function PhoneOtpVerification({ onClose }) {

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

    const { token } = useSelector((state) => state.auth);
    const { data, isLoading, refetch } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })

    const userMobile = !isLoading && data?.data?.userData?.mobile

    const hasSubmitted = useRef(false)

    const defaultValues = {
        mobile: userMobile,
        otp: ""
    };

    const { handleSubmit, setValue, watch } = useForm({
        defaultValues: defaultValues
    });

    const [verifyEmailAndMobileOtp] = useVerifyEmailAndMobileOtpMutation();

    const handleClose = () => {
        if (typeof onClose === "function") {
            // onSetValue()
            onClose();
        } else {
            dispatch(setKycStep("personalInfoVerification"));
        }
    };

    const onSubmit = async (data) => {

        try {

            const response = await verifyEmailAndMobileOtp(data).unwrap();

            if (response?.status) {
                refetch()
                handleClose()
                dispatch(setResendOtpCreatedTime(null));
                dispatch(setResendOtpExpiryTime(null));
                // dispatch(setKycStep("personalInfoVerification"))
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

    const [verifyEmailAndMobile] = useVerifyEmailAndMobileMutation()

    const handleResendOtp = async () => {

        try {

            const response = await verifyEmailAndMobile({ mobile: userMobile }).unwrap()

            if (response?.status) {

                const now = Date.now();
                const expire = now + 2 * 60 * 1000;

                dispatch(setResendOtpCreatedTime(now));
                dispatch(setResendOtpExpiryTime(expire));

                dispatch(setNotification({ open: true, message: response?.message, severity: "success" }));
            }

        } catch (error) {
            if (!error?.data?.status) {
                dispatch(setNotification({ open: true, message: error?.data?.message || "Failed to submit. Please try again later.", severity: "error" }));
            }
        }
    }


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
            >Confirm phone number</Typography>
            <Stack
                sx={{
                    flexDirection: "row",
                    gap: "1rem",
                }}
            >
                <CommentOutlinedIcon />
                <Box>
                    <Typography>Enter the code we sent to:</Typography>
                    <Typography fontWeight={"bold"}>{userMobile}</Typography>
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
            </Box>
            {!(typeof onClose === "function")
                &&
                <Button
                    variant='contained'
                    type='submit'
                    disabled={isLoading}
                    onClick={() => dispatch(setKycStep("phoneVerification"))}
                    sx={{
                        textTransform: "capitalize",
                        boxShadow: "none",
                        color: "black",
                        bgcolor: "#dfdfdf",
                        alignSelf: "self-end",
                        "&:hover": {
                            boxShadow: "none",
                            bgcolor: "#dfdfdf"
                        }
                    }}
                >Back</Button>}
        </Stack >
    )
}

export default PhoneOtpVerification;