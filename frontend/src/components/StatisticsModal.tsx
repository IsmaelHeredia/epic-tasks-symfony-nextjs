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

interface StatisticsModalProps {
  open: boolean;
  handleClose: () => void;
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 500 },
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

const StatisticsModal: React.FC<StatisticsModalProps> = ({ open, handleClose }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="statistics-modal-title"
      aria-describedby="statistics-modal-description"
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
          <Typography id="statistics-modal-title" variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Estadísticas del Programa
          </Typography>
          <Divider sx={{ width: '60%', my: 2 }} />
          <Typography id="statistics-modal-description" variant="body1" sx={{ mb: 2 }}>
            Estadísticas
          </Typography>
        </Box>
      </Fade>
    </Modal>
  );
};

export default StatisticsModal;