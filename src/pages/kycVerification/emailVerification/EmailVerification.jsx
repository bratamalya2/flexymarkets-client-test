import { Box, Stack, Typography, TextField, InputLabel, Button } from '@mui/material'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as z from 'zod';
import { useVerifyEmailAndMobileMutation } from '../../../globalState/auth/authApis';
import { setNotification } from "../../../globalState/notificationState/notificationStateSlice";
import { setKycStep } from '../../../globalState/kycState/kycStateSlice';
import { useGetUserDataQuery } from '../../../globalState/userState/userStateApis';
import { useEffect } from 'react';
import { setResendOtpCreatedTime, setResendOtpExpiryTime } from '../../../globalState/auth/authSlice';


export const emailVerificationSchema = z.object({
    email: z.string().trim()
})

function EmailVerification() {

    const { token } = useSelector((state) => state.auth);
    const { data: userData } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })

    const userEmail = userData?.data?.userData?.email

    const defaultValues = {
        email: ""
    };

    const { register, reset, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(emailVerificationSchema),
        defaultValues: defaultValues
    });

    useEffect(() => {
        reset({ email: userEmail })
    }, [userEmail])

    const dispatch = useDispatch()

    const [verifyEmailAndMobile, { isLoading }] = useVerifyEmailAndMobileMutation();

    const onSubmit = async (data) => {

        try {

            const response = await verifyEmailAndMobile(data).unwrap();

            if (response?.status) {

                const now = Date.now();
                const expire = now + 2 * 60 * 1000;

                dispatch(setResendOtpCreatedTime(now));
                dispatch(setResendOtpExpiryTime(expire));

                dispatch(setKycStep("emailOtpVerification"))
                dispatch(setNotification({ open: true, message: response?.message, severity: "success" }));
            }

        } catch (data) {
            if (!data?.data?.status) {
                dispatch(setNotification({ open: true, message: data?.data?.message || "Failed to sign in. Please try again later.", severity: "error" }));
            }
        }

    };

    return (
        <Stack
            sx={{
                gap: ".7rem"
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
            >Verify your email</Typography>
            <Typography>It is used to verify your account and future operations</Typography>
            <Box>
                <InputLabel sx={{ mb: ".5rem", fontSize: "14px" }}>Email</InputLabel>
                <TextField disabled size='small' {...register("email", { required: true })} fullWidth placeholder="Enter email" />
                <InputLabel sx={{ mt: "2px", fontSize: "12px" }}>We'll send a verification code to this email</InputLabel>
                {errors.email && <Typography color="error" fontSize={"14px"}>{errors.email.message}</Typography>}
            </Box>
            <Button
                variant='contained'
                type='submit'
                disabled={isLoading}
                // onClick={() => dispatch(setKycStep("emailOtpVerification"))}
                sx={{
                    textTransform: "capitalize",
                    boxShadow: "none",
                    color: "white",
                    mt: '1.5rem',
                    alignSelf: "self-end",
                    "&:hover": {
                        boxShadow: "none"
                    }
                }}
            >Continue</Button>
        </Stack>
    )
}

export default EmailVerification;