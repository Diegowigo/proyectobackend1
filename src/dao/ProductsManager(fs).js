import fs from "fs";
import path from "path";

const productsPath = path.resolve("src/data/products.json");

class ProductsManager {
  static async getProducts() {
    try {
      if (fs.existsSync(productsPath)) {
        const products = JSON.parse(
          await fs.promises.readFile(productsPath, "utf-8")
        );
        return products;
      } else {
        return [];
      }
    } catch (error) {
      throw new Error(`Error reading products: ${error.message}`);
    }
  }

  static async addProduct(product = {}) {
    try {
      const products = await this.getProducts();

      let id = 1;
      if (products.length > 0) {
        id = products[products.length - 1].id + 1;
      }

      const { code } = product;

      const existCode = products.find((p) => p.code === code);
      if (existCode) {
        const errorMessage = `The product with code ${code} is already registered.`;
        throw new Error(errorMessage);
      }

      const newProduct = {
        id,
        ...product,
      };

      products.push(newProduct);

      await fs.promises.writeFile(
        productsPath,
        JSON.stringify(products, null, 2)
      );
      return newProduct;
    } catch (error) {
      throw new Error(`Error adding the product: ${error.message}`);
    }
  }

  static async updateProduct(id, updatedFields = {}) {
    try {
      const products = await this.getProducts();

      const productId = Number(id);

      const index = products.findIndex((p) => p.id === productId);

      if (index === -1) {
        const errorMessage = `Product with id ${productId} not found.`;
        throw new Error(errorMessage);
      }

      if (updatedFields.code) {
        const codeExists = products.some(
          (p) => p.code === updatedFields.code && p.id !== productId
        );
        if (codeExists) {
          const errorMessage = `The product code ${updatedFields.code} is already in use.`;
          throw new Error(errorMessage);
        }
      }

      products[index] = {
        ...products[index],
        ...updatedFields,
      };

      await fs.promises.writeFile(
        productsPath,
        JSON.stringify(products, null, 2)
      );

      return products[index];
    } catch (error) {
      throw new Error(`Error updating product: ${error.message}`);
    }
  }

  static async deleteProduct(id) {
    try {
      const products = await this.getProducts();

      const productId = Number(id);

      const index = products.findIndex((p) => p.id === productId);

      if (index === -1) {
        const errorMessage = `Product with id ${productId} not found.`;
        throw new Error(errorMessage);
      }

      const deletedProduct = products.splice(index, 1)[0];

      await fs.promises.writeFile(
        productsPath,
        JSON.stringify(products, null, 2)
      );

      return deletedProduct;
    } catch (error) {
      throw new Error(`Error deleting product: ${error.message}`);
    }
  }
}

export default ProductsManager;
