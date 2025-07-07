import { PaletteColor } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {

    customIconButton?: {
      background?: string,
      color?: string,
      hover?: string
    };

    customTextField?: {
      colorLabel?: string,
      colorText?: string,
      borderColor?: string,
      borderHoverColor?: string,
      borderFocusColor?: string,
      icon?: string
    };

    customNavbar?: {
      background?: string,
      color?: string,
      menuTextColor?: string,
      icon?: string
    };

    customIconNavbar?: {
      background?: string
    }

  }

  interface PaletteOptions {

    customIconButton?: {
      background?: string,
      color?: string,
      hover?: string
    };

    customTextField?: {
      colorLabel?: string,
      colorText?: string,
      borderColor?: string,
      borderHoverColor?: string,
      borderFocusColor?: string,
      icon?: string
    };

    customNavbar?: {
      background?: string,
      color?: string
      menuTextColor?: string
      icon?: string
    };

    customIconNavbar?: {
      background?: string
    };

  }
}

type Estado = typeof estados[number];
type Prioridad = typeof prioridades[number];

type Subtarea = {
  id: number;
  titulo: string;
  contenido: string;
  estado: Estado;
  prioridad: Prioridad;
  orden: number;
  categorias: string[];
};

type Tarea = {
  titulo: string;
  contenido: string;
  estado: Estado;
  prioridad: Prioridad;
  orden: number;
  categorias: string[];
  subtareas: Subtarea[];
};

type ModalTareaProps = {
  open: boolean;
  onClose: () => void;
  onSave: (tarea: Tarea) => void;
  initialTask?: Tarea | null;
};

export interface UserProfileData {
  username: string;
  profileImageUrl: string;
}

export interface ProfileSettingsModalProps {
  open: boolean;
  onClose: () => void;
  initialData: UserProfileData;
}

export interface UserFormInputs {
  username: string;
}

export interface PasswordFormInputs {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

