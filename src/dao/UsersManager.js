import { Carts } from "./models/cartsModel.js";
import { usersModel } from "./models/usersModel.js";

export class UsersManager {
  static async getBy(filter = {}) {
    return await usersModel.findOne(filter).lean();
  }

  static async getAll(filter = {}) {
    return await usersModel.find(filter).lean();
  }

  static addUser = async (userData) => {
    try {
      const newCart = await Carts.create({ products: [] });

      const userWithCart = {
        ...userData,
        cartId: newCart._id,
      };

      const newUser = await usersModel.create(userWithCart);

      return newUser.toJSON();
    } catch (error) {
      console.error("Error creando usuario con carrito:", error);
      throw error;
    }
  };

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
