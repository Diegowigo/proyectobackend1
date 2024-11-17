import { UsersManager } from "../dao/UsersManager.js";

class UsersService {
  constructor(dao) {
    this.usersDAO = dao;
  }

  async getBy(query) {
    const user = await this.usersDAO.getBy(query);
    if (!user) {
      throw new Error("User not found");
    }

    return {
      firstName: user.first_name,
      lastName: user.last_name,
      age: user.age,
      email: user.email,
      role: user.role,
    };
  }

  async addUser(user) {
    console.log("pasó x capa servicio...!!!");
    return await this.usersDAO.addUser(user);
  }
}

export const usersService = new UsersService(UsersManager);
