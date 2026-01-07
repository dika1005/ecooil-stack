import hargaRepository, { type CreateHargaDTO } from "../repositories/harga.repository";

const hargaService = {
  async getCurrentPrice() {
    const today = await hargaRepository.getToday();
    if (today) return today;

    // Fallback to latest price if today's not set
    const latest = await hargaRepository.getLatest();
    if (latest) return latest;

    // Return default if no prices exist
    return {
      id_harga: 0,
      tanggal: new Date(),
      harga_beli_per_liter: 5000,
      harga_jual_industri: 7000,
    };
  },

  async setPrice(data: CreateHargaDTO) {
    return hargaRepository.create(data);
  },

  async getPriceHistory(page: number, limit: number) {
    return hargaRepository.getHistory(page, limit);
  },

  async getHargaBeliPerLiter() {
    return hargaRepository.getHargaBeliPerLiter();
  },

  async getHargaJualIndustri() {
    return hargaRepository.getHargaJualIndustri();
  },
};

export default hargaService;
