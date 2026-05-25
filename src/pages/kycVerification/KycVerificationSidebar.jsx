import { Box, Stack, Typography } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useSelector } from "react-redux";

function KycVerificationSidebar() {
    const { kycStep } = useSelector((state) => state.kyc);

    const verificationSteps = [
        {
            id: "emailVerification",
            label: "Email Verification",
            description: "Verify your email address"
        },
        {
            id: "phoneVerification",
            label: "Phone Verification",
            description: "Add phone number"
        },
        {
            id: "personalInfoVerification",
            label: "Personal Information",
            description: "Provide personal details"
        },
        {
            id: "documentsVerification",
            label: "Document Upload",
            description: "Upload identification"
        },
        {
            id: "documentSubmitted",
            label: "Verification Review",
            description: "Under review"
        }
    ];

    const getStepStatus = (stepId) => {
        const steps = ["emailVerification", "phoneVerification", "personalInfoVerification", "documentsVerification", "documentSubmitted"];
        const currentIndex = steps.indexOf(kycStep);
        const stepIndex = steps.indexOf(stepId);

        if (stepIndex < currentIndex) return "completed";
        if (stepIndex === currentIndex) return "current";
        return "pending";
    };

    return (
        <Stack sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                Verification Steps
            </Typography>

            <Stack spacing={2}>
                {verificationSteps.map((step, index) => {
                    const status = getStepStatus(step.id);
                    return (
                        <Box key={step.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: status === 'completed' ? 'success.main' :
                                    status === 'current' ? 'primary.main' :
                                        'action.disabledBackground',
                                color: status === 'pending' ? 'text.disabled' : '#fff',
                                fontWeight: 600
                            }}>
                                {status === 'completed' ? (
                                    <CheckCircleIcon sx={{ fontSize: 20 }} />
                                ) : (
                                    index + 1
                                )}
                            </Box>

                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" fontWeight={status === 'current' ? 600 : 400}>
                                    {step.label}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {step.description}
                                </Typography>
                            </Box>
                        </Box>
                    );
                })}
            </Stack>
        </Stack>
    )
}

export default KycVerificationSidebar;
