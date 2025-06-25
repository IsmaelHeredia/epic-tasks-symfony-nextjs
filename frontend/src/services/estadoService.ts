import { apiGet } from "@/lib/apiClient";

import { 
  Estado,
  EstadoListResponse
} from "@/types/api";

export const fetchEstados = (): Promise<EstadoListResponse> =>
  apiGet("/api/estados/");