// import { Stack, Button, Box, Typography } from "@mui/material";
// import OTPInput from "../../../../../components/OTPInput";
// import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
// import { Link } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { useRef } from "react";
// import { useForm } from "react-hook-form";
// import { useVerifyEmailAndMobileOtpMutation } from "../../../../../globalState/auth/authApis";
// import { setNotification } from "../../../../../globalState/notificationState/notificationStateSlice";
// import { useGetUserDataQuery } from "../../../../../globalState/userState/userStateApis";


// function SecurityEmailOTPVerification({ onClose }) {

//     // const { userData } = useSelector(state => state.auth)
//     const { token } = useSelector((state) => state.auth);
//     const { data: userData, isLoading, refetch } = useGetUserDataQuery(undefined, {
//         skip: !token,
//         refetchOnMountOrArgChange: true,
//     })
//     const userEmail = !isLoading && userData?.data?.userData?.email

//     const data = {
//         logo: ChatOutlinedIcon,
//         content: "Enter the code we sent to:",
//         value: userEmail || null
//     }

//     const dispatch = useDispatch()
//     const hasSubmitted = useRef(false)

//     const defaultValues = {
//         email: userEmail,
//         otp: ""
//     };

//     const { handleSubmit, setValue, watch } = useForm({
//         defaultValues: defaultValues
//     });

//     const [verifyEmailAndMobileOtp] = useVerifyEmailAndMobileOtpMutation();

//     const onSubmit = async (data) => {

//         try {

//             const response = await verifyEmailAndMobileOtp(data).unwrap();

//             if (response?.status) {
//                 dispatch(setNotification({ open: true, message: response?.message, severity: "success" }));
//                 onClose()
//             }

//         } catch (error) {
//             if (!error?.data?.status) {
//                 dispatch(setNotification({ open: true, message: error?.data?.message || "Failed to submit. Please try again later.", severity: "error" }));
//             }
//         } finally {
//             hasSubmitted.current = false;
//         }

//     };

//     const handleResendOtp = async () => {

//         try {

//             const response = await verifyEmailAndMobile({ email: userEmail }).unwrap()

//             if (response?.status) {

//                 const now = Date.now();
//                 const expire = now + 2 * 60 * 1000;

//                 dispatch(setResendOtpCreatedTime(now));
//                 dispatch(setResendOtpExpiryTime(expire));

//                 dispatch(setNotification({ open: true, message: response?.message, severity: "success" }));
//             }

//         } catch (error) {
//             if (!error?.data?.status) {
//                 dispatch(setNotification({ open: true, message: error?.data?.message || "Failed to submit. Please try again later.", severity: "error" }));
//             }
//         }
//     }

//     return (
//         <Stack width={"100%"}>
//             <Typography fontWeight={500} fontSize="1rem" mb={"1.5rem"}>Email verification</Typography>
//             <Box
//                 sx={{
//                     display: 'flex',
//                     gap: "1rem",
//                     mb: '2rem',
//                     // alignItems:"center"
//                 }}
//             >
//                 <data.logo />
//                 <Box>
//                     <Typography>{data.content}</Typography>
//                     <Typography fontWeight={500}>{data.value}</Typography>
//                 </Box>
//             </Box>
//             <OTPInput
//                 value={watch("otp")}
//                 onComplete={(value) => {
//                     setValue("otp", value);
//                     if (!hasSubmitted.current) {
//                         hasSubmitted.current = true;
//                         handleSubmit(onSubmit)();
//                     }
//                 }}
//             />
//             <Box
//                 sx={{
//                     mt: "1rem",
//                     display: "flex",
//                     flexDirection: "column",
//                     gap: ".5rem"
//                 }}
//             >
//                 <Typography component={Link} color="#1172cc">Get a new code</Typography>
//                 <Typography component={Link} color="#1172cc">I didn't receive a code</Typography>
//             </Box>
//             <Button
//                 variant="contained"
//                 sx={{
//                     textTransform: "none",
//                     mt: "2rem",
//                     boxShadow: "none",
//                     bgcolor: "#f3f5f7",
//                     fontWeight: "400",
//                     color: "black",
//                     "&:hover": { boxShadow: "none", bgcolor: "#f3f5f7" }
//                 }}
//                 onClick={onClose}
//             >
//                 Cancel
//             </Button>
//         </Stack>
//     )
// }

// export default SecurityEmailOTPVerification;