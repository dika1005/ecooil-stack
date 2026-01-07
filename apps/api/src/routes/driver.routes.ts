import { Elysia, t } from "elysia";
import { requirePeran } from "../middlewares/auth";
import pesananService from "../services/pesanan.service";
import { successResponse, errorResponse, paginationResponse, HttpStatus } from "../lib/response";

export const driverRoutes = new Elysia({ prefix: "/api/driver" }).group("", (app) =>
  app
    .use(requirePeran("DRIVER"))

    // Get pending jobs (Job Radar)
    .get(
      "/jobs",
      async ({ query }) => {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 20;
        const result = await pesananService.getPendingJobs(page, limit);
        return paginationResponse(result.data, page, limit, result.total, "/api/driver/jobs");
      },
      {
        query: t.Object({
          page: t.Optional(t.String()),
          limit: t.Optional(t.String()),
        }),
      }
    )

    // Claim a job
    .put("/claim/:id", async ({ params, user, set }) => {
      try {
        const pesanan = await pesananService.claimOrder(Number(params.id), user!.id_user);
        return successResponse(pesanan, "Pesanan berhasil diklaim", "/api/driver/claim/:id");
      } catch (error) {
        set.status = HttpStatus.BAD_REQUEST;
        return errorResponse((error as Error).message);
      }
    })

    // Get driver's active tasks (Tugas Saya)
    .get(
      "/tugas",
      async ({ user, query }) => {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;
        const result = await pesananService.getActiveTasks(user!.id_user, page, limit);
        return paginationResponse(result.data, page, limit, result.total, "/api/driver/tugas");
      },
      {
        query: t.Object({
          page: t.Optional(t.String()),
          limit: t.Optional(t.String()),
        }),
      }
    )

    // Complete order with real weight
    .put(
      "/complete/:id",
      async ({ params, body, user, set }) => {
        try {
          const pesanan = await pesananService.completeOrder(
            Number(params.id),
            user!.id_user,
            body
          );
          return successResponse(pesanan, "Pesanan selesai", "/api/driver/complete/:id");
        } catch (error) {
          set.status = HttpStatus.BAD_REQUEST;
          return errorResponse((error as Error).message);
        }
      },
      {
        body: t.Object({
          vol_real: t.Number({ minimum: 0.1 }),
          bukti_timbang_base64: t.String(),
        }),
      }
    )

    // Get driver's completed orders
    .get(
      "/orders",
      async ({ user, query }) => {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;
        const result = await pesananService.getDriverOrders(user!.id_user, page, limit);
        return paginationResponse(result.data, page, limit, result.total, "/api/driver/orders");
      },
      {
        query: t.Object({
          page: t.Optional(t.String()),
          limit: t.Optional(t.String()),
        }),
      }
    )
);

export default driverRoutes;
