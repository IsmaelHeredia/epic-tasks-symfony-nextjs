import React from 'react';
import { styled } from '@mui/material/styles';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import Autocomplete, { AutocompleteProps } from '@mui/material/Autocomplete';
import Select, { SelectProps } from '@mui/material/Select';

import { Categoria } from '@/types/Categoria';

const StyledSearchNameTextField = styled(TextField)(({ theme }) => {
    const isDarkMode = theme.palette.mode === 'dark';

    const color = theme.palette.text.primary;
    const borderColor = theme.palette.customTextField?.borderColor;
    const iconColor = theme.palette.customTextField?.icon;

    const borderWidth = isDarkMode ? '1px' : '2px';
    const focusedBorderWidth = isDarkMode ? '2px' : '3px';

    return {
        width: 200,
        backgroundColor: theme.palette.background.paper,
        borderRadius: '8px',

        '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            minHeight: '40px',
            border: `1px solid ${borderColor}`,
            '& fieldset': {
                border: `${borderWidth} solid ${borderColor}`,
            },
            '&:hover fieldset': {
                borderColor: borderColor,
            },
            '&.Mui-focused fieldset': {
                border: `${focusedBorderWidth} solid ${borderColor}`,
            },
            '&.Mui-focused': {
                border: `1px solid ${borderColor}`,
            },
        },
        '& .MuiOutlinedInput-input': {
            padding: '8px 12px',
            color: color,
            '&::placeholder': {
                color: color,
                opacity: 1,
            },
        },
        '& .MuiSvgIcon-root': {
            color: iconColor,
        },
    };
});


export const SearchNameTextField = React.forwardRef<HTMLInputElement, TextFieldProps>((props, ref) => {
    return (
        <StyledSearchNameTextField
            {...props}
            ref={ref}
        />
    );
});


const StyledFormTextField = styled(TextField)(({ theme }) => {

    const colorText = theme.palette.customTextField?.colorText;
    const colorLabel = theme.palette.customTextField?.colorLabel;
    const borderColor = theme.palette.customTextField?.borderColor;
    const borderFocusColor = theme.palette.customTextField?.borderFocusColor;
    const borderHoverColor = theme.palette.customTextField?.borderHoverColor;
    const icon = theme.palette.customTextField?.icon;

    return {
        '& .MuiOutlinedInput-root': {
            minHeight: '56px',
            '& fieldset': {
                border: `2px solid ${borderColor}`,
            },
            '&:hover fieldset': {
                borderColor: borderHoverColor,
            },
            '&.Mui-focused fieldset': {
                border: `3px solid ${borderFocusColor}`,
            },
        },
        '& .MuiInputLabel-root': {
            color: colorLabel,
            fontSize: '21px',
            fontWeight: 500,
            '&.MuiInputLabel-shrink': {
                transform: 'translate(14px, -9px) scale(0.75)',
            },
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: borderFocusColor,
            fontWeight: 500,
        },
        '& .MuiOutlinedInput-input': {
            color: colorText,
            padding: '14px 14px',
        },
        '& .MuiSvgIcon-root': {
            color: icon,
        },
    };
});

export const SearchCategoryAutocomplete = styled(
  Autocomplete<Categoria, true, false, false>
)<AutocompleteProps<Categoria, true, false, false>>(({ theme }) => {
  const isDarkMode = theme.palette.mode === 'dark';
  const color = theme.palette.customTextField?.colorText;
  const borderColor = theme.palette.customTextField?.borderColor;
  const icon = theme.palette.customTextField?.icon;

  const normalBorderWidth = isDarkMode ? '1px' : '2px';
  const focusedBorderWidth = isDarkMode ? '2px' : '3px';

  return {
    width: 400,
    backgroundColor: theme.palette.background.paper,
    borderRadius: '8px',
    '& .MuiOutlinedInput-root': {
      paddingLeft: '0px',
      minHeight: '40px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      border: `1px solid ${borderColor}`,
      '& fieldset': {
        border: `${normalBorderWidth} solid ${borderColor}`,
      },
      '&:hover fieldset': {
        borderColor: borderColor,
      },
      '&.Mui-focused fieldset': {
        border: `${focusedBorderWidth} solid ${borderColor}`,
      },
      '&.Mui-focused': {
        border: `1px solid ${borderColor}`,
      },
    },
    '& .MuiOutlinedInput-input': {
      padding: '8px 12px !important',
      color: color,
      '&::placeholder': {
        color: color,
        opacity: 1,
      },
    },
    '& .MuiAutocomplete-inputRoot': {
      padding: '0 !important',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    '& input': {
      padding: '0 !important',
      flexGrow: 1,
    },
    '& .MuiAutocomplete-clearIndicator': {
      padding: '0 8px',
    },
    '& .MuiAutocomplete-popupIndicator': {
      padding: '0 8px',
    },
    '& .MuiSvgIcon-root': {
      color: icon,
    },
  };
});

export const FormTextField = React.memo(StyledFormTextField);

const StyledFormSelect = styled(Select)<SelectProps>(({ theme }) => {
    const color = theme.palette.customTextField?.borderColor;
    const icon = theme.palette.customTextField?.icon;

    return {
        '& .MuiOutlinedInput-root': {
            minHeight: '56px',
            alignItems: 'center',
            padding: '0',
        },
        '& .MuiOutlinedInput-notchedOutline': {
            border: `2px solid ${color}`,
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: color,
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: `3px solid ${color}`,
        },
        '& .MuiInputLabel-root': {
            color: color,
            fontSize: '21px',
            fontWeight: 500,
            '&.Mui-focused': {
                color: color,
            },
            '&.MuiInputLabel-shrink': {
                transform: 'translate(14px, -9px) scale(0.75)',
            },
        },
        '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
            padding: '14px 14px',
            height: 'auto',
            '& .MuiInputAdornment-root': {
                height: 'auto',
                marginRight: '8px',
            },
        },
        '& .MuiSvgIcon-root': {
            color: icon,
        },
    };
});

export const FormSelect = React.memo(StyledFormSelect);

const AutocompleteWrapper = styled('div')(({ theme }) => {
  const color = theme.palette.customTextField?.colorText || '#000';
  const borderColor = theme.palette.customTextField?.borderColor || theme.palette.grey[500];
  const icon = theme.palette.customTextField?.icon || theme.palette.text.primary;

  return {
    '& .MuiOutlinedInput-root': {
      minHeight: '56px',
      alignItems: 'center',
      padding: '0',

      '& fieldset': {
        border: `2px solid ${borderColor}`,
      },
      '&:hover fieldset': {
        borderColor: borderColor,
      },
      '&.Mui-focused fieldset': {
        border: `3px solid ${borderColor}`,
      },
      '& .MuiInputAdornment-root': {
        height: 'auto',
        padding: '0 8px 0 14px',
        display: 'flex',
        alignItems: 'center',
      },
    },
    '& .MuiInputLabel-root': {
      color: color,
      fontSize: '21px',
      fontWeight: 500,
      '&.MuiInputLabel-shrink': {
        transform: 'translate(14px, -9px) scale(0.75)',
      },
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: color,
      fontWeight: 500,
    },
    '& .MuiAutocomplete-inputRoot': {
      padding: '0 !important',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      flexGrow: 1,
      paddingTop: '8.5px',
      paddingBottom: '8.5px',
    },
    '& input': {
      padding: '0',
      flexGrow: 1,
      color: color,
      minWidth: '30px',
    },
    '& .MuiChip-root': {
      margin: '4px 2px',
    },
    '& .MuiAutocomplete-endAdornment': {
      paddingRight: '14px',
      display: 'flex',
      alignItems: 'center',
    },
    '& .MuiSvgIcon-root': {
      color: icon,
    },
  };
});

export function FormAutocomplete<
  T,
  Multiple extends boolean = false,
  DisableClearable extends boolean = false,
  FreeSolo extends boolean = false
>(props: AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>) {
  return (
    <AutocompleteWrapper>
      <Autocomplete {...props} />
    </AutocompleteWrapper>
  );
}