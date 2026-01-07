import prisma from "../lib/prisma";
import type { StatusBayar } from "../../generated/prisma/client";

// Inline DTO
export interface CreateBulkDTO {
  total_tonase: number;
}

export const bulkRepository = {
  async create(id_industri: number, data: CreateBulkDTO, harga_per_liter: number) {
    // total_tonase dalam ton, harga dalam liter
    // 1 ton = 1000 liter
    const total_tagihan = data.total_tonase * 1000 * harga_per_liter;

    return prisma.pesananBulk.create({
      data: {
        id_industri,
        total_tonase: data.total_tonase,
        total_tagihan: total_tagihan,
        status_pembayaran: "BELUM_BAYAR",
      },
    });
  },

  async findById(id_bulk: number) {
    return prisma.pesananBulk.findUnique({
      where: { id_bulk },
      include: {
        industri: {
          select: {
            id_user: true,
            nama_lengkap: true,
            email: true,
          },
        },
      },
    });
  },

  async findByIndustri(id_industri: number, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.pesananBulk.findMany({
        where: { id_industri },
        skip,
        take: limit,
        orderBy: { tgl_order: "desc" },
      }),
      prisma.pesananBulk.count({ where: { id_industri } }),
    ]);

    return { data, total };
  },

  async updateStatus(id_bulk: number, status_pembayaran: StatusBayar) {
    return prisma.pesananBulk.update({
      where: { id_bulk },
      data: { status_pembayaran },
    });
  },

  async getAggregatedStock(): Promise<number> {
    // Total vol_real dari semua pesanan selesai (dalam liter)
    const result = await prisma.pesanan.aggregate({
      where: { status_order: "SELESAI" },
      _sum: { vol_real: true },
    });

    // Kurangi dengan total_tonase yang sudah dibeli industri (convert to liter)
    const sold = await prisma.pesananBulk.aggregate({
      where: { status_pembayaran: "LUNAS" },
      _sum: { total_tonase: true },
    });

    const totalCollected = Number(result._sum.vol_real) || 0;
    const totalSoldTon = Number(sold._sum.total_tonase) || 0;
    const totalSoldLiter = totalSoldTon * 1000;

    return Math.max(0, totalCollected - totalSoldLiter);
  },

  async findAll(page = 1, limit = 20, status?: StatusBayar) {
    const skip = (page - 1) * limit;
    const where = status ? { status_pembayaran: status } : {};

    const [data, total] = await Promise.all([
      prisma.pesananBulk.findMany({
        where,
        skip,
        take: limit,
        orderBy: { tgl_order: "desc" },
        include: {
          industri: {
            select: {
              id_user: true,
              nama_lengkap: true,
              email: true,
            },
          },
        },
      }),
      prisma.pesananBulk.count({ where }),
    ]);

    return { data, total };
  },
};

export default bulkRepository;
