import { Router } from "express";
import { auth } from "../middleware/auth.js";
import passport from "passport";
import { CartsController } from "../controllers/CartsController.js";

export const router = Router();

router.get("/", CartsController.getCarts);

router.get("/:cid", CartsController.getCartById);

router.post("/", CartsController.createCart);

router.post(
  "/:cid/product/:pid",
  passport.authenticate("current", { session: false }),
  auth(["user"]),
  CartsController.addProductToCart
);

router.put(
  "/:cid",
  passport.authenticate("current", { session: false }),
  auth(["user"]),
  CartsController.updateCartProducts
);

router.put(
  "/:cid/product/:pid",
  passport.authenticate("current", { session: false }),
  auth(["user"]),
  CartsController.updateProductQuantity
);

router.delete(
  "/:cid/product/:pid",
  passport.authenticate("current", { session: false }),
  auth(["user"]),
  CartsController.removeProductFromCart
);

router.delete(
  "/:cid",
  passport.authenticate("current", { session: false }),
  auth(["user"]),
  CartsController.clearCart
);

router.post(
  "/:cid/purchase",
  passport.authenticate("current", { session: false }),
  auth(["user"]),
  CartsController.purchaseCart
);
