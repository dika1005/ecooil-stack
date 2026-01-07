import prisma from "../lib/prisma";

export const dompetRepository = {
  async findByUserId(id_user: number) {
    return prisma.dompet.findUnique({
      where: { id_user },
    });
  },

  async create(id_user: number) {
    return prisma.dompet.create({
      data: {
        id_user,
        saldo_terkini: 0,
      },
    });
  },

  async findOrCreate(id_user: number) {
    let dompet = await this.findByUserId(id_user);
    if (!dompet) {
      dompet = await this.create(id_user);
    }
    return dompet;
  },

  async addSaldo(id_user: number, amount: number) {
    const dompet = await this.findOrCreate(id_user);
    const newSaldo = Number(dompet.saldo_terkini) + amount;

    return prisma.dompet.update({
      where: { id_user },
      data: { saldo_terkini: newSaldo },
    });
  },

  async deductSaldo(id_user: number, amount: number) {
    const dompet = await this.findByUserId(id_user);
    if (!dompet) throw new Error("Dompet tidak ditemukan");

    const currentSaldo = Number(dompet.saldo_terkini);
    if (currentSaldo < amount) {
      throw new Error("Saldo tidak mencukupi");
    }

    return prisma.dompet.update({
      where: { id_user },
      data: { saldo_terkini: currentSaldo - amount },
    });
  },

  async getSaldo(id_user: number): Promise<number> {
    const dompet = await this.findOrCreate(id_user);
    return Number(dompet.saldo_terkini);
  },
};

export default dompetRepository;
