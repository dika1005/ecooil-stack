import { jwt } from "@elysiajs/jwt";

// Access Token - short lived, untuk API requests
export const accessToken = jwt({
  name: "accessToken",
  secret: process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET!,
  exp: process.env.JWT_ACCESS_EXPIRES || "15m",
});

// Refresh Token - long lived, untuk generate new access token
export const refreshToken = jwt({
  name: "refreshToken",
  secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET!,
  exp: process.env.JWT_REFRESH_EXPIRES || "20m",
});

export interface AccessTokenPayload {
  id_user: number;
  peran: "USER" | "ADMIN" | "DRIVER";
}
