import { Box, Stack, Typography, Button, LinearProgress } from '@mui/material'

function PlansOnTradingWithInOneYear() {

    const verificationProgress = 20;

    const data = [
        "Become a full-time professional trader",
        "Have it as a side job that could turn into a full-time job",
        "Keep it as a prestigious hobby",
        "Become a trading coach"
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
            >What are your plans on trading within 1 year?</Typography>
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

export default PlansOnTradingWithInOneYear;