import { Button, InputLabel, Typography, TextField, Stack } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useForgotPasswordSendOTPMutation } from "../../globalState/auth/authApis";
import * as z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setNotification } from "../../globalState/notificationState/notificationStateSlice";
import { setEmailOnOTPSent } from "../../globalState/auth/authSlice";
import { setResendOtpCreatedTime, setResendOtpExpiryTime } from "../../globalState/auth/authSlice";
import { useSearchParams } from "react-router-dom";

export const forgotPasswordSchema = z.object({
    email: z.string().email("Please type a valid email").trim().min(1, "Email is required"),
})

function ForgotPassword() {

    const [searchParams, setSearchParams] = useSearchParams()

    const defaultValues = {
        email: ""
    };

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: defaultValues
    });

    const dispatch = useDispatch()

    const [forgotPasswordSendOTP, { isLoading }] = useForgotPasswordSendOTPMutation();

    const onSubmit = async (data) => {

        try {
            dispatch(setEmailOnOTPSent(data?.email))
            const response = await forgotPasswordSendOTP(data).unwrap();

            if (response?.status) {

                const now = Date.now();
                const expire = now + 2 * 60 * 1000;

                dispatch(setResendOtpCreatedTime(now));
                dispatch(setResendOtpExpiryTime(expire));
                setSearchParams({ forgotPasswordStep: "verifyOTP" })
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
            component={"form"}
            onSubmit={handleSubmit(onSubmit)}
        >
            <Grid container spacing={3} mt={"2rem"}>
                <Typography sx={{ fontSize: "1.7rem", fontWeight: "700", my: ".2rem" }}>Reset password</Typography>
                <Grid size={{ xs: 12 }}>
                    <InputLabel sx={{ mb: ".2rem", fontSize: "12px" }}>Your email address</InputLabel>
                    <TextField {...register("email", { required: true })} fullWidth size="small" />
                    {errors.email && <Typography color="error" fontSize={"14px"}>{errors.email.message}</Typography>}
                </Grid>
            </Grid>
            <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={isLoading}
                sx={{
                    mt: "3rem",
                    textTransform: "none",
                    boxShadow: "none",
                    color: "white",
                    py: ".6rem",
                    "&:hover": {
                        boxShadow: "none"
                    }
                }}
            >Continue</Button>
        </Stack>
    )
}

export default ForgotPassword;