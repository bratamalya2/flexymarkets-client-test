import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Stack, useMediaQuery } from '@mui/material';

const SHORT_BRAND_NAME = import.meta.env.VITE_SHORT_BRAND_NAME;

function LogOutModalContent() {

    const matches = useMediaQuery('(max-width:850px)');

    return (
        <Box sx={{ width: matches ? '100%' : 'auto' }}>
            <Typography
                id="modal-modal-title"
                sx={{
                    fontSize: "1.8rem",
                    fontWeight: "700"
                }}>
                Are you sure?
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 6, fontWeight: "600" }}>
                This will remove access to your {SHORT_BRAND_NAME} account from all other devices. You'll stay logged in on this device only.
            </Typography>
            <Typography
                id="modal-modal-description"
                sx={{
                    mt: 3,
                    bgcolor: "#e8f1f0cf",
                    border: ".1px solid #000000fc",
                    p: "20px",
                    borderRadius: "1rem",
                    fontSize: "14px"
                }}
            >
                If you think someone else has access your Personal Area, you should reset your password after signing out of other devices.
            </Typography>
            <Stack sx={{ flexDirection: "row", gap: "1rem", alignItems: 'center', justifyContent: "flex-end", mt: 4 }}>
                <Button
                    variant="contained"
                    sx={{
                        textTransform: "none",
                        boxShadow: "none",
                        fontWeight: "400",
                        bgcolor: "#f3f5f7",
                        color: "black",
                        "&:hover": { boxShadow: "none" }
                    }}
                >
                    Cancel
                </Button>
                <Button
                    variant='contained'
                    sx={{
                        textTransform: "none",
                        boxShadow: "none",
                        fontWeight: "400",
                        color: "white",
                        "&:hover": {
                            boxShadow: "none"
                        }
                    }}
                >
                    Log out
                </Button>
            </Stack>
        </Box>
    );
}

export default LogOutModalContent;