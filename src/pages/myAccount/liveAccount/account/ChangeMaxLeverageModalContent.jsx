import { Stack, Box, Typography, OutlinedInput, InputLabel, InputAdornment, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { setNotification } from "../../../../globalState/notificationState/notificationStateSlice"
import { useDispatch } from "react-redux";
import * as z from 'zod';
import { useUpdateMT5AccountMutation } from "../../../../globalState/mt5State/mt5StateApis";
import { useEffect } from "react";
import Selector from "../../../../components/Selector"

const schema = z.object({
    login: z.string().min(1, "login is required"),
    Leverage: z.number().min(1, "Leverage is required"),
})

function ChangeMaxLeverageModalContent({ data, onClose }) {

    const maxLeverage = data?.accountInfo?.accountTypeDetails?.groupMaxLeverage / 100 || 0

    let step = 100;

    let leverageOptions = Array.from({ length: maxLeverage }, (_, i) => step * (i + 1));

    const login = data?.mt5Login

    const dispatch = useDispatch()

    const defaultValues = {
        login: login,
        Leverage: 0,
    };

    const { setValue, handleSubmit, watch, reset, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues
    });

    useEffect(() => {
        reset({ login })
    }, [login])

    const [updateMT5Account, { isLoading }] = useUpdateMT5AccountMutation()

    const onSubmit = async (data) => {

        try {
            const response = await updateMT5Account(data).unwrap();

            if (response?.status) {
                dispatch(setNotification({ open: true, message: response?.message, severity: "success" }));
                reset(defaultValues)
                onClose()
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
                Change max leverage
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
                <InputLabel sx={{ mb: "1px", fontSize: "13px" }}>Leverage</InputLabel>
                {/* <OutlinedInput
                    {...register("Leverage", { required: true })}
                    size='small'
                    fullWidth
                /> */}
                <Selector
                    items={leverageOptions}
                    shouldBeFullWidth={true}
                    value={watch("Leverage")}
                    onChange={(e) => setValue("Leverage", e.target.value, { shouldValidate: true })}
                />
                {errors.Leverage && <Typography color="error" fontSize={"14px"}>{errors.Leverage.message}</Typography>}
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
                    Set Leverage
                </Button>
            </Box>
        </Stack>
    )
}

export default ChangeMaxLeverageModalContent;