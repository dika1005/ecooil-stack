export type Peran = "USER" | "ADMIN" | "DRIVER" | "SUPER_ADMIN";

export interface User {
  id_user: number;
  email: string;
  nama_lengkap: string;
  no_hp: string;
  peran: Peran;
  tgl_daftar: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface Dompet {
  saldo: number;
}
