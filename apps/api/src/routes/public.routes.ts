import { Elysia, t } from "elysia";
import publicService from "../services/public.service";
import { successResponse, paginationResponse } from "../lib/response";

export const publicRoutes = new Elysia({ prefix: "/api/public" })
  // Get live stats for landing page
  .get("/stats", async () => {
    const stats = await publicService.getStats();
    return successResponse(stats, "Berhasil", "/api/public/stats");
  })

  // Get current price
  .get("/harga", async () => {
    const harga = await publicService.getCurrentPrice();
    return successResponse(harga, "Berhasil", "/api/public/harga");
  })

  // Get price history
  .get(
    "/harga/history",
    async ({ query }) => {
      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 30;
      const result = await publicService.getPriceHistory(page, limit);
      return paginationResponse(
        result.data,
        page,
        limit,
        result.total,
        "/api/public/harga/history"
      );
    },
    {
      query: t.Object({
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),
      }),
    }
  );

export default publicRoutes;
