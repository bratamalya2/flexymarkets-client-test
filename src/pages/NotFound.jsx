import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function NotFound() {

    const navigate = useNavigate();

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    bgcolor: 'background.default',
                    color: 'text.primary',
                }}
            >
                <Typography variant="h1" component="h1" sx={{ fontSize: '6rem', fontWeight: 700 }}>
                    404
                </Typography>
                <Typography variant="h5" sx={{ mt: 1, mb: 2 }}>
                    Page Not Found
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                    Sorry, the page you are looking for does not exist or has been moved.
                </Typography>
                <Button
                    variant='contained'
                    size="large"
                    onClick={() => navigate('/client/myAccount')}
                    sx={{
                        textTransform: "none",
                        boxShadow: "none",
                        color: "white",
                        px: 4,
                        py: 1.5,
                        fontWeight: 600,
                        borderRadius: 1,
                        "&:hover": {
                            boxShadow: "none"
                        }
                    }}
                >Back to your account</Button>
            </Box>
        </Container>
    );
}

export default NotFound;