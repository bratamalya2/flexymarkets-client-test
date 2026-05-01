import PhonelinkEraseOutlinedIcon from '@mui/icons-material/PhonelinkEraseOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import ArrowRightAltOutlinedIcon from '@mui/icons-material/ArrowRightAltOutlined';
import { Stack, Button, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';

function LostDeviceModalContent({ onClose }) {

    return (
        <Stack>
            <Box>
                <Typography id="modal-modal-title" fontWeight={"bold"} fontSize={"1.5rem"}>
                    Lost device
                </Typography>
                <Stack mt={"3rem"}>
                    <PhonelinkEraseOutlinedIcon sx={{ fontSize: "3rem", color: "#eb483f", mb: "1rem" }} />
                    <Typography id="modal-modal-title" fontWeight={"bold"} fontSize={"1.5rem"}>
                        Lost device access?
                    </Typography>
                    <Typography color="textSecondary">
                        Your security type can be reset by contacting Support. Please reach out to our Support team to restore access.
                    </Typography>
                </Stack>
                <Box
                    sx={{
                        mt: 4,
                        bgcolor: "#e8f1f0cf",
                        border: ".1px solid #000000fc",
                        p: "20px",
                        borderRadius: "1rem",
                        fontSize: "14px",
                        display: "flex",
                        justifyContent: 'center',
                        gap: '2rem'
                    }}
                >
                    <PhonelinkEraseOutlinedIcon sx={{ color: "#eb483f" }} />
                    <ArrowRightAltOutlinedIcon />
                    <SupportAgentOutlinedIcon />
                </Box>
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: '2rem' }}>
                    <Button
                        component={Link}
                        to={"/client/helpDesk/newTicket"}
                        variant="contained"
                        sx={{
                            textTransform: "none",
                            boxShadow: "none",
                            color: "white",
                            "&:hover": { boxShadow: "none" }
                        }}
                    >
                        Support
                    </Button>
                </Box>
            </Box>
        </Stack>
    );
}

export default LostDeviceModalContent;