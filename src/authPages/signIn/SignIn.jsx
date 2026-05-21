import { OutlinedInput, InputAdornment, IconButton, Button, InputLabel, TextField, Typography, Box, Stack } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useState, useRef } from "react";
import { Link } from "react-router-dom";

import { useDispatch } from "react-redux";
import * as z from 'zod';
import { useLogInMutation } from "../../globalState/auth/authApis";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { setNotification } from "../../globalState/notificationState/notificationStateSlice"
import { setBanner } from "../../globalState/otherContentState/otherContentStateSlice";
import { initiateAuthSocketConnection, disconnectAuthSocket } from "../../socketENV/authSocketENV";


const signinSchema = z.object({
    userName: z.string().trim().min(1, "User name or email is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
})

function SignIn() {

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const defaultValues = {
        userName: "",
        password: ""
    };

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(signinSchema),
        defaultValues: defaultValues
    });

    const socketRef = useRef(null);
    const dispatch = useDispatch()
    const [signIn, { isLoading }] = useLogInMutation();

    const onSubmit = async (data) => {

        try {

            disconnectAuthSocket(); // Prevent stale socket's "logOut" event from wiping the new session
            const response = await signIn(data).unwrap();

            if (response?.status) {
                const token = response?.data?.token
                const loggedInUserId = response?.data?.userData?.id
                socketRef.current = initiateAuthSocketConnection({
                    token,
                    dispatch,
                    currentUserId: loggedInUserId
                });
                dispatch(setNotification({ open: true, message: response?.message, severity: "success" }));
                dispatch(setBanner(true))
            }

        } catch (error) {
            if (!error?.data?.status) {
                dispatch(setNotification({ open: true, message: error?.data?.message || "Failed to submit. Please try again later.", severity: "error" }));
            }
        }

    };

    return (
        <Stack
            component={"form"}
            onSubmit={handleSubmit(onSubmit)}
        >
            <Grid container size={12} spacing={3} mt={"2rem"}>
                <Grid size={{ xs: 12 }}>
                    <InputLabel sx={{ mb: ".2rem", fontSize: "12px" }}>Your email address</InputLabel>
                    <TextField {...register("userName", { required: true })} fullWidth size="small" />
                    {errors.userName && <Typography color="error" fontSize={"14px"}>{errors.userName.message}</Typography>}
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <InputLabel sx={{ mb: ".2rem", fontSize: "12px" }}>Password</InputLabel>
                    <OutlinedInput
                        {...register("password", { required: true })}
                        size='small'
                        fullWidth
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label={
                                        showPassword ? 'hide the password' : 'display the password'
                                    }
                                    onClick={handleClickShowPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                    {errors.password && <Typography color="error" fontSize={"14px"}>{errors.password.message}</Typography>}
                </Grid>
            </Grid>

            {/* Remember me + Forgot password row */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: "1rem" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input type="checkbox" style={{ width: "16px", height: "16px" }} />
                    <Typography fontSize="14px">Remember me</Typography>
                </Box>
                <Link to="/accounts/resetPassword" style={{ fontWeight: 600, color: "#1172cc", textDecoration: "none", fontSize: "14px" }}>
                    I forgot my password
                </Link>
            </Box>

            <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                disabled={isLoading}
                sx={{
                    mt: "2rem",
                    textTransform: "none",
                    boxShadow: "none",
                    color: "white",
                    py: ".6rem",
                    "&:hover": { boxShadow: "none" }
                }}
            >Continue</Button>

            {/* Sign Up link */}
            <Box sx={{ textAlign: "center", mt: "1.5rem" }}>
                <Typography variant="body2" color="text.secondary">
                    Don't have an account?{" "}
                    <Link to="/accounts/signUp" style={{ fontWeight: "bold", color: "black", textDecoration: "none" }}>
                        Sign Up
                    </Link>
                </Typography>
            </Box>
        </Stack>
    );
}

export default SignIn;