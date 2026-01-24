import pesananRepository from "../repositories/pesanan.repository";
import hargaRepository from "../repositories/harga.repository";
import userRepository from "../repositories/user.repository";

// Stats response type
export interface StatsResponse {
  total_liter_terkumpul: number;
  total_pesanan_selesai: number;
  total_user: number;
}

const publicService = {
  async getStats(): Promise<StatsResponse> {
    const [totalLiter, totalPesanan, totalUser] = await Promise.all([
      pesananRepository.getTotalVolReal(),
      pesananRepository.countByStatus("SELESAI"),
      userRepository.countByPeran("USER"),
    ]);

    return {
      total_liter_terkumpul: totalLiter,
      total_pesanan_selesai: totalPesanan,
      total_user: totalUser,
    };
  },

  async getCurrentPrice() {
    const today = await hargaRepository.getToday();
    if (today) {
      return {
        harga_beli_per_liter: Number(today.harga_beli_per_liter),
        tanggal: today.tanggal,
      };
    }

    const latest = await hargaRepository.getLatest();
    if (latest) {
      return {
        harga_beli_per_liter: Number(latest.harga_beli_per_liter),
        tanggal: latest.tanggal,
      };
    }

    // Default fallback
    return {
      harga_beli_per_liter: 5000,
      tanggal: new Date(),
    };
  },

  async getPriceHistory(page: number, limit: number) {
    return hargaRepository.getHistory(page, limit);
  },
};

export default publicService;
