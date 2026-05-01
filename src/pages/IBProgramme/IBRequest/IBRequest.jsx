// import { Card, Container, Stack, Button, Typography, Tooltip, InputLabel, TextField } from '@mui/material';
// import { useRequestForIBMutation } from '../../../globalState/ibState/ibStateApis';
// import { setNotification } from '../../../globalState/notificationState/notificationStateSlice';
// import { useDispatch, useSelector } from 'react-redux';
// import { setRequestStatus } from '../../../globalState/ibState/ibStateSlice';
// import { useGetUserDataQuery } from "../../../globalState/userState/userStateApis"
// import Grid from '@mui/material/Grid2';
// import { IBRequestSchema } from './IBRequestSchema';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';


// function IBRequest() {

//     const { token } = useSelector((state) => state.auth);
//     const { data, isLoading: userDataLoading } = useGetUserDataQuery(undefined, {
//         skip: !token,
//         refetchOnMountOrArgChange: true,
//     })

//     // const isKycVerified = !userDataLoading && data?.data?.userData?.isKycVerified
//     // const isAddressAdded = !userDataLoading && data?.data?.userData?.address
//     const isEmailVerified = !userDataLoading && data?.data?.userData?.isEmailVerified
//     const isMobileVerified = !userDataLoading && data?.data?.userData?.isMobileVerified
//     const isNameRegistered = !userDataLoading && data?.data?.userData?.name

//     const levelOneVerification = !!(isEmailVerified && isNameRegistered)

//     const dispatch = useDispatch();
//     const [requestForIB, { isLoading }] = useRequestForIBMutation();

//     const { isRequestSent } = useSelector(state => state.ib)


//     const defaultValues = {
//         "user": 1,
//         "firstName": "Amit",
//         "lastName": "Sharma",
//         "primaryEmail": "amit@gmail.com",
//         "ccountryName": "India",
//         "email": "amit.personal@gmail.com",
//         "secondryEmail": "amit.work@gmail.com",
//         "countryCode": "+91",
//         "mobile": "9876543210",
//         "gender": "M",
//         "assingTo": "Manager1",
//         "dob": "1992-05-12",
//         "walletId": "WALLET12345",
//         "nationality": "Indian",
//         "leadSource": "Google Ads",
//         "ftd": "500",
//         "kycStatus": "PENDING",
//         "isConvertedFromLead": "YES",
//         "loginVerified": "YES",
//         "createdTime": "2025-02-25",
//         "modifiedTime": "2025-02-25",
//         "source": "WEB",
//         "isAgree": true,
//         "referenceId": "REF2025",
//         "whereDidYouFindUs": "Facebook",
//         "withdrawAllowed": "YES",
//         "lastLoginIp": "192.168.1.10",
//         "kycFormEdit": "NO",
//         "plainPassword": "Test@123",
//         "entity": "INDIVIDUAL",

//         "ibName": "Amit Traders",
//         "yearsOfExp": "3",
//         "noOfExistingClient": "10",
//         "averageVolumePerMonth": "2500",
//         "ibStatus": "PENDING",
//         "rejectedReason": null,
//         "childProfile": "",
//         "parentAffliateCode": "IB100",
//         "ibLevel": "LEVEL 1",
//         "ibHierarchy": "PARENT",
//         "parentProfile": null,
//         "ibNode": "NODE1",
//         "distributMaxComission": "30%",
//         "maxIbCommAmtPerLot": "5",
//         "preferableAssignedUserId": "2",
//         "comissionPercentage": "12",

//         "portalUser": true,
//         "language": "en",
//         "timeZone": "Asia/Kolkata",
//         "timeFormate": "24h",
//         "dateFormate": "DD-MM-YYYY",
//         "isSetPreference": "YES",

//         "maillingStreet": "MG Road",
//         "maillingCity": "Bangalore",
//         "maillingState": "Karnataka",
//         "maillingZip": "560001",
//         "maillingPoBox": "12345",
//         "maillingCountry": "India",

//         "profileImage": "profile.jpg",
//         "isDeleted": false
//     }


//     const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
//         resolver: zodResolver(IBRequestSchema),
//         defaultValues,
//     });

//     const onSubmit = async () => {
//         try {
//             const response = await requestForIB().unwrap();
//             if (response?.status) {
//                 dispatch(setNotification({
//                     open: true,
//                     message: response?.message || "Request submitted successfully.",
//                     severity: "success"
//                 }));
//                 dispatch(setRequestStatus(true));
//             }
//         } catch (error) {
//             dispatch(setNotification({
//                 open: true,
//                 message: error?.data?.message || "Failed to submit. Please try again later.",
//                 severity: "error"
//             }));
//         }
//     };

//     return (
//         <Container>
//             <Typography sx={{ fontSize: "2rem", fontWeight: "700", mb: "2rem" }}>IB Request Form</Typography>
//             <Stack sx={{ flexDirection: "row", alignItems: "center", gap: ".5rem" }}>
//                 {isRequestSent ? (
//                     <Typography variant="h6" sx={{ color: "primary.main", fontWeight: 600 }}>
//                         ✅ Request Sent
//                     </Typography>
//                 ) : (
//                     <Stack
//                         variant={"section"}
//                         component={"form"}
//                         onSubmit={handleSubmit(onSubmit)}
//                         sx={{
//                             p: "2rem",
//                             border: "1px solid #afb5b9",
//                             borderRadius: '.8rem !important'
//                         }}
//                     >
//                         <Grid container size={12} spacing={3}>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                         </Grid>

//                         <Typography sx={{ fontSize: "1rem", fontWeight: "700", my: "2rem" }}>(introducer / affiliate) related :-</Typography>

//                         <Grid container size={12} spacing={3}>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                         </Grid>

//                         <Typography sx={{ fontSize: "1rem", fontWeight: "700", my: "2rem" }}>portal / preferences :-</Typography>

//                         <Grid container size={12} spacing={3}>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                         </Grid>

//                         <Typography sx={{ fontSize: "1rem", fontWeight: "700", my: "2rem" }}>mailing / address :-</Typography>

//                         <Grid container size={12} spacing={3}>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                         </Grid>

//                         <Typography sx={{ fontSize: "1rem", fontWeight: "700", my: "2rem" }}>Images :-</Typography>

//                         <Grid container size={12} spacing={3}>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                             <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
//                                 <InputLabel sx={{ mb: ".5rem" }}>Account holder Name *</InputLabel>
//                                 <TextField {...register("firstName")} size='small' fullWidth placeholder="Enter account Name" variant="outlined" />
//                                 {errors.firstName && <Typography color="error" fontSize={"14px"}>{errors.firstName.message}</Typography>}
//                             </Grid>
//                         </Grid>

//                         <Tooltip title={!levelOneVerification && "Complete level one verification"}>
//                             <Button
//                                 type="button"
//                                 variant="contained"
//                                 disabled={isLoading}
//                                 onClick={levelOneVerification && onSubmit}
//                                 sx={{
//                                     textTransform: "capitalize",
//                                     boxShadow: "none",
//                                     color: "white",
//                                     alignSelf: "self-end",
//                                     mt: "1.2rem",
//                                     "&:hover": {
//                                         boxShadow: "none",
//                                     },
//                                 }}
//                             >
//                                 Request for IB
//                             </Button>
//                         </Tooltip>
//                     </Stack>
//                 )}
//             </Stack>
//         </Container>
//     );
// }

// export default IBRequest;























// // import { Card, Container, Stack, Button, Typography, Tooltip } from '@mui/material';
// // import { useRequestForIBMutation } from "../../../globalState/ibState/ibStateApis"
// // import { setNotification } from '../../../globalState/notificationState/notificationStateSlice';
// // import { useDispatch, useSelector } from 'react-redux';
// // import { setRequestStatus } from '../../../globalState/ibState/ibStateSlice';
// // import { useGetUserDataQuery } from "../../../globalState/userState/userStateApis"


// // function IBRequest() {

// //     const { token } = useSelector((state) => state.auth);
// //     const { data, isLoading: userDataLoading } = useGetUserDataQuery(undefined, {
// //         skip: !token,
// //         refetchOnMountOrArgChange: true,
// //     })

// //     // const isKycVerified = !userDataLoading && data?.data?.userData?.isKycVerified
// //     // const isAddressAdded = !userDataLoading && data?.data?.userData?.address
// //     const isNameRegistered = !userDataLoading && data?.data?.userData?.name

// //     const dispatch = useDispatch();
// //     const [requestForIB, { isLoading }] = useRequestForIBMutation();

// //     const { isRequestSent } = useSelector(state => state.ib)

// //     const onSubmit = async () => {
// //         try {
// //             const response = await requestForIB().unwrap();
// //             if (response?.status) {
// //                 dispatch(setNotification({
// //                     open: true,
// //                     message: response?.message || "Request submitted successfully.",
// //                     severity: "success"
// //                 }));
// //                 dispatch(setRequestStatus(true));
// //             }
// //         } catch (error) {
// //             dispatch(setNotification({
// //                 open: true,
// //                 message: error?.data?.message || "Failed to submit. Please try again later.",
// //                 severity: "error"
// //             }));
// //         }
// //     };

// //     return (
// //         <Container>
// //             <Card sx={{ borderRadius: "1.2rem", boxShadow: "0 0px 0px 0 rgba(0, 0, 0, 0.19), 0 0px 8px 0 rgba(0, 0, 0, 0.19)" }}>
// //                 <Stack sx={{ flexDirection: "row", alignItems: "center", gap: ".5rem", p: "1.2rem" }}>
// //                     {isRequestSent ? (
// //                         <Typography variant="h6" sx={{ color: "primary.main", fontWeight: 600 }}>
// //                             ✅ Request Sent
// //                         </Typography>
// //                     ) : (
// //                         <Tooltip title={!isNameRegistered && "Complete level one verification"}>
// //                             <Button
// //                                 type="button"
// //                                 variant="contained"
// //                                 disabled={isLoading}
// //                                 onClick={isNameRegistered && onSubmit}
// //                                 sx={{
// //                                     textTransform: "capitalize",
// //                                     boxShadow: "none",
// //                                     color: "white",
// //                                     alignSelf: "self-start",
// //                                     "&:hover": {
// //                                         boxShadow: "none",
// //                                     },
// //                                 }}
// //                             >
// //                                 Request for IB
// //                             </Button>
// //                         </Tooltip>
// //                     )}
// //                 </Stack>
// //             </Card>
// //         </Container>
// //     );
// // }

// // export default IBRequest;








// import { Card, Container, Stack, Button, Typography, Tooltip } from '@mui/material';
// import { useRequestForIBMutation } from '../../../globalState/ibState/ibStateApis';
// import { setNotification } from '../../../globalState/notificationState/notificationStateSlice';
// import { useDispatch, useSelector } from 'react-redux';
// import { setRequestStatus } from '../../../globalState/ibState/ibStateSlice';
// import { useGetUserDataQuery } from "../../../globalState/userState/userStateApis"


// function IBRequest() {

//     const { token } = useSelector((state) => state.auth);
//     const { data, isLoading: userDataLoading } = useGetUserDataQuery(undefined, {
//         skip: !token,
//         refetchOnMountOrArgChange: true,
//     })

//     // const isKycVerified = !userDataLoading && data?.data?.userData?.isKycVerified
//     // const isAddressAdded = !userDataLoading && data?.data?.userData?.address
//     const isNameRegistered = !userDataLoading && data?.data?.userData?.name

//     const dispatch = useDispatch();
//     const [requestForIB, { isLoading }] = useRequestForIBMutation();

//     const { isRequestSent } = useSelector(state => state.ib)

//     const onSubmit = async () => {
//         try {
//             const response = await requestForIB().unwrap();
//             if (response?.status) {
//                 dispatch(setNotification({
//                     open: true,
//                     message: response?.message || "Request submitted successfully.",
//                     severity: "success"
//                 }));
//                 dispatch(setRequestStatus(true));
//             }
//         } catch (error) {
//             dispatch(setNotification({
//                 open: true,
//                 message: error?.data?.message || "Failed to submit. Please try again later.",
//                 severity: "error"
//             }));
//         }
//     };

//     return (
//         <Container>
//             <Card sx={{ borderRadius: "1.2rem", boxShadow: "0 0px 0px 0 rgba(0, 0, 0, 0.19), 0 0px 8px 0 rgba(0, 0, 0, 0.19)" }}>
//                 <Stack sx={{ flexDirection: "row", alignItems: "center", gap: ".5rem", p: "1.2rem" }}>
//                     {isRequestSent ? (
//                         <Typography variant="h6" sx={{ color: "primary.main", fontWeight: 600 }}>
//                             ✅ Request Sent
//                         </Typography>
//                     ) : (
//                         <Tooltip title={!isNameRegistered && "Complete level one verification"}>
//                             <Button
//                                 type="button"
//                                 variant="contained"
//                                 disabled={isLoading}
//                                 onClick={isNameRegistered && onSubmit}
//                                 sx={{
//                                     textTransform: "capitalize",
//                                     boxShadow: "none",
//                                     color: "white",
//                                     alignSelf: "self-start",
//                                     "&:hover": {
//                                         boxShadow: "none",
//                                     },
//                                 }}
//                             >
//                                 Request for IB
//                             </Button>
//                         </Tooltip>
//                     )}
//                 </Stack>
//             </Card>
//         </Container>
//     );
// }

// export default IBRequest;


import IBElite from "../IBElite/IBElite"

function IBRequest() {
  return (
    <IBElite />
  )
}

export default IBRequest;