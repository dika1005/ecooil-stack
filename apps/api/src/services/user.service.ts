import userRepository, { type UpdateUserDTO } from "../repositories/user.repository";
import type { Peran } from "../../generated/prisma/client";

const userService = {
  async getProfile(id_user: number) {
    const user = await userRepository.findById(id_user);
    if (!user) {
      throw new Error("User tidak ditemukan");
    }
    return user;
  },

  async updateProfile(id_user: number, data: UpdateUserDTO) {
    return userRepository.update(id_user, data);
  },

  async listUsers(page: number, limit: number, peran?: Peran) {
    return userRepository.findAll(page, limit, peran);
  },

  async getUserById(id_user: number) {
    return userRepository.findById(id_user);
  },
};

export default userService;
