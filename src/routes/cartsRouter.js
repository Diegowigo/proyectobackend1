import { Router } from "express";
import CartsManager from "../dao/CartsManager.js";

export const router = Router();

router.post("/", async (req, res) => {
  try {
    const newCart = await CartsManager.createCart();
    res.setHeader("Content-Type", "application/json");
    res.status(201).json({ newCart });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({ message: "Error creating cart" });
  }
});

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;

  try {
    const products = await CartsManager.getCartProducts(cid);

    if (!products) {
      return res.status(404).json({ message: `Cart with id ${cid} not found` });
    }

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ products });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({ message: "Error getting cart products" });
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const updatedCart = await CartsManager.addProductToCart(cid, pid);

    if (!updatedCart) {
      return res.status(404).json({ message: `Cart with id ${cid} not found` });
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
});

router.delete("/:cid/products/:pid", async (req, res) => {
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
});

router.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;

  try {
    const updatedCart = await CartsManager.updateCartProducts(cid, products);

    if (!updatedCart) {
      return res.status(404).json({ message: `Cart with id ${cid} not found` });
    }

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({
      message: `Cart with id ${cid} updated`,
      cart: updatedCart,
    });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({ message: "Error updating cart products" });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
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
});

router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;

  try {
    const updatedCart = await CartsManager.clearCart(cid);

    if (!updatedCart) {
      return res.status(404).json({ message: `Cart with id ${cid} not found` });
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
});
