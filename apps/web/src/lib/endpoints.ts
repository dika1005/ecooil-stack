/**
 * Centralized API Endpoints Configuration
 * Menghilangkan hardcode URL di seluruh aplikasi
 */

export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    LOGOUT: "/api/auth/logout",
    ME: "/api/auth/me",
  },

  // User
  USER: {
    DOMPET: "/api/dompet",
    PESANAN: "/api/pesanan",
    SETOR: "/api/pesanan",
    PENARIKAN: "/api/penarikan",
  },

  // Driver
  DRIVER: {
    JOBS: "/api/driver/jobs",
    TUGAS: "/api/driver/tugas",
    ORDERS: "/api/driver/orders",
    CLAIM: (id: number) => `/api/driver/claim/${id}`,
    COMPLETE: (id: number) => `/api/driver/complete/${id}`,
  },

  // Industri
  INDUSTRI: {
    STOK: "/api/industri/stok",
    BULK: "/api/industri/bulk",
  },

  // Admin
  ADMIN: {
    USERS: "/api/admin/users",
    USER_BY_ID: (id: number) => `/api/admin/users/${id}`,
    PENARIKAN: "/api/admin/penarikan",
    HARGA: "/api/admin/harga",
    STATS: "/api/admin/stats",
  },
} as const;
