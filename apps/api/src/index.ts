import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import "dotenv/config";

// Import routes
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import driverRoutes from "./routes/driver.routes";
import industriRoutes from "./routes/industri.routes";
import adminRoutes from "./routes/admin.routes";
import publicRoutes from "./routes/public.routes";

const app = new Elysia()
  // CORS untuk frontend
  .use(
    cors({
      origin: true, // Auto reflect origin to support credentials
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )

  // Health check
  .get("/", () => ({
    status: "ok",
    message: "EcoOil Connect API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  }))

  .get("/api/health", () => ({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  }))

  // Mount all routes
  // Mount all routes
  .use(authRoutes)
  .use(publicRoutes)
  .use(adminRoutes)
  .use(driverRoutes)
  .use(industriRoutes)
  .use(userRoutes)

  // Error handler
  .onError(({ code, error, set, request }) => {
    if (code === "NOT_FOUND") {
      console.log(`[404] Not Found: ${request.method} ${request.url}`);
      return; // Let default 404 handle it or return custom json
    }
    console.error("Unhandled error:", error);
    set.status = 500;
    const message =
      error && typeof error === "object" && "message" in error
        ? (error as Error).message
        : "Unknown error";
    return {
      success: false,
      message: "Internal Server Error",
      error: process.env.NODE_ENV === "development" ? message : undefined,
    };
  })

  .listen({
    port: parseInt(process.env.PORT || "5050"),
    hostname: "0.0.0.0",
    reusePort: true,
  });

console.log(`🦊 EcoOil Connect API running at ${app.server?.hostname}:${app.server?.port}`);

// export default app;
