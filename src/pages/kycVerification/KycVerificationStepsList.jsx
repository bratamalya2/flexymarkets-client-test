import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Stack,
    Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useState } from 'react';
import { useSelector } from 'react-redux';

function KycVerificationStepsList() {
    const [expanded, setExpanded] = useState(true);
    const { kycStep } = useSelector((state) => state.kyc);

    const verificationSteps = [
        {
            id: "emailVerification",
            label: "Email Verification"
        },
        {
            id: "phoneVerification",
            label: "Phone Verification"
        },
        {
            id: "personalInfoVerification",
            label: "Personal Information"
        },
        {
            id: "documentsVerification",
            label: "Document Upload"
        },
        {
            id: "documentSubmitted",
            label: "Verification Review"
        },
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
        <Accordion
            expanded={expanded}
            onChange={() => setExpanded((current) => !current)}
            elevation={0}
            sx={{
                border: (theme) => `1px solid ${theme.palette.divider}`,
                borderRadius: '8px !important',
                '&:before': { display: 'none' }
            }}
        >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" fontWeight={600}>
                    Verification Steps
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Stack spacing={2}>
                    {verificationSteps.map((step, index) => {
                        const status = getStepStatus(step.id);

                        return (
                            <Box key={step.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    bgcolor: status === 'completed' ? 'success.main' :
                                        status === 'current' ? 'primary.main' :
                                            'action.disabledBackground',
                                    color: status === 'pending' ? 'text.disabled' : '#fff',
                                    fontSize: '0.875rem',
                                    fontWeight: 600
                                }}>
                                    {status === 'completed' ? (
                                        <CheckCircleIcon sx={{ fontSize: 16 }} />
                                    ) : (
                                        index + 1
                                    )}
                                </Box>

                                <Typography variant="body2" fontWeight={status === 'current' ? 600 : 400}>
                                    {step.label}
                                </Typography>
                            </Box>
                        );
                    })}
                </Stack>
            </AccordionDetails>
        </Accordion>
    );
}

export default KycVerificationStepsList;
