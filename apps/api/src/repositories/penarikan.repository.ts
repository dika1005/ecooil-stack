import prisma from "../lib/prisma";
import type { StatusTransfer } from "../../generated/prisma/client";

// Inline DTO
export interface CreatePenarikanDTO {
  nominal: number;
  bank_tujuan: string;
  nomor_rekening: string;
}

export const penarikanRepository = {
  async create(id_user: number, data: CreatePenarikanDTO) {
    return prisma.penarikanDana.create({
      data: {
        id_user,
        nominal: data.nominal,
        bank_tujuan: data.bank_tujuan,
        nomor_rekening: data.nomor_rekening,
        status_transfer: "PENDING",
      },
    });
  },

  async findById(id_penarikan: number) {
    return prisma.penarikanDana.findUnique({
      where: { id_penarikan },
      include: {
        user: {
          select: {
            id_user: true,
            nama_lengkap: true,
            email: true,
            no_hp: true,
          },
        },
      },
    });
  },

  async findByUserId(id_user: number, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.penarikanDana.findMany({
        where: { id_user },
        skip,
        take: limit,
        orderBy: { tgl_request: "desc" },
      }),
      prisma.penarikanDana.count({ where: { id_user } }),
    ]);

    return { data, total };
  },

  async findPending(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.penarikanDana.findMany({
        where: { status_transfer: "PENDING" },
        skip,
        take: limit,
        orderBy: { tgl_request: "asc" },
        include: {
          user: {
            select: {
              id_user: true,
              nama_lengkap: true,
              email: true,
              no_hp: true,
            },
          },
        },
      }),
      prisma.penarikanDana.count({ where: { status_transfer: "PENDING" } }),
    ]);

    return { data, total };
  },

  async updateStatus(id_penarikan: number, status_transfer: StatusTransfer) {
    return prisma.penarikanDana.update({
      where: { id_penarikan },
      data: { status_transfer },
    });
  },

  async findAll(page = 1, limit = 20, status?: StatusTransfer) {
    const skip = (page - 1) * limit;
    const where = status ? { status_transfer: status } : {};

    const [data, total] = await Promise.all([
      prisma.penarikanDana.findMany({
        where,
        skip,
        take: limit,
        orderBy: { tgl_request: "desc" },
        include: {
          user: {
            select: {
              id_user: true,
              nama_lengkap: true,
              email: true,
            },
          },
        },
      }),
      prisma.penarikanDana.count({ where }),
    ]);

    return { data, total };
  },
};

export default penarikanRepository;
