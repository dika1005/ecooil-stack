import prisma from "../lib/prisma";

// Inline DTOs
export interface CreatePesananDTO {
  vol_estimasi: number;
  foto_sampah_base64: string;
  alamat_lengkap?: string;
  koordinat_lat?: number;
  koordinat_long?: number;
}

export interface CompletePesananDTO {
  vol_real: number;
  bukti_timbang_base64: string;
}

export const pesananRepository = {
  async create(id_user: number, data: CreatePesananDTO) {
    return prisma.pesanan.create({
      data: {
        id_user,
        vol_estimasi: data.vol_estimasi,
        foto_sampah_base64: data.foto_sampah_base64,
        status_order: "MENUNGGU",
      },
      include: {
        user_penjual: {
          select: {
            id_user: true,
            nama_lengkap: true,
            alamat_lengkap: true,
            no_hp: true,
            koordinat_lat: true,
            koordinat_long: true,
          },
        },
      },
    });
  },

  async findById(id_pesanan: number) {
    return prisma.pesanan.findUnique({
      where: { id_pesanan },
      include: {
        user_penjual: {
          select: {
            id_user: true,
            nama_lengkap: true,
            alamat_lengkap: true,
            no_hp: true,
            koordinat_lat: true,
            koordinat_long: true,
          },
        },
        driver_penjemput: {
          select: {
            id_user: true,
            nama_lengkap: true,
            no_hp: true,
          },
        },
      },
    });
  },

  async findByUserId(id_user: number, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.pesanan.findMany({
        where: { id_user },
        skip,
        take: limit,
        orderBy: { tanggal_pesan: "desc" },
        select: {
          id_pesanan: true,
          status_order: true,
          vol_estimasi: true,
          vol_real: true,
          total_bayar: true,
          tanggal_pesan: true,
          driver_penjemput: {
            select: {
              nama_lengkap: true,
              no_hp: true,
            },
          },
        },
      }),
      prisma.pesanan.count({ where: { id_user } }),
    ]);

    return { data, total };
  },

  async findByDriverId(id_driver: number, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.pesanan.findMany({
        where: { id_driver },
        skip,
        take: limit,
        orderBy: { tanggal_pesan: "desc" },
        include: {
          user_penjual: {
            select: {
              id_user: true,
              nama_lengkap: true,
              alamat_lengkap: true,
              no_hp: true,
              koordinat_lat: true,
              koordinat_long: true,
            },
          },
        },
      }),
      prisma.pesanan.count({ where: { id_driver } }),
    ]);

    return { data, total };
  },

  async findActiveByDriverId(id_driver: number, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.pesanan.findMany({
        where: { id_driver, status_order: "DIJEMPUT" },
        skip,
        take: limit,
        orderBy: { tanggal_pesan: "desc" },
        include: {
          user_penjual: {
            select: {
              id_user: true,
              nama_lengkap: true,
              alamat_lengkap: true,
              no_hp: true,
              koordinat_lat: true,
              koordinat_long: true,
            },
          },
        },
      }),
      prisma.pesanan.count({ where: { id_driver, status_order: "DIJEMPUT" } }),
    ]);

    return { data, total };
  },

  async findPending(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.pesanan.findMany({
        where: { status_order: "MENUNGGU", id_driver: null },
        skip,
        take: limit,
        orderBy: { tanggal_pesan: "asc" },
        include: {
          user_penjual: {
            select: {
              id_user: true,
              nama_lengkap: true,
              alamat_lengkap: true,
              no_hp: true,
              koordinat_lat: true,
              koordinat_long: true,
            },
          },
        },
      }),
      prisma.pesanan.count({ where: { status_order: "MENUNGGU", id_driver: null } }),
    ]);

    return { data, total };
  },

  async assignDriver(id_pesanan: number, id_driver: number) {
    return prisma.pesanan.update({
      where: { id_pesanan },
      data: {
        id_driver,
        status_order: "DIJEMPUT",
      },
    });
  },

  async complete(id_pesanan: number, data: CompletePesananDTO, harga_per_liter: number) {
    const total_bayar = data.vol_real * harga_per_liter;

    return prisma.pesanan.update({
      where: { id_pesanan },
      data: {
        vol_real: data.vol_real,
        bukti_timbang_base64: data.bukti_timbang_base64,
        harga_per_liter_saat_itu: harga_per_liter,
        total_bayar: total_bayar,
        status_order: "SELESAI",
      },
    });
  },

  async cancel(id_pesanan: number) {
    return prisma.pesanan.update({
      where: { id_pesanan },
      data: { status_order: "BATAL" },
    });
  },

  async getTotalVolReal() {
    const result = await prisma.pesanan.aggregate({
      where: { status_order: "SELESAI" },
      _sum: { vol_real: true },
    });
    return Number(result._sum.vol_real) || 0;
  },

  async countByStatus(status_order: "MENUNGGU" | "DIJEMPUT" | "SELESAI" | "BATAL") {
    return prisma.pesanan.count({ where: { status_order } });
  },

  async countAll() {
    return prisma.pesanan.count();
  },
};

export default pesananRepository;
