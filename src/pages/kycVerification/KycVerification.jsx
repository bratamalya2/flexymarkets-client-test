import { Container, Stack, Box, Paper, Typography } from "@mui/material";
import KycVerificationSidebar from "./KycVerificationSidebar";
import KycVerificationActiveForm from "./KycVerificationActiveForm";
import KycVerificationStepsList from "./KycVerificationStepsList";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setKycStep } from "../../globalState/kycState/kycStateSlice";
import { useGetUserDataQuery } from "../../globalState/userState/userStateApis";
import { useGetDocumentDataQuery } from "../../globalState/complianceState/complianceStateApis";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SecurityIcon from '@mui/icons-material/Security';

function KycVerification() {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('md'));
    const hasInitializedStep = useRef(false);

    const { token } = useSelector((state) => state.auth);
    const { kycStep } = useSelector((state) => state.kyc);
    const { data, isLoading } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })

    const { data: docData, isLoading: docLoading } = useGetDocumentDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })

    const documentStatus = docData?.data?.status;
    const documentNotUploaded = !documentStatus || documentStatus === "REJECTED"
    const isKycVerified = data?.data?.userData?.isKycVerified

    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (isLoading || docLoading) return;

        if (!data || isKycVerified) {
            navigate("/")
            return;
        }

        if (hasInitializedStep.current) return;
        hasInitializedStep.current = true;

        const user = data.data.userData;
        const hasValue = (value) => String(value ?? "").trim().length > 0;
        const hasPersonalInfo = hasValue(user.name) && hasValue(user.dob) && hasValue(user.gender) && hasValue(user.address);

        const documentsSteps = ["personalInfoVerification", "documentsVerification", "dataUseAgreement", "verifyIdentity"];
        let nextStep = "emailVerification";

        if (!user.isEmailVerified) {
            nextStep = kycStep === "emailOtpVerification" ? kycStep : "emailVerification";
        } else if (!user.isMobileVerified) {
            nextStep = "phoneVerification";
        } else if (!hasPersonalInfo) {
            nextStep = "personalInfoVerification";
        } else if (documentNotUploaded) {
            nextStep = documentsSteps.includes(kycStep) ? kycStep : "documentsVerification";
        } else {
            nextStep = "documentSubmitted";
        }

        if (nextStep !== kycStep) {
            dispatch(setKycStep(nextStep));
        }
    }, [data, dispatch, docLoading, documentNotUploaded, isKycVerified, isLoading, kycStep, navigate]);

    if (isLoading || docLoading) {
        return <Loader />
    }

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        fontWeight: 700,
                        color: 'primary.main',
                        mb: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                    }}
                >
                    <SecurityIcon sx={{ fontSize: 36 }} />
                    Identity Verification
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        color: 'text.secondary',
                        maxWidth: 800
                    }}
                >
                    Complete verification to access all platform features. This process ensures security and compliance with regulatory requirements.
                </Typography>
            </Box>

            <Paper
                elevation={theme.palette.mode === 'dark' ? 0 : 2}
                sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    mb: 4,
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: theme.palette.mode === 'dark'
                        ? '0 4px 24px rgba(0, 0, 0, 0.25)'
                        : '0 8px 32px rgba(0, 0, 0, 0.08)',
                }}
            >
                <Stack
                    direction={matches ? "column" : "row"}
                    sx={{
                        minHeight: '600px',
                    }}
                >
                    <Box
                        sx={{
                            width: matches ? '100%' : '320px',
                            bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
                            borderRight: `1px solid ${theme.palette.divider}`,
                            p: { xs: 2.5, md: 3 },
                            ...(matches && {
                                borderRight: 0,
                                borderBottom: `1px solid ${theme.palette.divider}`,
                            })
                        }}
                    >
                        {matches ? (
                            <Box>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        mb: 3,
                                        color: 'primary.main',
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}
                                >
                                    <VerifiedUserIcon />
                                    Verification Steps
                                </Typography>
                                <KycVerificationStepsList />
                            </Box>
                        ) : (
                            <Box sx={{ position: 'sticky', top: 24 }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        mb: 3,
                                        color: 'primary.main',
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}
                                >
                                    <VerifiedUserIcon />
                                    Verification Progress
                                </Typography>
                                <KycVerificationSidebar />
                            </Box>
                        )}
                    </Box>

                    <Box
                        sx={{
                            flex: 1,
                            p: { xs: 3, md: 4 },
                            bgcolor: 'background.paper',
                        }}
                    >
                        <Box sx={{ maxWidth: '600px', mx: 'auto', width: '100%' }}>
                            <KycVerificationActiveForm />
                        </Box>
                    </Box>
                </Stack>
            </Paper>

            <Box sx={{
                display: 'grid',
                gridTemplateColumns: matches ? '1fr' : '1fr 1fr',
                gap: 3,
                mb: 4
            }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        borderRadius: 2,
                        border: `1px solid ${theme.palette.divider}`,
                        bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            mb: 2.5,
                            color: 'primary.main',
                            fontWeight: 600
                        }}
                    >
                        Requirements
                    </Typography>
                    <Box component="ul" sx={{
                        pl: 2,
                        m: 0,
                        '& li': {
                            mb: 1.5,
                            color: 'text.secondary',
                            fontSize: '0.875rem'
                        }
                    }}>
                        <li>All information must match government-issued documents</li>
                        <li>Documents must be valid and not expired</li>
                        <li>Clear, readable images without glare or shadows</li>
                        <li>All four corners of ID must be visible</li>
                    </Box>
                </Paper>

                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        borderRadius: 2,
                        border: `1px solid ${theme.palette.divider}`,
                        bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            mb: 2.5,
                            color: 'primary.main',
                            fontWeight: 600
                        }}
                    >
                        Processing Timeline
                    </Typography>
                    <Stack spacing={2}>
                        <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main', mb: 0.5 }}>
                                Instant Verification
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                Email & Phone verification
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'warning.main', mb: 0.5 }}>
                                2-4 Hours
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                Personal information review
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'info.main', mb: 0.5 }}>
                                24-48 Hours
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                Document verification
                            </Typography>
                        </Box>
                    </Stack>
                </Paper>
            </Box>
        </Container>
    )
}

export default KycVerification;
