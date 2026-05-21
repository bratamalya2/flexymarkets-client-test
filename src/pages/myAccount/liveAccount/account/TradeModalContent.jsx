import { Stack, Box, Typography } from '@mui/material';
import GoToTerminalCard from '../../../../components/GoToTerminalCard';
import MetaTrader5Card from '../../../../components/MetaTrader5Card';
import { Link } from 'react-router-dom';
import { notifyMt5AccountChange } from '../../../../utils/notifyMt5AccountChange';
import { setActiveMT5AccountLogin } from '../../../../globalState/mt5State/mt5StateSlice';
import { useDispatch } from 'react-redux';
import { setSelectedSymbol } from '../../../../globalState/terminalState/terminalSlice';

function TradeModalContent({ onClose, data }) {

    const dispatch = useDispatch()

    const handleTerminalClick = () => {
        if (data?.login) {
            dispatch(setActiveMT5AccountLogin(data?.login))
            dispatch(setSelectedSymbol(null))
            notifyMt5AccountChange(data?.login);
        }
        window.open('/terminal', 'FlexyMarketsTerminal');
        onClose();
    };

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
                    onClick={handleTerminalClick}
                ><GoToTerminalCard /></Box>
                <Box sx={{ cursor: "pointer" }} onClick={handleTerminalClick} ><MetaTrader5Card /></Box>
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