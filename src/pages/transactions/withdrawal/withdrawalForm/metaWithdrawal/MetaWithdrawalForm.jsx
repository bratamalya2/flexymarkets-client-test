// import { Button, Stack, Typography, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material';
// import Grid from '@mui/material/Grid2';
// import { useDispatch, useSelector } from 'react-redux';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm } from 'react-hook-form';
// import Selector from "../../../../../components/Selector"
// import { cryptoWithdrawalSchema } from '../cryptoWithdrawal/cryptoWithdrawalSchema';
// import { setNotification } from '../../../../../globalState/notificationState/notificationStateSlice';
// import { useMetaWithdrawMutation } from '../../../../../globalState/userState/userStateApis';
// import { useGetUserDataQuery } from '../../../../../globalState/userState/userStateApis';


// function MetaWithdrawalForm() {

//     const dispatch = useDispatch()

//     const { token } = useSelector((state) => state.auth);
//     const { data, isLoading: userDataLoading } = useGetUserDataQuery(undefined, {
//         skip: !token,
//         refetchOnMountOrArgChange: true,
//     })

//     const MT5IDs = userDataLoading ? [] : (data?.data?.mt5AccountList)?.map(item => item?.Login)

//     const defaultValues = {
//         mt5Login: '',
//         amount: '',
//         type: "2"
//     }

//     const {
//         register,
//         handleSubmit,
//         reset,
//         watch,
//         setValue,
//         formState: { errors }
//     } = useForm({
//         resolver: zodResolver(cryptoWithdrawalSchema),
//         defaultValues
//     });

//     const [metaWithdraw, { isLoading }] = useMetaWithdrawMutation()

//     const onSubmit = async (data) => {

//         try {
//             const response = await metaWithdraw(data).unwrap();
//             if (response?.status) {
//                 dispatch(setNotification({ open: true, message: response?.message, severity: "success" }));
//                 reset(defaultValues);
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
//                     <InputLabel sx={{ mb: "5px", fontSize: "13px" }}>MT5 login *</InputLabel>
//                     <Selector
//                         items={MT5IDs}
//                         value={watch("mt5Login")}
//                         onChange={(e) => setValue("mt5Login", e.target.value, { shouldValidate: true })}
//                         shouldBeFullWidth={true}
//                     />
//                     {errors.mt5Login && <Typography color="error" fontSize={"14px"}>{errors.mt5Login.message}</Typography>}
//                 </Grid>
//                 <Grid size={12} sx={{ display: "none" }}>
//                     <InputLabel sx={{ mb: ".5rem" }}>Type *</InputLabel>
//                     <TextField
//                         {...register("type")}
//                         size='small' multiline fullWidth placeholder="Enter your deposit type" variant="outlined" />
//                     {errors.type && <Typography color="error" fontSize={"14px"}>{errors.type.message}</Typography>}
//                 </Grid>
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
//                 <Typography>To be withdraw</Typography>
//                 <Typography fontWeight={"bold"} fontSize={"2rem"}>{watch("amount") || "0"}<Typography fontWeight={"bold"} component={"span"} fontSize={"1.2rem"}>.00 USD</Typography></Typography>
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

// export default MetaWithdrawalForm;