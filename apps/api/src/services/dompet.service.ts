import dompetRepository from "../repositories/dompet.repository";

export const dompetService = {
  async getBalance(id_user: number) {
    const dompet = await dompetRepository.findOrCreate(id_user);
    return {
      id_dompet: dompet.id_dompet,
      saldo_terkini: Number(dompet.saldo_terkini),
      tgl_update: dompet.tgl_update,
    };
  },

  async addBalance(id_user: number, amount: number) {
    const dompet = await dompetRepository.addSaldo(id_user, amount);
    return {
      id_dompet: dompet.id_dompet,
      saldo_terkini: Number(dompet.saldo_terkini),
      tgl_update: dompet.tgl_update,
    };
  },

  async deductBalance(id_user: number, amount: number) {
    const dompet = await dompetRepository.deductSaldo(id_user, amount);
    return {
      id_dompet: dompet.id_dompet,
      saldo_terkini: Number(dompet.saldo_terkini),
      tgl_update: dompet.tgl_update,
    };
  },
};

export default dompetService;
