import { Box, Stack, Typography, Button, LinearProgress } from '@mui/material'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

function SourceOfIncomeOption() {

    const verificationProgress = 20;

    const data = ["Savings", "Employment / business proceeds", "Rent", "Borrowed funds / loan", "Pension", "Inheritance"]

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
            >Please select your source of income and wealth</Typography>
            <FormGroup sx={{ border: "1px solid #e2e4e4", borderRadius: ".5rem", mt: "1rem" }}>
                {
                    data.map((item, i) => (
                        <FormControlLabel
                            key={i}
                            sx={{ p: "10px 20px", m: "0", borderBottom: i !== (data.length - 1) && "1px solid #e2e4e4" }}
                            control={<Checkbox />}
                            label={item}
                        />
                    ))
                }
            </FormGroup>
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

export default SourceOfIncomeOption;