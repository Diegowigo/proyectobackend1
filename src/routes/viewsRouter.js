import { Router } from "express";
import ProductsManager from "../dao/ProductsManager.js";
import CartsManager from "../dao/CartsManager.js";

export const router = Router();

router.get("/products", async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let filter = {};
    let sortOrder = {};

    let products = await ProductsManager.getProducts(
      page,
      limit,
      filter,
      sortOrder
    );
    res.status(200).render("index", { products });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ error: "Error fetching products" });
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    let products = await ProductsManager.getProducts();
    res.status(200).render("realtimeproducts", { products: products.docs });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ error: "Error fetching products" });
  }
});

// router.post("/cart/:cid", async (req, res) => {
//   try {
//     const { cartId, productId } = req.params;
//     const cart = await CartsManager.addProductToCart(cartId, productId);
//     res.status(200).render("index", { cart });
//   } catch (error) {
//     console.error("Error adding product to cart:", error.message);
//     res.status(500).json({ error: "Error adding product to cart" });
//   }
// });
