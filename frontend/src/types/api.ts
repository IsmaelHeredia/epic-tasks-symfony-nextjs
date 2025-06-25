export interface Categoria {
  id: number;
  nombre: string;
}

export interface Prioridad {
  id: number;
  nombre: string;
}

export interface Estado {
  id: number;
  nombre: string;
}

export interface Subtarea {
  id: number;
  titulo: string;
  contenido: string;
  orden: number;
  estado: Estado;
  prioridad: Prioridad;
  categorias: Categoria[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Tarea {
  mensaje?: string;
  id: number;
  titulo: string;
  contenido: string;
  orden: number;
  estado: Estado;
  prioridad: Prioridad;
  categorias: Categoria[];
  subtareas: Subtarea[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TareaListResponse {
  mensaje: string;
  tareas: Tarea[];
  currentPage: number;
  perPage: number;
  totalPages: number;
  totalCount: number;
}

export type CategoriaListResponse = {
  mensaje: string;
  categorias: Categoria[];
};

export type PrioridadListResponse = {
  mensaje: string;
  prioridades: Prioridad[];
};

export type EstadoListResponse = {
  mensaje: string;
  estados: Estado[];
};

export type CategoriaPayload = Omit<Categoria, "id">;

export interface SubtareaPayload {
  id?: number;
  titulo: string;
  contenido: string;
  orden: number;
  estadoId: number;
  prioridadId: number;
  categoriasId: number[];
}

export interface TareaPayload {
  titulo: string;
  contenido: string;
  orden: number;
  estadoId: number;
  prioridadId: number;
  categoriasId: number[];
  subtareas?: SubtareaPayload[];
}

export type CuentaPayload = {
  nombre?: string;
  clave?: string;
  imagen?: File | null;
};

export type CategoriaResponse = {
  mensaje: string;
  categoria: Categoria;
};

export interface AccountUpdateResponse {
  mensaje: string;
}

export interface UserProfileData {
  id: number;
  nombre: string;
  imagen: string | null;
  roles: string[];
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}