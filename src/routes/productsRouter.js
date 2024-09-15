import { Router } from "express";
import ProductsManager from "../dao/ProductsManager.js";
import { isValidObjectId } from "mongoose";

export const router = Router();

router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const query = req.query.query || "";
    const sort = req.query.sort || "";
    let page = parseInt(req.query.page) || 1;

    let filter = {};
    if (query) {
      filter = { $text: { $search: query } };
    }

    let sortOrder = {};
    if (sort === "asc") {
      sortOrder = { price: 1 };
    } else if (sort === "desc") {
      sortOrder = { price: -1 };
    }

    const result = await ProductsManager.getProducts(
      page,
      limit,
      filter,
      sortOrder
    );

    res.setHeader("Content-Type", "application/json");
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ error: "Error fetching products" });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    if (!isValidObjectId(pid)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }
    const product = await ProductsManager.getProductById(pid);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.setHeader("Content-Type", "application/json");
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
    res.setHeader("Content-Type", "application/json");
    res.status(201).json(addedProduct);
  } catch (error) {
    console.error("Error adding product:", error.message);
    res.status(500).json({ error: "Error adding product" });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    if (!isValidObjectId(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }
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
    if (!pid || !isValidObjectId(pid)) {
      return res.status(400).json({
        error: !pid ? "Product ID is required" : "Invalid product ID",
      });
    }

    const deletedProduct = await ProductsManager.deleteProduct(pid);

    if (!deletedProduct) {
      return res
        .status(404)
        .json({ message: `Product with id ${pid} not found` });
    }

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({
      message: `Product with id ${pid} deleted successfully`,
      product: deletedProduct,
    });
  } catch (error) {
    console.error("Error deleting product:", error.message);
    res.status(500).json({ message: "Error deleting product" });
  }
});
