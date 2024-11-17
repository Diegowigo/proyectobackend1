import CartsManager from "../dao/CartsManager.js";

export class CartsController {
  static getCarts = async (req, res) => {
    try {
      const carts = await CartsManager.getCarts();
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(carts);
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      res.status(500).json({ message: "Error fetching carts" });
    }
  };

  static getCartById = async (req, res) => {
    const { cid } = req.params;

    try {
      const products = await CartsManager.getCartById(cid);

      if (!products) {
        return res
          .status(404)
          .json({ message: `Cart with id ${cid} not found` });
      }

      res.setHeader("Content-Type", "application/json");
      res.status(200).json({ products });
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      res.status(500).json({ message: "Error getting cart products" });
    }
  };

  static createCart = async (req, res) => {
    try {
      const newCart = await CartsManager.createCart();
      res.setHeader("Content-Type", "application/json");
      res.status(201).json({ newCart });
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      res.status(500).json({ message: "Error creating cart" });
    }
  };

  static addProductToCart = async (req, res) => {
    const { cid, pid } = req.params;

    try {
      const updatedCart = await CartsManager.addProductToCart(cid, pid);

      if (!updatedCart) {
        return res
          .status(404)
          .json({ message: `Cart with id ${cid} not found` });
      }

      res.setHeader("Content-Type", "application/json");
      res.status(200).json({
        message: `Product with id ${pid} added to cart`,
        cart: updatedCart,
      });
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      res.status(500).json({ message: "Error adding product to cart" });
    }
  };

  static updateCartProducts = async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;

    try {
      const updatedCart = await CartsManager.updateCartProducts(cid, products);

      if (!updatedCart) {
        return res
          .status(404)
          .json({ message: `Cart with id ${cid} not found` });
      }

      res.setHeader("Content-Type", "application/json");
      res.status(200).json({
        message: `Cart with id ${cid} updated`,
        cart: updatedCart,
      });
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      res
        .status(500)
        .json({ message: `Error updating cart products: ${error.message}` });
    }
  };

  static updateProductQuantity = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
      const updatedCart = await CartsManager.updateProductQuantity(
        cid,
        pid,
        quantity
      );

      if (!updatedCart) {
        return res.status(404).json({
          message: `Cart with id ${cid} or product with id ${pid} not found`,
        });
      }

      res.setHeader("Content-Type", "application/json");
      res.status(200).json({
        message: `Product quantity with id ${pid} updated in cart`,
        cart: updatedCart,
      });
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      res.status(500).json({ message: "Error updating product quantity" });
    }
  };

  static removeProductFromCart = async (req, res) => {
    const { cid, pid } = req.params;

    try {
      const updatedCart = await CartsManager.removeProductFromCart(cid, pid);

      if (!updatedCart) {
        return res.status(404).json({
          message: `Cart with id ${cid} or product with id ${pid} not found`,
        });
      }

      res.setHeader("Content-Type", "application/json");
      res.status(200).json({
        message: `Product with id ${pid} removed from cart`,
        cart: updatedCart,
      });
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      res.status(500).json({ message: "Error removing product from cart" });
    }
  };

  static clearCart = async (req, res) => {
    const { cid } = req.params;

    try {
      const updatedCart = await CartsManager.clearCart(cid);

      if (!updatedCart) {
        return res
          .status(404)
          .json({ message: `Cart with id ${cid} not found` });
      }

      res.setHeader("Content-Type", "application/json");
      res.status(200).json({
        message: `All products removed from cart with id ${cid}`,
        cart: updatedCart,
      });
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      res.status(500).json({ message: "Error clearing cart" });
    }
  };
  //  agregar sgtes
}
