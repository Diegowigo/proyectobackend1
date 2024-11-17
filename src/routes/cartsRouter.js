import { Router } from "express";
import { auth } from "../middleware/auth.js";
import passport from "passport";
import { CartsController } from "../controllers/CartsController.js";

export const router = Router();

router.get("/", CartsController.getCarts);

router.get("/:cid", CartsController.getCartById);

router.post("/", CartsController.createCart);

router.post(
  "/:cid/products/:pid",
  passport.authenticate("current", { session: false }),
  auth(["user"]),
  CartsController.addProductToCart
);

router.put("/:cid", CartsController.updateCartProducts);

router.put("/:cid/products/:pid", CartsController.updateProductQuantity);

router.delete("/:cid/products/:pid", CartsController.removeProductFromCart);

router.delete("/:cid", CartsController.clearCart);

router.post(
  "/:cid/purchase",
  passport.authenticate("current", { session: false }),
  auth(["user"]),
  CartsController.purchaseCart
);
