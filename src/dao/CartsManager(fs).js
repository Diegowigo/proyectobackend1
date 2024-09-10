import fs from "fs";
import path from "path";

const cartsPath = path.resolve("src/data/carts.json");

class CartsManager {
  static async getCarts() {
    try {
      if (fs.existsSync(cartsPath)) {
        const data = await fs.promises.readFile(cartsPath, "utf-8");
        return JSON.parse(data);
      } else {
        return [];
      }
    } catch (error) {
      throw new Error(`Error reading carts: ${error.message}`);
    }
  }

  static async saveCarts(carts) {
    try {
      await fs.promises.writeFile(cartsPath, JSON.stringify(carts, null, 2));
    } catch (error) {
      throw new Error(`Error saving carts: ${error.message}`);
    }
  }

  static async createCart() {
    try {
      const carts = await this.getCarts();

      let id = 1;
      if (carts.length > 0) {
        id = carts[carts.length - 1].id + 1;
      }

      const newCart = {
        id,
        products: [],
      };

      carts.push(newCart);
      await this.saveCarts(carts);

      return newCart;
    } catch (error) {
      throw new Error(`Error creating cart: ${error.message}`);
    }
  }

  static async getCartProducts(id) {
    try {
      const carts = await this.getCarts();
      const cart = carts.find((c) => c.id === id);

      if (!cart) {
        throw new Error(`Cart with id ${id} not found`);
      }

      return cart.products;
    } catch (error) {
      throw new Error(`Error getting cart products: ${error.message}`);
    }
  }

  static async addProductToCart(cartId, productId) {
    try {
      const carts = await this.getCarts();
      const cart = carts.find((c) => c.id === cartId);

      if (!cart) {
        throw new Error(`Cart with id ${cartId} not found`);
      }

      const productID = Number(productId);
      const existingProduct = cart.products.find(
        (p) => p.product === productID
      );

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({
          product: productID,
          quantity: 1,
        });
      }

      await this.saveCarts(carts);

      return cart;
    } catch (error) {
      throw new Error(`Error adding product to cart: ${error.message}`);
    }
  }
}

export default CartsManager;
