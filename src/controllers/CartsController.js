import { isValidObjectId } from "mongoose";
import CartsManager from "../dao/CartsManager.js";
import { processErrors } from "../utils.js";
import { ticketModel } from "../dao/models/ticketModel.js";
import { cartService } from "../repository/Cart.service.js";
import { productService } from "../repository/Products.service.js";
import { v4 as uuidv4 } from "uuid";

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
      const newCart = await cartService.createCart();
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

  static async purchaseCart(req, res) {
    const { cid } = req.params;

    if (!isValidObjectId(cid)) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ error: `No existe cart con id ${cid}` });
    }

    if (req.user.cart != cid) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({
        error: `El cart que quiere comprar no pertenece al usuario autenticado`,
      });
    }

    try {
      const cart = await cartService.getCartById({ _id: cid });

      if (!cart) {
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({ error: `No existe cart` });
      }

      const conStock = [];
      const sinStock = [];
      let error = false;

      if (!cart.products || cart.products.length === 0) {
        return res.status(400).json({ error: "El cart está vacío" });
      }

      for (let i = 0; i < cart.products.length; i++) {
        const codigo = cart.products[i].product._id || cart.products[i].product;
        const producto = await productService.getProductBy({ _id: codigo });
        const cantidad = cart.products[i].quantity;
        if (!producto) {
          error = true;
          sinStock.push({
            product: codigo,
            quantity: cantidad,
          });
        } else {
          if (producto.stock >= cantidad) {
            conStock.push({
              codigo,
              cantidad,
              precio: producto.price,
              descrip: producto.description,
              subtotal: producto.price * cantidad,
            });
            producto.stock -= cantidad;
            await productService.updateProduct(codigo, producto);
          } else {
            error = true;
            sinStock.push({
              product: codigo,
              quantity: cantidad,
            });
          }
        }
      }

      if (conStock.length == 0) {
        res.setHeader("Content-Type", "application/json");
        return res
          .status(400)
          .json({ error: `No existe la cantidad de stock comprado` });
      }

      let code = uuidv4();
      let purchase_datetime = new Date();
      const amount = conStock.reduce((acum, item) => acum + item.subtotal, 0);
      let purchaser = req.user.email;

      let ticket = await ticketModel.create({
        code,
        purchase_datetime,
        amount,
        purchaser,
        detalle: conStock,
      });
      cart.products = sinStock;
      await cartService.updateCart({ _id: cid }, cart);

      if (error) {
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({
          ticket,
          alerta:
            "Atención: algún item no pudo ser procesado por falta de inventario, consulte al administrador",
        });
      } else {
      }

      res.setHeader("Content-Type", "application/json");
      return res.status(200).json({ ticket });
    } catch (error) {
      processErrors(res, error);
    }
  }
}
