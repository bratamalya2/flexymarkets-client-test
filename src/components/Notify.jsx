import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useSelector, useDispatch } from 'react-redux';
import { clearNotification } from '../globalState/notificationState/notificationStateSlice';

function Notify() {
    const dispatch = useDispatch();
    const { open, message, severity } = useSelector(state => state.notification);

    const handleClose = () => {
        dispatch(clearNotification());
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={4000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            sx={{ mt: "70px" }}
        >
            <Alert onClose={handleClose} severity={severity} variant="filled" sx={{ width: '100%', minWidth: '320px' }}>
                {message}
            </Alert>
        </Snackbar>
    );
}

export default Notify;