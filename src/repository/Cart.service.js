import CartsManager from "../dao/CartsManager.js";
import ProductsManager from "../dao/ProductsManager.js";

class CartService {
  async getCartById(cartId) {
    return await CartsManager.getCartById(cartId);
  }

  async addProductToCart(cart, product, quantity) {
    const existingProduct = cart.products.find(
      (item) => item.product.toString() === product._id.toString()
    );

    const totalQuantity = existingProduct
      ? existingProduct.quantity + quantity
      : quantity;
    if (product.stock < totalQuantity) {
      throw new Error(
        "La cantidad total en el carrito excede el stock disponible."
      );
    }

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ product: product._id, quantity });
    }

    product.stock -= quantity;
    await ProductsManager.updateProduct(product._id, { stock: product.stock });

    await cart.save();
    return cart;
  }

  async deleteProductFromCart(cartId, productId) {
    return await CartsManager.removeProductFromCart(cartId, productId);
  }

  async getAllCarts() {
    return await CartsManager.getCarts();
  }

  async clearCart(cartId) {
    return await CartsManager.clearCart(cartId);
  }

  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await CartsManager.getCarts(cartId);
    const productInCart = cart.products.find((p) =>
      p.product.equals(mongoose.Types.ObjectId(productId))
    );

    if (!productInCart) {
      throw new Error("Producto no encontrado en el carrito.");
    }

    productInCart.quantity = quantity;
    await cart.save();

    return cart;
  }

  async updateCart(filtro = {}, cartData) {
    return await CartsManager.updatePurchase(filtro, cartData);
  }

  async createCart() {
    return await CartsManager.createCart();
  }
}

export const cartService = new CartService();
