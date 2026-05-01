import { Box, Container, Stack, TextField, Typography, Button, Skeleton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useReplaySupportTicketMutation, useSupportTicketByIdQuery } from '../../../globalState/supportState/supportStateApis';
import { useState } from 'react';
import { setNotification } from '../../../globalState/notificationState/notificationStateSlice';

function ShowTicket() {

    const { state } = useLocation()

    const id = state?.ticketId
    const dispatch = useDispatch()

    const { data, isLoading } = useSupportTicketByIdQuery({ id })

    const selectedTicket = data?.data

    const selectedTicketData = {
        "Subject": selectedTicket?.subject,
        "Status": selectedTicket?.status,
        "Created on": selectedTicket?.createdAt,
        "Closed on": selectedTicket?.status === "CLOSED" ? selectedTicket?.updatedAt : "Not closed yet"
    }

    const { selectedTheme } = useSelector((state) => state.themeMode);

    const [replyMessage, setReplyMessage] = useState("")
    const [error, setError] = useState("")

    const [replaySupportTicket, { isLoading: replyLoading }] = useReplaySupportTicketMutation()

    const handleReplySubmit = async (e) => {
        e.preventDefault();

        if (!replyMessage.trim()) {
            setError("Reply message cannot be empty.");
            return;
        }

        try {
            const response = await replaySupportTicket({ ticketId: id, message: replyMessage }).unwrap();
            if (response?.status) {
                setError("")
                dispatch(setNotification({ open: true, message: response?.message, severity: "success" }));
                setReplyMessage("")
            }
        } catch (error) {
            if (!error?.data?.status) {
                dispatch(setNotification({ open: true, message: error?.data?.message || "Failed to submit. Please try again later.", severity: "error" }));
            }
        }
    }

    return (
        <Container sx={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <Typography variant='h5' fontWeight={"700"} fontSize={"1.8rem"}>Show Ticket</Typography>
            <Stack
                sx={{
                    bgcolor: selectedTheme === "dark" ? "#272727" : "#e9e6e6",
                    p: "1rem",
                    borderRadius: ".5rem",
                    gap: "5px"
                }}
            >
                {
                    Object.entries(selectedTicketData).map(([keys, values], i) => (
                        <Box
                            key={i}
                            sx={{
                                display: "flex",
                                gap: ".5rem"
                            }}
                        >
                            <Typography fontSize={"1rem"} fontWeight={"700"}>{isLoading ? <Skeleton width={"200px"} /> : `${keys} :`}</Typography>
                            <Typography
                                sx={{
                                    color: values === "CLOSED" ? "red" : values === "Open" && "green",
                                    fontSize: "1rem",
                                    fontWeight: "700"
                                }}
                            >
                                {
                                    isLoading
                                        ?
                                        <Skeleton width={"200px"} />
                                        :
                                        (keys === "Created on" || (selectedTicket?.status === "CLOSED" && keys === "Closed on")) ? new Date(values).toLocaleString() : values
                                }
                            </Typography>
                        </Box>
                    ))
                }
            </Stack>
            <Stack
                sx={{
                    bgcolor: selectedTheme === "dark" ? "#272727" : "#e9e6e6",
                    p: "1rem",
                    borderRadius: ".5rem",
                    gap: "15px"
                }}
            >
                {
                    (selectedTicket?.message)?.length > 0 && (selectedTicket?.message).map((item, i) => (
                        <Stack
                            sx={{
                                flexFlow: item?.sender === "user" && "row-reverse",
                                textAlign: item?.sender === "user" ? "right" : "left",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column"
                                }}
                            >
                                <Typography sx={{ fontSize: "1rem", fontWeight: "bold" }}>{isLoading ? <Skeleton width={"200px"} /> : item?.sender === "user" ? "You" : "Admin"}</Typography>
                                <Typography>{isLoading ? <Skeleton width={"200px"} /> : item?.text}</Typography>
                                <Typography sx={{ fontSize: "12px" }}>{isLoading ? <Skeleton width={"200px"} /> : new Date(item?.time).toLocaleString()}</Typography>
                            </Box>
                        </Stack>
                    ))
                }
            </Stack>
            <Stack
                sx={{
                    bgcolor: selectedTheme === "dark" ? "#272727" : "#e9e6e6",
                    p: "1rem",
                    borderRadius: ".5rem"
                }}
                component={"form"}
                onSubmit={handleReplySubmit}
            >
                <Typography
                    mb={"1rem"}
                    fontSize={"1.2rem"}
                    fontWeight={"bold"}
                    color={"primary.main"}
                >Add reply</Typography>
                <TextField
                    name='message'
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    multiline
                    rows={3}
                    placeholder='Enter comment'
                ></TextField>
                {error && <Typography color="error">{error}</Typography>}
                <Button
                    variant='contained'
                    disabled={replyLoading || (selectedTicket?.status === "CLOSED") || isLoading}
                    type='submit'
                    sx={{
                        textTransform: "capitalize",
                        boxShadow: "none",
                        color: "white",
                        mt: '1.5rem',
                        alignSelf: "flex-start",
                        "&:hover": {
                            boxShadow: "none"
                        }
                    }}
                >Submit</Button>
            </Stack>
        </Container>
    )
}

export default ShowTicket;