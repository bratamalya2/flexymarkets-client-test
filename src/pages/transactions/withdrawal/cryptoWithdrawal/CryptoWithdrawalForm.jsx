// import { Button, Stack, Typography, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material';
// import Grid from '@mui/material/Grid2';
// import { useDispatch, useSelector } from 'react-redux';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm } from 'react-hook-form';
import Selector from "../../../../components/Selector"
import { useCryptoWithdrawMutation } from '../../../../globalState/userState/userStateApis';
// import { cryptoWithdrawalSchema } from './cryptoWithdrawalSchema';
// import { setNotification } from '../../../../globalState/notificationState/notificationStateSlice';
// import { useGetUserDataQuery } from '../../../../globalState/userState/userStateApis';

const networks = [
    // {
    //     icon: "token-branded:binance",
    //     name: "Binance (BP 20)"
    // },
    {
        image: "/transactionIcons/USDT_TRC20.svg",
        name: "TRON"
    },
]


// // const transferFromWalletItems = [
// //     { label: "Profit sharing", value: "MAIN" },
// //     { label: "Affiliate", value: "AFFLIATE" },
// //     { label: "Referral", value: "PACKAGE" },
// // ];

// const allMT5Accounts = [
//     {
//         image: "/MT5Icon.svg",
//         name: "12345678",
//         description: "0.00 USD"
//     },
//     {
//         image: "/MT5Icon.svg",
//         name: "87654321",
//         description: "0.00 USD"
//     }
// ]


// function CryptoWithdrawalForm() {

//     const dispatch = useDispatch();

//     const { token } = useSelector((state) => state.auth);
//     const { refetch } = useGetUserDataQuery(undefined, {
//         skip: !token,
//         refetchOnMountOrArgChange: true,
//     })

//     const defaultValues = {
//         network: "",
//         walletAddress: "",
//         amount: "",
//         password: "",
//         // image: null,
//     };

//     const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
//         resolver: zodResolver(cryptoWithdrawalSchema),
//         defaultValues,
//     });

//     const [cryptoWithdraw, { isLoading }] = useCryptoWithdrawMutation();

//     const onSubmit = async (data) => {
//         try {
//             const response = await cryptoWithdraw(data).unwrap();
//             if (response?.status) {
//                 dispatch(setNotification({ open: true, message: response?.message, severity: "success" }));
//                 reset(defaultValues);
//                 refetch()
//             }
//         } catch (error) {
//             if (!error?.data?.status) {
//                 dispatch(setNotification({ open: true, message: error?.data?.message || "Failed to submit. Please try again later.", severity: "error" }));
//             }
//         }
//     };

//     return (
//         <Stack
//             component={"form"}
//             onSubmit={handleSubmit(onSubmit)}
//         >
//             <Grid container spacing={2} size={12}>
//                 <Grid size={12}>
//                     <InputLabel sx={{ mb: "5px", fontSize: "13px" }}>Select Network *</InputLabel>
//                     <Selector
//                         items={networks}
//                         value={watch("network")}
//                         onChange={(e) => setValue("network", e.target.value, { shouldValidate: true })}
//                         shouldBeFullWidth={true}
//                     />
//                     {errors.network && <Typography color="error" fontSize={"14px"}>{errors.network.message}</Typography>}
//                 </Grid>
//                 <Grid size={12}>
//                     <InputLabel sx={{ mb: "5px", fontSize: "13px" }}>Withdraw To *</InputLabel>
//                     <TextField
//                         {...register("walletAddress")}
//                         size='small' multiline fullWidth placeholder="Enter your USDT address" variant="outlined" />
//                     {errors.walletAddress && <Typography color="error" fontSize={"14px"}>{errors.walletAddress.message}</Typography>}
//                 </Grid>
//                 <Grid size={12}>
//                     <InputLabel sx={{ mb: "5px", fontSize: "13px" }}>Password *</InputLabel>
//                     <TextField
//                         {...register("password")}
//                         size='small' multiline fullWidth placeholder="Enter your password" variant="outlined" />
//                     {errors.password && <Typography color="error" fontSize={"14px"}>{errors.password.message}</Typography>}
//                 </Grid>
//                 {/* <Grid size={12}>
//                             <InputLabel sx={{ mb: "5px", fontSize: "13px" }}>From account *</InputLabel>
//                             <Selector
//                                 items={allMT5Accounts}
//                                 value={watch("mt5Account")}
//                                 onChange={(e) => setValue("mt5Account", e.target.value, { shouldValidate: true })}
//                                 shouldBeFullWidth={true}
//                             />
//                             {errors.mt5Account && <Typography color="error" fontSize={"14px"}>{errors.mt5Account.message}</Typography>}
//                         </Grid> */}
//                 <Grid size={12}>
//                     <InputLabel sx={{ mb: "5px", fontSize: "13px" }}>Amount *</InputLabel>
//                     <OutlinedInput
//                         endAdornment={<InputAdornment position="end">USD</InputAdornment>}
//                         fullWidth
//                         placeholder="0.00"
//                         variant="outlined"
//                         sx={{ fontWeight: "bold", fontSize: "20px" }}
//                         {...register("amount")}
//                     />
//                     {errors.amount && <Typography color="error" fontSize={"14px"}>{errors.amount.message}</Typography>}
//                 </Grid>
//             </Grid>
//             <Stack sx={{ p: "1rem", my: "2rem", bgcolor: "#f8f9f9", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
//                 <Typography color='black'>To be withdraw</Typography>
//                 <Typography fontWeight={"bold"} fontSize={"2rem"} color='black'>{watch("amount") || "0"}<Typography fontWeight={"bold"} component={"span"} fontSize={"1.2rem"}>.00 USD</Typography></Typography>
//             </Stack>
//             <Button
//                 type='submit'
//                 variant='contained'
//                 disabled={isLoading}
//                 sx={{
//                     textTransform: "capitalize",
//                     boxShadow: "none",
//                     color: "white",
//                     fontSize: "16px",
//                     alignSelf: "flex-start",
//                     "&:hover": {
//                         boxShadow: "none",
//                     },
//                 }}
//             >
//                 Continue
//             </Button>
//         </Stack>
//     );
// }

// export default CryptoWithdrawalForm;

















import { Button, Stack, Typography, TextField, InputLabel, Box, Container } from '@mui/material'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { setNotification } from '../../../../globalState/notificationState/notificationStateSlice';
import { useBankWithdrawMutation } from '../../../../globalState/userState/userStateApis';
// import { getWithdrawalSchema } from './bankWithdrawalFormSchema';
import { cryptoWithdrawalSchema } from './cryptoWithdrawalSchema';
import { useGetUserDataQuery } from '../../../../globalState/userState/userStateApis';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';


function CryptoWithdrawalForm() {

    const [searchParams, setSearchParams] = useSearchParams()

    const amountParam = searchParams.get("amount")
    const walletAddressParam = searchParams.get("walletAddress")
    const networkParam = searchParams.get("network")
    // const remarkParam = searchParams.get("remark")
    const isAmountAndRemarkSubmittedParam = searchParams.get("isAmountAndRemarkSubmitted") || false

    const dispatch = useDispatch();

    const { token } = useSelector((state) => state.auth);
    const { refetch, data } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })

    const securityMethod = data?.data?.userData?.securityMethods

    const schema = useMemo(
        () => cryptoWithdrawalSchema({ securityMethod, isAmountAndRemarkSubmittedParam }),
        [securityMethod, isAmountAndRemarkSubmittedParam]
    );

    // const defaultValues = {
    //     amount: "",
    //     code: "",
    //     remark: ""
    // };

    const defaultValues = {
        network: "",
        walletAddress: "",
        amount: "",
        code: "",
        // image: null,
    };

    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues,
    });

    const [cryptoWithdraw, { isLoading }] = useCryptoWithdrawMutation();

    const onSubmit = async (data) => {
        try {

            const finalData = !isAmountAndRemarkSubmittedParam ? data : { amount: amountParam, walletAddress: walletAddressParam, network: networkParam, code: data?.code }

            const response = await cryptoWithdraw(finalData).unwrap();
            if (response?.status) {
                if (!isAmountAndRemarkSubmittedParam && securityMethod !== "GOOGLE-AUTH") {
                    setSearchParams({
                        amount: data?.amount,
                        walletAddress: data?.walletAddress,
                        network: data?.network,
                        isAmountAndRemarkSubmitted: true
                    });
                } else {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete("amount");
                    newParams.delete("walletAddress");
                    newParams.delete("network");
                    // newParams.delete("remark");
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
            <Stack
                component={"form"}
                onSubmit={handleSubmit(onSubmit)}
                spacing={2}
            >
                {(securityMethod == "GOOGLE-AUTH" || !isAmountAndRemarkSubmittedParam)
                    &&
                    <>
                        <Box>
                            <InputLabel sx={{ mb: ".5rem" }}>Select Network *</InputLabel>
                            <Selector
                                items={networks}
                                value={watch("network")}
                                onChange={(e) => setValue("network", e.target.value, { shouldValidate: true })}
                                shouldBeFullWidth={true}
                            />
                            {errors.network && <Typography color="error" fontSize={"14px"}>{errors.network.message}</Typography>}
                        </Box>
                        <Box>
                            <InputLabel sx={{ mb: ".5rem" }}>Withdraw To *</InputLabel>
                            <TextField
                                {...register("walletAddress")}
                                size='small' multiline fullWidth placeholder="Enter Wallet Address" variant="outlined" />
                            {errors.walletAddress && <Typography color="error" fontSize={"14px"}>{errors.walletAddress.message}</Typography>}
                        </Box>
                        <Box>
                            <InputLabel sx={{ mb: ".5rem" }}>Amount *</InputLabel>
                            <TextField {...register("amount")}
                                size='small' fullWidth placeholder="Enter Amount" variant="outlined" />
                            {errors.amount && <Typography color="error" fontSize={"14px"}>{errors.amount.message}</Typography>}
                        </Box>
                    </>
                }
                {(securityMethod == "GOOGLE-AUTH" || isAmountAndRemarkSubmittedParam) && <Box>
                    <InputLabel sx={{ mb: ".5rem" }}>Code *</InputLabel>
                    <TextField {...register("code")}
                        size='small' fullWidth placeholder="Enter Amount" variant="outlined" />
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
        </Stack>
    );
}

export default CryptoWithdrawalForm;