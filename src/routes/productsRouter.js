import { Router } from "express";
import ProductsManager from "../dao/ProductsManager.js";

export const router = Router();

router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    let products = await ProductsManager.getProducts();
    if (limit && !isNaN(limit)) {
      products = products.slice(0, limit);
    }
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ error: "Error fetching products" });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const products = await ProductsManager.getProducts();
    const product = products.find((p) => p.id === Number(pid));
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error.message);
    res.status(500).json({ error: "Error fetching product" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newProduct = req.body;
    if (
      !newProduct.title ||
      !newProduct.description ||
      !newProduct.code ||
      !newProduct.price ||
      !newProduct.stock ||
      !newProduct.category
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const addedProduct = await ProductsManager.addProduct(newProduct);
    res.status(201).json(addedProduct);
  } catch (error) {
    console.error("Error adding product:", error.message);
    res.status(500).json({ error: "Error adding product" });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    const updatedProduct = req.body;

    if (Object.keys(updatedProduct).length === 0) {
      return res.status(400).json({ error: "No entry in fields" });
    }

    const product = await ProductsManager.updateProduct(
      productId,
      updatedProduct
    );

    if (!product) {
      return res
        .status(404)
        .json({ error: `Product with id ${productId} not found` });
    }

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ product });
  } catch (error) {
    console.error("Error updating product:", error.message);
    res.status(500).json({ error: "Error updating product" });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    if (!pid) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const productId = Number(pid);
    const deletedProduct = await ProductsManager.deleteProduct(productId);

    if (!deletedProduct) {
      return res
        .status(404)
        .json({ message: `Product with id ${productId} not found` });
    }

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({
      message: `Product with id ${productId} deleted successfully`,
      product: deletedProduct,
    });
  } catch (error) {
    console.error("Error deleting product:", error.message);
    res.status(500).json({ message: "Error deleting product" });
  }
});