import { Box, Typography, Tooltip, IconButton, useMediaQuery, Stack, TextField, InputAdornment, Button } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useGetUserDataQuery } from '../../../../globalState/userState/userStateApis';
import { useSelector } from 'react-redux';
import { useState } from 'react';

const IB_REFERAAL_LINK = import.meta.env.VITE_IB_REFERAAL_LINK;

function IBDashboardHeader() {
    const [copied, setCopied] = useState(false);
    const { token } = useSelector((state) => state.auth);
    const { selectedTheme } = useSelector((state) => state.themeMode);

    const { data } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    });

    const userName = data?.data?.userData?.userName;
    const referralLink = `${IB_REFERAAL_LINK}?referralCode=${userName || ''}`;

    const handleCopy = () => {
        if (referralLink) {
            navigator.clipboard.writeText(referralLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        }
    };

    const isMobile = useMediaQuery('(max-width:600px)');

    return (
        <Stack
            direction={isMobile ? "column" : "row"}
            justifyContent="space-between"
            alignItems={isMobile ? "flex-start" : "center"}
            spacing={2}
            sx={{ mb: 3 }}
        >
            <Typography
                variant='h4'
                fontWeight="700"
                sx={{
                    background: selectedTheme === 'dark'
                        ? 'linear-gradient(45deg, #FFF 30%, #a5a5a5 90%)'
                        : 'inherit',
                    WebkitBackgroundClip: selectedTheme === 'dark' ? 'text' : 'inherit',
                    WebkitTextFillColor: selectedTheme === 'dark' ? 'transparent' : 'inherit',
                    textShadow: selectedTheme === 'dark' ? '0px 0px 20px rgba(255,255,255,0.1)' : 'none'
                }}
            >
                IB Dashboard
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 1,
                    pl: 2,
                    borderRadius: '12px',
                    bgcolor: selectedTheme === 'dark' ? "rgba(255, 255, 255, 0.05)" : "#ffffff",
                    backdropFilter: "blur(10px)",
                    border: selectedTheme === 'dark' ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid #d0d0d0",
                    boxShadow: selectedTheme === 'dark' ? "none" : "0 4px 12px rgba(0,0,0,0.05)",
                    width: isMobile ? '100%' : 'auto',
                    maxWidth: '500px'
                }}
            >
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap', mr: 1, display: { xs: 'none', sm: 'block' } }}>
                    Referral Link:
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        fontFamily: 'monospace',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: selectedTheme === 'dark' ? '#00E396' : 'primary.main',
                        maxWidth: '250px'
                    }}
                >
                    {referralLink}
                </Typography>

                <Tooltip title={copied ? "Copied!" : "Copy Link"}>
                    <Button
                        onClick={handleCopy}
                        variant="contained"
                        size="small"
                        sx={{
                            minWidth: 'auto',
                            px: 2,
                            borderRadius: '8px',
                            bgcolor: copied ? 'success.main' : 'primary.main',
                            textTransform: 'none',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                        }}
                    >
                        {copied ? "Copied" : "Copy"}
                    </Button>
                </Tooltip>
            </Box>
        </Stack>
    );
}

export default IBDashboardHeader;