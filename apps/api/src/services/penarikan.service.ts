import penarikanRepository, { type CreatePenarikanDTO } from "../repositories/penarikan.repository";
import dompetRepository from "../repositories/dompet.repository";
import type { StatusTransfer } from "../../generated/prisma/client";
import prisma from "../lib/prisma";

const penarikanService = {
  async requestWithdrawal(id_user: number, data: CreatePenarikanDTO) {
    // Check balance and deduct immediately using transaction
    return prisma.$transaction(async (tx) => {
      const dompet = await tx.dompet.findUnique({ where: { id_user } });
      if (!dompet) {
        throw new Error("Dompet tidak ditemukan");
      }

      const currentSaldo = Number(dompet.saldo_terkini);
      if (currentSaldo < data.nominal) {
        throw new Error("Saldo tidak mencukupi");
      }

      // Deduct saldo immediately
      await tx.dompet.update({
        where: { id_user },
        data: { saldo_terkini: currentSaldo - data.nominal },
      });

      // Create withdrawal request
      return tx.penarikanDana.create({
        data: {
          id_user,
          nominal: data.nominal,
          bank_tujuan: data.bank_tujuan,
          nomor_rekening: data.nomor_rekening,
          status_transfer: "PENDING",
        },
      });
    });
  },

  async getUserWithdrawals(id_user: number, page: number, limit: number) {
    return penarikanRepository.findByUserId(id_user, page, limit);
  },

  async getPendingWithdrawals(page: number, limit: number) {
    return penarikanRepository.findPending(page, limit);
  },

  async getAllWithdrawals(page: number, limit: number, status?: StatusTransfer) {
    return penarikanRepository.findAll(page, limit, status);
  },

  async approveWithdrawal(id_penarikan: number) {
    const penarikan = await penarikanRepository.findById(id_penarikan);
    if (!penarikan) {
      throw new Error("Penarikan tidak ditemukan");
    }

    if (penarikan.status_transfer !== "PENDING") {
      throw new Error("Penarikan sudah diproses");
    }

    // Just update status to SUKSES (balance already deducted on request)
    return penarikanRepository.updateStatus(id_penarikan, "SUKSES");
  },

  async rejectWithdrawal(id_penarikan: number) {
    const penarikan = await penarikanRepository.findById(id_penarikan);
    if (!penarikan) {
      throw new Error("Penarikan tidak ditemukan");
    }

    if (penarikan.status_transfer !== "PENDING") {
      throw new Error("Penarikan sudah diproses");
    }

    // Reject and Refund balance using transaction
    return prisma.$transaction(async (tx) => {
      // 1. Update status to GAGAL
      const failed = await tx.penarikanDana.update({
        where: { id_penarikan },
        data: { status_transfer: "GAGAL" },
      });

      // 2. Refund balance to user
      await tx.dompet.update({
        where: { id_user: penarikan.id_user },
        data: { saldo_terkini: { increment: penarikan.nominal } },
      });

      return failed;
    });
  },
};

export default penarikanService;
