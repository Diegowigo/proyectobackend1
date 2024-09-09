import { Router } from "express";
import ProductsManager from "../dao/ProductsManager.js";

export const router = Router();

router.get("/products", async (req, res) => {
  try {
    let products = await ProductsManager.getProducts();
    res.setHeader("Content-Type", "text/html");
    res.status(200).render("index", { products });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ error: "Error fetching products" });
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    let products = await ProductsManager.getProducts();
    res.setHeader("Content-Type", "text/html");
    res.status(200).render("realtimeproducts", { products });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ error: "Error fetching products" });
  }
});

// router.put("/realtimeproducts", (req, res) => {
//   res.setHeader("Content-Type", "text/html");
//   res.status(200).json({});
// });
