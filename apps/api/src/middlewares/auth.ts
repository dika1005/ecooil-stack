import { Elysia } from "elysia";
import { accessToken, type AccessTokenPayload } from "../lib/jwt";
import prisma from "../lib/prisma";
import { errorResponse, HttpStatus } from "../lib/response";
import type { Peran } from "../../generated/prisma/client";

// Cookie name - must match auth.routes.ts
const COOKIE_NAME = "ecooil_token";

// Type untuk user yang sudah diautentikasi
export interface AuthUser {
  id_user: number;
  email: string;
  nama_lengkap: string;
  no_hp: string;
  peran: Peran;
  alamat_lengkap: string | null;
  koordinat_lat: unknown;
  koordinat_long: unknown;
}

// Get token from cookie or Authorization header (backwards compatible)
function getTokenFromRequest(request: Request, cookieHeader: string | null): string | null {
  // First try cookie
  if (cookieHeader) {
    const cookies = cookieHeader.split(";").map((c) => c.trim());
    for (const cookie of cookies) {
      const [name, value] = cookie.split("=");
      if (name === COOKIE_NAME && value) {
        return value;
      }
    }
  }

  // Fallback to Authorization header
  const authHeader = request.headers.get("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }

  return null;
}

// Parse auth and get user from database
async function getAuthUser(
  request: Request,
  cookie: string | null,
  jwtVerify: (token: string) => Promise<any>
): Promise<AuthUser | null> {
  const token = getTokenFromRequest(request, cookie);
  if (!token) {
    return null;
  }

  try {
    const payload = (await jwtVerify(token)) as AccessTokenPayload | false;
    if (!payload) return null;

    const user = await prisma.user.findUnique({
      where: { id_user: payload.id_user },
      select: {
        id_user: true,
        email: true,
        nama_lengkap: true,
        no_hp: true,
        peran: true,
        alamat_lengkap: true,
        koordinat_lat: true,
        koordinat_long: true,
      },
    });

    return user as AuthUser | null;
  } catch {
    return null;
  }
}

// Global Auth Middleware - Provides 'user' context
export const authMiddleware = new Elysia({ name: "authMiddleware" })
  .use(accessToken)
  .derive({ as: "global" }, async ({ accessToken: jwt, request }) => {
    const cookieHeader = request.headers.get("Cookie");
    const user = await getAuthUser(request, cookieHeader, (token) => jwt.verify(token));
    return { user, isAuthenticated: !!user };
  });

// Auth Guard
export const requireAuth = new Elysia({ name: "requireAuth" })
  .use(authMiddleware)
  .onBeforeHandle({ as: "global" }, ({ user, isAuthenticated, set }) => {
    if (!isAuthenticated || !user) {
      set.status = HttpStatus.UNAUTHORIZED;
      return errorResponse("Silakan login terlebih dahulu");
    }
  });

// Role Guard
export const requirePeran = (...allowedPeran: Peran[]) =>
  new Elysia({ name: `requirePeran:${allowedPeran.join(",")}` })
    .use(requireAuth)
    .onBeforeHandle({ as: "global" }, ({ user, set }) => {
      if (!user || !allowedPeran.includes(user.peran)) {
        set.status = HttpStatus.FORBIDDEN;
        return errorResponse("Akses ditolak - Peran tidak sesuai");
      }
    });
