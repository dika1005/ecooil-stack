import bulkRepository, { type CreateBulkDTO } from "../repositories/bulk.repository";
import hargaService from "./harga.service";

const bulkService = {
  async getAvailableStock() {
    const stockLiter = await bulkRepository.getAggregatedStock();
    const stockTon = stockLiter / 1000;
    const hargaPerLiter = await hargaService.getHargaJualIndustri();

    return {
      stok_tersedia_liter: stockLiter,
      stok_tersedia_ton: stockTon,
      harga_per_liter: hargaPerLiter,
      estimasi_harga_per_ton: hargaPerLiter * 1000,
    };
  },

  async createBulkOrder(id_industri: number, data: CreateBulkDTO) {
    // Check available stock
    const stockLiter = await bulkRepository.getAggregatedStock();
    const requestedLiter = data.total_tonase * 1000;

    if (requestedLiter > stockLiter) {
      throw new Error(`Stok tidak mencukupi. Tersedia: ${(stockLiter / 1000).toFixed(2)} ton`);
    }

    const harga_per_liter = await hargaService.getHargaJualIndustri();
    return bulkRepository.create(id_industri, data, harga_per_liter);
  },

  async getIndustriOrders(id_industri: number, page: number, limit: number) {
    return bulkRepository.findByIndustri(id_industri, page, limit);
  },

  async confirmPayment(id_bulk: number, id_industri: number) {
    const order = await bulkRepository.findById(id_bulk);
    if (!order) {
      throw new Error("Pesanan tidak ditemukan");
    }

    if (order.id_industri !== id_industri) {
      throw new Error("Anda tidak memiliki akses ke pesanan ini");
    }

    if (order.status_pembayaran === "LUNAS") {
      throw new Error("Pesanan sudah lunas");
    }

    return bulkRepository.updateStatus(id_bulk, "LUNAS");
  },
};

export default bulkService;
