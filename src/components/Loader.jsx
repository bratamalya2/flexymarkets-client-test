import { CircularProgress, Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

function Loader() {

    const { selectedTheme } = useSelector((state) => state.themeMode)

    return (
        <Stack
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mt: "10rem",
                backgroundColor: "transparent",
                color: selectedTheme === "dark" ? 'white' : '#121212',
                flexDirection: 'column',
            }}>
            <CircularProgress color="inherit" />
            <Typography sx={{ marginTop: '10px' }} variant='body2'>Loading...</Typography>
        </Stack>
    );
};

export default Loader;