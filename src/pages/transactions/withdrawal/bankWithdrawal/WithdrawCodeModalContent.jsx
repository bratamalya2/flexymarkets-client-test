import { Stack, Box, Typography, OutlinedInput, InputLabel, TextField, InputAdornment, Button } from "@mui/material";

function WithdrawCodeModalContent() {
    return (
        <Stack>
            <Typography id="keep-mounted-modal-title"
                sx={{
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    mb: "1.2rem"
                }}
            >
                Put security code
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    gap: ".2rem"
                }}
            >
                <Typography color="textSecondary">Account:</Typography>
                <Typography fontWeight={500}>203548781</Typography>
            </Box>
            <Box item size={{ xs: 12, sm: 6, md: 4 }}>
                <InputLabel sx={{ mb: "1px", fontSize: "13px" }}>Amount</InputLabel>
                <OutlinedInput
                    size='small'
                    fullWidth
                    endAdornment={
                        <InputAdornment position="end">
                            <Typography>USD</Typography>
                        </InputAdornment>
                    }
                />
                <Button
                    size="small"
                    variant="contained"
                    fullWidth
                    sx={{
                        textTransform: "none",
                        boxShadow: "none",
                        fontWeight: "400",
                        mt: "1rem",
                        fontSize: "16px",
                        px: "2rem",
                        "&:hover": { boxShadow: "none" }
                    }}
                >
                    Set Balance
                </Button>
            </Box>
        </Stack>
    )
}

export default WithdrawCodeModalContent;