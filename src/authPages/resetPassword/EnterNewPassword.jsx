import { Button, InputLabel, Typography, List, ListItem, Stack, OutlinedInput, InputAdornment, IconButton } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState } from "react";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod';
import { setNotification } from "../../globalState/notificationState/notificationStateSlice";
import { useResetPasswordMutation } from "../../globalState/auth/authApis";
import { useNavigate } from "react-router-dom";
import { setTempToken } from "../../globalState/auth/authSlice";


export const enterNewPasswordSchema = z.object({
    newPassword: z.string()
        .min(8, "Password must be at least 8 characters")
        .max(15, "Password must be at most 15 characters")
        .regex(/[a-z]/, "Must include at least one lowercase letter")
        .regex(/[A-Z]/, "Must include at least one uppercase letter")
        .regex(/\d/, "Must include at least one number")
        .regex(/[^a-zA-Z0-9]/, "Must include at least one special character"),
    cnfPassword: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.newPassword === data.cnfPassword, {
    path: ["cnfPassword"],
    message: "Passwords do not match",
});


function EnterNewPassword() {

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleClickPassword = () => setPassword((show) => !show);
    const handleClickConfirmPassword = () => setConfirmPassword((show) => !show);

    const defaultValues = {
        newPassword: "",
        cnfPassword: ""
    };

    const { register, watch, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(enterNewPasswordSchema),
        defaultValues: defaultValues
    });

    const passwordValue = watch("newPassword");

    const isLengthValid = passwordValue?.length >= 8 && passwordValue.length <= 15;
    const hasUpperLower = /[a-z]/.test(passwordValue) && /[A-Z]/.test(passwordValue);
    const hasNumber = /\d/.test(passwordValue);
    const hasSpecialChar = /[^a-zA-Z0-9]/.test(passwordValue);

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [resetPassword, { isLoading }] = useResetPasswordMutation();

    const onSubmit = async (data) => {

        try {

            const response = await resetPassword(data).unwrap();

            if (response?.status) {
                navigate("/accounts/signIn")
                dispatch(setNotification({ open: true, message: response?.message, severity: "success" }));
                dispatch(setTempToken(null))
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
                <Typography sx={{ fontSize: "1.7rem", fontWeight: "700" }}>Reset password</Typography>
                <Typography sx={{ fontWeight: "bold" }}>Enter a new password twice</Typography>
                <Grid size={{ xs: 12 }}>
                    <InputLabel sx={{ mb: ".2rem", fontSize: "12px" }}>Password</InputLabel>
                    <OutlinedInput
                        size="small"
                        fullWidth
                        {...register("newPassword", { required: true })}
                        type={password ? 'text' : 'password'}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label={`toggle visibility`}
                                    onClick={handleClickPassword}
                                    edge="end"
                                >
                                    {password ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                    <Stack sx={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <List sx={{ listStyleType: "disc", pl: 2, py: 0 }}>
                            <ListItem sx={{ display: "list-item", p: 0 }}>
                                <Typography
                                    sx={{
                                        fontSize: "12px",
                                        color: isLengthValid ? "#4caf50" : "error.main",
                                    }}
                                >
                                    Between 8–15 characters
                                </Typography>
                            </ListItem>
                            <ListItem sx={{ display: "list-item", p: 0 }}>
                                <Typography
                                    sx={{
                                        fontSize: "12px",
                                        color: hasUpperLower ? "#4caf50" : "error.main",
                                    }}
                                >
                                    At least one upper and one lower case letter
                                </Typography>
                            </ListItem>
                            <ListItem sx={{ display: "list-item", p: 0 }}>
                                <Typography
                                    sx={{
                                        fontSize: "12px",
                                        color: hasNumber ? "#4caf50" : "error.main",
                                    }}
                                >
                                    At least one number
                                </Typography>
                            </ListItem>
                            <ListItem sx={{ display: "list-item", p: 0 }}>
                                <Typography
                                    sx={{
                                        fontSize: "12px",
                                        color: hasSpecialChar ? "#4caf50" : "error.main",
                                    }}
                                >
                                    At least one special character
                                </Typography>
                            </ListItem>
                        </List>
                        <Typography color="#aeaeae">
                            {
                                [isLengthValid, hasUpperLower, hasNumber, hasSpecialChar].filter(Boolean)
                                    .length
                            }
                        </Typography>
                    </Stack>
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <InputLabel sx={{ mb: ".2rem", fontSize: "12px" }}>Confirm new password</InputLabel>
                    <OutlinedInput
                        size="small"
                        {...register("cnfPassword", { required: true })}
                        fullWidth
                        type={confirmPassword ? 'text' : 'password'}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label={`toggle visibility`}
                                    onClick={handleClickConfirmPassword}
                                    edge="end"
                                >
                                    {confirmPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                    {errors.cnfPassword && <Typography color="error" fontSize={"14px"}>{errors.cnfPassword.message}</Typography>}
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
            >Change password</Button>
        </Stack>
    )
}

export default EnterNewPassword;