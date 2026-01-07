import { Elysia, t } from "elysia";
import { requirePeran } from "../middlewares/auth";
import bulkService from "../services/bulk.service";
import { successResponse, errorResponse, paginationResponse, HttpStatus } from "../lib/response";

export const industriRoutes = new Elysia({ prefix: "/api/industri" }).group("", (app) =>
  app
    .use(requirePeran("INDUSTRI"))

    // Get available stock
    .get("/stok", async () => {
      const stock = await bulkService.getAvailableStock();
      return successResponse(stock, "Berhasil", "/api/industri/stok");
    })

    // Create bulk order
    .post(
      "/bulk",
      async ({ body, user, set }) => {
        try {
          const order = await bulkService.createBulkOrder(user!.id_user, body);
          set.status = HttpStatus.CREATED;
          return successResponse(order, "Pesanan bulk berhasil dibuat", "/api/industri/bulk");
        } catch (error) {
          set.status = HttpStatus.BAD_REQUEST;
          return errorResponse((error as Error).message);
        }
      },
      {
        body: t.Object({
          total_tonase: t.Number({ minimum: 0.1 }),
        }),
      }
    )

    // Get bulk order history
    .get(
      "/bulk",
      async ({ user, query }) => {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;
        const result = await bulkService.getIndustriOrders(user!.id_user, page, limit);
        return paginationResponse(result.data, page, limit, result.total, "/api/industri/bulk");
      },
      {
        query: t.Object({
          page: t.Optional(t.String()),
          limit: t.Optional(t.String()),
        }),
      }
    )

    // Confirm payment
    .put("/bulk/:id/bayar", async ({ params, user, set }) => {
      try {
        const order = await bulkService.confirmPayment(Number(params.id), user!.id_user);
        return successResponse(order, "Pembayaran dikonfirmasi", "/api/industri/bulk/:id/bayar");
      } catch (error) {
        set.status = HttpStatus.BAD_REQUEST;
        return errorResponse((error as Error).message);
      }
    })
);

export default industriRoutes;
