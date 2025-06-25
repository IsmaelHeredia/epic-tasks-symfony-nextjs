import { SubtareaPayload } from "@/types/api";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/apiClient";

export const fetchSubtareas = () => apiGet("/api/subtareas");
export const createSubtarea = (data: SubtareaPayload) => apiPost("/api/subtareas", data);
export const updateSubtarea = (id: number, data: SubtareaPayload) => apiPut(`/api/subtareas/${id}`, data);
export const deleteSubtarea = (id: number) => apiDelete(`/api/subtareas/${id}`);