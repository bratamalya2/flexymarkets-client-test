import { Stack, Typography, Radio, RadioGroup, Box, Button, Skeleton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import ActiveComponentForTwoStepVerification from "./ActiveComponentForTwoStepVerification";
import LostDeviceModalContent from "./newMobileNumber/LostDeviceModalContent";
import ModalComponent from "../../../../components/ModalComponent";
import EmailOtpVerification from "../../../kycVerification/emailVerification/EmailOtpVerification";
import PhoneOtpVerification from "../../../kycVerification/phoneVerification/PhoneOtpVerification";
import AuthenticationApp from "./authenticationApp/AuthenticationApp";
import { useMfaSetUpMutation, useVerifyEmailAndMobileMutation } from "../../../../globalState/auth/authApis";
import { setMFAData, setResendOtpExpiryTime, setResendOtpCreatedTime } from "../../../../globalState/auth/authSlice";
import { useGetUserDataQuery, useUpdateSecurityMethodMutation } from "../../../../globalState/userState/userStateApis";
import { setNotification } from "../../../../globalState/notificationState/notificationStateSlice";
import { useNavigate } from "react-router-dom";

function ChangeTwoStepVerification({ onClickCancelBtn }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { token } = useSelector((state) => state.auth);
    const { data, isLoading: userDataLoading, refetch } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    });

    const securityMethods = !userDataLoading && data?.data?.userData?.securityMethods;
    const mobile = !userDataLoading && data?.data?.userData?.mobile;
    const email = !userDataLoading && data?.data?.userData?.email;
    const isMfaAdded = !userDataLoading && data?.data?.userData?.isMfaAdded;
    const isEmailVerified = !userDataLoading && data?.data?.userData?.isEmailVerified;
    const isMobileVerified = !userDataLoading && data?.data?.userData?.isMobileVerified;

    const [mfaSetUp, { isLoading: mfaSetUpLoading }] = useMfaSetUpMutation();
    const [verifyEmailAndMobile, { isLoading: emailVerificationLoading }] = useVerifyEmailAndMobileMutation();
    const [updateSecurityMethod, { isLoading: updateSecurityLoading }] = useUpdateSecurityMethodMutation();

    const [value, setValue] = useState(securityMethods || null);
    const [showComponent, setShowComponent] = useState(false);
    const [verifiedMap, setVerifiedMap] = useState({});

    useEffect(() => {
        if (!userDataLoading) {
            setVerifiedMap({
                EMAIL: isEmailVerified,
                MOBILE: isMobileVerified,
                "GOOGLE-AUTH": isMfaAdded,
            });
        }
    }, [isEmailVerified, isMobileVerified, isMfaAdded, userDataLoading]);

    const handleMFASetup = async () => {
        try {
            const response = await mfaSetUp().unwrap();
            if (response?.status) {
                dispatch(setMFAData(response?.data));
                setVerifiedMap((prev) => ({ ...prev, "GOOGLE-AUTH": true }));
            }
        } catch (error) {
            if (!error?.data?.status) {
                dispatch(setNotification({ open: true, message: error?.data?.message || "Failed to submit. Please try again later.", severity: "error" }));
            }
        }
    };

    const handleEmailVerification = async (verificationType) => {
        const mobileOrEmail = verificationType == "Email" ? { email } : { mobile };
        try {
            const response = await verifyEmailAndMobile(mobileOrEmail).unwrap();

            if (response?.status) {
                const now = Date.now();
                const expire = now + 2 * 60 * 1000;

                dispatch(setResendOtpCreatedTime(now));
                dispatch(setResendOtpExpiryTime(expire));
                dispatch(setNotification({ open: true, message: response?.message, severity: "success" }));
            }
        } catch (data) {
            if (!data?.data?.status) {
                dispatch(setNotification({ open: true, message: data?.data?.message || "Failed to sign in. Please try again later.", severity: "error" }));
            }
        }
    };

    const handleSecurityMethod = async (method) => {
        try {
            const response = await updateSecurityMethod({ securityMentod: method }).unwrap();
            if (response?.status) {
                dispatch(setNotification({ open: true, message: response?.message, severity: "success" }));
                setVerifiedMap((prev) => ({ ...prev, [method]: true }));
            }
        } catch (data) {
            if (!data?.data?.status) {
                dispatch(setNotification({ open: true, message: data?.data?.message || "Failed to sign in. Please try again later.", severity: "error" }));
            }
        }
    };

    const twoStepMethods = [
        {
            label: "Email",
            selectValue: "EMAIL",
            component: EmailOtpVerification,
            value: email || null,
            verified: verifiedMap.EMAIL || false,
        },
        {
            label: "Phone number",
            selectValue: "MOBILE",
            component: PhoneOtpVerification,
            value: mobile || null,
            verified: verifiedMap.MOBILE || false,
        },
        {
            label: "Authentication app",
            selectValue: "GOOGLE-AUTH",
            component: AuthenticationApp,
            type: "component",
            verified: verifiedMap["GOOGLE-AUTH"] || false,
        },
    ].filter(Boolean);

    const selectedOption = useMemo(
        () => twoStepMethods.find((item) => item?.selectValue === value),
        [value, twoStepMethods]
    );

    const handleShowComponent = (label, isVerified) => {
        if (label === "Authentication app") {
            isVerified ? handleSecurityMethod("GOOGLE-AUTH") : handleMFASetup();
            !isVerified && setShowComponent(true);
        } else if (label === "Email") {
            isVerified ? handleSecurityMethod("EMAIL") : handleEmailVerification("Email");
            !isVerified && setShowComponent(true);
        } else if (label === "Phone number") {
            if (userDataLoading) return;
            if (isVerified) {
                handleSecurityMethod("MOBILE");
            } else if (mobile) {
                handleEmailVerification("Mobile");
                setShowComponent(true);
            } else {
                navigate("/client/kyc");
            }
        } else {
            setShowComponent(true);
        }
    };

    useEffect(() => {
        if (selectedOption) refetch();
    }, [value]);

    return showComponent ? (
        !emailVerificationLoading && !mfaSetUpLoading ? (
            <ActiveComponentForTwoStepVerification
                selectedOption={selectedOption}
                onClose={() => setShowComponent(false)}
            />
        ) : (
            <Skeleton width={"100%"} height={"4rem"} />
        )
    ) : (
        <Stack width={"100%"}>
            <Typography fontWeight={500} fontSize="1rem">2-Step verification</Typography>
            <RadioGroup
                value={value}
                onChange={(e) => setValue(e.target.value)}
                sx={{ width: "100%", mt: "20px", ml: 0 }}
            >
                {twoStepMethods.map((item, i) => (
                    <Box key={i} sx={{ display: "flex", alignItems: "center", width: "100%", borderRadius: "6px" }}>
                        <Radio
                            checked={value === item.selectValue}
                            value={item.selectValue}
                            onChange={() => setValue(item.selectValue)}
                            sx={{ color: "primary.main", "&.Mui-checked": { color: "primary.main" }, transform: "scale(.9)" }}
                        />
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flex: 1 }}>
                            <Box>
                                <Typography fontSize="14px">{item.label}</Typography>
                                <Typography fontSize="12px" sx={{ color: "text.secondary" }}>{item.value}</Typography>
                            </Box>
                            {item.verified && (
                                <Typography sx={{ fontSize: "12px", color: "#29834e", p: "2px 10px", borderRadius: "5rem", bgcolor: "#d9ede2", flexShrink: 0 }}>Verified</Typography>
                            )}
                        </Box>
                    </Box>
                ))}
            </RadioGroup>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem", mt: "2rem" }}>
                {selectedOption?.type === "modal" ? (
                    <ModalComponent Content={LostDeviceModalContent} btnName={"Next"} type={"button"} />
                ) : (
                    !(selectedOption?.selectValue == securityMethods) && (
                        <Button
                            size="small"
                            variant="contained"
                            disabled={!value || emailVerificationLoading || mfaSetUpLoading || updateSecurityLoading || userDataLoading}
                            sx={{ textTransform: "none", boxShadow: "none", fontWeight: "400", fontSize: "16px", px: "2rem", color: "white", "&:hover": { boxShadow: "none" } }}
                            onClick={() => handleShowComponent(selectedOption?.label, selectedOption?.verified)}
                        >
                            {selectedOption?.verified ? "Set" : "Next"}
                        </Button>
                    )
                )}
                <Button
                    size="small"
                    variant="contained"
                    sx={{ textTransform: "none", boxShadow: "none", fontWeight: "400", fontSize: "16px", px: "2rem", bgcolor: "#f3f5f7", color: "black", "&:hover": { boxShadow: "none", bgcolor: "#f3f5f7" } }}
                    onClick={() => onClickCancelBtn(false)}
                >
                    Cancel
                </Button>
            </Box>
        </Stack>
    );
}

export default ChangeTwoStepVerification;