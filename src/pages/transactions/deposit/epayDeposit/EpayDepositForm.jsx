import { Button, Stack, Typography, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useDispatch, useSelector } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useGetUserDataQuery } from "../../../../globalState/userState/userStateApis"
import { initiateEPaySocketConnection } from "../../../../socketENV/ePaySocketENV"
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import Selector from "../../../../components/Selector"


export const epayDepositSchema = z.object({
    amount: z.coerce.number().min(1, "Amount should not be 0").max(4000, 'Amount should not be greater than 4000'),
    login: z.string().min(1, 'Please select at least one option'),
});

function EpayDepositForm() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { token } = useSelector(state => state.auth);
    const { data, isLoading: userDataLoading, refetch } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })

    const MT5IDs = userDataLoading ? [] : (data?.data?.mt5AccountList)?.filter(item => item?.accountType == "REAL")?.map(item => item?.Login)

    const defaultValues = {
        amount: '',
        login: ''
    }

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        setError,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(epayDepositSchema),
        defaultValues
    });

    const onSubmit = async (data) => {

        const payload = (watch("login") == "Wallet") ? { amount: data?.amount } : data

        try {
            initiateEPaySocketConnection({
                token,
                payload,
                handleRedirectUrl: (redirectUrl) => {
                    if (redirectUrl) window.location.href = redirectUrl;
                },
                dispatch,
                refetch
            });
            // reset(defaultValues)

            // console.log('✅ Final Payment Status Received:', result);
            // dispatch(setNotification({ open: true, message: "Payment processed successfully!", severity: "info" }))
            // reset();
        } catch (err) {
            setError(err.message || 'An error occurred during payment processing');
        }
    };

    return (
        <Stack
            component={"form"}
            onSubmit={handleSubmit(onSubmit)}
        >
            <Grid container spacing={2} size={12}>
                <Grid size={12}>
                    <InputLabel sx={{ mb: "5px", fontSize: "13px" }}>Wallet / MT5 *</InputLabel>
                    <Selector
                        shouldBeFullWidth={true}
                        items={["Wallet", ...MT5IDs]}
                        value={watch("login")}
                        onChange={(e) => setValue("login", e.target.value, { shouldValidate: true })}
                    />
                    {errors.login && <Typography color="error" fontSize={"14px"}>{errors.login.message}</Typography>}
                </Grid>
                <Grid size={12}>
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
                </Grid>
            </Grid>
            <Stack sx={{ p: "1rem", my: "2rem", bgcolor: "#f8f9f9", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Typography color='black'>To be deposited</Typography>
                <Typography fontWeight={"bold"} fontSize={"2rem"} color='black'>{watch("amount") || "0"}<Typography fontWeight={"bold"} component={"span"} fontSize={"1.2rem"}>.00 USD</Typography></Typography>
            </Stack>
            <Button
                type='submit'
                variant='contained'
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
                Continue
            </Button>
        </Stack>
    );
}

export default EpayDepositForm;