import pesananRepository, {
  type CreatePesananDTO,
  type CompletePesananDTO,
} from "../repositories/pesanan.repository";
import dompetRepository from "../repositories/dompet.repository";
import hargaService from "./harga.service";

const pesananService = {
  async createOrder(id_user: number, data: CreatePesananDTO) {
    return pesananRepository.create(id_user, data);
  },

  async getUserOrders(id_user: number, page: number, limit: number) {
    return pesananRepository.findByUserId(id_user, page, limit);
  },

  async getDriverOrders(id_driver: number, page: number, limit: number) {
    return pesananRepository.findByDriverId(id_driver, page, limit);
  },

  async getActiveTasks(id_driver: number, page: number, limit: number) {
    return pesananRepository.findActiveByDriverId(id_driver, page, limit);
  },

  async getOrderById(id_pesanan: number) {
    const pesanan = await pesananRepository.findById(id_pesanan);
    if (!pesanan) {
      throw new Error("Pesanan tidak ditemukan");
    }
    return pesanan;
  },

  async getPendingJobs(page: number, limit: number) {
    return pesananRepository.findPending(page, limit);
  },

  async claimOrder(id_pesanan: number, id_driver: number) {
    const pesanan = await pesananRepository.findById(id_pesanan);
    if (!pesanan) {
      throw new Error("Pesanan tidak ditemukan");
    }

    if (pesanan.status_order !== "MENUNGGU") {
      throw new Error("Pesanan tidak bisa diklaim");
    }

    if (pesanan.id_driver) {
      throw new Error("Pesanan sudah diklaim driver lain");
    }

    return pesananRepository.assignDriver(id_pesanan, id_driver);
  },

  async completeOrder(id_pesanan: number, id_driver: number, data: CompletePesananDTO) {
    const pesanan = await pesananRepository.findById(id_pesanan);
    if (!pesanan) {
      throw new Error("Pesanan tidak ditemukan");
    }

    if (pesanan.id_driver !== id_driver) {
      throw new Error("Anda bukan driver untuk pesanan ini");
    }

    if (pesanan.status_order !== "DIJEMPUT") {
      throw new Error("Pesanan belum dalam status dijemput");
    }

    // Get current price
    const harga_per_liter = await hargaService.getHargaBeliPerLiter();

    // Complete the order
    const completed = await pesananRepository.complete(id_pesanan, data, harga_per_liter);

    // Add money to user's wallet
    const total_bayar = data.vol_real * harga_per_liter;
    await dompetRepository.addSaldo(pesanan.id_user, total_bayar);

    return completed;
  },

  async cancelOrder(id_pesanan: number, id_user: number) {
    const pesanan = await pesananRepository.findById(id_pesanan);
    if (!pesanan) {
      throw new Error("Pesanan tidak ditemukan");
    }

    if (pesanan.id_user !== id_user) {
      throw new Error("Anda tidak memiliki akses ke pesanan ini");
    }

    if (pesanan.status_order !== "MENUNGGU") {
      throw new Error("Pesanan tidak bisa dibatalkan");
    }

    return pesananRepository.cancel(id_pesanan);
  },
};

export default pesananService;
