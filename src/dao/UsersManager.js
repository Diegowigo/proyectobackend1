import { usersModel } from "./models/usersModel.js";

export class UsersManager {
  static async getBy(filter = {}) {
    return await usersModel.findOne(filter).lean();
  }

  static async getAll(filter = {}) {
    return await usersModel.find(filter).lean();
  }

  static async addUser(user = {}) {
    let newUser = await usersModel.create(user);
    return newUser.toJSON();
  }
  static async updateUser(id, updatedData = {}) {
    return await usersModel.findByIdAndUpdate(id, updatedData, {
      new: true,
      lean: true,
    });
  }

  static async deleteUser(id) {
    return await usersModel.findByIdAndDelete(id);
  }
}
