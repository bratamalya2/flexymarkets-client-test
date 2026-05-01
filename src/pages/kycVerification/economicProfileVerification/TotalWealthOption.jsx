import { Box, Stack, Typography, Button, LinearProgress } from '@mui/material'

function TotalWealthOption() {

    const verificationProgress = 20;

    const data = [
        "$100,000 - $200,000",
        "$50,000 - $100,000",
        "$20,000 - $50,000",
        "More than $200",
        "$0 - $20,000"
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
            >Please select your total wealth (Including cash and bank account balances)</Typography>
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

export default TotalWealthOption;