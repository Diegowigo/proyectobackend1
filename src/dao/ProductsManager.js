import { productsModel } from "./models/productsModel.js";
import { isValidObjectId } from "mongoose";

class ProductsManager {
  static async getProducts() {
    try {
      return await productsModel.find().lean();
    } catch (error) {
      throw new Error(`Error fetching products: ${error.message}`);
    }
  }

  static async addProduct(product = {}) {
    try {
      const { code } = product;

      const existingProduct = await productsModel.findOne({ code });
      if (existingProduct) {
        throw new Error(`The product with code ${code} is already registered.`);
      }

      const newProduct = new productsModel(product);
      await newProduct.save();
      return newProduct;
    } catch (error) {
      throw new Error(`Error adding the product: ${error.message}`);
    }
  }

  static async updateProduct(id, updatedFields = {}) {
    try {
      if (!isValidObjectId(id)) {
        throw new Error(`Invalid product ID: ${id}`);
      }

      if (updatedFields.code) {
        const codeExists = await productsModel
          .findOne({
            code: updatedFields.code,
            _id: { $ne: id },
          })
          .lean();
        if (codeExists) {
          throw new Error(
            `The product code ${updatedFields.code} is already in use.`
          );
        }
      }

      const updatedProduct = await productsModel
        .findByIdAndUpdate(id, updatedFields, { new: true })
        .lean();

      if (!updatedProduct) {
        throw new Error(`Product with id ${id} not found.`);
      }

      return updatedProduct;
    } catch (error) {
      throw new Error(`Error updating product: ${error.message}`);
    }
  }

  static async deleteProduct(id) {
    try {
      if (!isValidObjectId(id)) {
        throw new Error(`Invalid product ID: ${id}`);
      }

      const deletedProduct = await productsModel.findByIdAndDelete(id).lean();

      if (!deletedProduct) {
        throw new Error(`Product with id ${id} not found.`);
      }

      return deletedProduct;
    } catch (error) {
      throw new Error(`Error deleting product: ${error.message}`);
    }
  }
}

export default ProductsManager;
