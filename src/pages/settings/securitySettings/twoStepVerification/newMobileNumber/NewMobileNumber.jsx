import { Stack, Button, InputLabel, TextField, Box, Typography } from "@mui/material";

function NewMobileNumber({ onClose }) {
    return (
        <Stack width={"100%"}>
            <Typography fontWeight={500} fontSize="1rem" mb={"1.5rem"}>New phone number</Typography>
            <InputLabel sx={{ fontSize: "12px" }}>New phone number</InputLabel>
            <TextField size='small' fullWidth variant="outlined" />
            <Box
                sx={{
                    mt: "2rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                }}
            >
                <Button
                    variant="contained"
                    sx={{
                        textTransform: "none",
                        boxShadow: "none",
                        color: "white",
                        "&:hover": { boxShadow: "none" }
                    }}
                >
                    Send me a code
                </Button>
                <Button
                    variant="contained"
                    sx={{
                        textTransform: "none",
                        boxShadow: "none",
                        bgcolor: "#f3f5f7",
                        color: "black",
                        "&:hover": { boxShadow: "none", bgcolor: "#f3f5f7", }
                    }}
                    onClick={onClose}
                >
                    Cancel
                </Button>
            </Box>
        </Stack>
    )
}

export default NewMobileNumber;