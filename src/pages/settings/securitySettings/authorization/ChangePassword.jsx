import {
  Box,
  Stack,
  Typography,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Button,
  useMediaQuery,
  List,
  ListItem
} from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useState } from "react";
import * as z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { useResetPasswordMutation } from "../../../../globalState/auth/authApis";
import { setNotification } from "../../../../globalState/notificationState/notificationStateSlice";
import { useForm } from "react-hook-form";

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

function ChangePassword({ onClickCancelBtn, setShowForm }) {
  const dispatch = useDispatch();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    cnfPassword: false
  });

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const defaultValues = {
    newPassword: "",
    cnfPassword: ""
  };

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(enterNewPasswordSchema),
    defaultValues
  });

  const passwordValue = watch("newPassword");

  const isLengthValid = passwordValue?.length >= 8 && passwordValue.length <= 15;
  const hasUpperLower = /[a-z]/.test(passwordValue) && /[A-Z]/.test(passwordValue);
  const hasNumber = /\d/.test(passwordValue);
  const hasSpecialChar = /[^a-zA-Z0-9]/.test(passwordValue);

  const onSubmit = async (data) => {
    try {
      const response = await resetPassword(data).unwrap();

      if (response?.status) {
        dispatch(setNotification({ open: true, message: response?.message, severity: "success" }));
        setShowForm?.(true);
      }

    } catch (error) {
      dispatch(setNotification({
        open: true,
        message: error?.data?.message || "Failed to update password. Please try again.",
        severity: "error"
      }));
    }
  };

  const matches = useMediaQuery('(max-width:850px)');

  return (
    <Stack
      width={matches ? "100%" : "75%"}
      spacing={3}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Typography fontWeight={500} fontSize="1rem">Change Password</Typography>

      <Box>
        <InputLabel sx={{ fontSize: "12px", mb: 0.5 }}>New password</InputLabel>
        <OutlinedInput
          size="small"
          fullWidth
          {...register("newPassword")}
          type={showPassword.newPassword ? 'text' : 'password'}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                onClick={() => togglePasswordVisibility("newPassword")}
                edge="end"
              >
                {showPassword.newPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
        />
        <Stack sx={{ flexDirection: "row", justifyContent: "space-between" }}>
          <List sx={{ listStyleType: "disc", pl: 2, py: 0 }}>
            <ListItem sx={{ display: "list-item", p: 0 }}>
              <Typography fontSize="12px" color={isLengthValid ? "#4caf50" : "error.main"}>
                Between 8–15 characters
              </Typography>
            </ListItem>
            <ListItem sx={{ display: "list-item", p: 0 }}>
              <Typography fontSize="12px" color={hasUpperLower ? "#4caf50" : "error.main"}>
                At least one upper and one lower case letter
              </Typography>
            </ListItem>
            <ListItem sx={{ display: "list-item", p: 0 }}>
              <Typography fontSize="12px" color={hasNumber ? "#4caf50" : "error.main"}>
                At least one number
              </Typography>
            </ListItem>
            <ListItem sx={{ display: "list-item", p: 0 }}>
              <Typography fontSize="12px" color={hasSpecialChar ? "#4caf50" : "error.main"}>
                At least one special character
              </Typography>
            </ListItem>
          </List>
          <Typography color="#aeaeae">
            {[isLengthValid, hasUpperLower, hasNumber, hasSpecialChar].filter(Boolean).length}
          </Typography>
        </Stack>
        {errors.newPassword && (
          <Typography color="error" fontSize="14px">
            {errors.newPassword.message}
          </Typography>
        )}
      </Box>

      <Box>
        <InputLabel sx={{ fontSize: "12px", mb: 0.5 }}>Repeat new password</InputLabel>
        <OutlinedInput
          size="small"
          fullWidth
          {...register("cnfPassword")}
          type={showPassword.cnfPassword ? 'text' : 'password'}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                onClick={() => togglePasswordVisibility("cnfPassword")}
                edge="end"
              >
                {showPassword.cnfPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
        />
        {errors.cnfPassword && (
          <Typography color="error" fontSize="14px">
            {errors.cnfPassword.message}
          </Typography>
        )}
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Button
          type="submit"
          size="small"
          variant="contained"
          disabled={isLoading}
          sx={{
            textTransform: "none",
            boxShadow: "none",
            fontWeight: "400",
            fontSize: "16px",
            px: "2rem",
            color: "white",
            "&:hover": { boxShadow: "none" }
          }}
        >
          Confirm
        </Button>
        <Button
          size="small"
          variant="contained"
          sx={{
            textTransform: "none",
            boxShadow: "none",
            fontWeight: "400",
            fontSize: "16px",
            px: "2rem",
            bgcolor: "#f3f5f7",
            color: "black",
            "&:hover": { boxShadow: "none", bgcolor: "#f3f5f7" }
          }}
          onClick={() => onClickCancelBtn(false)}
        >
          Cancel
        </Button>
      </Box>
    </Stack>
  );
}

export default ChangePassword;