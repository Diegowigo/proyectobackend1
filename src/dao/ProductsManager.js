import fs from "fs";
import path from "path";

const productsPath = path.resolve("src/data/products.json");

class ProductsManager {
  static async getProducts() {
    if (fs.existsSync(productsPath)) {
      const products = JSON.parse(
        await fs.promises.readFile(productsPath, "utf-8")
      );
      return products;
    } else {
      return [];
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
        console.log(`The product with code ${code} is already registered`);
        return null;
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

      console.log(`Product added with id: ${id}`);
      return newProduct;
    } catch (error) {
      console.error("Error adding the product:", error);
      throw new Error("Error adding the product");
    }
  }

  static async updateProduct(id, updatedFields = {}) {
    try {
      const products = await this.getProducts();

      const productId = Number(id);

      const index = products.findIndex((p) => p.id === productId);

      if (index === -1) {
        console.log(`Product with id ${productId} not found.`);
        return null;
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
      console.error("Error updating product:", error.message);
      throw new Error("Error updating product");
    }
  }

  static async deleteProduct(id) {
    try {
      let products = await this.getProducts();

      const productId = Number(id);

      const index = products.findIndex((p) => p.id === productId);

      if (index === -1) {
        console.log(`Product with id ${productId} not found.`);
        return null;
      }

      const deletedProduct = products.splice(index, 1)[0];

      await fs.promises.writeFile(
        productsPath,
        JSON.stringify(products, null, 2)
      );

      console.log(`Product with id ${productId} deleted successfully.`);
      return deletedProduct;
    } catch (error) {
      console.error("Error deleting product:", error.message);
      throw new Error("Error deleting product");
    }
  }
}

export default ProductsManager;
