import userRepository, { type RegisterDTO } from "../repositories/user.repository";
import dompetRepository from "../repositories/dompet.repository";
import type { Peran } from "../../generated/prisma/client";

// Token payload type
export interface TokenPayload {
  id_user: number;
  peran: Peran;
}

const authService = {
  async register(data: RegisterDTO) {
    // Check if user already exists
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error("Email sudah terdaftar");
    }

    // Hash password
    const hashedPassword = await Bun.password.hash(data.password, {
      algorithm: "bcrypt",
      cost: 10,
    });

    // Create user
    const user = await userRepository.create({
      ...data,
      password: hashedPassword,
    });

    // Create dompet for USER role
    if (user.peran === "USER") {
      await dompetRepository.create(user.id_user);
    }

    return user;
  },

  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Email atau password salah");
    }

    // Verify password
    const isValid = await Bun.password.verify(password, user.password);
    if (!isValid) {
      throw new Error("Email atau password salah");
    }

    // Create token payload
    const tokenPayload: TokenPayload = {
      id_user: user.id_user,
      peran: user.peran,
    };

    // Return user data (without password) and token payload
    return {
      user: {
        id_user: user.id_user,
        email: user.email,
        nama_lengkap: user.nama_lengkap,
        peran: user.peran,
      },
      tokenPayload,
    };
  },

  async getCurrentUser(id_user: number) {
    const user = await userRepository.findById(id_user);
    if (!user) {
      throw new Error("User tidak ditemukan");
    }

    // Get wallet balance for USER role
    let saldo = null;
    if (user.peran === "USER") {
      const dompet = await dompetRepository.findByUserId(id_user);
      saldo = dompet ? Number(dompet.saldo_terkini) : 0;
    }

    return {
      ...user,
      saldo,
    };
  },
};

export default authService;
