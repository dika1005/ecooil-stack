import { Elysia, t } from "elysia";
import { requirePeran } from "../middlewares/auth";
import pesananService from "../services/pesanan.service";
import dompetService from "../services/dompet.service";
import penarikanService from "../services/penarikan.service";
import userService from "../services/user.service";
import { successResponse, errorResponse, paginationResponse, HttpStatus } from "../lib/response";

export const userRoutes = new Elysia({ prefix: "/api" })

  // === PESANAN (Orders) ===
  .group("/pesanan", (app) =>
    app
      .use(requirePeran("USER"))
      .post(
        "/",
        async ({ body, user, set }) => {
          try {
            const pesanan = await pesananService.createOrder(user!.id_user, body);
            set.status = HttpStatus.CREATED;
            return successResponse(pesanan, "Pesanan berhasil dibuat", "/api/pesanan");
          } catch (error) {
            set.status = HttpStatus.BAD_REQUEST;
            return errorResponse((error as Error).message);
          }
        },
        {
          body: t.Object({
            vol_estimasi: t.Number({ minimum: 0.1 }),
            foto_sampah_base64: t.String(),
            alamat_lengkap: t.Optional(t.String()),
            koordinat_lat: t.Optional(t.Number()),
            koordinat_long: t.Optional(t.Number()),
          }),
        }
      )

      .get(
        "/",
        async ({ user, query }) => {
          const page = Number(query.page) || 1;
          const limit = Number(query.limit) || 10;
          const result = await pesananService.getUserOrders(user!.id_user, page, limit);
          return paginationResponse(result.data, page, limit, result.total, "/api/pesanan");
        },
        {
          query: t.Object({
            page: t.Optional(t.String()),
            limit: t.Optional(t.String()),
          }),
        }
      )

      .get("/:id", async ({ params, user, set }) => {
        try {
          const pesanan = await pesananService.getOrderById(Number(params.id));
          if (pesanan.id_user !== user!.id_user) {
            set.status = HttpStatus.FORBIDDEN;
            return errorResponse("Akses ditolak");
          }
          return successResponse(pesanan, "Berhasil", "/api/pesanan/:id");
        } catch (error) {
          set.status = HttpStatus.NOT_FOUND;
          return errorResponse((error as Error).message);
        }
      })

      .delete("/:id", async ({ params, user, set }) => {
        try {
          await pesananService.cancelOrder(Number(params.id), user!.id_user);
          return successResponse(null, "Pesanan dibatalkan", "/api/pesanan/:id");
        } catch (error) {
          set.status = HttpStatus.BAD_REQUEST;
          return errorResponse((error as Error).message);
        }
      })
  )

  // === DOMPET (Wallet) ===
  .group("/dompet", (app) =>
    app.use(requirePeran("USER")).get("/", async ({ user }) => {
      const dompet = await dompetService.getBalance(user!.id_user);
      return successResponse(dompet, "Berhasil", "/api/dompet");
    })
  )

  // === PENARIKAN (Withdrawals) ===
  .group("/penarikan", (app) =>
    app
      .use(requirePeran("USER"))
      .post(
        "/",
        async ({ body, user, set }) => {
          try {
            const penarikan = await penarikanService.requestWithdrawal(user!.id_user, body);
            set.status = HttpStatus.CREATED;
            return successResponse(penarikan, "Permintaan penarikan berhasil", "/api/penarikan");
          } catch (error) {
            set.status = HttpStatus.BAD_REQUEST;
            return errorResponse((error as Error).message);
          }
        },
        {
          body: t.Object({
            nominal: t.Number({ minimum: 10000 }),
            bank_tujuan: t.String(),
            nomor_rekening: t.String(),
          }),
        }
      )

      .get(
        "/",
        async ({ user, query }) => {
          const page = Number(query.page) || 1;
          const limit = Number(query.limit) || 10;
          const result = await penarikanService.getUserWithdrawals(user!.id_user, page, limit);
          return paginationResponse(result.data, page, limit, result.total, "/api/penarikan");
        },
        {
          query: t.Object({
            page: t.Optional(t.String()),
            limit: t.Optional(t.String()),
          }),
        }
      )
  )

  // === PROFILE ===
  .group("/profile", (app) =>
    app
      .use(requirePeran("USER"))
      .get("/", async ({ user }) => {
        const profile = await userService.getProfile(user!.id_user);
        return successResponse(profile, "Berhasil", "/api/profile");
      })

      .put(
        "/",
        async ({ body, user, set }) => {
          try {
            const updated = await userService.updateProfile(user!.id_user, body);
            return successResponse(updated, "Profil berhasil diupdate", "/api/profile");
          } catch (error) {
            set.status = HttpStatus.BAD_REQUEST;
            return errorResponse((error as Error).message);
          }
        },
        {
          body: t.Object({
            nama_lengkap: t.Optional(t.String()),
            no_hp: t.Optional(t.String()),
            alamat_lengkap: t.Optional(t.String()),
            koordinat_lat: t.Optional(t.Number()),
            koordinat_long: t.Optional(t.Number()),
          }),
        }
      )
  );

export default userRoutes;
