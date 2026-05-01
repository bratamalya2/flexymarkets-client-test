import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    borderRadius: "1.2rem",
    boxShadow: 24,
    p: 4,
};

function NewsModalBox({ buttonName, data }) {

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Typography
                onClick={handleOpen}
                sx={{
                    cursor: "pointer",
                    color: "primary.main",
                    display: "inline-block"
                }}
            >{buttonName}</Typography>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography
                        onClick={() => handleClose(true)}
                        sx={{
                            cursor: "pointer",
                            mb: "1rem",
                            display: "inline-block"
                        }}
                    ><CloseIcon /></Typography>
                    <Box>
                        <img src={data.image} alt="error" width={"100%"} height={"190px"} />
                    </Box>
                    <Typography fontSize={".9rem"} fontWeight={"bold"} color={"primary.main"}>{data.heading}</Typography>
                    <Typography>{data.date}</Typography>
                    <Typography
                        sx={{
                            fontSize: ".9rem",
                            mt: ".7rem"
                        }}
                    >
                        {data.note}
                    </Typography>
                </Box>
            </Modal>
        </div>
    );
}

export default NewsModalBox;