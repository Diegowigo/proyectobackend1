import { generateHash } from "../utils.js";
import { usersModel } from "./models/usersModel.js";

export class UsersManager {
  static async getBy(filter = {}) {
    return await usersModel.findOne(filter).lean();
  }

  static async getAll(filter = {}) {
    return await usersModel.find(filter).lean();
  }

  static addUser = async (userData) => {
    const newUser = await usersModel.create(userData);
    return newUser.toJSON();
  };

  static async createAdmin() {
    const adminExists = await usersModel
      .findOne({ email: "adminCoder@coder.com" })
      .lean();
    if (!adminExists) {
      const admin = {
        first_name: "admin",
        email: "adminCoder@coder.com",
        password: generateHash("adminCod3r123"),
        role: "admin",
      };
      await usersModel.create(admin);
      return true;
    }
    return false;
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
