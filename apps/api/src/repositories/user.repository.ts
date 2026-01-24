import prisma from "../lib/prisma";
import type { Peran } from "../../generated/prisma/client";

// Inline DTOs - no separate types file needed
export interface RegisterDTO {
  email: string;
  password: string;
  nama_lengkap: string;
  no_hp: string;
  alamat_lengkap?: string;
  peran?: Peran;
}

export interface UpdateUserDTO {
  nama_lengkap?: string;
  no_hp?: string;
  alamat_lengkap?: string;
  koordinat_lat?: number;
  koordinat_long?: number;
}

export const userRepository = {
  async findById(id_user: number) {
    return prisma.user.findUnique({
      where: { id_user },
      select: {
        id_user: true,
        email: true,
        nama_lengkap: true,
        no_hp: true,
        peran: true,
        alamat_lengkap: true,
        koordinat_lat: true,
        koordinat_long: true,
        created_at: true,
      },
    });
  },

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  async create(data: RegisterDTO) {
    return prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        nama_lengkap: data.nama_lengkap,
        no_hp: data.no_hp,
        alamat_lengkap: data.alamat_lengkap,
        peran: data.peran || "USER",
      },
    });
  },

  async update(id_user: number, data: UpdateUserDTO) {
    return prisma.user.update({
      where: { id_user },
      data,
      select: {
        id_user: true,
        email: true,
        nama_lengkap: true,
        no_hp: true,
        peran: true,
        alamat_lengkap: true,
        koordinat_lat: true,
        koordinat_long: true,
      },
    });
  },

  async findAll(page = 1, limit = 10, peran?: Peran) {
    const skip = (page - 1) * limit;
    const where = peran ? { peran } : {};

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
        select: {
          id_user: true,
          email: true,
          nama_lengkap: true,
          no_hp: true,
          peran: true,
          alamat_lengkap: true,
          created_at: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return { data, total };
  },

  async countByPeran(peran: Peran) {
    return prisma.user.count({ where: { peran } });
  },

  async countAll() {
    return prisma.user.count();
  },
};

export default userRepository;
