import { Stack, Box, Typography, OutlinedInput, InputLabel, InputAdornment, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { setNotification } from "../../../../globalState/notificationState/notificationStateSlice"
import { useDispatch } from "react-redux";
import * as z from 'zod';
import { useAddDemoAccountBalanceMutation } from "../../../../globalState/mt5State/mt5StateApis";
import { useMt5AccountBalanceQuery } from "../../../../globalState/mt5State/mt5StateApis";
import { useEffect } from "react";

const schema = z.object({
    login: z.string().min(1, "login is required"),
    amount: z.string().min(1, "Please type the amount"),
})

function SetBalanceModalContent({ data, onClose }) {

    const login = data?.login

    const { refetch } = useMt5AccountBalanceQuery({ login: login, flag: 1 }, { skip: !login })

    const dispatch = useDispatch()

    const defaultValues = {
        login: login,
        amount: ""
    };

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues
    });

    useEffect(() => {
        reset({ login })
    }, [login])

    const [addDemoAccountBalance, { isLoading }] = useAddDemoAccountBalanceMutation()

    const onSubmit = async (data) => {

        try {
            const response = await addDemoAccountBalance(data).unwrap();

            if (response?.status) {
                dispatch(setNotification({ open: true, message: response?.message, severity: "success" }));
                reset(defaultValues)
                onClose()
                refetch()
            }

        } catch (data) {
            if (!data?.data?.status) {
                dispatch(setNotification({ open: true, message: data?.data?.message || "Failed to submit. Please try again later.", severity: "error" }));
            }
        }

    }

    return (
        <Stack>
            <Typography id="keep-mounted-modal-title"
                sx={{
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    mb: "1.2rem"
                }}
            >
                Set balance for demo account
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    gap: ".2rem"
                }}
            >
                <Typography color="textSecondary">Account:</Typography>
                <Typography fontWeight={500}>{login}</Typography>
            </Box>
            <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
                <InputLabel sx={{ mb: "1px", fontSize: "13px" }}>Amount</InputLabel>
                <OutlinedInput
                    {...register("amount", { required: true })}
                    size='small'
                    fullWidth
                    endAdornment={
                        <InputAdornment position="end">
                            <Typography>USD</Typography>
                        </InputAdornment>
                    }
                />
                {errors.amount && <Typography color="error" fontSize={"14px"}>{errors.amount.message}</Typography>}
                <Button
                    size="small"
                    variant="contained"
                    type="submit"
                    fullWidth
                    disabled={isLoading}
                    sx={{
                        textTransform: "none",
                        boxShadow: "none",
                        fontWeight: "400",
                        mt: "1rem",
                        fontSize: "16px",
                        px: "2rem",
                        "&:hover": { boxShadow: "none" }
                    }}
                >
                    Set Balance
                </Button>
            </Box>
        </Stack>
    )
}

export default SetBalanceModalContent;