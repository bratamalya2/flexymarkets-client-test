import { Box, Stack, Typography, Button, LinearProgress } from '@mui/material'

const FULL_BRAND_NAME = import.meta.env.VITE_FULL_BRAND_NAME;

function MonthlyIncomeToInvest() {

    const verificationProgress = 20;

    const data = [
        "Up to 50% of my monthly income",
        "Up to 5% of my monthly income",
        "Up to 25% of my monthly income",
        "More than 50% of my monthly income",
        "None, for now"
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
            >What is the anticipated monthly income you are prepared to invest with {FULL_BRAND_NAME}?</Typography>
            <Box sx={{ border: "1px solid #e2e4e4", borderRadius: ".5rem", mt: "1rem" }}>
                {
                    data.map((item, i) => (
                        <Box key={i} sx={{ p: "16px 20px", borderBottom: i !== (data.length - 1) && "1px solid #e2e4e4" }}>
                            <Typography>{item}</Typography>
                        </Box>
                    ))
                }
            </Box>
            <Button
                variant='contained'
                disabled
                sx={{
                    textTransform: "capitalize",
                    boxShadow: "none",
                    color: "white",
                    alignSelf: "flex-end",
                    mt: '1.5rem',
                    "&:hover": {
                        boxShadow: "none"
                    }
                }}
            >Back</Button>
        </Stack>
    )
}

export default MonthlyIncomeToInvest;