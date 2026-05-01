import { Button, Stack, Typography, InputAdornment, InputLabel, OutlinedInput, TextField, Box, Skeleton } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useDispatch, useSelector } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Selector from '../../../../components/Selector';
import { transferFormSchema } from './transferFormSchema';
import { useGetUserDataQuery, useMetaDepositMutation, useMetaWithdrawMutation } from '../../../../globalState/userState/userStateApis';
import { setNotification } from '../../../../globalState/notificationState/notificationStateSlice';


function TransferForm() {

    const dispatch = useDispatch()

    const defaultValues = {
        mt5Login: '',
        to: '',
        type: "2",
        amount: ''
    }

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(transferFormSchema),
        defaultValues
    });

    const fromAccountValue = watch("mt5Login")

    const { token } = useSelector((state) => state.auth);
    const { data, isLoading: userDataLoading, refetch } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })

    const walletBalance = data?.data?.assetData?.mainBalance

    const MT5IDs = userDataLoading ? [] : (data?.data?.mt5AccountList)?.filter(item => item?.accountType == "REAL")?.map(item => item?.Login)

    const [metaDeposit, { isLoading: metaDepositLoading }] = useMetaDepositMutation()
    const [metaWithdraw, { isLoading: metaWithdrawLoading }] = useMetaWithdrawMutation()

    const onSubmit = async (data) => {
        const mt5LoginID = (data?.mt5Login).includes("Wallet")
        const finalData = {
            mt5Login: mt5LoginID ? data?.to : data?.mt5Login,
            type: data?.type,
            amount: data?.amount
        }
        try {
            const response = fromAccountValue.includes("Wallet") ? await metaDeposit(finalData).unwrap() : await metaWithdraw(finalData).unwrap();
            if (response?.status) {
                dispatch(setNotification({ open: true, message: response?.message, severity: "success" }));
                reset(defaultValues);
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
            spacing={2}
        >
            <Box>
                <InputLabel sx={{ mb: "5px", fontSize: "13px" }}>From Account *</InputLabel>
                <Selector
                    items={[...MT5IDs, `Wallet (${userDataLoading ? <Skeleton /> : walletBalance})`]}
                    value={watch("mt5Login")}
                    onChange={(e) => setValue("mt5Login", e.target.value, { shouldValidate: true })}
                    shouldBeFullWidth={true}
                    disableItem={watch("to")}
                />
                {errors.network && <Typography color="error" fontSize={"14px"}>{errors.network.message}</Typography>}
            </Box>
            <Box>
                <InputLabel sx={{ mb: ".5rem", fontSize: "13px" }}>To Account *</InputLabel>
                <Selector
                    items={[...MT5IDs, "Wallet"]}
                    value={watch("to")}
                    onChange={(e) => setValue("to", e.target.value, { shouldValidate: true })}
                    shouldBeFullWidth={true}
                    disableItem={watch("mt5Login")}
                />
                {errors.remark && <Typography color="error" fontSize={"14px"}>{errors.remark.message}</Typography>}
            </Box>
            <Box sx={{ display: "none" }}>
                <InputLabel sx={{ mb: ".5rem" }}>Type *</InputLabel>
                <TextField
                    {...register("type")}
                    size='small' multiline fullWidth placeholder="Enter your deposit type" variant="outlined" />
                {errors.type && <Typography color="error" fontSize={"14px"}>{errors.type.message}</Typography>}
            </Box>
            <Box>
                <InputLabel sx={{ mb: "5px", fontSize: "13px" }}>Amount *</InputLabel>
                <OutlinedInput
                    endAdornment={<InputAdornment position="end">USD</InputAdornment>}
                    fullWidth
                    placeholder="0.00"
                    variant="outlined"
                    sx={{ fontWeight: "bold", fontSize: "20px" }}
                    {...register("amount")}
                />
                {errors.amount && <Typography color="error" fontSize={"14px"}>{errors.amount.message}</Typography>}
            </Box>
            <Stack sx={{ p: "1rem", my: "2rem", bgcolor: "#f8f9f9", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Typography color='black'>To be transfer</Typography>
                <Typography fontWeight={"bold"} fontSize={"2rem"} color='black'>{watch("amount") || "0"}<Typography fontWeight={"bold"} component={"span"} fontSize={"1.2rem"}>.00 USD</Typography></Typography>
            </Stack>
            <Button
                type='submit'
                variant='contained'
                disabled={metaDepositLoading || metaWithdrawLoading}
                sx={{
                    textTransform: "capitalize",
                    boxShadow: "none",
                    color: "white",
                    fontSize: "16px",
                    alignSelf: "flex-start",
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

export default TransferForm;