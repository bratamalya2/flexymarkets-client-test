import { List, ListItem, Button, Stack, Typography, InputLabel, Box, OutlinedInput, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useState } from 'react';
import * as z from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from 'react-redux';
import { useUpdateMT5AccountMutation, useUpdateMT5PasswordMutation } from '../../globalState/mt5State/mt5StateApis';
import { setNotification } from '../../globalState/notificationState/notificationStateSlice';


const changeMT5PasswordSchema = z.object({
    PassMain: z.string()
        .min(8, "Password must be at least 8 characters")
        .max(15, "Password must be at most 15 characters")
        .regex(/[a-z]/, "Must include at least one lowercase letter")
        .regex(/[A-Z]/, "Must include at least one uppercase letter")
        .regex(/\d/, "Must include at least one number")
        .regex(/[^a-zA-Z0-9]/, "Must include at least one special character")
})

function ChangeMT5PasswordModalDetails({ data, onClose }) {

    const mt5LoginId = data?.mt5Login || data?.login

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const defaultValues = {
        PassMain: ""
    };

    const { watch, register, reset, handleSubmit } = useForm({
        resolver: zodResolver(changeMT5PasswordSchema),
        defaultValues: defaultValues
    });

    const passwordValue = watch("PassMain");

    const isLengthValid = passwordValue?.length >= 8 && passwordValue.length <= 15;
    const hasUpperLower = /[a-z]/.test(passwordValue) && /[A-Z]/.test(passwordValue);
    const hasNumber = /\d/.test(passwordValue);
    const hasSpecialChar = /[^a-zA-Z0-9]/.test(passwordValue);


    const dispatch = useDispatch()
    const [updateMT5Account, { isLoading }] = useUpdateMT5PasswordMutation();

    const onSubmit = async (data) => {

        try {

            const response = await updateMT5Account({ ...data, login: mt5LoginId }).unwrap();

            if (response?.status) {
                dispatch(setNotification({ open: true, message: response?.message, severity: "success" }));
                reset(defaultValues)
                onClose?.()
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
            <Typography variant='h5' fontWeight={"700"} fontSize={"1.8rem"}>Change trading password</Typography>
            <Box>
                <Typography my={"1rem"}>Account: # {mt5LoginId}</Typography>
                <InputLabel sx={{ mb: ".2rem", fontSize: "12px" }}>Change trading password *</InputLabel>
                <OutlinedInput
                    size="small"
                    fullWidth
                    {...register("PassMain", { required: true })}
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
            </Box>
            <Button
                variant='contained'
                type='submit'
                disabled={isLoading}
                sx={{
                    textTransform: "capitalize",
                    width: "5rem",
                    boxShadow: "none",
                    color: "white",
                    mt: '1.5rem',
                    "&:hover": {
                        boxShadow: "none"
                    }
                }}
            >Submit</Button>
        </Stack >
    )
}

export default ChangeMT5PasswordModalDetails;