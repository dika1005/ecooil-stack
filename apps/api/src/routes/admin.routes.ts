import { Elysia, t } from "elysia";
import { requirePeran } from "../middlewares/auth";
import userService from "../services/user.service";
import hargaService from "../services/harga.service";
import penarikanService from "../services/penarikan.service";
import { successResponse, errorResponse, paginationResponse, HttpStatus } from "../lib/response";
import type { Peran, StatusTransfer } from "../../generated/prisma/client";

export const adminRoutes = new Elysia({ prefix: "/api/admin" }).group("", (app) =>
  app
    .use(requirePeran("ADMIN"))

    // === USER MANAGEMENT ===
    .get(
      "/users",
      async ({ query }) => {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;
        const peran = query.peran as Peran | undefined;
        const result = await userService.listUsers(page, limit, peran);
        return paginationResponse(result.data, page, limit, result.total, "/api/admin/users");
      },
      {
        query: t.Object({
          page: t.Optional(t.String()),
          limit: t.Optional(t.String()),
          peran: t.Optional(t.String()),
        }),
      }
    )

    .get("/users/:id", async ({ params, set }) => {
      try {
        const user = await userService.getUserById(Number(params.id));
        if (!user) {
          set.status = HttpStatus.NOT_FOUND;
          return errorResponse("User tidak ditemukan");
        }
        return successResponse(user, "Berhasil", "/api/admin/users/:id");
      } catch (error) {
        set.status = HttpStatus.NOT_FOUND;
        return errorResponse((error as Error).message);
      }
    })

    // === HARGA MANAGEMENT ===
    .get(
      "/harga",
      async ({ query }) => {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 30;
        const result = await hargaService.getPriceHistory(page, limit);
        return paginationResponse(result.data, page, limit, result.total, "/api/admin/harga");
      },
      {
        query: t.Object({
          page: t.Optional(t.String()),
          limit: t.Optional(t.String()),
        }),
      }
    )

    .post(
      "/harga",
      async ({ body, set }) => {
        try {
          const data = {
            harga_beli_per_liter: body.harga_beli_per_liter,
            tanggal: body.tanggal ? new Date(body.tanggal) : undefined,
          };
          const harga = await hargaService.setPrice(data);
          set.status = HttpStatus.CREATED;
          return successResponse(harga, "Harga berhasil ditambahkan", "/api/admin/harga");
        } catch (error) {
          set.status = HttpStatus.BAD_REQUEST;
          return errorResponse((error as Error).message);
        }
      },
      {
        body: t.Object({
          harga_beli_per_liter: t.Number({ minimum: 1 }),
          tanggal: t.Optional(t.String()),
        }),
      }
    )

    // === PENARIKAN MANAGEMENT ===
    .get(
      "/penarikan",
      async ({ query }) => {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 20;
        const status = query.status as StatusTransfer | undefined;
        const result = await penarikanService.getAllWithdrawals(page, limit, status);
        return paginationResponse(result.data, page, limit, result.total, "/api/admin/penarikan");
      },
      {
        query: t.Object({
          page: t.Optional(t.String()),
          limit: t.Optional(t.String()),
          status: t.Optional(t.String()),
        }),
      }
    )

    .get("/penarikan/pending", async ({ query }) => {
      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 20;
      const result = await penarikanService.getPendingWithdrawals(page, limit);
      return paginationResponse(
        result.data,
        page,
        limit,
        result.total,
        "/api/admin/penarikan/pending"
      );
    })

    .put("/penarikan/:id/approve", async ({ params, set }) => {
      try {
        const penarikan = await penarikanService.approveWithdrawal(Number(params.id));
        return successResponse(
          penarikan,
          "Penarikan disetujui",
          "/api/admin/penarikan/:id/approve"
        );
      } catch (error) {
        set.status = HttpStatus.BAD_REQUEST;
        return errorResponse((error as Error).message);
      }
    })

    .put("/penarikan/:id/reject", async ({ params, set }) => {
      try {
        const penarikan = await penarikanService.rejectWithdrawal(Number(params.id));
        return successResponse(penarikan, "Penarikan ditolak", "/api/admin/penarikan/:id/reject");
      } catch (error) {
        set.status = HttpStatus.BAD_REQUEST;
        return errorResponse((error as Error).message);
      }
    })
);

export default adminRoutes;
