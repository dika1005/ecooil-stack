/**
 * Test Setup Helper - Creates test app instance with all routes
 */
import { Elysia } from "elysia";
import { authRoutes } from "../src/routes/auth.routes";
import { userRoutes } from "../src/routes/user.routes";
import { driverRoutes } from "../src/routes/driver.routes";
import { adminRoutes } from "../src/routes/admin.routes";
import { publicRoutes } from "../src/routes/public.routes";

// Create test app with all routes
export function createTestApp() {
  return new Elysia()
    .use(authRoutes)
    .use(publicRoutes)
    .use(userRoutes)
    .use(driverRoutes)
    .use(adminRoutes);
}

// Test credentials
export const TEST_USERS = {
  admin: { email: "admin@ecooil.id", password: "admin123" },
  user: { email: "user@ecooil.id", password: "user123" },
  driver: { email: "driver@ecooil.id", password: "driver123" },
};

// Helper to make requests
export async function request(
  app: any,
  method: string,
  path: string,
  options?: {
    body?: unknown;
    headers?: Record<string, string>;
    token?: string;
  }
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options?.headers,
  };

  if (options?.token) {
    headers["Authorization"] = `Bearer ${options.token}`;
  }

  const response = await app.handle(
    new Request(`http://localhost${path}`, {
      method,
      headers,
      body: options?.body ? JSON.stringify(options.body) : undefined,
    })
  );

  const status = response.status;

  // Try to parse JSON, return null if fails (e.g., 422 validation errors)
  let data: any = null;
  try {
    const text = await response.text();
    if (text) {
      data = JSON.parse(text);
    }
  } catch {
    data = null;
  }

  return { status, data };
}

// Helper to login and get token
export async function login(app: any, email: string, password: string) {
  const res = await request(app, "POST", "/api/auth/login", {
    body: { email, password },
  });
  return res.data?.data?.token;
}
