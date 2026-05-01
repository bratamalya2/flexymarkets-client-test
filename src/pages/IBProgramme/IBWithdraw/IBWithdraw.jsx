import { Button, Card, Divider, Stack, Typography, TextField, InputLabel, Container, Box, Skeleton } from '@mui/material'
import Grid from "@mui/material/Grid2"
import { useSelector, useDispatch } from 'react-redux';
import { useGetUserDataQuery } from '../../../globalState/userState/userStateApis';
// import SearchableDropdown from '../../../components/SearchableDropdown';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useIBWithdrawMutation } from '../../../globalState/ibState/ibStateApis';
import { setNotification } from '../../../globalState/notificationState/notificationStateSlice';

const IBWithdrawSchema = z.object({
    amount: z.string().min(2, "Please type your deposit amount")
});

function IBWithdraw() {

    const { token } = useSelector((state) => state.auth);
    const { data, isLoading } = useGetUserDataQuery(undefined, {
        skip: !token,
    });

    const totalIBIncome = !isLoading && data?.data?.assetData?.totalIBIncome
    const totalIBWithdrawl = !isLoading && data?.data?.assetData?.totalIBWithdrawl
    const availableIBIncome = totalIBIncome - totalIBWithdrawl


    const dispatch = useDispatch();

    const defaultValues = {
        amount: "",
    };

    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
        resolver: zodResolver(IBWithdrawSchema),
        defaultValues,
    });

    const [IBWithdraw, { isLoading: IBWithdrawLoading }] = useIBWithdrawMutation();

    const onSubmit = async (data) => {
        try {
            const response = await IBWithdraw(data).unwrap();
            if (response?.status) {
                dispatch(setNotification({ open: true, message: response?.message, severity: "success" }));
                reset(defaultValues);
            }
        } catch (error) {
            if (!error?.data?.status) {
                dispatch(setNotification({ open: true, message: error?.data?.message || "Failed to submit. Please try again later.", severity: "error" }));
            }
        }
    };


    return (
        <Stack>
            <Container>
                <Typography variant='h5' fontWeight={"700"} fontSize={"1.8rem"} mb={"2rem"}>IB Withdraw</Typography>
                <Card
                    component={"form"}
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{
                        boxShadow: "0 0px 0px 0 rgba(0, 0, 0, 0.19), 0 0px 8px 0 rgba(0, 0, 0, 0.19)",
                        borderRadius: "1.2rem",
                        padding: { xs: "1rem", md: "2rem" }
                    }}
                >
                    <Typography mx={{ xs: "1rem", md: "0" }}>Fill Details</Typography>
                    <Divider sx={{ my: "1.2rem" }} />
                    <Grid container size={12} spacing={3}>
                        {/* <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <InputLabel sx={{ mb: ".5rem" }}>Withdraw Type *</InputLabel>
                            <SearchableDropdown
                                options={[
                                    "Bank",
                                    "MT5",
                                    "Sub Client MT5"
                                ]} placeholder="Please Choose..." />
                        </Grid> */}
                        {/* <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <InputLabel sx={{ mb: ".5rem" }}>Withdraw To *</InputLabel>
                            <SearchableDropdown
                                options={[]} placeholder="Please Choose..." />
                        </Grid> */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <InputLabel sx={{ mb: ".5rem" }}>Amount IN USD *</InputLabel>
                                <InputLabel sx={{ mb: ".5rem" }}>{isLoading ? <Skeleton /> : availableIBIncome}</InputLabel>
                            </Box>
                            <TextField {...register("amount", { required: true })} size='small' fullWidth placeholder="Enter Amount IN USD" variant="outlined" />
                            {errors.amount && <Typography color="error" fontSize={"14px"}>{errors.amount.message}</Typography>}
                        </Grid>
                        {/* <Grid size={{ xs: 12, sm: 6 }}>
                            <InputLabel sx={{ mb: ".5rem" }}>Note *</InputLabel>
                            <TextField size='small' multiline fullWidth placeholder="Enter Note" variant="outlined" />
                        </Grid> */}
                    </Grid>
                    <Button
                        type='submit'
                        variant='contained'
                        disabled={IBWithdrawLoading}
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
                </Card>
            </Container>
        </Stack >
    )
}

export default IBWithdraw;