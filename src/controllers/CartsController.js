import { isValidObjectId } from "mongoose";
import CartsManager from "../dao/CartsManager.js";
import ProductsManager from "../dao/ProductsManager.js";
import { processErrors } from "../utils.js";
import { ticketModel } from "../dao/models/ticketModel.js";

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

  static purchaseCart = async (req, res) => {
    let { cid } = req.params;

    if (!isValidObjectId(cid)) {
      return res.status(400).json({ error: `No existe carrito con id ${cid}` });
    }

    console.log(`Carrito del usuario autenticado: ${req.user.cart}`);
    console.log(`Carrito proporcionado en la URL: ${cid}`);

    if (req.user.cart != cid) {
      return res.status(400).json({
        error: `El cart que quiere comprar no pertenece al usuario autenticado`,
      });
    }

    try {
      let cart = await CartsManager.getCartById({ _id: cid });
      if (!cart) {
        return res.status(400).json({ error: `No existe carrito` });
      }

      const withStock = [];
      const withoutStock = [];
      let error = false;

      for (let i = 0; i < cart.products.length; i++) {
        let { _id: code, quantity } = cart.products[i].product;
        let product = await ProductsManager.getProductById({ _id: code });

        if (!product) {
          error = true;
          withoutStock.push({ product: code, quantity });
        } else {
          if (product.stock >= quantity) {
            withStock.push({
              code,
              quantity,
              precio: product.price,
              descrip: product.title,
              subtotal: product.price * quantity,
            });
            product.stock -= quantity;
            await ProductsManager.updateProduct(code, product);
          } else {
            error = true;
            withoutStock.push({ product: code, quantity });
          }
        }
      }

      if (withStock.length === 0) {
        return res.status(400).json({
          error: `No existen ítems en condiciones de ser facturados`,
        });
      }

      let nroComp = Date.now();
      let fecha = new Date();
      let total = withStock.reduce(
        (acum, item) => (acum += item.quantity * item.precio),
        0
      );
      let email_comprador = req.user.email;

      let ticket = await ticketModel.create({
        nroComp,
        fecha,
        total,
        email_comprador,
        detalle: withStock,
      });

      cart.products = withoutStock;
      await CartsManager.updateCartProducts({ _id: cid }, cart);

      const statusCode = error ? 200 : 201;
      return res.status(statusCode).json({
        ticket,
        alerta: error
          ? `Atención: algún ítem no pudo ser procesado por falta de inventario. Consulte al administrador`
          : undefined,
      });
    } catch (error) {
      processErrors(res, error);
    }
  };
}
