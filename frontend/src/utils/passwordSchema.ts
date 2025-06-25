import { PasswordFormInputs } from '@/type';
import * as yup from 'yup';

export const passwordSchema: yup.ObjectSchema<PasswordFormInputs> = yup.object().shape({
  currentPassword: yup.string().required('La contraseña actual es requerida'),
  newPassword: yup
    .string()
    .required('La nueva contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .matches(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula')
    .matches(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
    .matches(/[0-9]/, 'La contraseña debe contener al menos un número')
    .matches(/[^a-zA-Z0-9]/, 'La contraseña debe contener al menos un carácter especial'),
  confirmNewPassword: yup
    .string()
    .required('Confirma la nueva contraseña')
    .oneOf([yup.ref('newPassword')], 'Las contraseñas no coinciden'),
});