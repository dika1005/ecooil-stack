import { isServer } from "solid-js/web";
import type { ApiResponse } from "~/types";

// Get API base URL - works for both server and client contexts
const getApiBaseUrl = (): string => {
  if (isServer) {
    // Server side rendering needs full URL
    return process.env.VITE_API_URL || "http://localhost:5050";
  }
  
  // Client side: detect if we're on localhost or tunnel domain
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    
    // If localhost, use full API URL
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:5050";
    }
    
    // If tunnel domain, use relative paths (Cloudflare routes /api/* to API server)
    return "";
  }
  
  return "";
};

class ApiError extends Error {
  constructor(
    public message: string,
    public status: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Base fetcher that returns full response
async function baseFetcher<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  const baseUrl = getApiBaseUrl();

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers,
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 && !isServer) {
        window.location.href = "/login";
      }
      throw new ApiError(data.message || "Something went wrong", response.status);
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error("[API Error]", endpoint, error);
    throw new ApiError("Network error - unable to reach API", 0);
  }
}

// Fetcher that extracts .data from response (for simple responses)
async function fetcher<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await baseFetcher<ApiResponse<T>>(endpoint, options);
  return response.data;
}

export const api = {
  // Returns only .data from response
  get: <T>(url: string) => fetcher<T>(url, { method: "GET" }),
  post: <T>(url: string, body: any) =>
    fetcher<T>(url, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(url: string, body: any) =>
    fetcher<T>(url, { method: "PUT", body: JSON.stringify(body) }),
  delete: <T>(url: string) => fetcher<T>(url, { method: "DELETE" }),

  // Returns full response with data, meta, etc. (for paginated endpoints)
  getFullResponse: <T>(url: string) => baseFetcher<T>(url, { method: "GET" }),
};
