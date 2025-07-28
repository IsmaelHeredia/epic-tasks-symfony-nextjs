import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Avatar,
  IconButton,
  InputAdornment,
  CircularProgress,
  styled,
} from '@mui/material';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import CloseIcon from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';
import Image from 'next/image';
import { UserFormInputs, PasswordFormInputs } from '@/type';
import { CuentaPayload } from '@/types/api';
import { toast } from 'react-toastify';
import { actualizarCuenta } from '@/services/cuentaService';
import { signOut, useSession } from 'next-auth/react';
import LoadingButton from '@mui/lab/LoadingButton';
import { useTheme } from '@mui/material/styles';

const passwordSchema = yup.object().shape({
  currentPassword: yup.string().required('La contraseña actual es obligatoria.'),
  newPassword: yup
    .string()
    .min(6, 'La nueva contraseña debe tener al menos 6 caracteres.')
    .required('La nueva contraseña es obligatoria.'),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Las contraseñas no coinciden.')
    .required('La confirmación de la nueva contraseña es obligatoria.'),
});

const userSchema = yup.object().shape({
  username: yup.string().required('El nombre de usuario es obligatorio.'),
  currentPassword: yup.string().required('La contraseña actual es obligatoria para guardar cambios.'),
});

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 600 },
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ width: '100%' }}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

interface ProfileSettingsModalProps {
  open: boolean;
  onClose: () => void;
}

const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({ open, onClose }) => {
  const { data: session, update: updateSession } = useSession();
  const currentUser = session?.user;
  const theme = useTheme();

  const [tabValue, setTabValue] = useState<number>(0);
  const [profileImagePreview, setProfileImagePreview] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const getProfileImageUrl = (imageFileName?: string | null): string => {
    if (!imageFileName) {
      return '';
    }
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/usuarios/${imageFileName}`;
  };

  interface UserProfileFormInputs {
    username: string;
    currentPassword: string;
  }

  const {
    control: userControl,
    handleSubmit: handleUserSubmit,
    formState: { errors: userErrors },
    reset: resetUserForm,
    setValue: setUserFormValue,
    getValues: getUserFormValues,
  } = useForm<UserProfileFormInputs>({
    defaultValues: {
      username: currentUser?.nombre || '',
      currentPassword: '',
    },
    resolver: yupResolver(userSchema),
  });

  const {
    control: passwordControl,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm<PasswordFormInputs>({
    resolver: yupResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  useEffect(() => {
    if (open && currentUser) {
      setUserFormValue('username', currentUser.nombre || '');
      setUserFormValue('currentPassword', '');
      setProfileImagePreview(getProfileImageUrl(currentUser.imagen));
      setSelectedFile(null);
      resetPasswordForm();
    }
  }, [open, currentUser, setUserFormValue, resetPasswordForm]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setProfileImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setProfileImagePreview(getProfileImageUrl(currentUser?.imagen));
    }
  };

  const handleSaveUsername: SubmitHandler<UserProfileFormInputs> = async (data) => {
    setLoading(true);
    try {
      const currentUsernameInForm = getUserFormValues('username');
      const hasUsernameChanged = currentUsernameInForm !== (currentUser?.nombre || '');
      const hasImageChanged = selectedFile !== null;

      if (!hasUsernameChanged && !hasImageChanged) {
        toast.info('No hay cambios para guardar.', {
          autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST),
        });
        onClose();
        return;
      }

      const payload: CuentaPayload = {
        nombre: data.username,
        imagen: selectedFile
          ? selectedFile
          : currentUser?.imagen && !selectedFile && !hasImageChanged
          ? null
          : undefined,
        currentPassword: data.currentPassword,
      };

      await actualizarCuenta(payload);

      toast.success('Perfil actualizado con éxito.', {
        autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST),
      });

      onClose();

      setTimeout(() => {
        signOut({ callbackUrl: "/" });
      }, Number(process.env.NEXT_PUBLIC_TIMEOUT_REDIRECT || 500));

    } catch (error: any) {
      console.error('Error al guardar el perfil:', error);
      toast.error(error.message || 'Error al actualizar el perfil. Verifica tu contraseña actual.', {
        autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePassword: SubmitHandler<PasswordFormInputs> = async (data) => {
    setLoading(true);
    try {
      const payload: CuentaPayload = {
        clave: data.newPassword,
        currentPassword: data.currentPassword,
      };

      await actualizarCuenta(payload);

      toast.success('Contraseña actualizada con éxito.', {
        autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST),
      });

      onClose();
      setTimeout(() => {
        signOut({ callbackUrl: "/" });
      }, Number(process.env.NEXT_PUBLIC_TIMEOUT_REDIRECT || 500));

    } catch (error: any) {
      console.error('Error al guardar contraseña:', error);
      toast.error(error.message || 'Error al actualizar la contraseña.', {
        autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setUserFormValue('username', currentUser?.nombre || '');
    setUserFormValue('currentPassword', '');
    setProfileImagePreview(getProfileImageUrl(currentUser?.imagen));
    setSelectedFile(null);
    resetPasswordForm();
    onClose();
  };

  const handleSave = () => {
    if (tabValue === 0) {
      handleUserSubmit(handleSaveUsername)();
    } else {
      handlePasswordSubmit(handleSavePassword)();
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleCancel}
      aria-labelledby="profile-settings-modal-title"
      aria-describedby="profile-settings-modal-description"
    >
      <Box sx={style}>
        <Box sx={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mb: 2,
            width: '100%',
            minHeight: '48px'
        }}>
            <Typography
                id="profile-settings-modal-title"
                variant="h5"
                component="h2"
                gutterBottom
                sx={{
                    fontWeight: 'bold',
                    color: 'primary.main',
                    mt: 3,
                    textAlign: 'center',
                    flexGrow: 1,
                    mr: 5
                }}
            >
                Ajustes de Perfil
            </Typography>

            <IconButton
                aria-label="close"
                onClick={handleCancel}
                sx={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    color: (theme) => theme.palette.grey[500],
                    mt: 1,
                    mr: 1
                }}
            >
                <CloseIcon />
            </IconButton>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile settings tabs" centered>
            <Tab label="Información General" icon={<PersonIcon />} iconPosition="start" {...a11yProps(0)} />
            <Tab label="Contraseña" icon={<LockIcon />} iconPosition="start" {...a11yProps(1)} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <Box sx={{ position: 'relative', width: 100, height: 100 }}>
              <Avatar sx={{ width: '100%', height: '100%', bgcolor: 'grey.300' }}>
                {profileImagePreview ? (
                  <Image
                    src={profileImagePreview}
                    alt={currentUser?.nombre || "User Avatar"}
                    layout="fill"
                    objectFit="cover"
                    priority
                  />
                ) : (
                  <PersonIcon sx={{ fontSize: 60, color: 'grey.600' }} />
                )}
              </Avatar>
              <IconButton
                component="label"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
              >
                <PhotoCameraIcon />
                <VisuallyHiddenInput type="file" accept="image/*" onChange={handleImageUpload} />
              </IconButton>
            </Box>

            <Controller
              name="username"
              control={userControl}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nombre de Usuario"
                  variant="outlined"
                  fullWidth
                  error={!!userErrors.username}
                  helperText={userErrors.username?.message}
                />
              )}
            />

            <Controller
              name="currentPassword"
              control={userControl}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Contraseña Actual"
                  type={showCurrentPassword ? 'text' : 'password'}
                  variant="outlined"
                  fullWidth
                  error={!!userErrors.currentPassword}
                  helperText={userErrors.currentPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          edge="end"
                        >
                          {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <Controller
              name="currentPassword"
              control={passwordControl}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Contraseña Actual"
                  type={showCurrentPassword ? 'text' : 'password'}
                  variant="outlined"
                  fullWidth
                  error={!!passwordErrors.currentPassword}
                  helperText={passwordErrors.currentPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          edge="end"
                        >
                          {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
            <Controller
              name="newPassword"
              control={passwordControl}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nueva Contraseña"
                  type={showNewPassword ? 'text' : 'password'}
                  variant="outlined"
                  fullWidth
                  error={!!passwordErrors.newPassword}
                  helperText={passwordErrors.newPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          edge="end"
                        >
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
            <Controller
              name="confirmNewPassword"
              control={passwordControl}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Confirmar Nueva Contraseña"
                  type={showConfirmNewPassword ? 'text' : 'password'}
                  variant="outlined"
                  fullWidth
                  error={!!passwordErrors.confirmNewPassword}
                  helperText={passwordErrors.confirmNewPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                          edge="end"
                        >
                          {showConfirmNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Box>
        </TabPanel>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3, width: '100%' }}>
          <Button
            variant="outlined"
            onClick={handleCancel}
            disabled={loading}
            startIcon={<CancelIcon />}
            sx={{
              borderColor: theme.palette.grey[400],
              color: theme.palette.text.primary,
              '&:hover': {
                borderColor: theme.palette.grey[600],
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            Cancelar
          </Button>
          <LoadingButton
            onClick={handleSave}
            variant="contained"
            color="primary"
            loading={loading}
            disabled={loading}
            loadingPosition="start"
            startIcon={<LockIcon />}
          >
            Guardar Cambios
          </LoadingButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default ProfileSettingsModal;