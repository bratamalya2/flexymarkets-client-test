import { Box, Stack, Typography, Button, LinearProgress } from '@mui/material'

function OccupationOrIndustryOptions() {

    const verificationProgress = 20;

    const data = [
        "Accountancy",
        "Admin / Secretarial",
        "Agriculture",
        "Catering / Hospitality",
        "Marketing / PR",
        "Education",
        "Engineering",
        "Financial Services",
        "Healthcare",
        "HR",
        "IT",
        "Legal",
        "Manufacturing",
        "Military",
        "Property / Construction",
        "Retail / Sales",
        "Telecommunications",
        "Transport / Logistics",
        "Other (open answer)"
    ]

    return (
        <Stack
            sx={{
                gap: ".7rem"
            }}
        >
            <Box sx={{ my: 1.2 }}>
                <LinearProgress
                    variant="determinate"
                    value={verificationProgress}
                    sx={{
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: '#f3f3f3',
                        '& .MuiLinearProgress-bar': {
                            borderRadius: 5,
                            backgroundColor: '#FFD700',
                        },
                    }}
                />
                <Typography variant="caption" color="text.secondary">
                    {verificationProgress}% verified
                </Typography>
            </Box>
            <Typography
                sx={{
                    fontWeight: 600,
                    lineHeight: "32px",
                    fontSize: "28px"
                }}
            >What is your occupation / industry?</Typography>
            <Box sx={{ border: "1px solid #e2e4e4", borderRadius: ".5rem", mt: "1rem" }}>
                {
                    data.map((item, i) => (
                        <Box key={i} sx={{ p: "16px 20px", borderBottom: i !== (data.length - 1) && "1px solid #e2e4e4" }}>
                            <Typography>{item}</Typography>
                        </Box>
                    ))
                }
            </Box>
            <Stack
                sx={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    gap: "1rem"
                }}
            >
                <Button
                    variant='contained'
                    disabled
                    sx={{
                        textTransform: "capitalize",
                        boxShadow: "none",
                        color: "white",
                        mt: '1.5rem',
                        "&:hover": {
                            boxShadow: "none"
                        }
                    }}
                >Back</Button>
                <Button
                    variant='contained'
                    disabled
                    sx={{
                        textTransform: "capitalize",
                        boxShadow: "none",
                        color: "white",
                        mt: '1.5rem',
                        "&:hover": {
                            boxShadow: "none"
                        }
                    }}
                >Continue</Button>
            </Stack>
        </Stack>
    )
}

export default OccupationOrIndustryOptions;