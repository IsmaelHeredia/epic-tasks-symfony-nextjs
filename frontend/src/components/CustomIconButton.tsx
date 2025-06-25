import { IconButton, useTheme } from '@mui/material';
import { IconButtonProps } from '@mui/material/IconButton';

interface CustomIconButtonProps extends IconButtonProps {}

const CustomIconButton: React.FC<CustomIconButtonProps> = ({ sx, ...props }) => {
  const theme = useTheme();

  const backgroundColor = theme.palette.customIconButton?.background || theme.palette.primary.main;
  const color = theme.palette.customIconButton?.color || theme.palette.primary.contrastText;
  const hoverColor = theme.palette.customIconButton?.hover || theme.palette.primary.dark;
  
  return (
    <IconButton
      {...props}
      sx={{
        backgroundColor: backgroundColor,
        color: color,
        textTransform: 'none',
        padding: '6px 12px',
        borderRadius: '8px',
        '&:hover': {
          backgroundColor: hoverColor,
        },
        ...sx,
      }}
    />
  );
};

export default CustomIconButton;