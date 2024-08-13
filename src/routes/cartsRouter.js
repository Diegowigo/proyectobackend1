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

  const cartId = Number(cid);

  try {
    const products = await CartsManager.getCartProducts(cartId);

    if (products === null) {
      return res
        .status(404)
        .json({ message: `Cart with id ${cartId} not found` });
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

  const cartId = Number(cid);
  const productId = Number(pid);

  try {
    const updatedCart = await CartsManager.addProductToCart(cartId, productId);

    if (updatedCart === null) {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(404)
        .json({ message: `Cart with id ${cartId} not found` });
    }
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({
      message: `Product with id ${productId} added to cart`,
      cart: updatedCart,
    });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({ message: "Error adding product to cart" });
  }
});
