import { ENDPOINTS } from "~/lib/endpoints";
import { useApi, useMutation, type UseApiResult, type UseMutationResult } from "./useApi";

export interface Pesanan {
  id_pesanan: number;
  vol_estimasi: number;
  vol_real: number | null;
  status_order: string;
  tanggal_pesan: string;
  tgl_dibuat?: string;
  total_bayar: number | null;
  user_penjual?: {
    id_user: number;
    nama_lengkap: string;
    alamat_lengkap: string | null;
    no_hp: string;
    koordinat_lat: number | null;
    koordinat_long: number | null;
  };
  driver_penjemput?: {
    nama_lengkap: string;
    no_hp: string;
  };
}

export interface PesananResponse {
  success: boolean;
  data: Pesanan[];
  meta: { total: number };
}

export interface CreatePesananBody {
  vol_estimasi: number;
  alamat_lengkap: string;
  foto_sampah_base64: string;
}

/**
 * Hook untuk mengambil daftar pesanan user
 */
export function usePesanan(): UseApiResult<PesananResponse> {
  return useApi<PesananResponse>(ENDPOINTS.USER.PESANAN, {
    extractData: false, // Return full response with meta
  });
}

/**
 * Hook untuk membuat pesanan baru (setor jelantah)
 */
export function useCreatePesanan(): UseMutationResult<Pesanan, CreatePesananBody> {
  return useMutation<Pesanan, CreatePesananBody>(ENDPOINTS.USER.SETOR, "POST");
}
