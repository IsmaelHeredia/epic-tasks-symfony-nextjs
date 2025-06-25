import React from 'react';
import { Box, Typography, ButtonGroup, IconButton, useTheme } from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const theme = useTheme();

  const handleFirstPageButtonClick = () => {
    onPageChange(1);
  };

  const handleBackButtonClick = () => {
    onPageChange(currentPage - 1);
  };

  const handleNextButtonClick = () => {
    onPageChange(currentPage + 1);
  };

  const handleLastPageButtonClick = () => {
    onPageChange(totalPages);
  };

  return (
    <Box
      sx={{
        position: 'fixed', 
        bottom: 0,         
        left: 0,
        width: '100%',     
        padding: theme.spacing(2, 3), 
        display: 'flex',  
        justifyContent: 'space-between',
        alignItems: 'center', 
        zIndex: theme.zIndex.appBar + 1,
      }}
    >
      <Typography variant="body1" color="text.secondary" sx={{ ml : 8 }}>
        Página {currentPage} / {totalPages}
      </Typography>

      <ButtonGroup variant="outlined" aria-label="pagination buttons">
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={currentPage === 1}
          aria-label="primera página"
          sx={{
            color: theme.palette.primary.main,
            '&:disabled': {
              color: theme.palette.action.disabled,
            },
          }}
        >
          <FirstPageIcon />
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={currentPage === 1}
          aria-label="página anterior"
          sx={{
            color: theme.palette.primary.main,
            '&:disabled': {
              color: theme.palette.action.disabled,
            },
          }}
        >
          <KeyboardArrowLeft />
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={currentPage === totalPages}
          aria-label="siguiente página"
          sx={{
            color: theme.palette.primary.main,
            '&:disabled': {
              color: theme.palette.action.disabled,
            },
          }}
        >
          <KeyboardArrowRight />
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={currentPage === totalPages}
          aria-label="última página"
          sx={{
            color: theme.palette.primary.main,
            '&:disabled': {
              color: theme.palette.action.disabled,
            },
          }}
        >
          <LastPageIcon />
        </IconButton>
      </ButtonGroup>
    </Box>
  );
};

export default PaginationControls;