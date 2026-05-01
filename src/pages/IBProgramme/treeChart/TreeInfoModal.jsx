import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

function TreeInfoModal({
    open,
    onClose,
    Content,
    modalWidth,
    contentData,
    loading
}) {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: modalWidth || 600,
        bgcolor: 'background.paper',
        borderRadius: ".5rem",
        boxShadow: 24,
        p: 3,
    };

    return (
        <Modal
            keepMounted
            open={open}
            onClose={onClose}
            aria-labelledby="keep-mounted-modal-title"
            aria-describedby="keep-mounted-modal-description"
        >
            <Box sx={style}>
                <Content data={contentData} loading={loading} onClose={onClose} />
            </Box>
        </Modal>
    );
}

export default TreeInfoModal;