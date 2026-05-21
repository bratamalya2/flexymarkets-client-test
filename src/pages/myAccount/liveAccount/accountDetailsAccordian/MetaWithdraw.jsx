import { Button, Stack, Typography, InputLabel, Box, OutlinedInput } from '@mui/material';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from 'react-redux';
import { setNotification } from '../../../../globalState/notificationState/notificationStateSlice';
import { useMetaWithdrawMutation } from '../../../../globalState/userState/userStateApis';
import { z } from 'zod';

export const metaWithdrawSchema = z.object({
    mt5Login: z.string().min(1, 'Please select at least one option'),
    type: z.string(),
    amount: z.coerce.number().positive('Amount must be greater than 0')
});

function MetaWithdraw({ data, onClose }) {

    const mt5LoginId = data?.login
    const walletBalance = data?.mainBalance
    const refetch = data?.refetch

    const defaultValues = {
        mt5Login: mt5LoginId,
        type: "2",
        amount: ''
    }

    const { register, reset, handleSubmit } = useForm({
        resolver: zodResolver(metaWithdrawSchema),
        defaultValues: defaultValues
    });


    const dispatch = useDispatch()

    const [metaWithdraw, { isLoading: metaDepositLoading }] = useMetaWithdrawMutation()

    const onSubmit = async (data) => {

        try {

            const response = await metaWithdraw(data).unwrap()

            if (response?.status) {
                dispatch(setNotification({ open: true, message: response?.message, severity: "success" }));
                reset(defaultValues);
                onClose?.()
                refetch()
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
            <Typography variant='h5' fontWeight={"700"} fontSize={"1.8rem"}>Meta Withdraw</Typography>
            <Box>
                <Typography my={"1rem"}>Account: # {mt5LoginId}</Typography>
                <Stack sx={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <InputLabel sx={{ mb: ".2rem", fontSize: "12px" }}>Amount *</InputLabel>
                    <InputLabel sx={{ mb: ".2rem", fontSize: "12px" }}>{walletBalance} USD</InputLabel>
                </Stack>
                <OutlinedInput
                    size="small"
                    fullWidth
                    {...register("amount", { required: true })}
                />
            </Box>
            <Button
                variant='contained'
                type='submit'
                disabled={metaDepositLoading}
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

export default MetaWithdraw;