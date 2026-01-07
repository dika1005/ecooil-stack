import { ENDPOINTS } from "~/lib/endpoints";
import { useApi, type UseApiResult } from "./useApi";

export interface StockData {
  total_stok: number;
  pending_orders?: number;
}

/**
 * Hook untuk mengambil data stok industri
 */
export function useIndustriStok(): UseApiResult<StockData> {
  return useApi<StockData>(ENDPOINTS.INDUSTRI.STOK, {
    defaultValue: { total_stok: 0 },
  });
}
