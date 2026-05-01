import React from 'react';
import { Box, LinearProgress, Typography, List, ListItem, Divider } from '@mui/material';

const ProgressBar = () => {
    const verificationProgress = 20; // Adjust this value based on actual progress

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>

            {/* Yellow Progress Bar */}
            <Box sx={{ my: 2 }}>
                <LinearProgress
                    variant="determinate"
                    value={verificationProgress}
                    sx={{
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: '#f3f3f3',
                        '& .MuiLinearProgress-bar': {
                            borderRadius: 5,
                            backgroundColor: '#FFD700', // Yellow color
                        },
                    }}
                />
                <Typography variant="caption" color="text.secondary">
                    {verificationProgress}% verified
                </Typography>
            </Box>

            {/* Purpose Section */}
            <Typography variant="h6" gutterBottom>
                What is the purpose of opening your account?
            </Typography>
            <List>
                {['Investment', 'Hedging', 'Speculation'].map((item) => (
                    <ListItem key={item} sx={{ py: 0.5 }}>
                        • {item}
                    </ListItem>
                ))}
            </List>

            <Divider sx={{ my: 3 }} />

            {/* Search Section */}
            <Typography variant="h6">Search</Typography>
        </Box>
    );
};

export default ProgressBar;