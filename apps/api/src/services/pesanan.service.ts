import pesananRepository, {
  type CreatePesananDTO,
  type CompletePesananDTO,
} from "../repositories/pesanan.repository";
import dompetRepository from "../repositories/dompet.repository";
import hargaService from "./harga.service";
import prisma from "../lib/prisma";

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
    const total_bayar = data.vol_real * harga_per_liter;

    // Use transaction to ensure atomicity - both order update and wallet update succeed together
    return prisma.$transaction(async (tx) => {
      // 1. Complete the order
      const completed = await tx.pesanan.update({
        where: { id_pesanan },
        data: {
          vol_real: data.vol_real,
          bukti_timbang_base64: data.bukti_timbang_base64,
          harga_per_liter_saat_itu: harga_per_liter,
          total_bayar: total_bayar,
          status_order: "SELESAI",
        },
      });

      // 2. Find or create user's wallet
      let dompet = await tx.dompet.findUnique({ where: { id_user: pesanan.id_user } });
      if (!dompet) {
        dompet = await tx.dompet.create({
          data: { id_user: pesanan.id_user, saldo_terkini: 0 },
        });
      }

      // 3. Add money to user's wallet (within same transaction)
      await tx.dompet.update({
        where: { id_user: pesanan.id_user },
        data: { saldo_terkini: Number(dompet.saldo_terkini) + total_bayar },
      });

      return completed;
    });
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
