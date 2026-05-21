import React from 'react';
import { Card, CardContent, Typography, Stack, Box, useTheme, CardActionArea } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setSelectedSymbol } from "../../../globalState/terminalState/terminalSlice";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const QuotesCard = ({ data }) => {
    const theme = useTheme();
    const dispatch = useDispatch();

    const handleSymbolClick = () => {
        const symbolData = {
            groupedSym: data?.groupedSym,
            img1: data?.img1,
            img2: data?.img2,
            name: data?.name || data?.Symbol
        };

        dispatch(setSelectedSymbol(symbolData));
        window.open("/terminal", "FlexyMarketsTerminal");
    };

    const spread = (Number(data?.Ask || 0) - Number(data?.Bid || 0)).toFixed(2);

    // Determine dynamic colors based on values if needed, for now using standard Green/Red/Text
    const askColor = theme.palette.success.main;
    const bidColor = theme.palette.error.main;

    return (
        <Card
            sx={{
                height: '100%',
                borderRadius: '16px',
                // Enhanced shadow for 3D effect
                boxShadow: theme.palette.mode === 'dark'
                    ? '0px 4px 20px rgba(0, 0, 0, 0.4), inset 0px 1px 1px rgba(255, 255, 255, 0.1)'
                    : '0px 8px 25px rgba(149, 157, 165, 0.2), inset 0px 1px 1px rgba(255, 255, 255, 0.8)',
                transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                '&:hover': {
                    transform: 'translateY(-6px) scale(1.02)', // Slightly stronger lift and scale
                    boxShadow: theme.palette.mode === 'dark'
                        ? '0px 15px 30px rgba(0, 0, 0, 0.6), inset 0px 1px 1px rgba(255, 255, 255, 0.1)'
                        : '0px 20px 40px rgba(149, 157, 165, 0.3), inset 0px 1px 1px rgba(255, 255, 255, 0.8)',
                },
                backgroundColor: theme.palette.background.paper,
                // Subtle gradient for depth
                background: theme.palette.mode === 'dark'
                    ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`
                    : `linear-gradient(135deg, #ffffff 0%, ${theme.palette.action.hover} 100%)`,
                overflow: 'hidden',
                border: `1px solid ${theme.palette.divider}`,
                position: 'relative'
            }}
        >
            {/* Glossy reflection effect at top */}
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '1px',
                background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)',
                zIndex: 1
            }} />

            <CardActionArea onClick={handleSymbolClick} sx={{ height: '100%' }}>
                <CardContent sx={{ p: 2 }}>
                    {/* Header: Symbol Name */}
                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ color: theme.palette.text.primary, textShadow: '0px 1px 2px rgba(0,0,0,0.1)' }}>
                            {data?.name || data?.Symbol}
                        </Typography>
                        {/* Placeholder for an icon or mini-chart if available later */}
                        <Box sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            bgcolor: theme.palette.background.default,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: 'inset 0px 2px 4px rgba(0,0,0,0.1)' // Inset shadow for the icon circle
                        }}>
                            <TrendingUpIcon fontSize="small" color="primary" />
                        </Box>
                    </Box>

                    {/* Stats Grid */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>

                        {/* Ask Price */}
                        <Box>
                            <Typography variant="caption" color="text.secondary" display="block">
                                Ask
                            </Typography>
                            <Typography variant="body1" fontWeight="600" sx={{ color: askColor }}>
                                {Number(data?.Ask || 0).toFixed(5)}
                            </Typography>
                        </Box>

                        {/* Bid Price */}
                        <Box>
                            <Typography variant="caption" color="text.secondary" display="block">
                                Bid
                            </Typography>
                            <Typography variant="body1" fontWeight="600" sx={{ color: bidColor }}>
                                {Number(data?.Bid || 0).toFixed(5)}
                            </Typography>
                        </Box>

                        {/* Spread */}
                        <Box sx={{ gridColumn: '1 / -1', pt: 1, borderTop: `1px solid ${theme.palette.divider}`, mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption" color="text.secondary">
                                Spread
                            </Typography>
                            <Typography variant="body2" fontWeight="bold" color="text.primary">
                                {spread}
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default QuotesCard;