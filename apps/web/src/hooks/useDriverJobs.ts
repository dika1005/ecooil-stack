import { ENDPOINTS } from "~/lib/endpoints";
import { useApi, useMutation, type UseApiResult, type UseMutationResult } from "./useApi";
import type { Pesanan } from "./usePesanan";

export interface JobsResponse {
  success: boolean;
  data: Pesanan[];
  meta: { total: number };
}

/**
 * Hook untuk mengambil daftar job untuk driver
 */
export function useDriverJobs(): UseApiResult<JobsResponse> {
  return useApi<JobsResponse>(ENDPOINTS.DRIVER.JOBS, {
    extractData: false,
  });
}

/**
 * Hook untuk claim job sebagai driver
 */
export function useClaimJob(): UseMutationResult<unknown, number> {
  return useMutation<unknown, number>(
    (id: number | string) => ENDPOINTS.DRIVER.CLAIM(Number(id)),
    "PUT"
  );
}
