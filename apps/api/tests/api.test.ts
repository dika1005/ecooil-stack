/**
 * EcoOil Connect API Tests
 *
 * These tests use Bun's built-in test runner with Elysia's app.handle() method.
 * Note: Some tests may not work with state-based authentication due to how
 * Elysia handles state isolation in test environments.
 *
 * For full integration testing, use HTTP requests against a running server.
 */
import { describe, it, expect } from "bun:test";
import { createTestApp, request, TEST_USERS } from "./setup";

describe("Public API Tests", () => {
  const app = createTestApp();

  // === PUBLIC ROUTES ===
  describe("GET /api/public/stats", () => {
    it("should return live statistics", async () => {
      const res = await request(app, "GET", "/api/public/stats");
      expect(res.data?.status).toBe("success");
      expect(res.data?.data).toHaveProperty("total_liter_terkumpul");
      expect(res.data?.data).toHaveProperty("total_pesanan_selesai");
      expect(res.data?.data).toHaveProperty("total_user");
    });
  });

  describe("GET /api/public/harga", () => {
    it("should return current price", async () => {
      const res = await request(app, "GET", "/api/public/harga");
      expect(res.data?.status).toBe("success");
      expect(res.data?.data).toHaveProperty("harga_beli_per_liter");
    });
  });

  // === AUTH ROUTES ===
  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const newUser = {
        email: `test-${Date.now()}@example.com`,
        password: "password123",
        nama_lengkap: "Test User",
        no_hp: "081234567899",
      };
      const res = await request(app, "POST", "/api/auth/register", { body: newUser });
      expect(res.data?.status).toBe("success");
      expect(res.data?.data?.email).toBe(newUser.email);
    });

    it("should reject invalid email format", async () => {
      const res = await request(app, "POST", "/api/auth/register", {
        body: {
          email: "invalid",
          password: "password123",
          nama_lengkap: "Test",
          no_hp: "081234567890",
        },
      });
      expect(res.status).toBe(422);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login as USER", async () => {
      const res = await request(app, "POST", "/api/auth/login", { body: TEST_USERS.user });
      expect(res.data?.status).toBe("success");
      expect(res.data?.data?.token).toBeDefined();
      expect(res.data?.data?.user?.peran).toBe("USER");
    });

    it("should login as ADMIN", async () => {
      const res = await request(app, "POST", "/api/auth/login", { body: TEST_USERS.admin });
      expect(res.data?.status).toBe("success");
      expect(res.data?.data?.user?.peran).toBe("ADMIN");
    });

    it("should login as DRIVER", async () => {
      const res = await request(app, "POST", "/api/auth/login", { body: TEST_USERS.driver });
      expect(res.data?.status).toBe("success");
      expect(res.data?.data?.user?.peran).toBe("DRIVER");
    });


  });
});
