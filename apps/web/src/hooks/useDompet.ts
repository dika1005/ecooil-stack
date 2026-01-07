import { ENDPOINTS } from "~/lib/endpoints";
import { useApi, type UseApiResult } from "./useApi";

export interface Dompet {
  saldo_terkini: number;
}

/**
 * Hook untuk mengambil data dompet user
 */
export function useDompet(): UseApiResult<Dompet> {
  return useApi<Dompet>(ENDPOINTS.USER.DOMPET, {
    defaultValue: { saldo_terkini: 0 },
  });
}
