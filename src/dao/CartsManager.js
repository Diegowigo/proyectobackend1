import fs from "fs";
import path from "path";

const cartsPath = path.resolve("src/data/carts.json");

class CartsManager {
  static async getCarts() {
    if (fs.existsSync(cartsPath)) {
      const data = await fs.promises.readFile(cartsPath, "utf-8");
      return JSON.parse(data);
    } else {
      return [];
    }
  }

  static async saveCarts(carts) {
    await fs.promises.writeFile(cartsPath, JSON.stringify(carts, null, 2));
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

      console.log(`Cart created with id: ${id}`);
      return newCart;
    } catch (error) {
      throw new Error("Error creating cart");
    }
  }

  static async getCartProducts(id) {
    try {
      const carts = await this.getCarts();
      const cart = carts.find((c) => c.id === id);

      if (!cart) {
        return null;
      }

      return cart.products;
    } catch (error) {
      console.error("Error getting cart products:", error.message);
      throw new Error("Error getting cart products");
    }
  }

  static async addProductToCart(cartId, productId) {
    try {
      const carts = await this.getCarts();
      const cart = carts.find((c) => c.id === cartId);

      if (!cart) {
        console.error(`Cart with id ${cartId} not found`);
        return null;
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

      console.log(
        `Product with id ${productID} added to cart with id ${cartId}`
      );
      return cart;
    } catch (error) {
      console.error("Error adding product to cart:", error.message);
      throw new Error("Error adding product to cart");
    }
  }
}

export default CartsManager;
