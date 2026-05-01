import { Box, Stack, Typography, InputLabel, Button } from '@mui/material'
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import "./countryCodeSelector.css"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as z from 'zod';
import { setNotification } from "../../../globalState/notificationState/notificationStateSlice";
import { setKycStep } from '../../../globalState/kycState/kycStateSlice';
import { useUpdateProfileMutation } from '../../../globalState/userState/userStateApis';
import { useVerifyEmailAndMobileMutation } from '../../../globalState/auth/authApis';
import { useGetUserDataQuery } from '../../../globalState/userState/userStateApis';
import { useEffect, useState } from 'react';
import { setResendOtpCreatedTime, setResendOtpExpiryTime } from '../../../globalState/auth/authSlice';


export const phoneVerificationSchema = z.object({
    countryCode: z.string().trim().min(1, "Please select your country code"),
    mobile: z.string().trim().min(10, "Please type your mobile number"),
})


function PhoneVerification() {
    const { selectedTheme } = useSelector((state) => state.themeMode);
    const { token } = useSelector((state) => state.auth);
    const { data: userData, isLoading: isUserDataLoading } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })
    const [phoneNumber, setPhoneNumber] = useState("");
    const [hasPrefilled, setHasPrefilled] = useState(false);

    const userMobile = userData?.data?.userData?.mobile;
    const userCountryCode = userData?.data?.userData?.countryCode;

    const defaultValues = {
        countryCode: "",
        mobile: ""
    };

    const { handleSubmit, setValue, reset, formState: { errors } } = useForm({
        resolver: zodResolver(phoneVerificationSchema),
        defaultValues: defaultValues
    });

    useEffect(() => {
        if (!isUserDataLoading && userData && !hasPrefilled) {
            if (userCountryCode && userMobile) {
                const fullPhoneNumber = `${userCountryCode}${userMobile}`;
                setPhoneNumber(fullPhoneNumber);
                setValue("countryCode", userCountryCode);
                setValue("mobile", fullPhoneNumber);
                setHasPrefilled(true);
            } else {
                setPhoneNumber("");
                reset(defaultValues);
            }
        }
    }, [userCountryCode, userMobile, isUserDataLoading, hasPrefilled]);

    const dispatch = useDispatch();
    const [updateProfile, { isLoading }] = useUpdateProfileMutation();
    const [verifyEmailAndMobile] = useVerifyEmailAndMobileMutation();

    const onSubmit = async (data) => {
        const countryCodeWithoutPlus = data?.countryCode?.replace("+", "");
        let trimmedMobile = hasPrefilled ? data.mobile.replace("+", "") : data.mobile;

        if (trimmedMobile.startsWith(countryCodeWithoutPlus)) {
            trimmedMobile = trimmedMobile.slice(countryCodeWithoutPlus.length);
        }

        const updatedData = {
            countryCode: data.countryCode,
            mobile: trimmedMobile
        };

        try {
            const response = await updateProfile(updatedData).unwrap();

            if (response?.status) {
                const verifyMobileResponse = await verifyEmailAndMobile({ mobile: updatedData.mobile }).unwrap();

                if (verifyMobileResponse?.status) {

                    const now = Date.now();
                    const expire = now + 2 * 60 * 1000;

                    dispatch(setResendOtpCreatedTime(now));
                    dispatch(setResendOtpExpiryTime(expire));

                }

                dispatch(setKycStep("personalInfoVerification"));
                dispatch(setNotification({
                    open: true,
                    message: response?.message,
                    severity: "success"
                }));
            }
        } catch (error) {
            dispatch(setNotification({
                open: true,
                message: error?.data?.message || "Failed to update phone number. Please try again later.",
                severity: "error"
            }));
        }
    };

    return (
        <Stack
            sx={{
                gap: ".7rem"
            }}
            component={"form"}
            onSubmit={handleSubmit(onSubmit)}
        >
            <Typography
                sx={{
                    fontWeight: 600,
                    lineHeight: "32px",
                    fontSize: "28px"
                }}
            >
                Enter your phone number
            </Typography>
            <Typography>It is used to verify your account and future operations</Typography>
            <Box>
                <InputLabel sx={{ mb: ".5rem", fontSize: "14px" }}>Phone number</InputLabel>
                <PhoneInput
                    value={phoneNumber}
                    onChange={(value, countryData) => {
                        setPhoneNumber(value);
                        setValue("mobile", value, { shouldValidate: true });
                        setValue("countryCode", `+${countryData.dialCode}`, { shouldValidate: true });
                    }}
                    country={"in"}
                    enableSearch
                    enableLongNumbers
                    placeholder="Enter mobile no."
                    inputStyle={{
                        width: '100%',
                        height: '40px',
                        background: 'transparent',
                        color: selectedTheme === "dark" ? 'white' : 'black',
                        borderRadius: '4px',
                        paddingLeft: '50px',
                    }}
                    buttonStyle={{
                        background: 'transparent'
                    }}
                    dropdownStyle={{
                        background: selectedTheme === "dark" ? '#121212' : 'white',
                        color: selectedTheme === "dark" ? 'white' : 'black'
                    }}
                />
                <InputLabel sx={{ mt: "2px", fontSize: "12px" }}>
                    We'll send a verification code to this number
                </InputLabel>
                {errors.mobile && (
                    <Typography color="error" fontSize={"14px"}>
                        {errors.mobile.message}
                    </Typography>
                )}
                {errors.countryCode && (
                    <Typography color="error" fontSize={"14px"}>
                        {errors.countryCode.message}
                    </Typography>
                )}
            </Box>
            <Button
                variant='contained'
                type='submit'
                disabled={isLoading || isUserDataLoading}
                sx={{
                    textTransform: "capitalize",
                    boxShadow: "none",
                    color: "white",
                    mt: '1.5rem',
                    alignSelf: "self-end",
                    "&:hover": {
                        boxShadow: "none",
                    }
                }}
            >
                {isLoading ? "Processing..." : "Continue"}
            </Button>
        </Stack>
    )
}

export default PhoneVerification;