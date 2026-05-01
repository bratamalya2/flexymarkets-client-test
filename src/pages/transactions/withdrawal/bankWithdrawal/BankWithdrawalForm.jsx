import { Button, Stack, Typography, TextField, InputLabel, Box, Container } from '@mui/material'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { setNotification } from '../../../../globalState/notificationState/notificationStateSlice';
import { useBankWithdrawMutation } from '../../../../globalState/userState/userStateApis';
import { getWithdrawalSchema } from './bankWithdrawalFormSchema';
import { useGetUserDataQuery } from '../../../../globalState/userState/userStateApis';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';


function BankWithdrawalForm() {

    const [searchParams, setSearchParams] = useSearchParams()

    const amountParam = searchParams.get("amount")
    const remarkParam = searchParams.get("remark")
    const isAmountAndRemarkSubmittedParam = searchParams.get("isAmountAndRemarkSubmitted") || false

    const dispatch = useDispatch();

    const { token } = useSelector((state) => state.auth);
    const { refetch, data } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })

    const securityMethod = data?.data?.userData?.securityMethods

    const schema = useMemo(
        () => getWithdrawalSchema({ securityMethod, isAmountAndRemarkSubmittedParam }),
        [securityMethod, isAmountAndRemarkSubmittedParam]
    );

    const defaultValues = {
        amount: "",
        code: "",
        remark: ""
    };

    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues,
    });

    const [bankWithdraw, { isLoading }] = useBankWithdrawMutation();

    const onSubmit = async (data) => {
        try {

            const finalData = !isAmountAndRemarkSubmittedParam ? data : { amount: amountParam, remark: remarkParam, code: data?.code }

            const response = await bankWithdraw(finalData).unwrap();
            if (response?.status) {
                if (!isAmountAndRemarkSubmittedParam && securityMethod !== "GOOGLE-AUTH") {
                    setSearchParams({ amount: data?.amount, remark: data?.remark, isAmountAndRemarkSubmitted: true });
                } else {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete("amount");
                    newParams.delete("remark");
                    newParams.delete("isAmountAndRemarkSubmitted")
                    setSearchParams(newParams);
                }
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
        <Stack>
            <Container>
                <Typography sx={{ fontSize: "2rem", fontWeight: "700", mb: "2rem" }}>Bank withdrawal</Typography>
                <Stack
                    sx={{ width: { xs: "100%", md: "50%" } }}
                    component={"form"}
                    onSubmit={handleSubmit(onSubmit)}
                    spacing={2}
                >
                    {(securityMethod == "GOOGLE-AUTH" || !isAmountAndRemarkSubmittedParam)
                        &&
                        <>
                            <Box>
                                <InputLabel sx={{ mb: ".5rem" }}>Amount *</InputLabel>
                                <TextField {...register("amount")}
                                    size='small' fullWidth placeholder="Enter Amount" variant="outlined" />
                                {errors.amount && <Typography color="error" fontSize={"14px"}>{errors.amount.message}</Typography>}
                            </Box>
                            <Box>
                                <InputLabel sx={{ mb: ".5rem" }}>Remark *</InputLabel>
                                <TextField
                                    {...register("remark")}
                                    size='small' multiline fullWidth placeholder="Enter remark" variant="outlined" />
                                {errors.remark && <Typography color="error" fontSize={"14px"}>{errors.remark.message}</Typography>}
                            </Box>
                        </>
                    }
                    {(securityMethod == "GOOGLE-AUTH" || isAmountAndRemarkSubmittedParam) && <Box>
                        <InputLabel sx={{ mb: ".5rem" }}>Code *</InputLabel>
                        <TextField {...register("code")}
                            size='small' fullWidth placeholder="Enter Code" variant="outlined" />
                        {errors.code && <Typography color="error" fontSize={"14px"}>{errors.code.message}</Typography>}
                    </Box>}
                    <Stack sx={{ p: "1rem", my: "2rem", bgcolor: "#f8f9f9", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography color='black'>To be withdrawn</Typography>
                        <Typography fontWeight={"bold"} fontSize={"2rem"} color='black'>{watch("amount") || amountParam || "0"}<Typography fontWeight={"bold"} component={"span"} fontSize={"1.2rem"}>.00 USD</Typography></Typography>
                    </Stack>
                    <Button
                        type='submit'
                        variant='contained'
                        disabled={isLoading}
                        sx={{
                            textTransform: "capitalize",
                            boxShadow: "none",
                            color: "white",
                            mt: '1.5rem',
                            alignSelf: "self-start",
                            "&:hover": {
                                boxShadow: "none",
                            },
                        }}
                    >
                        Submit
                    </Button>
                </Stack>
            </Container>
        </Stack>
    );
}

export default BankWithdrawalForm;