import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import { useCloseSupportTicketMutation } from '../globalState/supportState/supportStateApis';
import { setNotification } from '../globalState/notificationState/notificationStateSlice';
import { useDispatch } from 'react-redux';

function DialogBox({ btnName, btnSx, ticketId }) {

    const dispatch = useDispatch()

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [closeSupportTicket, { isLoading }] = useCloseSupportTicketMutation()

    const handleSubmitClose = async () => {
        try {
            const response = await closeSupportTicket({ ticketId }).unwrap();
            if (response?.status) {
                dispatch(setNotification({ open: true, message: response?.message, severity: "success" }));
                handleClose()
            }
        } catch (error) {
            if (!error?.data?.status) {
                dispatch(setNotification({ open: true, message: error?.data?.message || "Failed to submit. Please try again later.", severity: "error" }));
            }
        }
    }

    return (
        <>
            <Button variant='contained' sx={btnSx && { ...btnSx }} onClick={handleClickOpen}>
                {btnName}
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Close ticket?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Once you close your ticket, you won't be able to reopen it.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Disagree</Button>
                    <Button disabled={isLoading} onClick={handleSubmitClose} autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default DialogBox;