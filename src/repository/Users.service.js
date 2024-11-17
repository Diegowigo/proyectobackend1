import { UsersManager } from "../dao/UsersManager.js";

class UsersService {
  constructor(dao) {
    this.usersDAO = dao;
  }

  async getBy(query) {
    const user = await this.usersDAO.getBy(query);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    return {
      firstName: user.first_name,
      lastName: user.last_name,
      age: user.age,
      email: user.email,
      role: user.role,
    };
  }
}

export const usersService = new UsersService(UsersManager);
