import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { useState, createElement } from 'react';
import { Typography } from '@mui/material';

function ModalComponent({ btnName, btnSx, type = "button", color, startIcon, Content, contentData, modalWidth, open, onClose }) {

  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = typeof open === "boolean";

  const handleOpen = () => {
    if (!isControlled) setInternalOpen(true);
  };

  const handleClose = () => {
    if (isControlled && onClose) onClose();
    else setInternalOpen(false);
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: modalWidth ? modalWidth : 600,
    bgcolor: 'background.paper',
    borderRadius: ".5rem",
    boxShadow: 24,
    p: 3,
  }

  return (
    <div>
      {type === "button" ? (
        <Button
          variant="contained"
          startIcon={startIcon}
          onClick={handleOpen}
          sx={{ ...btnSx, textTransform: "none" }}
        >
          {btnName}
        </Button>
      ) : type === "icon" ? (
        createElement(btnName, {
          onClick: handleOpen,
          sx: { ...btnSx, cursor: "pointer" },
        })
      ) : (
        <Typography onClick={handleOpen} sx={{ cursor: "pointer", color: color, ...btnSx }}>
          {btnName}
        </Typography>
      )}
      <Modal
        // keepMounted
        open={isControlled ? open : internalOpen}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
          <Content onClose={handleClose} data={contentData} />
        </Box>
      </Modal>
    </div>
  );
}

export default ModalComponent;