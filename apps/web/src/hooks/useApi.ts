import { createSignal, onMount, type Accessor } from "solid-js";
import { api } from "~/lib/api";

/**
 * Generic API Fetch Hook
 * Returns: { data, loading, error, refetch }
 */
export interface UseApiResult<T> {
  data: Accessor<T | null>;
  loading: Accessor<boolean>;
  error: Accessor<string>;
  refetch: () => Promise<void>;
}

export function useApi<T>(
  endpoint: string,
  options?: {
    immediate?: boolean; // default: true
    extractData?: boolean; // default: true (extract .data from response)
    defaultValue?: T;
  }
): UseApiResult<T> {
  const [data, setData] = createSignal<T | null>(options?.defaultValue ?? null);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const result =
        options?.extractData !== false
          ? await api.get<T>(endpoint)
          : await api.getFullResponse<T>(endpoint);
      setData(() => result);
    } catch (e) {
      console.error(`[useApi] Error fetching ${endpoint}:`, e);
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (options?.immediate !== false) {
    onMount(() => {
      fetchData();
    });
  }

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

/**
 * API Mutation Hook for POST/PUT/DELETE
 */
export interface UseMutationResult<T, TBody = unknown> {
  data: Accessor<T | null>;
  loading: Accessor<boolean>;
  error: Accessor<string>;
  mutate: (body?: TBody) => Promise<T | null>;
}

export function useMutation<T, TBody = unknown>(
  endpoint: string | ((id: number | string) => string),
  method: "POST" | "PUT" | "DELETE" = "POST"
): UseMutationResult<T, TBody> {
  const [data, setData] = createSignal<T | null>(null);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal("");

  const mutate = async (bodyOrId?: TBody | number | string): Promise<T | null> => {
    try {
      setLoading(true);
      setError("");

      const url = typeof endpoint === "function" ? endpoint(bodyOrId as number | string) : endpoint;

      const body = typeof endpoint === "function" ? {} : bodyOrId;

      let result: T;
      switch (method) {
        case "POST":
          result = await api.post<T>(url, body);
          break;
        case "PUT":
          result = await api.put<T>(url, body);
          break;
        case "DELETE":
          result = await api.delete<T>(url);
          break;
      }

      setData(() => result);
      return result;
    } catch (e) {
      console.error("[useMutation] Error:", e);
      setError((e as Error).message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    mutate,
  };
}
