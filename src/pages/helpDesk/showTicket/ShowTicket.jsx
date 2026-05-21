import { Box, Container, Stack, TextField, Typography, Button, Skeleton, Chip, Divider, useTheme, Avatar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useReplaySupportTicketMutation, useSupportTicketByIdQuery } from '../../../globalState/supportState/supportStateApis';
import { useState } from 'react';
import { setNotification } from '../../../globalState/notificationState/notificationStateSlice';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

function ShowTicket() {

    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const { state } = useLocation();

    const id = state?.ticketId;
    const dispatch = useDispatch();

    const { data, isLoading } = useSupportTicketByIdQuery({ id });

    const selectedTicket = data?.data;

    const selectedTicketData = {
        "Created on": selectedTicket?.createdAt,
        "Closed on": selectedTicket?.status === "CLOSED" ? selectedTicket?.updatedAt : "Not closed yet"
    };

    const { selectedTheme } = useSelector((state) => state.themeMode);

    const [replyMessage, setReplyMessage] = useState("");
    const [error, setError] = useState("");

    const [replaySupportTicket, { isLoading: replyLoading }] = useReplaySupportTicketMutation();

    const handleReplySubmit = async (e) => {
        e.preventDefault();

        if (!replyMessage.trim()) {
            setError("Reply message cannot be empty.");
            return;
        }

        try {
            const response = await replaySupportTicket({ ticketId: id, message: replyMessage }).unwrap();
            if (response?.status) {
                setError("");
                dispatch(setNotification({ open: true, message: response?.message, severity: "success" }));
                setReplyMessage("");
            }
        } catch (error) {
            if (!error?.data?.status) {
                dispatch(setNotification({ open: true, message: error?.data?.message || "Failed to submit. Please try again later.", severity: "error" }));
            }
        }
    };

    // Styling Constants from AccountDetailsAccordian
    const cardBg = isDarkMode ? '#0b0e11' : '#ffffff';
    const primaryTextColor = isDarkMode ? '#fff' : '#111827';
    const secondaryTextColor = isDarkMode ? '#9CA3AF' : '#6B7280';
    const dividerColor = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

    const wrapperSx = isDarkMode ? {
        background: `linear-gradient(${cardBg}, ${cardBg}) padding-box, linear-gradient(135deg, #00C076 0%, rgba(0, 192, 118, 0) 60%) border-box`,
        backdropFilter: 'blur(10px)',
        boxShadow: '0px 8px 32px rgba(0, 192, 118, 0.08), 0px 4px 8px rgba(0,0,0,0.4)',
        border: '1px solid transparent',
    } : {
        background: cardBg,
        boxShadow: '0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px rgba(0,0,0,0.06)',
        border: '1px solid #E5E7EB',
    };

    return (
        <Container maxWidth="lg" sx={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant='h4' fontWeight={"700"} color={primaryTextColor}>
                    Ticket Details
                </Typography>
            </Stack>

            {/* Ticket Info Card */}
            <Box sx={{ ...wrapperSx, borderRadius: '24px', p: 3 }}>
                <Stack spacing={3}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
                        <Box>
                            <Typography variant="body2" color={secondaryTextColor} mb={0.5}>Subject</Typography>
                            <Typography variant="h6" fontWeight="600" color={primaryTextColor}>
                                {isLoading ? <Skeleton width={200} /> : selectedTicket?.subject}
                            </Typography>
                        </Box>
                        <Chip
                            label={isLoading ? "Loading..." : selectedTicket?.status}
                            sx={{
                                fontWeight: 700,
                                borderRadius: '8px',
                                bgcolor: selectedTicket?.status === "OPEN" ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                color: selectedTicket?.status === "OPEN" ? '#22c55e' : '#ef4444',
                                border: `1px solid ${selectedTicket?.status === "OPEN" ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                            }}
                        />
                    </Stack>

                    <Divider sx={{ borderColor: dividerColor, borderStyle: 'dashed' }} />

                    <Stack direction="row" flexWrap="wrap" gap={4}>
                        {Object.entries(selectedTicketData).map(([key, value], i) => (
                            <Box key={i}>
                                <Typography variant="caption" color={secondaryTextColor} display="block" mb={0.5}>
                                    {key}
                                </Typography>
                                <Typography variant="body2" fontWeight="500" color={primaryTextColor}>
                                    {isLoading ? <Skeleton width={100} /> : (key.includes('on') && value !== "Not closed yet" ? new Date(value).toLocaleString() : value)}
                                </Typography>
                            </Box>
                        ))}
                    </Stack>
                </Stack>
            </Box>

            <Stack spacing={3}>
                <Typography variant="h6" fontWeight="600" color={primaryTextColor}>Conversation</Typography>

                <Stack spacing={2} sx={{ minHeight: '200px' }}>
                    {selectedTicket?.message?.length > 0 && selectedTicket.message.map((item, i) => {
                        const isUser = item?.sender === "user";
                        return (
                            <Box
                                key={i}
                                sx={{
                                    alignSelf: isUser ? "flex-end" : "flex-start",
                                    maxWidth: { xs: "90%", md: "70%" },
                                    display: "flex",
                                    flexDirection: isUser ? "row-reverse" : "row",
                                    gap: 1.5
                                }}
                            >
                                <Avatar
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        bgcolor: isUser ? 'primary.main' : 'secondary.main'
                                    }}
                                >
                                    {isUser ? <PersonIcon fontSize="small" /> : <SupportAgentIcon fontSize="small" />}
                                </Avatar>

                                <Box>
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: isUser ? "16px 0px 16px 16px" : "0px 16px 16px 16px",
                                            bgcolor: isUser ? "primary.main" : (isDarkMode ? "rgba(255,255,255,0.05)" : "#f3f4f6"),
                                            color: isUser ? "#fff" : primaryTextColor,
                                            boxShadow: isUser ? "0 4px 12px rgba(0,0,0,0.1)" : "none",
                                            position: 'relative'
                                        }}
                                    >
                                        <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{item?.text}</Typography>
                                    </Box>
                                    <Typography
                                        variant="caption"
                                        color={secondaryTextColor}
                                        sx={{
                                            display: 'block',
                                            mt: 0.5,
                                            textAlign: isUser ? 'right' : 'left',
                                            fontSize: '11px'
                                        }}
                                    >
                                        {new Date(item?.time).toLocaleString()}
                                    </Typography>
                                </Box>
                            </Box>
                        );
                    })}
                </Stack>
            </Stack>

            {/* Reply Section */}
            <Box
                component="form"
                onSubmit={handleReplySubmit}
                sx={{
                    ...wrapperSx,
                    p: 3,
                    borderRadius: '24px',
                }}
            >
                <Typography variant="subtitle1" fontWeight="600" color={primaryTextColor} mb={2}>
                    Add Reply
                </Typography>

                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Type your message here..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                            bgcolor: isDarkMode ? 'rgba(0,0,0,0.2)' : '#fff',
                            '& fieldset': { borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
                            '&:hover fieldset': { borderColor: 'primary.main' },
                        }
                    }}
                />

                {error && (
                    <Typography color="error" variant="body2" mb={2}>
                        {error}
                    </Typography>
                )}

                <Box display="flex" justifyContent="flex-end">
                    <Button
                        variant="contained"
                        type="submit"
                        disabled={replyLoading || selectedTicket?.status === "CLOSED" || isLoading}
                        endIcon={<SendIcon />}
                        sx={{
                            px: 4,
                            py: 1,
                            borderRadius: '12px',
                            textTransform: 'none',
                            fontWeight: 600,
                            boxShadow: 'none',
                            '&:hover': {
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                            }
                        }}
                    >
                        {replyLoading ? 'Sending...' : 'Send Reply'}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default ShowTicket;