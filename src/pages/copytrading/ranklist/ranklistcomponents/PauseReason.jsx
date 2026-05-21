import {
    Box,
    Button,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { usePauseSubscriptionMutation } from '../../../../globalState/socialTrading/socialTradingApis.js';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../../../globalState/notificationState/notificationStateSlice';

const pauseSchema = z.object({
    subscriptionId: z.union([z.string(), z.number()]),
    reason: z.string().min(1, "Reason is required"),
});

function PauseReason({ data, onClose }) {

    const dispatch = useDispatch();

    const defaultValues = {
        subscriptionId: data?.subscriptionId || "",
        reason: "",
    };

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(pauseSchema),
        defaultValues: defaultValues,
        mode: "onChange",
    });

    const [pauseSubscription, { isLoading }] = usePauseSubscriptionMutation();

    const onSubmit = async (formData) => {

        try {
            const payload = {
                subscriptionId: formData.subscriptionId,
                reason: formData.reason
            };
            const response = await pauseSubscription(payload).unwrap();

            if (response?.status) {
                dispatch(setNotification({ open: true, message: response?.message, severity: "success" }));
                reset(defaultValues);
                if (onClose) onClose();
            }
        } catch (error) {
            if (!error?.data?.status) {
                dispatch(setNotification({ open: true, message: error?.data?.message || "Failed to submit. Please try again later.", severity: "error" }));
            }
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="h6" mb={2}>
                Pause Subscription
            </Typography>
            <Stack spacing={3}>
                <Controller
                    name="reason"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Reason for pausing"
                            fullWidth
                            multiline
                            rows={3}
                            size="small"
                            error={!!errors.reason}
                            helperText={errors.reason?.message}
                        />
                    )}
                />

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isLoading}
                >
                    Pause
                </Button>
            </Stack>
        </Box>
    );
}

export default PauseReason;