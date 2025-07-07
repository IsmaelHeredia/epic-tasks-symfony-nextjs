import { 
  EstadisticasResponse,
} from "@/types/api";

import { apiGet } from "@/lib/apiClient";

export const fetchEstadisticas = (): Promise<EstadisticasResponse> =>
  apiGet("/api/estadisticas/");