import { usersModel } from "./models/usersModel.js";

export class UsersManager {
  static async getBy(filter = {}) {
    return await usersModel.findOne(filter).lean();
  }

  static async addUser(user = {}) {
    let newUser = await usersModel.create(user);
    return newUser.toJSON();
  }
}
