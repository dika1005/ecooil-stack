import prisma from "../lib/prisma";

// Inline DTO
export interface CreateHargaDTO {
  harga_beli_per_liter: number;
  harga_jual_industri: number;
  tanggal?: Date;
}

export const hargaRepository = {
  async getToday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return prisma.hargaHarian.findFirst({
      where: {
        tanggal: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
      orderBy: { id_harga: "desc" },
    });
  },

  async getLatest() {
    return prisma.hargaHarian.findFirst({
      orderBy: { tanggal: "desc" },
    });
  },

  async create(data: CreateHargaDTO) {
    const tanggal = data.tanggal || new Date();
    tanggal.setHours(0, 0, 0, 0);

    return prisma.hargaHarian.create({
      data: {
        tanggal,
        harga_beli_per_liter: data.harga_beli_per_liter,
        harga_jual_industri: data.harga_jual_industri,
      },
    });
  },

  async getHistory(page = 1, limit = 30) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.hargaHarian.findMany({
        skip,
        take: limit,
        orderBy: { tanggal: "desc" },
      }),
      prisma.hargaHarian.count(),
    ]);

    return { data, total };
  },

  async getHargaBeliPerLiter(): Promise<number> {
    const harga = (await this.getToday()) || (await this.getLatest());
    if (!harga) return 5000; // Default fallback
    return Number(harga.harga_beli_per_liter);
  },

  async getHargaJualIndustri(): Promise<number> {
    const harga = (await this.getToday()) || (await this.getLatest());
    if (!harga) return 7000; // Default fallback
    return Number(harga.harga_jual_industri);
  },
};

export default hargaRepository;
