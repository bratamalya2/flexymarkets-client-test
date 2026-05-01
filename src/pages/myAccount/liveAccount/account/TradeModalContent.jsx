import { Stack, Box, Typography } from '@mui/material';
import GoToTerminalCard from '../../../../components/GoToTerminalCard';
import MetaTrader5Card from '../../../../components/MetaTrader5Card';
import { Link } from 'react-router-dom';

function TradeModalContent({ onClose }) {

    return (
        <Stack>
            <Typography id="keep-mounted-modal-title"
                sx={{
                    fontSize: "2rem",
                    fontWeight: "700",
                    mb: "1.2rem"
                }}
            >
                Trade
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <Box
                    sx={{
                        cursor: "pointer",
                        textDecoration: "none"
                    }}
                    component={Link}
                    target='_blank'
                    to={`/terminal`}
                    rel="noopener noreferrer"
                    onClick={onClose}
                ><GoToTerminalCard /></Box>
                <Box sx={{ cursor: "pointer" }} onClick={onClose} ><MetaTrader5Card /></Box>
            </Box>
            {/* <MT5InstallDetailsAccordian /> */}
            {/* <Box>
                <FormControlLabel control={<Checkbox />} label="Always use this terminal" />
                <Typography variant='body1' ml={"1.9rem"} color="textSecondary">You can change this later in "Settings"</Typography>
            </Box> */}
        </Stack>
    )
}

export default TradeModalContent;