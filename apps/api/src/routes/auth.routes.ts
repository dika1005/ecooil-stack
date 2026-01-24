import { Elysia, t } from "elysia";
import { accessToken } from "../lib/jwt";
import authService from "../services/auth.service";
import { successResponse, errorResponse, HttpStatus } from "../lib/response";
import { requireAuth } from "../middlewares/auth";

// Cookie configuration
const COOKIE_NAME = "ecooil_token";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

export const authRoutes = new Elysia({ prefix: "/api/auth" })
  .use(accessToken)

  // Register
  .post(
    "/register",
    async ({ body, set }) => {
      try {
        const user = await authService.register(body);
        set.status = HttpStatus.CREATED;
        return successResponse(
          { id_user: user.id_user, email: user.email, peran: user.peran },
          "Registrasi berhasil",
          "/api/auth/register"
        );
      } catch (error) {
        set.status = HttpStatus.BAD_REQUEST;
        return errorResponse((error as Error).message);
      }
    },
    {
      body: t.Object({
        email: t.String({ format: "email" }),
        password: t.String({ minLength: 6 }),
        nama_lengkap: t.String(),
        no_hp: t.String(),
        alamat_lengkap: t.Optional(t.String()),
        peran: t.Optional(t.Union([t.Literal("USER"), t.Literal("DRIVER")])),
      }),
    }
  )

  // Login - Set JWT in httpOnly cookie
  .post(
    "/login",
    async ({ body, accessToken: jwt, set, cookie }) => {
      try {
        const result = await authService.login(body.email, body.password);

        // Sign JWT
        const token = await jwt.sign({
          id_user: result.tokenPayload.id_user,
          peran: result.tokenPayload.peran,
        });

        // Set httpOnly cookie
        cookie[COOKIE_NAME].set({
          value: token,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: COOKIE_MAX_AGE,
          path: "/",
        });

        return successResponse(
          {
            user: result.user,
          },
          "Login berhasil",
          "/api/auth/login"
        );
      } catch (error) {
        set.status = HttpStatus.UNAUTHORIZED;
        return errorResponse((error as Error).message);
      }
    },
    {
      body: t.Object({
        email: t.String({ format: "email" }),
        password: t.String(),
      }),
    }
  )

  // Logout - Clear cookie
  .post("/logout", async ({ cookie }) => {
    cookie[COOKIE_NAME].set({
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    return successResponse(null, "Logout berhasil", "/api/auth/logout");
  })

  // Get current user profile
  .group("", (app) =>
    app.use(requireAuth).get("/me", async ({ user }) => {
      if (!user) {
        return errorResponse("User tidak ditemukan");
      }
      const userData = await authService.getCurrentUser(user.id_user);
      return successResponse(userData, "Berhasil", "/api/auth/me");
    })
  );

export default authRoutes;
