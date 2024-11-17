import { Router } from "express";
import { auth } from "../middleware/auth.js";
import passport from "passport";
import { ProductsController } from "../controllers/ProductsController.js";

export const router = Router();

router.get("/", ProductsController.getProducts);

router.get("/:pid", ProductsController.getProductById);

router.post(
  "/",
  passport.authenticate("current", { session: false }),
  auth(["admin"]),
  ProductsController.addProduct
);

router.put(
  "/:pid",
  passport.authenticate("current", { session: false }),
  auth(["admin"]),
  ProductsController.updateProduct
);

router.delete(
  "/:pid",
  passport.authenticate("current", { session: false }),
  auth(["admin"]),
  ProductsController.deleteProduct
);
