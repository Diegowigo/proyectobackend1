import CartsManager from "../dao/CartsManager.js";
import ProductsManager from "../dao/ProductsManager.js";

export class ViewsController {
  static products = async (req, res) => {
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
  };

  static realtimeproducts = async (req, res) => {
    try {
      let products = await ProductsManager.getProducts();
      res.status(200).render("realtimeproducts", { products: products.docs });
    } catch (error) {
      console.error("Error fetching products:", error.message);
      res.status(500).json({ error: "Error fetching products" });
    }
  };

  static carts = async (req, res) => {
    const { cid } = req.params;

    try {
      const cart = await CartsManager.getCartById(cid);

      if (!cart) {
        return res.status(404).render("error", { message: "Cart not found" });
      }

      res.status(200).render("carts", { cart });
    } catch (error) {
      console.error(error);
      res.status(500).render("error", { message: "Server error" });
    }
  };
}
