import {
  TareaPayload,
  TareaListResponse,
  Tarea
} from "@/types/api";

import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/apiClient";

interface FetchTareasParams {
  titulo?: string;
  categoriaIds?: number[];
  page?: number;
  limit?: number;
}

export const fetchTareas = (params?: FetchTareasParams): Promise<TareaListResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.titulo) {
    queryParams.append("titulo", params.titulo);
  }
  if (params?.categoriaIds && params.categoriaIds.length > 0) {
    queryParams.append("categorias", params.categoriaIds.join(','));
  }
  if (params?.page) {
    queryParams.append("page", String(params.page));
  }
  if (params?.limit) {
    queryParams.append("limit", String(params.limit));
  }

  const queryString = queryParams.toString();
  const url = queryString ? `/api/tareas?${queryString}` : "/api/tareas";
  
  return apiGet(url);
};

export const createTarea = (data: TareaPayload): Promise<Tarea> =>
  apiPost("/api/tareas", data);

export const updateTarea = (id: number, data: TareaPayload): Promise<Tarea> =>
  apiPut(`/api/tareas/${id}`, data);

export const updateTareaOrder = (id: number, data: TareaPayload): Promise<Tarea> =>
  apiPut(`/api/tareas/${id}/cambiarOrden`, data);

export const deleteTarea = (id: number): Promise<void> =>
  apiDelete(`/api/tareas/${id}`);
