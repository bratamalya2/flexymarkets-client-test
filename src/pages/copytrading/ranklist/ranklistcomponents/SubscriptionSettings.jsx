import { useEffect } from 'react';
import {
    Box,
    Button,
    Stack,
    TextField,
    MenuItem,
    Typography,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSubscribeMutation, useUpdateSubscribeMutation } from '../../../../globalState/socialTrading/socialTradingApis.js';
import { useDispatch, useSelector } from 'react-redux';
import { setNotification } from '../../../../globalState/notificationState/notificationStateSlice';
import { useGetUserDataQuery } from '../../../../globalState/userState/userStateApis';
import Selector from "../../../../components/Selector";


const subscriptionSchema = z.object({
    masterTraderId: z.union([z.string(), z.number()]).optional(),
    subscriptionId: z.union([z.string(), z.number()]).optional(),
    mt5Login: z.string().optional(),
    riskType: z.string().min(1, "Risk Type is required"),
    multiplier: z.coerce.number().min(0.01, "Multiplier must be at least 0.01"),
    maxLotSize: z.coerce.number().optional(),
}).superRefine((data, ctx) => {
    if (data.subscriptionId) {
        // Update mode
        if (data.maxLotSize === undefined || data.maxLotSize < 0.01) {
            ctx.addIssue({
                path: ["maxLotSize"],
                message: "Max Lot Size must be at least 0.01",
                code: z.ZodIssueCode.custom,
            });
        }
    } else {
        // Create mode
        if (!data.mt5Login || data.mt5Login.trim() === "") {
            ctx.addIssue({
                path: ["mt5Login"],
                message: "MT5 Login is required",
                code: z.ZodIssueCode.custom,
            });
        }
        if (!data.masterTraderId) {
            ctx.addIssue({
                path: ["masterTraderId"],
                message: "Master Trader ID is required",
                code: z.ZodIssueCode.custom,
            });
        }
    }
});

function SubscriptionSettings({ data }) {

    const { masterTraderId } = data || {};
    const isUpdate = data?.id ? true : false;

    const dispatch = useDispatch();
    const theme = useTheme();

    const { token } = useSelector((state) => state.auth);
    const { data: userData, isLoading: userDataLoading } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    });

    const MT5IDs = userDataLoading ? [] : (userData?.data?.mt5AccountList)?.filter(item => item?.accountType == "REAL")?.map(item => item?.Login);

    const defaultValues = isUpdate ? {
        subscriptionId: data?.id,
        riskType: data?.riskType || "MULTIPLIER",
        multiplier: data?.multiplier || 1.0,
        maxLotSize: data?.maxLotSize || 100,
    } : {
        masterTraderId: masterTraderId,
        mt5Login: "",
        riskType: "MULTIPLIER",
        multiplier: 1.0
    };

    const {
        control,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(subscriptionSchema),
        defaultValues: defaultValues,
        mode: "onChange",
    });

    useEffect(() => {
        if (masterTraderId) {
            setValue("masterTraderId", Number(masterTraderId), { shouldValidate: true });
        }
    }, [masterTraderId, setValue]);

    const [subscribe, { isLoading: isSubscribing }] = useSubscribeMutation();
    const [updateSubscribe, { isLoading: isUpdating }] = useUpdateSubscribeMutation();

    const isLoading = isSubscribing || isUpdating;

    const onSubmit = async (formData) => {

        try {
            let response;
            if (isUpdate) {
                const updatePayload = {
                    subscriptionId: formData.subscriptionId,
                    riskType: formData.riskType,
                    multiplier: formData.multiplier,
                    maxLotSize: formData.maxLotSize
                };
                response = await updateSubscribe(updatePayload).unwrap();
            } else {
                const payload = {
                    masterTraderId: formData.masterTraderId,
                    mt5Login: formData.mt5Login,
                    riskType: formData.riskType,
                    multiplier: formData.multiplier
                };
                response = await subscribe(payload).unwrap();
            }
            if (response?.status) {
                dispatch(setNotification({ open: true, message: response?.message, severity: "success" }));
                if (!isUpdate) reset(defaultValues);
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
                {isUpdate ? "Update Subscription" : "Subscription Settings"}
            </Typography>
            <Stack spacing={3}>
                {!isUpdate && (
                    <>
                        <Controller
                            name="mt5Login"
                            control={control}
                            render={() => (
                                <Selector
                                    items={MT5IDs}
                                    value={watch("mt5Login")}
                                    onChange={(e) => setValue("mt5Login", e.target.value, { shouldValidate: true })}
                                    shouldBeFullWidth={true}
                                    size="small"
                                />
                            )}
                        />
                        {errors.mt5Login && (<Typography variant="body2" color="error">{errors.mt5Login.message}</Typography>)}
                    </>
                )}

                <Controller
                    name="riskType"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            select
                            label="Risk Type"
                            fullWidth
                            size="small"
                            error={!!errors.riskType}
                            helperText={errors.riskType?.message}
                        >
                            <MenuItem value="MULTIPLIER">Multiplier</MenuItem>
                            <MenuItem value="FIXED_LOT">Fixed Lot</MenuItem>
                            <MenuItem value="PROPORTIONAL">Proportional</MenuItem>
                        </TextField>
                    )}
                />

                <Controller
                    name="multiplier"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Multiplier"
                            type="number"
                            fullWidth
                            size="small"
                            inputProps={{ step: "0.1", min: "0" }}
                            error={!!errors.multiplier}
                            helperText={errors.multiplier?.message}
                        />
                    )}
                />

                {isUpdate && <Controller
                    name="maxLotSize"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Max Lot Size"
                            type="number"
                            fullWidth
                            size="small"
                            inputProps={{ step: "0.01", min: "0" }}
                            error={!!errors.maxLotSize}
                            helperText={errors.maxLotSize?.message}
                        />
                    )}
                />}

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isLoading}
                >
                    {isUpdate ? "Update" : "Submit"}
                </Button>
            </Stack>
        </Box>
    );
}

export default SubscriptionSettings;