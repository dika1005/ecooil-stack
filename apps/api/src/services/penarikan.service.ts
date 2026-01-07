import penarikanRepository, { type CreatePenarikanDTO } from "../repositories/penarikan.repository";
import dompetRepository from "../repositories/dompet.repository";
import type { StatusTransfer } from "../../generated/prisma/client";

const penarikanService = {
  async requestWithdrawal(id_user: number, data: CreatePenarikanDTO) {
    // Check balance
    const dompet = await dompetRepository.findByUserId(id_user);
    if (!dompet) {
      throw new Error("Dompet tidak ditemukan");
    }

    const currentSaldo = Number(dompet.saldo_terkini);
    if (currentSaldo < data.nominal) {
      throw new Error("Saldo tidak mencukupi");
    }

    return penarikanRepository.create(id_user, data);
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

    // Deduct from wallet
    await dompetRepository.deductSaldo(penarikan.id_user, Number(penarikan.nominal));

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

    return penarikanRepository.updateStatus(id_penarikan, "GAGAL");
  },
};

export default penarikanService;
