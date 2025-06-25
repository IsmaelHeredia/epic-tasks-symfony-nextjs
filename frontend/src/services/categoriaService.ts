import { 
  Categoria,
  CategoriaPayload,
  CategoriaListResponse,
  Prioridad,
  PrioridadListResponse,
  Estado,
  EstadoListResponse,
  CategoriaResponse
} from "@/types/api";

import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/apiClient";

export const fetchCategorias = (): Promise<CategoriaListResponse> =>
  apiGet("/api/categorias/");

export const createCategoria = (data: CategoriaPayload): Promise<CategoriaResponse> =>
  apiPost("/api/categorias/", data);

export const updateCategoria = (id: number, data: CategoriaPayload): Promise<CategoriaResponse> =>
  apiPut(`/api/categorias/${id}`, data);

export const deleteCategoria = (id: number): Promise<void> =>
  apiDelete(`/api/categorias/${id}`);