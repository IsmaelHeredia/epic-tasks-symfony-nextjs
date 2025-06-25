import { apiGet } from "@/lib/apiClient";

import { 
  Prioridad,
  PrioridadListResponse
} from "@/types/api";

export const fetchPrioridades = (): Promise<PrioridadListResponse> =>
  apiGet("/api/prioridades/");