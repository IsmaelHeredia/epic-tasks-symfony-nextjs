import React from 'react';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Divider,
  Fade,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface AboutModalProps {
  open: boolean;
  handleClose: () => void;
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 400 },
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  outline: 'none',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
};

const AboutModal: React.FC<AboutModalProps> = ({ open, handleClose }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="about-modal-title"
      aria-describedby="about-modal-description"
      closeAfterTransition
    >
      <Fade in={open}>
        <Box sx={style}>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography 
            id="about-modal-title" 
            variant="h5" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold', 
              color: 'primary.main',
              mt: 3
            }}
          >
            Acerca del Programa
          </Typography>
          <Divider sx={{ width: '60%', my: 2 }} />
          <Typography id="about-modal-description" variant="body1" sx={{ mb: 1 }}>
            Nombre del Programa: Epic Tasks
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Versión: 1.0
          </Typography>
          <Typography variant="body1">
            Autor: Ismael Heredia
          </Typography>
        </Box>
      </Fade>
    </Modal>
  );
};

export default AboutModal;