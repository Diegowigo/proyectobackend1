import Cart from "./models/cartsModel.js";
import { isValidObjectId } from "mongoose";
import ProductsManager from "./ProductsManager.js";

class CartsManager {
  static async getCarts() {
    try {
      return await Cart.find().lean();
    } catch (error) {
      throw new Error(`Error fetching carts: ${error.message}`);
    }
  }

  static async createCart() {
    try {
      const newCart = new Cart({ products: [] });
      await newCart.save();
      return newCart;
    } catch (error) {
      throw new Error(`Error creating cart: ${error.message}`);
    }
  }

  static async getCartById(cartId) {
    const cart = await Cart.findById(cartId).populate("products.product");
    return cart;
  }

  static async addProductToCart(cartId, productId) {
    try {
      if (!isValidObjectId(cartId) || !isValidObjectId(productId)) {
        throw new Error(`Invalid cart ID or product ID`);
      }

      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error(`Cart with id ${cartId} not found`);
      }

      const product = await ProductsManager.getProductById(productId);
      if (!product) {
        throw new Error(`Product with id ${productId} not found`);
      }

      const existingProduct = cart.products.find((p) =>
        p.product.equals(productId)
      );

      if (existingProduct) {
        if (existingProduct.quantity + 1 > product.stock) {
          throw new Error(`Cannot add more products. Stock limit reached.`);
        }
        existingProduct.quantity += 1;
      } else {
        if (product.stock < 1) {
          throw new Error(`Cannot add product. Stock is unavailable.`);
        }
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

      const cart = await Cart.findById(cartId);
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

      const cart = await Cart.findById(cartId);
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

  static async updatePurchase(filtro = {}, cartData) {
    return await Cart.updateOne(filtro, cartData);
  }

  static async updateProductQuantity(cartId, productId, quantity) {
    try {
      if (!isValidObjectId(cartId) || !isValidObjectId(productId)) {
        throw new Error(`Invalid cart ID or product ID`);
      }

      const cart = await Cart.findById(cartId);
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

      const cart = await Cart.findById(cartId);
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
