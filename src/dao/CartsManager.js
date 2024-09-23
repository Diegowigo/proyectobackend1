import { Carts } from "./models/cartsModel.js";
import { isValidObjectId } from "mongoose";

class CartsManager {
  static async getCarts() {
    try {
      return await Carts.find().lean();
    } catch (error) {
      throw new Error(`Error fetching carts: ${error.message}`);
    }
  }

  static async createCart() {
    try {
      const newCart = new Carts({ products: [] });
      await newCart.save();
      return newCart;
    } catch (error) {
      throw new Error(`Error creating cart: ${error.message}`);
    }
  }

  static async getCartById(cartId) {
    try {
      if (!isValidObjectId(cartId)) {
        throw new Error(`Invalid cart ID: ${cartId}`);
      }

      const cart = await Carts.findById(cartId)
        .populate({
          path: "products.product",
          select: "title description code price status stock category",
        })
        .lean();
      if (!cart) {
        throw new Error(`Cart with id ${cartId} not found`);
      }

      return cart;
    } catch (error) {
      throw new Error(`Error getting cart products: ${error.message}`);
    }
  }

  static async addProductToCart(cartId, productId) {
    try {
      if (!isValidObjectId(cartId) || !isValidObjectId(productId)) {
        throw new Error(`Invalid cart ID or product ID`);
      }

      const cart = await Carts.findById(cartId);
      if (!cart) {
        throw new Error(`Cart with id ${cartId} not found`);
      }

      const existingProduct = cart.products.find((p) =>
        p.product.equals(productId)
      );

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({
          product: productId,
          quantity: 1,
        });
      }

      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(`Error adding product to cart: ${error.message}`);
    }
  }

  static async removeProductFromCart(cartId, productId) {
    try {
      if (!isValidObjectId(cartId) || !isValidObjectId(productId)) {
        throw new Error(`Invalid cart ID or product ID`);
      }

      const cart = await Carts.findById(cartId);
      if (!cart) {
        throw new Error(`Cart with id ${cartId} not found`);
      }

      const findProduct = cart.products.findIndex((p) =>
        p.product.equals(productId)
      );
      if (findProduct === -1) {
        throw new Error(`Product with id ${productId} not found in cart`);
      }

      if (cart.products[findProduct].quantity > 1) {
        cart.products[findProduct].quantity -= 1;
      } else {
        cart.products.splice(findProduct, 1);
      }

      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(`Error removing product from cart: ${error.message}`);
    }
  }

  static async updateCartProducts(cartId, products) {
    try {
      if (!isValidObjectId(cartId)) {
        throw new Error(`Invalid cart ID: ${cartId}`);
      }

      const cart = await Carts.findById(cartId);
      if (!cart) {
        throw new Error(`Cart with id ${cartId} not found`);
      }

      cart.products = products.map((p) => ({
        product: isValidObjectId(p.product) ? p.product : null,
        quantity: p.quantity,
      }));

      if (cart.products.some((p) => p.product === null)) {
        throw new Error("One or more product IDs are invalid");
      }

      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(`Error updating cart products: ${error.message}`);
    }
  }

  static async updateProductQuantity(cartId, productId, quantity) {
    try {
      if (!isValidObjectId(cartId) || !isValidObjectId(productId)) {
        throw new Error(`Invalid cart ID or product ID`);
      }

      const cart = await Carts.findById(cartId);
      if (!cart) {
        throw new Error(`Cart with id ${cartId} not found`);
      }

      const product = cart.products.find((p) => p.product.equals(productId));
      if (!product) {
        throw new Error(`Product with id ${productId} not found in cart`);
      }

      product.quantity = quantity;
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(`Error updating product quantity: ${error.message}`);
    }
  }

  static async clearCart(cartId) {
    try {
      if (!isValidObjectId(cartId)) {
        throw new Error(`Invalid cart ID: ${cartId}`);
      }

      const cart = await Carts.findById(cartId);
      if (!cart) {
        throw new Error(`Cart with id ${cartId} not found`);
      }

      cart.products = [];
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(`Error clearing cart: ${error.message}`);
    }
  }
}

export default CartsManager;
