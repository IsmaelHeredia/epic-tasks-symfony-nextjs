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
import Image from 'next/image';
import { UserFormInputs, PasswordFormInputs } from '@/type';
import { CuentaPayload } from '@/types/api';
import { toast } from 'react-toastify';
import { actualizarCuenta } from '@/services/cuentaService';
import { useSession } from 'next-auth/react';

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

  const [tabValue, setTabValue] = useState<number>(0);
  const [profileImagePreview, setProfileImagePreview] = useState<string>('/default-avatar.png');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const getProfileImageUrl = (imageFileName?: string | null): string => {
    if (imageFileName) {
      return `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/usuarios/${imageFileName}`;
    }
    return '/default-avatar.png';
  };

  const {
    control: userControl,
    handleSubmit: handleUserSubmit,
    formState: { errors: userErrors },
    reset: resetUserForm,
    setValue: setUserFormValue,
    getValues: getUserFormValues,
  } = useForm<UserFormInputs>({
    defaultValues: {
      username: currentUser?.nombre || '',
    },
    resolver: yupResolver(
      yup.object().shape({
        username: yup.string().required('El nombre de usuario es obligatorio.'),
      })
    ),
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

  const handleSaveUsername: SubmitHandler<UserFormInputs> = async (data) => {
    setLoading(true);
    try {
      const currentUsernameInForm = getUserFormValues('username');
      const hasUsernameChanged = currentUsernameInForm !== (currentUser?.nombre || '');
      const hasImageChanged = selectedFile !== null;

      if (!hasUsernameChanged && !hasImageChanged) {
        toast.info('No hay cambios para guardar.', {
          autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST),
        });
        setLoading(false);
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
      };

      await actualizarCuenta(payload);

      toast.success('Perfil actualizado con éxito.', {
        autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST),
      });

      await updateSession({
        nombre: data.username,
        imagen: selectedFile ? profileImagePreview : currentUser?.imagen || null,
      });

      onClose();
    } catch (error: any) {
      console.error('Error al guardar el perfil:', error);
      toast.error(error.message || 'Error al actualizar el perfil.', {
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
      };

      await actualizarCuenta(payload);

      toast.success('Contraseña actualizada con éxito.', {
        autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST),
      });
      resetPasswordForm();
      onClose();
    } catch (error: any) {
      console.error('Error al guardar contraseña:', error);
      toast.error(error.message || 'Error al actualizar la contraseña.', {
        autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST),
      } );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setUserFormValue('username', currentUser?.nombre || '');
    setProfileImagePreview(getProfileImageUrl(currentUser?.imagen));
    setSelectedFile(null);
    resetPasswordForm();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleCancel}
      aria-labelledby="profile-settings-modal-title"
      aria-describedby="profile-settings-modal-description"
    >
      <Box sx={style}>
        <Typography id="profile-settings-modal-title" variant="h5" component="h2" align="center" fontWeight="bold" color="primary">
          Ajustes de Perfil
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile settings tabs" centered>
            <Tab label="Información General" icon={<PersonIcon />} iconPosition="start" {...a11yProps(0)} />
            <Tab label="Contraseña" icon={<LockIcon />} iconPosition="start" {...a11yProps(1)} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Box component="form" onSubmit={handleUserSubmit(handleSaveUsername)} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
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

            <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Guardar Cambios'}
            </Button>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box component="form" onSubmit={handlePasswordSubmit(handleSavePassword)} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
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
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Cambiar Contraseña'}
            </Button>
          </Box>
        </TabPanel>

        <Button onClick={handleCancel} color="secondary" fullWidth disabled={loading}>
          Cancelar
        </Button>
      </Box>
    </Modal>
  );
};

export default ProfileSettingsModal;