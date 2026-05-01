import { TextField, Button, InputLabel, List, ListItem, Stack, Typography, OutlinedInput, InputAdornment, IconButton, Box, Divider, Checkbox, FormControlLabel } from "@mui/material";
import Grid from "@mui/material/Grid2";
import SearchableDropdown from "../../components/SearchableDropdown";
import { allCountryName } from "../../allCountryName";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useSignUpMutation } from "../../globalState/auth/authApis";
import { setNotification } from "../../globalState/notificationState/notificationStateSlice";
import { useForm } from "react-hook-form";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { signUpSchema } from "./SignUpSchema";

function SignUp() {

    let [searchParams] = useSearchParams();

    const referralCode = searchParams.get("referralCode") || null
    const isMarketing = searchParams.get("isMarketing") || null

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const defaultValues = {
        email: "",
        password: "",
        country: null,
        referralCode: referralCode ? referralCode : "",
        isMarketing: isMarketing ? isMarketing : "false"
    };

    const { setValue, register, handleSubmit, watch, formState: { errors } } = useForm({
        resolver: zodResolver(signUpSchema),
        defaultValues: defaultValues
    });

    const passwordValue = watch("password");

    const isLengthValid = passwordValue?.length >= 8 && passwordValue.length <= 15;
    const hasUpperLower = /[a-z]/.test(passwordValue) && /[A-Z]/.test(passwordValue);
    const hasNumber = /\d/.test(passwordValue);
    const hasSpecialChar = /[^a-zA-Z0-9]/.test(passwordValue);

    const [signUp, { isLoading }] = useSignUpMutation();

    const onSubmit = async (data) => {

        try {

            // const finalData = referralCode ? data : delete data.referralCode

            const response = await signUp(data).unwrap();

            if (response?.status) {
                navigate("/accounts/signIn")
                dispatch(setNotification({ open: true, message: response?.message, severity: "success" }));
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
                    <InputLabel sx={{ mb: ".2rem", fontSize: "12px" }}>Country / Region of residence *</InputLabel>
                    <SearchableDropdown
                        options={allCountryName}
                        value={watch("country")}
                        onChange={(selectedValue) => setValue("country", selectedValue, { shouldValidate: true })}
                    />
                    {errors.country && <Typography color="error" fontSize={"14px"}>{errors.country.message}</Typography>}
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <InputLabel sx={{ mb: ".2rem", fontSize: "12px" }}>Your email address *</InputLabel>
                    <TextField {...register("email", { required: true })} fullWidth size="small" />
                    {errors.email && <Typography color="error" fontSize={"14px"}>{errors.email.message}</Typography>}
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <InputLabel sx={{ mb: ".2rem", fontSize: "12px" }}>Create a password for the account *</InputLabel>
                    <OutlinedInput
                        size="small"
                        fullWidth
                        {...register("password", { required: true })}
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label={`toggle visibility`}
                                    onClick={handleClickShowPassword}
                                    edge="end"
                                >
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
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

                        {/* Optional score display */}
                        <Typography color="#aeaeae">
                            {
                                [isLengthValid, hasUpperLower, hasNumber, hasSpecialChar].filter(Boolean)
                                    .length
                            }
                            /4
                        </Typography>
                    </Stack>
                </Grid>
            </Grid>
            <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={isLoading}
                sx={{
                    my: "2rem",
                    textTransform: "none",
                    boxShadow: "none",
                    color: "white",
                    py: ".6rem",
                    "&:hover": {
                        boxShadow: "none"
                    }
                }}
            >Continue</Button>
            {referralCode && <Typography
                sx={{
                    display: "flex",
                    p: 2,
                    gap: ".5rem",
                    bgcolor: "#e8f3fe",
                    border: "1px solid #bedefd",
                    borderRadius: "10px"
                }}
            >Referral - {referralCode}</Typography>}
        </Stack>
    );
}

export default SignUp;