import { Stack, Typography, Button, useMediaQuery, Skeleton } from '@mui/material'
import Grid from '@mui/material/Grid2';
import ChangeTwoStepVerification from './ChangeTwoStepVerification';
import { useState } from 'react';
// import EmailOTPVerification from './email/SecurityEmailOTPVerification';
import NewMobileNumberOtpVerification from './newMobileNumber/NewMobileNumberOtpVerification';
import NewMobileNumber from './newMobileNumber/NewMobileNumber';
import OtpNotReceived from './newMobileNumber/OtpNotReceived';
import LostDeviceModalContent from './newMobileNumber/LostDeviceModalContent';
import { useSelector } from 'react-redux';
import { useGetUserDataQuery } from "../../../../globalState/userState/userStateApis"


function TwoStepVerification() {

    const { token } = useSelector((state) => state.auth);
    const { data: userData, isLoading } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })

    const securityMethods = userData?.data?.userData?.securityMethods
    const mobile = userData?.data?.userData?.mobile
    const userEmail = userData?.data?.userData?.email
    const isEmailVerified = userData?.data?.userData?.isEmailVerified
    const isMfaAdded = userData?.data?.userData?.isMfaAdded

    // const selectedOSecurityMethod = securityMethods ? securityMethods == "EMAIL" ? userEmail : securityMethods == "MOBILE" ?
    //     mobile : "App"

    function handleSecurityMethod(securityMethods) {
        if (securityMethods == "EMAIL") {
            return userEmail
        } else if (securityMethods == "MOBILE") {
            return mobile
        } else if (securityMethods == "GOOGLE-AUTH") {
            return "App Authentication"
        } else {
            "Nothing selected"
        }
    }

    const data = [
        {
            type: "Security type",
            value: handleSecurityMethod(securityMethods),
            securityVolume: (securityMethods == "GOOGLE-AUTH") ? "High security" : "Low security",
            button: true
        }
    ]

    const { twoStepVerificationStep } = useSelector(state => state.twoStepVerification)

    const [change, setChange] = useState(false)

    const matches = useMediaQuery('(max-width:850px)');

    // const allComponent = {
    //     emailOtp: EmailOTPVerification,
    //     mobileOtp: NewMobileNumberOtpVerification,
    //     newMobile: NewMobileNumber,
    //     newMobileNumberOtp: NewMobileNumberOtpVerification,
    //     otpNotReceived: OtpNotReceived
    // }

    // const ActiveComponent = allComponent[twoStepVerificationStep]

    return (
        <Stack>
            <Typography sx={{ fontSize: "1.8rem", fontWeight: "700", mb: ".5rem" }}>2-Step verification</Typography>
            <Typography color="textSecondary">2-step verification ensures that all sensitive transactions are authorized by you.</Typography>
            <Typography color="textSecondary">We encourage you to enter verification codes to confirm these transactions.</Typography>
            <Stack
                variant={"section"}
                sx={{
                    border: "1px solid #e2e4e4",
                    mt: "2rem"
                }}
            >
                {
                    data.map((item, i) => (
                        <Grid
                            container
                            size={12}
                            spacing={2}
                            key={i}
                            sx={{ p: "32px 24px", border: "1px solid  #e2e4e4" }}
                        >
                            <Grid
                                size={matches ? 12 : 4}
                                sx={{ display: "flex", alignItems: "center" }}
                            >
                                <Typography color="textSecondary" fontWeight={"500"}>{item.type}</Typography>
                            </Grid>
                            <Grid
                                size={matches ? 12 : change === true ? 5 : 4}
                                sx={{ display: "flex", alignItems: "center" }}
                            >
                                {
                                    (change === true && item.button === true)
                                        ?
                                        <ChangeTwoStepVerification onClickCancelBtn={() => setChange()} />
                                        :
                                        <Typography fontWeight={"500"}>{isLoading ? <Skeleton /> : item.value}</Typography>
                                }
                            </Grid>
                            {
                                change === true
                                    ?
                                    null
                                    :
                                    <Grid
                                        size={matches ? 12 : 4}
                                        sx={{ display: "flex", flexDirection: matches ? "column" : "row", gap: "1rem", alignItems: matches ? "flex-start" : "center", justifyContent: "flex-end" }}
                                    >
                                        {
                                            item.securityVolume &&
                                            <Typography
                                                sx={{
                                                    fontSize: "14px",
                                                    color: item.securityVolume === "High security" ? "#29834e" : "#c4453e",
                                                    p: "4px 10px",
                                                    borderRadius: "5rem",
                                                    bgcolor: item.securityVolume === "High security" ? "#d9ede2" : "#f8e1e0"
                                                }}
                                            >{item.securityVolume}</Typography>
                                        }
                                        {/* {(!(isEmailVerified && isMfaAdded) && item.button) &&  */}
                                        <Button
                                            onClick={() => setChange(true)}
                                            variant="contained"
                                            fullWidth={matches}
                                            sx={{
                                                textTransform: "none",
                                                boxShadow: "none",
                                                fontWeight: "400",
                                                fontSize: "16px",
                                                px: "2rem",
                                                bgcolor: "#f3f5f7",
                                                color: "black",
                                                alignSelf: "self-end",
                                                "&:hover": { boxShadow: "none", bgcolor: "#f3f5f7", }
                                            }}
                                        >
                                            Change
                                        </Button>
                                        {/* } */}
                                    </Grid>
                            }
                        </Grid>
                    ))
                }
            </Stack>
        </Stack>
    )
}

export default TwoStepVerification;