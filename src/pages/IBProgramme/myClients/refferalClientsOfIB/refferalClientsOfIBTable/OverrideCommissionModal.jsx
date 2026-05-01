import { Button, Stack, Typography, InputLabel, Box, TextField } from '@mui/material';
import * as z from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from 'react-redux';
import { setNotification } from '../../../../../globalState/notificationState/notificationStateSlice';
import { useCommissionPlanOverrideMutation } from '../../../../../globalState/ibState/ibStateApis';
import { useGetReferralListQuery } from '../../../../../globalState/userState/userStateApis';
import SearchableSelector from '../../../../../components/SearchableSelector';
import { useState } from 'react';

const changeMT5PasswordSchema = z.object({
    planId: z.number({ required_error: "Plan is required" }).nullable().refine(
        (value) => value !== null,
        { message: "Plan is required" }
    ),
    userId: z.number({ required_error: "Sub IB is required" }).nullable().refine(
        (value) => value !== null,
        { message: "Sub IB is required" }
    ),
    amount: z.string().min(1, "Please type override amount"),
});

function OverrideCommissionModal({ data, onClose }) {
    const dispatch = useDispatch();
    const [commissionPlanOverride, { isLoading }] = useCommissionPlanOverrideMutation();
    const [searchSubIb, setSearchSubIb] = useState("");

    const planId = Number(data?.planId) || null;

    const defaultValues = {
        planId,
        userId: null,
        amount: "",
    };

    const { data: listData, isFetching } = useGetReferralListQuery();
    const referralListData =
        listData?.data?.userList?.filter((item) =>
            item?.isSubIb && item?.userName?.toLowerCase()?.includes(searchSubIb?.toLowerCase())
        ) || [];

    const {
        watch,
        register,
        setValue,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(changeMT5PasswordSchema),
        defaultValues,
    });

    const onSubmit = async (formData) => {
        try {
            // Example: assuming mt5LoginId is inside data
            const response = await commissionPlanOverride({
                ...formData,
                login: data?.mt5LoginId,
            }).unwrap();

            if (response?.status) {
                dispatch(
                    setNotification({
                        open: true,
                        message: response?.message,
                        severity: "success",
                    })
                );
                reset(defaultValues);
                onClose();
            }
        } catch (error) {
            dispatch(
                setNotification({
                    open: true,
                    message:
                        error?.data?.message ||
                        "Failed to submit. Please try again later.",
                    severity: "error",
                })
            );
        }
    };

    return (
        <Stack component={"form"} onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="h5" fontWeight="700" fontSize="1.8rem" mb="20px">
                Override Commission
            </Typography>

            <Box>
                <InputLabel sx={{ mb: ".2rem", fontSize: "12px" }}>Sub IB *</InputLabel>
                <SearchableSelector
                    width="100%"
                    items={referralListData.map((item) => ({
                        value: item.id,
                        name: `${item.name} (${item.userName})`,
                    }))}
                    value={watch("userId")}
                    onChange={(val) => setValue("userId", val, { shouldValidate: true })}
                    onSearchChange={(val) => setSearchSubIb(val)}
                    isLoading={isFetching}
                    shouldBeFullwidth={true}
                />
                {errors.userId && (
                    <Typography color="error" fontSize="14px">
                        {errors.userId.message}
                    </Typography>
                )}
            </Box>

            <Box mt="20px">
                <InputLabel sx={{ mb: ".2rem", fontSize: "12px" }}>Amount *</InputLabel>
                <TextField
                    placeholder="Amount to override"
                    size="small"
                    fullWidth
                    {...register("amount")}
                />
                {errors.amount && (
                    <Typography color="error" fontSize="14px">
                        {errors.amount.message}
                    </Typography>
                )}
            </Box>

            <Button
                variant="contained"
                type="submit"
                disabled={isLoading}
                sx={{
                    textTransform: "capitalize",
                    width: "5rem",
                    boxShadow: "none",
                    color: "white",
                    mt: "1.5rem",
                    "&:hover": {
                        boxShadow: "none",
                    },
                }}
            >
                Submit
            </Button>
        </Stack>
    );
}

export default OverrideCommissionModal;